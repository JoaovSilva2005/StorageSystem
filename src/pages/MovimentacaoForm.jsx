import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import api from "../api"; // usando o axios configurado

function MovimentacaoForm() {
  const [produtos, setProdutos] = useState([]);
  const [produtoId, setProdutoId] = useState("");
  const [tipo, setTipo] = useState("ENTRADA");
  const [quantidade, setQuantidade] = useState(1);
  const [observacao, setObservacao] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get("/api/produtos")
      .then((res) => setProdutos(res.data))
      .catch((err) => {
        console.error(err);
        setError("Erro ao carregar produtos.");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const qtd = Number(quantidade);

    if (!produtoId) {
      setError("Selecione um produto.");
      return;
    }

    if (!qtd || !Number.isInteger(qtd) || qtd < 1) {
      setError("Quantidade deve ser um número inteiro maior que zero.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/movimentacoes", {
        produto_id: produtoId,
        tipo,
        quantidade: qtd,
        observacao,
      });

      setSuccess("Movimentação registrada com sucesso!");
      setProdutoId("");
      setTipo("ENTRADA");
      setQuantidade(1);
      setObservacao("");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Erro ao registrar movimentação.";
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={3}>
      <Typography variant="h5" gutterBottom>
        Registrar Movimentação
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
          label="Produto"
          value={produtoId}
          onChange={(e) => setProdutoId(e.target.value)}
          fullWidth
          margin="normal"
          required
          disabled={loading}
        >
          <MenuItem value="">
            <em>Selecione um produto</em>
          </MenuItem>
          {produtos.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.nome}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          fullWidth
          margin="normal"
          disabled={loading}
        >
          <MenuItem value="ENTRADA">Entrada</MenuItem>
          <MenuItem value="SAIDA">Saída</MenuItem>
        </TextField>

        <TextField
          label="Quantidade"
          type="number"
          inputProps={{ min: 1, step: 1 }}
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          fullWidth
          margin="normal"
          required
          disabled={loading}
        />

        <TextField
          label="Observação"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          fullWidth
          margin="normal"
          disabled={loading}
          multiline
          rows={2}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Box>
  );
}

export default MovimentacaoForm;
