package com.HarvestLink.api.service.impl;

import com.HarvestLink.api.dto.AdminLoginRequest;
import com.HarvestLink.api.dto.AuthResponse;
import com.HarvestLink.api.dto.LoginRequest;
import com.HarvestLink.api.dto.RegisterRequest;
import com.HarvestLink.api.dto.UserDto;
import com.HarvestLink.api.entity.User;
import com.HarvestLink.api.repository.UserRepository;
import com.HarvestLink.api.security.JwtService;
import com.HarvestLink.api.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .contactNo(request.getContactNo())
                .address(request.getAddress())
                .role(request.getRole())
                .build();

        User savedUser = userRepository.save(user);

        var jwtToken = jwtService.generateToken(user);

        var userDto = UserDto.builder()
                .id(savedUser.getId())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .email(savedUser.getEmail())
                .contactNo(savedUser.getContactNo())
                .address(savedUser.getAddress())
                .role(savedUser.getRole())
                .build();

        return AuthResponse.builder()
                .token(jwtToken)
                .user(userDto)
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + request.getEmail()));

        var jwtToken = jwtService.generateToken(user);

        var userDto = UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .contactNo(user.getContactNo())
                .address(user.getAddress())
                .role(user.getRole())
                .build();

        return AuthResponse.builder()
                .token(jwtToken)
                .user(userDto)
                .build();
    }

    @Override
    public AuthResponse adminLogin(AdminLoginRequest request) {
        if (!"adminhl".equals(request.getUsername()) || !"789456".equals(request.getPassword())) {
            throw new BadCredentialsException("Invalid admin credentials");
        }

        var user = userRepository.findByEmail("adminhl@harvestlink.com")
                .orElseThrow(() -> new UsernameNotFoundException("Admin user not found"));

        var jwtToken = jwtService.generateToken(user);

        var userDto = UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .contactNo(user.getContactNo())
                .address(user.getAddress())
                .role(user.getRole())
                .build();

        return AuthResponse.builder()
                .token(jwtToken)
                .user(userDto)
                .build();
    }
}