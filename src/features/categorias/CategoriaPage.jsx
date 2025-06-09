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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// --------------------------------------------------
// CategoriaPage
// --------------------------------------------------
export default function CategoriaPage() {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [categoriaEdit, setCategoriaEdit] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoriaDelete, setCategoriaDelete] = useState(null);

  const fetchCategorias = () => {
    setLoading(true);
    fetch("http://localhost:3001/categorias", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Erro ao carregar categorias");
        return r.json();
      })
      .then(setCategorias)
      .catch((err) => {
        alert("Erro ao carregar categorias.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchCategorias, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim()) {
      alert("O nome da categoria é obrigatório.");
      return;
    }
    fetch("http://localhost:3001/categorias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify({ nome: nome.trim() }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao cadastrar categoria");
        return res.json();
      })
      .then(() => {
        setNome("");
        fetchCategorias();
      })
      .catch((err) => {
        alert(err.message);
        console.error(err);
      });
  };

  const openEditDialog = (categoria) => {
    setCategoriaEdit({ ...categoria });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setCategoriaEdit(null);
  };

  const handleSaveEdit = () => {
    if (!categoriaEdit?.nome.trim()) {
      alert("O nome da categoria não pode ser vazio.");
      return;
    }

    fetch(`http://localhost:3001/categorias/${categoriaEdit.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify({ nome: categoriaEdit.nome.trim() }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao salvar categoria");
        return res.json();
      })
      .then(() => {
        handleCloseEditDialog();
        fetchCategorias();
      })
      .catch((err) => {
        alert(err.message);
        console.error(err);
      });
  };

  const openDeleteDialog = (categoria) => {
    setCategoriaDelete(categoria);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCategoriaDelete(null);
  };

  const handleConfirmDelete = () => {
    fetch(`http://localhost:3001/categorias/${categoriaDelete.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao deletar categoria");
        handleCloseDeleteDialog();
        fetchCategorias();
      })
      .catch((err) => {
        alert(err.message);
        console.error(err);
      });
  };

  return (
    <Stack spacing={4} sx={{ maxWidth: 600, mx: "auto", py: 3 }}>
      {/* Cadastro */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Cadastro de Categoria
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Nome da Categoria"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <Button variant="contained" type="submit">
              Cadastrar
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Lista */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Categorias Cadastradas
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
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categorias.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    Nenhuma categoria cadastrada.
                  </TableCell>
                </TableRow>
              )}
              {categorias.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell>{categoria.nome}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => openEditDialog(categoria)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => openDeleteDialog(categoria)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Editar Categoria</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome da Categoria"
            fullWidth
            value={categoriaEdit?.nome || ""}
            onChange={(e) =>
              setCategoriaEdit({ ...categoriaEdit, nome: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancelar</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          Deseja realmente excluir a categoria{" "}
          <strong>{categoriaDelete?.nome}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
