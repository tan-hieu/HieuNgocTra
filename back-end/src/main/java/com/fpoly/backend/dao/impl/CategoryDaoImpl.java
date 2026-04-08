package com.fpoly.backend.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fpoly.backend.dao.CategoryDao;
import com.fpoly.backend.entity.Category;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class CategoryDaoImpl implements CategoryDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Category findByNameIgnoreCase(String name) {
        if (name == null || name.isBlank()) {
            return null;
        }
        String jpql = """
                SELECT c
                FROM Category c
                WHERE LOWER(TRIM(c.name)) = LOWER(TRIM(:name))
                """;
        return entityManager.createQuery(jpql, Category.class)
                .setParameter("name", name)
                .getResultStream()
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<Category> findAll() {
        String jpql = "SELECT c FROM Category c";
        return entityManager.createQuery(jpql, Category.class)
                .getResultList();
    }
}