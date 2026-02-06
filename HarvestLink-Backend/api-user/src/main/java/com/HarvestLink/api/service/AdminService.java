package com.HarvestLink.api.service;

import java.util.List;

import com.HarvestLink.api.model.dto.UserDto;

public interface AdminService {

    List<UserDto> getAllUsers();

    List<UserDto> getFarmers();

    List<UserDto> getBusiness();

    Object updateUser(UserDto userDto);

    Object deleteUser(String userEmail);

    int getFarmersTotal();
}
