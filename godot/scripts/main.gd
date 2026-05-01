extends Control

const DataLoader = preload("res://scripts/data_loader.gd")
const RunState = preload("res://scripts/run_state.gd")
const CyberBackground = preload("res://scripts/cyber_background.gd")
const CyberPortrait = preload("res://scripts/cyber_portrait.gd")
const UnitArt = preload("res://scripts/unit_art.gd")

const TITLE_ZH := "赛博长生"
const TITLE_SUB := "打工修仙录"
const TAGLINE := "在 5G 信号最差的天台上，他练第一缕罡气。"
const ACT_LENGTH := 3

var classes: Dictionary
var cards: Dictionary
var enemies: Array
var keywords: Dictionary
var organizations: Dictionary
var run := RunState.new()
var reward_options: Array = []
var log_open := false
var pending_class := ""
var pending_org := ""

func _ready() -> void:
	classes = DataLoader.load_json("res://data/classes.json")
	cards = DataLoader.load_json("res://data/cards.json")
	enemies = DataLoader.load_json("res://data/enemies.json")
	keywords = DataLoader.load_json("res://data/keywords.json")
	organizations = DataLoader.load_json("res://data/organizations.json")
	run.setup(classes, cards, enemies, organizations)
	_show_splash()

# ---------- screen scaffolding ----------

func _clear() -> void:
	for child in get_children():
		child.queue_free()

func _make_canvas(scrollable := false) -> Control:
	# Returns a Control that fills the viewport. If scrollable, content goes inside a ScrollContainer.
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
	margin.add_theme_constant_override("margin_left", 28)
	margin.add_theme_constant_override("margin_top", 20)
	margin.add_theme_constant_override("margin_right", 28)
	margin.add_theme_constant_override("margin_bottom", 20)
	add_child(margin)

	if scrollable:
		var scroll := ScrollContainer.new()
		scroll.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
		margin.add_child(scroll)
		var inner := VBoxContainer.new()
		inner.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		inner.add_theme_constant_override("separation", 14)
		scroll.add_child(inner)
		return inner

	var root := VBoxContainer.new()
	root.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	root.size_flags_vertical = Control.SIZE_EXPAND_FILL
	root.add_theme_constant_override("separation", 12)
	margin.add_child(root)
	return root

# ---------- splash ----------

func _show_splash() -> void:
	_clear()
	var stage := Control.new()
	stage.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(stage)

	var bg := TextureRect.new()
	bg.set_anchors_preset(Control.PRESET_FULL_RECT)
	bg.texture = _load_texture("res://assets/homepage/cyber-longevity-home.png")
	bg.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	bg.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	stage.add_child(bg)

	var shade := ColorRect.new()
	shade.set_anchors_preset(Control.PRESET_FULL_RECT)
	shade.color = Color(0.0, 0.0, 0.02, 0.08)
	stage.add_child(shade)

	var progress := _home_panel(Vector2(28, 28), Vector2(290, 132), Color("#ff43d6"))
	stage.add_child(progress)
	var progress_box := VBoxContainer.new()
	progress_box.add_theme_constant_override("separation", 6)
	progress.add_child(progress_box)
	progress_box.add_child(_label("Cultivation Progress", 20, Color("#ff53d5")))
	progress_box.add_child(_label("Qi Condensation III", 18, Color("#55f7ff")))
	progress_box.add_child(_label("230 / 1000", 18, Color("#d69cff")))
	progress_box.add_child(_label("||||..........", 18, Color("#ff53d5")))

	var insight := _home_panel(Vector2(-298, 34), Vector2(270, 132), Color("#ff43d6"))
	insight.anchor_left = 1.0
	insight.anchor_right = 1.0
	stage.add_child(insight)
	var insight_box := VBoxContainer.new()
	insight_box.add_theme_constant_override("separation", 6)
	insight.add_child(insight_box)
	insight_box.add_child(_label("Daily Insight", 20, Color("#ff53d5")))
	insight_box.add_child(_label("Spirit +1", 17, Color("#55f7ff")))
	insight_box.add_child(_label("KPI +1", 17, Color("#55f7ff")))
	insight_box.add_child(_label("Lifespan -1", 17, Color("#ff53d5")))

	var side := VBoxContainer.new()
	side.position = Vector2(34, 230)
	side.add_theme_constant_override("separation", 14)
	stage.add_child(side)
	for item in ["Gongfa", "Cards", "Items", "System"]:
		var side_btn := _button(item, Vector2(72, 56), Color(0.02, 0.03, 0.08, 0.74), Color("#55f7ff"))
		side.add_child(side_btn)

	var start_row := HBoxContainer.new()
	start_row.anchor_left = 0.5
	start_row.anchor_right = 0.5
	start_row.anchor_top = 1.0
	start_row.anchor_bottom = 1.0
	start_row.offset_left = -205
	start_row.offset_right = 205
	start_row.offset_top = -170
	start_row.offset_bottom = -112
	start_row.add_theme_constant_override("separation", 12)
	stage.add_child(start_row)
	var btn_new := _button("START RUN", Vector2(238, 56), Color("#311340"), Color("#ff43d6"))
	btn_new.pressed.connect(_show_select)
	start_row.add_child(btn_new)
	var btn_codex := _button("CODEX", Vector2(150, 56), Color("#16243a"), Color("#55f7ff"))
	btn_codex.pressed.connect(_show_codex)
	start_row.add_child(btn_codex)

	var dock := HBoxContainer.new()
	dock.anchor_left = 0.5
	dock.anchor_right = 0.5
	dock.anchor_top = 1.0
	dock.anchor_bottom = 1.0
	dock.offset_left = -360
	dock.offset_right = 360
	dock.offset_top = -88
	dock.offset_bottom = -26
	dock.add_theme_constant_override("separation", 8)
	stage.add_child(dock)
	for item in ["Battle", "Deck", "Cultivate", "Shop", "Map", "Settings"]:
		var dock_btn := _button(item, Vector2(112, 58), Color(0.02, 0.03, 0.08, 0.72), Color("#8b55ff"))
		dock.add_child(dock_btn)

# ---------- select ----------

func _show_select() -> void:
	var root := _make_canvas(false)

	var head := HBoxContainer.new()
	head.add_theme_constant_override("separation", 12)
	root.add_child(head)
	var back := _button("‹ 返回", Vector2(120, 40), Color("#16243a"), Color("#55f7ff"))
	back.pressed.connect(_show_splash)
	head.add_child(back)
	var head_title := _label("挑一个普通人，挂上一个组织", 22, Color("#f7fbff"))
	head_title.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	head_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	head.add_child(head_title)
	var codex_btn := _button("天机档案", Vector2(120, 40), Color("#16243a"), Color("#55f7ff"))
	codex_btn.pressed.connect(_show_codex)
	head.add_child(codex_btn)

	root.add_child(_section_header("选择你的人物", Color("#55f7ff")))
	var char_row := HBoxContainer.new()
	char_row.add_theme_constant_override("separation", 12)
	char_row.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	char_row.size_flags_vertical = Control.SIZE_EXPAND_FILL
	root.add_child(char_row)
	for class_id in classes.keys():
		char_row.add_child(_character_card(String(class_id), classes[class_id]))

	root.add_child(_section_header("选择你隶属的组织", Color("#ffe66d")))
	var org_row := HBoxContainer.new()
	org_row.add_theme_constant_override("separation", 12)
	org_row.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	root.add_child(org_row)
	for org_id in organizations.keys():
		org_row.add_child(_organization_card(String(org_id), organizations[org_id]))

	var foot := PanelContainer.new()
	foot.add_theme_stylebox_override("panel", _panel_style(Color(0.02, 0.025, 0.06, 0.78), Color("#55f7ff"), 0))
	root.add_child(foot)
	var foot_box := HBoxContainer.new()
	foot_box.add_theme_constant_override("separation", 12)
	foot.add_child(foot_box)
	var summary := _select_summary_label()
	summary.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	foot_box.add_child(summary)
	var ready := pending_class != "" and pending_org != ""
	var confirm := _button("进入夜巡", Vector2(180, 50), Color("#311340") if ready else Color("#1a1428"), Color("#ff43d6") if ready else Color(0.4, 0.42, 0.48, 1))
	confirm.disabled = not ready
	confirm.pressed.connect(_start_run)
	foot_box.add_child(confirm)

func _character_card(class_id: String, data: Dictionary) -> PanelContainer:
	var selected := class_id == pending_class
	var border := Color("#ffe66d") if selected else _class_color(class_id)
	var panel := PanelContainer.new()
	panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	panel.size_flags_vertical = Control.SIZE_EXPAND_FILL
	panel.custom_minimum_size = Vector2(0, 250)
	panel.add_theme_stylebox_override("panel", _panel_style(Color(0.025, 0.028, 0.075, 0.88), border, 0))

	var box := HBoxContainer.new()
	box.add_theme_constant_override("separation", 12)
	panel.add_child(box)

	var portrait := _unit_art(data.get("visual", class_id), Vector2(140, 140))
	portrait.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	box.add_child(portrait)

	var info := VBoxContainer.new()
	info.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	info.add_theme_constant_override("separation", 4)
	box.add_child(info)

	var name_row := HBoxContainer.new()
	name_row.add_theme_constant_override("separation", 8)
	info.add_child(name_row)
	var name_label := _label(data["name"], 26, Color("#f7fbff"))
	name_row.add_child(name_label)
	name_row.add_child(_chip_label(data["profession"], Color("#55f7ff")))

	var tag := _label(data.get("tagline", ""), 13, Color(0.86, 0.91, 1.0, 0.7))
	tag.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	info.add_child(tag)

	var stats := HBoxContainer.new()
	stats.add_theme_constant_override("separation", 12)
	info.add_child(stats)
	stats.add_child(_label("气血 %d" % data["max_hp"], 13, Color(0.86, 0.92, 1.0, 0.86)))
	stats.add_child(_label("能量 3", 13, Color(0.86, 0.92, 1.0, 0.86)))

	var passive_panel := PanelContainer.new()
	passive_panel.add_theme_stylebox_override("panel", _flat(Color(0.02, 0.04, 0.08, 0.7), Color("#55f7ff"), 0))
	info.add_child(passive_panel)
	var passive_box := VBoxContainer.new()
	passive_box.add_theme_constant_override("separation", 2)
	passive_panel.add_child(passive_box)
	passive_box.add_child(_label(data["passive"]["name"], 14, Color("#ffe66d")))
	var p_text := _label(data["passive"]["text"], 12, Color(0.86, 0.91, 1.0, 0.78))
	p_text.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	passive_box.add_child(p_text)

	var btn := _button("选择" if not selected else "已选 ✓", Vector2(0, 36), Color("#16243a") if not selected else Color("#311340"), border)
	btn.pressed.connect(func(): _pick_character(class_id))
	info.add_child(btn)

	return panel

func _organization_card(org_id: String, data: Dictionary) -> PanelContainer:
	var selected := org_id == pending_org
	var color := Color(data["color"])
	var border := Color("#ffe66d") if selected else color
	var panel := PanelContainer.new()
	panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	panel.custom_minimum_size = Vector2(0, 130)
	panel.add_theme_stylebox_override("panel", _panel_style(Color(0.025, 0.028, 0.075, 0.86), border, 0))

	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 6)
	panel.add_child(box)
	box.add_child(_label(data["name"], 22, color))
	var tag := _label(data["tagline"], 12, Color(0.86, 0.91, 1.0, 0.74))
	tag.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	box.add_child(tag)
	box.add_child(_label("机制效果待解锁", 11, Color(0.95, 0.85, 0.4, 0.66)))
	var btn := _button("选择" if not selected else "已选 ✓", Vector2(0, 32), Color("#16243a") if not selected else Color("#311340"), border)
	btn.pressed.connect(func(): _pick_organization(org_id))
	box.add_child(btn)
	return panel

func _select_summary_label() -> Label:
	var text := ""
	if pending_class == "" and pending_org == "":
		text = "请先选择人物与组织。"
	elif pending_class != "" and pending_org == "":
		var c: Dictionary = classes[pending_class]
		text = "已选：%s · %s · 再挑一个组织" % [c["name"], c["profession"]]
	elif pending_class == "" and pending_org != "":
		var o: Dictionary = organizations[pending_org]
		text = "已选：组织 %s · 再挑一个人物" % o["name"]
	else:
		var c2: Dictionary = classes[pending_class]
		var o2: Dictionary = organizations[pending_org]
		text = "%s · %s · 挂靠 %s" % [c2["name"], c2["profession"], o2["name"]]
	return _label(text, 14, Color(0.86, 0.92, 1.0, 0.86))

func _pick_character(class_id: String) -> void:
	pending_class = class_id
	_show_select()

func _pick_organization(org_id: String) -> void:
	pending_org = org_id
	_show_select()

func _start_run() -> void:
	if pending_class == "" or pending_org == "":
		return
	log_open = false
	run.start_new(pending_class, pending_org)
	_show_battle()

# ---------- combat ----------

func _show_battle() -> void:
	var root := _make_canvas(false)
	root.add_child(_battle_topbar())

	var stage := HBoxContainer.new()
	stage.add_theme_constant_override("separation", 12)
	stage.size_flags_vertical = Control.SIZE_EXPAND_FILL
	root.add_child(stage)
	stage.add_child(_combatant_panel(false))
	stage.add_child(_stage_center())
	stage.add_child(_combatant_panel(true))

	root.add_child(_hand_bar())

	if log_open:
		root.add_child(_log_panel())

func _battle_topbar() -> PanelContainer:
	var panel := PanelContainer.new()
	panel.add_theme_stylebox_override("panel", _panel_style(Color(0.02, 0.025, 0.06, 0.82), Color("#55f7ff"), 0))
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 12)
	panel.add_child(row)

	var exit := _button("‹ 退出", Vector2(110, 36), Color("#301626"), Color("#ff43d6"))
	exit.pressed.connect(_show_splash)
	row.add_child(exit)

	var info := HBoxContainer.new()
	info.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	info.add_theme_constant_override("separation", 10)
	row.add_child(info)

	info.add_child(_chip_label("第 %d / %d 战" % [run.floor, ACT_LENGTH], Color("#55f7ff")))
	info.add_child(_label("%s" % run.player["name"], 22, Color("#f7fbff")))
	info.add_child(_label("· %s" % run.player["profession"], 14, Color(0.78, 0.86, 0.95, 0.74)))
	var org_color := Color(run.player["organization_color"])
	info.add_child(_chip_label(String(run.player["organization_name"]), org_color))

	var actions := HBoxContainer.new()
	actions.add_theme_constant_override("separation", 6)
	row.add_child(actions)
	var codex := _button("档案", Vector2(72, 36), Color("#16243a"), Color("#55f7ff"))
	codex.pressed.connect(_show_codex)
	actions.add_child(codex)
	var log_btn := _button("收起" if log_open else "战史", Vector2(72, 36), Color("#11283a"), Color("#55f7ff"))
	log_btn.pressed.connect(func():
		log_open = not log_open
		_show_battle()
	)
	actions.add_child(log_btn)
	return panel

func _stage_center() -> PanelContainer:
	var panel := PanelContainer.new()
	panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	panel.size_flags_vertical = Control.SIZE_EXPAND_FILL
	panel.custom_minimum_size = Vector2(260, 0)
	panel.add_theme_stylebox_override("panel", _panel_style(Color(0.02, 0.025, 0.06, 0.5), Color("#55f7ff"), 0))
	var box := VBoxContainer.new()
	box.alignment = BoxContainer.ALIGNMENT_CENTER
	box.add_theme_constant_override("separation", 8)
	panel.add_child(box)
	var spacer := Control.new()
	spacer.size_flags_vertical = Control.SIZE_EXPAND_FILL
	box.add_child(spacer)
	box.add_child(_chip_label("出招舞台", Color("#55f7ff")))
	var hint := _label(_stage_hint(), 13, Color(0.86, 0.91, 1.0, 0.66))
	hint.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	hint.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	box.add_child(hint)
	var spacer2 := Control.new()
	spacer2.size_flags_vertical = Control.SIZE_EXPAND_FILL
	box.add_child(spacer2)
	return panel

func _stage_hint() -> String:
	if run.enemy.is_empty():
		return "夜巡频道开始记录。"
	var move: Dictionary = run.enemy.get("next_move", {})
	if move.is_empty():
		return "对峙中。"
	if move["intent"] == "attack":
		return "%s 准备出招。" % run.enemy["name"]
	if move["intent"] == "block":
		return "%s 凝起护体。" % run.enemy["name"]
	return "%s 蓄势变强。" % run.enemy["name"]

func _combatant_panel(is_enemy: bool) -> PanelContainer:
	var unit: Dictionary = run.enemy if is_enemy else run.player
	var border: Color
	if is_enemy:
		border = Color("#ff43d6")
	else:
		border = Color(run.player["organization_color"])
	var panel := PanelContainer.new()
	panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	panel.size_flags_vertical = Control.SIZE_EXPAND_FILL
	panel.custom_minimum_size = Vector2(280, 0)
	panel.add_theme_stylebox_override("panel", _panel_style(Color(0.02, 0.025, 0.06, 0.78), border, 0))

	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 6)
	panel.add_child(box)

	var portrait := _unit_art(unit.get("visual", "cleaner"), Vector2(0, 180))
	portrait.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	portrait.size_flags_vertical = Control.SIZE_EXPAND_FILL
	box.add_child(portrait)

	box.add_child(_label(String(unit.get("title", unit.get("profession", ""))), 12, Color(0.78, 0.86, 0.95, 0.72)))
	box.add_child(_label(String(unit["name"]), 22, Color("#f7fbff")))

	if is_enemy:
		box.add_child(_intent_bubble())

	var hp_row := HBoxContainer.new()
	hp_row.add_theme_constant_override("separation", 8)
	box.add_child(hp_row)

	var hp_bar := ProgressBar.new()
	hp_bar.custom_minimum_size = Vector2(0, 18)
	hp_bar.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	hp_bar.max_value = int(unit["max_hp"])
	hp_bar.value = max(0, int(unit["hp"]))
	hp_bar.show_percentage = false
	var fill_color := Color("#ff3f61") if is_enemy else Color(run.player["organization_color"])
	hp_bar.add_theme_stylebox_override("background", _flat(Color(0.08, 0.08, 0.12, 0.9), Color(0, 0, 0, 0), 0))
	hp_bar.add_theme_stylebox_override("fill", _flat(fill_color, Color(0, 0, 0, 0), 0))
	hp_row.add_child(hp_bar)

	var hp_label := _label("%d/%d" % [unit["hp"], unit["max_hp"]], 12, Color("#f7fbff"))
	hp_row.add_child(hp_label)

	var block := int(unit["block"])
	var block_pip := PanelContainer.new()
	block_pip.custom_minimum_size = Vector2(54, 36)
	var block_color := Color("#55f7ff") if block > 0 else Color(0.4, 0.5, 0.62, 0.7)
	block_pip.add_theme_stylebox_override("panel", _flat(Color(0.07, 0.18, 0.3, 0.78) if block > 0 else Color(0.07, 0.1, 0.18, 0.6), block_color, 0))
	hp_row.add_child(block_pip)
	var block_box := HBoxContainer.new()
	block_box.alignment = BoxContainer.ALIGNMENT_CENTER
	block_box.add_theme_constant_override("separation", 4)
	block_pip.add_child(block_box)
	block_box.add_child(_label("护", 10, block_color))
	block_box.add_child(_label(str(block), 16, Color("#f7fbff")))

	var status := HBoxContainer.new()
	status.add_theme_constant_override("separation", 6)
	box.add_child(status)
	if int(unit.get("burn", 0)) > 0:
		status.add_child(_chip_label("灼痕 %d" % unit["burn"], Color("#ff526f")))
	if is_enemy and int(unit.get("strength", 0)) > 0:
		status.add_child(_chip_label("攻势 +%d" % unit["strength"], Color("#ffe66d")))

	return panel

func _intent_bubble() -> PanelContainer:
	var move: Dictionary = run.enemy["next_move"]
	var amount := int(move["amount"]) + (int(run.enemy["strength"]) if move["intent"] == "attack" else 0)
	var color := _intent_color(move["intent"])
	var panel := PanelContainer.new()
	panel.add_theme_stylebox_override("panel", _flat(Color(0.05, 0.04, 0.1, 0.94), color, 0))
	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 2)
	panel.add_child(box)
	box.add_child(_label("%s %s" % [_intent_icon(move["intent"]), move["label"]], 13, Color("#f7fbff")))
	box.add_child(_label("%s %d" % [_intent_label(move["intent"]), amount], 11, color))
	return panel

func _hand_bar() -> PanelContainer:
	var panel := PanelContainer.new()
	panel.add_theme_stylebox_override("panel", _panel_style(Color(0.02, 0.025, 0.06, 0.82), Color("#55f7ff"), 0))
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 10)
	row.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	panel.add_child(row)

	row.add_child(_energy_orb())

	var hand_box := HBoxContainer.new()
	hand_box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	hand_box.add_theme_constant_override("separation", 8)
	row.add_child(hand_box)
	for i in range(run.hand.size()):
		hand_box.add_child(_card_button(String(run.hand[i]), i, true))

	var end_turn := _button("结束\n回合", Vector2(96, 78), Color("#311340"), Color("#ff43d6"))
	end_turn.pressed.connect(_end_turn)
	row.add_child(end_turn)
	return panel

func _energy_orb() -> Control:
	var color := Color(run.player["organization_color"])
	var holder := PanelContainer.new()
	holder.custom_minimum_size = Vector2(96, 96)
	holder.add_theme_stylebox_override("panel", _flat(Color(0.04, 0.12, 0.2, 0.96), color, 0))
	var box := VBoxContainer.new()
	box.alignment = BoxContainer.ALIGNMENT_CENTER
	holder.add_child(box)
	var num := _label("%d/%d" % [run.player["energy"], run.player["max_energy"]], 26, Color("#f7fbff"))
	num.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	box.add_child(num)
	var em := _label("能量", 12, color)
	em.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	box.add_child(em)
	return holder

# ---------- codex / reward / end ----------

func _show_codex() -> void:
	var root := _make_canvas(true)
	var head := HBoxContainer.new()
	head.add_theme_constant_override("separation", 12)
	root.add_child(head)
	var title := _label("天机档案", 36, Color("#f7fbff"))
	title.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	head.add_child(title)
	var back := _button("返回", Vector2(120, 40), Color("#16243a"), Color("#55f7ff"))
	back.pressed.connect(_show_splash)
	head.add_child(back)

	root.add_child(_section_header("三个普通人", Color("#55f7ff")))
	var class_grid := GridContainer.new()
	class_grid.columns = 2
	class_grid.add_theme_constant_override("h_separation", 12)
	class_grid.add_theme_constant_override("v_separation", 12)
	root.add_child(class_grid)
	for class_id in classes.keys():
		var cls: Dictionary = classes[class_id]
		var body := "%s\n气血 %d\n被动「%s」：%s" % [cls.get("tagline", ""), cls["max_hp"], cls["passive"]["name"], cls["passive"]["text"]]
		class_grid.add_child(_codex_panel("%s · %s" % [cls["name"], cls["profession"]], body, _class_color(String(class_id))))

	root.add_child(_section_header("三个组织", Color("#ffe66d")))
	var org_grid := GridContainer.new()
	org_grid.columns = 3
	org_grid.add_theme_constant_override("h_separation", 12)
	org_grid.add_theme_constant_override("v_separation", 12)
	root.add_child(org_grid)
	for org_id in organizations.keys():
		var org: Dictionary = organizations[org_id]
		org_grid.add_child(_codex_panel(org["name"], org["tagline"] + "\n机制效果待解锁。", Color(org["color"])))

	root.add_child(_section_header("敌人", Color("#ff43d6")))
	var enemy_grid := GridContainer.new()
	enemy_grid.columns = 3
	enemy_grid.add_theme_constant_override("h_separation", 12)
	enemy_grid.add_theme_constant_override("v_separation", 12)
	root.add_child(enemy_grid)
	for encounter in enemies:
		enemy_grid.add_child(_codex_panel(encounter["name"], "%s\n气血 %d\n行动：%s" % [encounter["title"], encounter["max_hp"], _move_summary(encounter["moves"])], Color("#ff43d6")))

	root.add_child(_section_header("卡牌", Color("#55f7ff")))
	var card_grid := GridContainer.new()
	card_grid.columns = 4
	card_grid.add_theme_constant_override("h_separation", 10)
	card_grid.add_theme_constant_override("v_separation", 10)
	root.add_child(card_grid)
	for card_id in cards.keys():
		card_grid.add_child(_card_button(String(card_id), -1, false))

func _show_reward() -> void:
	var root := _make_canvas(false)
	root.add_child(_label("截获一枚法诀芯片", 38, Color("#f7fbff")))
	root.add_child(_label("选择一张加入牌组，或跳过。", 14, Color(0.86, 0.91, 1.0, 0.78)))

	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 14)
	row.size_flags_vertical = Control.SIZE_EXPAND_FILL
	root.add_child(row)
	for card_id in reward_options:
		var card_button := _card_button(String(card_id), -1, false)
		card_button.custom_minimum_size = Vector2(200, 240)
		card_button.pressed.connect(func(id := String(card_id)): _choose_reward(id))
		row.add_child(card_button)

	var actions := HBoxContainer.new()
	actions.add_theme_constant_override("separation", 12)
	root.add_child(actions)
	var skip := _button("跳过", Vector2(130, 44), Color("#16243a"), Color("#55f7ff"))
	skip.pressed.connect(func():
		run.skip_reward()
		_show_battle()
	)
	actions.add_child(skip)
	var back := _button("退出", Vector2(130, 44), Color("#301626"), Color("#ff43d6"))
	back.pressed.connect(_show_splash)
	actions.add_child(back)

func _choose_reward(card_id: String) -> void:
	run.choose_reward(card_id)
	_show_battle()

func _show_complete() -> void:
	var root := _make_canvas(false)
	var spacer := Control.new()
	spacer.size_flags_vertical = Control.SIZE_EXPAND_FILL
	root.add_child(spacer)
	var panel := _codex_panel("第一段试炼通过", "你击退了三只赛博妖邪。MVP 跑通：三角色、三组织、简化战斗、被动技能、固定屏幕布局。", Color("#ffe66d"))
	panel.custom_minimum_size = Vector2(620, 220)
	root.add_child(panel)
	var actions := HBoxContainer.new()
	actions.alignment = BoxContainer.ALIGNMENT_CENTER
	actions.add_theme_constant_override("separation", 12)
	root.add_child(actions)
	var again := _button("再来一轮", Vector2(180, 50), Color("#311340"), Color("#ff43d6"))
	again.pressed.connect(_show_select)
	actions.add_child(again)
	var back := _button("返回主界面", Vector2(180, 50), Color("#16243a"), Color("#55f7ff"))
	back.pressed.connect(_show_splash)
	actions.add_child(back)
	var spacer2 := Control.new()
	spacer2.size_flags_vertical = Control.SIZE_EXPAND_FILL
	root.add_child(spacer2)

func _show_defeat() -> void:
	var root := _make_canvas(false)
	var spacer := Control.new()
	spacer.size_flags_vertical = Control.SIZE_EXPAND_FILL
	root.add_child(spacer)
	var panel := _codex_panel("夜巡中断", "气海崩散，但天机城还在记录你的下一次尝试。", Color("#ff43d6"))
	panel.custom_minimum_size = Vector2(620, 200)
	root.add_child(panel)
	var actions := HBoxContainer.new()
	actions.alignment = BoxContainer.ALIGNMENT_CENTER
	actions.add_theme_constant_override("separation", 12)
	root.add_child(actions)
	var again := _button("重新夜巡", Vector2(180, 50), Color("#311340"), Color("#ff43d6"))
	again.pressed.connect(_show_select)
	actions.add_child(again)
	var back := _button("返回主界面", Vector2(180, 50), Color("#16243a"), Color("#55f7ff"))
	back.pressed.connect(_show_splash)
	actions.add_child(back)
	var spacer2 := Control.new()
	spacer2.size_flags_vertical = Control.SIZE_EXPAND_FILL
	root.add_child(spacer2)

# ---------- helpers ----------

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

func _card_button(card_id: String, hand_index: int, playable: bool) -> Button:
	var card: Dictionary = cards[card_id]
	var disabled := playable and int(run.player["energy"]) < int(card["cost"])
	var card_color := _card_owner_color(String(card.get("owner", "common")))
	var border := Color("#ff43d6") if String(card.get("type", "skill")) == "attack" else Color("#55f7ff")
	if disabled:
		border = Color(0.3, 0.35, 0.4, 1)
	var label := "[%s] %d 费\n%s\n\n%s" % [card["name"], card["cost"], _card_kind_label(String(card.get("type", "skill"))), card["text"]]
	var button := _button(label, Vector2(140, 178), card_color, border)
	button.disabled = disabled
	button.tooltip_text = card["text"]
	button.add_theme_font_size_override("font_size", 13)
	button.mouse_entered.connect(func(): _hover_card(button, true))
	button.mouse_exited.connect(func(): _hover_card(button, false))
	if playable:
		button.pressed.connect(func(): _play_card(hand_index))
	return button

func _hover_card(button: Button, active: bool) -> void:
	button.z_index = 10 if active else 0
	var tween := create_tween()
	tween.set_parallel(true)
	tween.tween_property(button, "scale", Vector2(1.07, 1.07) if active else Vector2.ONE, 0.12).set_trans(Tween.TRANS_SINE)
	tween.tween_property(button, "modulate", Color(1.1, 1.1, 1.18, 1.0) if active else Color.WHITE, 0.12)

func _home_panel(pos: Vector2, min_size: Vector2, border: Color) -> PanelContainer:
	var panel := PanelContainer.new()
	panel.position = pos
	panel.custom_minimum_size = min_size
	panel.size = min_size
	panel.add_theme_stylebox_override("panel", _panel_style(Color(0.01, 0.015, 0.045, 0.7), border, 0))
	return panel

func _load_texture(path: String) -> Texture2D:
	var image := _load_image(path)
	if image == null:
		return null
	return ImageTexture.create_from_image(image)

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

func _codex_panel(head: String, body: String, border: Color) -> PanelContainer:
	var panel := PanelContainer.new()
	panel.custom_minimum_size = Vector2(260, 130)
	panel.add_theme_stylebox_override("panel", _panel_style(Color(0.02, 0.025, 0.06, 0.76), border, 0))
	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 6)
	panel.add_child(box)
	box.add_child(_label(head, 20, Color("#f7fbff")))
	var text := _label(body, 13, Color(0.84, 0.92, 1.0, 0.78))
	text.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	box.add_child(text)
	return panel

func _log_panel() -> PanelContainer:
	var panel := PanelContainer.new()
	panel.custom_minimum_size = Vector2(0, 130)
	panel.add_theme_stylebox_override("panel", _panel_style(Color(0.02, 0.025, 0.06, 0.84), Color("#55f7ff"), 0))
	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 4)
	panel.add_child(box)
	box.add_child(_label("战斗历史", 16, Color("#f7fbff")))
	for entry in run.log:
		box.add_child(_label(String(entry), 12, Color(0.86, 0.91, 1.0, 0.74)))
	return panel

func _seal_label(text: String) -> Label:
	var lbl := _label(text, 12, Color("#80f7ff"))
	lbl.add_theme_constant_override("outline_size", 2)
	lbl.add_theme_color_override("font_outline_color", Color(0, 0, 0, 0.7))
	return lbl

func _chip_label(text: String, color: Color) -> Label:
	var lbl := Label.new()
	lbl.text = text
	lbl.add_theme_font_size_override("font_size", 12)
	lbl.add_theme_color_override("font_color", color)
	lbl.add_theme_constant_override("outline_size", 2)
	lbl.add_theme_color_override("font_outline_color", Color(0, 0, 0, 0.7))
	return lbl

func _section_header(text: String, color: Color) -> Label:
	return _label(text, 18, color)

func _button(text: String, min_size: Vector2, bg: Color, border: Color) -> Button:
	var button := Button.new()
	button.text = text
	button.custom_minimum_size = min_size
	button.add_theme_stylebox_override("normal", _flat(bg, border, 0))
	button.add_theme_stylebox_override("hover", _flat(bg.lightened(0.08), border.lightened(0.2), 0))
	button.add_theme_stylebox_override("pressed", _flat(bg.darkened(0.05), border, 0))
	button.add_theme_stylebox_override("disabled", _flat(Color(0.1, 0.1, 0.14, 0.65), Color(0.3, 0.3, 0.35, 0.7), 0))
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

func _panel_style(bg: Color, border: Color, _radius: int) -> StyleBoxFlat:
	var style := _flat(bg, border, 0)
	style.shadow_color = Color(0, 0, 0, 0.34)
	style.shadow_size = 14
	style.content_margin_left = 14
	style.content_margin_right = 14
	style.content_margin_top = 12
	style.content_margin_bottom = 12
	return style

func _flat(bg: Color, border: Color, _radius: int) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = bg
	style.border_color = border
	style.set_border_width_all(2)
	style.set_corner_radius_all(0)
	return style

func _class_color(class_id: String) -> Color:
	if class_id == "zhou":
		return Color("#55f7ff")
	if class_id == "ke":
		return Color("#ff5f4c")
	if class_id == "su":
		return Color("#ff43d6")
	return Color("#ffe66d")

func _card_owner_color(owner: String) -> Color:
	if owner == "zhou":
		return Color(0.07, 0.13, 0.2, 0.96)
	if owner == "ke":
		return Color(0.16, 0.08, 0.04, 0.96)
	if owner == "su":
		return Color(0.16, 0.05, 0.14, 0.96)
	return Color(0.06, 0.08, 0.16, 0.96)

func _card_kind_label(t: String) -> String:
	if t == "attack":
		return "攻击"
	return "技能"

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
		return "造成"
	if intent == "block":
		return "护体 +"
	return "攻势 +"

func _move_summary(moves: Array) -> String:
	var names: Array[String] = []
	for move in moves:
		names.append(move["label"])
	return " / ".join(names)
