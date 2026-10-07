const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para interpretar JSON
app.use(express.json());

// Lista inicial de produtos
let produtos = [
  { id: 1, nome: 'Ração para Cães 10kg', preco: 120.0, estoque: 15 },
  { id: 2, nome: 'Shampoo Canino 500ml', preco: 25.5, estoque: 30 }
];

// Rota inicial
app.get('/', (req, res) => {
  res.send('API de Gerenciamento de Produtos ativa!');
});

// 1. LISTAR produtos (GET)
app.get('/produtos', (req, res) => {
  res.json(produtos);
});

// 2. BUSCAR produto por ID (GET)
app.get('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ mensagem: 'Produto não encontrado.' });
  }

  res.json(produto);
});

// 3. CADASTRAR novo produto (POST)
app.post('/produtos', (req, res) => {
  const { nome, preco, estoque } = req.body;

  if (!nome || !preco) {
    return res.status(400).json({ mensagem: 'Nome e preço são obrigatórios.' });
  }

  const novoProduto = {
    id: produtos.length > 0 ? produtos[produtos.length - 1].id + 1 : 1,
    nome,
    preco,
    estoque: estoque || 0
  };

  produtos.push(novoProduto);
  res.status(201).json({ mensagem: 'Produto cadastrado com sucesso!', produto: novoProduto });
});

// 4. ATUALIZAR produto (PUT)
app.put('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, preco, estoque } = req.body;

  const index = produtos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ mensagem: 'Produto não encontrado.' });
  }

  produtos[index] = {
    ...produtos[index],
    nome: nome !== undefined ? nome : produtos[index].nome,
    preco: preco !== undefined ? preco : produtos[index].preco,
    estoque: estoque !== undefined ? estoque : produtos[index].estoque
  };

  res.json({ mensagem: 'Produto atualizado com sucesso!', produto: produtos[index] });
});

// 5. DELETAR produto (DELETE)
app.delete('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = produtos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ mensagem: 'Produto não encontrado.' });
  }

  produtos.splice(index, 1);
  res.json({ mensagem: 'Produto removido com sucesso!' });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});