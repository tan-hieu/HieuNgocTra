package com.fpoly.backend.dao;

import java.util.List;

import com.fpoly.backend.entity.Origin;

public interface OriginDao {

    Origin save(Origin origin);

    Origin findById(Long id);

    List<Origin> findAllOrderByCreatedAtDesc();

    boolean existsBySlug(String slug);

    boolean existsByOriginCode(String originCode);

    boolean existsByNameAndRegionIgnoreCase(String name, String region, Long excludeId);

    void delete(Origin origin);
}
