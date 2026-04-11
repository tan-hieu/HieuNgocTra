package com.fpoly.backend.dao.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.fpoly.backend.dao.OrderDao;
import com.fpoly.backend.entity.Order;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

@Repository
public class OrderDaoImpl implements OrderDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public Order save(Order order) {
        Order merged = entityManager.merge(order);
        entityManager.flush();
        return merged;
    }

    @Override
    public boolean existsByOrderCode(String orderCode) {
        String jpql = "SELECT COUNT(o) FROM Order o WHERE o.orderCode = :orderCode";
        Long count = entityManager.createQuery(jpql, Long.class)
                .setParameter("orderCode", orderCode)
                .getSingleResult();
        return count > 0;
    }

    @Override
    public List<Order> findPageByStatus(String status, int offset, int limit) {
        StringBuilder jpql = new StringBuilder("SELECT o FROM Order o ");
        if (status != null) {
            jpql.append("WHERE o.orderStatus = :status ");
        }
        jpql.append("ORDER BY o.createdAt DESC");

        TypedQuery<Order> query = entityManager.createQuery(jpql.toString(), Order.class);
        if (status != null) {
            query.setParameter("status", status);
        }
        query.setFirstResult(Math.max(offset, 0));
        query.setMaxResults(Math.max(limit, 1));

        return query.getResultList();
    }

    @Override
    public long countByStatus(String status) {
        StringBuilder jpql = new StringBuilder("SELECT COUNT(o) FROM Order o ");
        if (status != null) {
            jpql.append("WHERE o.orderStatus = :status");
        }

        TypedQuery<Long> query = entityManager.createQuery(jpql.toString(), Long.class);
        if (status != null) {
            query.setParameter("status", status);
        }

        return query.getSingleResult();
    }

    @Override
    public Optional<Order> findById(Long id) {
        return Optional.ofNullable(entityManager.find(Order.class, id));
    }
}
