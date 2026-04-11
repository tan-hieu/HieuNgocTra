package com.fpoly.backend.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.fpoly.backend.dao.CategoryDao;
import com.fpoly.backend.dao.ProductDao;
import com.fpoly.backend.dao.ProductImageDao;
import com.fpoly.backend.entity.Category;
import com.fpoly.backend.entity.Product;
import com.fpoly.backend.entity.ProductImage;

@Service
public class ProductService {

    private final ProductDao productDao;
    private final CategoryDao categoryDao;
    private final ProductImageDao productImageDao;
    private final Cloudinary cloudinary;
    private final String uploadBaseDir;

    public ProductService(ProductDao productDao,
                          CategoryDao categoryDao,
                          ProductImageDao productImageDao,
                          Cloudinary cloudinary,
                          @Value("${app.upload.dir:${user.dir}/uploads}") String uploadBaseDir) {
        this.productDao = productDao;
        this.categoryDao = categoryDao;
        this.productImageDao = productImageDao;
        this.cloudinary = cloudinary;
        this.uploadBaseDir = uploadBaseDir;
    }

    @Transactional
    public Product createProduct(
            String categoryName,
            String productName,
            String origin,
            String weight,
            BigDecimal price,
            Integer stockQuantity,
            String shortDescription,
            String description,
            String flavorNotes,
            String brewingGuide,
            MultipartFile mainImage,
            List<MultipartFile> extraImages) throws IOException {

        validateBasic(productName, price);
        Category category = resolveCategory(categoryName);

        if (productDao.existsByNameIgnoreCase(productName)) {
            throw new IllegalArgumentException("Tên sản phẩm đã tồn tại");
        }

        String productCode = generateUniqueProductCode();
        String baseSlug = toSlug(productName);
        String slug = baseSlug;
        int suffix = 1;
        while (productDao.existsBySlug(slug)) {
            slug = baseSlug + "-" + suffix++;
        }

        Product product = new Product();
        product.setCategory(category);
        product.setProductCode(productCode);
        product.setName(productName);
        product.setSlug(slug);
        product.setOrigin(origin);
        product.setWeight(weight);
        product.setPrice(price);
        product.setStockQuantity(stockQuantity != null ? stockQuantity : 0);
        product.setShortDescription(shortDescription);
        product.setDescription(description);
        product.setFlavorNotes(flavorNotes);
        product.setBrewingGuide(brewingGuide);
        product.setStatus("ACTIVE");

        if (product.getCreatedAt() == null) {
            LocalDateTime now = LocalDateTime.now();
            product.setCreatedAt(now);
            product.setUpdatedAt(now);
        }

        if (mainImage != null && !mainImage.isEmpty()) {
            String mainImageUrl = uploadImageWithFallback(
                    mainImage,
                    "hieungoc_tra/products/main",
                    "products/main"
            );
            product.setMainImageUrl(mainImageUrl);
        }

        product = productDao.save(product);

        recreateImageSet(product, product.getMainImageUrl(), extraImages);

        return product;
    }

    @Transactional
    public Product updateProduct(
            Long id,
            String categoryName,
            String productName,
            String origin,
            String weight,
            BigDecimal price,
            Integer stockQuantity,
            String shortDescription,
            String description,
            String flavorNotes,
            String brewingGuide,
            MultipartFile mainImage,
            List<MultipartFile> extraImages) throws IOException {

        Product product = productDao.findById(id);
        if (product == null) {
            throw new IllegalArgumentException("Không tìm thấy sản phẩm với id: " + id);
        }

        validateBasic(productName, price);
        Category category = resolveCategory(categoryName);

        if (!product.getName().equalsIgnoreCase(productName)
                && productDao.existsByNameIgnoreCase(productName)) {
            throw new IllegalArgumentException("Tên sản phẩm đã tồn tại");
        }

        String baseSlug = toSlug(productName);
        String slug = baseSlug;
        int suffix = 1;
        while (productDao.existsBySlug(slug) && !slug.equals(product.getSlug())) {
            slug = baseSlug + "-" + suffix++;
        }

        product.setCategory(category);
        product.setName(productName);
        product.setSlug(slug);
        product.setOrigin(origin);
        product.setWeight(weight);
        product.setPrice(price);
        product.setStockQuantity(stockQuantity != null ? stockQuantity : 0);
        product.setShortDescription(shortDescription);
        product.setDescription(description);
        product.setFlavorNotes(flavorNotes);
        product.setBrewingGuide(brewingGuide);

        if (mainImage != null && !mainImage.isEmpty()) {
            String mainImageUrl = uploadImageWithFallback(
                    mainImage,
                    "hieungoc_tra/products/main",
                    "products/main"
            );
            product.setMainImageUrl(mainImageUrl);
        }

        product = productDao.save(product);

        boolean hasMainUpload = mainImage != null && !mainImage.isEmpty();
        boolean hasExtraUpload = hasAnyFile(extraImages);

        if (hasMainUpload || hasExtraUpload) {
            recreateImageSet(product, product.getMainImageUrl(), extraImages);
        }

        return product;
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productDao.findById(id);
        if (product == null) {
            throw new IllegalArgumentException("Không tìm thấy sản phẩm với id: " + id);
        }
        productDao.delete(product);
    }

    @Transactional(readOnly = true)
    public List<ProductListItem> getAllProducts() {
        return productDao.findAllOrderByCreatedAtDesc()
                .stream()
                .map(p -> new ProductListItem(
                        p.getId(),
                        p.getProductCode(),
                        p.getName(),
                        p.getCategory() != null ? p.getCategory().getName() : null,
                        p.getOrigin(),
                        p.getWeight(),
                        p.getPrice(),
                        p.getStockQuantity(),
                        p.getStatus(),
                        p.getMainImageUrl(),
                        p.getShortDescription()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductDetailItem getProductDetail(Long id) {
        Product p = productDao.findById(id);
        if (p == null) {
            throw new IllegalArgumentException("Không tìm thấy sản phẩm với id: " + id);
        }

        List<String> extraUrls = productImageDao.findByProductIdOrderBySortOrderAsc(id).stream()
                .filter(img -> !img.isMain())
                .map(ProductImage::getImageUrl)
                .toList();

        String[] descriptionParts = splitByParagraphs(p.getDescription(), 3);
        String[] flavorParts = splitByParagraphs(p.getFlavorNotes(), 3);

        return new ProductDetailItem(
                p.getId(),
                p.getProductCode(),
                p.getName(),
                p.getCategory() != null ? p.getCategory().getName() : "",
                p.getOrigin(),
                p.getWeight(),
                p.getPrice(),
                p.getStockQuantity(),
                p.getStatus(),
                p.getShortDescription(), // shortDescription
                p.getShortDescription(), // shortDesc
                descriptionParts[0],     // story
                flavorParts[0],          // taste
                p.getBrewingGuide(),     // brewing
                descriptionParts[2],     // storage
                descriptionParts[1],     // visual
                flavorParts[1],          // aroma
                flavorParts[2],          // tasteProfile
                p.getMainImageUrl(),
                extraUrls,
                p.getDescription(),
                p.getFlavorNotes()
        );
    }

    private void validateBasic(String productName, BigDecimal price) {
        if (productName == null || productName.isBlank()) {
            throw new IllegalArgumentException("Tên sản phẩm không được để trống");
        }
        if (price == null || price.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Giá sản phẩm không hợp lệ");
        }
    }

    private boolean hasAnyFile(List<MultipartFile> files) {
        if (files == null) return false;
        return files.stream().anyMatch(f -> f != null && !f.isEmpty());
    }

    private void recreateImageSet(Product product, String mainImageUrl, List<MultipartFile> extraImages) throws IOException {
        productImageDao.deleteByProductId(product.getId());

        int sortOrder = 0;

        if (mainImageUrl != null && !mainImageUrl.isBlank()) {
            ProductImage mainImg = new ProductImage();
            mainImg.setProduct(product);
            mainImg.setImageUrl(mainImageUrl);
            mainImg.setMain(true);
            mainImg.setSortOrder(sortOrder++);
            productImageDao.save(mainImg);
        }

        if (extraImages != null) {
            for (MultipartFile file : extraImages) {
                if (file == null || file.isEmpty()) continue;

                String url = uploadImageWithFallback(
                        file,
                        "hieungoc_tra/products/extra",
                        "products/extra"
                );

                ProductImage pi = new ProductImage();
                pi.setProduct(product);
                pi.setImageUrl(url);
                pi.setMain(false);
                pi.setSortOrder(sortOrder++);
                productImageDao.save(pi);
            }
        }
    }

    private String[] splitByParagraphs(String text, int length) {
        String[] result = new String[length];
        for (int i = 0; i < length; i++) result[i] = "";

        if (text == null || text.isBlank()) {
            return result;
        }

        String normalized = text
                .replace("\r\n", "\n")
                .replace("\r", "\n")
                .trim();

        String[] raw = normalized.split("\\n\\s*\\n");
        List<String> clean = new ArrayList<>();
        for (String s : raw) {
            if (s != null && !s.isBlank()) clean.add(s.trim());
        }

        for (int i = 0; i < clean.size() && i < length; i++) {
            result[i] = clean.get(i);
        }
        return result;
    }

    private String uploadToCloudinary(MultipartFile file, String folder) throws IOException {
        @SuppressWarnings("rawtypes")
        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                Map.of("folder", folder)
        );
        Object url = uploadResult.get("secure_url");
        if (url == null) {
            url = uploadResult.get("url");
        }
        if (url == null) {
            throw new IOException("Không lấy được URL ảnh từ Cloudinary");
        }
        return url.toString();
    }

    private String uploadImageWithFallback(MultipartFile file, String cloudFolder, String localFolder) throws IOException {
        try {
            return uploadToCloudinary(file, cloudFolder);
        } catch (RuntimeException | IOException ex) {
            System.err.println("[Cloudinary] Upload failed, fallback to local: " + ex.getMessage());
            return uploadToLocal(file, localFolder);
        }
    }

    private String uploadToLocal(MultipartFile file, String localFolder) throws IOException {
        String original = file.getOriginalFilename();
        String ext = "";
        if (original != null) {
            int lastDot = original.lastIndexOf('.');
            if (lastDot >= 0) {
                ext = original.substring(lastDot).toLowerCase();
            }
        }

        String fileName = UUID.randomUUID().toString().replace("-", "") + ext;
        Path dir = Paths.get(uploadBaseDir, localFolder);
        Files.createDirectories(dir);

        Path target = dir.resolve(fileName);
        file.transferTo(target.toFile());

        return "http://localhost:8080/uploads/"
                + localFolder.replace("\\", "/")
                + "/"
                + fileName;
    }

    private String generateUniqueProductCode() {
        String code;
        do {
            String random = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
            code = "TRA-" + random;
        } while (productDao.existsByProductCode(code));
        return code;
    }

    private Category resolveCategory(String categoryName) {
        if (categoryName == null || categoryName.isBlank()) {
            throw new IllegalArgumentException("Danh mục không được để trống");
        }

        String trimmed = categoryName.trim();
        Category exactMatch = categoryDao.findByNameIgnoreCase(trimmed);
        if (exactMatch != null) {
            return exactMatch;
        }

        String expectedSlug = toSlug(trimmed);
        return categoryDao.findAll().stream()
                .filter(c -> c.getName() != null && expectedSlug.equals(toSlug(c.getName())))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Danh mục không tồn tại: " + categoryName));
    }

    private String toSlug(String input) {
        if (input == null) return "";
        String normalized = Normalizer.normalize(input.trim(), Normalizer.Form.NFD);
        String slug = normalized.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");

        slug = slug.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-+", "")
                .replaceAll("-+$", "");

        return slug;
    }

    public record ProductListItem(
            Long id,
            String productCode,
            String name,
            String categoryName,
            String origin,
            String weight,
            BigDecimal price,
            Integer stockQuantity,
            String status,
            String mainImageUrl,
            String shortDescription
    ) {
    }

    public record ProductDetailItem(
            Long id,
            String productCode,
            String productName,
            String category,
            String origin,
            String weight,
            BigDecimal price,
            Integer stock,
            String status,
            String shortDescription,
            String shortDesc,
            String story,
            String taste,
            String brewing,
            String storage,
            String visual,
            String aroma,
            String tasteProfile,
            String mainImageUrl,
            List<String> extraImageUrls,
            String rawDescription,
            String rawFlavorNotes
    ) {
    }
}