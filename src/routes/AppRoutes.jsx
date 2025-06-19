import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProdutoForm from "../features/produtos/ProdutoForm";
import ProdutoList from "../features/produtos/ProdutoList";
import FornecedorPage from "../features/fornecedores/FornecedorPage";
import CategoriaPage from "../features/categorias/CategoriaPage";
import MovimentacoesPage from "../features/movimentacoes/MovimentacoesPage";
import SaidaPage from "../features/movimentacoes/SaidaForm";
import EntradaPage from "../features/movimentacoes/EntradaForm";
import LoginPage from "../features/auth/LoginPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import HomePage from "../features/home/HomePage";

import MainLayout from "../components/layout/MainLayout";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

export default function AppRoutes({ atualizar, refresh }) {
  return (
    <Routes>
      {/* Página Home pública independente */}
      <Route path="/" element={<HomePage />} />

      {/* Login público */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rotas protegidas envolvidas pelo layout */}
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <MainLayout>
              <Routes>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route
                  path="produtos/form"
                  element={<ProdutoForm onProdutoAdicionado={atualizar} />}
                />
                <Route
                  path="produtos/lista"
                  element={<ProdutoList refresh={refresh} />}
                />
                <Route path="fornecedores" element={<FornecedorPage />} />
                <Route path="categorias" element={<CategoriaPage />} />
                <Route path="movimentacoes" element={<MovimentacoesPage />} />
                <Route path="saida" element={<SaidaPage />} />
                <Route path="entrada" element={<EntradaPage />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </MainLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
