package com.fpoly.backend.dao;

import java.util.List;

import com.fpoly.backend.entity.Category;

public interface CategoryDao {

    Category save(Category category);

    Category findById(Long id);

    List<Category> findAllOrderByCreatedAtDesc();

    boolean existsByNameIgnoreCase(String name, Long excludeId);

    boolean existsBySlug(String slug, Long excludeId);

    long countProductsByCategoryId(Long categoryId);

    void delete(Category category);
}