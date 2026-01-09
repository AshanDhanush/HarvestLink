package com.HarvestLink.api.controller;

import com.HarvestLink.api.model.dto.ProductRequest;
import com.HarvestLink.api.model.dto.RegisterRequest;
import com.HarvestLink.api.model.dto.UserDto;
import com.HarvestLink.api.service.AdminProductProducerService;
import com.HarvestLink.api.service.AdminService;
import com.HarvestLink.api.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    private final AuthService authService;


    private final AdminProductProducerService adminProductProducerService;

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("get/farmers")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UserDto>> getFarmers(){
        return ResponseEntity.ok(adminService.getFarmers());
    }

    @GetMapping("/get/businesses")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UserDto>> getBusiness(){
        return ResponseEntity.ok(adminService.getBusiness());
    }

    @PostMapping("user/register")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> userRegister(@RequestBody RegisterRequest request){
        return ResponseEntity.ok(authService.register(request));
    }

    @PutMapping("user/update")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateUser(@RequestBody UserDto userDto){
        return ResponseEntity.ok(adminService.updateUser(userDto));
    }

    @DeleteMapping("user/delete/{userEmail}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable String userEmail){
        return ResponseEntity.ok(adminService.deleteUser(userEmail));
    }

    @PostMapping("product/saveByAdmin")
    public ResponseEntity<?> saveProductByAdmin(@RequestBody ProductRequest productRequest){
        return ResponseEntity.ok(adminProductProducerService.sendProduct(productRequest));
    }








}