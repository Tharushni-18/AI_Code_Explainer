package com.example.codeexplainer.model;

/**
 * Data sent by the frontend.
 * Spring (Jackson) converts the incoming JSON into this object automatically.
 *
 * { "language": "Java", "code": "int a = 10;" }
 */
public class CodeRequest {

    private String language;
    private String code;

    // Jackson needs a no-argument constructor plus getters/setters
    public CodeRequest() {
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
