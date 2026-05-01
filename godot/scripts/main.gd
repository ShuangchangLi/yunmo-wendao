extends Control

const DataLoader = preload("res://scripts/data_loader.gd")
const RunState = preload("res://scripts/run_state.gd")
const CyberBackground = preload("res://scripts/cyber_background.gd")
const CyberPortrait = preload("res://scripts/cyber_portrait.gd")
const UnitArt = preload("res://scripts/unit_art.gd")

var classes: Dictionary
var cards: Dictionary
var enemies: Array
var keywords: Dictionary
var run := RunState.new()
var reward_options: Array = []
var log_open := false

func _ready() -> void:
	classes = DataLoader.load_json("res://data/classes.json")
	cards = DataLoader.load_json("res://data/cards.json")
	enemies = DataLoader.load_json("res://data/enemies.json")
	keywords = DataLoader.load_json("res://data/keywords.json")
	run.setup(classes, cards, enemies)
	_show_main_menu()

func _clear() -> void:
	for child in get_children():
		child.queue_free()

func _make_screen() -> VBoxContainer:
	_clear()
	var bg := CyberBackground.new()
	bg.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(bg)

	var tint := ColorRect.new()
	tint.set_anchors_preset(Control.PRESET_FULL_RECT)
	tint.color = Color(0.02, 0.015, 0.05, 0.42)
	add_child(tint)

	var margin := MarginContainer.new()
	margin.set_anchors_preset(Control.PRESET_FULL_RECT)
	margin.add_theme_constant_override("margin_left", 34)
	margin.add_theme_constant_override("margin_top", 24)
	margin.add_theme_constant_override("margin_right", 34)
	margin.add_theme_constant_override("margin_bottom", 24)
	add_child(margin)

	var scroll := ScrollContainer.new()
	scroll.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	margin.add_child(scroll)

	var root := VBoxContainer.new()
	root.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	root.size_flags_vertical = Control.SIZE_EXPAND_FILL
	root.add_theme_constant_override("separation", 16)
	scroll.add_child(root)
	return root

func _show_main_menu() -> void:
	var root := _make_screen()

	var hero := PanelContainer.new()
	hero.custom_minimum_size = Vector2(0, 220)
	hero.add_theme_stylebox_override("panel", _panel_style(Color(0.02, 0.025, 0.07, 0.78), Color("#36f5ff"), 10))
	root.add_child(hero)

	var hero_box := HBoxContainer.new()
	hero_box.add_theme_constant_override("separation", 24)
	hero.add_child(hero_box)

	var title_box := VBoxContainer.new()
	title_box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	title_box.add_theme_constant_override("separation", 8)
	hero_box.add_child(title_box)

	var seal := _label("天机城夜巡 / Cyber Xianxia Deckbuilder", 18, Color("#80f7ff"))
	title_box.add_child(seal)
	var title := _label("霓墟问道", 78, Color("#f7fbff"))
	title.add_theme_color_override("font_shadow_color", Color("#ff35d1"))
	title.add_theme_constant_override("shadow_offset_x", 3)
	title.add_theme_constant_override("shadow_offset_y", 3)
	title_box.add_child(title)
	var subtitle := _label("底层身份修成大道。三场短战斗、三种入门职业、三只赛博妖邪，先把可玩 MVP 和艺术 DNA 跑通。", 20, Color(0.86, 0.95, 1.0, 0.82))
	subtitle.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	title_box.add_child(subtitle)

	var action_row := HBoxContainer.new()
	action_row.add_theme_constant_override("separation", 12)
	title_box.add_child(action_row)
	var codex := _button("天机档案", Vector2(150, 46), Color("#16243a"), Color("#55f7ff"))
	codex.pressed.connect(_show_codex)
	action_row.add_child(codex)

	hero_box.add_child(_unit_art("streamer", Vector2(240, 190)))

	var choose := _label("选择入城身份", 24, Color("#ffe66d"))
	root.add_child(choose)

	var class_row := HBoxContainer.new()
	class_row.add_theme_constant_override("separation", 14)
	class_row.size_flags_vertical = Control.SIZE_EXPAND_FILL
	root.add_child(class_row)

	for class_id in classes.keys():
		var class_data: Dictionary = classes[class_id]
		class_row.add_child(_class_card(String(class_id), class_data))

func _class_card(class_id: String, class_data: Dictionary) -> PanelContainer:
	var panel := PanelContainer.new()
	panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	panel.custom_minimum_size = Vector2(300, 330)
	panel.add_theme_stylebox_override("panel", _panel_style(Color(0.025, 0.028, 0.075, 0.86), _class_color(class_id), 10))

	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 10)
	panel.add_child(box)

	var portrait := _unit_art(class_data.get("visual", class_id), Vector2(0, 128))
	box.add_child(portrait)

	var name := _label("%s -> %s" % [class_data["name"], class_data["final_title"]], 25, Color("#f7fbff"))
	name.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	box.add_child(name)
	var school := _label(class_data["school"], 15, Color(0.55, 0.96, 1.0, 0.76))
	box.add_child(school)
	var trait2 := _label(class_data["trait"], 16, Color(0.86, 0.91, 1.0, 0.78))
	trait2.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	box.add_child(trait2)

	var start := _button("开始夜巡", Vector2(0, 48), Color("#1a2443"), _class_color(class_id))
	start.pressed.connect(func(): _start_run(class_id))
	box.add_child(start)
	return panel

func _show_codex() -> void:
	var root := _make_screen()
	var top := HBoxContainer.new()
	top.add_theme_constant_override("separation", 12)
	root.add_child(top)
	var title := _label("天机档案", 46, Color("#f7fbff"))
	title.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	top.add_child(title)
	var back := _button("返回", Vector2(120, 44), Color("#16243a"), Color("#55f7ff"))
	back.pressed.connect(_show_main_menu)
	top.add_child(back)

	var scroll := ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	root.add_child(scroll)
	var list := VBoxContainer.new()
	list.add_theme_constant_override("separation", 14)
	scroll.add_child(list)

	list.add_child(_section_title("入门身份"))
	var class_grid := GridContainer.new()
	class_grid.columns = 3
	class_grid.add_theme_constant_override("h_separation", 12)
	class_grid.add_theme_constant_override("v_separation", 12)
	list.add_child(class_grid)
	for class_id in classes.keys():
		var cls: Dictionary = classes[class_id]
		class_grid.add_child(_codex_panel("%s -> %s" % [cls["name"], cls["final_title"]], "%s\n%s" % [cls["school"], cls["trait"]], _class_color(String(class_id))))

	list.add_child(_section_title("敌人"))
	var enemy_grid := GridContainer.new()
	enemy_grid.columns = 3
	enemy_grid.add_theme_constant_override("h_separation", 12)
	list.add_child(enemy_grid)
	for encounter in enemies:
		enemy_grid.add_child(_codex_panel(encounter["name"], "%s\n气血 %d\n行动：%s" % [encounter["title"], encounter["max_hp"], _move_summary(encounter["moves"])], Color("#ff43d6")))

	list.add_child(_section_title("卡牌"))
	var card_grid := GridContainer.new()
	card_grid.columns = 5
	card_grid.add_theme_constant_override("h_separation", 10)
	card_grid.add_theme_constant_override("v_separation", 10)
	list.add_child(card_grid)
	for card_id in cards.keys():
		card_grid.add_child(_card_button(String(card_id), -1, false))

func _codex_panel(head: String, body: String, border: Color) -> PanelContainer:
	var panel := PanelContainer.new()
	panel.custom_minimum_size = Vector2(260, 150)
	panel.add_theme_stylebox_override("panel", _panel_style(Color(0.02, 0.025, 0.06, 0.76), border, 8))
	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 8)
	panel.add_child(box)
	box.add_child(_label(head, 22, Color("#f7fbff")))
	var text := _label(body, 15, Color(0.84, 0.92, 1.0, 0.78))
	text.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	box.add_child(text)
	return panel

func _start_run(class_id: String) -> void:
	log_open = false
	run.start_new(class_id)
	_show_battle()

func _show_battle() -> void:
	var root := _make_screen()
	root.add_child(_battle_topbar())

	var field := HBoxContainer.new()
	field.add_theme_constant_override("separation", 14)
	field.size_flags_vertical = Control.SIZE_EXPAND_FILL
	root.add_child(field)

	field.add_child(_combatant_panel(false))
	var duel := _label("对", 32, Color("#ffe66d"))
	duel.custom_minimum_size = Vector2(46, 0)
	duel.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	duel.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	field.add_child(duel)
	field.add_child(_combatant_panel(true))

	var bottom := HBoxContainer.new()
	bottom.add_theme_constant_override("separation", 12)
	root.add_child(bottom)

	var pile := VBoxContainer.new()
	pile.custom_minimum_size = Vector2(92, 210)
	pile.add_theme_constant_override("separation", 8)
	bottom.add_child(pile)
	pile.add_child(_mini_stat("抽牌", draw_pile_size()))
	pile.add_child(_mini_stat("弃牌", discard_pile_size()))
	pile.add_child(_mini_stat("回合", run.turn))

	var hand_row := HBoxContainer.new()
	hand_row.add_theme_constant_override("separation", 10)
	hand_row.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	bottom.add_child(hand_row)
	for i in range(run.hand.size()):
		hand_row.add_child(_card_button(String(run.hand[i]), i, true))

	var actions := VBoxContainer.new()
	actions.custom_minimum_size = Vector2(150, 210)
	actions.add_theme_constant_override("separation", 10)
	bottom.add_child(actions)
	var end_turn := _button("结束回合", Vector2(150, 58), Color("#2e1238"), Color("#ff43d6"))
	end_turn.pressed.connect(_end_turn)
	actions.add_child(end_turn)
	var log_button := _button("收起战史" if log_open else "打开战史", Vector2(150, 46), Color("#11283a"), Color("#55f7ff"))
	log_button.pressed.connect(func():
		log_open = not log_open
		_show_battle()
	)
	actions.add_child(log_button)

	if log_open:
		root.add_child(_log_panel())

func _battle_topbar() -> PanelContainer:
	var panel := PanelContainer.new()
	panel.add_theme_stylebox_override("panel", _panel_style(Color(0.02, 0.025, 0.06, 0.82), Color("#55f7ff"), 8))
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 16)
	panel.add_child(row)

	var name_box := VBoxContainer.new()
	name_box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	row.add_child(name_box)
	name_box.add_child(_label("第 %d 战 / 夜巡 MVP" % run.floor, 14, Color(0.55, 0.96, 1.0, 0.76)))
	name_box.add_child(_label("%s -> %s" % [run.player["name"], run.player["final_title"]], 28, Color("#f7fbff")))

	row.add_child(_orb_meter("灵能", int(run.player["energy"]), int(run.player["max_energy"]), Color("#55f7ff")))
	row.add_child(_orb_meter(String(run.player["resource_name"]), int(run.player["resource"]), int(run.player["max_resource"]), _class_color(run.selected_class)))

	var exit := _button("退出", Vector2(92, 48), Color("#301626"), Color("#ff43d6"))
	exit.pressed.connect(_show_main_menu)
	row.add_child(exit)
	return panel

func _combatant_panel(is_enemy: bool) -> PanelContainer:
	var unit: Dictionary = run.enemy if is_enemy else run.player
	var panel := PanelContainer.new()
	panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	panel.size_flags_vertical = Control.SIZE_EXPAND_FILL
	panel.custom_minimum_size = Vector2(400, 360)
	panel.add_theme_stylebox_override("panel", _panel_style(Color(0.02, 0.025, 0.06, 0.74), Color("#ff43d6") if is_enemy else _class_color(run.selected_class), 10))

	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 10)
	panel.add_child(box)

	var top := HBoxContainer.new()
	top.add_theme_constant_override("separation", 12)
	top.size_flags_vertical = Control.SIZE_EXPAND_FILL
	box.add_child(top)

	var portrait := _unit_art(unit.get("visual", "cleaner"), Vector2(230, 240))
	portrait.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	top.add_child(portrait)

	if is_enemy:
		top.add_child(_intent_panel())
	else:
		var focus := _codex_panel("身份", "%s\n%s" % [run.player["school"], "资源满后进入通玄，下一次伤害 +8。"], _class_color(run.selected_class))
		focus.custom_minimum_size = Vector2(190, 160)
		top.add_child(focus)

	var title := _label(unit["name"], 28, Color("#f7fbff"))
	box.add_child(title)
	var subtitle := _label(unit["title"] if is_enemy else unit["school"], 15, Color(0.55, 0.96, 1.0, 0.72))
	box.add_child(subtitle)
	box.add_child(_vital_bar(int(unit["hp"]), int(unit["max_hp"]), int(unit["block"]), is_enemy))

	var status := _label(_status_line(unit, is_enemy), 15, Color(0.86, 0.91, 1.0, 0.76))
	box.add_child(status)
	return panel

func _intent_panel() -> PanelContainer:
	var move: Dictionary = run.enemy["next_move"]
	var amount := int(move["amount"]) + (int(run.enemy["strength"]) if move["intent"] == "attack" else 0)
	var panel := PanelContainer.new()
	panel.custom_minimum_size = Vector2(190, 150)
	panel.add_theme_stylebox_override("panel", _panel_style(Color(0.055, 0.025, 0.08, 0.86), _intent_color(move["intent"]), 8))
	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 8)
	panel.add_child(box)
	box.add_child(_label("敌方意图", 15, Color(0.88, 0.95, 1.0, 0.72)))
	box.add_child(_label("%s %s" % [_intent_icon(move["intent"]), move["label"]], 24, Color("#f7fbff")))
	var body := _label("%s %d" % [_intent_label(move["intent"]), amount], 18, _intent_color(move["intent"]))
	body.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	box.add_child(body)
	return panel

func _vital_bar(hp: int, max_hp: int, block: int, is_enemy: bool) -> VBoxContainer:
	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 6)
	var hpbar := ProgressBar.new()
	hpbar.custom_minimum_size = Vector2(0, 18)
	hpbar.max_value = max_hp
	hpbar.value = max(0, hp)
	hpbar.show_percentage = false
	hpbar.add_theme_stylebox_override("background", _flat(Color(0.08, 0.08, 0.12, 0.9), Color(0, 0, 0, 0), 9))
	hpbar.add_theme_stylebox_override("fill", _flat(Color("#ff3f61") if is_enemy else Color("#45f0ff"), Color(0, 0, 0, 0), 9))
	box.add_child(hpbar)
	box.add_child(_label("气血 %d/%d   护体 %d" % [hp, max_hp, block], 15, Color(0.86, 0.91, 1.0, 0.76)))
	return box

func _card_button(card_id: String, hand_index: int, playable: bool) -> Button:
	var card: Dictionary = cards[card_id]
	var disabled := playable and int(run.player["energy"]) < int(card["cost"])
	var button := _button("%s  [%d]\n%s\n%s" % [card["name"], card["cost"], card["kind"], card["text"]], Vector2(150, 205), Color("#100f1e"), Color("#55f7ff") if not disabled else Color(0.3, 0.35, 0.4, 1))
	button.disabled = disabled
	button.tooltip_text = _card_tooltip(card)
	button.add_theme_font_size_override("font_size", 15)
	button.mouse_entered.connect(func(): _hover_card(button, true))
	button.mouse_exited.connect(func(): _hover_card(button, false))
	if playable:
		button.pressed.connect(func(): _play_card(hand_index))
	return button

func _unit_art(visual: String, min_size: Vector2) -> Control:
	var strip_path := _unit_idle_strip_path(visual)
	var portrait_path := _unit_art_path(visual)
	var strip_image := _load_image(strip_path)
	var portrait_image := _load_image(portrait_path)
	if strip_image == null and portrait_image == null:
		var fallback := CyberPortrait.new()
		fallback.custom_minimum_size = min_size
		fallback.configure(visual, "")
		return fallback
	var art := UnitArt.new()
	art.custom_minimum_size = min_size
	if strip_image != null:
		art.set_strip(strip_image)
	elif portrait_image != null:
		art.set_static_texture(ImageTexture.create_from_image(portrait_image))
	return art

func _load_image(path: String) -> Image:
	if path.is_empty():
		return null
	var bytes := FileAccess.get_file_as_bytes(path)
	if bytes.is_empty():
		return null
	var image := Image.new()
	var err := image.load_png_from_buffer(bytes)
	if err != OK:
		return null
	return image

func _hover_card(button: Button, active: bool) -> void:
	button.z_index = 10 if active else 0
	var tween := create_tween()
	tween.set_parallel(true)
	tween.tween_property(button, "scale", Vector2(1.07, 1.07) if active else Vector2.ONE, 0.12).set_trans(Tween.TRANS_SINE)
	tween.tween_property(button, "modulate", Color(1.1, 1.1, 1.18, 1.0) if active else Color.WHITE, 0.12)

func _play_card(index: int) -> void:
	run.play_card(index)
	_after_action()

func _end_turn() -> void:
	run.end_turn()
	_after_action()

func _after_action() -> void:
	if run.player["hp"] <= 0:
		_show_defeat()
	elif run.is_complete():
		_show_complete()
	elif run.enemy["hp"] <= 0:
		reward_options = run.reward_choices()
		_show_reward()
	else:
		_show_battle()

func _show_reward() -> void:
	var root := _make_screen()
	root.add_child(_label("截获一枚法诀芯片", 44, Color("#f7fbff")))
	root.add_child(_label("选择一张加入牌组，或跳过。卡牌机制先保持基础版，视觉和题材先跑通。", 18, Color(0.86, 0.91, 1.0, 0.78)))

	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 14)
	row.size_flags_vertical = Control.SIZE_EXPAND_FILL
	root.add_child(row)
	for card_id in reward_options:
		var card_button := _card_button(String(card_id), -1, false)
		card_button.custom_minimum_size = Vector2(210, 260)
		card_button.pressed.connect(func(id := String(card_id)): _choose_reward(id))
		row.add_child(card_button)

	var actions := HBoxContainer.new()
	actions.add_theme_constant_override("separation", 12)
	root.add_child(actions)
	var skip := _button("跳过", Vector2(130, 48), Color("#16243a"), Color("#55f7ff"))
	skip.pressed.connect(func():
		run.skip_reward()
		_show_battle()
	)
	actions.add_child(skip)
	var back := _button("退出", Vector2(130, 48), Color("#301626"), Color("#ff43d6"))
	back.pressed.connect(_show_main_menu)
	actions.add_child(back)

func _choose_reward(card_id: String) -> void:
	run.choose_reward(card_id)
	_show_battle()

func _show_complete() -> void:
	var root := _make_screen()
	var panel := _codex_panel("第一段夜巡完成", "你击退了霓灯犬、铁鬃械猪和黑巷劫修。MVP 目标达成：三职业、三战斗、赛博修仙 HUD、人物/敌人视觉和基础卡牌战斗已跑通。", Color("#ffe66d"))
	panel.custom_minimum_size = Vector2(720, 250)
	root.add_child(panel)
	var again := _button("再来一轮", Vector2(180, 52), Color("#16243a"), Color("#55f7ff"))
	again.pressed.connect(_show_main_menu)
	root.add_child(again)

func _show_defeat() -> void:
	var root := _make_screen()
	var panel := _codex_panel("夜巡中断", "气海崩散，但天机城还在记录你的下一次尝试。", Color("#ff43d6"))
	panel.custom_minimum_size = Vector2(620, 210)
	root.add_child(panel)
	var back := _button("返回主界面", Vector2(180, 52), Color("#301626"), Color("#ff43d6"))
	back.pressed.connect(_show_main_menu)
	root.add_child(back)

func _log_panel() -> PanelContainer:
	var panel := PanelContainer.new()
	panel.custom_minimum_size = Vector2(0, 160)
	panel.add_theme_stylebox_override("panel", _panel_style(Color(0.02, 0.025, 0.06, 0.84), Color("#55f7ff"), 8))
	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 6)
	panel.add_child(box)
	box.add_child(_label("战斗历史", 20, Color("#f7fbff")))
	for entry in run.log:
		box.add_child(_label(String(entry), 14, Color(0.86, 0.91, 1.0, 0.74)))
	return panel

func _mini_stat(label_text: String, value: int) -> PanelContainer:
	var panel := PanelContainer.new()
	panel.custom_minimum_size = Vector2(92, 60)
	panel.add_theme_stylebox_override("panel", _panel_style(Color(0.02, 0.025, 0.06, 0.68), Color("#55f7ff"), 8))
	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 2)
	panel.add_child(box)
	box.add_child(_label(label_text, 13, Color(0.86, 0.91, 1.0, 0.68)))
	box.add_child(_label(str(value), 22, Color("#f7fbff")))
	return panel

func _orb_meter(label_text: String, current: int, max_value: int, color: Color) -> PanelContainer:
	var panel := PanelContainer.new()
	panel.custom_minimum_size = Vector2(170, 54)
	panel.add_theme_stylebox_override("panel", _panel_style(Color(0.02, 0.025, 0.06, 0.68), color, 8))
	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 5)
	panel.add_child(box)
	box.add_child(_label("%s %d/%d" % [label_text, current, max_value], 14, Color("#f7fbff")))
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 5)
	box.add_child(row)
	for i in range(max_value):
		var dot := ColorRect.new()
		dot.custom_minimum_size = Vector2(15, 12)
		dot.color = color if i < current else Color(0.2, 0.22, 0.3, 0.8)
		row.add_child(dot)
	return panel

func _button(text: String, min_size: Vector2, bg: Color, border: Color) -> Button:
	var button := Button.new()
	button.text = text
	button.custom_minimum_size = min_size
	button.add_theme_stylebox_override("normal", _flat(bg, border, 8))
	button.add_theme_stylebox_override("hover", _flat(bg.lightened(0.08), border.lightened(0.2), 8))
	button.add_theme_stylebox_override("pressed", _flat(bg.darkened(0.05), border, 8))
	button.add_theme_stylebox_override("disabled", _flat(Color(0.1, 0.1, 0.14, 0.65), Color(0.3, 0.3, 0.35, 0.7), 8))
	button.add_theme_color_override("font_color", Color("#f7fbff"))
	button.add_theme_color_override("font_hover_color", Color("#ffffff"))
	button.add_theme_color_override("font_disabled_color", Color(0.55, 0.6, 0.66, 0.7))
	return button

func _label(text: String, size_px: int, color: Color) -> Label:
	var label := Label.new()
	label.text = text
	label.add_theme_font_size_override("font_size", size_px)
	label.add_theme_color_override("font_color", color)
	return label

func _section_title(text: String) -> Label:
	return _label(text, 28, Color("#ffe66d"))

func _panel_style(bg: Color, border: Color, radius: int) -> StyleBoxFlat:
	var style := _flat(bg, border, radius)
	style.shadow_color = Color(0, 0, 0, 0.34)
	style.shadow_size = 18
	style.content_margin_left = 16
	style.content_margin_right = 16
	style.content_margin_top = 14
	style.content_margin_bottom = 14
	return style

func _flat(bg: Color, border: Color, radius: int) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = bg
	style.border_color = border
	style.set_border_width_all(1)
	style.set_corner_radius_all(radius)
	return style

func _class_color(class_id: String) -> Color:
	if class_id == "cleaner":
		return Color("#55f7ff")
	if class_id == "worker":
		return Color("#ff5f4c")
	if class_id == "streamer":
		return Color("#ff43d6")
	return Color("#ffe66d")

func _unit_art_path(visual: String) -> String:
	var paths := {
		"cleaner": "res://assets/pixel/px-cleaner.png",
		"worker": "res://assets/pixel/px-worker.png",
		"streamer": "res://assets/pixel/px-streamer.png",
		"neon_hound": "res://assets/pixel/px-enemy-neon-hound.png",
		"iron_boar": "res://assets/pixel/px-enemy-iron-boar.png",
		"alley_raider": "res://assets/pixel/px-enemy-alley-raider.png"
	}
	return paths.get(visual, "res://assets/pixel/px-cleaner.png")

func _unit_idle_strip_path(visual: String) -> String:
	var paths := {
		"cleaner": "res://assets/pixel/px-cleaner-idle-strip.png",
		"worker": "res://assets/pixel/px-worker-idle-strip.png",
		"streamer": "res://assets/pixel/px-streamer-idle-strip.png",
		"neon_hound": "res://assets/pixel/px-enemy-neon-hound-idle-strip.png",
		"iron_boar": "res://assets/pixel/px-enemy-iron-boar-idle-strip.png",
		"alley_raider": "res://assets/pixel/px-enemy-alley-raider-idle-strip.png"
	}
	return paths.get(visual, "")

func _intent_color(intent: String) -> Color:
	if intent == "attack":
		return Color("#ff4568")
	if intent == "block":
		return Color("#55f7ff")
	return Color("#ffe66d")

func _intent_icon(intent: String) -> String:
	if intent == "attack":
		return "杀"
	if intent == "block":
		return "守"
	return "频"

func _intent_label(intent: String) -> String:
	if intent == "attack":
		return "将造成"
	if intent == "block":
		return "将获得护体"
	return "将强化攻势"

func _status_line(unit: Dictionary, is_enemy: bool) -> String:
	if is_enemy:
		return "攻势 %d   灼痕 %d   护体 %d" % [unit["strength"], unit["burn"], unit["block"]]
	return "%s %d/%d   通玄 %s" % [unit["resource_name"], unit["resource"], unit["max_resource"], "已成" if unit["transcendent"] else "未成"]

func _card_tooltip(card: Dictionary) -> String:
	var lines: Array[String] = []
	lines.append(card["text"])
	if card.has("keywords"):
		for id in card["keywords"]:
			var key: Dictionary = keywords.get(id, {})
			if not key.is_empty():
				lines.append("%s：%s" % [key["name"], key["text"]])
	return "\n".join(lines)

func _move_summary(moves: Array) -> String:
	var names: Array[String] = []
	for move in moves:
		names.append(move["label"])
	return " / ".join(names)

func draw_pile_size() -> int:
	return run.draw_pile.size()

func discard_pile_size() -> int:
	return run.discard_pile.size()
