extends Control

var t := 0.0

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_IGNORE

func _process(delta: float) -> void:
	t += delta
	queue_redraw()

func _draw() -> void:
	var s := size
	draw_rect(Rect2(Vector2.ZERO, s), Color("#070711"))
	draw_rect(Rect2(Vector2.ZERO, s), Color(0.03, 0.02, 0.08, 0.86))

	for i in range(9):
		var y := s.y * (0.12 + i * 0.095)
		var alpha := 0.05 + 0.025 * sin(t + i)
		draw_line(Vector2(0, y), Vector2(s.x, y + sin(t * 0.7 + i) * 16.0), Color(0.1, 0.95, 1.0, alpha), 1.0)

	for i in range(18):
		var x := fmod(i * 113.0 + t * 46.0, s.x + 180.0) - 90.0
		var y0 := fmod(i * 67.0 + t * 180.0, s.y + 120.0) - 120.0
		draw_line(Vector2(x, y0), Vector2(x - 24.0, y0 + 120.0), Color(0.5, 0.9, 1.0, 0.12), 2.0)

	_draw_skyline(s)
	_draw_moon(s)

func _draw_skyline(s: Vector2) -> void:
	var base_y := s.y * 0.72
	for i in range(13):
		var w := 58.0 + (i % 4) * 18.0
		var h := 145.0 + (i % 5) * 38.0
		var x := i * 104.0 - 34.0
		var rect := Rect2(x, base_y - h + sin(t * 0.5 + i) * 3.0, w, h)
		draw_rect(rect, Color(0.04, 0.05, 0.1, 0.78))
		draw_rect(Rect2(rect.position + Vector2(6, 10), Vector2(rect.size.x - 12, 3)), Color(0.0, 0.95, 1.0, 0.28))
		if i % 2 == 0:
			draw_rect(Rect2(rect.position + Vector2(10, 42), Vector2(rect.size.x - 20, 5)), Color(0.92, 0.08, 1.0, 0.26))
		if i % 3 == 0:
			var sign := Rect2(rect.position + Vector2(rect.size.x - 12, 22), Vector2(20, 72))
			draw_rect(sign, Color(0.94, 0.05, 0.7, 0.22))
			draw_rect(sign.grow(2), Color(0.94, 0.05, 0.7, 0.08), false, 2.0)

func _draw_moon(s: Vector2) -> void:
	var center := Vector2(s.x * 0.74, s.y * 0.22)
	var pulse := 0.5 + 0.5 * sin(t * 1.4)
	draw_circle(center, 92.0, Color(0.28, 0.95, 1.0, 0.06 + pulse * 0.02))
	draw_arc(center, 62.0, -0.8, 4.6, 64, Color(0.2, 0.95, 1.0, 0.42), 3.0)
	draw_arc(center + Vector2(18, 0), 52.0, -0.9, 4.4, 64, Color(0.93, 0.06, 1.0, 0.32), 2.0)
