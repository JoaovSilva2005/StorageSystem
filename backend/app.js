const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do banco
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "estoque_db",
};

const pool = mysql.createPool(dbConfig);

//
// ROTAS
//

// ======================== PRODUTOS ========================

// Listar produtos com categoria e fornecedor
app.get("/produtos", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.nome, p.quantidade, p.preco,
             c.id as categoria_id, c.nome as categoria_nome,
             f.id as fornecedor_id, f.nome as fornecedor_nome
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

// ======================== FORNECEDORES ========================

// Listar fornecedores (completo)
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

// Criar fornecedor (completo)
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

// ======================== INICIAR SERVIDOR ========================

app.listen(3001, () => {
  console.log("✅ API rodando em http://localhost:3001");
});
