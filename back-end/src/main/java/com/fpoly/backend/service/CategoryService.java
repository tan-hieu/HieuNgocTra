package com.fpoly.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.Normalizer;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.fpoly.backend.dao.CategoryDao;
import com.fpoly.backend.entity.Category;

@Service
public class CategoryService {

    private final CategoryDao categoryDao;
    private final Cloudinary cloudinary;
    private final String uploadBaseDir;

    public CategoryService(
            CategoryDao categoryDao,
            Cloudinary cloudinary,
            @Value("${app.upload.dir:${user.dir}/uploads}") String uploadBaseDir) {
        this.categoryDao = categoryDao;
        this.cloudinary = cloudinary;
        this.uploadBaseDir = uploadBaseDir;
    }

    @Transactional(readOnly = true)
    public List<CategoryItem> getAllCategories() {
        return categoryDao.findAllOrderByCreatedAtDesc()
                .stream()
                .map(c -> new CategoryItem(
                        c,
                        categoryDao.countProductsByCategoryId(c.getId())
                ))
                .toList();
    }

    @Transactional
    public Category createCategory(
            String name,
            String description,
            String status,
            MultipartFile image) throws IOException {

        String cleanName = normalizeRequired(name, "Tên danh mục không được để trống");
        if (categoryDao.existsByNameIgnoreCase(cleanName, null)) {
            throw new IllegalArgumentException("Tên danh mục đã tồn tại.");
        }

        String baseSlug = toSlug(cleanName);
        String slug = uniqueSlug(baseSlug, null);

        Category category = new Category();
        category.setName(cleanName);
        category.setSlug(slug);
        category.setDescription(trimToNull(description));
        category.setStatus(normalizeStatus(status));

        if (image != null && !image.isEmpty()) {
            category.setImageUrl(
                    uploadImageWithFallback(image, "hieungoc_tra/categories/main", "categories/main")
            );
        }

        return categoryDao.save(category);
    }

    @Transactional
    public Category updateCategory(
            Long id,
            String name,
            String description,
            String status,
            MultipartFile image) throws IOException {

        Category category = categoryDao.findById(id);
        if (category == null) {
            throw new IllegalArgumentException("Không tìm thấy danh mục với id: " + id);
        }

        String cleanName = normalizeRequired(name, "Tên danh mục không được để trống");
        if (categoryDao.existsByNameIgnoreCase(cleanName, id)) {
            throw new IllegalArgumentException("Tên danh mục đã tồn tại.");
        }

        String baseSlug = toSlug(cleanName);
        String slug = uniqueSlug(baseSlug, id);

        category.setName(cleanName);
        category.setSlug(slug);
        category.setDescription(trimToNull(description));
        category.setStatus(normalizeStatus(status));

        if (image != null && !image.isEmpty()) {
            category.setImageUrl(
                    uploadImageWithFallback(image, "hieungoc_tra/categories/main", "categories/main")
            );
        }

        return categoryDao.save(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryDao.findById(id);
        if (category == null) {
            throw new IllegalArgumentException("Không tìm thấy danh mục với id: " + id);
        }

        long productCount = categoryDao.countProductsByCategoryId(id);
        if (productCount > 0) {
            throw new IllegalArgumentException("Danh mục đang có sản phẩm, không thể xóa.");
        }

        categoryDao.delete(category);
    }

    private String normalizeRequired(String value, String message) {
        String cleaned = value == null ? "" : value.trim();
        if (cleaned.isEmpty()) {
            throw new IllegalArgumentException(message);
        }
        return cleaned;
    }

    private String trimToNull(String value) {
        if (value == null) return null;
        String cleaned = value.trim();
        return cleaned.isEmpty() ? null : cleaned;
    }

    private String normalizeStatus(String status) {
        String s = status == null ? "" : status.trim().toUpperCase();
        if ("INACTIVE".equals(s)) return "INACTIVE";
        return "ACTIVE";
    }

    private String uniqueSlug(String base, Long excludeId) {
        String slug = base;
        int suffix = 1;
        while (categoryDao.existsBySlug(slug, excludeId)) {
            slug = base + "-" + suffix++;
        }
        return slug;
    }

    private String toSlug(String input) {
        if (input == null) return "";
        String normalized = Normalizer.normalize(input.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        return normalized.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-+", "")
                .replaceAll("-+$", "");
    }

    private String uploadImageWithFallback(MultipartFile file, String cloudFolder, String localFolder) throws IOException {
        try {
            return uploadToCloudinary(file, cloudFolder);
        } catch (RuntimeException | IOException ex) {
            return uploadToLocal(file, localFolder);
        }
    }

    private String uploadToCloudinary(MultipartFile file, String folder) throws IOException {
        @SuppressWarnings("rawtypes")
        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                Map.of("folder", folder)
        );
        Object url = uploadResult.get("secure_url");
        if (url == null) url = uploadResult.get("url");
        if (url == null) throw new IOException("Không lấy được URL từ Cloudinary");
        return url.toString();
    }

    private String uploadToLocal(MultipartFile file, String localFolder) throws IOException {
        String original = file.getOriginalFilename();
        String ext = "";
        if (original != null) {
            int lastDot = original.lastIndexOf('.');
            if (lastDot >= 0) ext = original.substring(lastDot).toLowerCase();
        }

        String fileName = UUID.randomUUID().toString().replace("-", "") + ext;
        Path dir = Paths.get(uploadBaseDir, localFolder);
        Files.createDirectories(dir);

        Path target = dir.resolve(fileName);
        file.transferTo(target.toFile());

        return "http://localhost:8080/uploads/" + localFolder.replace("\\", "/") + "/" + fileName;
    }

    public record CategoryItem(Category category, long productCount) {
    }
}
