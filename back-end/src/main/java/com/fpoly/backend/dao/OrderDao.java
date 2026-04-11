package com.fpoly.backend.dao;

import java.util.List;
import java.util.Optional;

import com.fpoly.backend.entity.Order;

public interface OrderDao {
    Order save(Order order);
    boolean existsByOrderCode(String orderCode);

    List<Order> findPageByStatus(String status, int offset, int limit);
    long countByStatus(String status);

    Optional<Order> findById(Long id);
}
