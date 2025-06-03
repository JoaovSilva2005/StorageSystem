import { useState, useEffect } from "react";
import axios from "axios";

function MovimentacaoForm() {
  const [produtos, setProdutos] = useState([]);
  const [produtoId, setProdutoId] = useState("");
  const [tipo, setTipo] = useState("ENTRADA");
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/produtos")
      .then((res) => setProdutos(res.data))
      .catch((err) => console.error("Erro ao carregar produtos:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!produtoId) {
      alert("Selecione um produto.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/movimentacoes", {
        produto_id: produtoId,
        tipo,
        quantidade: parseInt(quantidade),
      });
      alert("Movimentação realizada!");
      // Limpar formulário após envio
      setProdutoId("");
      setTipo("ENTRADA");
      setQuantidade(1);
    } catch (error) {
      alert("Erro ao registrar movimentação.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={produtoId}
        onChange={(e) => setProdutoId(e.target.value)}
        required
      >
        <option value="">Selecione um produto</option>
        {produtos.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nome}
          </option>
        ))}
      </select>

      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="ENTRADA">Entrada</option>
        <option value="SAIDA">Saída</option>
      </select>

      <input
        type="number"
        value={quantidade}
        min={1}
        onChange={(e) => setQuantidade(e.target.value)}
        required
      />

      <button type="submit">Registrar</button>
    </form>
  );
}

export default MovimentacaoForm;
