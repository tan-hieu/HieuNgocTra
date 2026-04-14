package com.fpoly.backend.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fpoly.backend.entity.Category;
import com.fpoly.backend.service.CategoryService;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PublicCategoryController {

    private final CategoryService categoryService;

    public PublicCategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<Map<String, Object>> getPublicCategories(
            @RequestParam(name = "limit", required = false) Integer limit
    ) {
        List<Map<String, Object>> data = categoryService.getAllCategories()
                .stream()
                .filter(item -> "ACTIVE".equalsIgnoreCase(item.category().getStatus()))
                .map(item -> toMap(item.category(), item.productCount()))
                .toList();

        if (limit != null && limit > 0 && data.size() > limit) {
            return data.subList(0, limit);
        }
        return data;
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
        return map;
    }
}
