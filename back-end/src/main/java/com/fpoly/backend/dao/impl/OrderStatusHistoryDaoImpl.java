package com.fpoly.backend.dao.impl;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.fpoly.backend.dao.OrderStatusHistoryDao;
import com.fpoly.backend.entity.OrderStatusHistory;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class OrderStatusHistoryDaoImpl implements OrderStatusHistoryDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public OrderStatusHistory save(OrderStatusHistory history) {
        OrderStatusHistory merged = entityManager.merge(history);
        entityManager.flush();
        return merged;
    }
}
