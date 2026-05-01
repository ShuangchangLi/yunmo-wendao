extends TextureRect

const FRAME_INTERVAL := 0.16

var frames: Array[AtlasTexture] = []
var frame_index := 0
var time_to_next := 0.0

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	size_flags_horizontal = Control.SIZE_EXPAND_FILL
	size_flags_vertical = Control.SIZE_EXPAND_FILL
	clip_contents = false

func set_static_texture(tex: Texture2D) -> void:
	frames.clear()
	frame_index = 0
	time_to_next = 0.0
	texture = tex

func set_strip(strip_image: Image) -> void:
	frames.clear()
	frame_index = 0
	time_to_next = FRAME_INTERVAL
	if strip_image == null or strip_image.is_empty():
		return
	var w := strip_image.get_width()
	var h := strip_image.get_height()
	if h <= 0:
		return
	var frame_size := h
	if w < frame_size:
		frame_size = w
	var count := int(w / frame_size) if frame_size > 0 else 0
	if count <= 0:
		return
	var src := ImageTexture.create_from_image(strip_image)
	for i in count:
		var atlas := AtlasTexture.new()
		atlas.atlas = src
		atlas.region = Rect2(i * frame_size, 0, frame_size, frame_size)
		frames.append(atlas)
	texture = frames[0]

func _process(delta: float) -> void:
	if frames.size() <= 1:
		return
	time_to_next -= delta
	if time_to_next <= 0.0:
		time_to_next = FRAME_INTERVAL
		frame_index = (frame_index + 1) % frames.size()
		texture = frames[frame_index]
