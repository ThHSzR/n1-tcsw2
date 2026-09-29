# SG Cursos - Frontend

Painel React da plataforma de cursos, adaptado a partir do projeto
[`curso-tcsw`](https://github.com/ThHSzR/curso-tcsw) para consumir a API NestJS
deste repositório.

## Executar

Com o backend disponível em `http://localhost:3000`:

```bash
npm install
npm run dev
```

O Vite abre o painel em `http://localhost:5173`.

Para usar outra URL de API, crie `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

## Autenticação

O primeiro acesso pode ser criado na própria tela inicial. O frontend chama
`POST /usuarios`, autentica em `POST /auth/login` e armazena o JWT no navegador.
Todas as chamadas protegidas recebem automaticamente o cabeçalho Bearer.

## Validação

```bash
npm run build
npm run lint
npm audit
```
