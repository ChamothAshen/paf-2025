package com.example.cookingsystem.repositories;

import com.example.cookingsystem.models.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findAllByDeleteStatusFalse();
    List<Notification> findByReceiverIdAndDeleteStatusFalse(String receiverId);
    Optional<Notification> findByIdAndDeleteStatusFalse(String id);
}