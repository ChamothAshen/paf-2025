package com.example.cookingsystem.controllers;

import com.example.cookingsystem.models.LearningPlan;
import com.example.cookingsystem.services.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning-plans")
public class LearningPlanController {
    @Autowired
    private LearningPlanService learningPlanService;

    @GetMapping
    public List<LearningPlan> getAllLearningPlans() {
        return learningPlanService.getAllLearningPlans();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningPlan> getLearningPlanById(@PathVariable String id) {
        LearningPlan learningPlan = learningPlanService.getLearningPlanById(id);
        return learningPlan != null ? ResponseEntity.ok(learningPlan) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public LearningPlan createLearningPlan(@RequestBody LearningPlan learningPlan) {
        return learningPlanService.createLearningPlan(learningPlan);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> updateLearningPlan(@PathVariable String id, @RequestBody LearningPlan learningPlanDetails) {
        LearningPlan updatedLearningPlan = learningPlanService.updateLearningPlan(id, learningPlanDetails);
        return updatedLearningPlan != null ? ResponseEntity.ok(updatedLearningPlan) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningPlan(@PathVariable String id) {
        return learningPlanService.deleteLearningPlan(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}