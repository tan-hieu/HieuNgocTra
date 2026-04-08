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
import com.fpoly.backend.dao.OriginDao;
import com.fpoly.backend.entity.Origin;

@Service
public class OriginService {

    private final OriginDao originDao;
    private final Cloudinary cloudinary;
    private final String uploadBaseDir;

    public OriginService(
            OriginDao originDao,
            Cloudinary cloudinary,
            @Value("${app.upload.dir:${user.dir}/uploads}") String uploadBaseDir) {
        this.originDao = originDao;
        this.cloudinary = cloudinary;
        this.uploadBaseDir = uploadBaseDir;
    }

    @Transactional
    public Origin createOrigin(
            String name,
            String region,
            String description,
            String status,
            MultipartFile image) throws IOException {

        String cleanName = normalizeRequired(name, "Tên vùng xuất xứ không được để trống");
        String cleanRegion = normalizeRequired(region, "Tỉnh thành không được để trống");

        if (originDao.existsByNameAndRegionIgnoreCase(cleanName, cleanRegion, null)) {
            throw new IllegalArgumentException("Vùng xuất xứ này đã tồn tại.");
        }

        String baseSlug = toSlug(cleanName + "-" + cleanRegion);
        String slug = uniqueSlug(baseSlug);

        Origin origin = new Origin();
        origin.setOriginCode(uniqueOriginCode());
        origin.setName(cleanName);
        origin.setRegion(cleanRegion);
        origin.setSlug(slug);
        origin.setDescription(trimToNull(description));
        origin.setStatus(normalizeStatus(status));

        if (image != null && !image.isEmpty()) {
            origin.setImageUrl(uploadImageWithFallback(image, "hieungoc_tra/origins", "origins"));
        }

        return originDao.save(origin);
    }

    @Transactional(readOnly = true)
    public List<Origin> getAllOrigins() {
        return originDao.findAllOrderByCreatedAtDesc();
    }

    @Transactional
    public Origin updateOrigin(
            Long id,
            String name,
            String region,
            String description,
            String status,
            MultipartFile image) throws IOException {

        Origin origin = originDao.findById(id);
        if (origin == null) {
            throw new IllegalArgumentException("Không tìm thấy vùng xuất xứ với id: " + id);
        }

        String cleanName = normalizeRequired(name, "Tên vùng xuất xứ không được để trống");
        String cleanRegion = normalizeRequired(region, "Tỉnh thành không được để trống");

        if (originDao.existsByNameAndRegionIgnoreCase(cleanName, cleanRegion, id)) {
            throw new IllegalArgumentException("Vùng xuất xứ này đã tồn tại.");
        }

        origin.setName(cleanName);
        origin.setRegion(cleanRegion);
        origin.setDescription(trimToNull(description));
        origin.setStatus(normalizeStatus(status));

        String baseSlug = toSlug(cleanName + "-" + cleanRegion);
        String slug = baseSlug;
        int suffix = 1;
        while (originDao.existsBySlug(slug) && !slug.equals(origin.getSlug())) {
            slug = baseSlug + "-" + suffix++;
        }
        origin.setSlug(slug);

        if (image != null && !image.isEmpty()) {
            origin.setImageUrl(uploadImageWithFallback(image, "hieungoc_tra/origins", "origins"));
        }

        return originDao.save(origin);
    }

    @Transactional
    public void deleteOrigin(Long id) {
        Origin origin = originDao.findById(id);
        if (origin == null) {
            throw new IllegalArgumentException("Không tìm thấy vùng xuất xứ với id: " + id);
        }
        originDao.delete(origin);
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

    private String uniqueOriginCode() {
        String code;
        do {
            String random = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
            code = "ORG-" + random;
        } while (originDao.existsByOriginCode(code));
        return code;
    }

    private String uniqueSlug(String base) {
        String slug = base;
        int suffix = 1;
        while (originDao.existsBySlug(slug)) {
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
}
