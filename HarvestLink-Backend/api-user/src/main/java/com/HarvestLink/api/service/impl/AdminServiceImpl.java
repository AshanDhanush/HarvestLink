package com.HarvestLink.api.service.impl;

import com.HarvestLink.api.model.dto.UserDto;
import com.HarvestLink.api.model.entity.User;
import com.HarvestLink.api.repository.UserRepository;
import com.HarvestLink.api.service.AdminService;
import com.HarvestLink.api.util.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    @Override
    public Map<String,Object> getFarmersTotal() {
       LocalDate now = LocalDate.now();

       LocalDate startCurrentMonth = now.withDayOfMonth(1);
       LocalDate endCurrentMonth  = now.withDayOfMonth(now.lengthOfMonth());

       LocalDate startLastMonth = now.minusMonths(1).withDayOfMonth(1);
       LocalDate endLastMonth = now.minusMonths(1).withDayOfMonth(now.minusMonths(1).lengthOfMonth());

       List<User> currentMonthUsers = userRepository.findByCreatedDateBetween(startCurrentMonth,endCurrentMonth);
       List<User> lasMonthUsers  = userRepository.findByCreatedDateBetween(startLastMonth,endLastMonth);

       int countOfCurrentMonthFarmers = 0;
       int lastMonthFarmers = 0;
      for(User u : currentMonthUsers){
          if(u.getRole().equals(Role.FARMER)){
              countOfCurrentMonthFarmers++;
          }
      }


        for(User u : lasMonthUsers){
            if(u.getRole().equals(Role.FARMER)){
                lastMonthFarmers++;
            }
        }
        double percentageChange;
        if (lastMonthFarmers ==0){
            percentageChange = (countOfCurrentMonthFarmers>0) ? 100.0 : 0.0;
        } else {
           percentageChange = ((double) (countOfCurrentMonthFarmers - lastMonthFarmers) / lastMonthFarmers) * 100 ;
        }

        List<User> allFarmers = userRepository.findByRole(Role.FARMER);
        int allFarmersTotal = allFarmers.size();

        Map<String,Object> response = new HashMap<>();
        response.put("percentageChangeAccordingToMonth", Math.round(percentageChange*100.0)/100.0);
        response.put("TotalFarmers",allFarmersTotal);

        return response;

    }

    @Override
    public Map<String, Object> getBusinessTotal() {
        LocalDate now = LocalDate.now();

        LocalDate startCurrentMonth = now.withDayOfMonth(1);
        LocalDate endCurrentMonth  = now.withDayOfMonth(now.lengthOfMonth());

        LocalDate startLastMonth = now.minusMonths(1).withDayOfMonth(1);
        LocalDate endLastMonth = now.minusMonths(1).withDayOfMonth(now.minusMonths(1).lengthOfMonth());

        List<User> currentMonthUsers = userRepository.findByCreatedDateBetween(startCurrentMonth,endCurrentMonth);
        List<User> lasMonthUsers  = userRepository.findByCreatedDateBetween(startLastMonth,endLastMonth);

        int countOfCurrentMonthBuyers = 0;
        int lastMonthBuyers = 0;
        for(User u : currentMonthUsers){
            if(u.getRole().equals(Role.BUYER)){
                countOfCurrentMonthBuyers++;
            }
        }


        for(User u : lasMonthUsers){
            if(u.getRole().equals(Role.BUYER)){
                lastMonthBuyers++;
            }
        }
        double percentageChange;
        if (lastMonthBuyers ==0){
            percentageChange = (countOfCurrentMonthBuyers>0) ? 100.0 : 0.0;
        } else {
            percentageChange = ((double) (countOfCurrentMonthBuyers - lastMonthBuyers) / lastMonthBuyers) * 100 ;
        }

        List<User> allFarmers = userRepository.findByRole(Role.BUYER);
        int allBuyersTotal = allFarmers.size();

        Map<String,Object> response = new HashMap<>();
        response.put("percentageChangeAccordingToMonth", Math.round(percentageChange*100.0)/100.0);
        response.put("TotalBuyers",allBuyersTotal);
        System.out.println(percentageChange);
        System.out.println(allBuyersTotal);

        return response;

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