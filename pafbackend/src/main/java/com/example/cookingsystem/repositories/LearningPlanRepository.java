package com.example.cookingsystem.repositories;


import com.example.cookingsystem.models.LearningPlan;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LearningPlanRepository extends MongoRepository<LearningPlan,String>{
}