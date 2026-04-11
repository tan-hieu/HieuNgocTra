package com.fpoly.backend.dao;

import java.util.List;

import com.fpoly.backend.entity.Product;

public interface ProductDao {

    Product save(Product product);

    Product findById(Long id);

    boolean existsByProductCode(String productCode);

    boolean existsBySlug(String slug);

    boolean existsByNameIgnoreCase(String name);

    List<Product> findAllOrderByCreatedAtDesc();

    void delete(Product product);
}