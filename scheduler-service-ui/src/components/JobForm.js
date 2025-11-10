import { useState } from "react";
import {
  TextField, Button, Box, Alert, Stack,
  InputAdornment, Grid
} from "@mui/material";
import {
  Link as LinkIcon,
  Schedule as ScheduleIcon,
  Message as MessageIcon
} from "@mui/icons-material";
import dayjs from "dayjs";

const JobForm = ({ initial, onSubmit }) => {
  const [job, setJob] = useState({
    callbackUrl: initial?.callbackUrl || "",
    dateTime: initial?.dateTime
      ? dayjs(initial.dateTime).format("YYYY-MM-DDTHH:mm")
      : dayjs().add(10, "minute").format("YYYY-MM-DDTHH:mm"),
    message: initial?.payload?.message || ""
  });

  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!job.callbackUrl || !job.dateTime || !job.message) {
      return setError("All fields are required");
    }

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // ✅ Convert local datetime to ISO OffsetDateTime format WITHOUT milliseconds
    const dateObj = new Date(job.dateTime);
    const isoOffset = dayjs(dateObj).format("YYYY-MM-DDTHH:mm:ssZ");
    // Example output: "2025-11-08T21:06:00+05:30"

    const payload = {
      callbackUrl: job.callbackUrl,
      payload: { message: job.message },
      dateTime: isoOffset,
      timeZone: userTimeZone
    };

    onSubmit(payload);
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <Box>
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Callback URL"
            fullWidth
            placeholder="https://your-api-endpoint.com/webhook"
            value={job.callbackUrl}
            onChange={(e) => setJob({ ...job, callbackUrl: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="The URL that will be called when the job runs"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Run At (Local Time)"
            type="datetime-local"
            fullWidth
            value={job.dateTime}
            onChange={(e) => setJob({ ...job, dateTime: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ScheduleIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="Select when you want this job to execute"
            inputProps={{
              min: dayjs().format("YYYY-MM-DDTHH:mm")
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Message"
            fullWidth
            multiline
            rows={4}
            placeholder="Enter the message payload that will be sent to the callback URL"
            value={job.message}
            onChange={(e) => setJob({ ...job, message: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MessageIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="This message will be included in the payload sent to your callback URL"
          />
        </Grid>
      </Grid>

      <Stack 
        direction="row" 
        spacing={2} 
        sx={{ mt: 4, justifyContent: 'flex-end' }}
      >
        <Button 
          variant="outlined" 
          onClick={handleCancel}
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          sx={{ borderRadius: 2, px: 4 }}
        >
          {initial ? 'Update Job' : 'Create Job'}
        </Button>
      </Stack>
    </Box>
  );
};

export default JobForm;
