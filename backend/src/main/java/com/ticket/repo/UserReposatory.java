package com.ticket.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ticket.model.User;

public interface UserReposatory extends JpaRepository<User, Long> {
	Optional<User> findByEmail(String email);
}
