import {getTodosPosts , criarPost, atualizarPost} from "../models/postsModels.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

// Função assíncrona para listar todos os posts.
// Chama a função getTodosPosts do modelo para buscar os posts no banco de dados.
// Envia os posts como resposta em formato JSON com status 200 (sucesso).
export async function listarPosts(req, res) {
  const posts = await getTodosPosts();
  res.status(200).json(posts);
}

// Função assíncrona para criar um novo post.
// Extrai os dados do novo post do corpo da requisição.
// Chama a função criarPost do modelo para inserir o post no banco de dados.
// Retorna o post criado como resposta em formato JSON com status 200 (sucesso).
// Caso ocorra um erro, registra o erro no console e envia uma mensagem de erro ao cliente.
export async function postarNovoPost(req, res) {
  const novoPost = req.body;
  try {
    const postCriado = await criarPost(novoPost);
    res.status(200).json(postCriado);
  } catch(erro) {
    console.error(erro.message);
    res.status(500).json({"Erro":"Falha na requisição"})
  }
}

// Função assíncrona para realizar o upload de uma imagem e criar um novo post.
// Extrai os dados da imagem da requisição.
// Cria um novo objeto de post com a descrição, URL da imagem e texto alternativo.
// Chama a função criarPost do modelo para inserir o post no banco de dados.
// Renomeia o arquivo da imagem para incluir o ID do post criado.
// Retorna o post criado como resposta em formato JSON com status 200 (sucesso).
// Caso ocorra um erro, registra o erro no console e envia uma mensagem de erro ao cliente.
export async function uploadImagem(req, res) {
  const novoPost = {
    descricao: "",
    imgUrl: req.file.originalname,
    alt: ""
  }

  try {
    const postCriado = await criarPost(novoPost);
    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
    fs.renameSync(req.file.path, imagemAtualizada);
    res.status(200).json(postCriado);
  } catch(erro) {
    console.error(erro.message);
    res.status(500).json({"Erro":"Falha na requisição"})
  }
}

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`
    try {
      const imageBuffer = fs.readFileSync(`uploads/${id}.png`)
      const descricao = await gerarDescricaoComGemini(imageBuffer)

      const post = {
        imgUrl: urlImagem,
        descricao: descricao,
        alt: req.body.alt
    }

      const postCriado = await atualizarPost(id, post);
      res.status(200).json(postCriado);
    } catch(erro) {
      console.error(erro.message);
      res.status(500).json({"Erro":"Falha na requisição"})
    }
  }