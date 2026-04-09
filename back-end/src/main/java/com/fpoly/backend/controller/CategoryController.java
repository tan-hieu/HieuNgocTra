package com.fpoly.backend.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fpoly.backend.entity.Category;
import com.fpoly.backend.service.CategoryService;

@RestController
@RequestMapping("/api/admin/categories")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<Map<String, Object>> body = categoryService.getAllCategories()
                .stream()
                .map(item -> toMap(item.category(), item.productCount()))
                .toList();
        return ResponseEntity.ok(body);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(
            @RequestPart("category") CategoryUpsertRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            Category saved = categoryService.createCategory(
                    request.getName(),
                    request.getDescription(),
                    request.getStatus(),
                    image
            );
            long productCount = 0L;
            return ResponseEntity.status(HttpStatus.CREATED).body(toMap(saved, productCount));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Có lỗi xảy ra khi tạo danh mục", "details", ex.getMessage()));
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestPart("category") CategoryUpsertRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            Category saved = categoryService.updateCategory(
                    id,
                    request.getName(),
                    request.getDescription(),
                    request.getStatus(),
                    image
            );

            long productCount = categoryService.getAllCategories().stream()
                    .filter(item -> item.category().getId().equals(saved.getId()))
                    .mapToLong(CategoryService.CategoryItem::productCount)
                    .findFirst()
                    .orElse(0L);

            return ResponseEntity.ok(toMap(saved, productCount));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Có lỗi xảy ra khi cập nhật danh mục", "details", ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok(Map.of("message", "Xóa thành công"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Có lỗi xảy ra khi xóa danh mục", "details", ex.getMessage()));
        }
    }

    private Map<String, Object> toMap(Category c, long productCount) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", c.getId());
        map.put("name", c.getName());
        map.put("slug", c.getSlug());
        map.put("description", c.getDescription());
        map.put("imageUrl", c.getImageUrl());
        map.put("status", c.getStatus());
        map.put("productCount", productCount);
        map.put("createdAt", c.getCreatedAt());
        map.put("updatedAt", c.getUpdatedAt());
        return map;
    }

    public static class CategoryUpsertRequest {
        private String name;
        private String description;
        private String status;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
