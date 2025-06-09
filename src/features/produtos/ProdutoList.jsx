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
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import api from "../../services/api";

export default function ProdutoList({ refresh }) {
  const [produtos, setProdutos] = useState([]);
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [produtoParaEditar, setProdutoParaEditar] = useState(null);

  const [categorias, setCategorias] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);

  // Carregar produtos, categorias e fornecedores
  useEffect(() => {
    carregarCategorias();
    carregarFornecedores();
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [refresh]);

  const carregarProdutos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/produtos"); // axios com token
      const data = res.data;

      // Normaliza para garantir números e nomes de categoria/fornecedor
      const normalizados = data.map((p) => ({
        ...p,
        preco: Number(p.preco) || 0,
        quantidade: Number(p.quantidade) || 0,
        categoria: p.categoria?.nome || "-",
        fornecedor: p.fornecedor?.nome || "-",
        idCategoria: p.categoria?.id || "",
        idFornecedor: p.fornecedor?.id || "",
      }));

      setProdutos(normalizados);
      setFilteredProdutos(normalizados);
    } catch (err) {
      setError(err.message || "Erro ao buscar produtos");
    } finally {
      setLoading(false);
    }
  };

  const carregarCategorias = async () => {
    try {
      const res = await api.get("/categorias"); // axios com token
      setCategorias(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const carregarFornecedores = async () => {
    try {
      const res = await api.get("/fornecedores"); // axios com token
      setFornecedores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Filtrar produtos com base na busca
  useEffect(() => {
    const termo = search.toLowerCase();
    const filtrados = produtos.filter(
      ({ nome, categoria, fornecedor }) =>
        nome.toLowerCase().includes(termo) ||
        categoria.toLowerCase().includes(termo) ||
        fornecedor.toLowerCase().includes(termo)
    );
    setFilteredProdutos(filtrados);
  }, [search, produtos]);

  // Excluir produto
  const handleDelete = async () => {
    if (!produtoParaExcluir) return;
    try {
      await api.delete(`/produtos/${produtoParaExcluir.id}`); // axios com token
      setDeleteDialogOpen(false);
      setProdutoParaExcluir(null);
      carregarProdutos();
    } catch (err) {
      alert("Erro ao deletar produto: " + (err.message || err));
    }
  };

  // Abrir diálogo para editar produto
  const handleEdit = (produto) => {
    setProdutoParaEditar({
      ...produto,
      idCategoria: produto.idCategoria || "",
      idFornecedor: produto.idFornecedor || "",
    });
    setEditDialogOpen(true);
  };

  // Salvar edição
  const handleSaveEdit = async () => {
    const { id, nome, quantidade, preco, idCategoria, idFornecedor } =
      produtoParaEditar;
    if (!nome.trim()) {
      alert("O nome é obrigatório.");
      return;
    }
    try {
      await api.put(`/produtos/${id}`, {
        nome,
        quantidade: Number(quantidade),
        preco: Number(preco),
        fornecedorId: idFornecedor,
        categoriaId: idCategoria,
      }); // axios com token
      setEditDialogOpen(false);
      setProdutoParaEditar(null);
      carregarProdutos();
    } catch (err) {
      alert("Erro ao atualizar produto: " + (err.message || err));
    }
  };

  if (loading)
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" align="center" mt={4}>
        {error}
      </Typography>
    );

  return (
    <>
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
                {[
                  "Nome",
                  "Quantidade",
                  "Preço",
                  "Categoria",
                  "Fornecedor",
                  "Ações",
                ].map((head) => (
                  <TableCell
                    key={head}
                    sx={{
                      backgroundColor: "primary.main",
                      color: "common.white",
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProdutos.length > 0 ? (
                filteredProdutos.map((p) => (
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
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEdit(p)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setProdutoParaExcluir(p);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Diálogo exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Deseja realmente remover o produto "{produtoParaExcluir?.nome}"?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error">
            Remover
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo edição */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Editar Produto</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Nome"
            value={produtoParaEditar?.nome || ""}
            onChange={(e) =>
              setProdutoParaEditar((prev) => ({
                ...prev,
                nome: e.target.value,
              }))
            }
            fullWidth
          />
          <TextField
            label="Quantidade"
            type="number"
            value={produtoParaEditar?.quantidade || ""}
            onChange={(e) =>
              setProdutoParaEditar((prev) => ({
                ...prev,
                quantidade: e.target.value,
              }))
            }
            fullWidth
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Preço"
            type="number"
            value={produtoParaEditar?.preco || ""}
            onChange={(e) =>
              setProdutoParaEditar((prev) => ({
                ...prev,
                preco: e.target.value,
              }))
            }
            fullWidth
            inputProps={{ min: 0, step: 0.01 }}
          />

          <FormControl fullWidth>
            <InputLabel>Categoria</InputLabel>
            <Select
              value={produtoParaEditar?.idCategoria || ""}
              label="Categoria"
              onChange={(e) =>
                setProdutoParaEditar((prev) => ({
                  ...prev,
                  idCategoria: e.target.value,
                }))
              }
            >
              {categorias.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Fornecedor</InputLabel>
            <Select
              value={produtoParaEditar?.idFornecedor || ""}
              label="Fornecedor"
              onChange={(e) =>
                setProdutoParaEditar((prev) => ({
                  ...prev,
                  idFornecedor: e.target.value,
                }))
              }
            >
              {fornecedores.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
