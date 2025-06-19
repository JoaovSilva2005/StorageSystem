import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  useTheme,
} from "@mui/material";

const DashboardPage = () => {
  const theme = useTheme();

  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroTexto, setFiltroTexto] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Usuário não autenticado.");
      setLoading(false);
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const fetchData = async () => {
      try {
        const [produtosRes, categoriasRes, fornecedoresRes, movimentacoesRes] =
          await Promise.all([
            fetch("http://localhost:3001/produtos", { headers }),
            fetch("http://localhost:3001/categorias", { headers }),
            fetch("http://localhost:3001/fornecedores", { headers }),
            fetch("http://localhost:3001/movimentacoes", { headers }),
          ]);

        if (!produtosRes.ok) throw new Error("Erro ao carregar produtos");
        if (!categoriasRes.ok) throw new Error("Erro ao carregar categorias");
        if (!fornecedoresRes.ok)
          throw new Error("Erro ao carregar fornecedores");
        if (!movimentacoesRes.ok)
          throw new Error("Erro ao carregar movimentações");

        const produtosData = await produtosRes.json();
        const categoriasData = await categoriasRes.json();
        const fornecedoresData = await fornecedoresRes.json();
        const movimentacoesData = await movimentacoesRes.json();

        setProdutos(produtosData);
        setCategorias(categoriasData);
        setFornecedores(fornecedoresData);
        setMovimentacoes(movimentacoesData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );

  // Função para formatar data para string comparável
  const formatarData = (data) =>
    new Date(data).toLocaleDateString("pt-BR") +
    " " +
    new Date(data).toLocaleTimeString("pt-BR");

  // Filtra movimentações conforme filtroTexto
  const movimentacoesFiltradas = movimentacoes.filter((mov) => {
    const termo = filtroTexto.toLowerCase();

    // Quantidade e data como string
    const quantidadeStr = mov.quantidade.toString();
    const dataStr = formatarData(mov.data_movimento).toLowerCase();

    return (
      mov.produto.nome.toLowerCase().includes(termo) ||
      mov.tipo.toLowerCase().includes(termo) ||
      quantidadeStr.includes(termo) ||
      dataStr.includes(termo) ||
      (mov.observacao || "").toLowerCase().includes(termo)
    );
  });

  const totalProdutos = produtos.length;
  const totalCategorias = categorias.length;
  const totalFornecedores = fornecedores.length;
  const valorTotalEstoque = produtos.reduce(
    (acc, p) => acc + p.quantidade * p.preco,
    0
  );

  return (
    <Box maxWidth={1000} mx="auto" p={3}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        color={theme.palette.primary.main}
        fontWeight={700}
      >
        Dashboard do Estoque
      </Typography>

      <Grid container spacing={3} mb={4}>
        {[
          {
            title: "Total de Produtos",
            value: totalProdutos,
          },
          {
            title: "Valor Total em Estoque",
            value: `R$ ${valorTotalEstoque.toFixed(2).replace(".", ",")}`,
          },
          {
            title: "Categorias",
            value: totalCategorias,
          },
          {
            title: "Fornecedores",
            value: totalFornecedores,
          },
        ].map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: "center",
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[4],
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {card.title}
              </Typography>
              <Typography variant="h5" fontWeight={700} color="primary">
                {card.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" mb={2}>
        Últimas Movimentações
      </Typography>

      <TextField
        variant="outlined"
        fullWidth
        placeholder="Pesquisar movimentações (produto, tipo, quantidade, data, observação)"
        value={filtroTexto}
        onChange={(e) => setFiltroTexto(e.target.value)}
        sx={{ mb: 2 }}
      />

      {movimentacoesFiltradas.length === 0 ? (
        <Typography>Nenhuma movimentação encontrada.</Typography>
      ) : (
        <Paper elevation={3} sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 650 }} aria-label="Últimas movimentações">
            <TableHead
              sx={{
                backgroundColor: theme.palette.primary.main,
                "& th": { color: "white", fontWeight: "bold" },
              }}
            >
              <TableRow>
                <TableCell>Produto</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Observação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movimentacoesFiltradas.slice(0, 10).map((mov) => (
                <TableRow
                  key={mov.id}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{mov.produto.nome}</TableCell>
                  <TableCell sx={{ textTransform: "capitalize" }}>
                    {mov.tipo}
                  </TableCell>
                  <TableCell>{mov.quantidade}</TableCell>
                  <TableCell>{formatarData(mov.data_movimento)}</TableCell>
                  <TableCell>{mov.observacao || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default DashboardPage;
