class_name InkMenuBackground
extends Control

var _time := 0.0
var _wisps: Array[Dictionary] = []
var _leaves: Array[Dictionary] = []

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	var rng := RandomNumberGenerator.new()
	rng.seed = 20260428
	for i in range(12):
		_wisps.append({
			"x": rng.randf_range(0.0, 1.0),
			"y": rng.randf_range(0.18, 0.72),
			"speed": rng.randf_range(0.012, 0.032),
			"scale": rng.randf_range(0.7, 1.6),
			"phase": rng.randf_range(0.0, TAU)
		})
	for i in range(18):
		_leaves.append({
			"x": rng.randf_range(0.0, 1.0),
			"y": rng.randf_range(0.0, 1.0),
			"speed": rng.randf_range(0.025, 0.07),
			"size": rng.randf_range(3.0, 7.0),
			"phase": rng.randf_range(0.0, TAU)
		})

func _process(delta: float) -> void:
	_time += delta
	queue_redraw()

func _draw() -> void:
	var s := size
	if s.x <= 0.0 or s.y <= 0.0:
		return
	_draw_paper_wash(s)
	_draw_sun(s)
	_draw_mountains(s)
	_draw_mist(s)
	_draw_falling_leaves(s)
	_draw_foreground_ink(s)

func _draw_paper_wash(s: Vector2) -> void:
	draw_rect(Rect2(Vector2.ZERO, s), Color("#1a1914"))
	draw_rect(Rect2(Vector2.ZERO, s), Color(0.73, 0.63, 0.45, 0.18))
	for i in range(7):
		var y := s.y * float(i) / 7.0
		draw_rect(Rect2(0, y, s.x, s.y / 7.0 + 2.0), Color(0.93, 0.84, 0.68, 0.025 + i * 0.004))

func _draw_sun(s: Vector2) -> void:
	var pulse := 1.0 + sin(_time * 1.5) * 0.035
	var center := Vector2(s.x * 0.75, s.y * 0.24)
	draw_circle(center, 72.0 * pulse, Color(0.70, 0.20, 0.16, 0.26))
	draw_circle(center, 44.0 * pulse, Color(0.80, 0.26, 0.18, 0.36))

func _draw_mountains(s: Vector2) -> void:
	var drift := sin(_time * 0.18) * 18.0
	var far := PackedVector2Array([
		Vector2(-80 + drift, s.y * 0.72),
		Vector2(s.x * 0.14 + drift, s.y * 0.46),
		Vector2(s.x * 0.29 + drift, s.y * 0.60),
		Vector2(s.x * 0.46 + drift, s.y * 0.34),
		Vector2(s.x * 0.66 + drift, s.y * 0.64),
		Vector2(s.x * 0.86 + drift, s.y * 0.38),
		Vector2(s.x + 90 + drift, s.y * 0.58),
		Vector2(s.x + 90 + drift, s.y),
		Vector2(-80 + drift, s.y)
	])
	draw_colored_polygon(far, Color(0.10, 0.11, 0.09, 0.74))

	var near_drift := sin(_time * 0.26 + 1.8) * 10.0
	var near := PackedVector2Array([
		Vector2(-60 + near_drift, s.y * 0.86),
		Vector2(s.x * 0.16 + near_drift, s.y * 0.66),
		Vector2(s.x * 0.33 + near_drift, s.y * 0.74),
		Vector2(s.x * 0.54 + near_drift, s.y * 0.56),
		Vector2(s.x * 0.78 + near_drift, s.y * 0.77),
		Vector2(s.x + 70 + near_drift, s.y * 0.62),
		Vector2(s.x + 70 + near_drift, s.y),
		Vector2(-60 + near_drift, s.y)
	])
	draw_colored_polygon(near, Color(0.05, 0.06, 0.05, 0.86))

func _draw_mist(s: Vector2) -> void:
	for wisp in _wisps:
		var x := fposmod((float(wisp["x"]) + _time * float(wisp["speed"])), 1.15) * s.x - s.x * 0.08
		var y := float(wisp["y"]) * s.y + sin(_time * 0.7 + float(wisp["phase"])) * 10.0
		var width := 170.0 * float(wisp["scale"])
		draw_ellipse(Vector2(x + width * 0.5, y + 11.0 * float(wisp["scale"])), width * 0.5, 11.0 * float(wisp["scale"]), Color(0.89, 0.83, 0.72, 0.09))
		draw_ellipse(Vector2(x + width * 0.54, y + 1.0), width * 0.29, 9.0, Color(0.96, 0.90, 0.78, 0.07))

func _draw_falling_leaves(s: Vector2) -> void:
	for leaf in _leaves:
		var fall := fposmod(float(leaf["y"]) + _time * float(leaf["speed"]), 1.12)
		var sway := sin(_time * 1.8 + float(leaf["phase"])) * 24.0
		var pos := Vector2(float(leaf["x"]) * s.x + sway, fall * s.y - 60.0)
		var r := float(leaf["size"])
		var points := PackedVector2Array([
			pos + Vector2(0, -r),
			pos + Vector2(r * 0.55, 0),
			pos + Vector2(0, r),
			pos + Vector2(-r * 0.55, 0)
		])
		draw_colored_polygon(points, Color(0.72, 0.24, 0.18, 0.38))

func _draw_foreground_ink(s: Vector2) -> void:
	var wave := sin(_time * 0.5) * 6.0
	draw_line(Vector2(s.x * 0.06, s.y * 0.82 + wave), Vector2(s.x * 0.38, s.y * 0.72 - wave), Color(0.93, 0.86, 0.70, 0.18), 7.0, true)
	draw_line(Vector2(s.x * 0.62, s.y * 0.78 - wave), Vector2(s.x * 0.94, s.y * 0.64 + wave), Color(0.93, 0.86, 0.70, 0.16), 6.0, true)
