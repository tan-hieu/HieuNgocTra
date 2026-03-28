package com.fpoly.backend.controller;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthUserResponse {
    private Long id;
    private String fullName;
    private String username;
    private String email;
    private String phone;
    private String avatarUrl;
    private String address;
    private String status;
    private String roleName;
}
