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
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function FornecedorPage() {
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

  // Função para tratar erro 401 (token inválido)
  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const fetchFornecedores = () => {
    setLoading(true);
    fetch("http://localhost:3001/fornecedores", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
      .then((r) => {
        if (r.status === 401) {
          handleUnauthorized();
          return;
        }
        if (!r.ok) throw new Error("Erro ao buscar fornecedores");
        return r.json();
      })
      .then(setFornecedores)
      .catch((err) => {
        alert(err.message);
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFornecedores();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nome.trim() || !form.cnpj.trim()) {
      alert("Nome e CNPJ são obrigatórios");
      return;
    }

    fetch("http://localhost:3001/fornecedores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify({
        nome: form.nome.trim(),
        cnpj: form.cnpj.trim(),
        email: form.email.trim(),
        telefone: form.telefone.trim(),
      }),
    })
      .then((res) => {
        if (res.status === 401) {
          handleUnauthorized();
          return;
        }
        if (!res.ok) throw new Error("Erro ao cadastrar fornecedor");
        return res.json();
      })
      .then(() => {
        setForm({ nome: "", cnpj: "", email: "", telefone: "" });
        fetchFornecedores();
      })
      .catch((err) => {
        alert(err.message);
        console.error(err);
      });
  };

  const openEditDialog = (fornecedor) => {
    setFornecedorEdit({ ...fornecedor });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setFornecedorEdit(null);
  };

  const handleSaveEdit = () => {
    if (!fornecedorEdit?.nome.trim() || !fornecedorEdit?.cnpj.trim()) {
      alert("Nome e CNPJ são obrigatórios");
      return;
    }

    fetch(`http://localhost:3001/fornecedores/${fornecedorEdit.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify({
        nome: fornecedorEdit.nome.trim(),
        cnpj: fornecedorEdit.cnpj.trim(),
        email: fornecedorEdit.email?.trim() || "",
        telefone: fornecedorEdit.telefone?.trim() || "",
      }),
    })
      .then((res) => {
        if (res.status === 401) {
          handleUnauthorized();
          return;
        }
        if (!res.ok) throw new Error("Erro ao salvar fornecedor");
        return res.json();
      })
      .then(() => {
        handleCloseEditDialog();
        fetchFornecedores();
      })
      .catch((err) => {
        alert(err.message);
        console.error(err);
      });
  };

  const openDeleteDialog = (fornecedor) => {
    setFornecedorDelete(fornecedor);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setFornecedorDelete(null);
  };

  const handleConfirmDelete = () => {
    fetch(`http://localhost:3001/fornecedores/${fornecedorDelete.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          handleUnauthorized();
          return;
        }
        if (!res.ok) throw new Error("Erro ao deletar fornecedor");
        handleCloseDeleteDialog();
        fetchFornecedores();
      })
      .catch((err) => {
        alert(err.message);
        console.error(err);
      });
  };

  return (
    <Stack spacing={4} sx={{ maxWidth: 700, mx: "auto", py: 3 }}>
      {/* Cadastro */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Cadastro de Fornecedor
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              label="Nome"
              name="nome"
              value={form.nome}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="CNPJ"
              name="cnpj"
              value={form.cnpj}
              onChange={handleInputChange}
              required
              placeholder="00.000.000/0000-00"
            />
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              type="email"
            />
            <TextField
              label="Telefone"
              name="telefone"
              value={form.telefone}
              onChange={handleInputChange}
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
          Fornecedores Cadastrados
        </Typography>
        {loading ? (
          <Box textAlign="center" py={2}>
            <CircularProgress />
          </Box>
        ) : (
          <Table size="small" sx={{ wordBreak: "break-word" }}>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>CNPJ</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fornecedores.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nenhum fornecedor cadastrado.
                  </TableCell>
                </TableRow>
              )}
              {fornecedores.map((fornecedor) => (
                <TableRow key={fornecedor.id}>
                  <TableCell>{fornecedor.nome}</TableCell>
                  <TableCell>{fornecedor.cnpj}</TableCell>
                  <TableCell>{fornecedor.email || "-"}</TableCell>
                  <TableCell>{fornecedor.telefone || "-"}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => openEditDialog(fornecedor)}
                      size="large"
                      aria-label={`Editar ${fornecedor.nome}`}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => openDeleteDialog(fornecedor)}
                      size="large"
                      aria-label={`Deletar ${fornecedor.nome}`}
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
        <DialogTitle>Editar Fornecedor</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
            <TextField
              label="Nome"
              name="nome"
              value={fornecedorEdit?.nome || ""}
              onChange={(e) =>
                setFornecedorEdit((prev) => ({ ...prev, nome: e.target.value }))
              }
              required
            />
            <TextField
              label="CNPJ"
              name="cnpj"
              value={fornecedorEdit?.cnpj || ""}
              onChange={(e) =>
                setFornecedorEdit((prev) => ({ ...prev, cnpj: e.target.value }))
              }
              required
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

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
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
