import {
  Card, CardContent, Typography,
  IconButton, Stack, Box, Chip, Divider,
  CardActions, Button, Tooltip
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Schedule as ScheduleIcon,
  AccessTime as TimeIcon
} from "@mui/icons-material";

const JobCard = ({ job, onEdit, onDelete, statusChip }) => {
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'error',
      'medium': 'warning',
      'low': 'info'
    };
    return colors[priority?.toLowerCase()] || 'default';
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header with Job ID and Status */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box flex={1}>
            <Typography 
              variant="h6" 
              component="h2" 
              fontWeight="bold"
              sx={{ 
                fontSize: '1.1rem',
                color: 'primary.main'
              }}
            >
              Job #{job.jobId}
            </Typography>
          </Box>
          <Box ml={2}>
            {statusChip}
          </Box>
        </Box>

        {/* Priority Chip (if available) */}
        {job.priority && (
          <Chip
            label={job.priority.toUpperCase()}
            color={getPriorityColor(job.priority)}
            size="small"
            variant="outlined"
            sx={{ mb: 2 }}
          />
        )}

        {/* Job Details */}
        <Stack spacing={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <ScheduleIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              <strong>Scheduled:</strong> {formatDateTime(job.runAt)}
            </Typography>
          </Box>

          {job.createdAt && (
            <Box display="flex" alignItems="center" gap={1}>
              <TimeIcon color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                <strong>Created:</strong> {formatDateTime(job.createdAt)}
              </Typography>
            </Box>
          )}

          {job.description && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Description:</strong>
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  p: 1.5,
                  borderRadius: 1,
                  fontStyle: 'italic'
                }}
              >
                {job.description}
              </Typography>
            </Box>
          )}

          {job.endpoint && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                <strong>Endpoint:</strong>
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontFamily: 'monospace',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  display: 'block',
                  wordBreak: 'break-all'
                }}
              >
                {job.endpoint}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>

      <Divider />

      {/* Action Buttons */}
      <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit Job">
            <IconButton 
              onClick={() => onEdit(job)}
              color="primary"
              size="small"
              sx={{ 
                '&:hover': { backgroundColor: 'primary.lighter' }
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Delete Job">
            <IconButton 
              onClick={() => onDelete(job.jobId)}
              color="error"
              size="small"
              sx={{ 
                '&:hover': { backgroundColor: 'error.lighter' }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>

        {job.status?.toLowerCase() === 'pending' && (
          <Button
            size="small"
            variant="contained"
            startIcon={<PlayIcon />}
            sx={{ borderRadius: 2 }}
          >
            Run Now
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default JobCard;
