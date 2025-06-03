const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do banco de dados
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "estoque_db",
};

const pool = mysql.createPool(dbConfig);

// ======================== PRODUTOS ========================

// Listar produtos com categoria e fornecedor
app.get("/produtos", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.nome, p.quantidade, p.preco,
             c.id AS categoria_id, c.nome AS categoria_nome,
             f.id AS fornecedor_id, f.nome AS fornecedor_nome
      FROM produto p
      LEFT JOIN categoria c ON p.categoria_id = c.id
      LEFT JOIN fornecedor f ON p.fornecedor_id = f.id
    `);

    const produtos = rows.map((r) => ({
      id: r.id,
      nome: r.nome,
      quantidade: r.quantidade,
      preco: r.preco,
      categoria: r.categoria_id
        ? { id: r.categoria_id, nome: r.categoria_nome }
        : null,
      fornecedor: r.fornecedor_id
        ? { id: r.fornecedor_id, nome: r.fornecedor_nome }
        : null,
    }));

    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criar produto
app.post("/produtos", async (req, res) => {
  const { nome, quantidade, preco, categoriaId, fornecedorId } = req.body;

  try {
    const [result] = await pool.execute(
      `INSERT INTO produto (nome, quantidade, preco, categoria_id, fornecedor_id)
       VALUES (?, ?, ?, ?, ?)`,
      [nome, quantidade, preco, categoriaId || null, fornecedorId || null]
    );

    res.status(201).json({
      id: result.insertId,
      nome,
      quantidade,
      preco,
      categoriaId,
      fornecedorId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar produto
app.put("/produtos/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, quantidade, preco, categoriaId, fornecedorId } = req.body;

  try {
    await pool.execute(
      `UPDATE produto
       SET nome = ?, quantidade = ?, preco = ?, categoria_id = ?, fornecedor_id = ?
       WHERE id = ?`,
      [nome, quantidade, preco, categoriaId || null, fornecedorId || null, id]
    );
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar produto
app.delete("/produtos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.execute("DELETE FROM produto WHERE id = ?", [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================== MOVIMENTAÇÕES DE ESTOQUE ========================

// Função auxiliar para registrar movimentação (entrada ou saída)
async function registraMovimento(produtoId, tipo, quantidade, observacao) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const sinal = tipo === "entrada" ? 1 : -1;

    // Atualiza estoque
    const [rows] = await conn.query(
      "SELECT quantidade FROM produto WHERE id = ?",
      [produtoId]
    );
    if (rows.length === 0) {
      throw new Error("Produto não encontrado.");
    }

    const quantidadeAtual = rows[0].quantidade;
    if (tipo === "saida" && quantidade > quantidadeAtual) {
      throw new Error("Estoque insuficiente para a saída.");
    }

    await conn.execute(
      `UPDATE produto SET quantidade = quantidade + ? WHERE id = ?`,
      [sinal * quantidade, produtoId]
    );

    await conn.execute(
      `INSERT INTO movimentacao_estoque (produto_id, tipo, quantidade, observacao)
       VALUES (?, ?, ?, ?)`,
      [produtoId, tipo, quantidade, observacao || null]
    );

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

// Registrar entrada de produto (rota usada no frontend)
app.post("/produtos/:id/entrada", async (req, res) => {
  const { id } = req.params;
  const { quantidade, observacao } = req.body;

  if (!quantidade || quantidade <= 0) {
    return res.status(400).json({ error: "Quantidade inválida." });
  }

  try {
    await registraMovimento(id, "entrada", quantidade, observacao);
    res.status(201).json({ message: "Entrada registrada com sucesso." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Registrar saída de produto (rota usada no frontend)
app.post("/produtos/:id/saida", async (req, res) => {
  const { id } = req.params;
  const { quantidade, observacao } = req.body;

  if (!quantidade || quantidade <= 0) {
    return res.status(400).json({ error: "Quantidade inválida." });
  }

  try {
    await registraMovimento(id, "saida", quantidade, observacao);
    res.status(201).json({ message: "Saída registrada com sucesso." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar movimentações
app.get("/movimentacoes", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT m.id, m.tipo, m.quantidade, m.data_movimento, m.observacao,
             p.id AS produto_id, p.nome AS produto_nome
      FROM movimentacao_estoque m
      JOIN produto p ON m.produto_id = p.id
      ORDER BY m.data_movimento DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================== CATEGORIAS ========================

// Listar categorias
app.get("/categorias", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, nome FROM categoria");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criar categoria
app.post("/categorias", async (req, res) => {
  const { nome } = req.body;

  try {
    const [result] = await pool.execute(
      "INSERT INTO categoria (nome) VALUES (?)",
      [nome]
    );
    res.status(201).json({ id: result.insertId, nome });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar categoria
app.put("/categorias/:id", async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  try {
    const [result] = await pool.execute(
      "UPDATE categoria SET nome = ? WHERE id = ?",
      [nome, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    res.json({ id, nome });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar categoria
app.delete("/categorias/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute("DELETE FROM categoria WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================== FORNECEDORES ========================

// Listar fornecedores
app.get("/fornecedores", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nome, cnpj, email, telefone FROM fornecedor"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criar fornecedor
app.post("/fornecedores", async (req, res) => {
  const { nome, cnpj, email, telefone } = req.body;

  try {
    const [result] = await pool.execute(
      "INSERT INTO fornecedor (nome, cnpj, email, telefone) VALUES (?, ?, ?, ?)",
      [nome, cnpj, email, telefone]
    );

    res.status(201).json({
      id: result.insertId,
      nome,
      cnpj,
      email,
      telefone,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar fornecedor
app.put("/fornecedores/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, cnpj, email, telefone } = req.body;

  try {
    const [result] = await pool.execute(
      "UPDATE fornecedor SET nome = ?, cnpj = ?, email = ?, telefone = ? WHERE id = ?",
      [nome, cnpj, email, telefone, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Fornecedor não encontrado" });
    }

    res.json({ id, nome, cnpj, email, telefone });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar fornecedor
app.delete("/fornecedores/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute("DELETE FROM fornecedor WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Fornecedor não encontrado" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================== START SERVER ========================

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
