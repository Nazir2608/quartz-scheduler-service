import { Container, Typography, Paper, Box } from "@mui/material";
import JobForm from "../components/JobForm";
import { updateJob } from "../api/jobsApi";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const EditJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have the job data from navigation state
    if (location.state) {
      setInitialData(location.state);
      setLoading(false);
    } else {
      // If no state, create basic structure
      setInitialData({
        jobId: id,
        callbackUrl: "",
        dateTime: dayjs().add(10, "minute").toISOString(),
        payload: { message: "" }
      });
      setLoading(false);
    }
  }, [id, location.state]);

  const handleSubmit = (jobData) => {
    updateJob(id, jobData)
      .then(() => navigate("/"))
      .catch((error) => {
        console.error("Error updating job:", error);
        alert("Failed to update job. Please try again.");
      });
  };

  if (loading) {
    return (
      <Container maxWidth={false} sx={{ mt: 10, ml: '280px', mr: 4, width: 'calc(100% - 312px)' }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography>Loading job data...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ mt: 10, ml: '280px', mr: 4, width: 'calc(100% - 312px)' }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Edit Job #{id}
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Update your scheduled task details
        </Typography>
      </Paper>

      <Paper elevation={1} sx={{ p: 4, borderRadius: 3 }}>
        <JobForm 
          initial={initialData}
          onSubmit={handleSubmit}
        />
      </Paper>
    </Container>
  );
};

export default EditJob;