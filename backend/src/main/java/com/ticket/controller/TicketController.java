package com.ticket.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ticket.dto.TicketRequest;
import com.ticket.dto.TicketResponse;
import com.ticket.model.Status;
import com.ticket.services.TicketService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/ticket")
public class TicketController {
	
	@Autowired
	private TicketService ticketService;
	
	@PostMapping
	public ResponseEntity<TicketResponse> createTicket(@RequestBody TicketRequest  request, Principal principal){
		System.out.println(principal.getName());
		return new ResponseEntity<>(ticketService.createTicket(request, principal.getName()),HttpStatus.CREATED);
	}
	
	@GetMapping
	public ResponseEntity<List<TicketResponse>> getAllTicket(){
		return ResponseEntity.ok(ticketService.getAllTickets());
	}
	
	@GetMapping("/user")
	public ResponseEntity<List<TicketResponse>> getAllTicketByUser(Principal principal){
		return ResponseEntity.ok(ticketService.getTicketsByUser(principal.getName()));
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<TicketResponse> getTicket(@PathVariable Long id){
		return ResponseEntity.ok(ticketService.getTicketById(id));
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<TicketResponse> updateTicketStatus(@PathVariable Long id, @RequestParam Status status, @RequestParam(required = false) String assignee){
		  return ResponseEntity.ok(ticketService.updateTicketStatus(id, status, assignee));
	}
}
