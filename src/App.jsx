import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Container from "@mui/material/Container";

import Header from "./components/layout/Header";
import NavigationDrawer from "./components/layout/NavigationDrawer";
import AppRoutes from "./routes/AppRoutes";

const drawerWidth = 240;

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const atualizar = () => setRefresh((prev) => !prev);

  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <Header onMenuClick={handleDrawerToggle} />

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

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: 8,
          }}
        >
          <Container maxWidth="md">
            <AppRoutes atualizar={atualizar} refresh={refresh} />
          </Container>
        </Box>
      </Box>
    </Router>
  );
}
