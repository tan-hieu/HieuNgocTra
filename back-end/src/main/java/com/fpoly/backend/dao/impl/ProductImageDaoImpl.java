package com.fpoly.backend.dao.impl;

import java.util.List;

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

    @Override
    public List<ProductImage> findByProductIdOrderBySortOrderAsc(Long productId) {
        String jpql = """
            SELECT pi
            FROM ProductImage pi
            WHERE pi.product.id = :productId
            ORDER BY pi.sortOrder ASC
        """;
        return entityManager.createQuery(jpql, ProductImage.class)
                .setParameter("productId", productId)
                .getResultList();
    }

    @Override
    @Transactional
    public void deleteByProductId(Long productId) {
        String jpql = "DELETE FROM ProductImage pi WHERE pi.product.id = :productId";
        entityManager.createQuery(jpql)
                .setParameter("productId", productId)
                .executeUpdate();
        entityManager.flush();
    }
}