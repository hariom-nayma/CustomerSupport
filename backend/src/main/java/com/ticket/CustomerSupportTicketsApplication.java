package com.ticket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.mail.javamail.JavaMailSender;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class CustomerSupportTicketsApplication {
	
	 
	public static void main(String[] args) {
		SpringApplication.run(CustomerSupportTicketsApplication.class, args);
	}

}
