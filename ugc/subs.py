"""Legendas estilo TikTok (ASS): blocos de poucas palavras, tempo proporcional aos caracteres."""
import re

STYLES = [  # (cor primária BGR, cor do contorno) — rotaciona por variante
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


def build_ass(lines, total: float, style_idx: int = 0, lead: float = 0.15) -> str:
    color, outline = STYLES[style_idx % len(STYLES)]
    chunks = [c for ln in lines for c in chunk_words(ln)]
    weights = [max(len(c), 3) for c in chunks]
    usable = max(total - lead - 0.3, 1.0)
    unit = usable / sum(weights)
    head = (
        "[Script Info]\nScriptType: v4.00+\nPlayResX: 1080\nPlayResY: 1920\n\n"
        "[V4+ Styles]\nFormat: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,"
        "BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,"
        "Shadow,Alignment,MarginL,MarginR,MarginV,Encoding\n"
        f"Style: Default,DejaVu Sans,78,{color},&H000000FF,{outline},&H80000000,-1,0,0,0,100,100,0,0,1,6,2,2,80,80,520,1\n\n"
        "[Events]\nFormat: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text\n"
    )
    t, events = lead, []
    for c, w in zip(chunks, weights):
        d = w * unit
        events.append(f"Dialogue: 0,{_t(t)},{_t(t + d)},Default,,0,0,0,,{c.upper()}")
        t += d
    return head + "\n".join(events) + "\n"
