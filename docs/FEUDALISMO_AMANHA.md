# Vídeo #2 — o que já está pronto e o que falta (checklist para ti)

## Já está pronto (sem ti)
- Guião EN v3 (loop) + versão curta + texto PT de controlo
- 71 cenas animadas ancoradas às palavras (`src/feudal/script.ts`), SFX de corte + efeitos ancorados, música A→B→A
- Preview/rascunho (silencioso, tempos estimados): `npm run feudal:draft`
- Miniatura A/B com marcadores para fotos: `npm run feudal:thumb`
- Pacote YouTube (títulos, descrição, tags, comentário fixado): `docs/FEUDALISMO_PACOTE_YOUTUBE.md`
- Capítulos automáticos: `python3 tools/feudal_package.py`
- Verificador de âncoras: `npm run feudal:check`

## Falta — por esta ordem (cada passo ~ minutos teus)
1. **Factos** (obrigatório antes de publicar): ler o PT (`docs/SCRIPT_FEUDALISMO_PT_v3_loop.md`) e confirmar a lista A–F de `SCRIPT_FEUDALISM_EN_v2.1.md` (Epic v. Apple, taxa Amazon/ILSR, estado FTC v. Amazon, Durand/Varoufakis, Morozov, peste negra). Se mudares uma frase do EN, corre `python3 tools/feudal_prep.py` e `npm run feudal:check`.
2. **Decidir duração**: completo ≈16 min (por omissão) · curto ≈14 min (`python3 tools/feudal_prep.py --short` + remover as cenas Ato IV-B / V-D de `script.ts` — ou pede-me) .
3. **Aprovar a promessa** do fecho ("export your data or try one alternative this week").
4. **Voz** (precisa de uma chave Gemini NOVA — as antigas foram expostas):
   `export GEMINI_API_KEYS="chave1,chave2,chave3"` → `npm run feudal:voice` (25 blocos; ~10 pedidos/dia por chave grátis, repete noutro dia: salta os já feitos). Os tempos tornam-se reais e a locução entra no vídeo.
5. **Imagens**: gerar as 26 imagens de `docs/PROMPTS_IMAGENS_FEUDALISMO.md` (bloco B xilogravura para o passado, A para o presente) e guardar em `public/feudal/img/` com o nome exato `f-xxx.jpg` → `npm run feudal:ingest` (diz o que falta). Sem imagem aparece um marcador tracejado com o prompt; 3 já têm desenho de código (torre, moinho, mão aberta).
6. **Miniatura**: opcional — recortes de caras em `public/feudal/thumb/` → `npm run feudal:thumb`.
7. **Render final**: `npm run feudal:check` → `npm run feudal:draft` (ver) → `npm run feudal:final` (1080p, ~2 h) — ou pede-me que eu corro e envio em partes como o do Google.
8. **vidIQ** (depois de 9 out): pontuar títulos e miniatura.
