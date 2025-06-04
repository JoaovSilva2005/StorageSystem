import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from "@mui/material";

function MovimentacaoHistorico() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loadingMov, setLoadingMov] = useState(true);
  const [errorMov, setErrorMov] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoadingMov(true);
    setErrorMov("");
    axios
      .get("http://localhost:3001/movimentacoes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMovimentacoes(res.data);
        setLoadingMov(false);
      })
      .catch(() => {
        setErrorMov("Erro ao carregar movimentações.");
        setLoadingMov(false);
      });
  }, [token]);

  return (
    <Box maxWidth={900} mx="auto" mt={4}>
      <Typography variant="h5" gutterBottom>
        Histórico de Movimentações
      </Typography>

      {loadingMov && (
        <Box textAlign="center" mt={2}>
          <CircularProgress />
          <Typography mt={2}>Carregando movimentações...</Typography>
        </Box>
      )}

      {errorMov && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMov}
        </Alert>
      )}

      {!loadingMov && movimentacoes.length === 0 && (
        <Typography mt={2} textAlign="center">
          Nenhuma movimentação registrada.
        </Typography>
      )}

      {!loadingMov && movimentacoes.length > 0 && (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
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
      )}
    </Box>
  );
}

export default MovimentacaoHistorico;
