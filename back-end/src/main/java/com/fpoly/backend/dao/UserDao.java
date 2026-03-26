package com.fpoly.backend.dao;

import com.fpoly.backend.entity.User;

public interface UserDao {

    void save(User user);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    User findByEmail(String email);
}
