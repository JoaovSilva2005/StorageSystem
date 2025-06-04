import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

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
import SaidaPage from "./pages/SaidaForm";
import EntradaPage from "./pages/EntradaForm";
import LoginPage from "./pages/LoginPage";

const drawerWidth = 240;

// Rota protegida (somente permite acesso se token existir)
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

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
          {/* Drawer temporário para mobile */}
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

          {/* Drawer permanente para desktop */}
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

        {/* Conteúdo principal */}
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
              {/* Rota pública para login */}
              <Route path="/login" element={<LoginPage />} />

              {/* Rotas protegidas */}
              <Route
                path="/produtos/form"
                element={
                  <PrivateRoute>
                    <ProdutoForm onProdutoAdicionado={atualizar} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/produtos/lista"
                element={
                  <PrivateRoute>
                    <ProdutoList refresh={refresh} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/fornecedores"
                element={
                  <PrivateRoute>
                    <FornecedorPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/categorias"
                element={
                  <PrivateRoute>
                    <CategoriaPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/movimentacoes"
                element={
                  <PrivateRoute>
                    <MovimentacoesPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/saida"
                element={
                  <PrivateRoute>
                    <SaidaPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/entrada"
                element={
                  <PrivateRoute>
                    <EntradaPage />
                  </PrivateRoute>
                }
              />

              {/* Rota padrão */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <ProdutoForm onProdutoAdicionado={atualizar} />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Container>
        </Box>
      </Box>
    </Router>
  );
}
