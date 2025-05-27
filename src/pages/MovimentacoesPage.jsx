import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const MovimentacoesPage = () => {
  const [movs, setMovs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/movimentacoes")
      .then((res) => res.json())
      .then((data) => setMovs(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Movimentações de Estoque
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Produto</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Quantidade</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Observação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movs.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.id}</TableCell>
                <TableCell>{m.produto_nome}</TableCell>
                <TableCell>{m.tipo}</TableCell>
                <TableCell>{m.quantidade}</TableCell>
                <TableCell>
                  {new Date(m.data_movimento).toLocaleString()}
                </TableCell>
                <TableCell>{m.observacao || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MovimentacoesPage;
