package com.HarvestLink.api.service;

import com.HarvestLink.api.model.dto.AuthResponse;
import com.HarvestLink.api.model.dto.LoginRequest;
import com.HarvestLink.api.model.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}