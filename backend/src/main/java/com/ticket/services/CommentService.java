package com.ticket.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ticket.controller.NotificationController;
import com.ticket.dto.CommentRequest;
import com.ticket.dto.CommentResponse;
import com.ticket.model.Comment;
import com.ticket.model.Ticket;
import com.ticket.model.User;
import com.ticket.repo.CommentRepository;
import com.ticket.repo.TicketRepository;
import com.ticket.repo.UserReposatory;


@Service
//@RequiredArgsConstructor
public class CommentService {
	
	@Autowired
    private CommentRepository commentRepository;
	
	@Autowired
    private TicketRepository ticketRepository;
	
	@Autowired
    private UserReposatory userRepository;
	
	@Autowired
	private NotificationController notificationController;

    public CommentResponse addComment(Long ticketId, CommentRequest request, String authorEmail) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        User user = userRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setInternal(request.isInternal());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setTicket(ticket);
        comment.setUser(user);

        Comment savedComment = commentRepository.save(comment);
        
        CommentResponse response = mapToResponse(savedComment);
        notificationController.sendTicketUpdate(ticketId, response);


        return response;
    }

    public List<CommentResponse> getCommentsByTicket(Long ticketId) {
        return commentRepository.findByTicketId(ticketId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    private CommentResponse mapToResponse(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setInternal(comment.isInternal());
        response.setAuthor(comment.getUser().getName()+"\t\t\t"+comment.getUser().getEmail());
        response.setCreatedAt(comment.getCreatedAt());
        return response;
    }
}

