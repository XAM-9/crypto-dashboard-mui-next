/* src/app/layout.js */
"use client";

import { createTheme, ThemeProvider, CssBaseline, Box } from "@mui/material";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// ธีม Light Mode เน้นพื้นหลังสีขาว (ใช้ Theme เดิม)
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#007BFF", // สีน้ำเงินหลัก
    },
    secondary: {
      main: "#6C757D", // สีเทาเข้มสำหรับข้อความ/ไอคอน
    },
    success: {
      main: "#28A745", // เขียว
    },
    error: {
      main: "#DC3545", // แดง
    },
    background: {
      default: "#FFFFFF", // พื้นหลังขาว
      paper: "#F8F9FA", // พื้นหลัง Card/Paper (ขาวนวล)
    },
    text: {
      primary: "#212529", // ดำเข้ม
      secondary: "#6C757D", // เทาอ่อน
    },
    divider: "#DEE2E6", // เส้นแบ่งสีเทาอ่อนมาก
  },
  typography: {
    fontFamily: inter.style.fontFamily,
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12, // เพิ่มความโค้งมน
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)", // Shadow เบาลงเล็กน้อย
          transition: 'box-shadow 0.3s',
        },
      },
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <Box
            sx={{
              backgroundColor: lightTheme.palette.background.default,
              minHeight: "100vh",
              width: "100%",
              py: 3, // ลด Padding แนวตั้ง
            }}
          >
            {children}
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}