package com.example.scheduler.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "history_jobs")
@Getter
@Setter
public class HistoryJobEntity {
    @Id
    private String jobId;
    private String jobGroup;
    private String callbackUrl;
    private String payload;
    private String status; // SUCCESS, FAILED
    private LocalDateTime scheduledAt;
    private LocalDateTime executedAt;
    private String errorMessage; // optional

}
