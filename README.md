# N1 TCSW2 - Plataforma de Cursos

Plataforma full stack para gerenciar cursos online. O backend cobre catálogo, conteúdo acadêmico, matrículas, progresso, avaliações, trilhas, certificados, planos, assinaturas e pagamentos. O frontend oferece uma experiência responsiva para operar toda a plataforma.

## Tecnologias

- Node.js e TypeScript;
- NestJS 11;
- Prisma ORM 7;
- PostgreSQL;
- Passport e JWT;
- bcrypt;
- Swagger/OpenAPI;
- Jest.
- React 19, Vite, React Router e Bootstrap Icons.

## Funcionalidades

- Cadastro de usuários com senha protegida por bcrypt;
- Login e autorização por Bearer Token JWT;
- CRUD de categorias, cursos, módulos e aulas;
- Hierarquia `Curso > Módulo > Aula`, respeitando a ordem;
- Atualização automática do total de aulas e da carga horária do curso;
- Matrículas e conclusão automática quando todas as aulas forem finalizadas;
- Progresso por usuário e aula;
- Avaliações de cursos com notas de 1 a 5;
- Trilhas de conhecimento e associação ordenada de cursos;
- Emissão e verificação pública de certificados;
- CRUD de planos e gestão de assinaturas;
- Checkout transacional com registro de pagamento;
- Paginação e filtros na listagem de cursos;
- Documentação interativa no Swagger;
- Tratamento HTTP para erros comuns do Prisma.
- Painel administrativo SG Cursos com as telas de todas as áreas da API;
- Cadastro, login JWT, restauração da sessão e logout automático ao expirar;
- Interface adaptada do projeto [`curso-tcsw`](https://github.com/ThHSzR/curso-tcsw).

## Instalação

```bash
git clone https://github.com/ThHSzR/n1-tcsw2.git
cd n1-tcsw2
npm install
npm run frontend:install
```

Copie o arquivo de exemplo e configure o PostgreSQL:

```bash
cp .env.example .env
```

Variáveis necessárias:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/plataforma_cursos?schema=public"
JWT_SECRET="uma-chave-longa-aleatoria-e-secreta"
PORT=3000
```

Não publique o arquivo `.env` nem utilize a chave de exemplo em produção.

## Banco de dados

Gere o cliente Prisma e aplique as migrações:

```bash
npm run prisma:generate
npm run db:migrate
```

Em implantação/produção, aplique migrações já versionadas com:

```bash
npm run db:deploy
```

Para inspecionar as tabelas e registros:

```bash
npm run db:studio
```

## Execução

```bash
# Desenvolvimento com recarregamento automático
npm run start:dev

# Build e execução de produção
npm run build
npm run start:prod
```

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api`

Em outro terminal, inicie o frontend:

```bash
npm run frontend:dev
```

- Frontend: `http://localhost:5173`

Para alterar a URL da API consumida pelo frontend, copie `frontend/.env.example` para `frontend/.env` e ajuste `VITE_API_URL`.

## Autenticação

O cadastro e o login são públicos:

```http
POST /usuarios
POST /auth/login
```

Exemplo de cadastro:

```json
{
  "nomeCompleto": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123"
}
```

Exemplo de login:

```json
{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

Envie o token retornado nas demais rotas:

```http
Authorization: Bearer SEU_TOKEN
```

No Swagger, clique em **Authorize** e informe o token.

## Principais endpoints

| Área         | Rotas                                                  |
| ------------ | ------------------------------------------------------ |
| Autenticação | `POST /usuarios`, `POST /auth/login`                   |
| Usuários     | `GET/PATCH/DELETE /usuarios`                           |
| Catálogo     | `/categorias`, `/cursos`                               |
| Conteúdo     | `/modulos`, `/aulas`                                   |
| Curadoria    | `/trilhas`, `/trilhas/:id/cursos`                      |
| Aprendizagem | `/matriculas`, `/progresso`, `/avaliacoes`             |
| Certificados | `/certificados`, `GET /certificados/verificar/:codigo` |
| Financeiro   | `/planos`, `/assinaturas`, `/pagamentos`, `/checkout`  |

Com exceção do cadastro, login e verificação de certificado, as rotas exigem JWT.

### Filtros de cursos

`GET /cursos` aceita:

- `pagina` e `limite`;
- `busca`;
- `idCategoria`;
- `idInstrutor`;
- `nivel`: `INICIANTE`, `INTERMEDIARIO` ou `AVANCADO`.

## Modelo de dados

O schema está organizado em:

- **Core:** `Usuario`, `Categoria` e `Curso`;
- **Conteúdo:** `Modulo` e `Aula`;
- **Interação:** `Matricula`, `ProgressoAula` e `Avaliacao`;
- **Curadoria:** `Trilha`, `TrilhaCurso` e `Certificado`;
- **Negócio:** `Plano`, `Assinatura` e `Pagamento`.

O modelo `User` permanece apenas para compatibilidade com a sequência histórica de migrações. A API utiliza exclusivamente o modelo `Usuario`.

## Estrutura

```text
prisma/
  migrations/          Migrações versionadas
  schema.prisma        Modelos e relacionamentos
src/
  auth/                Login e estratégia JWT
  common/filters/      Conversão de erros Prisma para HTTP
  platform/            Catálogo, aprendizagem e negócio
  prisma/              PrismaService compartilhado
  users/               Cadastro e gestão de usuários
  main.ts              Bootstrap, validação, CORS e Swagger
frontend/
  src/components/      Modal, busca, notificações e componentes reutilizáveis
  src/context/         Sessão e autenticação JWT
  src/pages/           Dashboard e telas CRUD da plataforma
  src/services/        Adaptação dos DTOs da API para a interface
  src/lib/api.ts       Cliente HTTP autenticado
```

## Qualidade

```bash
npm run build
npm test -- --runInBand
npm run lint
npx prisma validate
npm run frontend:build
npm --prefix frontend run lint
```
