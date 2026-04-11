package com.fpoly.backend.dao;

import java.util.List;

import com.fpoly.backend.entity.ProductImage;

public interface ProductImageDao {

    ProductImage save(ProductImage productImage);

    List<ProductImage> findByProductIdOrderBySortOrderAsc(Long productId);

    void deleteByProductId(Long productId);
}