import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Alert,
  Paper,
  CircularProgress,
} from "@mui/material";

const SaidaForm = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [observacao, setObservacao] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const fetchProdutos = () => {
    fetch("http://localhost:3001/produtos", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          handleUnauthorized();
          return;
        }
        if (!res.ok) throw new Error("Erro ao carregar produtos.");
        return res.json();
      })
      .then(setProdutos)
      .catch(() => setError("Erro ao carregar produtos."));
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const qtd = Number(quantidade);
    if (!produtoId || qtd <= 0 || isNaN(qtd) || !Number.isInteger(qtd)) {
      setError("Preencha corretamente o produto e a quantidade.");
      return;
    }

    const produtoSelecionado = produtos.find((p) => p.id === produtoId);
    if (!produtoSelecionado) {
      setError("Produto selecionado inválido.");
      return;
    }

    if (qtd > produtoSelecionado.quantidade) {
      setError(
        `Estoque insuficiente! Disponível: ${produtoSelecionado.quantidade}`
      );
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch(
        `http://localhost:3001/produtos/${produtoId}/saida`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify({ quantidade: qtd, observacao }),
        }
      );

      if (resp.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Erro no servidor");

      setSuccess("Saída registrada com sucesso!");
      setProdutoId("");
      setQuantidade("");
      setObservacao("");
      fetchProdutos(); // Atualiza a lista após saída
    } catch (err) {
      setError(err.message || "Falha ao registrar saída.");
    } finally {
      setLoading(false);
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
        Registrar Saída de Produto
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
          disabled={loading}
        >
          {produtos.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {`${p.nome} (em estoque: ${p.quantidade})`}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Quantidade"
          type="number"
          inputProps={{ min: 1, step: 1 }}
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          margin="normal"
          required
          disabled={loading}
        />

        <TextField
          fullWidth
          label="Observação"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          margin="normal"
          multiline
          rows={3}
          placeholder="Ex: Saída para cliente XYZ..."
          disabled={loading}
        />

        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{ mt: 3, py: 1.5, fontWeight: "bold" }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Registrar Saída"
          )}
        </Button>
      </form>
    </Paper>
  );
};

export default SaidaForm;
