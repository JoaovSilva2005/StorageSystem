import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Alert,
  Paper,
} from "@mui/material";

const EntradaForm = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [observacao, setObservacao] = useState("");
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
          window.location.href = "/login";
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

    if (!produtoId || !quantidade || quantidade <= 0) {
      setError("Selecione um produto e informe uma quantidade válida.");
      return;
    }

    try {
      const resp = await fetch(
        `http://localhost:3001/produtos/${produtoId}/entrada`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify({
            quantidade: Number(quantidade),
            observacao,
          }),
        }
      );

      if (resp.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Erro no servidor");

      setSuccess("Entrada registrada com sucesso!");
      setProdutoId("");
      setQuantidade("");
      setObservacao("");
    } catch (err) {
      setError(err.message || "Falha ao registrar entrada.");
    }
  };

  return (
    <Paper
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 4,
        p: 4,
        borderRadius: 3,
        boxShadow: 4,
      }}
    >
      <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
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

        <TextField
          fullWidth
          label="Observação"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          margin="normal"
          multiline
          rows={3}
          placeholder="Ex: Recebido com nota fiscal XYZ..."
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{ mt: 3, py: 1.5, fontWeight: "bold" }}
        >
          Registrar Entrada
        </Button>
      </form>
    </Paper>
  );
};

export default EntradaForm;
