import { createTheme } from "@mui/material/styles";

const baseTheme = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "light",
    primary: {
      main: "#667eea",
      light: "#8e9ff2",
      dark: "#4f5bd5",
      lighter: 'rgba(102, 126, 234, 0.1)',
    },
    secondary: {
      main: "#764ba2",
      light: "#9a7bc5",
      dark: "#5a3a7a",
    },
    error: {
      main: "#f44336",
      light: "#f6685e",
      dark: "#d32f2f",
      lighter: 'rgba(244, 67, 54, 0.1)',
    },
    warning: {
      main: "#ff9800",
      light: "#ffb74d",
      dark: "#f57c00",
    },
    info: {
      main: "#2196f3",
      light: "#64b5f6",
      dark: "#1976d2",
    },
    success: {
      main: "#4caf50",
      light: "#81c784",
      dark: "#388e3c",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
  },
  shadows: [
    "none",
    "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
    "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
    "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
    "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)",
    ...Array(18).fill("0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)")
  ],
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "dark",
    primary: {
      main: "#90CAF9",
      light: "#bbdefb",
      dark: "#64b5f6",
      lighter: 'rgba(144, 202, 249, 0.1)',
    },
    secondary: {
      main: "#CE93D8",
      light: "#e1bee7",
      dark: "#ba68c8",
    },
    error: {
      main: "#f44336",
      light: "#f6685e",
      dark: "#d32f2f",
      lighter: 'rgba(244, 67, 54, 0.1)',
    },
    warning: {
      main: "#ffb74d",
      light: "#ffcc80",
      dark: "#ffa726",
    },
    info: {
      main: "#29b6f6",
      light: "#4fc3f7",
      dark: "#0288d1",
    },
    success: {
      main: "#81c784",
      light: "#a5d6a7",
      dark: "#66bb6a",
    },
    background: {
      default: "#0f172a",
      paper: "#1e293b",
    },
    text: {
      primary: "#f1f5f9",
      secondary: "#94a3b8",
    },
  },
});
