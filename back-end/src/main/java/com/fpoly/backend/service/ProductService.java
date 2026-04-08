package com.fpoly.backend.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.Normalizer;
import java.time.LocalDateTime;
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

        if (productName == null || productName.isBlank()) {
            throw new IllegalArgumentException("Tên sản phẩm không được để trống");
        }
        if (price == null || price.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Giá sản phẩm không hợp lệ");
        }

        // 1) Tìm category theo tên (khớp với FE: "Trà Shan Tuyết", "Trà Ô Long", ...)
        Category category = resolveCategory(categoryName);

        // 2) Kiểm tra trùng tên sản phẩm
        if (productDao.existsByNameIgnoreCase(productName)) {
            throw new IllegalArgumentException("Tên sản phẩm đã tồn tại");
        }

        // 3) Sinh product_code duy nhất
        String productCode = generateUniqueProductCode();

        // 4) Sinh slug duy nhất
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

        // createdAt / updatedAt sẽ set trong @PrePersist, nhưng đảm bảo không null
        if (product.getCreatedAt() == null) {
            LocalDateTime now = LocalDateTime.now();
            product.setCreatedAt(now);
            product.setUpdatedAt(now);
        }

        // 5) Upload ảnh chính nếu có
        String mainImageUrl = null;
        if (mainImage != null && !mainImage.isEmpty()) {
            try {
                mainImageUrl = uploadImageWithFallback(
                        mainImage,
                        "hieungoc_tra/products/main",
                        "products/main"
                );
                product.setMainImageUrl(mainImageUrl);
            } catch (RuntimeException | IOException e) {
                // Log lại cho bạn biết, nhưng không chặn lưu sản phẩm
                System.err.println("[ImageUpload] Upload main image failed: " + e.getMessage());
                // mainImageUrl vẫn là null -> sản phẩm lưu không có ảnh chính
            }
        }

        // 6) Lưu product
        product = productDao.save(product);

        int sortOrder = 0;

        // 7) Tạo bản ghi product_images cho ảnh chính (nếu có)
        if (mainImageUrl != null) {
            ProductImage mainImgEntity = new ProductImage();
            mainImgEntity.setProduct(product);
            mainImgEntity.setImageUrl(mainImageUrl);
            mainImgEntity.setMain(true);
            mainImgEntity.setSortOrder(sortOrder++);
            productImageDao.save(mainImgEntity);
        }

        // 8) Upload và lưu ảnh phụ
        if (extraImages != null) {
            for (MultipartFile file : extraImages) {
                if (file == null || file.isEmpty()) {
                    continue;
                }
                try {
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
                } catch (RuntimeException | IOException e) {
                    System.err.println("[ImageUpload] Upload extra image failed: " + e.getMessage());
                    // Bỏ qua ảnh phụ lỗi, vẫn lưu các ảnh khác
                }
            }
        }

        return product;
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
            // Ví dụ: TRA-AB12CD34
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
        String nowhitespace = input.trim();

        // Bỏ dấu tiếng Việt
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = normalized.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");

        // Chỉ giữ [a-z0-9 -], chuyển space thành "-"
        slug = slug.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");

        // Bỏ dấu "-" ở đầu/cuối
        slug = slug.replaceAll("^-+", "").replaceAll("-+$", "");

        return slug;
    }
}
