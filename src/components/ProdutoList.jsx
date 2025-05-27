import React, { useEffect, useState } from "react";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  CircularProgress,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function ProdutoList({ refresh }) {
  const [produtos, setProdutos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:3001/produtos");
        if (!res.ok) throw new Error("Erro ao buscar produtos");
        const data = await res.json();
        const normalized = data.map((p) => ({
          ...p,
          preco: Number(p.preco) || 0,
          quantidade: Number(p.quantidade) || 0,
          categoria: p.categoria?.nome || "-",
          fornecedor: p.fornecedor?.nome || "-",
        }));
        setProdutos(normalized);
        setFiltered(normalized);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, [refresh]);

  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(
      produtos.filter(
        ({ nome, categoria, fornecedor }) =>
          nome.toLowerCase().includes(term) ||
          categoria.toLowerCase().includes(term) ||
          fornecedor.toLowerCase().includes(term)
      )
    );
  }, [search, produtos]);

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Typography color="error" align="center" mt={4}>
        {error}
      </Typography>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", mt: 3 }}>
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6">Lista de Produtos</Typography>
        <TextField
          placeholder="Pesquisar por nome, categoria ou fornecedor"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {["Nome", "Quantidade", "Preço", "Categoria", "Fornecedor"].map(
                (head) => (
                  <TableCell
                    key={head}
                    sx={{
                      backgroundColor: "primary.main",
                      color: "common.white",
                    }}
                  >
                    {head}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((p) => (
              <TableRow
                key={p.id}
                hover
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                }}
              >
                <TableCell>{p.nome}</TableCell>
                <TableCell>{p.quantidade}</TableCell>
                <TableCell>R$ {p.preco.toFixed(2)}</TableCell>
                <TableCell>{p.categoria}</TableCell>
                <TableCell>{p.fornecedor}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
