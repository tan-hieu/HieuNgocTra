package com.fpoly.backend.dao.impl;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.fpoly.backend.dao.ProductImageDao;
import com.fpoly.backend.entity.ProductImage;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class ProductImageDaoImpl implements ProductImageDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public ProductImage save(ProductImage productImage) {
        ProductImage merged = entityManager.merge(productImage);
        entityManager.flush();
        return merged;
    }
}