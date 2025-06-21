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
  Divider,
  Alert,
  Collapse,
} from "@mui/material";
import api from "../../services/api";

export default function ProdutoForm({ onProdutoAdicionado }) {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidadeMinima, setQuantidadeMinima] = useState("");
  const [quantidadeMaxima, setQuantidadeMaxima] = useState("");
  const [fornecedores, setFornecedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [fornecedorId, setFornecedorId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [loadingF, setLoadingF] = useState(false);
  const [loadingC, setLoadingC] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
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

  const validateForm = () => {
    const errors = {};

    if (!nome.trim()) errors.nome = "O nome do produto é obrigatório";
    if (!quantidade || isNaN(quantidade) || Number(quantidade) < 1)
      errors.quantidade = "Informe uma quantidade válida (mínimo 1)";
    if (!preco || isNaN(preco) || Number(preco) <= 0)
      errors.preco = "Informe um preço válido (maior que 0)";
    if (!fornecedorId) errors.fornecedorId = "Selecione um fornecedor";
    if (!categoriaId) errors.categoriaId = "Selecione uma categoria";

    if (
      quantidadeMinima !== "" &&
      (isNaN(quantidadeMinima) || Number(quantidadeMinima) < 0)
    ) {
      errors.quantidadeMinima = "Mínimo inválido (use valor positivo)";
    }
    if (
      quantidadeMaxima !== "" &&
      (isNaN(quantidadeMaxima) || Number(quantidadeMaxima) < 1)
    ) {
      errors.quantidadeMaxima = "Máximo inválido (use valor maior que 0)";
    }
    if (
      quantidadeMinima !== "" &&
      quantidadeMaxima !== "" &&
      Number(quantidadeMinima) > Number(quantidadeMaxima)
    ) {
      errors.quantidadeMaxima = "Máximo deve ser maior ou igual ao mínimo";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const dataToSend = {
        nome,
        quantidade: Number(quantidade),
        preco: Number(preco),
        fornecedorId,
        categoriaId,
      };

      if (quantidadeMinima !== "") {
        dataToSend.quantidade_minima = Number(quantidadeMinima);
      }
      if (quantidadeMaxima !== "") {
        dataToSend.quantidade_maxima = Number(quantidadeMaxima);
      }

      await api.post("/produtos", dataToSend);

      setSuccessMessage("Produto cadastrado com sucesso!");
      if (typeof onProdutoAdicionado === "function") onProdutoAdicionado();

      setNome("");
      setQuantidade("");
      setPreco("");
      setQuantidadeMinima("");
      setQuantidadeMaxima("");
      setFormErrors({});
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (error) {
      setErrorMessage("Erro ao cadastrar produto. Verifique os dados.");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{ p: 5, maxWidth: 650, mx: "auto", mt: 5, borderRadius: 3 }}
    >
      <Typography variant="h4" fontWeight="bold" color="primary" mb={2}>
        Novo Produto
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Preencha as informações abaixo para cadastrar um novo produto no
        sistema.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Collapse in={!!successMessage || !!errorMessage}>
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
      </Collapse>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <TextField
            label="Nome do Produto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            fullWidth
            required
            disabled={submitting}
            error={!!formErrors.nome}
            helperText={formErrors.nome}
          />

          <TextField
            label="Quantidade"
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            fullWidth
            required
            inputProps={{ min: 1 }}
            disabled={submitting}
            error={!!formErrors.quantidade}
            helperText={formErrors.quantidade}
          />

          <TextField
            label="Preço (R$)"
            type="number"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            fullWidth
            required
            inputProps={{ step: 0.01, min: 0.01 }}
            disabled={submitting}
            error={!!formErrors.preco}
            helperText={formErrors.preco}
          />

          <TextField
            label="Quantidade Mínima"
            type="number"
            value={quantidadeMinima}
            onChange={(e) => setQuantidadeMinima(e.target.value)}
            fullWidth
            inputProps={{ min: 0 }}
            disabled={submitting}
            error={!!formErrors.quantidadeMinima}
            helperText={formErrors.quantidadeMinima}
          />

          <TextField
            label="Quantidade Máxima"
            type="number"
            value={quantidadeMaxima}
            onChange={(e) => setQuantidadeMaxima(e.target.value)}
            fullWidth
            inputProps={{ min: 1 }}
            disabled={submitting}
            error={!!formErrors.quantidadeMaxima}
            helperText={formErrors.quantidadeMaxima}
          />

          <FormControl
            fullWidth
            disabled={loadingF || submitting}
            error={!!formErrors.fornecedorId}
          >
            <InputLabel>Fornecedor</InputLabel>
            {loadingF ? (
              <Box display="flex" justifyContent="center" py={1}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <>
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
                {formErrors.fornecedorId && (
                  <Typography color="error" variant="caption">
                    {formErrors.fornecedorId}
                  </Typography>
                )}
              </>
            )}
          </FormControl>

          <FormControl
            fullWidth
            disabled={loadingC || submitting}
            error={!!formErrors.categoriaId}
          >
            <InputLabel>Categoria</InputLabel>
            {loadingC ? (
              <Box display="flex" justifyContent="center" py={1}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <>
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
                {formErrors.categoriaId && (
                  <Typography color="error" variant="caption">
                    {formErrors.categoriaId}
                  </Typography>
                )}
              </>
            )}
          </FormControl>

          <Box display="flex" justifyContent="flex-end" mt={2}>
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
                py: 1.5,
                borderRadius: 2,
              }}
            >
              {submitting ? "Adicionando..." : "Adicionar Produto"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
