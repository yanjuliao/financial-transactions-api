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
- **Redis** – Armazenamento e validação de sessões JWT.
- **Passport + JWT** – Autenticação via token.
- **Jest** – Testes unitários e E2E.

---

## 📁 Estrutura do Projeto

```
src/
├── auth/
│   ├── jwt.strategy.ts
│   ├── jwt-redis-auth.guard.ts
│   ├── jwt.strategy.ts
│   ├── roles.guard.ts
│   ├── dto/
│   ├── service/
│   ├── controller/
│   └── decorators/
├── transaction/
│   ├── enum.ts
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── mapper/
│   └── dto/
├── redis/
│   └── redis.service.ts
├── users/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── mapper/
│   └── dto/
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

## 🔐 Autenticação

- Utiliza JWT com armazenamento em Redis para sessões válidas.
- Apenas usuários com token válido no Redis conseguem acessar as rotas protegidas.
- Utilize o botão Authorize no Swagger para fornecer o token JWT (sem prefixo Bearer ).

---

## 🔐 Autorização baseada em roles (RBAC)

A API utiliza controle de acesso baseado em papéis (roles) para restringir rotas de acordo com o perfil do usuário. Existem dois tipos de usuário:

- **`admin`** – Acesso completo a todas as rotas.
- **`user`** – Acesso limitado a determinadas funcionalidades.

### 📜 Regras de Acesso

| Módulo         | Rota                          | Roles Permitidas     |
|----------------|-------------------------------|-----------------------|
| **Users**      | Somente (`POST`, `PUT`) | `user`, `admin`        |
| **Users**      | Todas com /admin(`POST`, `PUT`, `GET`, `DELETE`) | Somente `admin`       |
| **Transactions** | Todas as operações             | `admin`, `user`        |


### 🔒 Como funciona

- Cada usuário possui uma única role: `admin` ou `user`.
- As rotas usam o decorator customizado `@Roles(...roles)` para definir quais roles têm permissão.
- O `RolesGuard` valida a role do usuário (vinda do JWT) e compara com as roles autorizadas da rota.
- Se a role do usuário não for permitida, a API retorna erro `403 Forbidden`.


---

## 📌 Funcionalidades

- ✅ Login e autenticação com JWT + Redis
- ✅ Proteção automática de rotas com Guard global
- ✅ Criar, atualizar e excluir transações
- ✅ Consultar transações por ID e usuário 
- ✅ Cadastro em massa (transações)
- ✅ Cálculo de saldo por período
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
