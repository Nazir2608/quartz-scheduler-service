package com.example.scheduler.service;

import com.example.scheduler.Repository.UpcomingJobRepository;
import com.example.scheduler.dto.JobRequest;
import com.example.scheduler.entity.UpcomingJobEntity;
import com.example.scheduler.job.ScheduledJob;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobService {

    private final Scheduler scheduler;
    private final UpcomingJobRepository upcomingRepo;
    private final ObjectMapper mapper = new ObjectMapper();

    public String schedule(JobRequest req) throws SchedulerException, JsonProcessingException {

        ZonedDateTime zdt = ZonedDateTime.of(req.getDateTime(), req.getTimeZone());
        String jobId = UUID.randomUUID().toString();

        // Convert payload to JSON string
        String payloadJson = mapper.writeValueAsString(req.getPayload());

        // Save to Upcoming table
        UpcomingJobEntity entity = new UpcomingJobEntity();
        entity.setJobId(jobId);
        entity.setJobGroup("jobs");
        entity.setCallbackUrl(req.getCallbackUrl());
        entity.setPayload(payloadJson);
        entity.setStatus("SCHEDULED");
        entity.setScheduledAt(java.time.LocalDateTime.now());
        entity.setRunAt(java.time.LocalDateTime.ofInstant(zdt.toInstant(), java.time.ZoneId.systemDefault()));
        upcomingRepo.save(entity);

        // Add to JobDataMap  String
        JobDataMap map = new JobDataMap();
        map.put("callbackUrl", req.getCallbackUrl());
        map.put("payload", payloadJson);

        JobDetail jobDetail = JobBuilder.newJob(ScheduledJob.class)
                .withIdentity(jobId, "jobs")
                .usingJobData(map)
                .storeDurably()
                .build();

        Trigger trigger = TriggerBuilder.newTrigger()
                .forJob(jobDetail)
                .withIdentity(jobId + "-trigger", "triggers")
                .startAt(Date.from(zdt.toInstant()))
                .withSchedule(SimpleScheduleBuilder.simpleSchedule()
                        .withMisfireHandlingInstructionFireNow())
                .build();

        scheduler.scheduleJob(jobDetail, trigger);

        log.info("Job scheduled | jobId={} | runAt={} | callbackUrl={}",
                jobId, zdt, req.getCallbackUrl());

        return jobId;
    }

    public boolean cancel(String jobId) throws SchedulerException {
        JobKey key = new JobKey(jobId, "jobs");
        boolean deleted = scheduler.deleteJob(key);

        if (deleted) {
            upcomingRepo.findById(jobId).ifPresent(upcomingRepo::delete);
            log.info("Job cancelled | jobId={}", jobId);
        } else {
            log.warn("Cancel request failed | jobId={} not found", jobId);
        }

        return deleted;
    }

    public List<UpcomingJobEntity> listUpcoming() {
        return upcomingRepo.findAll();
    }
}
