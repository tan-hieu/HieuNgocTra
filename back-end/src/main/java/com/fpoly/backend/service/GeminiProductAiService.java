package com.fpoly.backend.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Service
public class GeminiProductAiService {

    private final RestClient restClient;

    @Value("${app.ai.gemini.api-key:}")
    private String apiKey;

    @Value("${app.ai.gemini.model:gemini-3-flash-preview}")
    private String model;

    @Value("${app.ai.gemini.base-url:https://generativelanguage.googleapis.com}")
    private String baseUrl;

    public GeminiProductAiService() {
        this.restClient = RestClient.builder().build();
    }

    public String suggest(ProductAiPrompt prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Thiếu GEMINI_API_KEY trên server");
        }
        if (prompt == null || isBlank(prompt.productName())) {
            throw new IllegalArgumentException("Thiếu tên trà (productName)");
        }
        if (isBlank(prompt.section())) {
            throw new IllegalArgumentException("Thiếu section");
        }

        String teaName = prompt.productName().trim();
        String section = prompt.section().trim();
        int minChars = minCharsBySection(section);

        TeaFacts facts = resolveTeaFacts(teaName);

        List<String> candidates = new ArrayList<>();
        candidates.add(model);
        candidates.add("gemini-2.0-flash");
        candidates.add("gemini-2.0-flash-lite");

        String lastErr = null;

        for (String m : candidates) {
            String firstPrompt = buildPrompt(teaName, section, minChars, false, facts);
            String secondPrompt = buildPrompt(teaName, section, minChars, true, facts);

            try {
                String text1 = callModel(m, firstPrompt);
                text1 = enforceTeaNameAndFacts(text1, teaName, facts);
                if (text1.length() >= minChars) return text1;

                String text2 = callModel(m, secondPrompt);
                text2 = enforceTeaNameAndFacts(text2, teaName, facts);
                if (text2.length() >= minChars) return text2;

                return text2;
            } catch (RestClientResponseException ex) {
                int status = ex.getStatusCode().value();
                String body = ex.getResponseBodyAsString();

                if (status == 429) {
                    throw new RuntimeException(
                            "Quota Gemini đã hết hoặc bị rate limit. Vui lòng chờ reset quota hoặc nâng gói. Chi tiết: " + body
                    );
                }

                if (status == 404) {
                    lastErr = "Model " + m + " không khả dụng: " + body;
                    continue;
                }

                lastErr = "Model " + m + " lỗi HTTP " + status + ": " + body;
            } catch (Exception ex) {
                lastErr = "Model " + m + " lỗi: " + ex.getMessage();
            }
        }

        throw new RuntimeException("Gợi ý AI thất bại. " + (lastErr == null ? "Không có chi tiết." : lastErr));
    }

    public TeaFacts resolveTeaFacts(String teaName) {
        String n = normalizeTeaName(teaName);

        if (n.contains("ô liu") || n.contains("olive")) {
            return new TeaFacts(
                    "Địa Trung Hải (phổ biến tại Tây Ban Nha, Ý, Hy Lạp)",
                    "trà thảo mộc (lá ô liu)",
                    "rule: olive"
            );
        }
        if (n.contains("shan tuyết")) {
            return new TeaFacts(
                    "Vùng núi cao phía Bắc Việt Nam (Hà Giang, Yên Bái, Sơn La)",
                    "trà shan tuyết",
                    "rule: shan tuyet"
            );
        }
        if (n.contains("ô long") || n.contains("oolong")) {
            return new TeaFacts(
                    "Đài Loan/Trung Quốc; tại Việt Nam phổ biến ở Lâm Đồng",
                    "trà ô long",
                    "rule: oolong"
            );
        }
        if (n.contains("matcha")) {
            return new TeaFacts(
                    "Nhật Bản",
                    "trà xanh nghiền mịn (matcha)",
                    "rule: matcha"
            );
        }
        if (n.contains("atiso")) {
            return new TeaFacts(
                    "Đà Lạt, Lâm Đồng, Việt Nam",
                    "trà thảo mộc (atiso)",
                    "rule: atiso"
            );
        }
        if (n.contains("trà xanh")) {
            return new TeaFacts("Việt Nam/Trung Quốc/Nhật Bản", "trà xanh", "rule: green tea");
        }
        if (n.contains("trà đen")) {
            return new TeaFacts("Ấn Độ/Trung Quốc/Sri Lanka", "trà đen", "rule: black tea");
        }

        return new TeaFacts("chưa xác minh chắc chắn", "chưa xác minh chắc chắn", "fallback");
    }

    private String callModel(String modelName, String fullPrompt) {
        String url = baseUrl
                + "/v1beta/models/" + modelName + ":generateContent?key="
                + URLEncoder.encode(apiKey, StandardCharsets.UTF_8);

        String requestJson = buildRequestJson(fullPrompt);

        String raw = restClient.post()
                .uri(url)
                .header("Content-Type", "application/json")
                .body(requestJson)
                .retrieve()
                .body(String.class);

        return extractText(raw);
    }

    private String buildRequestJson(String prompt) {
        String escapedPrompt = escapeJson(prompt);

        return """
               {
                 "contents": [
                   {
                     "role": "user",
                     "parts": [
                       { "text": "%s" }
                     ]
                   }
                 ],
                 "tools": [
                   { "google_search": {} }
                 ],
                 "generationConfig": {
                   "temperature": 0.55,
                   "topP": 0.9,
                   "maxOutputTokens": 900
                 }
               }
               """.formatted(escapedPrompt);
    }

    private String extractText(String rawJson) {
        if (rawJson == null || rawJson.isBlank()) {
            throw new RuntimeException("Gemini trả về rỗng");
        }

        Pattern p = Pattern.compile("\"text\"\\s*:\\s*\"((?:\\\\.|[^\"\\\\])*)\"");
        Matcher m = p.matcher(rawJson);

        if (!m.find()) {
            throw new RuntimeException("Không tìm thấy text trong phản hồi Gemini: " + rawJson);
        }

        String encoded = m.group(1);
        String decoded = unescapeJson(encoded).trim();

        if (decoded.isBlank()) {
            throw new RuntimeException("Gemini trả về text rỗng");
        }
        return decoded;
    }

    private String buildPrompt(String teaName, String section, int minChars, boolean strictLongForm, TeaFacts facts) {
        String sectionRule = switch (section) {
            case "shortDesc" -> """
                    Viết Lời dẫn dắt theo phong cách trang bán hàng cao cấp.
                    BẮT BUỘC:
                    - Câu đầu nêu rõ: tên trà + danh mục + nguồn gốc.
                    - Không dùng chữ "chưa xác minh chắc chắn" nếu đã có dữ liệu facts.
                    - 1-2 đoạn, nội dung đầy đặn, không cụt.
                    """;
            case "story" -> """
                    Viết Câu chuyện sản phẩm (Tinh hoa) thành 2 đoạn rõ ý.
                    BẮT BUỘC:
                    - Đoạn đầu phải nhắc nguồn gốc của trà.
                    - Gắn tên trà xuyên suốt, không nói chung chung.
                    """;
            case "taste" -> """
                    Viết Hương vị & Cảm nhận:
                    - Màu nước, mùi hương, thân vị, hậu vị.
                    - Ít nhất 2 đoạn, có chiều sâu.
                    """;
            case "brewing" -> """
                    Viết Nghệ thuật pha trà:
                    - Có nhiệt độ nước, định lượng trà, thời gian hãm.
                    - Viết thành đoạn + các bước dễ làm.
                    """;
            case "storage" -> """
                    Viết Bảo quản:
                    - Tránh ẩm, tránh mùi, tránh ánh sáng.
                    - Cách đựng trà và lưu ý khi mở túi nhiều lần.
                    """;
            case "visual" -> "Mô tả cảm quan lá khô, lá sau hãm và màu nước trà.";
            case "aroma" -> "Mô tả tầng hương chính và độ lưu hương.";
            case "tasteProfile" -> "Tổng hợp profile vị: đậm-nhẹ, chát-ngọt, hậu vị.";
            default -> "Viết mô tả đầy đủ, chuyên sâu, bám đặc trưng trà.";
        };

        String extraStrict = strictLongForm
                ? "Bản này phải dài hơn, đầy đặn hơn, không được viết ngắn."
                : "Ưu tiên mạch lạc và thực tế.";

        return """
                Bạn là chuyên gia trà.
                Sản phẩm: %s

                Facts đã xác định:
                - Danh mục: %s
                - Nguồn gốc: %s

                Mục tiêu:
                - Viết đúng theo tên trà này, không lẫn sang trà khác.
                - Độ dài tối thiểu: %d ký tự.
                - Không markdown, không placeholder, không dùng "...".

                %s

                Yêu cầu section:
                %s
                """
                .formatted(teaName, facts.category(), facts.origin(), minChars, extraStrict, sectionRule);
    }

    private int minCharsBySection(String section) {
        return switch (section) {
            case "shortDesc" -> 450;
            case "story" -> 900;
            case "taste" -> 650;
            case "brewing" -> 520;
            case "storage" -> 380;
            case "visual" -> 420;
            case "aroma" -> 420;
            case "tasteProfile" -> 420;
            default -> 450;
        };
    }

    private String normalizeTeaName(String teaName) {
        if (teaName == null) return "";
        String s = teaName.trim().toLowerCase();
        s = s.replace("tra ", "trà ");
        s = s.replace(" o long", " ô long");
        s = s.replace(" oolong", " ô long");
        s = s.replace(" oliu", " ô liu");
        s = s.replace(" olive", " ô liu");
        return s;
    }

    private String enforceTeaNameAndFacts(String text, String teaName, TeaFacts facts) {
        String out = text == null ? "" : text.trim();
        if (out.isBlank()) return out;

        String tea = teaName == null ? "" : teaName.trim();
        if (!tea.isBlank() && !out.toLowerCase().contains(tea.toLowerCase())) {
            out = tea + ". " + out;
        }

        // Tránh lẫn tên trà khác phổ biến
        String lowerTea = tea.toLowerCase();
        if (!lowerTea.contains("shan tuyết")) out = out.replaceAll("(?i)shan\\s*tuy[eế]t", tea);
        if (!lowerTea.contains("ô long") && !lowerTea.contains("oolong")) out = out.replaceAll("(?i)oolong|ô\\s*long", tea);

        return out;
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isBlank();
    }

    private String escapeJson(String value) {
        if (value == null) return "";
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\r", "")
                .replace("\n", "\\n")
                .replace("\t", "\\t");
    }

    private String unescapeJson(String value) {
        if (value == null) return "";
        return value
                .replace("\\n", "\n")
                .replace("\\t", "\t")
                .replace("\\r", "\r")
                .replace("\\\"", "\"")
                .replace("\\\\", "\\");
    }

    public record TeaFacts(String origin, String category, String evidence) {}

    public record ProductAiPrompt(
            String section,
            String productName,
            String origin,
            String category,
            String weight,
            String price,
            String stock,
            String shortDesc,
            String story,
            String taste,
            String brewing,
            String storage,
            String visual,
            String aroma,
            String tasteProfile
    ) {}
}
