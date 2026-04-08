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

import com.fpoly.backend.entity.Origin;
import com.fpoly.backend.service.OriginService;

@RestController
@RequestMapping("/api/admin/origins")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class OriginController {

    private final OriginService originService;

    public OriginController(OriginService originService) {
        this.originService = originService;
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<Map<String, Object>> body = originService.getAllOrigins()
                .stream()
                .map(this::toMap)
                .toList();
        return ResponseEntity.ok(body);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(
            @RequestPart("origin") OriginUpsertRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            Origin saved = originService.createOrigin(
                    request.getName(),
                    request.getRegion(),
                    request.getDescription(),
                    request.getStatus(),
                    image
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(toMap(saved));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Có lỗi xảy ra khi tạo vùng xuất xứ", "details", ex.getMessage()));
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestPart("origin") OriginUpsertRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            Origin saved = originService.updateOrigin(
                    id,
                    request.getName(),
                    request.getRegion(),
                    request.getDescription(),
                    request.getStatus(),
                    image
            );
            return ResponseEntity.ok(toMap(saved));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Có lỗi xảy ra khi cập nhật vùng xuất xứ", "details", ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            originService.deleteOrigin(id);
            return ResponseEntity.ok(Map.of("message", "Xóa thành công"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Có lỗi xảy ra khi xóa vùng xuất xứ", "details", ex.getMessage()));
        }
    }

    private Map<String, Object> toMap(Origin o) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", o.getId());
        map.put("originCode", o.getOriginCode());
        map.put("name", o.getName());
        map.put("slug", o.getSlug());
        map.put("region", o.getRegion());
        map.put("description", o.getDescription());
        map.put("imageUrl", o.getImageUrl());
        map.put("status", o.getStatus());
        map.put("createdAt", o.getCreatedAt());
        map.put("updatedAt", o.getUpdatedAt());
        return map;
    }

    public static class OriginUpsertRequest {
        private String name;
        private String region;
        private String description;
        private String status;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getRegion() { return region; }
        public void setRegion(String region) { this.region = region; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
