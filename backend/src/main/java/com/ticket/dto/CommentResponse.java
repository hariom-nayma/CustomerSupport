package com.ticket.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class CommentResponse {
    private Long id;
    private String content;
    private boolean internal;
    private String author;
    private LocalDateTime createdAt;
}

