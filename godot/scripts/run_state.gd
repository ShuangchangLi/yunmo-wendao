extends RefCounted

const ACT_LENGTH := 3

var classes: Dictionary
var cards: Dictionary
var enemies: Array
var organizations: Dictionary

var floor := 1
var turn := 0
var selected_class := ""
var selected_org := ""
var player := {}
var enemy := {}
var draw_pile: Array = []
var discard_pile: Array = []
var hand: Array = []
var log: Array[String] = []

func setup(data_classes: Dictionary, data_cards: Dictionary, data_enemies: Array, data_orgs: Dictionary) -> void:
	classes = data_classes
	cards = data_cards
	enemies = data_enemies
	organizations = data_orgs

func start_new(class_id: String, org_id: String) -> void:
	selected_class = class_id
	selected_org = org_id
	var cls: Dictionary = classes[class_id]
	var org: Dictionary = organizations[org_id]
	floor = 1
	player = {
		"id": class_id,
		"name": cls["name"],
		"profession": cls["profession"],
		"tagline": cls.get("tagline", ""),
		"visual": cls.get("visual", class_id),
		"organization_id": org_id,
		"organization_name": org["name"],
		"organization_color": org["color"],
		"hp": cls["max_hp"],
		"max_hp": cls["max_hp"],
		"block": 0,
		"energy": 3,
		"max_energy": 3,
		"passive": cls["passive"],
		"deck": cls["deck"].duplicate(),
		"attacks_played": 0,
		"deathline_triggers": 0,
	}
	log = ["%s（%s）进入夜巡，挂靠 %s。" % [cls["name"], cls["profession"], org["name"]]]
	_start_combat()

func _start_combat() -> void:
	var encounter: Dictionary = enemies[(floor - 1) % enemies.size()]
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
	player["attacks_played"] = 0
	player["deathline_triggers"] = 0
	_choose_enemy_move()
	_start_player_turn()
	_add_log("第 %d 战：%s 拦路。" % [floor, enemy["name"]])

func _start_player_turn() -> void:
	turn += 1
	player["block"] = 0
	player["energy"] = player["max_energy"]
	player["deathline_triggers"] = 0
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
	discard_pile.append_array(hand)
	hand = []
	_trigger_enemy_turn_passive()
	_resolve_enemy_turn()
	if player["hp"] <= 0:
		_add_log("气海崩散，此行止步。")
		return
	if enemy["hp"] <= 0:
		_win_combat()
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
	var card_type: String = String(card.get("type", "skill"))
	if card.has("damage"):
		var bonus := 0
		if card_type == "attack" and player["passive"]["id"] == "ji_chen" and int(player["attacks_played"]) > 0 and int(player["attacks_played"]) % 3 == 0:
			bonus = 2
			_add_log("积尘：尘埃凝聚，本击 +2。")
		_deal_damage(int(card["damage"]) + bonus)
	if card_type == "attack":
		player["attacks_played"] = int(player["attacks_played"]) + 1
	if card.has("block"):
		_gain_block(int(card["block"]))
	if card.has("burn"):
		enemy["burn"] = int(enemy["burn"]) + int(card["burn"])
		_add_log("%s 身上留下 %d 层灼痕。" % [enemy["name"], card["burn"]])
	if card.has("draw"):
		_draw_cards(int(card["draw"]))
	if card.has("heal"):
		var amount := int(card["heal"])
		player["hp"] = min(player["max_hp"], player["hp"] + amount)
		_add_log("气血回复 %d。" % amount)

func _deal_damage(amount: int) -> void:
	var blocked: int = min(int(enemy["block"]), amount)
	enemy["block"] -= blocked
	enemy["hp"] -= amount - blocked
	_add_log("%s 受 %d 点伤害。" % [enemy["name"], amount - blocked])

func _gain_block(amount: int) -> void:
	player["block"] = int(player["block"]) + amount
	_add_log("护体 +%d。" % amount)

func _trigger_enemy_turn_passive() -> void:
	if player["passive"]["id"] == "re_sou" and int(enemy["burn"]) > 0:
		enemy["burn"] = int(enemy["burn"]) + 1
		_add_log("热搜：%s 灼痕 +1。" % enemy["name"])

func _resolve_enemy_turn() -> void:
	var move: Dictionary = enemy["next_move"]
	enemy["block"] = 0
	if move["intent"] == "attack":
		var amount: int = int(move["amount"]) + int(enemy["strength"])
		var blocked: int = min(int(player["block"]), amount)
		player["block"] -= blocked
		var taken: int = amount - blocked
		player["hp"] -= taken
		_add_log("%s 造成 %d 点伤害。" % [enemy["name"], taken])
		if taken > 0 and player["passive"]["id"] == "si_xian" and int(player["deathline_triggers"]) < 3:
			player["block"] = int(player["block"]) + 1
			player["deathline_triggers"] = int(player["deathline_triggers"]) + 1
			_add_log("死线：身体先于脑子反应，护体 +1。")
	elif move["intent"] == "block":
		enemy["block"] += int(move["amount"])
		_add_log("%s 凝起 %d 点护体。" % [enemy["name"], move["amount"]])
	elif move["intent"] == "buff":
		enemy["strength"] = int(enemy["strength"]) + int(move["amount"])
		_add_log("%s 攻势上涨 +%d。" % [enemy["name"], move["amount"]])

func _choose_enemy_move() -> void:
	enemy["move_index"] = int(enemy["move_index"]) + 1
	enemy["next_move"] = enemy["moves"][int(enemy["move_index"]) % enemy["moves"].size()]

func _apply_burn() -> void:
	if enemy.get("burn", 0) <= 0:
		return
	enemy["hp"] -= int(enemy["burn"])
	_add_log("%s 灼痕发作，受 %d 点伤害。" % [enemy["name"], enemy["burn"]])
	enemy["burn"] = max(0, int(enemy["burn"]) - 1)
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
