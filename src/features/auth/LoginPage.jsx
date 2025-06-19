import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Avatar,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import api from "../../services/api";

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
      navigate("/produtos/form");
    } catch {
      setErro("Usuário ou senha inválidos.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #4a90e2 30%, #50e3c2 90%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={8}
          sx={{
            padding: 4,
            borderRadius: 3,
            backgroundColor: "rgba(255,255,255,0.95)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Avatar
              sx={{ m: 1, bgcolor: "primary.main", width: 56, height: 56 }}
            >
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h5" fontWeight="600">
              Entrar no StockMaster
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleLogin} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ bgcolor: "#f5f5f5", borderRadius: 1 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Senha"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              sx={{ bgcolor: "#f5f5f5", borderRadius: 1 }}
            />

            {erro && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {erro}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 4, py: 1.5, fontWeight: "bold", fontSize: "1.1rem" }}
              disableElevation
            >
              Entrar
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
