# Painel cloud — Streamer de IA Brasil

Primeira fase: cadastro de avatares, personalidade, voz, capa, vídeos de repouso e fala, sem PostgreSQL. Os cadastros são salvos como JSON em `data/avatars.json` no Vercel Blob.

## Implantação

1. Importe o repositório na Vercel com **Root Directory = web**.
2. Crie um Vercel Blob Store e conecte ao projeto.
3. Configure `BLOB_READ_WRITE_TOKEN`, `ADMIN_PASSWORD` e `SESSION_SECRET` no ambiente Vercel (veja `.env.example`). Use chave aleatória de pelo menos 32 caracteres para sessão.
4. Faça deploy e entre com a senha administrativa.

Vídeos são enviados diretamente do navegador para Vercel Blob, até 100 MB por arquivo; capas até 5 MB. O callback precisa alcançar a URL pública da aplicação.

**Limitações importantes:** O arquivo JSON no Blob é publicamente acessível por URL, portanto não coloque senhas, tokens ou dados pessoais nele. Gravações simultâneas podem sobrescrever alterações: esta versão é apropriada para um único administrador com baixa frequência de edição. Para múltiplos usuários e operações concorrentes, migrar para banco transacional. Os vídeos também são públicos por URL.

## Próxima fase

A transmissão e o processamento de eventos **ainda não** foram migrados. Faltam worker persistente, fila de eventos, integração TikTok LIVE, IA/TTS e streaming na nuvem. O Python original permanece independente.
