package com.ticket.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.ui.ModelMap;
import com.ticket.config.ModelMapperConfig;
import com.ticket.dto.AuthRequest;
import com.ticket.dto.UserRequest;
import com.ticket.dto.UserResponse;
import com.ticket.model.User;
import com.ticket.repo.UserReposatory;
import com.ticket.security.JwtUtilToken;

@Service
public class UserService {
	
	@Autowired
	private UserReposatory userRepository;
	
	@Autowired
	private ModelMapper mapper;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private JwtUtilToken jwtUtilToken;
	
	@Autowired
	private EmailService emailService;
	
	public UserResponse register(UserRequest userRequest) {
		
		 if (userRepository.findByEmail(userRequest.getEmail()).isPresent()) {
	            throw new RuntimeException("Email already registered");
	        }
		 
		 User user = mapper.map(userRequest, User.class);
		 System.out.println(user);
		 String otp = String.valueOf(new Random().nextInt(900000) + 100000);
		    user.setOtp(otp);
		    user.setVerified(false);
		    user.setOtpGeneratedTime(LocalDateTime.now());
		    emailService.sendOtpEmail(user.getEmail(), "Your OTP Code", otp);

		 user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
		 
		 return mapper.map(userRepository.save(user), UserResponse.class);
		
	}
	
	 public UserResponse getCurrentUser(String token) {
	        String email = jwtUtilToken.getUsernameFromToken(token);

	        User user = userRepository.findByEmail(email)
	                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

	        return mapper.map(user, UserResponse.class);
	    }
	
	 //Dummy
	public UserResponse login(AuthRequest authRequest) {
		Optional<User> user = userRepository.findByEmail(authRequest.getEmail());
		if(user.isEmpty()) {
			throw new RuntimeException("User not Found with this email");
		}
		if(!authRequest.getPassword().equals(user.get().getPassword())) {
			throw new RuntimeException("Wrong Password");
			
		}
		return mapper.map(user.get(), UserResponse.class);
	}
	
	public List<UserResponse> getAllUsers(){
		return userRepository.findAll().stream().map(u-> mapper.map(u,UserResponse.class)).toList();
	}
	
	
}
