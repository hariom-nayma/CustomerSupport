package com.ticket.dto;

import com.ticket.model.Priority;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketRequest {
    private String title;
    private String description;
    private Priority priority;
}

