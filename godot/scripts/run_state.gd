extends RefCounted

const ACT_LENGTH := 3

var classes: Dictionary
var cards: Dictionary
var enemies: Array

var floor := 1
var turn := 0
var selected_class := ""
var player := {}
var enemy := {}
var draw_pile: Array = []
var discard_pile: Array = []
var hand: Array = []
var log: Array[String] = []

func setup(data_classes: Dictionary, data_cards: Dictionary, data_enemies: Array) -> void:
	classes = data_classes
	cards = data_cards
	enemies = data_enemies

func start_new(class_id: String) -> void:
	selected_class = class_id
	var cls: Dictionary = classes[class_id]
	floor = 1
	player = {
		"id": class_id,
		"name": cls["name"],
		"final_title": cls.get("final_title", ""),
		"school": cls["school"],
		"resource_name": cls["resource_name"],
		"visual": cls.get("visual", class_id),
		"mark": cls.get("mark", ""),
		"hp": cls["max_hp"],
		"max_hp": cls["max_hp"],
		"block": 0,
		"energy": 3,
		"max_energy": 3,
		"resource": cls["start_resource"],
		"max_resource": 6,
		"transcendent": false,
		"deck": cls["deck"].duplicate()
	}
	log = ["%s 进入天机城夜巡。" % cls["name"]]
	_start_combat()

func _start_combat() -> void:
	var encounter: Dictionary = enemies[floor - 1]
	enemy = encounter.duplicate(true)
	enemy["hp"] = enemy["max_hp"]
	enemy["block"] = 0
	enemy["strength"] = 0
	enemy["burn"] = 0
	enemy["move_index"] = 0
	enemy["next_move"] = enemy["moves"][0]
	turn = 0
	draw_pile = player["deck"].duplicate()
	draw_pile.shuffle()
	discard_pile = []
	hand = []
	player["block"] = 0
	player["energy"] = player["max_energy"]
	_start_player_turn()
	_add_log("第 %d 战：%s 拦路。" % [floor, enemy["name"]])

func _start_player_turn() -> void:
	turn += 1
	player["block"] = 0
	player["energy"] = player["max_energy"]
	_draw_cards(5)
	_apply_burn()

func play_card(hand_index: int) -> void:
	if hand_index < 0 or hand_index >= hand.size():
		return
	var card_id: String = hand[hand_index]
	var card: Dictionary = cards[card_id]
	if player["energy"] < int(card["cost"]):
		return
	player["energy"] -= int(card["cost"])
	hand.remove_at(hand_index)
	_apply_card(card)
	discard_pile.append(card_id)
	_add_log("施展「%s」。" % card["name"])
	if enemy["hp"] <= 0:
		_win_combat()

func end_turn() -> void:
	if player["energy"] > 0:
		_gain_resource(player["energy"])
		_add_log("余下灵能化为 %d 点%s。" % [player["energy"], player["resource_name"]])
	discard_pile.append_array(hand)
	hand = []
	_resolve_enemy_turn()
	if player["hp"] <= 0:
		_add_log("气海崩散，此行止步。")
		return
	_choose_enemy_move()
	_start_player_turn()

func choose_reward(card_id: String) -> void:
	player["deck"].append(card_id)
	floor += 1
	_start_combat()

func skip_reward() -> void:
	floor += 1
	_start_combat()

func reward_choices() -> Array:
	var pool: Array = classes[selected_class]["rewards"].duplicate()
	pool.shuffle()
	return pool.slice(0, min(3, pool.size()))

func is_complete() -> bool:
	return floor >= ACT_LENGTH and enemy["hp"] <= 0

func _apply_card(card: Dictionary) -> void:
	if card.has("damage"):
		_deal_damage(int(card["damage"]))
	if card.has("block"):
		_gain_block(int(card["block"]))
	if card.has("resource"):
		_gain_resource(int(card["resource"]))
	if card.has("burn"):
		enemy["burn"] += int(card["burn"])
		_add_log("%s 身上留下 %d 层灼痕。" % [enemy["name"], card["burn"]])
	if card.has("draw"):
		_draw_cards(int(card["draw"]))
	if card.has("heal"):
		var amount := int(card["heal"])
		player["hp"] = min(player["max_hp"], player["hp"] + amount)
		_add_log("气血回复 %d。" % amount)

func _deal_damage(amount: int) -> void:
	if player["transcendent"]:
		amount += 8
		player["transcendent"] = false
		_add_log("通玄之势爆发。")
	var blocked: int = min(enemy["block"], amount)
	enemy["block"] -= blocked
	enemy["hp"] -= amount - blocked
	_add_log("%s 受 %d 点伤害。" % [enemy["name"], amount - blocked])

func _gain_block(amount: int) -> void:
	player["block"] += amount
	_add_log("护体 +%d。" % amount)

func _gain_resource(amount: int) -> void:
	if amount <= 0:
		return
	player["resource"] = min(player["max_resource"], player["resource"] + amount)
	if player["resource"] >= player["max_resource"] and not player["transcendent"]:
		player["resource"] = 0
		player["transcendent"] = true
		_add_log("%s贯通，进入「通玄」。" % player["resource_name"])

func _resolve_enemy_turn() -> void:
	var move: Dictionary = enemy["next_move"]
	enemy["block"] = 0
	if move["intent"] == "attack":
		var amount: int = int(move["amount"]) + int(enemy["strength"])
		var blocked: int = min(player["block"], amount)
		player["block"] -= blocked
		player["hp"] -= amount - blocked
		_add_log("%s 造成 %d 点伤害。" % [enemy["name"], amount - blocked])
	elif move["intent"] == "block":
		enemy["block"] += int(move["amount"])
		_add_log("%s 凝起 %d 点护体。" % [enemy["name"], move["amount"]])
	elif move["intent"] == "buff":
		enemy["strength"] += int(move["amount"])
		_add_log("%s 攻势上涨 +%d。" % [enemy["name"], move["amount"]])

func _choose_enemy_move() -> void:
	enemy["move_index"] += 1
	enemy["next_move"] = enemy["moves"][enemy["move_index"] % enemy["moves"].size()]

func _apply_burn() -> void:
	if enemy.get("burn", 0) <= 0:
		return
	enemy["hp"] -= enemy["burn"]
	_add_log("%s 灼痕发作，受 %d 点伤害。" % [enemy["name"], enemy["burn"]])
	enemy["burn"] = max(0, enemy["burn"] - 1)
	if enemy["hp"] <= 0:
		_win_combat()

func _win_combat() -> void:
	enemy["hp"] = 0
	_add_log("%s 败退。" % enemy["name"])
	if floor >= ACT_LENGTH:
		_add_log("第一段夜巡完成。")

func _draw_cards(count: int) -> void:
	for i in range(count):
		if draw_pile.is_empty():
			if discard_pile.is_empty():
				return
			draw_pile = discard_pile.duplicate()
			draw_pile.shuffle()
			discard_pile = []
		hand.append(draw_pile.pop_back())

func _add_log(message: String) -> void:
	log.push_front(message)
	if log.size() > 8:
		log.resize(8)
