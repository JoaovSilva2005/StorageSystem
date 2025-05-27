import React, { useState, useEffect } from "react";
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
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function ProdutoForm({ onProdutoAdicionado }) {
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
    fetch("http://localhost:3001/fornecedores")
      .then((r) => r.json())
      .then((d) => {
        setFornecedores(d);
        if (d.length) setFornecedorId(d[0].id);
      })
      .finally(() => setLoadingF(false));

    setLoadingC(true);
    fetch("http://localhost:3001/categorias")
      .then((r) => r.json())
      .then((d) => {
        setCategorias(d);
        if (d.length) setCategoriaId(d[0].id);
      })
      .finally(() => setLoadingC(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // valida...
    await fetch("http://localhost:3001/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        quantidade: Number(quantidade),
        preco: Number(preco),
        fornecedorId,
        categoriaId,
      }),
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
