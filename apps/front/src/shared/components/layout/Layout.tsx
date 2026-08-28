import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { Header } from "./Header.js";
import { BottomNav } from "./BottomNav.js";

export const Layout = () => {
  return (
    <Box sx={{ pb: 7 }}>
      <Header />
      <Outlet />
      <BottomNav />
    </Box>
  );
};
