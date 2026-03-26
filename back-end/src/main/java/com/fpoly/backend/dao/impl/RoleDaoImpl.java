package com.fpoly.backend.dao.impl;

import org.springframework.stereotype.Repository;

import com.fpoly.backend.dao.RoleDao;
import com.fpoly.backend.entity.Role;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;

@Repository
public class RoleDaoImpl implements RoleDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Role findByRoleName(String roleName) {
        String jpql = "SELECT r FROM Role r WHERE r.roleName = :roleName";
        try {
            return entityManager.createQuery(jpql, Role.class)
                    .setParameter("roleName", roleName)
                    .getSingleResult();
        } catch (NoResultException ex) {
            return null;
        }
    }
}
