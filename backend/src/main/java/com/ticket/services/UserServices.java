package com.ticket.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Random;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.ticket.dto.AuthRequest;
import com.ticket.dto.UserRequest;
import com.ticket.dto.UserResponse;
import com.ticket.model.User;
import com.ticket.repo.UserReposatory;
import com.ticket.model.Role;
import com.ticket.security.JwtUtilToken;
import org.springframework.security.authentication.BadCredentialsException;
import java.util.stream.Collectors;

@Service
public class UserServices {
    @Autowired
    private UserReposatory userRepository;

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtilToken jwtUtilToken;

    public UserResponse register(UserRequest userRequest) {
        User user = mapper.map(userRequest, User.class);
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setRole(Role.CUSTOMER);
        user.setVerified(false);
        user.setOtp(generateOtp());
        return mapper.map(userRepository.save(user), UserResponse.class);
    }

    private String generateOtp() {
        return String.valueOf(new Random().nextInt(9000) + 1000);
    }

    public UserResponse login(AuthRequest authRequest) {
        User user = userRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        if (!passwordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }
        return mapper.map(user, UserResponse.class);
    }

    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(user -> mapper.map(user, UserResponse.class)).collect(Collectors.toList());
    }

    public UserResponse getCurrentUser(String token) {
        String email = jwtUtilToken.getUsernameFromToken(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return mapper.map(user, UserResponse.class);
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return mapper.map(user, UserResponse.class);
    }

    public UserResponse updateUser(Long id, UserRequest userRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setName(userRequest.getName());
        user.setEmail(userRequest.getEmail());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        return mapper.map(userRepository.save(user), UserResponse.class);
    }
}
