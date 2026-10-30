# CinePick

**Menos tempo escolhendo. Mais tempo assistindo.**

O CinePick é uma aplicação web para descobrir filmes, séries e documentários quando você não sabe o que assistir. Escolha uma categoria, peça uma recomendação e deixe o acaso apresentar uma nova história.

O projeto explora uma experiência de descoberta simples e visual: antes do resultado, as capas dos candidatos são apresentadas em uma animação de cartas embaralhadas. Os dados vêm do [The Movie Database (TMDB)](https://www.themoviedb.org/).

## Funcionalidades

- Recomendação aleatória entre filmes, séries e documentários, com filtros por categoria.
- Animação de cartas com capas dos títulos encontrados e revelação da escolha final.
- Informações do título, incluindo sinopse, ano, nota e gêneros.
- Indicação de provedores disponíveis no Brasil e link para trailer, quando fornecidos pelo TMDB.
- Botão para solicitar outra recomendação sem repetir imediatamente o título atual.
- Interface responsiva em português e inglês, com idioma salvo no navegador.
- Respeito à preferência de movimento reduzido do dispositivo durante a animação de recomendação.

As recomendações são aleatórias e não são personalizadas com base no histórico ou nas preferências do usuário. A disponibilidade de provedores e trailers depende dos dados retornados pelo TMDB.

## Tecnologias

- **Frontend:** Angular 21, TypeScript, SCSS e Angular Signals.
- **Internacionalização:** Transloco.
- **API e hospedagem:** Cloudflare Workers e Workers Static Assets.
- **Dados:** API do TMDB; dados de disponibilidade fornecidos pelo JustWatch por meio do TMDB.
- **Testes:** Vitest e jsdom.
- **Deploy:** GitHub Actions e Wrangler.

## Arquitetura

```text
Navegador — Angular
    │
    ├── /api/recommendation ── candidatos para o sorteio
    └── /api/media-details ─── detalhes, trailer e provedores
                │
         Cloudflare Worker
                │  token mantido no servidor
                ▼
             API do TMDB
```

O Worker também entrega os arquivos estáticos da aplicação. No frontend, o serviço de recomendação coordena as consultas, enquanto o cliente HTTP e o mapper isolam o acesso e a transformação dos dados do TMDB. As capas são pré-carregadas para a animação; a consulta dos detalhes ocorre em paralelo.

## Executando localmente

### Pré-requisitos

- Node.js 22 e npm.
- Um token de leitura da API do TMDB.
- Acesso à internet para consultar o TMDB e instalar as dependências.

### Configuração

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/H3lii0/cinepick.git
cd cinepick
npm ci
```

Crie um arquivo `.dev.vars` na raiz do projeto a partir de `.dev.vars.example` e preencha seu token:

```dotenv
TMDB_BEARER_TOKEN=seu_token_do_tmdb
```

O arquivo `.dev.vars` é ignorado pelo Git. Não envie tokens para o repositório. Os secrets configurados na Cloudflare para produção não são automaticamente copiados para o ambiente local.

### Iniciar a aplicação

Em um terminal, gere o frontend e mantenha a recompilação automática ativa:

```bash
npm run watch
```

Depois que o primeiro build terminar, em outro terminal inicie o Worker:

```bash
npx wrangler dev
```

Acesse **http://localhost:8787**. O Wrangler serve os arquivos gerados e atende às rotas `/api/*`. As alterações no frontend são recompiladas pelo primeiro terminal.

> `npm start` inicia apenas o servidor de desenvolvimento do Angular. Sem uma configuração adicional de proxy/backend, as rotas de recomendação não ficam disponíveis nesse servidor.

## Comandos úteis

| Comando | Descrição |
| --- | --- |
| `npm run watch` | Compila o frontend em modo de desenvolvimento e observa alterações. |
| `npx wrangler dev` | Executa o Worker e serve a aplicação localmente. |
| `npm run build` | Gera o build de produção em `dist/cinepick`. |
| `npm test -- --watch=false` | Executa os testes uma vez. |
| `npm run deploy:cloudflare` | Gera o build de produção e implanta com o Wrangler autenticado. |

O build de produção verifica limites de tamanho configurados em `angular.json` e pode precisar de acesso à rede para processar a fonte externa. No estado atual, a suíte de testes ainda precisa de ajustes nos testes de componentes e na configuração de tradução.

## Deploy na Cloudflare

O repositório inclui um workflow em `.github/workflows/deploy.yml` que executa `npm ci`, gera o build e publica o Worker quando há um push para `main` ou uma execução manual do workflow.

Configure os seguintes secrets no ambiente `production` do GitHub Actions:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `TMDB_BEARER_TOKEN`

O arquivo `wrangler.toml` define o Worker, a pasta dos assets e o secret exigido. Para deploy manual, autentique o Wrangler, configure o secret do Worker e execute `npm run deploy:cloudflare`. Esse comando publica alterações; use-o somente quando quiser atualizar o ambiente implantado.

## Estrutura do projeto

```text
src/app/
├── core/layout/          # Navegação
├── pages/home/           # Página, hero e rodapé
├── services/             # Idioma e recomendação
│   └── recommendation/   # Cliente e mapper do TMDB
├── models/               # Tipos de domínio e respostas da API
└── shared/               # Ícones e recursos compartilhados
public/assets/i18n/       # Traduções PT-BR e EN
worker.js                 # API e entrega dos assets
wrangler.toml             # Configuração Cloudflare
```

## Créditos

Este produto usa a API do TMDB, mas não é endossado nem certificado pelo TMDB. Os dados de disponibilidade em streaming são fornecidos pelo [JustWatch](https://www.justwatch.com/) por meio do TMDB.
