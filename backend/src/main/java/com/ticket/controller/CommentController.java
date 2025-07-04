package com.ticket.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ticket.dto.CommentRequest;
import com.ticket.dto.CommentResponse;
import com.ticket.services.CommentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tickets/{ticketId}/comments")
//@RequiredArgsConstructor
public class CommentController {
	
	@Autowired
    private CommentService commentService;

    @PostMapping
    //@PreAuthorize("hasAnyRole('ADMIN','CSR','CUSTOMER')")
    public ResponseEntity<CommentResponse> addComment(@PathVariable Long ticketId,
                                                      @RequestBody CommentRequest request,
                                                      Principal principal) {
        CommentResponse response = commentService.addComment(ticketId, request, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    //@PreAuthorize("hasAnyRole('ADMIN','CSR','CUSTOMER')")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long ticketId) {
        return ResponseEntity.ok(commentService.getCommentsByTicket(ticketId));
    }
}
