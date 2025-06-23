import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  IconButton,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const API_BASE_URL = "http://localhost:3001";

// Funções de formatação
function formatCPF(value) {
  const v = value.replace(/\D/g, "").slice(0, 11);
  return v
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatTelefone(value) {
  const v = value.replace(/\D/g, "").slice(0, 11);
  if (v.length <= 10) {
    return v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "");
  } else {
    return v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "");
  }
}

function formatNome(value) {
  return value.replace(/\b\w/g, (l) => l.toUpperCase());
}

const GerenciarUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [deletarId, setDeletarId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editUsuario, setEditUsuario] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users`, { headers });
      if (!res.ok) throw new Error("Erro ao carregar usuários.");
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Filtrar usuários pelo termo de pesquisa
  const usuariosFiltrados = usuarios.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.nome.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.cpf.toLowerCase().includes(term)
    );
  });

  const handleEditClick = (user) => {
    setEditId(user.id);
    setEditUsuario({ ...user });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditUsuario(null);
  };

  const handleEditChange = (field, value) => {
    let formattedValue = value;

    if (field === "cpf") {
      formattedValue = formatCPF(value);
    } else if (field === "telefone") {
      formattedValue = formatTelefone(value);
    } else if (field === "nome") {
      formattedValue = formatNome(value);
    }

    setEditUsuario((prev) => ({ ...prev, [field]: formattedValue }));
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${editId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(editUsuario),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao atualizar usuário.");
      }
      setUsuarios((old) =>
        old.map((u) => (u.id === editId ? { ...editUsuario } : u))
      );
      setSuccessMsg("Usuário atualizado com sucesso.");
      setEditId(null);
      setEditUsuario(null);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleDeleteClick = (userId) => {
    setDeletarId(userId);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${deletarId}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao excluir usuário.");
      }
      setUsuarios((old) => old.filter((u) => u.id !== deletarId));
      setSuccessMsg("Usuário excluído com sucesso.");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setConfirmDialogOpen(false);
      setDeletarId(null);
      if (editId === deletarId) {
        handleCancelEdit();
      }
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Gerenciar Usuários
      </Typography>

      {/* Pesquisa e Dashboard */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextField
          label="Pesquisar usuários"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />

        <Box>
          <Typography variant="subtitle1" component="div">
            Total de usuários: {usuariosFiltrados.length}
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuariosFiltrados.map((user) => {
                const isEditing = editId === user.id;
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      {isEditing ? (
                        <TextField
                          value={editUsuario.nome}
                          onChange={(e) =>
                            handleEditChange("nome", e.target.value)
                          }
                          size="small"
                        />
                      ) : (
                        user.nome
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <TextField
                          value={editUsuario.email}
                          onChange={(e) =>
                            setEditUsuario((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          size="small"
                        />
                      ) : (
                        user.email
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <TextField
                          value={editUsuario.cpf}
                          onChange={(e) =>
                            handleEditChange("cpf", e.target.value)
                          }
                          size="small"
                        />
                      ) : (
                        user.cpf
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <TextField
                          value={editUsuario.telefone}
                          onChange={(e) =>
                            handleEditChange("telefone", e.target.value)
                          }
                          size="small"
                        />
                      ) : (
                        user.telefone
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Select
                          value={editUsuario.role}
                          onChange={(e) =>
                            handleEditChange("role", e.target.value)
                          }
                          size="small"
                        >
                          <MenuItem value="user">Usuário</MenuItem>
                          <MenuItem value="admin">Administrador</MenuItem>
                        </Select>
                      ) : (
                        user.role
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {isEditing ? (
                        <>
                          <IconButton
                            color="success"
                            onClick={handleSaveEdit}
                            size="small"
                            title="Salvar"
                          >
                            <SaveIcon />
                          </IconButton>
                          <IconButton
                            color="inherit"
                            onClick={handleCancelEdit}
                            size="small"
                            title="Cancelar"
                          >
                            <CancelIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(user)}
                            size="small"
                            title="Editar"
                          >
                            ✏️
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(user.id)}
                            size="small"
                            title="Excluir"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {usuariosFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={!!successMsg}
        autoHideDuration={4000}
        onClose={() => setSuccessMsg("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccessMsg("")}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMsg}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMsg}
        autoHideDuration={6000}
        onClose={() => setErrorMsg("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setErrorMsg("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMsg}
        </Alert>
      </Snackbar>

      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este usuário? Essa ação não pode ser
            desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancelar</Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GerenciarUsuarios;
