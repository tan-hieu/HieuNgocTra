package com.fpoly.backend.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.fpoly.backend.dao.ProductDao;
import com.fpoly.backend.entity.Product;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class ProductDaoImpl implements ProductDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public Product save(Product product) {
        Product merged = entityManager.merge(product);
        entityManager.flush();
        return merged;
    }

    @Override
    public Product findById(Long id) {
        return entityManager.find(Product.class, id);
    }

    @Override
    public boolean existsByProductCode(String productCode) {
        String jpql = "SELECT COUNT(p) FROM Product p WHERE p.productCode = :productCode";
        Long count = entityManager.createQuery(jpql, Long.class)
                .setParameter("productCode", productCode)
                .getSingleResult();
        return count > 0;
    }

    @Override
    public boolean existsBySlug(String slug) {
        String jpql = "SELECT COUNT(p) FROM Product p WHERE p.slug = :slug";
        Long count = entityManager.createQuery(jpql, Long.class)
                .setParameter("slug", slug)
                .getSingleResult();
        return count > 0;
    }

    @Override
    public boolean existsByNameIgnoreCase(String name) {
        String jpql = "SELECT COUNT(p) FROM Product p WHERE LOWER(TRIM(p.name)) = LOWER(TRIM(:name))";
        Long count = entityManager.createQuery(jpql, Long.class)
                .setParameter("name", name)
                .getSingleResult();
        return count > 0;
    }

    @Override
    public List<Product> findAllOrderByCreatedAtDesc() {
        String jpql = """
            SELECT p
            FROM Product p
            JOIN FETCH p.category c
            ORDER BY p.createdAt DESC
        """;
        return entityManager.createQuery(jpql, Product.class).getResultList();
    }

    @Override
    @Transactional
    public void delete(Product product) {
        Product managed = entityManager.contains(product) ? product : entityManager.merge(product);
        entityManager.remove(managed);
        entityManager.flush();
    }
}