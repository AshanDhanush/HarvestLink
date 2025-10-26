package com.HarvestLink.api.service;

import com.HarvestLink.api.dto.AuthResponse;
import com.HarvestLink.api.dto.LoginRequest;
import com.HarvestLink.api.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}