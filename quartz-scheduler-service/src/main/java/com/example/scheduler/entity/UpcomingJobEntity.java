package com.example.scheduler.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "upcoming_jobs")
@Getter
@Setter
public class UpcomingJobEntity {
    @Id
    private String jobId;
    private String jobGroup;
    private String callbackUrl;
    private String payload; // JSON or plain string
    private String status; // SCHEDULED, IN_PROGRESS
    private LocalDateTime scheduledAt;
    private LocalDateTime runAt; // planned execution time

}
