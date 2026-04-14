package com.fpoly.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.fpoly.backend.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    boolean existsByOrderCode(String orderCode);

    @Query("""
        SELECT DISTINCT o
        FROM Order o
        LEFT JOIN FETCH o.items i
        LEFT JOIN FETCH i.product p
        WHERE o.user.id = :userId
        ORDER BY o.createdAt DESC
    """)
    List<Order> findMyOrdersWithItems(Long userId);
}
