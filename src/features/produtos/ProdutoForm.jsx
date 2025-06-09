import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Stack,
} from "@mui/material";
import api from "../../services/api"; // importe o axios configurado

export default function ProdutoForm({ onProdutoAdicionado }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [preco, setPreco] = useState("");
  const [fornecedores, setFornecedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [fornecedorId, setFornecedorId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [loadingF, setLoadingF] = useState(false);
  const [loadingC, setLoadingC] = useState(false);

  useEffect(() => {
    setLoadingF(true);
    api
      .get("/fornecedores")
      .then((res) => {
        setFornecedores(res.data);
        if (res.data.length) setFornecedorId(res.data[0].id);
      })
      .catch(() => setFornecedores([]))
      .finally(() => setLoadingF(false));

    setLoadingC(true);
    api
      .get("/categorias")
      .then((res) => {
        setCategorias(res.data);
        if (res.data.length) setCategoriaId(res.data[0].id);
      })
      .catch(() => setCategorias([]))
      .finally(() => setLoadingC(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/produtos", {
      nome,
      quantidade: Number(quantidade),
      preco: Number(preco),
      fornecedorId,
      categoriaId,
    });

    onProdutoAdicionado();

    setNome("");
    setQuantidade("");
    setPreco("");
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Cadastrar Produto
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Quantidade"
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            inputProps={{ min: 0 }}
            required
          />

          <TextField
            fullWidth
            label="Preço (R$)"
            type="number"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            inputProps={{ step: 0.01, min: 0 }}
            required
          />

          <FormControl fullWidth>
            <InputLabel>Fornecedor</InputLabel>
            {loadingF ? (
              <CircularProgress size={24} />
            ) : (
              <Select
                value={fornecedorId}
                label="Fornecedor"
                onChange={(e) => setFornecedorId(e.target.value)}
              >
                {fornecedores.map((f) => (
                  <MenuItem key={f.id} value={f.id}>
                    {f.nome}
                  </MenuItem>
                ))}
              </Select>
            )}
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Categoria</InputLabel>
            {loadingC ? (
              <CircularProgress size={24} />
            ) : (
              <Select
                value={categoriaId}
                label="Categoria"
                onChange={(e) => setCategoriaId(e.target.value)}
              >
                {categorias.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.nome}
                  </MenuItem>
                ))}
              </Select>
            )}
          </FormControl>

          <Box display="flex" justifyContent="flex-end">
            <Button type="submit" variant="contained">
              Adicionar
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
