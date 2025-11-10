import { Container, Typography, Paper } from "@mui/material";
import JobForm from "../components/JobForm";
import { addJob } from "../api/jobsApi";
import { useNavigate } from "react-router-dom";

const AddJob = () => {
  const navigate = useNavigate();

  const handleSubmit = (job) => {
    addJob(job)
      .then(() => navigate("/"))
      .catch((error) => {
        console.error("Error adding job:", error);
        alert("Failed to add job. Please try again.");
      });
  };

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
          Add New Job
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Create a new scheduled task
        </Typography>
      </Paper>

      <Paper elevation={1} sx={{ p: 4, borderRadius: 3 }}>
        <JobForm onSubmit={handleSubmit} />
      </Paper>
    </Container>
  );
};

export default AddJob;
