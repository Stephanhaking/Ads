"""Gera a narração (Piper, voz pt_PT 'tugao') frase a frase e guarda as durações em voz/duracoes.json."""
import json, wave, sys
from piper import PiperVoice
from piper.config import SynthesisConfig
MODEL = "/tmp/claude-0/voz/pt/vits-piper-pt_PT-tugao-medium/pt_PT-tugao-medium.onnx"
FRASES = [
 ("hook", "Já imaginou ficar com um pneu vazio e não encontrar nenhuma bomba por perto?"),
 ("hook", "Com este inflador portátil, pode resolver esse problema sem sair do lugar!"),
 ("sol", "Conheça o inflador portátil de pneus!"),
 ("sol", "Compacto, prático e fácil de transportar."),
 ("sol", "Tenha mais comodidade para cuidar dos pneus do seu carro, onde quer que esteja!"),
 ("ben", "Chega de depender sempre de uma bomba distante!"),
 ("ben", "Tenha este equipamento à mão e esteja mais preparado para imprevistos na estrada."),
 ("ben", "Pequeno no tamanho, grande na praticidade!"),
 ("preco", "E sabe quanto custa? Apenas dois mil quinhentos e noventa e nove meticais!"),
 ("preco", "E tem mais: entrega grátis dentro de Maputo! Sim, recebe sem pagar pela entrega!"),
 ("cta", "Não espere precisar dele para perceber a sua importância!"),
 ("cta", "Envie agora uma mensagem pelo WhatsApp e faça já a sua encomenda."),
 ("cta", "Por apenas dois mil quinhentos e noventa e nove meticais, a praticidade pode estar nas suas mãos!"),
]
ls = float(sys.argv[1]) if len(sys.argv) > 1 else 0.9
v = PiperVoice.load(MODEL); out = []
for i, (sec, txt) in enumerate(FRASES):
    p = f"voz/f{i:02d}.wav"
    with wave.open(p, "wb") as w: v.synthesize_wav(txt, w, syn_config=SynthesisConfig(length_scale=ls, noise_scale=0.6, noise_w_scale=0.7))
    with wave.open(p) as w: d = w.getnframes() / w.getframerate()
    out.append({"sec": sec, "txt": txt, "file": p, "dur": d})
json.dump(out, open("voz/duracoes.json", "w"), ensure_ascii=False, indent=1)
print(round(sum(o["dur"] for o in out), 1), "s de fala;", [round(o["dur"], 1) for o in out])
