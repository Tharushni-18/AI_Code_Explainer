package com.example.codeexplainer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point of the application.
 * @SpringBootApplication turns on auto-configuration and scans this package
 * (and sub-packages) for controllers, services, etc.
 */
@SpringBootApplication
public class CodeExplainerApplication {

    public static void main(String[] args) {
        SpringApplication.run(CodeExplainerApplication.class, args);
    }
}
