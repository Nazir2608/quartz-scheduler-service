package com.example.scheduler.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.Map;

@Getter
@Setter
public class JobRequest {
    @NotEmpty
    private String callbackUrl;

    @NotEmpty
    private Map<String, Object> payload;  //stringified JSON or plain text

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    private OffsetDateTime dateTime;

    @NotNull
    private ZoneId timeZone; //Asia/Kolkata
}
