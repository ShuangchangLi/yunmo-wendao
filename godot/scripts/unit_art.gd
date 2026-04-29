extends TextureRect

var t := randf() * TAU
var base_y := 0.0

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	expand_mode = TextureRect.EXPAND_FIT_WIDTH_PROPORTIONAL
	stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	base_y = position.y

func _process(delta: float) -> void:
	t += delta
	pivot_offset = size * 0.5
	position.y = base_y + sin(t * 1.8) * 4.0
	scale = Vector2.ONE * (1.0 + sin(t * 2.2) * 0.012)
