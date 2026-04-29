class_name ArtBoardPreview
extends Control

var style_id := "ink_scroll"
var _time := 0.0

func _ready() -> void:
	custom_minimum_size = Vector2(330, 255)
	mouse_filter = Control.MOUSE_FILTER_IGNORE

func configure(new_style_id: String) -> void:
	style_id = new_style_id
	queue_redraw()

func _process(delta: float) -> void:
	_time += delta
	queue_redraw()

func _draw() -> void:
	var rect := Rect2(Vector2.ZERO, size)
	if rect.size.x <= 8.0 or rect.size.y <= 8.0:
		return
	if style_id == "dark_shanhai":
		_draw_dark_shanhai(rect)
	elif style_id == "painted_animation":
		_draw_painted_animation(rect)
	else:
		_draw_ink_scroll(rect)

func _draw_ink_scroll(rect: Rect2) -> void:
	draw_rect(rect, Color("#e7dcc3"))
	for i in range(5):
		draw_rect(Rect2(0, i * rect.size.y / 5.0, rect.size.x, 2.0), Color(0.28, 0.21, 0.14, 0.08))
	var s := rect.size
	var drift := sin(_time * 0.45) * 8.0
	_draw_mountain(Vector2(-25.0 + drift, s.y * 0.70), Color(0.13, 0.14, 0.12, 0.30), 0.82)
	_draw_mountain(Vector2(s.x * 0.34 + drift, s.y * 0.68), Color(0.10, 0.12, 0.10, 0.42), 0.72)
	_draw_sword_figure(Vector2(s.x * 0.30, s.y * 0.55), Color("#1f211d"), Color("#b63b2c"))
	_draw_beast(Vector2(s.x * 0.72, s.y * 0.58), Color(0.08, 0.09, 0.08, 0.72), false)
	_draw_card(Vector2(s.x * 0.12, s.y * 0.76), "斩风", "剑意", Color("#f4ead1"), Color("#2c2820"))
	_draw_card(Vector2(s.x * 0.39, s.y * 0.76), "云身", "护体", Color("#efe2c5"), Color("#2c2820"))
	_draw_card(Vector2(s.x * 0.66, s.y * 0.76), "破势", "穿刺", Color("#f4ead1"), Color("#2c2820"))
	_draw_intent_chip(Vector2(s.x * 0.64, s.y * 0.14), "撕咬 6", Color("#7c2e23"), Color("#f8ead0"))

func _draw_dark_shanhai(rect: Rect2) -> void:
	draw_rect(rect, Color("#11100f"))
	var s := rect.size
	draw_circle(Vector2(s.x * 0.76, s.y * 0.20), 42.0 + sin(_time * 1.2) * 3.0, Color(0.66, 0.10, 0.08, 0.58))
	for i in range(7):
		var y := s.y * (0.36 + i * 0.06) + sin(_time + i) * 2.5
		draw_line(Vector2(0, y), Vector2(s.x, y + 18.0), Color(0.55, 0.48, 0.34, 0.06), 8.0, true)
	_draw_mountain(Vector2(-35.0, s.y * 0.75), Color(0.03, 0.04, 0.04, 0.88), 1.0)
	_draw_sword_figure(Vector2(s.x * 0.30, s.y * 0.58), Color("#d8c5a2"), Color("#c53325"))
	_draw_beast(Vector2(s.x * 0.72, s.y * 0.58), Color("#2b0e0d"), true)
	_draw_card(Vector2(s.x * 0.12, s.y * 0.76), "血月剑", "邪路", Color("#241918"), Color("#f1dcc0"))
	_draw_card(Vector2(s.x * 0.39, s.y * 0.76), "镇骨", "护体", Color("#1d1b18"), Color("#e6d2b1"))
	_draw_card(Vector2(s.x * 0.66, s.y * 0.76), "问魇", "诅咒", Color("#2a1515"), Color("#f1dcc0"))
	_draw_intent_chip(Vector2(s.x * 0.63, s.y * 0.14), "伏击 12", Color("#b32118"), Color("#fff0d1"))

func _draw_painted_animation(rect: Rect2) -> void:
	draw_rect(rect, Color("#263b38"))
	var s := rect.size
	draw_circle(Vector2(s.x * 0.20, s.y * 0.16), 30.0, Color(0.95, 0.63, 0.30, 0.28))
	for i in range(4):
		var y := s.y * (0.44 + i * 0.07) + sin(_time * 0.8 + i) * 5.0
		draw_line(Vector2(18.0, y), Vector2(s.x - 22.0, y - 10.0), Color(0.77, 0.88, 0.78, 0.10), 12.0, true)
	_draw_mountain(Vector2(-20.0, s.y * 0.78), Color("#152420"), 0.95)
	_draw_sword_figure(Vector2(s.x * 0.32, s.y * 0.57), Color("#f2dcc0"), Color("#e05a38"))
	_draw_beast(Vector2(s.x * 0.72, s.y * 0.59), Color("#6b2f26"), true)
	_draw_card(Vector2(s.x * 0.12, s.y * 0.76), "惊雷符", "连锁", Color("#f4d88f"), Color("#1f241f"))
	_draw_card(Vector2(s.x * 0.39, s.y * 0.76), "踏云", "闪避", Color("#dce7d0"), Color("#1f241f"))
	_draw_card(Vector2(s.x * 0.66, s.y * 0.76), "引剑", "蓄势", Color("#f0c07a"), Color("#1f241f"))
	_draw_intent_chip(Vector2(s.x * 0.62, s.y * 0.14), "冲撞 8", Color("#f1b64c"), Color("#17201d"))

func _draw_mountain(base: Vector2, color: Color, scale_value: float) -> void:
	var points := PackedVector2Array([
		base + Vector2(-45, 10) * scale_value,
		base + Vector2(40, -92) * scale_value,
		base + Vector2(110, -10) * scale_value,
		base + Vector2(185, -118) * scale_value,
		base + Vector2(280, 8) * scale_value,
		base + Vector2(280, 70) * scale_value,
		base + Vector2(-45, 70) * scale_value
	])
	draw_colored_polygon(points, color)

func _draw_sword_figure(origin: Vector2, body_color: Color, accent: Color) -> void:
	var bob := sin(_time * 1.8) * 2.0
	var p := origin + Vector2(0, bob)
	draw_circle(p + Vector2(0, -44), 12.0, body_color)
	draw_line(p + Vector2(0, -30), p + Vector2(-12, 20), body_color, 13.0, true)
	draw_line(p + Vector2(-7, -10), p + Vector2(-38, -2), body_color, 7.0, true)
	draw_line(p + Vector2(4, -8), p + Vector2(39, -50), accent, 4.0, true)
	draw_line(p + Vector2(-10, 20), p + Vector2(-28, 48), body_color, 8.0, true)
	draw_line(p + Vector2(0, 20), p + Vector2(24, 45), body_color, 8.0, true)
	draw_line(p + Vector2(38, -50), p + Vector2(56, -68), Color(0.94, 0.88, 0.72, 0.85), 2.0, true)

func _draw_beast(origin: Vector2, body_color: Color, has_glow: bool) -> void:
	var p := origin + Vector2(sin(_time * 1.5) * 2.0, 0)
	draw_ellipse(p, 52.0, 28.0, body_color)
	draw_circle(p + Vector2(46, -13), 19.0, body_color)
	draw_line(p + Vector2(-35, -6), p + Vector2(-62, -28), body_color, 7.0, true)
	draw_line(p + Vector2(-18, 22), p + Vector2(-26, 48), body_color, 7.0, true)
	draw_line(p + Vector2(24, 22), p + Vector2(32, 48), body_color, 7.0, true)
	if has_glow:
		draw_circle(p + Vector2(52, -17), 4.0, Color("#f7c14d"))

func _draw_card(pos: Vector2, title: String, tag: String, fill: Color, text_color: Color) -> void:
	var card_rect := Rect2(pos, Vector2(72, 84))
	draw_rect(card_rect, fill, true, 7.0)
	draw_rect(card_rect, Color(0.08, 0.07, 0.05, 0.34), false, 2.0)
	draw_string(ThemeDB.fallback_font, card_rect.position + Vector2(10, 25), title, HORIZONTAL_ALIGNMENT_LEFT, 58, 15, text_color)
	draw_rect(Rect2(card_rect.position + Vector2(9, 51), Vector2(54, 19)), text_color, true, 5.0)
	draw_string(ThemeDB.fallback_font, card_rect.position + Vector2(17, 66), tag, HORIZONTAL_ALIGNMENT_LEFT, 48, 12, fill)

func _draw_intent_chip(pos: Vector2, text: String, fill: Color, text_color: Color) -> void:
	var chip := Rect2(pos, Vector2(94, 34))
	draw_rect(chip, fill, true, 12.0)
	draw_rect(chip, Color(1, 1, 1, 0.16), false, 1.5)
	draw_string(ThemeDB.fallback_font, chip.position + Vector2(14, 23), text, HORIZONTAL_ALIGNMENT_LEFT, 80, 14, text_color)
