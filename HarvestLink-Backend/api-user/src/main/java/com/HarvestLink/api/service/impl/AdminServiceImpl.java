package com.HarvestLink.api.service.impl;

import com.HarvestLink.api.model.dto.UserDto;
import com.HarvestLink.api.model.entity.User;
import com.HarvestLink.api.repository.UserRepository;
import com.HarvestLink.api.service.AdminService;
import com.HarvestLink.api.util.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> UserDto.builder()
                        .id(user.getId())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .email(user.getEmail())
                        .contactNo(user.getContactNo())
                        .address(user.getAddress())
                        .role(user.getRole())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDto> getFarmers() {
        List<com.HarvestLink.api.model.entity.User> farmers = userRepository.findByRole(Role.FARMER);

        // 2. Map Entities to DTOs
        return farmers.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDto> getBusiness() {
        List<com.HarvestLink.api.model.entity.User> farmers = userRepository.findByRole(Role.BUYER);

        // 2. Map Entities to DTOs
        return farmers.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public String updateUser(UserDto userDto) {

        User user = userRepository.getUsersByEmail(userDto.getEmail());

        if (user == null) {
            return "User not found";
        }

        user.setAddress(userDto.getAddress());
        user.setContactNo(userDto.getContactNo());
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());

        userRepository.save(user);

        return "Update Success";
    }

    @Override
    public Object deleteUser(String userEmail) {
        if(userEmail == null){
            return "User Email is Empty";
        }
        userRepository.deleteByEmail(userEmail);
        return "Delete Success";
    }


    // Helper method to avoid duplicating mapping logic
    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .contactNo(user.getContactNo())
                .address(user.getAddress())
                .role(user.getRole())
                .build();
    }
}