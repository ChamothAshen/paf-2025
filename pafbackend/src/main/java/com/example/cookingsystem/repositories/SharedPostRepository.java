package com.example.cookingsystem.repositories;

import com.example.cookingsystem.models.SharedPost;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SharedPostRepository extends MongoRepository<SharedPost, String> {
    List<SharedPost> findByUserId(String userId);
}