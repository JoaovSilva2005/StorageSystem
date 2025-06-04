import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Alert,
} from "@mui/material";

const EntradaForm = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/produtos", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login"; // redireciona para login se token inválido
          return;
        }
        if (!res.ok) throw new Error("Erro ao carregar produtos.");
        return res.json();
      })
      .then((data) => setProdutos(data))
      .catch(() => setError("Erro ao carregar produtos."));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!produtoId || !quantidade) {
      setError("Produto e quantidade são obrigatórios.");
      return;
    }

    if (quantidade <= 0) {
      setError("Quantidade deve ser maior que zero.");
      return;
    }

    try {
      const url = `http://localhost:3001/produtos/${produtoId}/entrada`;

      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          quantidade: Number(quantidade),
        }),
      });

      if (resp.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login"; // redireciona para login se token inválido
        return;
      }

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || "Erro no servidor");
      }

      setSuccess("Entrada registrada com sucesso!");
      setProdutoId("");
      setQuantidade("");
    } catch (err) {
      setError(err.message || "Falha ao registrar entrada.");
    }
  };

  return (
    <Box maxWidth={400} mx="auto">
      <Typography variant="h5" mb={2}>
        Registrar Entrada de Produto
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          select
          fullWidth
          label="Produto"
          value={produtoId}
          onChange={(e) => setProdutoId(e.target.value)}
          margin="normal"
          required
        >
          {produtos.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.nome}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Quantidade"
          type="number"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          margin="normal"
          required
          inputProps={{ min: 1 }}
        />

        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
          Registrar Entrada
        </Button>
      </form>
    </Box>
  );
};

export default EntradaForm;
