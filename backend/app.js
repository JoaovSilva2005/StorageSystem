// ====== BACKEND: server.js ======
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do pool MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "estoque_db",
});

// Middleware: autenticarToken
function autenticarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token não fornecido." });
  jwt.verify(
    token,
    process.env.JWT_SECRET || "seusegredosecreto",
    (err, usuario) => {
      if (err) return res.status(403).json({ error: "Token inválido." });
      req.usuario = usuario; // { id, email, role }
      next();
    }
  );
}

// Middleware: autenticarAdmin (token + role)
const autenticarAdmin = [
  autenticarToken,
  (req, res, next) => {
    if (req.usuario.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Acesso de administrador necessário." });
    }
    next();
  },
];

// ===== Registro =====
app.post("/register", async (req, res) => {
  const { nome, email, senha, cpf, telefone } = req.body;
  if (!nome || !email || !senha || !cpf || !telefone) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  const telRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ error: "Email inválido." });
  if (!cpfRegex.test(cpf))
    return res.status(400).json({ error: "CPF inválido." });
  if (!telRegex.test(telefone))
    return res.status(400).json({ error: "Telefone inválido." });

  try {
    const [existsEmail] = await pool.query(
      "SELECT 1 FROM usuarios WHERE email = ?",
      [email]
    );
    if (existsEmail.length)
      return res.status(409).json({ error: "Email já cadastrado." });
    const [existsCpf] = await pool.query(
      "SELECT 1 FROM usuarios WHERE cpf = ?",
      [cpf]
    );
    if (existsCpf.length)
      return res.status(409).json({ error: "CPF já cadastrado." });

    const hash = await bcrypt.hash(senha, 10);
    await pool.execute(
      "INSERT INTO usuarios (nome, email, senha, cpf, telefone, role) VALUES (?, ?, ?, ?, ?, ?)",
      [nome, email, hash, cpf, telefone, "user"]
    );
    res.status(201).json({ message: "Registro realizado com sucesso." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Login =====
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);
    if (!rows.length)
      return res.status(401).json({ error: "Credenciais inválidas." });
    const user = rows[0];
    if (!(await bcrypt.compare(senha, user.senha))) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "seusegredosecreto",
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Admin Usuários =====
// Listar todos os usuários
app.get("/admin/users", autenticarAdmin, async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, nome, email, cpf, telefone, role FROM usuarios ORDER BY nome"
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar todos os dados do usuário (admin)
app.put("/admin/users/:id", autenticarAdmin, async (req, res) => {
  const { id } = req.params;
  const { nome, email, cpf, telefone, role } = req.body;

  // Validações básicas (pode melhorar conforme regras do seu sistema)
  if (!nome || !email || !cpf || !telefone || !role) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  const telRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ error: "Email inválido." });
  if (!cpfRegex.test(cpf))
    return res.status(400).json({ error: "CPF inválido." });
  if (!telRegex.test(telefone))
    return res.status(400).json({ error: "Telefone inválido." });
  if (!["user", "admin"].includes(role))
    return res.status(400).json({ error: "Role inválida." });

  try {
    // Atualiza o usuário
    const [result] = await pool.execute(
      "UPDATE usuarios SET nome = ?, email = ?, cpf = ?, telefone = ?, role = ? WHERE id = ?",
      [nome, email, cpf, telefone, role, id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.json({ message: "Usuário atualizado com sucesso." });
  } catch (err) {
    // Pode verificar erro de chave única aqui (email ou cpf duplicado)
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ error: "Email ou CPF já cadastrado em outro usuário." });
    }
    res.status(500).json({ error: err.message });
  }
});

// Excluir usuário
app.delete("/admin/users/:id", autenticarAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.execute("DELETE FROM usuarios WHERE id = ?", [
      id,
    ]);
    if (!result.affectedRows) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.json({ message: "Usuário excluído com sucesso." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Login =====
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);
    if (!rows.length)
      return res.status(401).json({ error: "Credenciais inválidas." });
    const user = rows[0];
    if (!(await bcrypt.compare(senha, user.senha)))
      return res.status(401).json({ error: "Credenciais inválidas." });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      "seusegredosecreto",
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Produtos =====

// LISTAR PRODUTOS - rota GET corrigida
app.get("/produtos", autenticarToken, async (req, res) => {
  const userId = req.usuario.id;
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.nome, p.quantidade, p.preco, p.quantidade_minima, p.quantidade_maxima,
              c.id AS categoria_id, c.nome AS categoria_nome,
              f.id AS fornecedor_id, f.nome AS fornecedor_nome
       FROM produto p
       LEFT JOIN categoria c ON p.categoria_id = c.id
       LEFT JOIN fornecedor f ON p.fornecedor_id = f.id
       WHERE p.user_id = ?
       ORDER BY p.nome`,
      [userId]
    );

    const produtos = rows.map((p) => ({
      id: p.id,
      nome: p.nome,
      quantidade: p.quantidade,
      preco: Number(p.preco).toFixed(2),
      quantidade_minima: p.quantidade_minima === 0 ? "-" : p.quantidade_minima,
      quantidade_maxima:
        p.quantidade_maxima === null || p.quantidade_maxima === 0
          ? "-"
          : p.quantidade_maxima,
      categoria: p.categoria_nome ? p.categoria_nome : "-",
      fornecedor: p.fornecedor_nome ? p.fornecedor_nome : "-",
      idCategoria: p.categoria_id || "",
      idFornecedor: p.fornecedor_id || "",
    }));

    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROTA POST PRODUTOS (criar)
app.post("/produtos", autenticarToken, async (req, res) => {
  const userId = req.usuario.id;
  let {
    nome,
    quantidade,
    preco,
    categoriaId,
    fornecedorId,
    quantidade_minima,
    quantidade_maxima,
  } = req.body;

  quantidade = Number(quantidade);
  preco = Number(preco);
  quantidade_minima =
    quantidade_minima !== undefined &&
    quantidade_minima !== null &&
    quantidade_minima !== ""
      ? Number(quantidade_minima)
      : 0;
  quantidade_maxima =
    quantidade_maxima !== undefined &&
    quantidade_maxima !== null &&
    quantidade_maxima !== ""
      ? Number(quantidade_maxima)
      : null;

  if (!nome || isNaN(quantidade) || isNaN(preco)) {
    return res
      .status(400)
      .json({ error: "Dados inválidos para nome, quantidade ou preço." });
  }

  try {
    const [r] = await pool.execute(
      `INSERT INTO produto (nome, quantidade, preco, categoria_id, fornecedor_id, user_id, quantidade_minima, quantidade_maxima)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome,
        quantidade,
        preco,
        categoriaId || null,
        fornecedorId || null,
        userId,
        quantidade_minima,
        quantidade_maxima,
      ]
    );
    res.status(201).json({
      id: r.insertId,
      nome,
      quantidade,
      preco,
      quantidade_minima,
      quantidade_maxima,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROTA PUT PRODUTOS (atualizar)
app.put("/produtos/:id", autenticarToken, async (req, res) => {
  const userId = req.usuario.id;
  const { id } = req.params;
  let {
    nome,
    quantidade,
    preco,
    categoriaId,
    fornecedorId,
    quantidade_minima,
    quantidade_maxima,
  } = req.body;

  quantidade = Number(quantidade);
  preco = Number(preco);
  quantidade_minima =
    quantidade_minima !== undefined &&
    quantidade_minima !== null &&
    quantidade_minima !== ""
      ? Number(quantidade_minima)
      : 0;
  quantidade_maxima =
    quantidade_maxima !== undefined &&
    quantidade_maxima !== null &&
    quantidade_maxima !== ""
      ? Number(quantidade_maxima)
      : null;

  if (!nome || isNaN(quantidade) || isNaN(preco)) {
    return res
      .status(400)
      .json({ error: "Dados inválidos para nome, quantidade ou preço." });
  }

  try {
    const [r] = await pool.execute(
      `UPDATE produto
       SET nome=?, quantidade=?, preco=?, categoria_id=?, fornecedor_id=?, quantidade_minima=?, quantidade_maxima=?
       WHERE id=? AND user_id=?`,
      [
        nome,
        quantidade,
        preco,
        categoriaId || null,
        fornecedorId || null,
        quantidade_minima,
        quantidade_maxima,
        id,
        userId,
      ]
    );
    if (!r.affectedRows)
      return res
        .status(404)
        .json({ error: "Produto não encontrado ou sem permissão." });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Movimentações =====
async function registraMovimento(
  produtoId,
  userId,
  tipo,
  quantidade,
  observacao
) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const sinal = tipo === "entrada" ? 1 : -1;
    const [rows] = await conn.query(
      "SELECT quantidade FROM produto WHERE id = ? AND user_id = ?",
      [produtoId, userId]
    );
    if (!rows.length)
      throw new Error("Produto não encontrado ou sem permissão.");
    const qtdAtual = rows[0].quantidade;
    if (tipo === "saida" && quantidade > qtdAtual)
      throw new Error("Estoque insuficiente.");

    await conn.execute(
      "UPDATE produto SET quantidade = quantidade + ? WHERE id = ? AND user_id = ?",
      [sinal * quantidade, produtoId, userId]
    );
    await conn.execute(
      `INSERT INTO movimentacao_estoque (produto_id, tipo, quantidade, observacao, user_id)
       VALUES (?, ?, ?, ?, ?)`,
      [produtoId, tipo, quantidade, observacao || null, userId]
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
  const userId = req.usuario.id;
  const { id } = req.params;
  const { quantidade, observacao } = req.body;
  if (!quantidade || quantidade <= 0)
    return res.status(400).json({ error: "Quantidade inválida." });
  try {
    await registraMovimento(id, userId, "entrada", quantidade, observacao);
    res.status(201).json({ message: "Entrada registrada com sucesso." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/produtos/:id/saida", autenticarToken, async (req, res) => {
  const userId = req.usuario.id;
  const { id } = req.params;
  const { quantidade, observacao } = req.body;
  if (!quantidade || quantidade <= 0)
    return res.status(400).json({ error: "Quantidade inválida." });
  try {
    await registraMovimento(id, userId, "saida", quantidade, observacao);
    res.status(201).json({ message: "Saída registrada com sucesso." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/movimentacoes", autenticarToken, async (req, res) => {
  const userId = req.usuario.id;
  try {
    const [rows] = await pool.query(
      `SELECT m.id, m.tipo, m.quantidade, m.data_movimento, m.observacao,
              p.id AS produto_id, p.nome AS produto_nome
       FROM movimentacao_estoque m
       JOIN produto p ON m.produto_id = p.id
       WHERE m.user_id = ?
       ORDER BY m.data_movimento DESC`,
      [userId]
    );
    const movs = rows.map((r) => ({
      id: r.id,
      tipo: r.tipo,
      quantidade: r.quantidade,
      data_movimento: r.data_movimento,
      observacao: r.observacao,
      produto: { id: r.produto_id, nome: r.produto_nome },
    }));
    res.json(movs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Categorias =====
app.get("/categorias", autenticarToken, async (req, res) => {
  const userId = req.usuario.id;
  try {
    const [rows] = await pool.query(
      "SELECT id, nome FROM categoria WHERE user_id = ? ORDER BY nome",
      [userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/categorias", autenticarToken, async (req, res) => {
  const userId = req.usuario.id;
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: "Nome é obrigatório." });
  try {
    const [r] = await pool.execute(
      "INSERT INTO categoria (nome, user_id) VALUES (?, ?)",
      [nome, userId]
    );
    res.status(201).json({ id: r.insertId, nome });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/categorias/:id", autenticarToken, async (req, res) => {
  const userId = req.usuario.id;
  const { id } = req.params;
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: "Nome é obrigatório." });
  try {
    const [r] = await pool.execute(
      "UPDATE categoria SET nome = ? WHERE id = ? AND user_id = ?",
      [nome, id, userId]
    );
    if (!r.affectedRows)
      return res
        .status(404)
        .json({ error: "Categoria não encontrada ou sem permissão." });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/categorias/:id", autenticarToken, async (req, res) => {
  const userId = req.usuario.id;
  const { id } = req.params;
  try {
    const [r] = await pool.execute(
      "DELETE FROM categoria WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    if (!r.affectedRows)
      return res
        .status(404)
        .json({ error: "Categoria não encontrada ou sem permissão." });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Fornecedores =====
app.get("/fornecedores", autenticarToken, async (req, res) => {
  const userId = req.usuario.id;
  try {
    const [rows] = await pool.query(
      "SELECT id, nome, cnpj, email, telefone FROM fornecedor WHERE user_id = ?",
      [userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/fornecedores", autenticarToken, async (req, res) => {
  const userId = req.usuario.id;
  const { nome, cnpj, email, telefone } = req.body;
  if (!nome || !cnpj)
    return res.status(400).json({ error: "Nome e CNPJ são obrigatórios." });
  try {
    const [r] = await pool.execute(
      "INSERT INTO fornecedor (nome, cnpj, email, telefone, user_id) VALUES (?, ?, ?, ?, ?)",
      [nome, cnpj, email || null, telefone || null, userId]
    );
    res.status(201).json({ id: r.insertId, nome, cnpj, email, telefone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/fornecedores/:id", autenticarToken, async (req, res) => {
  const userId = req.usuario.id;
  const { id } = req.params;
  const { nome, cnpj, email, telefone } = req.body;
  if (!nome || !cnpj)
    return res.status(400).json({ error: "Nome e CNPJ são obrigatórios." });
  try {
    const [r] = await pool.execute(
      "UPDATE fornecedor SET nome=?, cnpj=?, email=?, telefone=? WHERE id=? AND user_id=?",
      [nome, cnpj, email || null, telefone || null, id, userId]
    );
    if (!r.affectedRows)
      return res
        .status(404)
        .json({ error: "Fornecedor não encontrado ou sem permissão." });
    res.json({ message: "Fornecedor atualizado com sucesso." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/fornecedores/:id", autenticarToken, async (req, res) => {
  const userId = req.usuario.id;
  const { id } = req.params;
  try {
    const [r] = await pool.execute(
      "DELETE FROM fornecedor WHERE id=? AND user_id=?",
      [id, userId]
    );
    if (!r.affectedRows)
      return res
        .status(404)
        .json({ error: "Fornecedor não encontrado ou sem permissão." });
    res.json({ message: "Fornecedor excluído com sucesso." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Servidor
const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
