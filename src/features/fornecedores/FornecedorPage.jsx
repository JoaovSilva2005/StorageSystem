import React, { useEffect, useState } from "react";
import {
  Stack,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../services/api";

export default function FornecedorPage() {
  const theme = useTheme();

  const [fornecedores, setFornecedores] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    cnpj: "",
    email: "",
    telefone: "",
  });
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [fornecedorEdit, setFornecedorEdit] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fornecedorDelete, setFornecedorDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const fetchFornecedores = async () => {
    setLoading(true);
    try {
      const res = await api.get("/fornecedores");
      setFornecedores(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleUnauthorized();
      } else {
        alert("Erro ao buscar fornecedores");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFornecedores();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.cnpj.trim()) {
      alert("Nome e CNPJ são obrigatórios");
      return;
    }

    try {
      await api.post("/fornecedores", {
        nome: form.nome.trim(),
        cnpj: form.cnpj.trim(),
        email: form.email.trim(),
        telefone: form.telefone.trim(),
      });
      setForm({ nome: "", cnpj: "", email: "", telefone: "" });
      fetchFornecedores();
    } catch (err) {
      if (err.response?.status === 401) {
        handleUnauthorized();
      } else {
        alert("Erro ao cadastrar fornecedor");
        console.error(err);
      }
    }
  };

  const openEditDialog = (fornecedor) => {
    setFornecedorEdit({ ...fornecedor });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setFornecedorEdit(null);
  };

  const handleSaveEdit = async () => {
    if (!fornecedorEdit?.nome.trim() || !fornecedorEdit?.cnpj.trim()) {
      alert("Nome e CNPJ são obrigatórios");
      return;
    }

    try {
      await api.put(`/fornecedores/${fornecedorEdit.id}`, {
        nome: fornecedorEdit.nome.trim(),
        cnpj: fornecedorEdit.cnpj.trim(),
        email: fornecedorEdit.email?.trim() || "",
        telefone: fornecedorEdit.telefone?.trim() || "",
      });
      handleCloseEditDialog();
      fetchFornecedores();
    } catch (err) {
      if (err.response?.status === 401) {
        handleUnauthorized();
      } else {
        alert("Erro ao salvar fornecedor");
        console.error(err);
      }
    }
  };

  const openDeleteDialog = (fornecedor) => {
    setFornecedorDelete(fornecedor);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setFornecedorDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/fornecedores/${fornecedorDelete.id}`);
      handleCloseDeleteDialog();
      fetchFornecedores();
    } catch (err) {
      if (err.response?.status === 401) {
        handleUnauthorized();
      } else {
        alert("Erro ao deletar fornecedor");
        console.error(err);
      }
    }
  };

  // Filtra fornecedores pelo nome com base no termo de busca
  const fornecedoresFiltrados = fornecedores.filter((f) =>
    f.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Stack
      spacing={5}
      sx={{
        maxWidth: 720,
        mx: "auto",
        py: 4,
        px: 2,
      }}
    >
      <Typography
        variant="h4"
        align="center"
        fontWeight="700"
        color={theme.palette.primary.main}
        gutterBottom
      >
        Gestão de Fornecedores
      </Typography>

      {/* Cadastro */}
      <Paper
        sx={{
          p: 4,
          boxShadow: theme.shadows[3],
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h6" fontWeight="600" mb={3}>
          Cadastro de Fornecedor
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField
              label="Nome"
              name="nome"
              value={form.nome}
              onChange={handleInputChange}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="CNPJ"
              name="cnpj"
              value={form.cnpj}
              onChange={handleInputChange}
              required
              placeholder="00.000.000/0000-00"
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              type="email"
              fullWidth
            />
            <TextField
              label="Telefone"
              name="telefone"
              value={form.telefone}
              onChange={handleInputChange}
              fullWidth
            />
            <Button
              variant="contained"
              type="submit"
              size="large"
              sx={{ mt: 2, fontWeight: 600 }}
            >
              Cadastrar
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Pesquisa */}
      <TextField
        label="Pesquisar fornecedores"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
        placeholder="Buscar por nome"
      />

      {/* Lista */}
      <Paper
        sx={{
          p: 3,
          boxShadow: theme.shadows[3],
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h6" fontWeight="600" mb={3}>
          Fornecedores Cadastrados
        </Typography>
        {loading ? (
          <Box textAlign="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Table
            size="small"
            sx={{
              wordBreak: "break-word",
              borderCollapse: "separate",
              borderSpacing: "0 8px",
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  "& th": {
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 15,
                    paddingY: 1.5,
                    borderRadius: 1,
                  },
                }}
              >
                <TableCell>Nome</TableCell>
                <TableCell>CNPJ</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fornecedoresFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    Nenhum fornecedor encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                fornecedoresFiltrados.map((fornecedor) => (
                  <TableRow
                    key={fornecedor.id}
                    sx={{
                      backgroundColor: "#f9f9f9",
                      "&:hover": {
                        backgroundColor: "#e0e0e0",
                      },
                      borderRadius: 1,
                      "& td": {
                        borderBottom: "none",
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>
                      {fornecedor.nome}
                    </TableCell>
                    <TableCell>{fornecedor.cnpj}</TableCell>
                    <TableCell>{fornecedor.email || "-"}</TableCell>
                    <TableCell>{fornecedor.telefone || "-"}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        aria-label="editar"
                        onClick={() => openEditDialog(fornecedor)}
                        size="large"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        aria-label="excluir"
                        onClick={() => openDeleteDialog(fornecedor)}
                        size="large"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
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
        <DialogTitle>Editar Fornecedor</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Nome"
              name="nome"
              value={fornecedorEdit?.nome || ""}
              onChange={(e) =>
                setFornecedorEdit((prev) => ({ ...prev, nome: e.target.value }))
              }
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="CNPJ"
              name="cnpj"
              value={fornecedorEdit?.cnpj || ""}
              onChange={(e) =>
                setFornecedorEdit((prev) => ({ ...prev, cnpj: e.target.value }))
              }
              required
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={fornecedorEdit?.email || ""}
              onChange={(e) =>
                setFornecedorEdit((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              fullWidth
            />
            <TextField
              label="Telefone"
              name="telefone"
              value={fornecedorEdit?.telefone || ""}
              onChange={(e) =>
                setFornecedorEdit((prev) => ({
                  ...prev,
                  telefone: e.target.value,
                }))
              }
              fullWidth
            />
          </Stack>
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
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent dividers>
          Tem certeza que deseja excluir o fornecedor{" "}
          <strong>{fornecedorDelete?.nome}</strong>?
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
