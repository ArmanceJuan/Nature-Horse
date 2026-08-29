import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";
import { Header } from "./Header.js";
import { BottomNav } from "./BottomNav.js";
import { TopNav } from "./TopNav.js";
import { useIsDesktop } from "../../hooks/useIsDesktop.js";

export const Layout = () => {
  const isDesktop = useIsDesktop();

  return (
    <Box sx={{ pb: isDesktop ? 0 : 7 }}>
      {isDesktop ? <TopNav /> : <Header />}
      <Container maxWidth="xl" disableGutters={!isDesktop}>
        <Outlet />
      </Container>
      {!isDesktop && <BottomNav />}
    </Box>
  );
};
