package com.fpoly.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fpoly.backend.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByProductCode(String productCode);
    boolean existsBySlug(String slug);
    boolean existsByNameIgnoreCase(String name);
}
