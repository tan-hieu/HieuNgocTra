package com.fpoly.backend.dao;

import com.fpoly.backend.entity.Product;

public interface ProductDao {

    Product save(Product product);

    boolean existsByProductCode(String productCode);

    boolean existsBySlug(String slug);

    boolean existsByNameIgnoreCase(String name);
}