package com.fpoly.backend.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fpoly.backend.service.ProductService;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PublicProductController {

    private final ProductService productService;

    public PublicProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Map<String, Object>> getPublicProducts(
            @RequestParam(name = "limit", required = false) Integer limit,
            @RequestParam(name = "category", required = false) String category
    ) {
        List<Map<String, Object>> data = productService.getAllProducts()
                .stream()
                .filter(item -> "ACTIVE".equalsIgnoreCase(item.status()))
                .filter(item -> matchCategory(item.categoryName(), category))
                .map(item -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", item.id());
                    map.put("productCode", item.productCode());
                    map.put("name", item.name());
                    map.put("categoryName", item.categoryName());
                    map.put("origin", item.origin());
                    map.put("weight", item.weight());
                    map.put("price", item.price());
                    map.put("stockQuantity", item.stockQuantity());
                    map.put("status", item.status());
                    map.put("mainImageUrl", item.mainImageUrl());
                    map.put("imageUrl", item.mainImageUrl());
                    map.put("shortDescription", item.shortDescription());
                    return map;
                })
                .toList();

        if (limit != null && limit > 0 && data.size() > limit) {
            return data.subList(0, limit);
        }
        return data;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPublicProductDetail(@PathVariable Long id) {
        try {
            ProductService.ProductDetailItem item = productService.getProductDetail(id);

            if (!"ACTIVE".equalsIgnoreCase(item.status())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Sản phẩm không tồn tại hoặc đã ngừng bán"));
            }

            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", item.id());
            map.put("productCode", item.productCode());
            map.put("productName", item.productName());
            map.put("category", item.category());
            map.put("origin", item.origin());
            map.put("weight", item.weight());
            map.put("shortDescription", item.shortDescription());
            map.put("price", item.price());
            map.put("stock", item.stock());
            map.put("status", item.status());
            map.put("shortDesc", item.shortDesc());
            map.put("story", item.story());
            map.put("taste", item.taste());
            map.put("brewing", item.brewing());
            map.put("storage", item.storage());
            map.put("visual", item.visual());
            map.put("aroma", item.aroma());
            map.put("tasteProfile", item.tasteProfile());
            map.put("mainImageUrl", item.mainImageUrl());
            map.put("extraImageUrls", item.extraImageUrls());
            map.put("rawDescription", item.rawDescription());
            map.put("rawFlavorNotes", item.rawFlavorNotes());

            return ResponseEntity.ok(map);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "message", "Có lỗi khi lấy chi tiết sản phẩm",
                    "details", ex.getMessage()
            ));
        }
    }

    private boolean matchCategory(String categoryName, String categoryQuery) {
        if (categoryQuery == null || categoryQuery.isBlank()) return true;
        if (categoryName == null || categoryName.isBlank()) return false;

        String q = categoryQuery.trim().toLowerCase();
        String c = categoryName.trim().toLowerCase();

        return c.equals(q) || toSlug(c).equals(q);
    }

    private String toSlug(String input) {
        return input
                .toLowerCase()
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-+", "")
                .replaceAll("-+$", "");
    }
}
