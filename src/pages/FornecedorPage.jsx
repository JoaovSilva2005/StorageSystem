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

export default function FornecedorPage() {
  const [fornecedores, setFornecedores] = useState([]);
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados para edição
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [fornecedorEdit, setFornecedorEdit] = useState(null);

  // Estado para confirmação exclusão
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fornecedorDelete, setFornecedorDelete] = useState(null);

  // Buscar fornecedores do backend
  const fetchFornecedores = () => {
    setLoading(true);
    fetch("http://localhost:3001/fornecedores")
      .then((r) => {
        if (!r.ok) throw new Error("Erro ao buscar fornecedores");
        return r.json();
      })
      .then((data) => setFornecedores(data))
      .catch((err) => alert(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(fetchFornecedores, []);

  // Cadastrar novo fornecedor
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar campos mínimos (exemplo simples)
    if (!nome.trim() || !cnpj.trim()) {
      alert("Nome e CNPJ são obrigatórios");
      return;
    }

    fetch("http://localhost:3001/fornecedores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, cnpj, email, telefone }),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Erro ao cadastrar fornecedor");
        return r.json();
      })
      .then(() => {
        setNome("");
        setCnpj("");
        setEmail("");
        setTelefone("");
        fetchFornecedores();
      })
      .catch((err) => alert(err.message));
  };

  // Abrir diálogo edição e preencher com dados do fornecedor selecionado
  const openEditDialog = (fornecedor) => {
    setFornecedorEdit(fornecedor);
    setEditDialogOpen(true);
  };

  // Salvar edição via PUT
  const handleSaveEdit = () => {
    // Validação básica
    if (!fornecedorEdit.nome.trim() || !fornecedorEdit.cnpj.trim()) {
      alert("Nome e CNPJ são obrigatórios");
      return;
    }

    fetch(`http://localhost:3001/fornecedores/${fornecedorEdit.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fornecedorEdit),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Erro ao salvar fornecedor");
        return r.json();
      })
      .then(() => {
        setEditDialogOpen(false);
        setFornecedorEdit(null);
        fetchFornecedores();
      })
      .catch((err) => {
        alert(err.message);
        console.error(err);
      });
  };

  // Abrir diálogo exclusão
  const openDeleteDialog = (fornecedor) => {
    setFornecedorDelete(fornecedor);
    setDeleteDialogOpen(true);
  };

  // Confirmar exclusão via DELETE
  const handleConfirmDelete = () => {
    fetch(`http://localhost:3001/fornecedores/${fornecedorDelete.id}`, {
      method: "DELETE",
    })
      .then((r) => {
        if (!r.ok) throw new Error("Erro ao deletar fornecedor");
        // No DELETE 204 normalmente não tem corpo, então só seguimos
        setDeleteDialogOpen(false);
        setFornecedorDelete(null);
        fetchFornecedores();
      })
      .catch((err) => {
        alert(err.message);
        console.error(err);
      });
  };

  return (
    <Stack spacing={4} sx={{ maxWidth: 700, mx: "auto", py: 3 }}>
      {/* Formulário cadastro */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Cadastro de Fornecedor
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              label="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="CNPJ"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <TextField
              label="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              fullWidth
            />
            <Button variant="contained" type="submit">
              Cadastrar
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Tabela fornecedores */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Fornecedores Cadastrados
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
                <TableCell>CNPJ</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fornecedores.map((f) => (
                <TableRow key={f.id}>
                  <TableCell>{f.nome}</TableCell>
                  <TableCell>{f.cnpj}</TableCell>
                  <TableCell>{f.email}</TableCell>
                  <TableCell>{f.telefone}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => openEditDialog(f)}
                      size="small"
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => openDeleteDialog(f)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {fornecedores.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nenhum fornecedor cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Diálogo edição */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Editar Fornecedor</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nome"
              fullWidth
              value={fornecedorEdit?.nome || ""}
              onChange={(e) =>
                setFornecedorEdit((prev) => ({ ...prev, nome: e.target.value }))
              }
              required
            />
            <TextField
              label="CNPJ"
              fullWidth
              value={fornecedorEdit?.cnpj || ""}
              onChange={(e) =>
                setFornecedorEdit((prev) => ({ ...prev, cnpj: e.target.value }))
              }
              required
            />
            <TextField
              label="Email"
              fullWidth
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
              fullWidth
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
          <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          Deseja realmente excluir o fornecedor{" "}
          <strong>{fornecedorDelete?.nome}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
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
