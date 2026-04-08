package com.fpoly.backend.controller;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fpoly.backend.entity.Product;
import com.fpoly.backend.service.ProductService;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Tạo mới sản phẩm:
     * - product: JSON mô tả sản phẩm (CreateProductRequest)
     * - mainImage: file ảnh đại diện
     * - extraImages: list file ảnh phụ
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createProduct(
            @RequestPart("product") CreateProductRequest productRequest,
            @RequestPart(value = "mainImage", required = false) MultipartFile mainImage,
            @RequestPart(value = "extraImages", required = false) List<MultipartFile> extraImages) {

        try {
            // 1) Chuyển đổi dữ liệu từ FE sang kiểu domain

            BigDecimal price = null;
            try {
                if (productRequest.getPrice() != null && !productRequest.getPrice().isBlank()) {
                    price = new BigDecimal(productRequest.getPrice().trim());
                }
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException(
                        "Giá sản phẩm không hợp lệ: " + productRequest.getPrice());
            }

            Integer stock = productRequest.getStock() != null ? productRequest.getStock() : Integer.valueOf(0);
            String weightStr = productRequest.getWeight() != null
                    ? productRequest.getWeight().trim()
                    : "";

            // Ghép story + visual + storage thành description dài
            String description = joinNonEmpty(
                    "\n\n",
                    productRequest.getStory(),
                    productRequest.getVisual(),
                    productRequest.getStorage()
            );

            // Ghép taste + aroma + tasteProfile thành flavor_notes
            String flavorNotes = joinNonEmpty(
                    "\n\n",
                    productRequest.getTaste(),
                    productRequest.getAroma(),
                    productRequest.getTasteProfile()
            );

            String brewingGuide = productRequest.getBrewing();

            // 2) Gọi service tạo sản phẩm + lưu ảnh
            Product saved = productService.createProduct(
                    productRequest.getCategory(),    // tên danh mục
                    productRequest.getProductName(), // tên sản phẩm
                    productRequest.getOrigin(),      // xuất xứ
                    weightStr,                       // trọng lượng (text)
                    price,
                    stock,
                    productRequest.getShortDesc(),   // short_description
                    description,                     // description
                    flavorNotes,                     // flavor_notes
                    brewingGuide,                    // brewing_guide
                    mainImage,
                    extraImages
            );

            // 3) Trả về thông tin cơ bản cho FE
                Map<String, Object> response = new LinkedHashMap<>();
                response.put("id", saved.getId());
                response.put("name", saved.getName());
                response.put("slug", saved.getSlug());
                response.put("productCode", saved.getProductCode());
                response.put("mainImageUrl", saved.getMainImageUrl());
                return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", ex.getMessage()));
        } catch (DataIntegrityViolationException ex) {
            String rootMessage = extractRootCauseMessage(ex);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message", "Lỗi ràng buộc dữ liệu khi lưu sản phẩm",
                            "details", rootMessage
                    ));
        } catch (Exception ex) {
            System.err.println("[ProductController] createProduct error: " + ex.getMessage());
            String rootMessage = extractRootCauseMessage(ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message", "Có lỗi xảy ra khi tạo sản phẩm",
                            "details", rootMessage
                    ));
        }
    }

    private String extractRootCauseMessage(Throwable throwable) {
        Throwable root = throwable;
        while (root.getCause() != null && root.getCause() != root) {
            root = root.getCause();
        }
        String message = root.getMessage();
        return (message == null || message.isBlank()) ? root.getClass().getSimpleName() : message;
    }

    private String joinNonEmpty(String delimiter, String... parts) {
        return Arrays.stream(parts)
                .filter(p -> p != null && !p.isBlank())
                .collect(Collectors.joining(delimiter));
    }

    /**
     * DTO nhận JSON từ FE (được gói trong part "product").
     * Các field này map 1-1 với form ở AddProductPage.jsx.
     */
    public static class CreateProductRequest {

        private String productName;
        private String origin;
        private String category;
        private String shortDesc;
        private String story;
        private String taste;
        private String brewing;
        private String storage;
        private String visual;
        private String aroma;
        private String tasteProfile;
        private String price; // nhận dạng String, ở server convert sang BigDecimal
        private String weight;
        private Integer stock;

        public String getProductName() {
            return productName;
        }

        public void setProductName(String productName) {
            this.productName = productName;
        }

        public String getOrigin() {
            return origin;
        }

        public void setOrigin(String origin) {
            this.origin = origin;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getShortDesc() {
            return shortDesc;
        }

        public void setShortDesc(String shortDesc) {
            this.shortDesc = shortDesc;
        }

        public String getStory() {
            return story;
        }

        public void setStory(String story) {
            this.story = story;
        }

        public String getTaste() {
            return taste;
        }

        public void setTaste(String taste) {
            this.taste = taste;
        }

        public String getBrewing() {
            return brewing;
        }

        public void setBrewing(String brewing) {
            this.brewing = brewing;
        }

        public String getStorage() {
            return storage;
        }

        public void setStorage(String storage) {
            this.storage = storage;
        }

        public String getVisual() {
            return visual;
        }

        public void setVisual(String visual) {
            this.visual = visual;
        }

        public String getAroma() {
            return aroma;
        }

        public void setAroma(String aroma) {
            this.aroma = aroma;
        }

        public String getTasteProfile() {
            return tasteProfile;
        }

        public void setTasteProfile(String tasteProfile) {
            this.tasteProfile = tasteProfile;
        }

        public String getPrice() {
            return price;
        }

        public void setPrice(String price) {
            this.price = price;
        }

        public String getWeight() {
            return weight;
        }

        public void setWeight(String weight) {
            this.weight = weight;
        }

        public Integer getStock() {
            return stock;
        }

        public void setStock(Integer stock) {
            this.stock = stock;
        }
    }
}
