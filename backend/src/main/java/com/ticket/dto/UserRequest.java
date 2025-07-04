package com.ticket.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
	
    @NotBlank(message = "Name is required")
	private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
	private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
	private String password;
    
    @NotNull(message = "Role is required")
	private String role;
}
