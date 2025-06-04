import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MovimentacoesLista() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    axios
      .get("http://localhost:3001/api/movimentacoes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMovimentacoes(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Erro ao carregar movimentações.");
        setLoading(false);
      });
  }, [token, navigate]);

  if (loading)
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography mt={2}>Carregando movimentações...</Typography>
      </Box>
    );

  if (error)
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );

  if (movimentacoes.length === 0)
    return (
      <Typography mt={4} textAlign="center">
        Nenhuma movimentação registrada.
      </Typography>
    );

  return (
    <Box mt={4} maxWidth={900} mx="auto">
      <Typography variant="h5" gutterBottom>
        Lista de Movimentações
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Produto</strong>
              </TableCell>
              <TableCell>
                <strong>Tipo</strong>
              </TableCell>
              <TableCell>
                <strong>Quantidade</strong>
              </TableCell>
              <TableCell>
                <strong>Data</strong>
              </TableCell>
              <TableCell>
                <strong>Observação</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movimentacoes.map((mov) => (
              <TableRow key={mov.id}>
                <TableCell>{mov.produto_nome || mov.produto_id}</TableCell>
                <TableCell>{mov.tipo}</TableCell>
                <TableCell>{mov.quantidade}</TableCell>
                <TableCell>
                  {new Date(mov.data).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>{mov.observacao || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default MovimentacoesLista;
