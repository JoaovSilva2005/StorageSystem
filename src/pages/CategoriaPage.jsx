import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from "@mui/material";

export default function CategoriaPage() {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCategorias = () => {
    setLoading(true);
    fetch("http://localhost:3001/categorias")
      .then((r) => r.json())
      .then((data) => setCategorias(data))
      .finally(() => setLoading(false));
  };

  useEffect(fetchCategorias, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome }),
    }).then(() => {
      setNome("");
      fetchCategorias();
    });
  };

  return (
    <Stack spacing={4} sx={{ maxWidth: 600, mx: "auto", py: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Cadastro de Categoria
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Nome da Categoria"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <Button variant="contained" type="submit">
              Cadastrar
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Categorias Cadastradas
        </Typography>
        {loading ? (
          <Box textAlign="center" py={2}>
            <CircularProgress />
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categorias.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.nome}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Stack>
  );
}
