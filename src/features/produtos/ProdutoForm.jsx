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
import api from "../../services/api";

export default function ProdutoForm({ onProdutoAdicionado }) {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [preco, setPreco] = useState("");
  const [fornecedores, setFornecedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [fornecedorId, setFornecedorId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [loadingF, setLoadingF] = useState(false);
  const [loadingC, setLoadingC] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

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
    setSubmitting(true);
    try {
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
    } catch (error) {
      // Aqui você pode adicionar tratamento de erro se quiser
      console.error("Erro ao adicionar produto:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper
      sx={{
        p: 4,
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
      elevation={3}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 3, color: "primary.main" }}
      >
        Cadastrar Produto
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ cursor: submitting ? "wait" : "default" }}
      >
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            disabled={submitting}
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#f9f9f9",
                borderRadius: 1,
              },
              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
              },
            }}
          />

          <TextField
            fullWidth
            label="Quantidade"
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            inputProps={{ min: 0 }}
            required
            disabled={submitting}
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#f9f9f9",
                borderRadius: 1,
              },
              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
              },
            }}
          />

          <TextField
            fullWidth
            label="Preço (R$)"
            type="number"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            inputProps={{ step: 0.01, min: 0 }}
            required
            disabled={submitting}
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#f9f9f9",
                borderRadius: 1,
              },
              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
              },
            }}
          />

          <FormControl fullWidth disabled={loadingF || submitting}>
            <InputLabel>Fornecedor</InputLabel>
            {loadingF ? (
              <Box display="flex" justifyContent="center" py={1}>
                <CircularProgress size={28} />
              </Box>
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

          <FormControl fullWidth disabled={loadingC || submitting}>
            <InputLabel>Categoria</InputLabel>
            {loadingC ? (
              <Box display="flex" justifyContent="center" py={1}>
                <CircularProgress size={28} />
              </Box>
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
              startIcon={
                submitting && <CircularProgress size={20} color="inherit" />
              }
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                px: 4,
              }}
            >
              {submitting ? "Adicionando..." : "Adicionar"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
