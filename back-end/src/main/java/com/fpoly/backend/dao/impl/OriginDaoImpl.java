package com.fpoly.backend.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.fpoly.backend.dao.OriginDao;
import com.fpoly.backend.entity.Origin;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class OriginDaoImpl implements OriginDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public Origin save(Origin origin) {
        Origin merged = entityManager.merge(origin);
        entityManager.flush();
        return merged;
    }

    @Override
    public Origin findById(Long id) {
        return entityManager.find(Origin.class, id);
    }

    @Override
    public List<Origin> findAllOrderByCreatedAtDesc() {
        String jpql = "SELECT o FROM Origin o ORDER BY o.createdAt DESC";
        return entityManager.createQuery(jpql, Origin.class).getResultList();
    }

    @Override
    public boolean existsBySlug(String slug) {
        String jpql = "SELECT COUNT(o) FROM Origin o WHERE o.slug = :slug";
        Long count = entityManager.createQuery(jpql, Long.class)
                .setParameter("slug", slug)
                .getSingleResult();
        return count > 0;
    }

    @Override
    public boolean existsByOriginCode(String originCode) {
        String jpql = "SELECT COUNT(o) FROM Origin o WHERE o.originCode = :originCode";
        Long count = entityManager.createQuery(jpql, Long.class)
                .setParameter("originCode", originCode)
                .getSingleResult();
        return count > 0;
    }

    @Override
    public boolean existsByNameAndRegionIgnoreCase(String name, String region, Long excludeId) {
        StringBuilder jpql = new StringBuilder("""
            SELECT COUNT(o)
            FROM Origin o
            WHERE LOWER(TRIM(o.name)) = LOWER(TRIM(:name))
              AND LOWER(TRIM(o.region)) = LOWER(TRIM(:region))
        """);
        if (excludeId != null) {
            jpql.append(" AND o.id <> :excludeId");
        }

        var query = entityManager.createQuery(jpql.toString(), Long.class)
                .setParameter("name", name)
                .setParameter("region", region);

        if (excludeId != null) {
            query.setParameter("excludeId", excludeId);
        }

        return query.getSingleResult() > 0;
    }

    @Override
    @Transactional
    public void delete(Origin origin) {
        Origin managed = entityManager.contains(origin) ? origin : entityManager.merge(origin);
        entityManager.remove(managed);
        entityManager.flush();
    }
}
