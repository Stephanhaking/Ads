"""Cena realista (Blender/Cycles): pneu vazio, inflador portátil, casal em contraluz. Uso: python3 cena.py <shot> <saida.png> [samples] [largura altura]"""
import bpy, bmesh, math, sys, os
from mathutils import Vector, Matrix, Euler
SHOT = sys.argv[1]; OUT = os.path.abspath(sys.argv[2]); SPP = int(sys.argv[3]) if len(sys.argv) > 3 else 96
RX, RY = (int(sys.argv[4]), int(sys.argv[5])) if len(sys.argv) > 5 else (720, 1280)
HERE = os.path.dirname(os.path.abspath(__file__))
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
def lin(c):  # sRGB 0-1 -> linear
    f = lambda v: v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4
    return (f(c[0]), f(c[1]), f(c[2]), 1)
def hexc(h): return lin(((h >> 16 & 255) / 255, (h >> 8 & 255) / 255, (h & 255) / 255))
MATS = {}
def mat(name, color=(.5, .5, .5), rough=.5, metal=0, coat=0, sss=0, emit=None, emit_s=0, **kw):
    if name in MATS: return MATS[name]
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = color if len(color) == 4 else lin(color); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    if coat: b.inputs['Coat Weight'].default_value = coat; b.inputs['Coat Roughness'].default_value = .05
    if sss: b.inputs['Subsurface Weight'].default_value = sss; b.inputs['Subsurface Radius'].default_value = (1.0, .35, .2)
    if emit: b.inputs['Emission Color'].default_value = emit; b.inputs['Emission Strength'].default_value = emit_s
    for k, v in kw.items(): b.inputs[k].default_value = v
    MATS[name] = m; return m
def setmat(o, m): o.data.materials.clear(); o.data.materials.append(m)
def smooth(o):
    bpy.context.view_layer.objects.active = o; o.select_set(True); bpy.ops.object.shade_smooth_by_angle(angle=math.radians(40)); o.select_set(False)
def bevel(o, w=.03, seg=4):
    m = o.modifiers.new('bev', 'BEVEL'); m.width = w; m.segments = seg; m.limit_method = 'ANGLE'
def box(name, loc, size, m, bev=.02, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(location=loc, rotation=rot); o = bpy.context.object; o.name = name; o.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    bpy.ops.object.transform_apply(scale=True); setmat(o, m)
    if bev: bevel(o, bev)
    smooth(o); return o
def cyl(name, loc, r, depth, m, rot=(0, 0, 0), verts=48):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=depth, location=loc, rotation=rot); o = bpy.context.object; o.name = name; setmat(o, m); smooth(o); return o
def sphere(name, loc, r, m, scale=(1, 1, 1), seg=32):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=seg // 2, radius=r, location=loc); o = bpy.context.object; o.name = name; o.scale = scale; setmat(o, m); smooth(o); return o
def torus(name, loc, R, r, m, rot=(0, 0, 0), scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, major_segments=64, minor_segments=24, location=loc, rotation=rot); o = bpy.context.object; o.name = name; o.scale = scale; setmat(o, m); smooth(o); return o
def limb(p0, p1, r0, r1, m, caps=True):
    p0, p1 = Vector(p0), Vector(p1); d = p1 - p0; L = d.length
    bpy.ops.mesh.primitive_cone_add(vertices=24, radius1=r0, radius2=r1, depth=L, location=(p0 + p1) / 2); o = bpy.context.object
    o.rotation_euler = d.to_track_quat('Z', 'Y').to_euler(); setmat(o, m); smooth(o)
    if caps: sphere('c', p0, r0, m, seg=16); sphere('c', p1, r1, m, seg=16)
    return o
def link(a, b, ref, l1, l2, hint):  # IK 2 ossos -> cotovelo
    a, b = Vector(a), Vector(b); d = b - a; L = min(d.length, (l1 + l2) * .995); n = d.normalized(); x = (l1 * l1 - l2 * l2 + L * L) / (2 * L); h = math.sqrt(max(l1 * l1 - x * x, 0))
    hint = Vector(hint); p = hint - n * hint.dot(n); p = p.normalized() if p.length > 1e-6 else Vector((0, 0, -1))
    return a + n * x + p * h, a + n * L
SKIN_M = mat('pele', hexc(0x4a2d1c), .45, sss=.35, **{'Specular IOR Level': .5})
SKIN_W = mat('pele2', hexc(0x6a4128), .45, sss=.35, **{'Specular IOR Level': .5})

# ---------- humano (maniquim anatómico para contraluz) ----------
def person(kind, pos, yaw, pose, hands=None, hints=None):
    sk = SKIN_M if kind == 'm' else SKIN_W
    top = mat('camisa', hexc(0x2a5cb0), .8) if kind == 'm' else mat('vestido', hexc(0xd9561c), .8)
    pants = mat('calca', hexc(0x1d2129), .85); shoe = mat('sapato', hexc(0xe6e6e8), .6); hair = mat('cabelo', hexc(0x0b0908), .9)
    wrap = mat('lenco', hexc(0xe9a11a), .8)
    R = Matrix.Rotation(yaw, 4, 'Z'); T = lambda p: R @ Vector(p) + Vector(pos)   # local: +X frente, +Y esquerda
    J = {}
    if pose == 'stand':
        J = dict(hip=(0, 0, .95), chest=(0, 0, 1.40), neck=(0, 0, 1.52), head=(0, 0, 1.68), shl=(0, .2, 1.45), shr=(0, -.2, 1.45),
                 kl=(0, .1, .5), kr=(0, -.1, .5), al=(0, .1, .08), ar=(0, -.1, .08), hl=(0, .1, .95), hr=(0, -.1, .95))
    else:  # agachado
        J = dict(hip=(-.05, 0, .52), chest=(.17, 0, 1.0), neck=(.22, 0, 1.12), head=(.30, 0, 1.28), shl=(.16, .2, 1.02), shr=(.16, -.2, 1.02),
                 kl=(.42, .12, .56), kr=(.42, -.12, .56), al=(.38, .12, .08), ar=(.38, -.12, .08), hl=(.42, .12, .6), hr=(.42, -.12, .6))
    W = {k: T(v) for k, v in J.items()}
    # tronco, pescoço, cabeça
    limb(W['hip'], W['chest'], .15, .17, top); limb(W['chest'], W['neck'], .17, .06, top, caps=False); limb(W['neck'], W['head'], .052, .05, sk)
    hd = sphere('cabeca', W['head'] + Vector((0, 0, .02)), .1, sk, scale=(.92, .8, 1.2))
    hd.rotation_euler = (0, 0, yaw)
    if kind == 'm': s = sphere('cabelo', W['head'] + R @ Vector((-.01, 0, .045)), .102, hair, scale=(.95, .85, .8))
    else:
        sphere('lenco', W['head'] + R @ Vector((-.01, 0, .045)), .108, wrap, scale=(1, .9, .9)); sphere('no', W['head'] + R @ Vector((-.05, 0, .13)), .06, wrap, scale=(1.1, .9, .8))
    # pernas
    for s_, kk, aa in (('l', 'kl', 'al'), ('r', 'kr', 'ar')):
        hp = W['hip'] + R @ Vector((0, .1 if s_ == 'l' else -.1, 0))
        limb(hp, W[kk], .09, .068, pants if kind == 'm' else sk); limb(W[kk], W[aa], .065, .045, pants if kind == 'm' else sk)
        box('pe', W[aa] + R @ Vector((.07, 0, -.03)), (.27, .1, .07), shoe, .025, rot=(0, 0, yaw))
    if kind == 'w':  # vestido
        bpy.ops.mesh.primitive_cone_add(vertices=48, radius1=.4, radius2=.16, depth=.62, location=W['hip'] + Vector((0, 0, -.14)), end_fill_type='NOTHING'); o = bpy.context.object; setmat(o, top); smooth(o)
        o.modifiers.new('s', 'SOLIDIFY').thickness = .01
    # braços (IK)
    for s_, sh, key in (('l', 'shl', 'l'), ('r', 'shr', 'r')):
        S = W[sh]; Hn = (hands or {}).get(key)
        if Hn is None: Hn = S + R @ Vector((0, .04 if s_ == 'l' else -.04, 0)) + Vector((0, 0, -.58))
        E, Hn2 = link(S, Hn, None, .3, .28, (hints or {}).get(key, R @ Vector((-.3, .8 if s_ == 'l' else -.8, -.5))))
        sphere('om', S, .06, top if kind == 'm' else sk, seg=16); limb(S, E, .05, .042, top if kind == 'm' else sk); limb(E, Hn2, .042, .032, sk); sphere('mao', Hn2, .045, sk, scale=(1.1, .8, 1.0), seg=16)
    return W

# ---------- cenário ----------
CAR_Y = -1.8
def asphalt():
    m = bpy.data.materials.new('asfalto'); m.use_nodes = True; n = m.node_tree.nodes; l = m.node_tree.links; b = n['Principled BSDF']
    tc = n.new('ShaderNodeTexCoord'); mp = n.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (14, 14, 14)
    nz = n.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 40; nz.inputs['Detail'].default_value = 12; nz.inputs['Roughness'].default_value = .7
    n2 = n.new('ShaderNodeTexNoise'); n2.inputs['Scale'].default_value = 3; n2.inputs['Detail'].default_value = 4
    vo = n.new('ShaderNodeTexVoronoi'); vo.inputs['Scale'].default_value = 300
    cr = n.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].color = (.012, .012, .014, 1); cr.color_ramp.elements[1].color = (.07, .068, .066, 1); cr.color_ramp.elements[0].position = .35; cr.color_ramp.elements[1].position = .75
    bm = n.new('ShaderNodeBump'); bm.inputs['Strength'].default_value = .8; bm.inputs['Distance'].default_value = .02
    mix = n.new('ShaderNodeMath'); mix.operation = 'MULTIPLY'
    l.new(tc.outputs['Object'], mp.inputs['Vector']); l.new(mp.outputs['Vector'], nz.inputs['Vector']); l.new(mp.outputs['Vector'], n2.inputs['Vector']); l.new(mp.outputs['Vector'], vo.inputs['Vector'])
    l.new(nz.outputs['Fac'], cr.inputs['Fac']); l.new(cr.outputs['Color'], b.inputs['Base Color'])
    l.new(vo.outputs['Distance'], bm.inputs['Height']); l.new(bm.outputs['Normal'], b.inputs['Normal'])
    l.new(n2.outputs['Fac'], mix.inputs[0]); mix.inputs[1].default_value = .5; l.new(mix.outputs['Value'], b.inputs['Roughness']); b.inputs['Roughness'].default_value = .9
    return m
def world(elev_deg, azim_deg=0, dust=2.0, strength=1.0):
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; n = w.node_tree.nodes; l = w.node_tree.links; bg = n['Background']
    sky = n.new('ShaderNodeTexSky')
    for t in ('SINGLE_SCATTERING', 'MULTIPLE_SCATTERING', 'NISHITA'):
        try: sky.sky_type = t; break
        except TypeError: pass
    sky.sun_elevation = math.radians(elev_deg); sky.sun_rotation = math.radians(azim_deg); sky.aerosol_density = dust; sky.air_density = 1.2; sky.sun_size = math.radians(.9); sky.sun_intensity = 1.0
    l.new(sky.outputs['Color'], bg.inputs['Color']); bg.inputs['Strength'].default_value = strength
def sandmat():
    m = bpy.data.materials.new('areia'); m.use_nodes = True; n = m.node_tree.nodes; l = m.node_tree.links; b = n['Principled BSDF']
    tc = n.new('ShaderNodeTexCoord'); mp = n.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (.5, .5, .5)
    nz = n.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 6; nz.inputs['Detail'].default_value = 8
    n2 = n.new('ShaderNodeTexNoise'); n2.inputs['Scale'].default_value = 250; n2.inputs['Detail'].default_value = 3
    cr = n.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].color = (.06, .05, .025, 1); cr.color_ramp.elements[1].color = (.2, .15, .085, 1)
    bm = n.new('ShaderNodeBump'); bm.inputs['Strength'].default_value = .6
    l.new(tc.outputs['Object'], mp.inputs['Vector']); l.new(mp.outputs['Vector'], nz.inputs['Vector']); l.new(mp.outputs['Vector'], n2.inputs['Vector'])
    l.new(nz.outputs['Fac'], cr.inputs['Fac']); l.new(cr.outputs['Color'], b.inputs['Base Color']); l.new(n2.outputs['Fac'], bm.inputs['Height']); l.new(bm.outputs['Normal'], b.inputs['Normal']); b.inputs['Roughness'].default_value = .95
    return m
def build_road(night=False):
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0.5, 0)); r = bpy.context.object; r.scale = (260, 9.6, 1); bpy.ops.object.transform_apply(scale=True); setmat(r, asphalt())
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, -.015)); g = bpy.context.object; g.scale = (600, 600, 1); bpy.ops.object.transform_apply(scale=True)
    setmat(g, sandmat())
    ln = mat('linha', hexc(0xd9d4c4), .7)
    for x in range(-40, 40, 6): box('traco', (x, 0.4, .004), (2.6, .13, .006), ln, 0)
    box('borda1', (0, -4.0, .004), (260, .12, .006), ln, 0); box('borda2', (0, 5.0, .004), (260, .12, .006), ln, 0)
    # colinas
    for i in range(9):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, location=(-200 + i * 55, 190, -4)); h = bpy.context.object; h.scale = (40 + (i * 7) % 20, 20, 9 + (i * 5) % 8); setmat(h, mat('colina', hexc(0x2a2130), 1))
def palm(x, y, s, lean):
    tm = mat('tronco', hexc(0x2e2018), .9); gm = mat('folha', hexc(0x16301a), .6)
    cu = bpy.data.curves.new('t', 'CURVE'); cu.dimensions = '3D'; sp = cu.splines.new('BEZIER'); sp.bezier_points.add(2)
    pts = [(0, 0, 0), (lean * .4 * s, 0, 3.4 * s), (lean * 1.4 * s, 0, 7.2 * s)]
    for p, c in zip(sp.bezier_points, pts): p.co = c; p.handle_left_type = p.handle_right_type = 'AUTO'
    cu.bevel_depth = .17 * s; cu.bevel_resolution = 4; o = bpy.data.objects.new('palma', cu); bpy.context.collection.objects.link(o); o.location = (x, y, 0); o.data.materials.append(tm)
    top = Vector((x + lean * 1.4 * s, y, 7.2 * s))
    for i in range(11):
        a = i / 11 * math.tau; cu2 = bpy.data.curves.new('f', 'CURVE'); cu2.dimensions = '3D'; s2 = cu2.splines.new('BEZIER'); s2.bezier_points.add(3)
        P = [(0, 0, 0), (.9 * s, 0, .55 * s), (1.9 * s, 0, .35 * s), (2.9 * s, 0, -.9 * s)]
        for p, c in zip(s2.bezier_points, P): p.co = c; p.handle_left_type = p.handle_right_type = 'AUTO'
        cu2.bevel_depth = .03 * s; cu2.bevel_resolution = 1; cu2.taper_object = None; o2 = bpy.data.objects.new('frond', cu2); bpy.context.collection.objects.link(o2)
        o2.location = top; o2.rotation_euler = (0, 0, a); o2.scale = (1, 1, 1); o2.data.materials.append(gm)
        # folíolos (planos finos) ao longo da fronde
        for k in range(1, 8, 2):
            t = k / 9; px = P[0][0] * (1 - t) ** 3 + 3 * P[1][0] * t * (1 - t) ** 2 + 3 * P[2][0] * t * t * (1 - t) + P[3][0] * t ** 3; pz = P[0][2] * (1 - t) ** 3 + 3 * P[1][2] * t * (1 - t) ** 2 + 3 * P[2][2] * t * t * (1 - t) + P[3][2] * t ** 3
            for sd in (-1, 1):
                bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, 0)); lf = bpy.context.object; lf.scale = (.05 * s, .5 * s * (1 - t * .5), 1); setmat(lf, gm)
                lf.parent = o2; lf.location = (px, sd * .22 * s * (1 - t * .5), pz); lf.rotation_euler = (sd * .5, 0, 0)
                lf.rotation_euler = (math.radians(sd * 70), 0, math.radians(sd * 12))

# ---------- carro ----------
PAINT = mat('tinta', hexc(0x8e1119), .22, metal=.55, coat=1.0)
GLASS = mat('vidro', hexc(0x06090d), .03, metal=.1, **{'Specular IOR Level': 1.0})
BLACKP = mat('plastico', hexc(0x0f0f11), .55)
RUBBER = mat('borracha', hexc(0x0a0a0b), .88)
ALLOY = mat('liga', hexc(0xb9bcc2), .3, metal=1.0)
RW_X, FW_X, WZ = -1.4, 1.45, .37
def build_car(flat=1.0):
    parts = []
    body = box('corpo', (0, CAR_Y, .66), (4.55, 1.86, .74), PAINT, .12); parts.append(body)
    bm_ = bmesh.new(); V_ = [(-1.30, -.82, 0), (1.22, -.82, 0), (1.22, .82, 0), (-1.30, .82, 0), (-.88, -.74, .56), (.55, -.74, .56), (.55, .74, .56), (-.88, .74, .56)]
    vs = [bm_.verts.new(v) for v in V_]
    for f in ((0, 1, 2, 3), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)): bm_.faces.new([vs[i] for i in f])
    bmesh.ops.recalc_face_normals(bm_, faces=bm_.faces); me = bpy.data.meshes.new('cab'); bm_.to_mesh(me); bm_.free()
    cab = bpy.data.objects.new('cabine', me); bpy.context.collection.objects.link(cab); cab.location = (0, CAR_Y, 1.0); setmat(cab, GLASS); bevel(cab, .05); smooth(cab); parts.append(cab)
    roof = box('teto', (-.15, CAR_Y, 1.585), (1.55, 1.52, .05), PAINT, .03); parts.append(roof)
    for nm, x, tilt in (('pA', .52, -.44), ('pB', -.22, 0), ('pC', -.86, .12)):
        for sd in (-1, 1): parts.append(box(nm, (x - .0, CAR_Y + sd * .77, 1.29), (.09, .06, .62), PAINT, .02, rot=(0, tilt, 0)))
    parts.append(box('para-choque-t', (-2.28, CAR_Y, .5), (.18, 1.7, .32), BLACKP, .05)); parts.append(box('para-choque-f', (2.28, CAR_Y, .5), (.2, 1.74, .34), BLACKP, .05))
    parts.append(box('farol', (2.27, CAR_Y - .62, .84), (.06, .38, .13), mat('farol', hexc(0xffffff), .05, emit=(1, .9, .7, 1), emit_s=4), .02)); parts.append(box('farol2', (2.27, CAR_Y + .62, .84), (.06, .38, .13), MATS['farol'], .02))
    tl = mat('lanterna', hexc(0xaa0808), .1, emit=(1, .05, .02, 1), emit_s=2.5)
    parts.append(box('lant', (-2.27, CAR_Y - .72, .88), (.05, .25, .2), tl, .02)); parts.append(box('lant2', (-2.27, CAR_Y + .72, .88), (.05, .25, .2), tl, .02))
    parts.append(box('soleira', (0, CAR_Y, .34), (4.0, 1.5, .18), BLACKP, 0))
    for sd in (-1, 1):
        parts.append(box('espelho', (.62, CAR_Y + sd * 1.0, 1.12), (.16, .12, .1), PAINT, .03))
        for x in (-.55, .6): parts.append(box('macaneta', (x, CAR_Y + sd * .94, .86), (.14, .02, .03), BLACKP, .01))
        parts.append(box('vinco', (.02, CAR_Y + sd * .93, .8), (.015, .01, .6), BLACKP, 0)); parts.append(box('vinco', (-.9, CAR_Y + sd * .93, .8), (.015, .01, .6), BLACKP, 0))
    for x in (RW_X, FW_X):
        bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=.45, depth=2.3, location=(x, CAR_Y, WZ + .02), rotation=(math.pi / 2, 0, 0)); c = bpy.context.object; c.hide_render = True; c.hide_viewport = True
        md = body.modifiers.new('arco', 'BOOLEAN'); md.operation = 'DIFFERENCE'; md.object = c; md.solver = 'EXACT'
    for p in parts: p.select_set(False)
    return parts
def wheel(x, side, flat=0.0):
    y = CAR_Y + side * .84; sq = 1 - .22 * flat; zc = WZ * sq
    TY = y + side * .0
    tire = torus('pneu', (x, y, zc), .245, .125, RUBBER, rot=(math.pi / 2, 0, 0), scale=(1 + .16 * flat, 1.15 + .18 * flat, sq * 1.0 + 0))
    # bandas de rodagem (ranhuras) via bump
    m = tire.data.materials[0]
    rim = cyl('jante', (x, y + side * .02, zc - (1 - sq) * .02), .235, .22, ALLOY, rot=(math.pi / 2, 0, 0)); rim.scale = (1, 1, 1)
    parts = [tire, rim]
    cyl('aro', (x, y + side * .105, zc), .235, .02, ALLOY, rot=(math.pi / 2, 0, 0))
    for i in range(5):
        a = i / 5 * math.tau + .3
        box('raio', (x + math.cos(a) * .12, y + side * .125, zc + math.sin(a) * .12), (.25, .035, .062), mat('raio', hexc(0x2c2f35), .35, metal=.9), .012, rot=(0, -a, 0))
    cyl('cubo', (x, y + side * .14, zc), .05, .03, mat('cubo', hexc(0x14151a), .3, metal=1), rot=(math.pi / 2, 0, 0))
    cyl('disco', (x, y - side * .03, zc), .21, .03, mat('disco', hexc(0x5c5e63), .45, metal=1), rot=(math.pi / 2, 0, 0))
    box('pinca', (x + .15, y - side * .03, zc + .08), (.12, .07, .15), mat('pinca', hexc(0xb01818), .35), .02)
    return zc
def valve_pos(flat=1.0):
    sq = 1 - .22 * flat; zc = WZ * sq
    return Vector((RW_X - .02, CAR_Y - .84 - .14, zc + .17))

# ---------- inflador ----------
def build_device(loc, rot=(0, 0, 0), scale=1.0):
    root = bpy.data.objects.new('inflador', None); bpy.context.collection.objects.link(root); root.location = loc; root.rotation_euler = rot; root.scale = (scale,) * 3
    plastic = mat('inf_plast', hexc(0x121316), .32, coat=.5); grip = mat('inf_grip', hexc(0x1b1c20), .85)
    # sistema: frente = -Y (virado para a camara)
    b = box('inf_corpo', (0, 0, .085), (.098, .056, .17), plastic, .012); b.parent = root
    im = bpy.data.images.load(os.path.join(HERE, 'tela.png'))
    sm = bpy.data.materials.new('ecra'); sm.use_nodes = True; nn = sm.node_tree.nodes; ll = sm.node_tree.links; bs = nn['Principled BSDF']; tx = nn.new('ShaderNodeTexImage'); tx.image = im
    ll.new(tx.outputs['Color'], bs.inputs['Emission Color']); ll.new(tx.outputs['Color'], bs.inputs['Base Color']); bs.inputs['Emission Strength'].default_value = 3.2; bs.inputs['Roughness'].default_value = .1
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, -.0285, .115), rotation=(math.pi / 2, 0, 0)); sc_ = bpy.context.object; sc_.scale = (.074, .048, 1); sc_.data.materials.append(sm); sc_.parent = root
    cyl('inf_botao', (0, -.0285, .062), .026, .004, mat('inf_btn', hexc(0x0a0a0c), .35), rot=(math.pi / 2, 0, 0)).parent = root
    bpy.ops.mesh.primitive_torus_add(major_radius=.026, minor_radius=.0018, location=(0, -.0305, .062), rotation=(math.pi / 2, 0, 0)); tr = bpy.context.object; setmat(tr, mat('inf_anel', hexc(0x2a2b30), .3, metal=.8)); tr.parent = root
    gp = box('inf_base', (0, -.0285, .018), (.094, .004, .036), grip, .001); gp.parent = root
    box('inf_topo', (0, 0, .172), (.094, .05, .006), grip, .002).parent = root
    for i in range(3):
        for j in range(5): cyl('p', (-.03 + j * .015, -.0309, .035 - i * .0), .0026, .003, mat('furo', hexc(0x050506), .6), rot=(math.pi / 2, 0, 0), verts=10).parent = root
    return root
def hose(p0, p1, sag=.05, mid=None):
    cu = bpy.data.curves.new('mang', 'CURVE'); cu.dimensions = '3D'; s = cu.splines.new('BEZIER'); pts = [Vector(p0)]
    if mid: pts += [Vector(m) for m in mid]
    pts.append(Vector(p1)); s.bezier_points.add(len(pts) - 1)
    for p, c in zip(s.bezier_points, pts): p.co = c; p.handle_left_type = p.handle_right_type = 'AUTO'
    cu.bevel_depth = .0085; cu.bevel_resolution = 6; o = bpy.data.objects.new('mangueira', cu); bpy.context.collection.objects.link(o)
    m = bpy.data.materials.new('trancado'); m.use_nodes = True; n = m.node_tree.nodes; l = m.node_tree.links; b = n['Principled BSDF']
    b.inputs['Base Color'].default_value = hexc(0x0b0b0d); b.inputs['Roughness'].default_value = .55
    tc = n.new('ShaderNodeTexCoord'); wv = n.new('ShaderNodeTexWave'); wv.inputs['Scale'].default_value = 400; wv.inputs['Distortion'].default_value = 2; bm = n.new('ShaderNodeBump'); bm.inputs['Strength'].default_value = .5
    l.new(tc.outputs['Generated'], wv.inputs['Vector']); l.new(wv.outputs['Fac'], bm.inputs['Height']); l.new(bm.outputs['Normal'], b.inputs['Normal']); o.data.materials.append(m); return o
def nozzle(p, direction):
    p = Vector(p); d = Vector(direction).normalized(); o = cyl('bocal', p, .017, .06, mat('bocal', hexc(0xc7cad1), .22, metal=1)); o.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()
    o2 = cyl('anel', p - d * .01, .02, .018, mat('anel', hexc(0x8e9199), .3, metal=1)); o2.rotation_euler = o.rotation_euler; return o

# ---------- luz e câmara ----------
def camera(loc, target, lens=35, fstop=None, focus=None):
    cd = bpy.data.cameras.new('cam'); cd.lens = lens; cd.sensor_fit = 'VERTICAL'; cd.sensor_height = 36
    if fstop: cd.dof.use_dof = True; cd.dof.aperture_fstop = fstop; cd.dof.focus_distance = (Vector(focus) - Vector(loc)).length if focus else (Vector(target) - Vector(loc)).length
    o = bpy.data.objects.new('cam', cd); bpy.context.collection.objects.link(o); o.location = loc; o.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); sc.camera = o
def area(loc, target, size, power, color=(1, 1, 1)):
    ld = bpy.data.lights.new('a', 'AREA'); ld.energy = power; ld.size = size; ld.color = color
    o = bpy.data.objects.new('a', ld); bpy.context.collection.objects.link(o); o.location = loc; o.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); return o
def point(loc, power, color=(1, 1, 1), r=.05):
    ld = bpy.data.lights.new('p', 'POINT'); ld.energy = power; ld.color = color; ld.shadow_soft_size = r
    o = bpy.data.objects.new('p', ld); bpy.context.collection.objects.link(o); o.location = loc; return o

# ---------- planos ----------
night = SHOT == 'noite'
if SHOT != 'estudio':
    world(-1.5 if night else 4.0, azim_deg=12, dust=3.0 if not night else 1.0, strength=.35 if night else 1.0)
    build_road(night)
    for x, y, s_, l_ in ((-14, 9, 1.3, 1), (-6, 12, 1.15, -1), (6, 10, 1.4, 1), (13, 13, 1.2, -1), (-22, 8, 1.2, 1), (20, 8.5, 1.3, -1)): palm(x, y, s_, l_)
flat = 1.0; wheels_flat = {RW_X: 1.0}
if SHOT == 'estudio':
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs['Color'].default_value = (.01, .012, .018, 1); w.node_tree.nodes['Background'].inputs['Strength'].default_value = 1
    bpy.ops.mesh.primitive_plane_add(size=40); fl = bpy.context.object; setmat(fl, mat('piso', hexc(0x07080b), .22, metal=.0, coat=0)); 
    dv = build_device((0, 0, 0), (0, 0, math.radians(-28)), 1.0)
    hose((.035, .002, .172), (.19, -.13, .014), mid=[(.07, -.01, .215), (.14, -.07, .1)]); nozzle((.195, -.135, .016), (.6, -.5, -.05))
    area((-.9, -.9, .9), (0, 0, .09), .8, 160, (.75, .88, 1)); area((1.0, .4, .6), (0, 0, .1), .7, 180, (1, .72, .45)); area((0, 1.0, .5), (0, 0, .1), 1.3, 120, (.9, .95, 1))
    camera((.3, -.95, .2), (.07, -.01, .12), 62, 3.2, (0, -.03, .09))
else:
    car = build_car(); wheel(FW_X, -1); wheel(FW_X, 1); wheel(RW_X, 1); zf = wheel(RW_X, -1, 1.0); wheel_rear_far = None
    rw_far = wheel(-1.4, 1)
    V = valve_pos(1.0); box('valvula', V + Vector((0, -.02, 0)), (.014, .04, .014), mat('valv', hexc(0xb9bcc2), .3, metal=1), .003)
    if SHOT == 'largo':
        person('m', (-3.2, CAR_Y - 2.0, 0), math.radians(40), 'stand', hands={'l': (-3.2 + .0, CAR_Y - 2.0 + .22, 1.75), 'r': (-3.2, CAR_Y - 2.0 - .22, 1.75)}, hints={'l': (.5, 1, .2), 'r': (.5, -1, .2)})
        person('w', (-1.2, CAR_Y - 2.6, 0), math.radians(60), 'stand', hands={'l': (-1.05, CAR_Y - 2.5 + .2, 1.5)}, hints={'l': (0, 1, -.6)})
        warn = box('triangulo', (-5.6, CAR_Y - 1.4, .22), (.5, .04, .45), mat('tri', hexc(0xd01818), .4, emit=(1, .05, .02, 1), emit_s=.6), .01)
        camera((-5.2, -8.2, 1.15), (-1.6, CAR_Y - .9, .9), 30, 5.6, (-2.0, CAR_Y - 1.7, 1.0))
    else:
        mx, my = -2.35, CAR_Y - 1.45
        dev_loc = Vector((-1.35, CAR_Y - 2.15, 0))
        dv = build_device(dev_loc, (0, 0, math.radians(18)), 1.0)
        top = dev_loc + Vector((.015, .0, .171)); hose(top, V + Vector((-.025, -.02, .0)), mid=[top + Vector((-.15, .08, .12)), Vector((-1.48, CAR_Y - 1.35, .09))]); nozzle(V + Vector((-.01, -.03, 0)), (.2, .9, .1))
        if SHOT in ('medio', 'noite'):
            person('m', (mx, my, 0), math.radians(0), 'crouch', hands={'l': V + Vector((-.01, -.04, -.02)), 'r': (mx + .42, my - .12, .62)}, hints={'l': (0, -.4, 1), 'r': (0, -1, .3)})
            person('w', (.55, CAR_Y - 1.7, 0), math.radians(165), 'stand', hands={'r': (.55 - .02, CAR_Y - 1.7 - .2, 1.5)}, hints={'r': (0, -1, -.3)})
            camera((-.1, -7.0, .85), (-1.6, CAR_Y - 1.1, .62), 40, 4.0, (-1.8, CAR_Y - 1.3, .6))
        elif SHOT == 'produto':
            camera((-1.1, CAR_Y - 2.65, .2), (-1.38, CAR_Y - 2.1, .13), 55, 2.2, (-1.35, CAR_Y - 2.15, .1))
        elif SHOT == 'detalhe':
            camera((-.55, CAR_Y - 1.55, .5), (RW_X - .02, CAR_Y - 1.0, .46), 70, 2.8, V)
    if night:
        for x in (RW_X - .95, FW_X + .95): point((x, CAR_Y - 1.0, .55), 220, (1, .55, .12), .12)
        area((2.6, CAR_Y - .3, 1.0), (14, CAR_Y - .3, 0), 1.0, 700, (1, .93, .8))
        area((-1.0, CAR_Y - 4.2, 2.4), (-1.8, CAR_Y - 1.6, .6), 1.6, 330, (1, .72, .45))
    else:
        area((-.4, CAR_Y - 6.2, 2.4), (-1.9, CAR_Y - 1.6, .7), 3.0, 700, (1, .85, .7))   # preenchimento suave frontal
# ---------- render ----------
r = sc.render; r.engine = 'CYCLES'; r.resolution_x, r.resolution_y = RX, RY; r.resolution_percentage = 100; r.image_settings.file_format = 'PNG'; r.filepath = OUT
sc.cycles.device = 'CPU'; sc.cycles.samples = SPP; sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'; sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = .02
sc.cycles.max_bounces = 6; sc.cycles.diffuse_bounces = 3; sc.cycles.glossy_bounces = 4; sc.cycles.transmission_bounces = 2; sc.cycles.sample_clamp_indirect = 8
sc.view_settings.view_transform = 'AgX'
try: sc.view_settings.look = 'AgX - Medium High Contrast'
except Exception: pass
sc.render.threads = 4
bpy.ops.render.render(write_still=True)
print('OK', OUT)
