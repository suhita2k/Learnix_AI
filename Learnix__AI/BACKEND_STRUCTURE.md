# Spring Boot Backend Structure Reference

This document provides the recommended structure for the Spring Boot backend for Learnix AI.

## 📁 Project Structure

```
learnix-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── learnix/
│   │   │           ├── LearnixApplication.java
│   │   │           ├── config/
│   │   │           │   ├── SecurityConfig.java
│   │   │           │   ├── CorsConfig.java
│   │   │           │   └── GroqConfig.java
│   │   │           ├── controller/
│   │   │           │   ├── AuthController.java
│   │   │           │   ├── FileController.java
│   │   │           │   ├── QuizController.java
│   │   │           │   ├── AIController.java
│   │   │           │   └── UserController.java
│   │   │           ├── dto/
│   │   │           │   ├── LoginRequest.java
│   │   │           │   ├── RegisterRequest.java
│   │   │           │   ├── FileUploadResponse.java
│   │   │           │   ├── QuizResultRequest.java
│   │   │           │   └── ApiResponse.java
│   │   │           ├── entity/
│   │   │           │   ├── User.java
│   │   │           │   ├── File.java
│   │   │           │   ├── Quiz.java
│   │   │           │   ├── StudyPlan.java
│   │   │           │   └── ChatHistory.java
│   │   │           ├── repository/
│   │   │           │   ├── UserRepository.java
│   │   │           │   ├── FileRepository.java
│   │   │           │   ├── QuizRepository.java
│   │   │           │   ├── StudyPlanRepository.java
│   │   │           │   └── ChatHistoryRepository.java
│   │   │           ├── service/
│   │   │           │   ├── AuthService.java
│   │   │           │   ├── FileService.java
│   │   │           │   ├── QuizService.java
│   │   │           │   ├── GroqAIService.java
│   │   │           │   └── UserService.java
│   │   │           ├── security/
│   │   │           │   ├── JwtTokenProvider.java
│   │   │           │   ├── JwtAuthenticationFilter.java
│   │   │           │   └── CustomUserDetailsService.java
│   │   │           └── exception/
│   │   │               ├── GlobalExceptionHandler.java
│   │   │               ├── ResourceNotFoundException.java
│   │   │               └── UnauthorizedException.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── application-dev.properties
│   └── test/
│       └── java/
│           └── com/
│               └── learnix/
│                   └── (test classes)
├── pom.xml
└── README.md
```

## 🔧 Key Configuration Files

### pom.xml (Maven Dependencies)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.learnix</groupId>
    <artifactId>learnix-backend</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>
    
    <dependencies>
        <!-- Spring Boot Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <!-- Spring Boot JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <!-- Spring Security -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        <!-- MySQL Driver -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.11.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.11.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.11.5</version>
        </dependency>
        
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- Apache PDFBox (for PDF parsing) -->
        <dependency>
            <groupId>org.apache.pdfbox</groupId>
            <artifactId>pdfbox</artifactId>
            <version>2.0.29</version>
        </dependency>
        
        <!-- HTTP Client for Groq API -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-webflux</artifactId>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### application.properties

```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/learnix_ai
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# File Storage
file.upload-dir=./uploads

# JWT Configuration
jwt.secret=your-secret-key-change-this-in-production
jwt.expiration=86400000

# Groq API Configuration
groq.api.url=https://api.groq.com/openai/v1/chat/completions
groq.api.key=your-groq-api-key

# CORS Configuration
cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

## 📝 Sample Code Implementations

### User Entity

```java
package com.learnix.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(nullable = false, unique = true, length = 100)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}
```

### File Entity

```java
package com.learnix.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "files")
@Data
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "file_name", nullable = false)
    private String fileName;
    
    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;
    
    @Column(name = "file_size", nullable = false)
    private Long fileSize;
    
    @Column(name = "file_type", length = 50)
    private String fileType;
    
    @Lob
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "upload_date")
    private LocalDateTime uploadDate = LocalDateTime.now();
}
```

### Quiz Entity

```java
package com.learnix.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz")
@Data
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "file_id")
    private File file;
    
    @Column(nullable = false)
    private Integer score;
    
    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions;
    
    @Column(name = "file_name")
    private String fileName;
    
    @Column(name = "completed_date")
    private LocalDateTime completedDate = LocalDateTime.now();
}
```

### Auth Controller

```java
package com.learnix.controller;

import com.learnix.dto.*;
import com.learnix.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout() {
        return ResponseEntity.ok(new ApiResponse(true, "Logged out successfully"));
    }
}
```

### File Controller

```java
package com.learnix.controller;

import com.learnix.dto.ApiResponse;
import com.learnix.entity.File;
import com.learnix.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class FileController {
    
    private final FileService fileService;
    
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Long userId) {
        return ResponseEntity.ok(fileService.uploadFile(file, userId));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<File>> getUserFiles(@PathVariable Long userId) {
        return ResponseEntity.ok(fileService.getUserFiles(userId));
    }
    
    @DeleteMapping("/{fileId}")
    public ResponseEntity<ApiResponse> deleteFile(@PathVariable Long fileId) {
        return ResponseEntity.ok(fileService.deleteFile(fileId));
    }
}
```

### Groq AI Service

```java
package com.learnix.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.Map;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GroqAIService {
    
    @Value("${groq.api.url}")
    private String groqApiUrl;
    
    @Value("${groq.api.key}")
    private String groqApiKey;
    
    private final WebClient.Builder webClientBuilder;
    
    public String generateSummary(String text) {
        Map<String, Object> requestBody = Map.of(
            "model", "llama-3.3-70b-versatile",
            "messages", List.of(
                Map.of("role", "system", "content", "You are a helpful study assistant."),
                Map.of("role", "user", "content", "Summarize: " + text)
            ),
            "temperature", 0.7,
            "max_tokens", 2048
        );
        
        return callGroqAPI(requestBody);
    }
    
    public String generateKeyPoints(String text) {
        Map<String, Object> requestBody = Map.of(
            "model", "llama-3.3-70b-versatile",
            "messages", List.of(
                Map.of("role", "system", "content", "Extract key points from educational content."),
                Map.of("role", "user", "content", "Key points from: " + text)
            ),
            "temperature", 0.7,
            "max_tokens", 2048
        );
        
        return callGroqAPI(requestBody);
    }
    
    private String callGroqAPI(Map<String, Object> requestBody) {
        WebClient webClient = webClientBuilder.build();
        
        Mono<Map> response = webClient.post()
            .uri(groqApiUrl)
            .header("Authorization", "Bearer " + groqApiKey)
            .header("Content-Type", "application/json")
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(Map.class);
        
        Map<String, Object> result = response.block();
        
        if (result != null && result.containsKey("choices")) {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) result.get("choices");
            if (!choices.isEmpty()) {
                Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                return (String) message.get("content");
            }
        }
        
        return "Error generating response";
    }
}
```

### Security Configuration

```java
package com.learnix.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests()
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            .and()
            .cors();
        
        return http.build();
    }
}
```

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Files
- `POST /api/files/upload` - Upload file
- `GET /api/files/user/{userId}` - Get user's files
- `DELETE /api/files/{fileId}` - Delete file

### Quiz
- `POST /api/quiz/save` - Save quiz result
- `GET /api/quiz/user/{userId}` - Get user's quiz history
- `GET /api/quiz/stats/{userId}` - Get quiz statistics

### AI Features
- `POST /api/ai/summary` - Generate summary
- `POST /api/ai/keypoints` - Generate key points
- `POST /api/ai/questions/2mark` - Generate 2-mark questions
- `POST /api/ai/questions/16mark` - Generate 16-mark questions
- `POST /api/ai/quiz` - Generate MCQ quiz
- `POST /api/ai/chat` - Chatbot interaction
- `POST /api/ai/study-plan` - Generate study plan

## 📦 Next Steps

1. Set up MySQL database
2. Create Spring Boot project with dependencies
3. Implement entities and repositories
4. Implement services
5. Implement controllers
6. Configure security and JWT
7. Test API endpoints
8. Integrate with frontend
9. Deploy to production

## 🔐 Security Considerations

- Use BCrypt for password hashing
- Implement JWT for authentication
- Add input validation
- Implement rate limiting
- Secure file uploads
- Use HTTPS in production
- Never commit API keys to git
- Implement proper error handling

---

This structure provides a solid foundation for building the Spring Boot backend for Learnix AI.
