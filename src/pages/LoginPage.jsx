import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import api from "../api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro(""); // limpa erro anterior

    try {
      const response = await api.post("/login", { email, senha });
      const token = response.data.token;
      localStorage.setItem("token", token);
      navigate("/"); // redireciona para a página inicial
    } catch {
      setErro("Usuário ou senha inválidos.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <Box component="form" onSubmit={handleLogin} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          {erro && (
            <Typography color="error" variant="body2" align="center" mt={1}>
              {erro}
            </Typography>
          )}

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Entrar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
