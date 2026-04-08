package com.fpoly.backend.dao;

import java.util.List;

import com.fpoly.backend.entity.Category;

public interface CategoryDao {

    Category findByNameIgnoreCase(String name);

    List<Category> findAll();
}