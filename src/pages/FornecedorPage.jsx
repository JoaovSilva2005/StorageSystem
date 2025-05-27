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

export default function FornecedorPage() {
  const [fornecedores, setFornecedores] = useState([]);
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchFornecedores = () => {
    setLoading(true);
    fetch("http://localhost:3001/fornecedores")
      .then((r) => r.json())
      .then((data) => setFornecedores(data))
      .finally(() => setLoading(false));
  };

  useEffect(fetchFornecedores, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/fornecedores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, cnpj, email, telefone }),
    }).then(() => {
      setNome("");
      setCnpj("");
      setEmail("");
      setTelefone("");
      fetchFornecedores();
    });
  };

  return (
    <Stack spacing={4} sx={{ maxWidth: 800, mx: "auto", py: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Cadastro de Fornecedor
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
              label="CNPJ"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />
            <Box textAlign="right">
              <Button variant="contained" type="submit">
                Cadastrar
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Fornecedores Cadastrados
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
                <TableCell>CNPJ</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fornecedores.map((f) => (
                <TableRow key={f.id}>
                  <TableCell>{f.nome}</TableCell>
                  <TableCell>{f.cnpj}</TableCell>
                  <TableCell>{f.email}</TableCell>
                  <TableCell>{f.telefone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Stack>
  );
}
