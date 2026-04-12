package com.fpoly.backend.controller;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fpoly.backend.service.GeminiProductAiService;
import com.fpoly.backend.service.GeminiProductAiService.ProductAiPrompt;
import com.fpoly.backend.service.GeminiProductAiService.TeaFacts;

@RestController
@RequestMapping("/api/admin/ai")
@CrossOrigin(
        originPatterns = {"http://localhost:*", "http://127.0.0.1:*"},
        allowCredentials = "true"
)
public class AdminAiController {

    private static final Set<String> ALLOWED_SECTIONS = Set.of(
            "shortDesc", "story", "taste", "brewing", "storage", "visual", "aroma", "tasteProfile"
    );

    private final GeminiProductAiService geminiProductAiService;

    public AdminAiController(GeminiProductAiService geminiProductAiService) {
        this.geminiProductAiService = geminiProductAiService;
    }

    @PostMapping("/products/suggest")
    public ResponseEntity<?> suggestProductText(@RequestBody ProductAiSuggestRequest req) {
        if (req == null || req.section == null || !ALLOWED_SECTIONS.contains(req.section)) {
            return ResponseEntity.badRequest().body(Map.of("message", "section không hợp lệ"));
        }
        if (req.productName == null || req.productName.trim().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Thiếu tên trà (productName)"));
        }

        String section = req.section.trim();
        String teaName = req.productName.trim();
        TeaFacts facts = geminiProductAiService.resolveTeaFacts(teaName);

        try {
            ProductAiPrompt prompt = new ProductAiPrompt(
                    section,
                    teaName,
                    null, null, null, null, null,
                    null, null, null, null, null, null, null, null
            );

            String text = geminiProductAiService.suggest(prompt);

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("section", section);
            body.put("text", text);
            body.put("source", "ai");
            body.put("originDetected", facts.origin());
            body.put("categoryDetected", facts.category());
            return ResponseEntity.ok(body);
        } catch (Exception ex) {
            String fb = fallbackText(section, teaName, facts);

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("section", section);
            body.put("text", fb);
            body.put("source", "fallback");
            body.put("originDetected", facts.origin());
            body.put("categoryDetected", facts.category());
            body.put("details", ex.getMessage());
            return ResponseEntity.ok(body);
        }
    }

    private String fallbackText(String section, String teaName, TeaFacts facts) {
        String origin = facts.origin();
        String category = facts.category();

        return switch (section) {
            case "shortDesc" -> teaName + " là " + category + " có nguồn gốc " + origin + ". "
                    + "Dòng trà này nổi bật ở sự cân bằng giữa hương thơm, thân vị và hậu vị, phù hợp cho cả thưởng trà hằng ngày lẫn các buổi tiếp khách cần sự tinh tế.";
            case "story" -> "Tinh hoa " + teaName + " đến từ vùng nguyên liệu " + origin + ", nơi điều kiện tự nhiên góp phần tạo nên bản sắc vị riêng cho từng búp trà.\n\n"
                    + "Thuộc nhóm " + category + ", " + teaName + " được yêu thích bởi chiều sâu cảm quan, độ ổn định khi pha và hậu vị kéo dài, mang lại trải nghiệm thưởng trà trọn vẹn.";
            case "taste" -> "Về cảm nhận, " + teaName + " cho màu nước trong, hương thơm rõ và thân vị cân bằng. "
                    + "Khi thưởng thức đúng cách, vị trà phát triển theo lớp, từ cảm giác mở đầu êm đến hậu vị lưu lại rõ ràng.\n\n"
                    + "Điểm nổi bật của " + teaName + " là độ hài hòa tổng thể, không quá gắt nhưng vẫn đủ chiều sâu để người uống nhận ra cá tính riêng của trà.";
            case "brewing" -> "Để pha " + teaName + " đúng chuẩn, nên dùng nước ở mức nhiệt phù hợp với " + category + ", tráng ấm nhanh trước khi hãm để ổn định nhiệt.\n\n"
                    + "Có thể bắt đầu với lượng trà vừa phải, hãm ngắn ở lần đầu rồi tăng dần thời gian ở các lần sau để giữ cân bằng giữa hương và vị.";
            case "storage" -> teaName + " cần được bảo quản nơi khô ráo, tránh ánh sáng trực tiếp và tránh gần nguồn mùi mạnh. "
                    + "Nên dùng hộp kín để giữ hương ổn định theo thời gian.\n\n"
                    + "Sau khi mở túi, nên đóng kín ngay sau mỗi lần dùng để hạn chế ẩm và oxy hóa, giúp duy trì chất lượng trà.";
            default -> teaName + " là dòng trà có phong cách rõ ràng, dễ tiếp cận nhưng vẫn có chiều sâu cảm quan.";
        };
    }

    public static class ProductAiSuggestRequest {
        public String section;
        public String productName;
        public String origin;
        public String category;
        public String weight;
        public String price;
        public String stock;
        public String shortDesc;
        public String story;
        public String taste;
        public String brewing;
        public String storage;
        public String visual;
        public String aroma;
        public String tasteProfile;
    }
}
