import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Container from "@mui/material/Container";
import Header from "./components/Header";
import NavigationDrawer from "./components/NavigationDrawer";
import ProdutoForm from "./components/ProdutoForm";
import ProdutoList from "./components/ProdutoList";
import FornecedorPage from "./pages/FornecedorPage";
import CategoriaPage from "./pages/CategoriaPage";
import MovimentacoesPage from "./pages/MovimentacoesPage";

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
        >
          {/* Drawer para mobile e desktop */}
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
            <Routes>
              <Route
                path="/produtos/form"
                element={<ProdutoForm onProdutoAdicionado={atualizar} />}
              />
              <Route
                path="/produtos/lista"
                element={<ProdutoList refresh={refresh} />}
              />
              <Route path="/fornecedores" element={<FornecedorPage />} />
              <Route path="/categorias" element={<CategoriaPage />} />
              <Route path="/movimentacoes" element={<MovimentacoesPage />} />
              <Route
                path="/"
                element={<ProdutoForm onProdutoAdicionado={atualizar} />}
              />
            </Routes>
          </Container>
        </Box>
      </Box>
    </Router>
  );
}
