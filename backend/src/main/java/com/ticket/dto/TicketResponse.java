package com.ticket.dto;

import java.time.LocalDateTime;

import com.ticket.model.Priority;
import com.ticket.model.Status;
import com.ticket.model.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketResponse {
    private Long id;
    private String title;
    private String description;
    private Priority priority;
    private Status status;
    private User assignedTo;
    private User createdBy;
    private LocalDateTime createdAt;
}

