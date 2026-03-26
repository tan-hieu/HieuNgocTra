package com.fpoly.backend.dao;

import com.fpoly.backend.entity.Role;

public interface RoleDao {
    Role findByRoleName(String roleName);
}
