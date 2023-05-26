import { createSchema, createYoga } from "graphql-yoga";
import { createServer } from 'node:http'

const pessoas = [
  {
    id: '1',
    nome: 'Cormen',
    idade: 19
  },
  {
    id: '2',
    nome: 'Velleman',
    idade: 22
  }
]

const livros = [
  {
    id: '100',
    titulo: 'Introduction to Algorithms',
    edicao: 3,
    autor: '1'
  },
  {
    id: '101',
    titulo: 'How to Prove It',
    edicao: 2,
    autor: '2'
  }  
]

const comentarios = [
  {
    id: '1001',
    texto: 'excelente',
    nota: 5,
    livro: '101',
    autor: '1'
  },
  {
    id: '1002',
    texto: 'Gostei muito',
    nota: 5,
    livro: '101',
    autor: '1'
  }
]

const schema = createSchema({
  typeDefs: `
    type Pessoa{
      id: ID!
      nome: String!
      idade: Int
      livros: [Livro!]!
      comentarios: [Comentario!]!
    }
    type Livro{
      id: ID!
      titulo: String!
      edicao: Int!
      autor: Pessoa!
      comentarios: [Comentario!]!  
    }
    type Comentario{
      id: ID!
      texto: String!
      nota: Int!
      livro: Livro!
      autor: Pessoa!
    }
    type Query {
      livros: [Livro!]!
      pessoas: [Pessoa!]!
      comentarios: [Comentario!]!
    }
    `,
    //1. Dizer que a operação de busca de comentários existe
  resolvers: {
    Query: {
      livros(){
        return livros
      },
      pessoas(){
        return pessoas
      },
      comentarios(){
        return comentarios
      }  
    },
    Livro: {
      autor(parent, args, ctx, info){
        //devolver o objeto pessoa cujo id seja igual ao valor existente em parent.autor
        //dica: use a função find do javascript para operar sobre a coleção pessoas
        return pessoas.find(p => p.id === parent.autor)  
      },
      comentarios(parent, args, ctx, info){
        return comentarios.filter(c => c.livro === parent.id)
      }  
    },
    Pessoa: {
      //definir um resolver chamado livros
      //ele deve receber parent, args, ctx e info
      //ele utiliza a função filter operando sobre a coleção de livros
      //lembrando que ela produz uma coleção
      //somente devem ser incluidos os livros pertencentes a essa pessoa
      livros(parent, args, ctx, info){
        return livros.filter(l => l.autor === parent.id)
      },
      comentarios(parent, args, ctx, info){
        return comentarios.filter(c => c.autor === parent.id)
      }
    },
    Comentario: {
      livro (parent, args, ctx, info){
        return livros.find( livro => livro.id === parent.livro)  
      },
      autor(parent, args, ctx, info){
        return pessoas.find(p => p.id === parent.autor)  
      }  
    }
  }
})

//2. Escrever o resolver que a implementa

const yoga = createYoga({
  schema
})

const server = createServer(yoga)
const porta = process.env.PORT || 4000
server.listen(
  porta,
  () => console.info(`Servidor disponível em http://localhost:${porta}`)
)
