package com.example.scheduler.controller;

import com.example.scheduler.Repository.HistoryJobRepository;
import com.example.scheduler.Repository.UpcomingJobRepository;
import com.example.scheduler.dto.JobRequest;
import com.example.scheduler.dto.JobResponse;
import com.example.scheduler.entity.HistoryJobEntity;
import com.example.scheduler.entity.UpcomingJobEntity;
import com.example.scheduler.service.JobService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.SchedulerException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SchedulerController {

    private final JobService jobService;
    private final UpcomingJobRepository upcomingRepo;
    private final HistoryJobRepository historyRepo;

    @PostMapping("/schedule/job")
    public ResponseEntity<JobResponse> schedule(@Valid @RequestBody JobRequest request) {
        log.info("Received job schedule request for callbackUrl={}, runAt={}", request.getCallbackUrl(), request.getDateTime());

        try {
            String jobId = jobService.schedule(request);
            log.info("Job scheduled successfully | jobId={} | runAt={} | url={}", jobId, request.getDateTime(), request.getCallbackUrl());

            return ResponseEntity.ok(new JobResponse(true, jobId, "jobs", "SCHEDULED", "Job scheduled"));

        } catch (SchedulerException | JsonProcessingException e) {
            log.error("Failed to schedule job | reason={}", e.getMessage(), e);

            return ResponseEntity.internalServerError().body(new JobResponse(false, null, null, null, "Failed: " + e.getMessage()));
        }
    }

    @GetMapping("/jobs/upcoming")
    public ResponseEntity<List<UpcomingJobEntity>> listUpcoming() {
        log.info("Fetching all upcoming jobs...");
        return ResponseEntity.ok(upcomingRepo.findAll());
    }

    @GetMapping("/jobs/history")
    public ResponseEntity<List<HistoryJobEntity>> listHistory() {
        log.info("Fetching executed job history...");
        return ResponseEntity.ok(historyRepo.findAll());
    }

    @GetMapping("/jobs/{jobId}")
    public ResponseEntity<?> getJob(@PathVariable String jobId) {
        log.info("Fetching job details - jobId={}", jobId);

        return upcomingRepo.findById(jobId).<ResponseEntity<?>>map(job -> {
            log.info("Found upcoming job - jobId={}", jobId);
            return ResponseEntity.ok(job);
        }).orElseGet(() -> historyRepo.findById(jobId).<ResponseEntity<?>>map(job -> {
            log.info("Found completed job - jobId={}", jobId);
            return ResponseEntity.ok(job);
        }).orElseGet(() -> {
            log.warn("Job not found - jobId={}", jobId);
            return ResponseEntity.notFound().build();
        }));
    }

    @DeleteMapping("/jobs/{jobId}")
    public ResponseEntity<?> cancel(@PathVariable String jobId) {
        log.info("Cancel request received - jobId={}", jobId);
        try {
            boolean ok = jobService.cancel(jobId);
            if (ok) {
                log.info("Job cancelled - jobId={}", jobId);
                return ResponseEntity.ok("Cancelled");
            } else {
                log.warn("Cannot cancel - jobId={} (not found)", jobId);
                return ResponseEntity.notFound().build();
            }
        } catch (SchedulerException e) {
            log.error(" Failed to cancel jobId={} - {}", jobId, e.getMessage());
            return ResponseEntity.internalServerError().body("Failed to cancel job: " + e.getMessage());
        }
    }

    @PutMapping("/jobs/{jobId}")
    public ResponseEntity<JobResponse> updateJob(@PathVariable String jobId,
                                                 @Valid @RequestBody JobRequest request) {
        try {
            jobService.updateJob(jobId, request);

            return ResponseEntity.ok(new JobResponse(
                    true, jobId, "jobs", "UPDATED", "Job updated successfully"));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new JobResponse(false, jobId, null, "FAILED", e.getMessage()));

        } catch (Exception e) {
            log.error("Update failed for job {}", jobId, e);
            return ResponseEntity.internalServerError()
                    .body(new JobResponse(false, jobId, null, "FAILED",
                            "Unexpected error: " + e.getMessage()));
        }
    }


}
