package com.fpoly.backend.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.fpoly.backend.dao.CategoryDao;
import com.fpoly.backend.entity.Category;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class CategoryDaoImpl implements CategoryDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public Category save(Category category) {
        Category merged = entityManager.merge(category);
        entityManager.flush();
        return merged;
    }

    @Override
    public Category findById(Long id) {
        return entityManager.find(Category.class, id);
    }

    @Override
    public List<Category> findAllOrderByCreatedAtDesc() {
        String jpql = "SELECT c FROM Category c ORDER BY c.createdAt DESC";
        return entityManager.createQuery(jpql, Category.class).getResultList();
    }

    @Override
    public boolean existsByNameIgnoreCase(String name, Long excludeId) {
        StringBuilder jpql = new StringBuilder("""
            SELECT COUNT(c)
            FROM Category c
            WHERE LOWER(TRIM(c.name)) = LOWER(TRIM(:name))
        """);
        if (excludeId != null) {
            jpql.append(" AND c.id <> :excludeId");
        }

        var query = entityManager.createQuery(jpql.toString(), Long.class)
                .setParameter("name", name);

        if (excludeId != null) {
            query.setParameter("excludeId", excludeId);
        }

        return query.getSingleResult() > 0;
    }

    @Override
    public boolean existsBySlug(String slug, Long excludeId) {
        StringBuilder jpql = new StringBuilder("""
            SELECT COUNT(c)
            FROM Category c
            WHERE LOWER(TRIM(c.slug)) = LOWER(TRIM(:slug))
        """);
        if (excludeId != null) {
            jpql.append(" AND c.id <> :excludeId");
        }

        var query = entityManager.createQuery(jpql.toString(), Long.class)
                .setParameter("slug", slug);

        if (excludeId != null) {
            query.setParameter("excludeId", excludeId);
        }

        return query.getSingleResult() > 0;
    }

    @Override
    public long countProductsByCategoryId(Long categoryId) {
        String jpql = "SELECT COUNT(p) FROM Product p WHERE p.category.id = :categoryId";
        Long count = entityManager.createQuery(jpql, Long.class)
                .setParameter("categoryId", categoryId)
                .getSingleResult();
        return count == null ? 0L : count;
    }

    @Override
    @Transactional
    public void delete(Category category) {
        Category managed = entityManager.contains(category) ? category : entityManager.merge(category);
        entityManager.remove(managed);
        entityManager.flush();
    }
}