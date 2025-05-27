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
    fetch("http://localhost:3001/categorias")
      .then((r) => r.json())
      .then(setCategorias)
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nome.trim() }),
    }).then(() => {
      setNome("");
      fetchCategorias();
    });
  };

  const openEditDialog = (categoria) => {
    setCategoriaEdit(categoria);
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: categoriaEdit.nome.trim() }),
    })
      .then(() => {
        handleCloseEditDialog();
        fetchCategorias();
      })
      .catch((err) => {
        alert("Erro ao salvar categoria");
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
    })
      .then(() => {
        handleCloseDeleteDialog();
        fetchCategorias();
      })
      .catch((err) => {
        alert("Erro ao deletar categoria");
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
              {categorias.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.nome}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => openEditDialog(c)}
                      size="small"
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => openDeleteDialog(c)}
                      size="small"
                      color="error"
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

      {/* Diálogo de Edição */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Editar Categoria</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome da Categoria"
            fullWidth
            value={categoriaEdit?.nome || ""}
            onChange={(e) =>
              setCategoriaEdit((prev) => ({ ...prev, nome: e.target.value }))
            }
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancelar</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Exclusão */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          Tem certeza que deseja deletar a categoria{" "}
          <strong>{categoriaDelete?.nome}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
