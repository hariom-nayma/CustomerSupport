package com.ticket.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class NotificationController {
	
	@Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendTicketUpdate(Long ticketId, Object message) {
        messagingTemplate.convertAndSend("/topic/ticket-updates/" + ticketId, message);
    }

    public void sendNewTicket(Object message) {
        messagingTemplate.convertAndSend("/topic/tickets", message);
    }
}
