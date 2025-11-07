package com.example.scheduler.Repository;

import com.example.scheduler.entity.UpcomingJobEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UpcomingJobRepository extends JpaRepository<UpcomingJobEntity, String> {
}
