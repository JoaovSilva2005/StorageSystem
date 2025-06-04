const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do banco MySQL
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "estoque_db",
};
const pool = mysql.createPool(dbConfig);

// Middleware para autenticar JWT
const autenticarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token não fornecido." });

  jwt.verify(token, "seusegredosecreto", (err, usuario) => {
    if (err) return res.status(403).json({ error: "Token inválido." });
    req.usuario = usuario;
    next();
  });
};

// Registro de usuário
app.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha)
    return res
      .status(400)
      .json({ error: "Nome, email e senha são obrigatórios." });

  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);
    if (rows.length > 0)
      return res.status(409).json({ error: "Email já cadastrado." });

    const hash = await bcrypt.hash(senha, 10);
    await pool.execute(
      "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
      [nome, email, hash]
    );
    res.status(201).json({ message: "Usuário registrado com sucesso." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login de usuário
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0)
      return res.status(401).json({ error: "Credenciais inválidas." });

    const user = rows[0];
    const match = await bcrypt.compare(senha, user.senha);
    if (!match)
      return res.status(401).json({ error: "Credenciais inválidas." });

    const token = jwt.sign({ id: user.id, email }, "seusegredosecreto", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= PRODUTOS =================

app.get("/produtos", autenticarToken, async (req, res) => {
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

app.post("/produtos", autenticarToken, async (req, res) => {
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

app.put("/produtos/:id", autenticarToken, async (req, res) => {
  const { id } = req.params;
  const { nome, quantidade, preco, categoriaId, fornecedorId } = req.body;
  try {
    await pool.execute(
      `UPDATE produto SET nome = ?, quantidade = ?, preco = ?, categoria_id = ?, fornecedor_id = ? WHERE id = ?`,
      [nome, quantidade, preco, categoriaId || null, fornecedorId || null, id]
    );
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/produtos/:id", autenticarToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute("DELETE FROM produto WHERE id = ?", [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= MOVIMENTAÇÕES =================

async function registraMovimento(produtoId, tipo, quantidade, observacao) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const sinal = tipo === "entrada" ? 1 : -1;
    const [rows] = await conn.query(
      "SELECT quantidade FROM produto WHERE id = ?",
      [produtoId]
    );
    if (rows.length === 0) throw new Error("Produto não encontrado.");
    const quantidadeAtual = rows[0].quantidade;
    if (tipo === "saida" && quantidade > quantidadeAtual)
      throw new Error("Estoque insuficiente.");

    await conn.execute(
      "UPDATE produto SET quantidade = quantidade + ? WHERE id = ?",
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

app.post("/produtos/:id/entrada", autenticarToken, async (req, res) => {
  const { id } = req.params;
  const { quantidade, observacao } = req.body;
  if (!quantidade || quantidade <= 0)
    return res.status(400).json({ error: "Quantidade inválida." });

  try {
    await registraMovimento(id, "entrada", quantidade, observacao);
    res.status(201).json({ message: "Entrada registrada com sucesso." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/produtos/:id/saida", autenticarToken, async (req, res) => {
  const { id } = req.params;
  const { quantidade, observacao } = req.body;
  if (!quantidade || quantidade <= 0)
    return res.status(400).json({ error: "Quantidade inválida." });

  try {
    await registraMovimento(id, "saida", quantidade, observacao);
    res.status(201).json({ message: "Saída registrada com sucesso." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/movimentacoes", autenticarToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT m.id, m.tipo, m.quantidade, m.data_movimento, m.observacao,
             p.id AS produto_id, p.nome AS produto_nome
      FROM movimentacao_estoque m
      JOIN produto p ON m.produto_id = p.id
      ORDER BY m.data_movimento DESC
    `);

    const movimentacoes = rows.map((r) => ({
      id: r.id,
      tipo: r.tipo,
      quantidade: r.quantidade,
      data_movimento: r.data_movimento,
      observacao: r.observacao,
      produto: {
        id: r.produto_id,
        nome: r.produto_nome,
      },
    }));

    res.json(movimentacoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= CATEGORIAS =================

app.get("/categorias", autenticarToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categoria ORDER BY nome");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/categorias", autenticarToken, async (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: "Nome é obrigatório." });

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

app.put("/categorias/:id", autenticarToken, async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: "Nome é obrigatório." });

  try {
    await pool.execute("UPDATE categoria SET nome = ? WHERE id = ?", [
      nome,
      id,
    ]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/categorias/:id", autenticarToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute("DELETE FROM categoria WHERE id = ?", [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= FORNECEDORES =================

app.get("/fornecedores", autenticarToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM fornecedor ORDER BY nome");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/fornecedores", autenticarToken, async (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: "Nome é obrigatório." });

  try {
    const [result] = await pool.execute(
      "INSERT INTO fornecedor (nome) VALUES (?)",
      [nome]
    );
    res.status(201).json({ id: result.insertId, nome });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/fornecedores/:id", autenticarToken, async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: "Nome é obrigatório." });

  try {
    await pool.execute("UPDATE fornecedor SET nome = ? WHERE id = ?", [
      nome,
      id,
    ]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/fornecedores/:id", autenticarToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute("DELETE FROM fornecedor WHERE id = ?", [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Servidor ouvindo
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
