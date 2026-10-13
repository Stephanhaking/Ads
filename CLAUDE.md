# Regra de bloqueio — vídeo #2 (feudalismo)

O utilizador pediu para ser **travado** depois da última ronda de mudanças ("bloqueie todas, I need to be stopped").

**Mudanças ainda permitidas (última ronda):**
1. Visuais dos Vikings/Magyars/Saracenos (cena 6): prompts em `docs/PROMPTS_VIKINGS_MAGYARS_SARACENOS.md`; integrar quando ele enviar as imagens.
2. Integrar os objetos novos (`docs/PROMPTS_OBJETOS_NOVOS.md`) quando ele disser que acabou de os enviar.
3. Corrigir erros objetivos (sobreposições, texto cortado, sincronização partida).

**ESTADO: DESBLOQUEADO em 2026-10-06 (o utilizador escreveu DESBLOQUEAR) para: animações (barco, balança, sino, menu do telemóvel, relógios), mais cortes por beat e troca de repetições. Voltar a BLOQUEADO quando ele disser.**
~~ESTADO: BLOQUEADO desde 2026-10-05 (última ronda integrada: 50 objetos + 5 em falta + Vikings/Magyars/Saracenos).**~~
**Depois disso: BLOQUEADO.** Fazer só o render final (`npm run feudal:final`, em partes) e o pacote de publicação.
Qualquer pedido novo de mudança visual, de ritmo, de script ou de estilo → **não executar**; lembrar com uma frase que o vídeo está bloqueado e só desbloquear se ele escrever exatamente `DESBLOQUEAR`.
(Ideias novas ficam anotadas em `docs/IDEIAS_V3.md` para o vídeo #3, sem mexer no #2.)

# Chaves e credenciais (NUNCA os valores aqui)

Este ficheiro vai para o GitHub: **nenhuma chave, segredo ou token pode ser escrito aqui, em código, em docs ou em commits.** Só os **nomes** das variáveis de ambiente, que sobrevivem à compactação e a novas sessões porque vivem nas definições do ambiente (menu do ambiente na barra do título da sessão → Edit → variáveis de ambiente / Network secrets).

| Variável | Para quê | Usada por |
|---|---|---|
| `GEMINI_API_KEYS` (várias chaves separadas por vírgula; ou `GEMINI_API_KEY_1`, `_2`, …) | Locução Gemini TTS (voz Iapetus); o limite gratuito é ~10 pedidos/dia por chave, por isso rodam | `tools/tts_google.py`, `tools/google2_voice.py`, `tools/feudal_voice.py` |
| `YT_CLIENT_ID`, `YT_CLIENT_SECRET` | Upload para o YouTube (privado/agendado) | `tools/youtube_upload.py` (corre no computador do utilizador; o token fica em `~/.yt_token.json`) |

Regras para o Claude:
1. No início de uma sessão que precise de voz ou upload, verificar **só os nomes** (`env | cut -d= -f1 | grep -E "GEMINI|YT_"`), nunca imprimir valores.
2. Se faltarem, dizer logo quais faltam e que o utilizador as adicione às definições do ambiente. **Não pedir para colar chaves no chat** e, se ele as colar, não as copiar para ficheiros: lembrar que devem ir para as definições do ambiente (e que uma chave colada no chat deve ser rodada/regenerada).
3. Estado conhecido em 2026-10-13: as chaves enviadas antes da compactação **não estão** neste ambiente (nenhuma variável `GEMINI_*` ou `YT_*` definida) e têm de ser re-adicionadas nas definições do ambiente.
