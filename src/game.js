export const GAME_TITLE = "山海问道";

export const KEYWORDS = {
  lingli: {
    name: "灵力",
    text: "本回合可用的行动点。打出卡牌会消耗灵力，回合开始恢复到上限。",
  },
  huti: {
    name: "护体",
    text: "抵挡即将受到的伤害。玩家护体会在自己的回合开始时清空。",
  },
  jianyi: {
    name: "剑意",
    text: "剑仙的职业资源。打出剑诀积累剑意，满 6 点进入通玄，下一张攻击额外造成 8 点伤害。",
  },
  yihuo: {
    name: "异火",
    text: "附着在敌人身上的火焰。回合开始造成等同层数的伤害，然后减少 1 层。",
  },
  lianhua: {
    name: "炼化",
    text: "消耗或利用异火，把伤害转化为回复、抽牌或护体等效果。",
  },
  leiyin: {
    name: "雷印",
    text: "玄箓天师的道法标记。满 6 点引动天雷，下一张攻击额外造成 8 点伤害。",
  },
  zhenyao: {
    name: "镇妖",
    text: "降低敌人的下一次攻势，或让敌人在带有负面状态时承受额外效果。",
  },
  tongxuan: {
    name: "通玄",
    text: "职业资源满后获得的爆发状态。下一张攻击牌得到额外效果，触发后消失。",
  },
  poshi: {
    name: "破势",
    text: "攻击更擅长穿透防守。MVP 中表现为额外伤害或对有护体目标更强。",
  },
};

export const CULTIVATORS = {
  sword: {
    id: "sword",
    name: "剑仙",
    school: "凌霄剑宗",
    mark: "剑",
    resourceName: "剑意",
    resourceKeyword: "jianyi",
    trait: "轻灵、连招、爆发。以剑意蓄势，通玄后下一击斩开敌势。",
    maxHp: 68,
    startQi: 1,
    deck: ["windSlash", "windSlash", "windSlash", "cloudGuard", "cloudGuard", "breath", "swordSpark", "inkStep"],
    keywords: ["jianyi", "tongxuan", "poshi"],
    stages: ["剑徒", "剑客", "剑师"],
    routes: [
      { name: "仙剑师", alignment: "正路", text: "御剑凌空，剑意更容易转化为多段攻击。" },
      { name: "邪剑客", alignment: "邪路", text: "以气血换伤害，剑招更凶，防守更薄。" },
      { name: "剑二十一", alignment: "隐藏", text: "追求极限剑境，围绕二十一式连斩构筑。" },
    ],
  },
  alchemist: {
    id: "alchemist",
    name: "异火丹师",
    school: "焚鼎丹宗",
    mark: "丹",
    resourceName: "火候",
    resourceKeyword: "yihuo",
    trait: "慢热、炼化、续航。用异火灼烧敌人，再把火候炼成生机。",
    maxHp: 62,
    startQi: 0,
    deck: ["windSlash", "windSlash", "cloudGuard", "cloudGuard", "fireTalisman", "fireTalisman", "breath", "inkStep"],
    keywords: ["yihuo", "lianhua", "huti"],
    stages: ["采药童子", "丹房弟子", "异火丹师"],
    routes: [
      { name: "丹道真人", alignment: "正路", text: "丹药、护体、回复更稳定，适合长线战斗。" },
      { name: "毒火药师", alignment: "邪路", text: "异火与丹毒叠得更快，牺牲回复换压制。" },
      { name: "九转炉主", alignment: "隐藏", text: "围绕九转火候构筑，爆发前需要精密铺垫。" },
    ],
  },
  daoshi: {
    id: "daoshi",
    name: "玄箓天师",
    school: "上清玄箓观",
    mark: "箓",
    resourceName: "雷印",
    resourceKeyword: "leiyin",
    trait: "符箓、雷法、镇妖。布下雷印与符镇，等敌人露出破绽后引雷。",
    maxHp: 72,
    startQi: 0,
    deck: ["windSlash", "windSlash", "cloudGuard", "cloudGuard", "thunderSeal", "stillWater", "breath", "meridianPalm"],
    keywords: ["leiyin", "zhenyao", "huti"],
    stages: ["道童", "箓生", "玄箓天师"],
    routes: [
      { name: "清微法师", alignment: "正路", text: "符镇与护体更强，善于拆解敌人意图。" },
      { name: "役鬼道人", alignment: "邪路", text: "借阴煞役使妖鬼，换取更强的延迟伤害。" },
      { name: "雷部敕使", alignment: "隐藏", text: "雷印达到极致，连锁落雷成为核心构筑。" },
    ],
  },
};

export const CARD_LIBRARY = {
  windSlash: {
    id: "windSlash",
    name: "斩风",
    type: "attack",
    kind: "剑诀",
    cost: 1,
    keywords: ["jianyi"],
    text: "造成 7 点伤害。若有 3 点职业资源，额外造成 3 点。",
    play(game, target) {
      const bonus = game.player.qi >= 3 ? 3 : 0;
      dealDamage(game, target, 7 + bonus);
      gainClassResource(game, game.player.cultivator === "sword" ? 1 : 0);
    },
  },
  cloudGuard: {
    id: "cloudGuard",
    name: "云身",
    type: "skill",
    kind: "身法",
    cost: 1,
    keywords: ["huti"],
    text: "获得 6 点护体。",
    play(game) {
      gainBlock(game, 6);
    },
  },
  breath: {
    id: "breath",
    name: "吐纳",
    type: "skill",
    kind: "心法",
    cost: 0,
    keywords: ["lingli"],
    text: "获得 2 点职业资源，抽 1 张牌。",
    play(game) {
      gainClassResource(game, 2);
      drawCards(game, 1);
    },
  },
  inkStep: {
    id: "inkStep",
    name: "墨影步",
    type: "skill",
    kind: "轻功",
    cost: 0,
    keywords: ["huti"],
    text: "获得 3 点护体。若职业资源为 0，改为获得 5 点护体。",
    play(game) {
      gainBlock(game, game.player.qi === 0 ? 5 : 3);
    },
  },
  swordSpark: {
    id: "swordSpark",
    name: "剑芒",
    type: "attack",
    kind: "剑诀",
    cost: 1,
    keywords: ["jianyi", "tongxuan"],
    text: "造成 4 点伤害，获得 1 点剑意。",
    play(game, target) {
      dealDamage(game, target, 4);
      gainClassResource(game, 1);
    },
  },
  fireTalisman: {
    id: "fireTalisman",
    name: "离火符",
    type: "attack",
    kind: "符箓",
    cost: 1,
    keywords: ["yihuo"],
    text: "造成 4 点伤害，附加 3 层异火。异火丹师额外 +1 层。",
    play(game, target) {
      dealDamage(game, target, 4);
      target.burn += game.player.cultivator === "alchemist" ? 4 : 3;
      gainClassResource(game, game.player.cultivator === "alchemist" ? 1 : 0);
      log(game, `${target.name} 身上燃起异火。`);
    },
  },
  meridianPalm: {
    id: "meridianPalm",
    name: "归元掌",
    type: "attack",
    kind: "掌法",
    cost: 2,
    keywords: ["lianhua"],
    text: "造成 13 点伤害，消耗 2 点职业资源回复 3 点气血。",
    play(game, target) {
      dealDamage(game, target, 13);
      if (spendClassResource(game, 2)) heal(game, 3);
    },
  },
  stillWater: {
    id: "stillWater",
    name: "止水诀",
    type: "skill",
    kind: "心法",
    cost: 1,
    keywords: ["huti", "zhenyao"],
    text: "获得 8 点护体。若没有手牌，获得 2 点职业资源。",
    play(game) {
      gainBlock(game, 8);
      if (game.player.hand.length === 0) gainClassResource(game, 2);
    },
  },
  thunderSeal: {
    id: "thunderSeal",
    name: "惊雷印",
    type: "attack",
    kind: "法印",
    cost: 2,
    keywords: ["leiyin", "tongxuan"],
    text: "造成 10 点伤害。若处于通玄，重复一次。",
    play(game, target) {
      const repeat = game.player.transcendent;
      dealDamage(game, target, 10);
      if (repeat) dealDamage(game, target, 10);
      gainClassResource(game, game.player.cultivator === "daoshi" ? 2 : 0);
    },
  },
};

const ENCOUNTERS = [
  {
    id: "wolf",
    name: "灰背小狼",
    title: "林间幼兽",
    art: "./src/assets/enemy-wolf.svg",
    maxHp: 30,
    moves: [
      { intent: "attack", amount: 6, label: "撕咬" },
      { intent: "attack", amount: 5, label: "连扑" },
      { intent: "buff", amount: 2, label: "嗥叫" },
    ],
  },
  {
    id: "boar",
    name: "裂牙野猪",
    title: "山道蛮兽",
    art: "./src/assets/enemy-boar.svg",
    maxHp: 44,
    moves: [
      { intent: "block", amount: 8, label: "拱地" },
      { intent: "attack", amount: 13, label: "冲撞" },
      { intent: "attack", amount: 8, label: "獠牙" },
    ],
  },
  {
    id: "bandit",
    name: "黑巾强盗",
    title: "劫道刀客",
    art: "./src/assets/enemy-bandit.svg",
    maxHp: 52,
    moves: [
      { intent: "attack", amount: 8, label: "劈砍" },
      { intent: "block", amount: 7, label: "架刀" },
      { intent: "buff", amount: 3, label: "叫阵" },
      { intent: "attack", amount: 12, label: "横斩" },
    ],
  },
];

const REWARDS = ["swordSpark", "fireTalisman", "meridianPalm", "stillWater", "thunderSeal", "inkStep"];

export function createGame() {
  return {
    screen: "start",
    floor: 1,
    rewardChoices: [],
    player: null,
    enemy: null,
    turn: 0,
    log: ["山门外风声渐起。"],
    rngSeed: Date.now() % 2147483647,
  };
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
    school: cultivator.school,
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
  game.log = [`${cultivator.name} 入山问道。`];
  startCombat(game);
}

export function startCombat(game) {
  const encounter = ENCOUNTERS[(game.floor - 1) % ENCOUNTERS.length];
  game.enemy = {
    ...encounter,
    maxHp: encounter.maxHp + Math.floor((game.floor - 1) * 6),
    hp: encounter.maxHp + Math.floor((game.floor - 1) * 6),
    block: 0,
    strength: Math.floor((game.floor - 1) / 2),
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
    log(game, `余下灵力化为 ${game.player.energy} 点${game.player.resourceName}。`);
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

export function restartGame() {
  return createGame();
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
  game.screen = "reward";
  game.enemy.hp = 0;
  game.rewardChoices = pickRewards(game, 3);
  log(game, `${game.enemy.name} 败退，留下一缕机缘。`);
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

function spendClassResource(game, amount) {
  if (game.player.qi < amount) return false;
  game.player.qi -= amount;
  return true;
}

function applyBurn(game, target) {
  if (target.burn <= 0) return;
  target.hp -= target.burn;
  log(game, `${target.name} 异火发作，受 ${target.burn} 点伤害。`);
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
  const pool = shuffle(game, [...REWARDS]);
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
