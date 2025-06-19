import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TextField,
  TablePagination,
} from "@mui/material";

function MovimentacaoHistorico() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroTexto, setFiltroTexto] = useState("");
  const [pagina, setPagina] = useState(0);
  const [linhasPorPagina, setLinhasPorPagina] = useState(5);

  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    setError("");
    axios
      .get("http://localhost:3001/movimentacoes", {
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
  }, [token]);

  // Filtra pela barra de pesquisa: procura no nome do produto, tipo ou observação
  const movimentacoesFiltradas = movimentacoes.filter((mov) => {
    const termo = filtroTexto.toLowerCase();
    return (
      mov.produto?.nome?.toLowerCase().includes(termo) ||
      mov.tipo?.toLowerCase().includes(termo) ||
      mov.observacao?.toLowerCase().includes(termo)
    );
  });

  // Paginação
  const movimentacoesPaginadas = movimentacoesFiltradas.slice(
    pagina * linhasPorPagina,
    pagina * linhasPorPagina + linhasPorPagina
  );

  const handleChangePage = (event, novaPagina) => {
    setPagina(novaPagina);
  };

  const handleChangeRowsPerPage = (event) => {
    setLinhasPorPagina(parseInt(event.target.value, 10));
    setPagina(0);
  };

  return (
    <Box maxWidth={900} mx="auto" mt={4}>
      <Typography variant="h5" gutterBottom>
        Histórico de Movimentações
      </Typography>

      {loading && (
        <Box textAlign="center" mt={2}>
          <CircularProgress />
          <Typography mt={2}>Carregando movimentações...</Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && movimentacoes.length === 0 && (
        <Typography mt={2} textAlign="center">
          Nenhuma movimentação registrada.
        </Typography>
      )}

      {!loading && movimentacoes.length > 0 && (
        <>
          <TextField
            label="Pesquisar"
            variant="outlined"
            value={filtroTexto}
            onChange={(e) => {
              setFiltroTexto(e.target.value);
              setPagina(0); // volta para página 0 ao pesquisar
            }}
            placeholder="Nome, tipo ou observação"
            fullWidth
            margin="normal"
          />

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "primary.main",
                    "& th": {
                      color: "common.white",
                      fontWeight: "bold",
                      fontSize: 16,
                    },
                  }}
                >
                  <TableCell>Produto</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Observação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movimentacoesPaginadas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Nenhuma movimentação encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  movimentacoesPaginadas.map((mov) => (
                    <TableRow key={mov.id} hover>
                      <TableCell>{mov.produto?.nome || "Sem nome"}</TableCell>
                      <TableCell>{mov.tipo}</TableCell>
                      <TableCell align="right">{mov.quantidade}</TableCell>
                      <TableCell>
                        {new Date(mov.data_movimento).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>{mov.observacao || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={movimentacoesFiltradas.length}
            page={pagina}
            onPageChange={handleChangePage}
            rowsPerPage={linhasPorPagina}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Linhas por página"
          />
        </>
      )}
    </Box>
  );
}

export default MovimentacaoHistorico;
