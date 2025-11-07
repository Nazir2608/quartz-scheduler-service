package com.example.scheduler.job;

import com.example.scheduler.Repository.HistoryJobRepository;
import com.example.scheduler.Repository.UpcomingJobRepository;
import com.example.scheduler.entity.HistoryJobEntity;
import com.example.scheduler.entity.UpcomingJobEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class ScheduledJob extends QuartzJobBean {

    private final UpcomingJobRepository upcomingRepo;
    private final HistoryJobRepository historyRepo;
    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    protected void executeInternal(JobExecutionContext context) throws JobExecutionException {

        JobDataMap data = context.getMergedJobDataMap();

        String jobId = context.getJobDetail().getKey().getName();
        String callbackUrl = data.getString("callbackUrl");
        String payloadJson = (String) data.get("payload");

        log.info("Executing Job — ID: {} | Callback: {}", jobId, callbackUrl);

        Optional<UpcomingJobEntity> opt = upcomingRepo.findById(jobId);
        if (opt.isEmpty()) throw new JobExecutionException("Upcoming job not found: " + jobId);

        UpcomingJobEntity upcoming = opt.get();
        upcoming.setStatus("IN_PROGRESS");
        upcomingRepo.save(upcoming);

        HistoryJobEntity history = new HistoryJobEntity();
        history.setJobId(jobId);
        history.setCallbackUrl(callbackUrl);
        history.setPayload(payloadJson);
        history.setScheduledAt(upcoming.getScheduledAt());

        try {
            HttpEntity<String> httpReq = new HttpEntity<>(payloadJson);
            ResponseEntity<String> resp = restTemplate.postForEntity(callbackUrl, httpReq, String.class);

            history.setStatus("SUCCESS");
            history.setExecutedAt(LocalDateTime.now());
            history.setErrorMessage(null);

            // PRINT CALLBACK RESPONSE BODY
            log.info("Job Executed Successfully! ID: {} | Status: {} | Response: {}",
                    jobId, resp.getStatusCodeValue(), resp.getBody());

        } catch (Exception ex) {
            log.error("Job Execution Failed! ID: {} | Error: {}", jobId, ex.getMessage(), ex);
            history.setStatus("FAILED");
            history.setExecutedAt(LocalDateTime.now());
            history.setErrorMessage(ex.getMessage());
        } finally {
            historyRepo.save(history);
            upcomingRepo.deleteById(jobId);
        }
    }
}
