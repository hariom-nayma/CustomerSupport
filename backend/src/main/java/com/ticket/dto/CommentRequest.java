package com.ticket.dto;

import lombok.Data;

@Data
public class CommentRequest {
    private String content;
    private boolean internal;
}
