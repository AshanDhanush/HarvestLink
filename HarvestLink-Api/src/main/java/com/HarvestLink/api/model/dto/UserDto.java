package com.HarvestLink.api.model.dto;

import com.HarvestLink.api.util.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String contactNo;
    private String address;
    private Role role;
}