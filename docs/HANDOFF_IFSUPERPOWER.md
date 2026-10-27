# Passagem de testemunho: canal IFSUPERPOWER (estado a 27/10/2026)

Para quem retomar este trabalho noutra conversa. Branch com tudo: `claude/hopeful-babbage-yw6bff` (repositório stephanhaking/ads). **Não há chaves neste ficheiro**: só os nomes das variáveis (`YOUTUBE_API_KEY`, `YT_CLIENT_ID`, `YT_CLIENT_SECRET`, `YT_REFRESH_TOKEN`, `GEMINI_API_KEYS`), que vivem nas definições do ambiente.

## Decisões do utilizador (por ordem)
1. Abandonou o canal **Distinguish** (estilo e nicho). Os 21 vídeos foram apagados a 25/10 (registo em `docs/DISTINGUISH_VIDEOS_APAGADOS_25OUT.json`); o canal foi mantido e renomeado **IFSUPERPOWER** (handle atual `@ifsuperpowe`, falta o "r").
2. Método do Stefan (resumo em `docs/ESTRATEGIA_CRITERIOS_FALHA.md`): nichos com poucos canais, tópicos por outliers, copiar formatos provados, não inventar estilo.
3. Formato escolhido: **"What if you could [poder]"**, 8–12 min, uma pessoa a viver as consequências, sem "Part 1/2".
4. Quer **10 vídeos** (3 feitos, 1 a renderizar, 27/10), publicados **todos os dias às 18:00 UTC de 2 a 11/nov/2026**. Calendário confirmado. Eu posso agendar depois de ter os links.
5. Faz ele próprio a animação (fora deste ambiente); as nossas ferramentas ficam para agendamento, verificação e pesquisa.

## Regras de trabalho (do utilizador)
- Responder em português; direto; **verificar factos ANTES de escrever/produzir**; marcar o que não está confirmado.
- Nada de engenharia reversa/descompilar/contornar termos de uso (recusado e dito ao utilizador).
- **Confirmar antes** de apagar, publicar ou agendar. Nunca guardar chaves em ficheiros.

## Dados que sustentam a aposta (docs/)
- `WHATIF_TOPICOS_24OUT.md`, `WHATIF_LISTA_26OUT.md` (estado dos 10 temas), `WHATIF_NOMES_APOSTA_25OUT.md`, `WHATIF_XRAY_27OUT.md`, `WHATIF_TIMETRAVEL_27OUT.md`, `IFOLOGY_DURACAO_27OUT.md`, `NICHO_STICKMAN_CSV_24OUT.md`, `NICHO_ANIMADO_SCAN_24OUT.md`.
- Líderes: **IFOLOGY** (@ifologyfilms, ~42 mil subs, 1.º upload 09/10) e **Ifverse** (@ifversetales, ~55 mil). Publicam diariamente. Êxitos com 8–12 min; séries "Part 1/2/3" perdem 40–50% por parte; Shorts rendem pouco; copiar o molde sem ângulo costuma falhar.
- Temas ainda livres (27/10): breathe underwater, control your dreams, never need to eat, never get sick, clone yourself, talk to animals, heal instantly, turn into water, grow wings. Tirados pelo IFOLOGY: walk through walls, shrink. X-ray: deixado pelo utilizador. Tempo só para a frente: ideia por escrever.

## Ferramentas (tools/)
- `whatif_recheck.py`: rever oferta por poder e últimos uploads dos líderes (~2 600 unidades de quota).
- `yt_schedule.py` + `docs/ifsuperpower_schedule.json` + `docs/IFSUPERPOWER_PACOTES.md`: agendar vídeos já carregados como privados (`--dry-run` antes de `--apply`).
- Perfil: `docs/IFSUPERPOWER_PERFIL.md`, `out/ifsuperpower_avatar.png`, `out/ifsuperpower_banner.png`. Guião já verificado (reserva): `docs/SCRIPT_WALKTHROUGHWALLS_EN.md`.

## Por fazer / pendente
1. O utilizador deve dizer **quais 3 vídeos estão feitos** e qual está a renderizar; carregar como **privados** e passar os links; enviar um resumo dos guiões (para as descrições só dizerem o que o vídeo diz).
2. Corrigir o handle `@ifsuperpowe` no Studio. Miniaturas personalizadas exigem canal verificado por telemóvel (por confirmar).
3. Na véspera de cada publicação, rever se um líder fez o mesmo tema.
4. Pontos de controlo: 48 h após o 3.º vídeo (< 300 views → diagnosticar) e 7 dias após o 1.º.

## Atualização 27/10 (tarde): início da publicação
O utilizador decidiu que a publicação diária **só começa depois de os 10 vídeos estarem terminados**. O calendário de 2–11/nov (`docs/ifsuperpower_schedule.json`) fica **provisório**: as datas serão refeitas quando o 10.º estiver pronto (1 vídeo por dia às 18:00 UTC, a partir do dia seguinte). Até lá: rever a oferta dos temas pelo menos 1 vez por semana (`tools/whatif_recheck.py`) e trocar os que os líderes publicarem.
Ideia nova do utilizador: "What If You Never Needed to Drink Water Again?" (medição em `docs/WHATIF_AGUA_27OUT.md`).
