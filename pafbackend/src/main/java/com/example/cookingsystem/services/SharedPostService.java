package com.example.cookingsystem.services;

import com.example.cookingsystem.models.SharedPost;
import com.example.cookingsystem.repositories.SharedPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SharedPostService {
    @Autowired
    private SharedPostRepository sharedPostRepository;

    public SharedPost sharePost(String postId, String userId) {
        SharedPost sharedPost = new SharedPost();
        sharedPost.setPostId(postId);
        sharedPost.setUserId(userId);
        return sharedPostRepository.save(sharedPost);
    }

    public List<SharedPost> getSharedPostsByUserId(String userId) {
        return sharedPostRepository.findByUserId(userId);
    }
}