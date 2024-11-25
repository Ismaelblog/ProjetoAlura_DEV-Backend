import express from "express";
import multer from "multer";
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsControllers.js";
import cors from "cors";

const corsOptions = {
  origin: "http://localhost:8000",
  optionsSuccessStatus: 200
}

// Configura o armazenamento de arquivos para o Multer.
const storage = multer.diskStorage({
  // Define o destino para o salvamento dos arquivos.
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Salva na pasta 'uploads/'
  },
  // Define o nome do arquivo salvo.
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Mantém o nome original do arquivo
  }
});

// Cria uma instância do Multer com a configuração de armazenamento.
const upload = multer({ dest: "./uploads", storage }); // Define o destino temporário e o armazenamento

// Função para definir as rotas da aplicação.
const routes = (app) => {
  // Permite que o servidor interprete dados JSON enviados nas requisições.
  app.use(express.json());
  app.use(cors(corsOptions))
  
  // Rota para buscar todos os posts (implementada em postsControllers.js).
  app.get("/posts", listarPosts);

  // Rota para criar um novo post (implementada em postsControllers.js).
  app.post("/posts", postarNovoPost);

  // Rota para upload de imagem utilizando o middleware 'upload.single("imagem")'.
  // Esse middleware intercepta a requisição e processa o upload da imagem.
  // O parâmetro "imagem" define o nome do campo na requisição que contém a imagem.
  app.post("/upload", upload.single("imagem"), uploadImagem); // Rota para upload e processamento da imagem

  app.put("/upload/:id", atualizarNovoPost)
};

export default routes;