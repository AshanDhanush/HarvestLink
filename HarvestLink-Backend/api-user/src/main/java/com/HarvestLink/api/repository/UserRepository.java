package com.HarvestLink.api.repository;

import java.util.List;
import java.util.Optional;

import com.HarvestLink.api.model.dto.UserDto;
import com.HarvestLink.api.util.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.HarvestLink.api.model.entity.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);

    List<User> findByRole(Role role);

}