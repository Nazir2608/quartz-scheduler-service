package com.example.scheduler.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Map;

@Getter
@Setter
public class JobRequest {
    @NotEmpty
    private String callbackUrl;

    @NotEmpty
    private Map<String, Object> payload;  //stringified JSON or plain text

    @NotNull
    private LocalDateTime dateTime; //2025-11-07T14:30:00

    @NotNull
    private ZoneId timeZone; //Asia/Kolkata
}
