package com.HarvestLink.api;

import com.HarvestLink.api.util.Role;
import com.HarvestLink.api.model.entity.User;
import com.HarvestLink.api.repository.UserRepository;
import lombok.Builder;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class ApiApplication {
	@Builder

	public static void main(String[] args) {
		SpringApplication.run(ApiApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(
			UserRepository userRepository,
			PasswordEncoder passwordEncoder
	) {
		return args -> {
			if (userRepository.findByEmail("admin@harvestlink.com").isEmpty()) {

                User admin;
                admin = User.builder()
						.firstName("Admin")
						.lastName("User")
						.email("admin@harvestlink.com")
						.password(passwordEncoder.encode("admin123"))
						.role(Role.ADMIN)
						.build();
                userRepository.save(admin);
				System.out.println("CREATED ADMIN USER");
			}
		};
	}
}