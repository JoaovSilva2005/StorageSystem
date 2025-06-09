import React, { useEffect, useState } from "react";

const DashboardPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token"); // ou outro local onde você armazena o token JWT

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

  if (loading) return <p>Carregando dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const totalProdutos = produtos.length;
  const totalCategorias = categorias.length;
  const totalFornecedores = fornecedores.length;
  const valorTotalEstoque = produtos.reduce(
    (acc, p) => acc + p.quantidade * p.preco,
    0
  );

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "20px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Dashboard do Estoque</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: 30,
        }}
      >
        <div
          style={{
            padding: 20,
            border: "1px solid #ccc",
            borderRadius: 6,
            width: "22%",
          }}
        >
          <h3>Total de Produtos</h3>
          <p style={{ fontSize: 24, fontWeight: "bold" }}>{totalProdutos}</p>
        </div>

        <div
          style={{
            padding: 20,
            border: "1px solid #ccc",
            borderRadius: 6,
            width: "22%",
          }}
        >
          <h3>Valor Total em Estoque</h3>
          <p style={{ fontSize: 24, fontWeight: "bold" }}>
            R$ {valorTotalEstoque.toFixed(2).replace(".", ",")}
          </p>
        </div>

        <div
          style={{
            padding: 20,
            border: "1px solid #ccc",
            borderRadius: 6,
            width: "22%",
          }}
        >
          <h3>Categorias</h3>
          <p style={{ fontSize: 24, fontWeight: "bold" }}>{totalCategorias}</p>
        </div>

        <div
          style={{
            padding: 20,
            border: "1px solid #ccc",
            borderRadius: 6,
            width: "22%",
          }}
        >
          <h3>Fornecedores</h3>
          <p style={{ fontSize: 24, fontWeight: "bold" }}>
            {totalFornecedores}
          </p>
        </div>
      </div>

      <h2>Últimas Movimentações</h2>
      {movimentacoes.length === 0 ? (
        <p>Nenhuma movimentação registrada.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
                Produto
              </th>
              <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
                Tipo
              </th>
              <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
                Quantidade
              </th>
              <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
                Data
              </th>
              <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
                Observação
              </th>
            </tr>
          </thead>
          <tbody>
            {movimentacoes.slice(0, 10).map((mov) => (
              <tr key={mov.id}>
                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                  {mov.produto.nome}
                </td>
                <td
                  style={{
                    borderBottom: "1px solid #eee",
                    padding: 8,
                    textTransform: "capitalize",
                  }}
                >
                  {mov.tipo}
                </td>
                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                  {mov.quantidade}
                </td>
                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                  {new Date(mov.data_movimento).toLocaleString("pt-BR")}
                </td>
                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                  {mov.observacao || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DashboardPage;
