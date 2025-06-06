package com.example.cookingsystem.controllers;

import com.example.cookingsystem.models.SharedPost;
import com.example.cookingsystem.services.SharedPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/shared-posts")
public class SharedPostController {
    @Autowired
    private SharedPostService sharedPostService;

    @PostMapping
    public ResponseEntity<SharedPost> sharePost(@RequestParam String postId, @RequestParam String userId) {
        SharedPost sharedPost = sharedPostService.sharePost(postId, userId);
        return ResponseEntity.ok(sharedPost);
    }

    // Retrieve shared posts by userId passed as a query parameter
    @GetMapping("/user")
    public List<SharedPost> getSharedPostsByUserId(@RequestParam String userId) {
        return sharedPostService.getSharedPostsByUserId(userId);
    }
}