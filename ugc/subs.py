"""Legendas animadas (ASS): blocos curtos que 'pulam' na tela + botão de CTA pulsando.
Tempo proporcional aos caracteres; devolve também o início de cada frase para sincronizar as cenas."""
import re

STYLES = [  # (cor primária BGR, contorno)
    ("&H00FFFFFF", "&H00000000"),
    ("&H0000F0FF", "&H00000000"),  # amarelo
    ("&H00FFFFFF", "&H00C800FF"),
]


def _t(sec: float) -> str:
    h, rem = divmod(sec, 3600)
    m, s = divmod(rem, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def chunk_words(text: str, per: int = 3):
    words = re.findall(r"\S+", text)
    return [" ".join(words[i:i + per]) for i in range(0, len(words), per)]


def build_ass(lines, total: float, style_idx: int = 0, lead: float = 0.15, cta_text: str = "TOQUE NO LINK",
              captions: bool = True):
    color, outline = STYLES[style_idx % len(STYLES)]
    per_line = [chunk_words(ln) for ln in lines]
    weights = [[max(len(c), 3) for c in cs] for cs in per_line]
    usable = max(total - lead - 0.3, 1.0)
    unit = usable / sum(sum(w) for w in weights)
    head = (
        "[Script Info]\nScriptType: v4.00+\nPlayResX: 1080\nPlayResY: 1920\n\n"
        "[V4+ Styles]\nFormat: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,"
        "BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,"
        "Shadow,Alignment,MarginL,MarginR,MarginV,Encoding\n"
        f"Style: Default,DejaVu Sans,84,{color},&H000000FF,{outline},&H80000000,-1,0,0,0,100,100,0,0,1,7,2,2,70,70,430,1\n"
        "Style: Btn,DejaVu Sans,62,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,0,0,5,0,0,0,1\n\n"
        "[Events]\nFormat: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text\n"
    )
    t, events, starts = lead, [], []
    for cs, ws in zip(per_line, weights):
        starts.append(t)
        for c, w in zip(cs, ws):
            d = w * unit
            pop = r"{\fad(30,30)\fscx72\fscy72\t(0,140,\fscx106\fscy106)\t(140,240,\fscx100\fscy100)}"
            if captions:
                events.append(f"Dialogue: 1,{_t(t)},{_t(t + d)},Default,,0,0,0,,{pop}{c.upper()}")
            t += d
    # botão de CTA pulsando durante a última frase
    s0, e0 = starts[-1], total
    pulse = "".join(rf"\t({i * 600},{i * 600 + 300},\fscx108\fscy108)\t({i * 600 + 300},{i * 600 + 600},\fscx100\fscy100)"
                    for i in range(int(max(e0 - s0, 1) / 0.6) + 1))
    shape = r"m 0 0 l 680 0 680 150 0 150"
    events.append(f"Dialogue: 0,{_t(s0)},{_t(e0)},Btn,,0,0,0,,"
                  rf"{{\an5\pos(540,1640)\bord0\1c&H0040D0&\fad(150,0)\p1{pulse}}}{shape}")
    events.append(f"Dialogue: 2,{_t(s0)},{_t(e0)},Btn,,0,0,0,,"
                  rf"{{\an5\pos(540,1640)\fad(150,0){pulse}}}{cta_text}")
    return head + "\n".join(events) + "\n", starts
