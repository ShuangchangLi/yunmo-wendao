extends Control

var visual := "cleaner"
var title := ""
var t := 0.0
var palette := {
	"cleaner": [Color("#44f6ff"), Color("#ff43d6"), Color("#d6ff6b")],
	"worker": [Color("#ff4b4b"), Color("#a8ff5a"), Color("#f7b85c")],
	"streamer": [Color("#ff54e0"), Color("#55f7ff"), Color("#ffe66d")],
	"neon_hound": [Color("#49f4ff"), Color("#ff36b8"), Color("#7cff72")],
	"iron_boar": [Color("#ff5f4c"), Color("#5de7ff"), Color("#ffd166")],
	"alley_raider": [Color("#b76cff"), Color("#2fffe2"), Color("#ff3366")]
}

func configure(next_visual: String, next_title := "") -> void:
	visual = next_visual
	title = next_title
	queue_redraw()

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_IGNORE

func _process(delta: float) -> void:
	t += delta
	queue_redraw()

func _draw() -> void:
	var c: Array = palette.get(visual, palette["cleaner"])
	var accent: Color = c[0]
	var hot: Color = c[1]
	var gold: Color = c[2]
	var r := Rect2(Vector2.ZERO, size)
	draw_rect(r, Color(0.02, 0.02, 0.05, 0.52))
	_draw_grid(r, accent)
	if visual == "cleaner":
		_draw_cleaner(r, accent, hot, gold)
	elif visual == "worker":
		_draw_worker(r, accent, hot, gold)
	elif visual == "streamer":
		_draw_streamer(r, accent, hot, gold)
	elif visual == "neon_hound":
		_draw_hound(r, accent, hot, gold)
	elif visual == "iron_boar":
		_draw_boar(r, accent, hot, gold)
	else:
		_draw_raider(r, accent, hot, gold)

func _draw_grid(r: Rect2, accent: Color) -> void:
	for i in range(6):
		var y := r.size.y * (0.18 + i * 0.12)
		draw_line(Vector2(14, y), Vector2(r.size.x - 14, y + sin(t + i) * 4.0), Color(accent, 0.08), 1.0)
	for i in range(5):
		var x := r.size.x * (0.18 + i * 0.16)
		draw_line(Vector2(x, 10), Vector2(x + sin(t * 0.9 + i) * 5.0, r.size.y - 10), Color(accent, 0.05), 1.0)

func _draw_cleaner(r: Rect2, accent: Color, hot: Color, gold: Color) -> void:
	var bob := sin(t * 2.2) * 4.0
	var mid := Vector2(r.size.x * 0.52, r.size.y * 0.56 + bob)
	_draw_aura(mid, accent, hot)
	draw_line(mid + Vector2(-56, 60), mid + Vector2(68, -84), Color(accent, 0.95), 5.0)
	draw_line(mid + Vector2(-46, 64), mid + Vector2(78, -80), Color(hot, 0.48), 2.0)
	draw_polygon([mid + Vector2(-38, 78), mid + Vector2(0, -14), mid + Vector2(34, 78)], [Color("#121827"), Color("#1a2035"), Color("#10131f")])
	draw_circle(mid + Vector2(0, -44), 22, Color("#f2e6cf"))
	draw_rect(Rect2(mid + Vector2(-38, -24), Vector2(76, 18)), Color("#0a111b"))
	draw_line(mid + Vector2(-92, -22), mid + Vector2(86, 18), Color(gold, 0.74), 3.0)
	for i in range(3):
		var a := t * 1.5 + i * TAU / 3.0
		var p1 := mid + Vector2(cos(a), sin(a)) * 70.0
		var p2 := p1 + Vector2(cos(a + 0.45), sin(a + 0.45)) * 42.0
		draw_line(p1, p2, Color(accent, 0.82), 4.0)

func _draw_worker(r: Rect2, accent: Color, hot: Color, gold: Color) -> void:
	var bob := sin(t * 1.8) * 3.0
	var mid := Vector2(r.size.x * 0.52, r.size.y * 0.58 + bob)
	_draw_aura(mid, hot, accent)
	draw_polygon([mid + Vector2(-52, 72), mid + Vector2(-24, -28), mid + Vector2(24, -28), mid + Vector2(56, 74)], [Color("#27131a"), Color("#34202a"), Color("#34202a"), Color("#180d12")])
	draw_circle(mid + Vector2(0, -52), 24, Color("#f1d6be"))
	draw_line(mid + Vector2(-28, -70), mid + Vector2(-48, -100), Color(hot, 0.86), 5.0)
	draw_line(mid + Vector2(28, -70), mid + Vector2(52, -102), Color(hot, 0.86), 5.0)
	draw_line(mid + Vector2(-46, 8), mid + Vector2(-92, 48), Color(gold, 0.8), 7.0)
	draw_line(mid + Vector2(46, 8), mid + Vector2(92, 50), Color(gold, 0.8), 7.0)
	for i in range(4):
		var y := mid.y - 6 + i * 18
		draw_line(Vector2(mid.x - 72, y), Vector2(mid.x + 72, y + sin(t * 4.0 + i) * 3.0), Color(accent, 0.42), 2.0)

func _draw_streamer(r: Rect2, accent: Color, hot: Color, gold: Color) -> void:
	var bob := sin(t * 2.5) * 4.0
	var mid := Vector2(r.size.x * 0.5, r.size.y * 0.56 + bob)
	_draw_aura(mid, hot, accent)
	draw_circle(mid + Vector2(0, -50), 23, Color("#ffe1d2"))
	draw_polygon([mid + Vector2(-44, 76), mid + Vector2(-20, -22), mid + Vector2(22, -22), mid + Vector2(46, 76)], [Color("#211434"), Color("#3c2458"), Color("#3c2458"), Color("#1d112b")])
	draw_arc(mid + Vector2(0, -48), 52, 0.1, 3.1, 24, Color(hot, 0.78), 4.0)
	for i in range(8):
		var x := 26.0 + i * 27.0
		var y := 38.0 + fmod(t * 24.0 + i * 17.0, r.size.y * 0.5)
		var w := 18.0 + (i % 3) * 13.0
		draw_rect(Rect2(Vector2(x, y), Vector2(w, 6)), Color(accent if i % 2 == 0 else hot, 0.22))
	draw_circle(mid + Vector2(70, -24), 18, Color(gold, 0.2))
	draw_arc(mid + Vector2(70, -24), 22, -1.2, 2.2, 28, Color(gold, 0.8), 3.0)

func _draw_hound(r: Rect2, accent: Color, hot: Color, gold: Color) -> void:
	var mid := Vector2(r.size.x * 0.53, r.size.y * 0.58 + sin(t * 3.0) * 3.0)
	_draw_aura(mid, accent, hot)
	draw_polygon([mid + Vector2(-86, 28), mid + Vector2(-20, -26), mid + Vector2(74, -8), mid + Vector2(94, 44), mid + Vector2(-54, 58)], [Color("#101927"), Color("#16243a"), Color("#172944"), Color("#0b111c"), Color("#0e1624")])
	draw_polygon([mid + Vector2(28, -26), mid + Vector2(58, -72), mid + Vector2(72, -16)], [Color("#122139"), Color("#1f3354"), Color("#122139")])
	draw_circle(mid + Vector2(50, -12), 6, Color(hot))
	draw_line(mid + Vector2(-68, 42), mid + Vector2(-80, 84), Color(accent, 0.7), 5.0)
	draw_line(mid + Vector2(52, 38), mid + Vector2(70, 82), Color(accent, 0.7), 5.0)

func _draw_boar(r: Rect2, accent: Color, hot: Color, gold: Color) -> void:
	var mid := Vector2(r.size.x * 0.5, r.size.y * 0.58 + sin(t * 1.8) * 2.0)
	_draw_aura(mid, hot, accent)
	draw_colored_polygon(_ellipse_points(mid + Vector2(0, 2), Vector2(88, 46)), Color("#25141a"))
	draw_colored_polygon(_ellipse_points(mid + Vector2(59, -16), Vector2(41, 36)), Color("#301a20"))
	for i in range(6):
		var x := mid.x - 64 + i * 24
		draw_line(Vector2(x, mid.y - 42), Vector2(x + 8, mid.y - 82), Color(gold, 0.74), 4.0)
	draw_line(mid + Vector2(72, -6), mid + Vector2(116, -26), Color(accent, 0.9), 5.0)
	draw_line(mid + Vector2(72, 8), mid + Vector2(116, 28), Color(accent, 0.9), 5.0)
	draw_circle(mid + Vector2(58, -20), 6, Color(hot))

func _draw_raider(r: Rect2, accent: Color, hot: Color, gold: Color) -> void:
	var mid := Vector2(r.size.x * 0.52, r.size.y * 0.58 + sin(t * 2.1) * 4.0)
	_draw_aura(mid, accent, hot)
	draw_polygon([mid + Vector2(-50, 78), mid + Vector2(-24, -32), mid + Vector2(26, -32), mid + Vector2(54, 78)], [Color("#151021"), Color("#2a1b3c"), Color("#2a1b3c"), Color("#110c1a")])
	draw_circle(mid + Vector2(0, -58), 22, Color("#c7a991"))
	draw_rect(Rect2(mid + Vector2(-24, -66), Vector2(48, 14)), Color("#070711"))
	draw_line(mid + Vector2(-80, 34), mid + Vector2(82, -72), Color(hot, 0.86), 5.0)
	draw_line(mid + Vector2(-70, 40), mid + Vector2(92, -62), Color(accent, 0.42), 2.0)
	for i in range(3):
		draw_rect(Rect2(mid + Vector2(46 + i * 12, -16 + i * 18), Vector2(36, 7)), Color(gold, 0.23))

func _draw_aura(center: Vector2, a: Color, b: Color) -> void:
	var pulse := 0.5 + 0.5 * sin(t * 2.0)
	draw_circle(center, 112.0 + pulse * 12.0, Color(a, 0.07))
	draw_arc(center, 88.0, t * 0.4, t * 0.4 + 4.9, 64, Color(a, 0.42), 3.0)
	draw_arc(center, 68.0, -t * 0.6, -t * 0.6 + 3.4, 64, Color(b, 0.34), 2.0)

func _ellipse_points(center: Vector2, radius: Vector2) -> PackedVector2Array:
	var points := PackedVector2Array()
	for i in range(32):
		var angle := TAU * float(i) / 32.0
		points.append(center + Vector2(cos(angle) * radius.x, sin(angle) * radius.y))
	return points
