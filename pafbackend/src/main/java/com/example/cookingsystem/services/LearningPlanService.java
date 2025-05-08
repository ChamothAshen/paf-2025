package com.example.cookingsystem.services;

import com.example.cookingsystem.models.LearningPlan;
import com.example.cookingsystem.repositories.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LearningPlanService {
    @Autowired
    private LearningPlanRepository learningPlanRepository;

    public List<LearningPlan> getAllLearningPlans() {
        return learningPlanRepository.findAll();
    }

    public LearningPlan getLearningPlanById(String id) {
        return learningPlanRepository.findById(id).orElse(null);
    }

    public LearningPlan createLearningPlan(LearningPlan learningPlan) {
        learningPlan.setCreatedAt(LocalDateTime.now());
        learningPlan.setUpdatedAt(LocalDateTime.now());
        return learningPlanRepository.save(learningPlan);
    }

    public LearningPlan updateLearningPlan(String id, LearningPlan learningPlanDetails) {
        return learningPlanRepository.findById(id).map(learningPlan -> {
            learningPlan.setTitle(learningPlanDetails.getTitle());
            learningPlan.setDescription(learningPlanDetails.getDescription());
            learningPlan.setAuthorId(learningPlanDetails.getAuthorId());
            learningPlan.setTopics(learningPlanDetails.getTopics());
            learningPlan.setUpdatedAt(LocalDateTime.now());
            return learningPlanRepository.save(learningPlan);
        }).orElse(null);
    }

    public boolean deleteLearningPlan(String id) {
        if (learningPlanRepository.existsById(id)) {
            learningPlanRepository.deleteById(id);
            return true;
        }
        return false;
    }
}