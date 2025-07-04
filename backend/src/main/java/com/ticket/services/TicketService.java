package com.ticket.services;

import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ticket.controller.NotificationController;
import com.ticket.dto.TicketRequest;
import com.ticket.dto.TicketResponse;
import com.ticket.model.Status;
import com.ticket.model.Ticket;
import com.ticket.model.User;
import com.ticket.repo.TicketRepository;
import com.ticket.repo.UserReposatory;

@Service
public class TicketService {
	
	@Autowired
	private TicketRepository ticketRepository;
	
	@Autowired
	private UserReposatory userRepository;
	
	@Autowired
	private ModelMapper mapper;
	
	@Autowired
	private NotificationController notificationController;
	
	public TicketResponse createTicket(TicketRequest request, String creatorEmail) {
		User user =  userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
		Ticket ticket = new Ticket();
		
		ticket.setTitle(request.getTitle());
		ticket.setDescription(request.getDescription());
		ticket.setPriority(request.getPriority());
		ticket.setStatus(Status.OPEN);
		ticket.setCreatedBy(user);
		ticket.setCreatedAt(LocalDateTime.now());
		ticket.setUpdatedAt(LocalDateTime.now());
		
		TicketResponse response = mapper.map(ticketRepository.save(ticket), TicketResponse.class );
		notificationController.sendNewTicket(response);
		return response;
	}
	
	public List<TicketResponse> getAllTickets(){
		return ticketRepository.findAll().stream().map(t -> mapper.map(t, TicketResponse.class)).toList();
	}
	
	public List<TicketResponse> getTicketsByUser(String email){
		User user =  userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
		
		return ticketRepository.findByCreatedBy(user).stream().map(t-> mapper.map(t, TicketResponse.class)).toList();
		
		
	}
	
	public TicketResponse getTicketById(Long id) {
		 Ticket ticket = ticketRepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("Ticket not found"));
		 
		 return mapper.map(ticket, TicketResponse.class);
	}
	
	public TicketResponse updateTicketStatus(Long id, Status status, String assignee) {
		Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
		
		ticket.setStatus(status);
		
		if(assignee!=null) {
			User user = userRepository.findByEmail(assignee).orElseThrow(()-> new RuntimeException("Assignee Not Found"));
			ticket.setAssignedTo(user);
		}
		ticket.setUpdatedAt(LocalDateTime.now());
		
		TicketResponse response = mapper.map(ticketRepository.save(ticket), TicketResponse.class);
	    notificationController.sendTicketUpdate(id, response);
		
		return response;
		
	}
}
 