extends Control

const DataLoader = preload("res://scripts/data_loader.gd")
const RunState = preload("res://scripts/run_state.gd")

var classes: Dictionary
var cards: Dictionary
var enemies: Array
var keywords: Dictionary
var run := RunState.new()
var reward_options: Array = []

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

func _make_root() -> VBoxContainer:
	_clear()
	var root := VBoxContainer.new()
	root.set_anchors_preset(Control.PRESET_FULL_RECT)
	root.add_theme_constant_override("separation", 16)
	root.custom_minimum_size = Vector2(960, 640)
	add_child(root)
	return root

func _show_main_menu() -> void:
	var root := _make_root()
	root.add_theme_constant_override("margin_left", 36)
	root.add_theme_constant_override("margin_top", 28)
	var title := Label.new()
	title.text = "山海问道"
	title.add_theme_font_size_override("font_size", 64)
	root.add_child(title)
	var subtitle := Label.new()
	subtitle.text = "Godot vertical slice：先验证职业选择、卡牌战斗、敌人意图和奖励闭环。"
	root.add_child(subtitle)
	var class_row := HBoxContainer.new()
	class_row.add_theme_constant_override("separation", 12)
	root.add_child(class_row)
	for class_id in classes.keys():
		var class_data: Dictionary = classes[class_id]
		var button := Button.new()
		button.custom_minimum_size = Vector2(260, 170)
		button.text = "%s\n%s\n%s" % [class_data["name"], class_data["school"], class_data["trait"]]
		var captured_id := String(class_id)
		button.pressed.connect(func(): _start_run(captured_id))
		class_row.add_child(button)

func _start_run(class_id: String) -> void:
	run.start_new(class_id)
	_show_battle()

func _show_battle() -> void:
	var root := _make_root()
	var top := HBoxContainer.new()
	top.add_theme_constant_override("separation", 12)
	root.add_child(top)
	var player_label := Label.new()
	player_label.text = "%s  气血 %d/%d  灵力 %d/%d  %s %d/%d" % [
		run.player["name"],
		run.player["hp"],
		run.player["max_hp"],
		run.player["energy"],
		run.player["max_energy"],
		run.player["resource_name"],
		run.player["resource"],
		run.player["max_resource"]
	]
	top.add_child(player_label)
	var exit_button := Button.new()
	exit_button.text = "返回主界面"
	exit_button.pressed.connect(_show_main_menu)
	top.add_child(exit_button)

	var field := HBoxContainer.new()
	field.add_theme_constant_override("separation", 16)
	root.add_child(field)
	field.add_child(_combat_panel("玩家", run.player["name"], run.player["hp"], run.player["max_hp"], run.player["block"], ""))
	var move: Dictionary = run.enemy["next_move"]
	var intent_text := "%s：%s %d" % [move["label"], _intent_label(move["intent"]), int(move["amount"]) + (run.enemy["strength"] if move["intent"] == "attack" else 0)]
	field.add_child(_combat_panel(run.enemy["title"], run.enemy["name"], run.enemy["hp"], run.enemy["max_hp"], run.enemy["block"], intent_text))

	var hand_label := Label.new()
	hand_label.text = "手牌"
	root.add_child(hand_label)
	var hand := HBoxContainer.new()
	hand.add_theme_constant_override("separation", 10)
	root.add_child(hand)
	for index in run.hand.size():
		var card_id: String = run.hand[index]
		var card: Dictionary = cards[card_id]
		var card_button := Button.new()
		card_button.custom_minimum_size = Vector2(145, 190)
		card_button.text = "%s  [%d]\n%s\n%s" % [card["name"], card["cost"], card["kind"], card["text"]]
		card_button.disabled = run.player["energy"] < int(card["cost"])
		var captured_index := index
		card_button.pressed.connect(func(): _play_card(captured_index))
		hand.add_child(card_button)

	var actions := HBoxContainer.new()
	actions.add_theme_constant_override("separation", 10)
	root.add_child(actions)
	var end_turn := Button.new()
	end_turn.text = "结束回合"
	end_turn.pressed.connect(_end_turn)
	actions.add_child(end_turn)
	var log_text := RichTextLabel.new()
	log_text.custom_minimum_size = Vector2(900, 120)
	log_text.text = "\n".join(run.log)
	root.add_child(log_text)

func _combat_panel(label: String, name: String, hp: int, max_hp: int, block: int, intent: String) -> PanelContainer:
	var panel := PanelContainer.new()
	panel.custom_minimum_size = Vector2(420, 220)
	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 8)
	panel.add_child(box)
	var title := Label.new()
	title.text = "%s\n%s" % [label, name]
	title.add_theme_font_size_override("font_size", 24)
	box.add_child(title)
	var hp_label := Label.new()
	hp_label.text = "气血 %d/%d   护体 %d" % [hp, max_hp, block]
	box.add_child(hp_label)
	if not intent.is_empty():
		var intent_label := Label.new()
		intent_label.text = "意图  %s" % intent
		box.add_child(intent_label)
	return panel

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
	var root := _make_root()
	var title := Label.new()
	title.text = "择一门新法"
	title.add_theme_font_size_override("font_size", 42)
	root.add_child(title)
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 12)
	root.add_child(row)
	for card_id in reward_options:
		var card: Dictionary = cards[card_id]
		var button := Button.new()
		button.custom_minimum_size = Vector2(180, 220)
		button.text = "%s [%d]\n%s\n%s" % [card["name"], card["cost"], card["kind"], card["text"]]
		var captured_id := String(card_id)
		button.pressed.connect(func(): _choose_reward(captured_id))
		row.add_child(button)
	var skip := Button.new()
	skip.text = "不取机缘"
	skip.pressed.connect(func():
		run.skip_reward()
		_show_battle()
	)
	root.add_child(skip)

func _choose_reward(card_id: String) -> void:
	run.choose_reward(card_id)
	_show_battle()

func _show_complete() -> void:
	var root := _make_root()
	var title := Label.new()
	title.text = "山脚已清"
	title.add_theme_font_size_override("font_size", 54)
	root.add_child(title)
	var body := Label.new()
	body.text = "Godot 版第一段目标完成。下一步可以加动画、图片、存档和更正式的 UI。"
	root.add_child(body)
	var back := Button.new()
	back.text = "返回主界面"
	back.pressed.connect(_show_main_menu)
	root.add_child(back)

func _show_defeat() -> void:
	var root := _make_root()
	var title := Label.new()
	title.text = "此劫未渡"
	title.add_theme_font_size_override("font_size", 54)
	root.add_child(title)
	var back := Button.new()
	back.text = "返回主界面"
	back.pressed.connect(_show_main_menu)
	root.add_child(back)

func _intent_label(intent: String) -> String:
	if intent == "attack":
		return "将造成"
	if intent == "block":
		return "将获得护体"
	return "将强化"
