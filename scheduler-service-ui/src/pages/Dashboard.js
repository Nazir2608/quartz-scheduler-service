import { useEffect, useState, useMemo } from "react";
import { 
  Container, Typography, Paper, Box, Chip,
  CircularProgress, Alert, Fade, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, TablePagination, IconButton, Tooltip,
  Toolbar, InputAdornment, Button, Stack
} from "@mui/material";
import { 
  AccessTime, Schedule, Work, Search as SearchIcon,
  Refresh as RefreshIcon, Edit as EditIcon,
  Delete as DeleteIcon, PlayArrow as PlayIcon,
  FilterList as FilterIcon, Add as AddIcon
} from "@mui/icons-material";
import { getUpcomingJobs, deleteJob } from "../api/jobsApi";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      setError(null);
      const res = await getUpcomingJobs();
      setJobs(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to fetch jobs. Please try again.");
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteJob(id);
      fetchJobs();
    } catch (err) {
      setError("Failed to delete job. Please try again.");
      console.error("Error deleting job:", err);
    }
  };

  const getStatusChip = (status) => {
    const statusColors = {
      'scheduled': 'primary',
      'running': 'warning',
      'completed': 'success',
      'failed': 'error',
      'pending': 'default'
    };
    
    return (
      <Chip
        label={status?.toUpperCase() || 'UNKNOWN'}
        color={statusColors[status?.toLowerCase()] || 'default'}
        size="small"
        sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
      />
    );
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });
  };

  const filteredJobs = useMemo(() => {
    if (!searchTerm) return jobs;
    return jobs.filter(job => 
      job.jobId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.endpoint?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  const paginatedJobs = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredJobs.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredJobs, page, rowsPerPage]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Container maxWidth={false} sx={{ mt: 10, ml: '280px', mr: 4, width: 'calc(100% - 312px)' }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ mt: 10, ml: '280px', mr: 4, width: 'calc(100% - 312px)' }}>
      <Fade in={true} timeout={1000}>
        <Box>
          {/* Header Section */}
          <Paper 
            elevation={4} 
            sx={{ 
              p: 4, 
              mb: 4, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }
            }}
          >
            <Box display="flex" alignItems="center" gap={3} position="relative" zIndex={1}>
              <Schedule sx={{ fontSize: 48, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
              <Box>
                <Typography variant="h3" component="h1" fontWeight="bold" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                  Job Scheduler Dashboard
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                  Real-time monitoring and management of scheduled tasks
                </Typography>
              </Box>
            </Box>
            
            <Box display="flex" gap={4} mt={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <Work color="inherit" />
                <Typography variant="body2">
                  <strong>Total Jobs:</strong> {jobs.length}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <AccessTime color="inherit" />
                <Typography variant="body2">
                  <strong>Last Updated:</strong> {lastUpdated.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Schedule color="inherit" />
                <Typography variant="body2">
                  <strong>Filtered:</strong> {filteredJobs.length}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {/* Controls Toolbar */}
          <Paper 
            elevation={2} 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              backgroundColor: 'background.paper'
            }}
          >
            <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
              <Box display="flex" gap={2} alignItems="center">
                <TextField
                  placeholder="Search by Job ID, Status, or Endpoint..."
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 300 }}
                />
                <Tooltip title="Filter Options">
                  <IconButton>
                    <FilterIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchJobs}
                  sx={{ borderRadius: 2 }}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/add')}
                  sx={{ borderRadius: 2 }}
                >
                  Add Job
                </Button>
              </Stack>
            </Toolbar>
          </Paper>

          {/* Jobs Table */}
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: '70vh' }}>
              <Table stickyHeader sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Job ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Endpoint</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Scheduled Time</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Message</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedJobs.map((job) => (
                    <TableRow
                      key={job.jobId}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'action.hover',
                          transform: 'scale(1.01)',
                          transition: 'all 0.2s ease-in-out'
                        }
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight="600" color="primary.main">
                          #{job.jobId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {getStatusChip(job.status)}
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          title={job.endpoint}
                        >
                          {job.endpoint || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDateTime(job.runAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDateTime(job.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            maxWidth: 250,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          title={job.payload?.message}
                        >
                          {job.payload?.message || 'No message'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Edit Job">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => navigate(`/edit/${job.jobId}`, { state: job })}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Job">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(job.jobId)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {job.status?.toLowerCase() === 'pending' && (
                            <Tooltip title="Run Now">
                              <IconButton
                                size="small"
                                color="success"
                              >
                                <PlayIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {filteredJobs.length === 0 && (
              <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                py={8}
              >
                <Schedule sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {searchTerm ? 'No jobs match your search' : 'No jobs found'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm ? 'Try adjusting your search criteria' : 'Create your first job to get started'}
                </Typography>
              </Box>
            )}
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredJobs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Rows per page"
            />
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default Dashboard;
