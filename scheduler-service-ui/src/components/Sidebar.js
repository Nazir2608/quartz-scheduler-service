import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HistoryIcon from "@mui/icons-material/History";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed] = useState(false);

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Add Job", icon: <AddCircleIcon />, path: "/add" },
    { text: "History", icon: <HistoryIcon />, path: "/history" },
  ];

  const drawerWidth = isCollapsed ? 80 : 280;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
          border: "none",
          boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
          transition: "width 0.3s ease",
        },
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          borderBottom: "1px solid",
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        {!isCollapsed && (
          <Box display="flex" alignItems="center" gap={1}>
            <ScheduleIcon sx={{ color: "white", fontSize: 28 }} />
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: 700,
                fontSize: "1.1rem",
              }}
            >
              Job Scheduler
            </Typography>
          </Box>
        )}
      </Box>

      {/* Navigation Menu */}
      <List sx={{ p: 2 }}>
        {menuItems.map((item, index) => (
          <ListItem
            key={item.text}
            disablePadding
            sx={{ mb: 1 }}
          >
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                borderRadius: 3,
                minHeight: 48,
                justifyContent: isCollapsed ? "center" : "flex-start",
                px: 2.5,
                backgroundColor:
                  location.pathname === item.path
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
                color: "white",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  transform: "translateX(4px)",
                },
                "&.Mui-selected": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderLeft: "4px solid",
                  borderColor: "secondary.main",
                },
              }}
              selected={location.pathname === item.path}
            >
              <Box
                sx={{
                  minWidth: 0,
                  mr: isCollapsed ? 0 : 2,
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    color:
                      location.pathname === item.path
                        ? "secondary.light"
                        : "rgba(255,255,255,0.7)",
                    fontSize: 20,
                    transition: "color 0.3s ease",
                  }}
                >
                  {item.icon}
                </Box>
              </Box>
              {!isCollapsed && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: "0.95rem",
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer Section */}
      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
      <Box
        sx={{
          p: 2,
          textAlign: "center",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "0.75rem",
          }}
        >
          {!isCollapsed && "© 2024 Job Scheduler"}
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
