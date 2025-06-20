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

// Funções utilitárias para formatação
const formatCNPJ = (value) =>
  value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18);

const formatTelefone = (value) =>
  value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
    let formattedValue = value;

    if (name === "cnpj") formattedValue = formatCNPJ(value);
    if (name === "telefone") formattedValue = formatTelefone(value);

    setForm((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nome, cnpj, email, telefone } = form;

    if (!nome.trim() || !cnpj.trim()) {
      alert("Nome e CNPJ são obrigatórios");
      return;
    }

    if (email && !validateEmail(email)) {
      alert("E-mail inválido");
      return;
    }

    try {
      await api.post("/fornecedores", {
        nome: nome.trim(),
        cnpj: cnpj.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
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
    const { nome, cnpj, email, telefone } = fornecedorEdit;

    if (!nome.trim() || !cnpj.trim()) {
      alert("Nome e CNPJ são obrigatórios");
      return;
    }

    if (email && !validateEmail(email)) {
      alert("E-mail inválido");
      return;
    }

    try {
      await api.put(`/fornecedores/${fornecedorEdit.id}`, {
        nome: nome.trim(),
        cnpj: cnpj.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    let formatted = value;

    if (name === "cnpj") formatted = formatCNPJ(value);
    if (name === "telefone") formatted = formatTelefone(value);

    setFornecedorEdit((prev) => ({
      ...prev,
      [name]: formatted,
    }));
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

  const fornecedoresFiltrados = fornecedores.filter((f) =>
    f.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Stack spacing={5} sx={{ maxWidth: 720, mx: "auto", py: 4, px: 2 }}>
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
      <Paper sx={{ p: 4, borderRadius: 2 }}>
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
            <Button variant="contained" type="submit" size="large">
              Cadastrar
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Pesquisa */}
      <TextField
        label="Pesquisar fornecedores"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        size="small"
        placeholder="Buscar por nome"
      />

      {/* Lista */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="600" mb={3}>
          Fornecedores Cadastrados
        </Typography>
        {loading ? (
          <Box textAlign="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Nome
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  CNPJ
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Email
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Telefone
                </TableCell>
                <TableCell align="right" sx={{ color: "#fff" }}>
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fornecedoresFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nenhum fornecedor encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                fornecedoresFiltrados.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell>{f.nome}</TableCell>
                    <TableCell>{f.cnpj}</TableCell>
                    <TableCell>{f.email || "-"}</TableCell>
                    <TableCell>{f.telefone || "-"}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => openEditDialog(f)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => openDeleteDialog(f)}
                        color="error"
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

      {/* Dialog Edit */}
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
              onChange={handleEditChange}
              required
              fullWidth
            />
            <TextField
              label="CNPJ"
              name="cnpj"
              value={fornecedorEdit?.cnpj || ""}
              onChange={handleEditChange}
              required
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={fornecedorEdit?.email || ""}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              label="Telefone"
              name="telefone"
              value={fornecedorEdit?.telefone || ""}
              onChange={handleEditChange}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Delete */}
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
        <DialogActions>
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
