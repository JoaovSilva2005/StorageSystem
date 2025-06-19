import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Container from "@mui/material/Container";

import Header from "./Header";
import Footer from "./Footer";
import NavigationDrawer from "./NavigationDrawer";

const drawerWidth = 240;

export default function MainLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header fixo no topo */}
      <Header onMenuClick={handleDrawerToggle} />

      {/* Conteúdo principal + Drawer */}
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="navigation drawers"
        >
          {/* Drawer mobile */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            <NavigationDrawer />
          </Drawer>

          {/* Drawer desktop */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            <NavigationDrawer />
          </Drawer>
        </Box>

        {/* Área do conteúdo principal */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: 8,
          }}
        >
          <Container maxWidth="md">{children}</Container>
        </Box>
      </Box>

      {/* Footer fixo no final da página */}
      <Footer />
    </Box>
  );
}
