package com.example.scheduler.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class JobResponse {
    private boolean success;
    private String jobId;
    private String jobGroup;
    private String status;
    private String message;
}
