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
      const res = await api.get("/produtos");
      const data = res.data.map((p) => ({
        id: p.id,
        nome: p.nome,
        quantidade: p.quantidade,
        preco: Number(p.preco) || 0,
        quantidade_minima:
          p.quantidade_minima !== null && p.quantidade_minima !== 0
            ? p.quantidade_minima
            : 0,
        quantidade_maxima:
          p.quantidade_maxima !== null && p.quantidade_maxima !== 0
            ? p.quantidade_maxima
            : null,
        alerta: p.alerta || null,
        categoria: p.categoria || "-", // já vem string direto do backend
        fornecedor: p.fornecedor || "-", // idem
        idCategoria: p.idCategoria || "",
        idFornecedor: p.idFornecedor || "",
      }));
      setProdutos(data);
      setFilteredProdutos(data);
    } catch (err) {
      setError(err.message || "Erro ao buscar produtos");
    } finally {
      setLoading(false);
    }
  };

  const carregarCategorias = async () => {
    try {
      const res = await api.get("/categorias");
      setCategorias(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const carregarFornecedores = async () => {
    try {
      const res = await api.get("/fornecedores");
      setFornecedores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleDelete = async () => {
    if (!produtoParaExcluir) return;
    try {
      await api.delete(`/produtos/${produtoParaExcluir.id}`);
      setDeleteDialogOpen(false);
      setProdutoParaExcluir(null);
      carregarProdutos();
    } catch (err) {
      alert("Erro ao deletar produto: " + (err.message || err));
    }
  };

  const handleEdit = (produto) => {
    setProdutoParaEditar({
      ...produto,
      quantidade_minima: produto.quantidade_minima ?? 0,
      quantidade_maxima: produto.quantidade_maxima ?? "",
      idCategoria: produto.idCategoria || "",
      idFornecedor: produto.idFornecedor || "",
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    const {
      id,
      nome,
      quantidade,
      preco,
      idCategoria,
      idFornecedor,
      quantidade_minima,
      quantidade_maxima,
    } = produtoParaEditar;

    if (!nome.trim()) {
      alert("O nome é obrigatório.");
      return;
    }

    if (quantidade_minima < 0) {
      alert("Quantidade mínima não pode ser negativa.");
      return;
    }

    if (
      quantidade_maxima !== "" &&
      quantidade_maxima !== null &&
      Number(quantidade_maxima) < Number(quantidade_minima)
    ) {
      alert("Quantidade máxima deve ser maior ou igual à mínima.");
      return;
    }

    try {
      await api.put(`/produtos/${id}`, {
        nome,
        quantidade: Number(quantidade),
        preco: Number(preco),
        categoriaId: idCategoria,
        fornecedorId: idFornecedor,
        quantidade_minima: Number(quantidade_minima),
        quantidade_maxima:
          quantidade_maxima === "" ? null : Number(quantidade_maxima),
      });
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
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Lista de Produtos
          </Typography>

          <TextField
            placeholder="Pesquisar por nome, categoria ou fornecedor..."
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
              sx: { borderRadius: 2 },
            }}
          />
        </Box>

        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  "Nome",
                  "Qtd.",
                  "Qtd. Mín.",
                  "Qtd. Máx.",
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
                      fontWeight: "bold",
                    }}
                    align={head === "Ações" ? "center" : "left"}
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
                      "&:nth-of-type(odd)": {
                        backgroundColor: "action.hover",
                      },
                      "&:hover": {
                        backgroundColor: "#f1f1f1",
                      },
                    }}
                  >
                    <TableCell>{p.nome}</TableCell>
                    <TableCell>{p.quantidade}</TableCell>
                    <TableCell>{p.quantidade_minima}</TableCell>
                    <TableCell>
                      {p.quantidade_maxima !== null ? p.quantidade_maxima : "-"}
                    </TableCell>
                    <TableCell>R$ {p.preco.toFixed(2)}</TableCell>
                    <TableCell>{p.categoria}</TableCell>
                    <TableCell>{p.fornecedor}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(p)}
                        sx={{ mx: 0.5 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setProdutoParaExcluir(p);
                          setDeleteDialogOpen(true);
                        }}
                        sx={{ mx: 0.5 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Nenhum produto encontrado
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Diálogo de Exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "error.main" }}>
          Confirmar Remoção
        </DialogTitle>
        <DialogContent>
          Deseja realmente excluir o produto "
          <strong>{produtoParaExcluir?.nome}</strong>"?
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Remover
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Edição */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Editar Produto</DialogTitle>
        <DialogContent
          sx={{
            px: 3,
            pt: 2,
            pb: 1,
            gap: 2,
            display: "flex",
            flexDirection: "column",
          }}
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
          <TextField
            label="Quantidade Mínima"
            type="number"
            value={produtoParaEditar?.quantidade_minima || 0}
            onChange={(e) =>
              setProdutoParaEditar((prev) => ({
                ...prev,
                quantidade_minima: e.target.value,
              }))
            }
            fullWidth
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Quantidade Máxima"
            type="number"
            value={
              produtoParaEditar?.quantidade_maxima === null ||
              produtoParaEditar?.quantidade_maxima === "-"
                ? ""
                : produtoParaEditar?.quantidade_maxima
            }
            onChange={(e) =>
              setProdutoParaEditar((prev) => ({
                ...prev,
                quantidade_maxima: e.target.value,
              }))
            }
            fullWidth
            inputProps={{ min: 0 }}
            helperText="Deixe vazio para não ter limite máximo"
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
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditDialogOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleSaveEdit}
            color="primary"
            variant="contained"
            disabled={
              !produtoParaEditar?.nome ||
              produtoParaEditar.quantidade_minima < 0 ||
              (produtoParaEditar.quantidade_maxima !== "" &&
                Number(produtoParaEditar.quantidade_maxima) <
                  Number(produtoParaEditar.quantidade_minima))
            }
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
