package com.HarvestLink.api.service;

import java.util.List;
import java.util.Map;

import com.HarvestLink.api.model.dto.UserDto;

public interface AdminService {

    List<UserDto> getAllUsers();

    List<UserDto> getFarmers();

    List<UserDto> getBusiness();

    Object updateUser(UserDto userDto);

    Object deleteUser(String userEmail);

    Map<String,Object> getFarmersTotal();

    Map<String, Object> getBusinessTotal();
}
