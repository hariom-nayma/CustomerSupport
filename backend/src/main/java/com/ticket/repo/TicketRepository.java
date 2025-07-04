package com.ticket.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ticket.model.Ticket;
import com.ticket.model.User;

public interface TicketRepository extends JpaRepository<Ticket, Long>{
	List<Ticket> findByCreatedBy(User user);
}
