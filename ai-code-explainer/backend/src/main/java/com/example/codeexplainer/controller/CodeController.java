package com.example.codeexplainer.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientResponseException;

import com.example.codeexplainer.model.CodeRequest;
import com.example.codeexplainer.model.CodeResponse;
import com.example.codeexplainer.service.AIService;

/**
 * Receives REST requests from the frontend.
 *
 * @CrossOrigin = CORS configuration. It tells the browser that pages served from
 * http://localhost:5500 are allowed to call this backend on http://localhost:8080.
 * Without it the browser would block the request.
 */
@RestController
@RequestMapping("/api/code")
@CrossOrigin(origins = {
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "https://tharushni-18.github.io"   // GitHub Pages (frontend)
})
public class CodeController {

    private static final int MAX_CODE_LENGTH = 10000;
    private static final List<String> ALLOWED_LANGUAGES =
            List.of("Java", "Python", "C", "C++", "JavaScript");

    private final AIService aiService;

    // Dependency injection: Spring creates AIService and passes it in here.
    public CodeController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/explain")
    public ResponseEntity<CodeResponse> explain(@RequestBody CodeRequest request) {

        // 1. Validate input
        if (request.getCode() == null || request.getCode().isBlank()) {
            return bad("Please enter some code.");
        }
        if (request.getLanguage() == null || request.getLanguage().isBlank()) {
            return bad("Please select a programming language.");
        }
        if (!ALLOWED_LANGUAGES.contains(request.getLanguage())) {
            return bad("This programming language is not supported.");
        }
        if (request.getCode().length() > MAX_CODE_LENGTH) {
            return bad("Code is too long. Please keep it under " + MAX_CODE_LENGTH + " characters.");
        }

        // 2. Call the service and handle failures
        try {
            CodeResponse response = aiService.explainCode(request);
            return ResponseEntity.ok(response);

        } catch (ResourceAccessException e) {
            // Network problem: Gemini unreachable or timed out
            return fail(HttpStatus.SERVICE_UNAVAILABLE,
                    "Unable to connect to the AI service. Please try again.");

        } catch (RestClientResponseException e) {
            // Gemini answered with an HTTP error (bad key, quota, etc.)
            System.err.println("Gemini API error " + e.getStatusCode().value() + ": "
                    + e.getResponseBodyAsString());
            return fail(HttpStatus.BAD_GATEWAY,
                    "The AI service returned an error (status "
                            + e.getStatusCode().value() + "). Please check the API key and try again.");

        } catch (IllegalStateException e) {
            // Our own readable errors (e.g. missing API key)
            return fail(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());

        } catch (Exception e) {
            e.printStackTrace();
            return fail(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Something went wrong while analyzing the code.");
        }
    }

    private ResponseEntity<CodeResponse> bad(String message) {
        return fail(HttpStatus.BAD_REQUEST, message);
    }

    private ResponseEntity<CodeResponse> fail(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(CodeResponse.error(message));
    }
}
