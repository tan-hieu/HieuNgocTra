package com.fpoly.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String redirectToFrontend() {
        return "redirect:http://localhost:5173/"; // front-end dev server
    }
}
