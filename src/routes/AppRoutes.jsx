// src/routes/AppRoutes.jsx
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

// Componente para proteger rotas com token
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

export default function AppRoutes({ atualizar, refresh }) {
  return (
    <Routes>
      {/* Rota pública */}
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
  );
}
