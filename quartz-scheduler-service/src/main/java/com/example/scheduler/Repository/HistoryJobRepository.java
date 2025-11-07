package com.example.scheduler.Repository;

import com.example.scheduler.entity.HistoryJobEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistoryJobRepository extends JpaRepository<HistoryJobEntity, String> {
}
