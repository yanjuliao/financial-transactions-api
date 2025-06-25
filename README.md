
<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" />
  </a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" />
  </a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank">
    <img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" />
  </a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank">
    <img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/>
  </a>
</p>

---

# 💰 Financial Transactions API

API RESTful desenvolvida com **NestJS**, **Prisma** e **MySQL** para controle de transações financeiras. Permite registrar entradas e saídas, associar categorias e calcular o saldo.

---

## 📦 Tecnologias

- **NestJS** – Framework backend para Node.js com TypeScript.
- **Prisma ORM** – Mapeamento objeto-relacional moderno.
- **MySQL** – Banco de dados relacional.
- **Docker** – Containerização da aplicação e banco.
- **Swagger (OpenAPI)** – Documentação interativa.
- **Class-validator** – Validação de DTOs.
- **Jest** – Testes unitários e E2E.

---

## 📁 Estrutura do Projeto

```
src/
├── category/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   └── dto/
├── transaction/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   └── dto/
├── common/
│   ├── mapper/
│   └── prisma/
└── main.ts
```

---

## 🚀 Como rodar

### 1. Clonar o repositório

```bash
git clone https://github.com/yanjuliao/financial-transactions-api.git
cd financial-transactions-api
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um `.env` com base no `.env.example`:

```
DATABASE_URL="mysql://user:password@localhost:3306/dbname"
```

### 4. Executar as migrações

```bash
npx prisma migrate dev --name init
```

### 5. Rodar a aplicação

```bash
# modo desenvolvimento
npm run start:dev
```

A API será iniciada em: **http://localhost:3000**

---

## 🔍 Documentação da API

Documentação interativa disponível via Swagger:

📌 [http://localhost:3000/api](http://localhost:3000/api)

---

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes end-to-end
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

---

## 📌 Funcionalidades

- ✅ Criar, atualizar e excluir transações
- ✅ Consultar transações por ID ou todas
- ✅ Registrar categorias personalizadas
- ✅ Relacionar transações a categorias
- ✅ Cadastro em massa (categorias e transações)
- ✅ Cálculo de saldo por tipo
- ✅ Validação automática de dados
- ✅ Arquitetura em camadas (Controller, Service, Repository, Mapper)

---

## 🐳 Docker

```bash
# Subir aplicação + MySQL
docker-compose up -d

# Aplicar migrations no container
docker exec -it api npx prisma migrate deploy
```

---

## 📚 Recursos adicionais

- [Documentação Oficial NestJS](https://docs.nestjs.com/)
- [Prisma ORM Docs](https://www.prisma.io/docs)
- [Swagger](https://swagger.io/tools/swagger-ui/)

---

## 👨‍💻 Autor

Desenvolvido por **Yan Julião**  
📧 yanjuliao7@email.com  
🔗 [linkedin.com/in/yan-juliao](https://linkedin.com/in/yan-juliao)  
🐙 [github.com/yanjuliao](https://github.com/yanjuliao)

---

## 📝 Licença

Este projeto está licenciado sob a licença [MIT](LICENSE).

---
