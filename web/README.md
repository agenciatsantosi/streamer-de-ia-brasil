# Painel cloud — Streamer de IA Brasil

Primeira fase: cadastro de avatares, personalidade, voz, capa, vídeos de repouso e fala. A transmissão e o processamento de eventos **ainda não** foram migrados para a nuvem.

## Implantação

1. Importe este repositório na Vercel e configure **Root Directory = web**.
2. Crie um banco Neon PostgreSQL e execute `web/schema.sql` no editor SQL do banco.
3. Crie um Vercel Blob Store e conecte ao projeto.
4. Configure `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `ADMIN_PASSWORD` e `SESSION_SECRET` no ambiente Vercel (veja `.env.example`). Use uma chave aleatória de pelo menos 32 caracteres para a sessão.
5. Faça o deploy e entre com a senha administrativa.

Uploads de vídeo são enviados diretamente do navegador para Vercel Blob com token temporário. O callback de upload deve alcançar o domínio público da aplicação. Cada vídeo pode ter até 100 MB. Mídias são públicas por URL; não armazene vídeos privados.

## Limitações e próxima fase

O painel cloud é independente do painel Python antigo. A aplicação original `script.py` permanece sem alterações. Ainda faltam worker persistente, fila de eventos, integração de TikTok LIVE, síntese de voz, orquestração de streaming e testes de ponta a ponta. Não é possível executar um processo Python/OBS persistente dentro de funções Vercel.

Autenticação inicial: senha administrativa única; antes de uso multiusuário, implementar contas, recuperação e controle de acesso. Configure também limites de custo do Blob e monitore uso de armazenamento.
