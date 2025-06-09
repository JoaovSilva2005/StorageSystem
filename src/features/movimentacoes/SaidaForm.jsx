import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Alert,
} from "@mui/material";

const SaidaForm = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [observacao, setObservacao] = useState(""); // novo estado
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
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
        if (!res.ok) throw new Error("Erro ao carregar produtos");
        return res.json();
      })
      .then(setProdutos)
      .catch(() => setError("Erro ao carregar produtos."));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const qtd = Number(quantidade);

    if (!produtoId) {
      setError("Produto é obrigatório.");
      return;
    }

    if (!quantidade || isNaN(qtd) || !Number.isInteger(qtd) || qtd <= 0) {
      setError("Quantidade deve ser um número inteiro maior que zero.");
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
          body: JSON.stringify({
            quantidade: qtd,
            observacao, // enviar observação
          }),
        }
      );

      if (resp.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || "Erro no servidor");
      }

      setSuccess("Saída registrada com sucesso!");
      setProdutoId("");
      setQuantidade("");
      setObservacao(""); // limpar campo
    } catch (err) {
      setError(err.message || "Falha ao registrar saída.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={400} mx="auto">
      <Typography variant="h5" mb={2}>
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
              {p.nome}
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
          rows={2}
          placeholder="Ex: Saída para cliente XYZ..."
          disabled={loading}
        />

        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrar Saída"}
        </Button>
      </form>
    </Box>
  );
};

export default SaidaForm;
