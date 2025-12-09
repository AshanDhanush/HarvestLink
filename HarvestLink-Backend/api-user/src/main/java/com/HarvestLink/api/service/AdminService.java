package com.HarvestLink.api.service;

import java.util.List;

import com.HarvestLink.api.model.dto.UserDto;

public interface AdminService {

    List<UserDto> getAllUsers();

    List<UserDto> getFarmers();
}
