package com.ticket.security;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Component
public class JwtUtilToken {

	@Value("${app.jwtSecret}")
    private String jwtSecret;
	
    @Value("${app.jwtExpirationInMs}")
    private long jwtExpirationInMs;
    
    private Key key;
    
    @PostConstruct
    public void init() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }
    
    public String generateToken(UserDetails userDetails) {
    	Map<String, Object> claims = new HashMap<>();
    	claims.put("authorities", userDetails.getAuthorities().stream()
    	        .map(GrantedAuthority::getAuthority)
    	        .collect(Collectors.toList()));
    	
       // Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 24*60*60*1000)) // 24 hours
                .signWith(key,SignatureAlgorithm.HS256)
                .compact();
    }
    public String getUsernameFromToken(String token) {
    	 if (token == null || token.trim().isEmpty() || !token.contains(".")) {
    	        throw new IllegalArgumentException("Invalid JWT token received");
    	    }
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token.replace("Bearer ", ""))
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return username.equals(userDetails.getUsername());
    }
}

