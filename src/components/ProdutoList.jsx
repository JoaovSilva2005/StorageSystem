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
      const res = await fetch("http://localhost:3001/produtos");
      if (!res.ok) throw new Error("Erro ao buscar produtos");
      const data = await res.json();

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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const carregarCategorias = async () => {
    try {
      const res = await fetch("http://localhost:3001/categorias");
      if (!res.ok) throw new Error("Erro ao buscar categorias");
      const data = await res.json();
      setCategorias(data);
    } catch (err) {
      console.error(err);
    }
  };

  const carregarFornecedores = async () => {
    try {
      const res = await fetch("http://localhost:3001/fornecedores");
      if (!res.ok) throw new Error("Erro ao buscar fornecedores");
      const data = await res.json();
      setFornecedores(data);
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
      const res = await fetch(
        `http://localhost:3001/produtos/${produtoParaExcluir.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Erro ao deletar produto");
      setDeleteDialogOpen(false);
      setProdutoParaExcluir(null);
      carregarProdutos();
    } catch (err) {
      alert("Erro ao deletar produto: " + err.message);
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
      const res = await fetch(`http://localhost:3001/produtos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          quantidade: Number(quantidade),
          preco: Number(preco),
          fornecedorId: idFornecedor,
          categoriaId: idCategoria,
        }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar produto");
      setEditDialogOpen(false);
      setProdutoParaEditar(null);
      carregarProdutos();
    } catch (err) {
      alert("Erro ao atualizar produto: " + err.message);
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
            inputProps={{ min: 0, step: "0.01" }}
          />
          <FormControl fullWidth>
            <InputLabel id="select-categoria-label">Categoria</InputLabel>
            <Select
              labelId="select-categoria-label"
              value={produtoParaEditar?.idCategoria || ""}
              label="Categoria"
              onChange={(e) =>
                setProdutoParaEditar((prev) => ({
                  ...prev,
                  idCategoria: e.target.value,
                }))
              }
            >
              {categorias.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="select-fornecedor-label">Fornecedor</InputLabel>
            <Select
              labelId="select-fornecedor-label"
              value={produtoParaEditar?.idFornecedor || ""}
              label="Fornecedor"
              onChange={(e) =>
                setProdutoParaEditar((prev) => ({
                  ...prev,
                  idFornecedor: e.target.value,
                }))
              }
            >
              {fornecedores.map((forn) => (
                <MenuItem key={forn.id} value={forn.id}>
                  {forn.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
