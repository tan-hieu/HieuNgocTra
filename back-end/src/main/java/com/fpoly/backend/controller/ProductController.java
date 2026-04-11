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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createProduct(
            @RequestPart("product") CreateProductRequest request,
            @RequestPart(value = "mainImage", required = false) MultipartFile mainImage,
            @RequestPart(value = "extraImages", required = false) List<MultipartFile> extraImages) {

        try {
            Product saved = productService.createProduct(
                    request.getCategory(),
                    request.getProductName(),
                    request.getOrigin(),
                    safeTrim(request.getWeight()),
                    parsePrice(request.getPrice()),
                    request.getStock() != null ? request.getStock() : 0,
                    safeTrim(request.getShortDesc()),
                    joinNonEmpty("\n\n", request.getStory(), request.getVisual(), request.getStorage()),
                    joinNonEmpty("\n\n", request.getTaste(), request.getAroma(), request.getTasteProfile()),
                    safeTrim(request.getBrewing()),
                    mainImage,
                    extraImages
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(toBasicMap(saved));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "message", "Lỗi ràng buộc dữ liệu khi lưu sản phẩm",
                    "details", extractRootCauseMessage(ex)
            ));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "message", "Có lỗi xảy ra khi tạo sản phẩm",
                    "details", extractRootCauseMessage(ex)
            ));
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestPart("product") CreateProductRequest request,
            @RequestPart(value = "mainImage", required = false) MultipartFile mainImage,
            @RequestPart(value = "extraImages", required = false) List<MultipartFile> extraImages) {

        try {
            Product saved = productService.updateProduct(
                    id,
                    request.getCategory(),
                    request.getProductName(),
                    request.getOrigin(),
                    safeTrim(request.getWeight()),
                    parsePrice(request.getPrice()),
                    request.getStock() != null ? request.getStock() : 0,
                    safeTrim(request.getShortDesc()),
                    joinNonEmpty("\n\n", request.getStory(), request.getVisual(), request.getStorage()),
                    joinNonEmpty("\n\n", request.getTaste(), request.getAroma(), request.getTasteProfile()),
                    safeTrim(request.getBrewing()),
                    mainImage,
                    extraImages
            );

            return ResponseEntity.ok(toBasicMap(saved));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "message", "Có lỗi xảy ra khi cập nhật sản phẩm",
                    "details", extractRootCauseMessage(ex)
            ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(Map.of("message", "Xóa thành công"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "message", "Có lỗi xảy ra khi xóa sản phẩm",
                    "details", extractRootCauseMessage(ex)
            ));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllProducts() {
        List<Map<String, Object>> body = productService.getAllProducts()
                .stream()
                .map(item -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", item.id());
                    map.put("productCode", item.productCode());
                    map.put("name", item.name());
                    map.put("categoryName", item.categoryName());
                    map.put("price", item.price());
                    map.put("stockQuantity", item.stockQuantity());
                    map.put("status", item.status());
                    map.put("mainImageUrl", item.mainImageUrl());
                    return map;
                })
                .toList();
        return ResponseEntity.ok(body);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductDetail(@PathVariable Long id) {
        try {
            ProductService.ProductDetailItem item = productService.getProductDetail(id);

            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", item.id());
            map.put("productCode", item.productCode());
            map.put("productName", item.productName());
            map.put("category", item.category());
            map.put("origin", item.origin());
            map.put("weight", item.weight());
            map.put("shortDescription", item.shortDescription());
            map.put("price", item.price());
            map.put("stock", item.stock());
            map.put("status", item.status());
            map.put("shortDesc", item.shortDesc());
            map.put("story", item.story());
            map.put("taste", item.taste());
            map.put("brewing", item.brewing());
            map.put("storage", item.storage());
            map.put("visual", item.visual());
            map.put("aroma", item.aroma());
            map.put("tasteProfile", item.tasteProfile());
            map.put("mainImageUrl", item.mainImageUrl());
            map.put("extraImageUrls", item.extraImageUrls());
            map.put("rawDescription", item.rawDescription());
            map.put("rawFlavorNotes", item.rawFlavorNotes());

            return ResponseEntity.ok(map);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "message", "Có lỗi xảy ra khi lấy chi tiết sản phẩm",
                    "details", extractRootCauseMessage(ex)
            ));
        }
    }

    private BigDecimal parsePrice(String raw) {
        try {
            if (raw == null || raw.isBlank()) return null;
            return new BigDecimal(raw.trim());
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException("Giá sản phẩm không hợp lệ: " + raw);
        }
    }

    private String safeTrim(String value) {
        return value == null ? null : value.trim();
    }

    private String joinNonEmpty(String delimiter, String... parts) {
        return Arrays.stream(parts)
                .filter(p -> p != null && !p.isBlank())
                .collect(Collectors.joining(delimiter));
    }

    private String extractRootCauseMessage(Throwable throwable) {
        Throwable root = throwable;
        while (root.getCause() != null && root.getCause() != root) {
            root = root.getCause();
        }
        String message = root.getMessage();
        return (message == null || message.isBlank()) ? root.getClass().getSimpleName() : message;
    }

    private Map<String, Object> toBasicMap(Product saved) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", saved.getId());
        response.put("name", saved.getName());
        response.put("slug", saved.getSlug());
        response.put("productCode", saved.getProductCode());
        response.put("mainImageUrl", saved.getMainImageUrl());
        return response;
    }

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
        private String price;
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
