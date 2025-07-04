package com.ticket.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ticket.dto.AuthRequest;
import com.ticket.dto.AuthResponse;
import com.ticket.dto.OtpRequest;
import com.ticket.dto.ResetPasswordRequest;
import com.ticket.dto.UserRequest;
import com.ticket.dto.UserResponse;
import com.ticket.model.User;
import com.ticket.repo.UserReposatory;
import com.ticket.security.CustomUserDetailsService;
import com.ticket.security.JwtUtilToken;
import com.ticket.services.EmailService;
import com.ticket.services.UserService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private JwtUtilToken jwtUtilToken;
	
	@Autowired
	private UserReposatory userRepository;
	
	@Autowired
    private CustomUserDetailsService userDetailsService;
	
	@Autowired
	private EmailService emailService;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody AuthRequest authRequest){
//		 Authentication authentication = authenticationManager.authenticate(
//		            new UsernamePasswordAuthenticationToken(
//		                authRequest.getEmail(),
//		                authRequest.getPassword()
//		            )
//		        );
//		 
//	        SecurityContextHolder.getContext().setAuthentication(authentication);
//	        
//	        String jwt = jwtUtilToken.generateToken(authentication);
		
		  authenticationManager.authenticate(
		            new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
		        );
		  
		  Optional<User> user= userRepository.findByEmail(authRequest.getEmail());
		  if(user.isEmpty())
			  throw new RuntimeException("No user found with this Email");
		  
		  
		        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getEmail());
		        final String jwtToken = jwtUtilToken.generateToken(userDetails);
		        return ResponseEntity.ok(new AuthResponse(jwtToken));
	}
	
	@PostMapping("/register")
		public ResponseEntity<?> register(@RequestBody UserRequest userRequest){
		return ResponseEntity.ok(userService.register(userRequest));
	}
	
	 @GetMapping("/me")
	    public User getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
	    	if(userDetails==null)
	    		throw new RuntimeException("You are not Logged in, Please Login to check!");
	        return userRepository.findByEmail(userDetails.getUsername())
	                .orElseThrow(() -> new RuntimeException("User not found"));
	    }
	 @GetMapping("/all")
	 public ResponseEntity<List<UserResponse>> getAllUsers(){
		 return ResponseEntity.ok(userService.getAllUsers());
	 }
	 
	 @PostMapping("/verify-otp")
	 public ResponseEntity<?> verifyOtp(@RequestBody OtpRequest request) {
	     
		 System.out.println("Received Email: " + request.getEmail());
		    System.out.println("Received OTP: " + request.getOtp());
		    
		 User user = userRepository.findByEmail(request.getEmail())
	             .orElseThrow(() -> new RuntimeException("User not found"));
		 System.out.println("Stored OTP: " + user.getOtp());

	     if (user.getOtp().equals(request.getOtp()) 
	         && user.getOtpGeneratedTime().plusMinutes(5).isAfter(LocalDateTime.now())) {
	         user.setVerified(true);
	         user.setOtp(null);
	         userRepository.save(user);
	         return ResponseEntity.ok(Map.of("message", "Email verified successfully!"));
	     }
	     return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired OTP!");
	 }
	 
	 @PostMapping("/forgot-password")
	 public ResponseEntity<?> forgotPassword(@RequestParam String email) {
	     User user = userRepository.findByEmail(email)
	         .orElseThrow(() -> new RuntimeException("User not found"));

	     String otp = String.valueOf(new Random().nextInt(900000) + 100000);
	     user.setOtp(otp);
	     //user.setVerified(false);
	     user.setOtpGeneratedTime(LocalDateTime.now());
	     userRepository.save(user);

	     emailService.sendOtpEmail(email, "Your Password Reset OTP",  otp);
	     return ResponseEntity.ok(Map.of("message","OTP sent successfully!"));
	 }
	 
	 @PostMapping("/reset-password")
	 public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
	     User user = userRepository.findByEmail(request.getEmail())
	         .orElseThrow(() -> new RuntimeException("User not found"));

	     user.setPassword(passwordEncoder.encode(request.getNewPassword()));
	     user.setOtp(null);
	     userRepository.save(user);

	     return ResponseEntity.ok(Map.of("message","Password reset successfully!"));
	 }

}
