export const GAME_TITLE = "霓墟问道";
export const ACT_LENGTH = 3;

export const KEYWORDS = {
  lingli: { name: "灵能", text: "本回合可用的行动点。每回合开始恢复到上限。" },
  huti: { name: "护体", text: "抵挡即将受到的伤害。玩家护体会在自己的回合开始时清空。" },
  tongxuan: { name: "通玄", text: "职业资源满后进入爆发状态，下一张造成伤害的牌额外 +8。" },
  qingzhuo: { name: "清浊", text: "灵污清洁工的职业资源。清掉污秽，最后化作霓刃剑势。" },
  huifeng: { name: "回锋", text: "偏向连击和抽牌的剑路关键词。" },
  powang: { name: "破网", text: "针对护盾、增益和灵网防御的破坏性剑路。" },
  shouxing: { name: "兽性", text: "社畜兽化路线的职业资源。压力越高，爆发越凶。" },
  chengya: { name: "承压", text: "用护体和资源把压力转化为反击机会。" },
  kuanghua: { name: "狂化", text: "高风险高输出的兽相关键词。" },
  renqi: { name: "人气", text: "灵网主播的职业资源。观众的注目会变成香火神通。" },
  danmu: { name: "弹幕", text: "围绕护体、干扰和控场的灵网关键词。" },
  zhumu: { name: "注目", text: "让敌人暴露在众目之下，转化为灼痕或爆发伤害。" },
};

export const CULTIVATORS = {
  cleaner: {
    id: "cleaner",
    name: "灵污清洁工",
    finalTitle: "霓刃剑仙",
    school: "环卫司外勤",
    mark: "净",
    avatar: "./src/assets/pixel/px-cleaner.png",
    idleStrip: "./src/assets/pixel/px-cleaner-idle-strip.png",
    idleFrames: 4,
    resourceName: "清浊",
    resourceKeyword: "qingzhuo",
    trait: "以清洁刀、灵污罐和霓光飞刃作战。擅长低费连击、破盾和清除污染。",
    maxHp: 70,
    startQi: 1,
    deck: ["sweepCut", "sweepCut", "sweepCut", "filterGuard", "filterGuard", "breath", "recycleEdge", "dustStep"],
    rewards: ["recycleEdge", "neonBackhand", "filterGuard", "dustStep", "cleanBreak"],
    keywords: ["qingzhuo", "huifeng", "powang"],
    stages: ["清洁工", "灵污外勤", "霓刃剑仙"],
  },
  worker: {
    id: "worker",
    name: "社畜",
    finalTitle: "兽相真君",
    school: "天机城庶务楼",
    mark: "兽",
    avatar: "./src/assets/pixel/px-worker.png",
    idleStrip: "./src/assets/pixel/px-worker-idle-strip.png",
    idleFrames: 4,
    resourceName: "兽性",
    resourceKeyword: "shouxing",
    trait: "被工时、丹药和义体压到兽化。擅长承压、反打和狂化爆发。",
    maxHp: 78,
    startQi: 0,
    deck: ["overtimeClaw", "overtimeClaw", "overtimeClaw", "deadlineGuard", "deadlineGuard", "breath", "boneGrowth", "lastTrain"],
    rewards: ["boneGrowth", "overtimeClaw", "deadlineGuard", "rageCommute", "beastShift"],
    keywords: ["shouxing", "chengya", "kuanghua"],
    stages: ["社畜", "兽化外勤", "兽相真君"],
  },
  streamer: {
    id: "streamer",
    name: "灵网主播",
    finalTitle: "香火神女",
    school: "万象直播台",
    mark: "愿",
    avatar: "./src/assets/pixel/px-streamer.png",
    idleStrip: "./src/assets/pixel/px-streamer-idle-strip.png",
    idleFrames: 4,
    resourceName: "人气",
    resourceKeyword: "renqi",
    trait: "把弹幕、打赏和注目修成香火神通。擅长控场、护体和热度爆发。",
    maxHp: 64,
    startQi: 0,
    deck: ["goLive", "goLive", "goLive", "bulletGuard", "bulletGuard", "breath", "hotSearch", "spotlightStep"],
    rewards: ["hotSearch", "bulletGuard", "fanMirror", "goLive", "crowdFocus"],
    keywords: ["renqi", "danmu", "zhumu"],
    stages: ["灵网主播", "香火网红", "香火神女"],
  },
};

export const CARD_LIBRARY = {
  sweepCut: card("sweepCut", "扫尘斩", "attack", "清洁刀", 1, ["qingzhuo"], "造成 7 点伤害，获得 1 点清浊。", (game, target) => {
    dealDamage(game, target, 7);
    gainClassResource(game, 1);
  }),
  recycleEdge: card("recycleEdge", "回收刃", "attack", "霓刃", 1, ["huifeng"], "造成 4 点伤害，抽 1 张牌。", (game, target) => {
    dealDamage(game, target, 4);
    drawCards(game, 1);
  }),
  neonBackhand: card("neonBackhand", "霓刃回锋", "attack", "剑势", 1, ["huifeng", "qingzhuo"], "造成 5 点伤害，获得 1 点清浊。", (game, target) => {
    dealDamage(game, target, 5);
    gainClassResource(game, 1);
  }),
  cleanBreak: card("cleanBreak", "破网清算", "attack", "清障", 2, ["powang"], "造成 13 点伤害。", (game, target) => {
    dealDamage(game, target, 13);
  }),
  filterGuard: card("filterGuard", "滤阵护身", "skill", "护体", 1, ["huti"], "获得 7 点护体。", (game) => gainBlock(game, 7)),
  dustStep: card("dustStep", "尘步", "skill", "身法", 0, ["huti"], "获得 3 点护体。", (game) => gainBlock(game, 3)),

  overtimeClaw: card("overtimeClaw", "加班爪击", "attack", "兽化", 1, ["shouxing"], "造成 6 点伤害，获得 1 点兽性。", (game, target) => {
    dealDamage(game, target, 6);
    gainClassResource(game, 1);
  }),
  deadlineGuard: card("deadlineGuard", "死线硬撑", "skill", "承压", 1, ["chengya", "huti"], "获得 8 点护体。", (game) => gainBlock(game, 8)),
  boneGrowth: card("boneGrowth", "兽骨增生", "skill", "异变", 1, ["shouxing", "huti"], "获得 5 点护体，获得 1 点兽性。", (game) => {
    gainBlock(game, 5);
    gainClassResource(game, 1);
  }),
  rageCommute: card("rageCommute", "通勤怒火", "attack", "狂化", 1, ["kuanghua"], "造成 5 点伤害，附加 2 层灼痕。", (game, target) => {
    dealDamage(game, target, 5);
    target.burn += 2;
    log(game, `${target.name} 身上留下 2 层灼痕。`);
  }),
  beastShift: card("beastShift", "兽相显形", "attack", "终局", 2, ["shouxing"], "造成 12 点伤害，回复 3 点气血。", (game, target) => {
    dealDamage(game, target, 12);
    heal(game, 3);
  }),
  lastTrain: card("lastTrain", "末班奔袭", "skill", "身法", 0, ["shouxing"], "获得 2 点兽性。", (game) => gainClassResource(game, 2)),

  goLive: card("goLive", "开播", "attack", "香火", 1, ["renqi"], "造成 5 点伤害，获得 1 点人气。", (game, target) => {
    dealDamage(game, target, 5);
    gainClassResource(game, 1);
  }),
  bulletGuard: card("bulletGuard", "弹幕护体", "skill", "弹幕", 1, ["danmu", "huti"], "获得 7 点护体。", (game) => gainBlock(game, 7)),
  hotSearch: card("hotSearch", "热搜符", "attack", "注目", 1, ["zhumu"], "造成 4 点伤害，附加 3 层灼痕。", (game, target) => {
    dealDamage(game, target, 4);
    target.burn += 3;
    log(game, `${target.name} 被推上热搜，留下 3 层灼痕。`);
  }),
  fanMirror: card("fanMirror", "粉丝镜阵", "skill", "香火", 1, ["renqi", "huti"], "获得 4 点护体，抽 1 张牌。", (game) => {
    gainBlock(game, 4);
    drawCards(game, 1);
  }),
  crowdFocus: card("crowdFocus", "万众注目", "attack", "终局", 2, ["zhumu", "renqi"], "造成 10 点伤害，获得 2 点人气。", (game, target) => {
    dealDamage(game, target, 10);
    gainClassResource(game, 2);
  }),
  spotlightStep: card("spotlightStep", "镜头位移", "skill", "身法", 0, ["huti"], "获得 3 点护体。", (game) => gainBlock(game, 3)),

  breath: card("breath", "调息", "skill", "通用", 0, ["lingli"], "获得 2 点职业资源，抽 1 张牌。", (game) => {
    gainClassResource(game, 2);
    drawCards(game, 1);
  }),
};

const ENCOUNTERS = [
  {
    id: "neonHound",
    name: "霓灯犬",
    title: "巷口灵污兽",
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
    id: "ironBoar",
    name: "铁鬃械猪",
    title: "废矿改造妖兽",
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
    id: "alleyRaider",
    name: "黑巷劫修",
    title: "非法法诀芯片贩",
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

function card(id, name, type, kind, cost, keywords, text, play) {
  return { id, name, type, kind, cost, keywords, text, play };
}

export function createGame() {
  return {
    screen: "start",
    previousScreen: "start",
    floor: 1,
    rewardChoices: [],
    player: null,
    enemy: null,
    turn: 0,
    log: ["天机城雨夜开档。"],
    rngSeed: Date.now() % 2147483647,
  };
}

export function restartGame() {
  return createGame();
}

export function showCodex(game) {
  game.previousScreen = game.screen;
  game.screen = "codex";
}

export function closeCodex(game) {
  game.screen = game.previousScreen || "start";
}

export function chooseCultivator(game, cultivatorId) {
  const cultivator = CULTIVATORS[cultivatorId];
  game.floor = 1;
  game.player = {
    cultivator: cultivator.id,
    name: cultivator.name,
    finalTitle: cultivator.finalTitle,
    school: cultivator.school,
    avatar: cultivator.avatar,
    idleStrip: cultivator.idleStrip,
    idleFrames: cultivator.idleFrames,
    resourceName: cultivator.resourceName,
    maxHp: cultivator.maxHp,
    hp: cultivator.maxHp,
    block: 0,
    strength: 0,
    energy: 3,
    maxEnergy: 3,
    qi: cultivator.startQi,
    maxQi: 6,
    transcendent: false,
    deck: [...cultivator.deck],
    drawPile: [],
    discardPile: [],
    hand: [],
  };
  game.log = [`${cultivator.name} 接入夜巡频道。`];
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
  card.play(game, game.enemy);
  game.player.discardPile.push(cardId);
  log(game, `施展「${card.name}」。`);

  if (game.enemy.hp <= 0) winCombat(game);
}

export function endTurn(game) {
  if (game.screen !== "combat") return;
  if (game.player.energy > 0) {
    gainClassResource(game, game.player.energy);
    log(game, `余下灵能化为 ${game.player.energy} 点${game.player.resourceName}。`);
  }
  discardHand(game);
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
  drawCards(game, 5);
  applyBurn(game, game.enemy);
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

function dealDamage(game, target, baseAmount) {
  let amount = Math.max(0, baseAmount + game.player.strength);
  if (game.player.transcendent) {
    amount += 8;
    game.player.transcendent = false;
    log(game, "通玄之势爆发。");
  }
  const blocked = Math.min(target.block, amount);
  target.block -= blocked;
  target.hp -= amount - blocked;
  log(game, `${target.name} 受 ${amount - blocked} 点伤害。`);
}

function dealPlayerDamage(game, amount) {
  const blocked = Math.min(game.player.block, amount);
  game.player.block -= blocked;
  game.player.hp -= amount - blocked;
  log(game, `${game.enemy.name} 造成 ${amount - blocked} 点伤害。`);
}

function gainBlock(game, amount) {
  game.player.block += amount;
  log(game, `护体 +${amount}。`);
}

function heal(game, amount) {
  game.player.hp = Math.min(game.player.maxHp, game.player.hp + amount);
  log(game, `气血回复 ${amount}。`);
}

function gainClassResource(game, amount) {
  if (amount <= 0) return;
  game.player.qi = Math.min(game.player.maxQi, game.player.qi + amount);
  if (game.player.qi >= game.player.maxQi && !game.player.transcendent) {
    game.player.qi = 0;
    game.player.transcendent = true;
    log(game, `${game.player.resourceName}贯通，进入「通玄」。`);
  }
}

function applyBurn(game, target) {
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
  const cultivator = CULTIVATORS[game.player.cultivator];
  const pool = shuffle(game, [...cultivator.rewards]);
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
