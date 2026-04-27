export const CULTIVATORS = {
  sword: {
    id: "sword",
    name: "青岚剑修",
    school: "凌霄剑宗",
    trait: "每场战斗初始获得 1 真气。真气满 6 点时进入「通玄」，下一张攻击牌额外造成 8 点伤害。",
    maxHp: 68,
    deck: ["windSlash", "windSlash", "windSlash", "cloudGuard", "cloudGuard", "breath", "swordSpark", "inkStep"],
  },
  talisman: {
    id: "talisman",
    name: "赤箓符修",
    school: "玄都符院",
    trait: "燃烧伤害更高，擅长用符箓削弱敌人。",
    maxHp: 62,
    deck: ["windSlash", "windSlash", "cloudGuard", "cloudGuard", "fireTalisman", "fireTalisman", "breath", "inkStep"],
  },
  alchemy: {
    id: "alchemy",
    name: "归元丹修",
    school: "药王谷",
    trait: "防守与调息更强，适合稳扎稳打。",
    maxHp: 74,
    deck: ["windSlash", "windSlash", "cloudGuard", "cloudGuard", "cloudGuard", "breath", "breath", "meridianPalm"],
  },
};

export const CARD_LIBRARY = {
  windSlash: {
    id: "windSlash",
    name: "斩风",
    type: "attack",
    kind: "剑诀",
    cost: 1,
    text: "造成 7 点伤害。若有 3 真气，额外造成 3 点。",
    play(game, target) {
      const bonus = game.player.qi >= 3 ? 3 : 0;
      dealDamage(game, target, 7 + bonus);
    },
  },
  cloudGuard: {
    id: "cloudGuard",
    name: "云身",
    type: "skill",
    kind: "身法",
    cost: 1,
    text: "获得 6 护体。",
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
    text: "获得 2 真气，抽 1 张牌。",
    play(game) {
      gainQi(game, 2);
      drawCards(game, 1);
    },
  },
  inkStep: {
    id: "inkStep",
    name: "墨影步",
    type: "skill",
    kind: "轻功",
    cost: 0,
    text: "获得 3 护体。若真气为 0，改为获得 5 护体。",
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
    text: "造成 4 点伤害，获得 1 真气。",
    play(game, target) {
      dealDamage(game, target, 4);
      gainQi(game, 1);
    },
  },
  fireTalisman: {
    id: "fireTalisman",
    name: "离火符",
    type: "attack",
    kind: "符箓",
    cost: 1,
    text: "造成 4 点伤害，附加 3 焚心。",
    play(game, target) {
      dealDamage(game, target, 4);
      target.burn += game.player.cultivator === "talisman" ? 4 : 3;
      log(game, `${target.name} 心火渐盛。`);
    },
  },
  meridianPalm: {
    id: "meridianPalm",
    name: "归元掌",
    type: "attack",
    kind: "掌法",
    cost: 2,
    text: "造成 13 点伤害，消耗 2 真气回复 3 气血。",
    play(game, target) {
      dealDamage(game, target, 13);
      if (spendQi(game, 2)) heal(game, 3);
    },
  },
  stillWater: {
    id: "stillWater",
    name: "止水诀",
    type: "skill",
    kind: "心法",
    cost: 1,
    text: "获得 8 护体。若没有手牌，获得 2 真气。",
    play(game) {
      gainBlock(game, 8);
      if (game.player.hand.length === 0) gainQi(game, 2);
    },
  },
  thunderSeal: {
    id: "thunderSeal",
    name: "惊雷印",
    type: "attack",
    kind: "法印",
    cost: 2,
    text: "造成 10 点伤害。若处于通玄，重复一次。",
    play(game, target) {
      dealDamage(game, target, 10);
      if (game.player.transcendent) dealDamage(game, target, 10);
    },
  },
};

const ENCOUNTERS = [
  {
    name: "山魈",
    title: "雾岭妖物",
    maxHp: 38,
    moves: [
      { intent: "attack", amount: 7, label: "裂爪" },
      { intent: "block", amount: 7, label: "伏石" },
      { intent: "attack", amount: 10, label: "扑杀" },
    ],
  },
  {
    name: "黑莲散人",
    title: "邪道修士",
    maxHp: 48,
    moves: [
      { intent: "attack", amount: 8, label: "毒掌" },
      { intent: "buff", amount: 2, label: "炼煞" },
      { intent: "attack", amount: 11, label: "黑莲印" },
    ],
  },
  {
    name: "铜甲尸",
    title: "古墓守卫",
    maxHp: 60,
    moves: [
      { intent: "attack", amount: 11, label: "尸臂横扫" },
      { intent: "block", amount: 12, label: "铜皮" },
      { intent: "attack", amount: 15, label: "破门撞" },
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
    log: ["墨雨初歇，山门将开。"],
    rngSeed: Date.now() % 2147483647,
  };
}

export function chooseCultivator(game, cultivatorId) {
  const cultivator = CULTIVATORS[cultivatorId];
  game.floor = 1;
  game.player = {
    cultivator: cultivator.id,
    name: cultivator.name,
    school: cultivator.school,
    maxHp: cultivator.maxHp,
    hp: cultivator.maxHp,
    block: 0,
    strength: 0,
    energy: 3,
    maxEnergy: 3,
    qi: cultivator.id === "sword" ? 1 : 0,
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
    name: encounter.name,
    title: encounter.title,
    maxHp: encounter.maxHp + Math.floor((game.floor - 1) * 9),
    hp: encounter.maxHp + Math.floor((game.floor - 1) * 9),
    block: 0,
    strength: Math.floor((game.floor - 1) / 2),
    burn: 0,
    moves: encounter.moves,
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
  log(game, `第 ${game.floor} 重天：${game.enemy.name} 拦路。`);
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
    gainQi(game, game.player.energy);
    log(game, `余下灵力化为 ${game.player.energy} 点真气。`);
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

  if (move.intent === "attack") {
    dealPlayerDamage(game, move.amount + enemy.strength);
  }
  if (move.intent === "block") {
    enemy.block += move.amount;
    log(game, `${enemy.name} 凝起 ${move.amount} 护体。`);
  }
  if (move.intent === "buff") {
    enemy.strength += move.amount;
    log(game, `${enemy.name} 煞气上涌，攻势 +${move.amount}。`);
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
    log(game, "通玄剑意爆发。");
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
  const bonus = game.player.cultivator === "alchemy" ? 1 : 0;
  game.player.block += amount + bonus;
  log(game, `护体 +${amount + bonus}。`);
}

function heal(game, amount) {
  game.player.hp = Math.min(game.player.maxHp, game.player.hp + amount);
  log(game, `气血回复 ${amount}。`);
}

function gainQi(game, amount) {
  game.player.qi = Math.min(game.player.maxQi, game.player.qi + amount);
  if (game.player.qi >= game.player.maxQi && !game.player.transcendent) {
    game.player.qi = 0;
    game.player.transcendent = true;
    log(game, "真气贯通，进入「通玄」。");
  }
}

function spendQi(game, amount) {
  if (game.player.qi < amount) return false;
  game.player.qi -= amount;
  return true;
}

function applyBurn(game, target) {
  if (target.burn <= 0) return;
  target.hp -= target.burn;
  log(game, `${target.name} 焚心发作，受 ${target.burn} 点伤害。`);
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
  game.log = game.log.slice(0, 6);
}
