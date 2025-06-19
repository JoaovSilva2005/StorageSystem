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
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CategoriaPage() {
  const theme = useTheme();

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
    <Stack
      spacing={5}
      sx={{
        maxWidth: 650,
        mx: "auto",
        py: 4,
        px: 2,
        bgcolor: theme.palette.background.default,
      }}
    >
      <Typography
        variant="h4"
        align="center"
        fontWeight="700"
        color={theme.palette.primary.main}
        gutterBottom
      >
        Gestão de Categorias
      </Typography>

      {/* Cadastro */}
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
          bgcolor: theme.palette.background.paper,
          boxShadow: theme.shadows[3],
        }}
      >
        <Typography variant="h6" fontWeight="600" mb={3}>
          Cadastro de Categoria
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Nome da Categoria"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              autoFocus
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              type="submit"
              sx={{
                minWidth: { xs: "100%", sm: 130 },
                fontWeight: 600,
                py: 1.5,
                mt: { xs: 1, sm: 0 },
              }}
              size="large"
            >
              Cadastrar
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Lista */}
      <Paper
        elevation={4}
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: theme.palette.background.paper,
          boxShadow: theme.shadows[3],
        }}
      >
        <Typography variant="h6" fontWeight="600" mb={3}>
          Categorias Cadastradas
        </Typography>

        {loading ? (
          <Box textAlign="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Table
            size="small"
            sx={{
              borderCollapse: "separate",
              borderSpacing: "0 10px",
              "& thead th": {
                bgcolor: theme.palette.primary.main,
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                borderRadius: 1,
                paddingY: 1.5,
              },
              "& tbody tr": {
                bgcolor: "#fefefe",
                boxShadow: "0px 1px 4px rgba(0,0,0,0.1)",
                borderRadius: 2,
                transition: "background-color 0.3s",
                "&:hover": {
                  bgcolor: "#f1f1f1",
                },
              },
              "& tbody td": {
                borderBottom: "none",
                paddingY: 1.5,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categorias.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                    Nenhuma categoria cadastrada.
                  </TableCell>
                </TableRow>
              )}
              {categorias.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {categoria.nome}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => openEditDialog(categoria)}
                      size="small"
                      aria-label="Editar categoria"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => openDeleteDialog(categoria)}
                      size="small"
                      aria-label="Excluir categoria"
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
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Editar Categoria</DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin="dense"
            label="Nome da Categoria"
            fullWidth
            value={categoriaEdit?.nome || ""}
            onChange={(e) =>
              setCategoriaEdit({ ...categoriaEdit, nome: e.target.value })
            }
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseEditDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent dividers>
          Deseja realmente excluir a categoria{" "}
          <strong>{categoriaDelete?.nome}</strong>?
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
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
