export const GAME_TITLE = "赛博长生";
export const GAME_SUBTITLE = "打工修仙录";
export const GAME_TAGLINE = "在 5G 信号最差的天台上，练第一缕灵气。";
export const ACT_LENGTH = 3;

export const KEYWORDS = {
  energy: { name: "能量", text: "本回合可用的行动点。每回合开始恢复到 3。" },
  block: { name: "护体", text: "抵挡即将受到的伤害。玩家护体在自己的回合开始时清空。" },
  burn: { name: "灼痕", text: "持续伤害。回合开始时受伤，然后层数 -1。" },
  draw: { name: "抽牌", text: "从牌堆抽指定数量的牌。" },
};

export const CHARACTERS = {
  zhou: {
    id: "zhou",
    name: "老周",
    profession: "清洁工",
    visual: "cleaner",
    avatar: "./src/assets/portraits/cleaner-headshot.png",
    selectArt: "./src/assets/portraits/cleaner-scene.png",
    selectPortrait: "./src/assets/portraits/cleaner-headshot.png",
    selectStrip: null,
    selectFrames: 1,
    idleStrip: "./src/assets/rd/cleaner-combat-idle-strip.png",
    idleFrames: 8,
    attackStrip: "./src/assets/rd/cleaner-mop-attack-strip.png",
    attackFrames: 8,
    maxHp: 78,
    passive: {
      id: "ji_chen",
      name: "积尘",
      text: "每打出 3 张攻击牌，下一张攻击 +2 伤害。",
    },
    tagline: "拿过千斤拖把，也拿得起霓虹里的第一口气。",
    deck: [
      "sweep_cut", "sweep_cut", "sweep_cut",
      "filter_guard", "filter_guard",
      "recycle_edge",
      "dust_step",
      "breath",
    ],
    rewards: ["recycle_edge", "neon_backhand", "filter_guard", "dust_step", "clean_break", "breath"],
  },
  ke: {
    id: "ke",
    name: "小柯",
    profession: "社畜",
    visual: "worker",
    avatar: "./src/assets/pixel/px-worker.png",
    idleStrip: "./src/assets/pixel/px-worker-idle-strip.png",
    idleFrames: 4,
    maxHp: 84,
    passive: {
      id: "si_xian",
      name: "死线",
      text: "受到伤害后获得 1 点护体，每回合最多触发 3 次。",
    },
    tagline: "屏幕后面长出钢筋的码农。",
    deck: [
      "overtime_claw", "overtime_claw", "overtime_claw",
      "deadline_guard", "deadline_guard",
      "bone_growth",
      "last_train",
      "breath",
    ],
    rewards: ["bone_growth", "overtime_claw", "deadline_guard", "rage_commute", "beast_shift", "last_train"],
  },
  su: {
    id: "su",
    name: "阿酥",
    profession: "主播",
    visual: "streamer",
    avatar: "./src/assets/pixel/px-streamer.png",
    idleStrip: "./src/assets/pixel/px-streamer-idle-strip.png",
    idleFrames: 4,
    maxHp: 70,
    passive: {
      id: "re_sou",
      name: "热搜",
      text: "敌方回合开始时，若敌人有灼痕，灼痕层数 +1。",
    },
    tagline: "弹幕海里的赛博歌姬。",
    deck: [
      "go_live", "go_live", "go_live",
      "bullet_guard", "bullet_guard",
      "hot_search",
      "spotlight_step",
      "breath",
    ],
    rewards: ["hot_search", "bullet_guard", "fan_mirror", "go_live", "crowd_focus", "spotlight_step"],
  },
};

export const ORGANIZATIONS = {
  corp: {
    id: "corp",
    name: "天机科技",
    color: "#55f7ff",
    tagline: "亚洲最大的灵网基础设施商。机会都摆在那里，代价也一样。",
    motto: "网在你身上，门在我手里",
    art: "./src/assets/orgs/org-corp.png",
  },
  academy: {
    id: "academy",
    name: "太上学院",
    color: "#ffe36f",
    tagline: "最后一个有合法师承的地方。从前学剑，现在学气脉编程。",
    motto: "传承可编译，剑意能开源",
    art: "./src/assets/orgs/org-academy.png",
  },
  gang: {
    id: "gang",
    name: "夜行帮",
    color: "#ff53d5",
    tagline: "黑市芯片、违规法诀、明天的房租。",
    motto: "天亮之前办完三件事",
    art: "./src/assets/orgs/org-gang.png",
  },
};

export const CARD_LIBRARY = {
  sweep_cut: cardData("sweep_cut", "扫尘斩", "attack", 1, { damage: 7 }, "造成 7 点伤害。", "zhou", "./src/assets/cards/card-cleaner-sweep-px.png"),
  recycle_edge: cardData("recycle_edge", "回收刃", "attack", 1, { damage: 4, draw: 1 }, "造成 4 点伤害，抽 1 张牌。", "zhou"),
  neon_backhand: cardData("neon_backhand", "霓刃回铲", "attack", 1, { damage: 5, block: 3 }, "造成 5 点伤害，获得 3 点护体。", "zhou"),
  clean_break: cardData("clean_break", "破网清算", "attack", 2, { damage: 13 }, "造成 13 点伤害。", "zhou"),
  filter_guard: cardData("filter_guard", "滤阵护身", "skill", 1, { block: 7 }, "获得 7 点护体。", "zhou", "./src/assets/cards/card-cleaner-block-px.png"),
  dust_step: cardData("dust_step", "尘步", "skill", 0, { block: 3 }, "获得 3 点护体。", "zhou"),

  overtime_claw: cardData("overtime_claw", "加班爪击", "attack", 1, { damage: 6, block: 2 }, "造成 6 点伤害，获得 2 点护体。", "ke"),
  deadline_guard: cardData("deadline_guard", "死线硬撑", "skill", 1, { block: 8 }, "获得 8 点护体。", "ke"),
  bone_growth: cardData("bone_growth", "兽骨增生", "skill", 1, { block: 5, draw: 1 }, "获得 5 点护体，抽 1 张牌。", "ke"),
  rage_commute: cardData("rage_commute", "通勤怒火", "attack", 1, { damage: 5, burn: 2 }, "造成 5 点伤害，附加 2 层灼痕。", "ke"),
  beast_shift: cardData("beast_shift", "兽相显形", "attack", 2, { damage: 12, heal: 3 }, "造成 12 点伤害，回复 3 点气血。", "ke"),
  last_train: cardData("last_train", "末班奔袭", "skill", 0, { draw: 2 }, "抽 2 张牌。", "ke"),

  go_live: cardData("go_live", "开播", "attack", 1, { damage: 5, block: 2 }, "造成 5 点伤害，获得 2 点护体。", "su"),
  bullet_guard: cardData("bullet_guard", "弹幕护体", "skill", 1, { block: 7 }, "获得 7 点护体。", "su"),
  hot_search: cardData("hot_search", "热搜符", "attack", 1, { damage: 4, burn: 3 }, "造成 4 点伤害，附加 3 层灼痕。", "su"),
  fan_mirror: cardData("fan_mirror", "粉丝镜阵", "skill", 1, { block: 4, draw: 1 }, "获得 4 点护体，抽 1 张牌。", "su"),
  crowd_focus: cardData("crowd_focus", "万众注目", "attack", 2, { damage: 10, burn: 2 }, "造成 10 点伤害，附加 2 层灼痕。", "su"),
  spotlight_step: cardData("spotlight_step", "镜头位移", "skill", 0, { block: 3 }, "获得 3 点护体。", "su"),

  breath: cardData("breath", "调息", "skill", 0, { draw: 2 }, "抽 2 张牌。", "common"),
};

const ENCOUNTERS = [
  {
    id: "neon_hound",
    name: "流浪霓灯犬",
    title: "巷口灵污兽",
    visual: "neon_hound",
    art: "./src/assets/pixel/px-enemy-neon-hound.png",
    idleStrip: "./src/assets/pixel/px-enemy-neon-hound-idle-strip.png",
    idleFrames: 8,
    maxHp: 32,
    moves: [
      { intent: "attack", amount: 6, label: "撕咬" },
      { intent: "attack", amount: 5, label: "追光扑" },
      { intent: "buff", amount: 2, label: "嗅血" },
    ],
  },
  {
    id: "iron_boar",
    name: "铁鬃械猪",
    title: "废矿改造妖兽",
    visual: "iron_boar",
    art: "./src/assets/pixel/px-enemy-iron-boar.png",
    idleStrip: null,
    idleFrames: 1,
    maxHp: 46,
    moves: [
      { intent: "block", amount: 8, label: "铁鬃蓄能" },
      { intent: "attack", amount: 13, label: "冲撞" },
      { intent: "attack", amount: 8, label: "断轨獠牙" },
    ],
  },
  {
    id: "alley_raider",
    name: "黑巷劫修",
    title: "非法法诀芯片贩",
    visual: "alley_raider",
    art: "./src/assets/pixel/px-enemy-alley-raider.png",
    idleStrip: "./src/assets/pixel/px-enemy-alley-raider-idle-strip.png",
    idleFrames: 4,
    maxHp: 54,
    moves: [
      { intent: "attack", amount: 8, label: "劫刃" },
      { intent: "block", amount: 7, label: "黑市护符" },
      { intent: "buff", amount: 3, label: "嗑药提频" },
      { intent: "attack", amount: 12, label: "断脉斩" },
    ],
  },
];

function cardData(id, name, type, cost, effects, text, owner, icon) {
  return { id, name, type, cost, ...effects, text, owner, icon: icon || null };
}

export function createGame() {
  return {
    screen: "splash",
    previousScreen: "splash",
    floor: 1,
    rewardChoices: [],
    selectionStep: "character",
    pendingCharacter: null,
    pendingOrganization: null,
    player: null,
    enemy: null,
    turn: 0,
    log: ["天机城又下雨了。"],
    rngSeed: Date.now() % 2147483647,
  };
}

export function restartGame() {
  return createGame();
}

export function gotoSelect(game) {
  game.screen = "select";
  game.selectionStep = "character";
  game.pendingCharacter = null;
  game.pendingOrganization = null;
}

export function gotoSplash(game) {
  game.screen = "splash";
}

export function showCodex(game) {
  game.previousScreen = game.screen;
  game.screen = "codex";
}

export function closeCodex(game) {
  game.screen = game.previousScreen || "splash";
}

export function pickPendingCharacter(game, characterId) {
  if (!CHARACTERS[characterId]) return;
  game.pendingCharacter = characterId;
}

export function confirmPendingCharacter(game) {
  if (!game.pendingCharacter) return;
  game.selectionStep = "organization";
  game.pendingOrganization = null;
}

export function backToCharacterSelect(game) {
  game.selectionStep = "character";
  game.pendingOrganization = null;
}

export function pickPendingOrganization(game, organizationId) {
  if (!ORGANIZATIONS[organizationId]) return;
  game.pendingOrganization = organizationId;
}

export function confirmSelection(game) {
  if (!game.pendingCharacter || !game.pendingOrganization) return;
  startRun(game, game.pendingCharacter, game.pendingOrganization);
}

function startRun(game, characterId, organizationId) {
  const character = CHARACTERS[characterId];
  const organization = ORGANIZATIONS[organizationId];
  game.floor = 1;
  game.player = {
    characterId: character.id,
    name: character.name,
    profession: character.profession,
    visual: character.visual,
    avatar: character.avatar,
    idleStrip: character.idleStrip,
    idleFrames: character.idleFrames,
    attackStrip: character.attackStrip,
    attackFrames: character.attackFrames,
    organizationId: organization.id,
    organizationName: organization.name,
    organizationColor: organization.color,
    maxHp: character.maxHp,
    hp: character.maxHp,
    block: 0,
    energy: 3,
    maxEnergy: 3,
    passive: character.passive,
    deck: [...character.deck],
    drawPile: [],
    discardPile: [],
    hand: [],
    attacksPlayed: 0,
    nextAttackBonus: 0,
    deathlineTriggers: 0,
  };
  game.log = [`${character.name}（${character.profession}）接入夜巡频道，挂靠 ${organization.name}。`];
  startCombat(game);
}

export function startCombat(game) {
  const encounter = ENCOUNTERS[(game.floor - 1) % ENCOUNTERS.length];
  game.enemy = {
    ...encounter,
    hp: encounter.maxHp,
    block: 0,
    strength: 0,
    burn: 0,
    moveIndex: 0,
    nextMove: null,
  };
  game.turn = 0;
  game.player.block = 0;
  game.player.energy = game.player.maxEnergy;
  game.player.attacksPlayed = 0;
  game.player.nextAttackBonus = 0;
  game.player.deathlineTriggers = 0;
  game.player.drawPile = shuffle(game, [...game.player.deck]);
  game.player.discardPile = [];
  game.player.hand = [];
  game.rewardChoices = [];
  game.screen = "combat";
  chooseEnemyMove(game);
  startPlayerTurn(game);
  log(game, `第 ${game.floor} 战：${game.enemy.name} 拦路。`);
}

export function playCard(game, handIndex) {
  if (game.screen !== "combat") return;
  const cardId = game.player.hand[handIndex];
  const card = CARD_LIBRARY[cardId];
  if (!card || game.player.energy < card.cost) return;

  game.player.energy -= card.cost;
  game.player.hand.splice(handIndex, 1);
  applyCard(game, card);
  game.player.discardPile.push(cardId);
  log(game, `施展《${card.name}》。`);

  if (game.enemy.hp <= 0) winCombat(game);
}

export function endTurn(game) {
  if (game.screen !== "combat") return;
  discardHand(game);
  triggerEnemyTurnStartPassive(game);
  resolveEnemyTurn(game);

  if (game.player.hp <= 0) {
    game.screen = "defeat";
    log(game, "气海崩散，此行止步。");
    return;
  }

  chooseEnemyMove(game);
  startPlayerTurn(game);
}

export function addRewardCard(game, cardId) {
  if (game.screen !== "reward") return;
  game.player.deck.push(cardId);
  game.floor += 1;
  startCombat(game);
}

export function skipReward(game) {
  if (game.screen !== "reward") return;
  game.floor += 1;
  startCombat(game);
}

function startPlayerTurn(game) {
  game.turn += 1;
  game.player.block = 0;
  game.player.energy = game.player.maxEnergy;
  game.player.deathlineTriggers = 0;
  drawCards(game, 5);
  applyBurnTick(game, game.enemy);
}

function applyCard(game, card) {
  if (card.damage) {
    let bonus = 0;
    if (card.type === "attack" && game.player.passive.id === "ji_chen" && game.player.attacksPlayed > 0 && game.player.attacksPlayed % 3 === 0) {
      bonus = 2;
      log(game, "积尘：尘埃凝聚，本击 +2。");
    }
    dealDamage(game, game.enemy, card.damage + bonus);
  }
  if (card.type === "attack") game.player.attacksPlayed += 1;
  if (card.block) gainBlock(game, card.block);
  if (card.burn) {
    game.enemy.burn += card.burn;
    log(game, `${game.enemy.name} 身上留下 ${card.burn} 层灼痕。`);
  }
  if (card.draw) drawCards(game, card.draw);
  if (card.heal) heal(game, card.heal);
}

function triggerEnemyTurnStartPassive(game) {
  if (game.player.passive.id === "re_sou" && game.enemy.burn > 0) {
    game.enemy.burn += 1;
    log(game, `热搜：${game.enemy.name} 灼痕 +1。`);
  }
}

function resolveEnemyTurn(game) {
  const enemy = game.enemy;
  const move = enemy.nextMove;
  enemy.block = 0;

  if (move.intent === "attack") dealPlayerDamage(game, move.amount + enemy.strength);
  if (move.intent === "block") {
    enemy.block += move.amount;
    log(game, `${enemy.name} 凝起 ${move.amount} 点护体。`);
  }
  if (move.intent === "buff") {
    enemy.strength += move.amount;
    log(game, `${enemy.name} 攻势上涨 +${move.amount}。`);
  }
}

function winCombat(game) {
  game.enemy.hp = 0;
  log(game, `${game.enemy.name} 败退。`);

  if (game.floor >= ACT_LENGTH) {
    game.screen = "complete";
    game.rewardChoices = [];
    log(game, "第一段夜巡完成。");
    return;
  }

  game.screen = "reward";
  game.rewardChoices = pickRewards(game, 3);
  log(game, "截获一枚法诀芯片。");
}

function chooseEnemyMove(game) {
  const enemy = game.enemy;
  enemy.nextMove = enemy.moves[enemy.moveIndex % enemy.moves.length];
  enemy.moveIndex += 1;
}

function dealDamage(game, target, amount) {
  const blocked = Math.min(target.block, amount);
  target.block -= blocked;
  target.hp -= amount - blocked;
  log(game, `${target.name} 受 ${amount - blocked} 点伤害。`);
}

function dealPlayerDamage(game, amount) {
  const blocked = Math.min(game.player.block, amount);
  game.player.block -= blocked;
  const taken = amount - blocked;
  game.player.hp -= taken;
  log(game, `${game.enemy.name} 造成 ${taken} 点伤害。`);
  if (taken > 0 && game.player.passive.id === "si_xian" && game.player.deathlineTriggers < 3) {
    game.player.block += 1;
    game.player.deathlineTriggers += 1;
    log(game, "死线：身体先于脑子反应，护体 +1。");
  }
}

function gainBlock(game, amount) {
  game.player.block += amount;
  log(game, `护体 +${amount}。`);
}

function heal(game, amount) {
  game.player.hp = Math.min(game.player.maxHp, game.player.hp + amount);
  log(game, `气血回复 ${amount}。`);
}

function applyBurnTick(game, target) {
  if (target.burn <= 0) return;
  target.hp -= target.burn;
  log(game, `${target.name} 灼痕发作，受 ${target.burn} 点伤害。`);
  target.burn = Math.max(0, target.burn - 1);
  if (target.hp <= 0) winCombat(game);
}

export function drawCards(game, count) {
  for (let i = 0; i < count; i += 1) {
    if (game.player.drawPile.length === 0) {
      if (game.player.discardPile.length === 0) return;
      game.player.drawPile = shuffle(game, game.player.discardPile);
      game.player.discardPile = [];
    }
    game.player.hand.push(game.player.drawPile.pop());
  }
}

function discardHand(game) {
  game.player.discardPile.push(...game.player.hand);
  game.player.hand = [];
}

function pickRewards(game, count) {
  const character = CHARACTERS[game.player.characterId];
  const pool = shuffle(game, [...character.rewards]);
  return pool.slice(0, count);
}

function shuffle(game, values) {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random(game) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function random(game) {
  game.rngSeed = (game.rngSeed * 48271) % 2147483647;
  return game.rngSeed / 2147483647;
}

function log(game, message) {
  game.log.unshift(message);
  game.log = game.log.slice(0, 8);
}
