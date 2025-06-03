import { useEffect, useState } from "react";
import axios from "axios";

function MovimentacoesLista() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/movimentacoes")
      .then((res) => {
        setMovimentacoes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erro ao carregar movimentações.");
        setLoading(false);
        console.error(err);
      });
  }, []);

  if (loading) return <p>Carregando movimentações...</p>;
  if (error) return <p>{error}</p>;

  if (movimentacoes.length === 0)
    return <p>Nenhuma movimentação registrada.</p>;

  return (
    <div>
      <h2>Lista de Movimentações</h2>
      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Produto</th>
            <th>Tipo</th>
            <th>Quantidade</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {movimentacoes.map((mov) => (
            <tr key={mov.id}>
              <td>{mov.produto_nome || mov.produto_id}</td>
              <td>{mov.tipo}</td>
              <td>{mov.quantidade}</td>
              <td>{new Date(mov.data).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MovimentacoesLista;
