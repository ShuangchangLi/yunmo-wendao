export const GAME_TITLE = "赛博长生";
export const GAME_SUBTITLE = "打工修仙录";
export const GAME_TAGLINE = "在 5G 信号最差的天台上，练第一缕灵气。";
export const ACT_LENGTH = 6;

export const CHAPTER = {
  id: "chapter_1_cleaner",
  name: "第一章：天机城夜巡",
  tagline: "清洁外包、学院道统、夜市黑帮同时争夺灵网下水道。今晚，拖把就是剑。",
};

export const KEYWORDS = {
  energy: { name: "能量", text: "本回合可用的行动点。每回合开始恢复到上限。" },
  block: { name: "护体", text: "抵挡即将受到的伤害。玩家护体在自己的回合开始时清空。" },
  burn: { name: "灼痕", text: "持续伤害。回合开始时受到等同层数的伤害，然后层数 -1。" },
  draw: { name: "抽牌", text: "从牌堆抽指定数量的牌。" },
  dust: { name: "灵污", text: "附着在敌人身上的污染。部分清洁工卡牌会引爆或消耗灵污。" },
  purge: { name: "净除", text: "消耗敌人的灵污，转化为伤害、护体或额外收益。" },
  physical: { name: "物理", text: "由拖把、管钳、清洁杆等实体武器造成的伤害。" },
};

export const CHARACTERS = {
  zhou: {
    id: "zhou",
    name: "老周",
    profession: "清洁工",
    visual: "cleaner",
    avatar: "./src/assets/portraits/cleaner-headshot.png",
    referenceArt: "./src/assets/portraits/cleaner-base.png",
    organizationArt: "./src/assets/portraits/cleaner-base.png",
    selectArt: "./src/assets/portraits/cleaner-scene-highres.png",
    selectPortrait: "./src/assets/portraits/cleaner-headshot.png",
    idleStrip: "./src/assets/rd/cleaner-combat-idle-strip.png",
    idleFrames: 8,
    attackStrip: "./src/assets/rd/cleaner-mop-attack-strip.png",
    attackFrames: 8,
    maxHp: 78,
    passive: {
      id: "ji_chen",
      name: "积尘",
      text: "每打出 3 张攻击牌，下一张攻击 +2 伤害。清洁工路线会逐步把灵污变成资源。",
    },
    tagline: "拿过千斤拖把，也拿得起霓虹雨里的第一口气。",
    deck: [
      "sweep_cut", "sweep_cut", "sweep_cut",
      "filter_guard", "filter_guard",
      "recycle_edge",
      "dust_step",
      "breath",
    ],
    rewards: [
      "sweep_cut", "filter_guard", "recycle_edge", "dust_step", "pressure_wash",
      "hazmat_seal", "recycle_protocol", "clean_break", "mop_sword_style",
      "deep_cleanse", "shift_order", "breath",
    ],
    ranks: ["清洁工", "灵污清洁工", "外勤净垢师", "玄管巡净师"],
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
    shortName: "公司",
    color: "#55f7ff",
    rivals: ["academy", "gang"],
    tagline: "亚洲最大的灵网基础设施商。机会都摆在那里，代价也一样。",
    motto: "网在你身上，门在我手里",
    perkName: "工牌通行",
    perkText: "每场战斗第一回合 +1 能量。击败夜市单位时额外获得 1 战利品。",
    art: "./src/assets/orgs/org-corp.png",
  },
  academy: {
    id: "academy",
    name: "太上学院",
    shortName: "学院",
    color: "#ffe36f",
    rivals: ["corp", "gang"],
    tagline: "最后一个有合法师承的地方。从前学剑，现在学气脉编程。",
    motto: "传承可编译，剑意能开源",
    perkName: "符箓备案",
    perkText: "每场战斗开始获得 3 点护体。奖励牌中更容易看到技能牌。",
    art: "./src/assets/orgs/org-academy.png",
  },
  gang: {
    id: "gang",
    name: "夜行市",
    shortName: "黑帮",
    color: "#ff53d5",
    rivals: ["corp", "academy"],
    tagline: "黑市芯片、违规律咒、明天的房租。",
    motto: "天亮之前办完三件事",
    perkName: "夜市分账",
    perkText: "每场胜利后回复 3 点气血。奖励更偏向攻击牌。",
    art: "./src/assets/orgs/org-gang.png",
  },
};

export const ASCENSIONS = {
  route_field_cleaner: {
    id: "route_field_cleaner",
    tier: 1,
    name: "灵污清洁工",
    route: "正路",
    text: "气血上限 +6，回复 6 点气血，获得《高压冲洗》。",
    apply(game) {
      game.player.maxHp += 6;
      heal(game, 6);
      game.player.deck.push("pressure_wash");
      setRank(game, 1);
    },
  },
  route_recycle_broker: {
    id: "route_recycle_broker",
    tier: 1,
    name: "回收专员",
    route: "旁门",
    text: "每回合多抽 1 张牌，获得《回收协议》。",
    apply(game) {
      game.player.bonuses.extraDraw += 1;
      game.player.deck.push("recycle_protocol");
      setRank(game, 1);
    },
  },
  route_hazmat_handler: {
    id: "route_hazmat_handler",
    tier: 1,
    name: "危废处理员",
    route: "险路",
    text: "攻击牌额外附加 1 层灵污，获得《危废封条》。",
    apply(game) {
      game.player.bonuses.attackDust += 1;
      game.player.deck.push("hazmat_seal");
      setRank(game, 1);
    },
  },
  route_mop_sword: {
    id: "route_mop_sword",
    tier: 2,
    name: "拖把剑术",
    route: "正路",
    text: "物理伤害 +2，获得《拖把剑式》。",
    apply(game) {
      game.player.bonuses.physicalDamage += 2;
      game.player.deck.push("mop_sword_style");
      setRank(game, 2);
    },
  },
  route_purifier: {
    id: "route_purifier",
    tier: 2,
    name: "净垢外勤",
    route: "正路",
    text: "能量上限 +1，获得《深度净除》。",
    apply(game) {
      game.player.maxEnergy += 1;
      game.player.deck.push("deep_cleanse");
      setRank(game, 2);
    },
  },
  route_foreman: {
    id: "route_foreman",
    tier: 2,
    name: "夜班领工",
    route: "隐路",
    text: "每场战斗开始获得 6 点护体，获得《排班指令》。",
    apply(game) {
      game.player.bonuses.startBlock += 6;
      game.player.deck.push("shift_order");
      setRank(game, 2);
    },
  },
};

export const CARD_LIBRARY = {
  sweep_cut: cardData("sweep_cut", "扫", "attack", 1, { damage: 6, damageType: "physical" }, "造成 6 点物理伤害。", "zhou", {
    icon: "./src/assets/cards/card-cleaner-sweep-px.png",
    fullArt: "./src/assets/cards/card-cleaner-sweep-composed.png",
    tags: ["体术", "物理"],
    vfx: { kind: "mop-arc", label: "清扫", description: "拖把扫出宽弧水光。", stance: "attack", pitch: 392 },
  }),
  filter_guard: cardData("filter_guard", "格挡", "skill", 1, { block: 6 }, "获得 6 点护体。", "zhou", {
    icon: "./src/assets/cards/card-cleaner-block-px.png",
    fullArt: "./src/assets/cards/card-cleaner-block-composed.png",
    tags: ["体术"],
    vfx: { kind: "shield-ring", label: "固体术", description: "拖把横架，护体屏障弹开伤害。", stance: "guard", pitch: 262 },
  }),
  recycle_edge: cardData("recycle_edge", "回收刃", "attack", 1, { damage: 4, draw: 1, dust: 1, damageType: "physical" }, "造成 4 点物理伤害，抽 1 张牌，附加 1 层灵污。", "zhou", {
    tags: ["体术", "回收"],
    vfx: { kind: "recycle-blade", label: "回收刃", description: "废铁碎片旋成回旋刃。", stance: "attack", pitch: 466 },
  }),
  neon_backhand: cardData("neon_backhand", "霓刃回铲", "attack", 1, { damage: 5, block: 3, damageType: "physical" }, "造成 5 点物理伤害，获得 3 点护体。", "zhou", {
    tags: ["体术"],
    vfx: { kind: "mop-arc", label: "霓刃回铲", description: "反手铲出短促霓光。", stance: "attack", pitch: 415 },
  }),
  dust_step: cardData("dust_step", "尘步", "skill", 0, { block: 3, draw: 1 }, "获得 3 点护体，抽 1 张牌。", "zhou", {
    tags: ["身法"],
    vfx: { kind: "dust-step", label: "尘步", description: "脚下残影一闪，避入雨雾。", stance: "guard", pitch: 330 },
  }),
  pressure_wash: cardData("pressure_wash", "高压冲洗", "attack", 1, { damage: 5, dust: 2, damageType: "physical" }, "造成 5 点物理伤害，附加 2 层灵污。", "zhou", {
    tags: ["体术", "灵污"],
    vfx: { kind: "pressure-wash", label: "高压冲洗", description: "压缩水柱贯穿战场。", stance: "attack", pitch: 523 },
  }),
  hazmat_seal: cardData("hazmat_seal", "危废封条", "skill", 1, { block: 5, dust: 2 }, "获得 5 点护体，附加 2 层灵污。", "zhou", {
    tags: ["符箓", "灵污"],
    vfx: { kind: "hazmat-seal", label: "危废封条", description: "黄黑封条贴住污染源。", stance: "guard", pitch: 294 },
  }),
  recycle_protocol: cardData("recycle_protocol", "回收协议", "skill", 1, { draw: 2, block: 2 }, "抽 2 张牌，获得 2 点护体。", "zhou", {
    tags: ["回收"],
    vfx: { kind: "recycle-protocol", label: "回收协议", description: "回收格栅展开，牌流回收。", stance: "guard", pitch: 349 },
  }),
  clean_break: cardData("clean_break", "破网清算", "attack", 2, { damage: 13, consumeDust: 1, damageType: "physical" }, "造成 13 点物理伤害。每消耗 1 层灵污，额外 +1 伤害。", "zhou", {
    tags: ["体术", "净除"],
    vfx: { kind: "clean-break", label: "破网清算", description: "拖把剑路切断灵网账本。", stance: "attack", pitch: 587 },
  }),
  mop_sword_style: cardData("mop_sword_style", "拖把剑式", "attack", 1, { damage: 8, block: 2, damageType: "physical" }, "造成 8 点物理伤害，获得 2 点护体。", "zhou", {
    tags: ["体术", "武器"],
    vfx: { kind: "mop-sword", label: "拖把剑式", description: "拖把当剑，斩出两段青光。", stance: "attack", pitch: 440 },
  }),
  deep_cleanse: cardData("deep_cleanse", "深度净除", "skill", 2, { purgeDamage: 2, block: 8 }, "获得 8 点护体。消耗全部灵污，每层造成 2 点伤害。", "zhou", {
    tags: ["净除"],
    vfx: { kind: "talisman-purge", label: "净化符", description: "绿色净化符印压碎紫色污染。", stance: "guard", pitch: 659 },
  }),
  shift_order: cardData("shift_order", "排班指令", "skill", 0, { energyGain: 1, draw: 1 }, "获得 1 点能量，抽 1 张牌。", "zhou", {
    tags: ["能力"],
    vfx: { kind: "command-grid", label: "排班指令", description: "工牌终端弹出排班格。", stance: "guard", pitch: 392 },
  }),

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

  breath: cardData("breath", "调息", "skill", 0, { draw: 2 }, "抽 2 张牌。", "common", { tags: ["通用"] }),
};

const ENCOUNTER_LIBRARY = {
  corp_hound: enemy("corp_hound", "安保灵犬", "天机科技巡逻单元", "corp", "normal", 36, "./src/assets/pixel/px-enemy-neon-hound.png", "./src/assets/pixel/px-enemy-neon-hound-idle-strip.png", 8, [
    { intent: "attack", amount: 6, label: "咬合扫描" },
    { intent: "attack", amount: 5, hits: 2, label: "双相扑击" },
    { intent: "buff", amount: 2, label: "嗅血增压" },
  ]),
  corp_boar: enemy("corp_boar", "铁髓保洁机", "天机科技废料处理机", "corp", "elite", 58, "./src/assets/pixel/px-enemy-iron-boar.png", null, 1, [
    { intent: "block", amount: 10, label: "合金外壳" },
    { intent: "attack", amount: 15, label: "液压冲撞" },
    { intent: "debuff", amount: 2, label: "污水回灌" },
  ]),
  corp_boss: enemy("corp_boss", "合规巡净官", "天机科技外包审计", "corp", "boss", 86, "./src/assets/generated/unit-iron-boar.png", null, 1, [
    { intent: "attack", amount: 10, label: "审计电棍" },
    { intent: "block", amount: 12, label: "合同护盾" },
    { intent: "attack", amount: 7, hits: 2, label: "绩效清算" },
    { intent: "buff", amount: 3, label: "权限升级" },
  ]),
  academy_sword: enemy("academy_sword", "学院执剑生", "太上学院试炼外勤", "academy", "normal", 40, "./src/assets/pixel/px-enemy-alley-raider.png", "./src/assets/pixel/px-enemy-alley-raider-idle-strip.png", 4, [
    { intent: "attack", amount: 7, label: "符剑点穴" },
    { intent: "block", amount: 8, label: "护身符箓" },
    { intent: "attack", amount: 11, label: "剑意编译" },
  ]),
  academy_talisman: enemy("academy_talisman", "符网讲师", "太上学院违规授课", "academy", "elite", 64, "./src/assets/generated/unit-worker.png", null, 1, [
    { intent: "debuff", amount: 3, label: "灵污标记" },
    { intent: "block", amount: 12, label: "讲义结界" },
    { intent: "attack", amount: 14, label: "板书雷光" },
  ]),
  academy_boss: enemy("academy_boss", "外门监察", "太上学院执法席", "academy", "boss", 88, "./src/assets/generated/unit-alley-raider.png", null, 1, [
    { intent: "block", amount: 14, label: "师承护法" },
    { intent: "attack", amount: 8, hits: 2, label: "双诀连斩" },
    { intent: "buff", amount: 3, label: "开坛" },
    { intent: "attack", amount: 18, label: "问心剑" },
  ]),
  gang_runner: enemy("gang_runner", "夜市催债员", "夜行市低阶打手", "gang", "normal", 38, "./src/assets/pixel/px-enemy-alley-raider.png", "./src/assets/pixel/px-enemy-alley-raider-idle-strip.png", 4, [
    { intent: "attack", amount: 8, label: "砸摊" },
    { intent: "debuff", amount: 2, label: "泼脏水" },
    { intent: "block", amount: 6, label: "人群掩护" },
  ]),
  gang_smuggler: enemy("gang_smuggler", "芯片走私客", "夜行市违规律咒贩", "gang", "elite", 62, "./src/assets/generated/unit-streamer.png", null, 1, [
    { intent: "attack", amount: 6, hits: 2, label: "短刀连划" },
    { intent: "buff", amount: 2, label: "嗑药提频" },
    { intent: "attack", amount: 15, label: "断脉针" },
  ]),
  gang_boss: enemy("gang_boss", "黑市坛主", "夜行市灵网承包人", "gang", "boss", 92, "./src/assets/generated/unit-neon-hound.png", null, 1, [
    { intent: "debuff", amount: 4, label: "账本压身" },
    { intent: "attack", amount: 9, hits: 2, label: "坛口围攻" },
    { intent: "block", amount: 14, label: "香火护账" },
    { intent: "attack", amount: 20, label: "夜市清场" },
  ]),
};

const CHAPTER_PATHS = {
  corp: ["academy_sword", "gang_runner", "academy_talisman", "gang_smuggler", "academy_boss", "gang_boss"],
  academy: ["corp_hound", "gang_runner", "corp_boar", "gang_smuggler", "corp_boss", "gang_boss"],
  gang: ["corp_hound", "academy_sword", "corp_boar", "academy_talisman", "corp_boss", "academy_boss"],
};

function cardData(id, name, type, cost, effects, text, owner, art = {}) {
  const normalizedArt = typeof art === "string" ? { icon: art } : art;
  return {
    id,
    name,
    type,
    cost,
    ...effects,
    text,
    owner,
    icon: normalizedArt.icon || null,
    fullArt: normalizedArt.fullArt || null,
    tags: normalizedArt.tags || [],
    rarity: normalizedArt.rarity || "common",
    vfx: normalizedArt.vfx || defaultCardVfx(type, effects),
  };
}

function defaultCardVfx(type, effects) {
  if (type === "attack") return { kind: "basic-hit", label: "攻击", description: "基础打击。", stance: "attack", pitch: 392 };
  if (effects?.draw) return { kind: "command-grid", label: "抽牌", description: "灵网抽牌。", stance: "guard", pitch: 330 };
  return { kind: "shield-ring", label: "护体", description: "基础护体。", stance: "guard", pitch: 262 };
}

function enemy(id, name, title, faction, type, maxHp, art, idleStrip, idleFrames, moves) {
  return { id, name, title, faction, type, maxHp, art, idleStrip, idleFrames, moves };
}

export function createGame() {
  return {
    screen: "splash",
    previousScreen: "splash",
    floor: 1,
    rewardChoices: [],
    ascensionChoices: [],
    selectionStep: "character",
    pendingCharacter: null,
    pendingOrganization: null,
    player: null,
    enemy: null,
    turn: 0,
    fx: null,
    fxId: 0,
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
    rankName: character.profession,
    rankIndex: 0,
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
    xp: 0,
    credits: 0,
    ascensions: [],
    bonuses: {
      extraDraw: 0,
      physicalDamage: 0,
      attackDust: 0,
      startBlock: 0,
    },
  };
  game.log = [`${character.name}（${character.profession}）接入夜巡频道，挂靠 ${organization.name}。`];
  startCombat(game);
}

export function startCombat(game) {
  const encounter = encounterFor(game);
  game.enemy = {
    ...encounter,
    hp: encounter.maxHp,
    block: 0,
    strength: 0,
    burn: 0,
    dust: 0,
    moveIndex: 0,
    nextMove: null,
  };
  game.turn = 0;
  game.fx = null;
  game.player.block = 0;
  game.player.energy = game.player.maxEnergy;
  game.player.attacksPlayed = 0;
  game.player.nextAttackBonus = 0;
  game.player.deathlineTriggers = 0;
  game.player.drawPile = shuffle(game, [...game.player.deck]);
  game.player.discardPile = [];
  game.player.hand = [];
  game.rewardChoices = [];
  game.ascensionChoices = [];
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
  setFx(game, card.type === "attack" ? "slash" : "guard", "player", card.type === "attack" ? "enemy" : "player", card.id);
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
  log(game, `收录《${CARD_LIBRARY[cardId].name}》。`);
  game.floor += 1;
  startCombat(game);
}

export function skipReward(game) {
  if (game.screen !== "reward") return;
  log(game, "跳过本次芯片奖励。");
  game.floor += 1;
  startCombat(game);
}

export function chooseAscension(game, ascensionId) {
  if (game.screen !== "ascend") return;
  const choice = ASCENSIONS[ascensionId];
  if (!choice) return;
  choice.apply(game);
  game.player.ascensions.push(ascensionId);
  log(game, `岗位晋升：${choice.name}。`);
  game.screen = "reward";
  game.rewardChoices = pickRewards(game, 3);
  log(game, "截获一枚法诏芯片。");
}

function startPlayerTurn(game) {
  game.turn += 1;
  game.player.block = 0;
  game.player.energy = game.player.maxEnergy;
  game.player.deathlineTriggers = 0;
  applyBurnTick(game, game.enemy);
  if (game.screen !== "combat") return;

  if (game.turn === 1) {
    const org = ORGANIZATIONS[game.player.organizationId];
    if (org.id === "corp") {
      game.player.energy += 1;
      log(game, "工牌通行：第一回合能量 +1。");
    }
    if (org.id === "academy") {
      game.player.block += 3;
      log(game, "符箓备案：开场护体 +3。");
    }
    if (game.player.bonuses.startBlock) {
      game.player.block += game.player.bonuses.startBlock;
      log(game, `夜班领工：开场护体 +${game.player.bonuses.startBlock}。`);
    }
  }

  drawCards(game, 5 + game.player.bonuses.extraDraw);
}

function applyCard(game, card) {
  if (card.energyGain) {
    game.player.energy += card.energyGain;
    log(game, `能量 +${card.energyGain}。`);
  }
  if (card.block) gainBlock(game, card.block);
  if (card.dust) addDust(game, card.dust);
  if (card.type === "attack" && game.player.bonuses.attackDust) addDust(game, game.player.bonuses.attackDust);

  if (card.damage) {
    let amount = card.damage;
    if (card.damageType === "physical") amount += game.player.bonuses.physicalDamage;
    if (card.type === "attack" && game.player.passive.id === "ji_chen" && game.player.attacksPlayed > 0 && game.player.attacksPlayed % 3 === 0) {
      amount += 2;
      log(game, "积尘：尘埃凝聚，本击 +2。");
    }
    if (card.consumeDust && game.enemy.dust > 0) {
      const consumed = game.enemy.dust;
      amount += consumed * card.consumeDust;
      game.enemy.dust = 0;
      log(game, `净除：消耗 ${consumed} 层灵污。`);
    }
    dealDamage(game, game.enemy, amount);
  }
  if (card.purgeDamage && game.enemy.dust > 0) {
    const consumed = game.enemy.dust;
    game.enemy.dust = 0;
    dealDamage(game, game.enemy, consumed * card.purgeDamage);
    log(game, `深度净除：灵污转化为 ${consumed * card.purgeDamage} 点伤害。`);
  }
  if (card.type === "attack") game.player.attacksPlayed += 1;
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

  if (move.intent === "attack") {
    const hits = move.hits || 1;
    dealPlayerDamage(game, (move.amount + enemy.strength) * hits);
    setFx(game, "enemy-strike", "enemy", "player", move.label);
  }
  if (move.intent === "block") {
    enemy.block += move.amount;
    setFx(game, "guard", "enemy", "enemy", move.label);
    log(game, `${enemy.name} 凝起 ${move.amount} 点护体。`);
  }
  if (move.intent === "buff") {
    enemy.strength += move.amount;
    setFx(game, "buff", "enemy", "enemy", move.label);
    log(game, `${enemy.name} 攻势上涨 +${move.amount}。`);
  }
  if (move.intent === "debuff") {
    game.enemy.dust += move.amount;
    setFx(game, "corrupt", "enemy", "player", move.label);
    log(game, `${enemy.name} 扬起污尘，灵污 +${move.amount}。`);
  }
}

function winCombat(game) {
  game.enemy.hp = 0;
  game.player.xp += game.enemy.type === "boss" ? 3 : game.enemy.type === "elite" ? 2 : 1;
  game.player.credits += game.enemy.type === "boss" ? 8 : game.enemy.type === "elite" ? 5 : 3;
  log(game, `${game.enemy.name} 败退。`);

  if (game.player.organizationId === "gang") {
    heal(game, 3);
    log(game, "夜市分账：胜利回复 3 点气血。");
  }

  if (game.player.organizationId === "corp" && game.enemy.faction === "gang") {
    game.player.credits += 1;
    log(game, "工牌通行：夜市单位额外掉落 1 战利品。");
  }

  if (game.floor >= ACT_LENGTH) {
    setRank(game, 3);
    game.screen = "complete";
    game.rewardChoices = [];
    log(game, "第一章夜巡完成。");
    return;
  }

  if (game.player.characterId === "zhou" && (game.floor === 2 || game.floor === 4)) {
    game.screen = "ascend";
    game.ascensionChoices = getAscensionChoices(game);
    log(game, "岗位考核通过，选择一条晋升路线。");
    return;
  }

  game.screen = "reward";
  game.rewardChoices = pickRewards(game, 3);
  log(game, "截获一枚法诏芯片。");
}

function chooseEnemyMove(game) {
  const enemy = game.enemy;
  enemy.nextMove = enemy.moves[enemy.moveIndex % enemy.moves.length];
  enemy.moveIndex += 1;
}

function dealDamage(game, target, amount) {
  const blocked = Math.min(target.block, amount);
  target.block -= blocked;
  const taken = amount - blocked;
  target.hp -= taken;
  log(game, `${target.name} 受 ${taken} 点伤害。`);
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

function addDust(game, amount) {
  game.enemy.dust += amount;
  log(game, `${game.enemy.name} 灵污 +${amount}。`);
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
  let pool = [...character.rewards];
  const org = ORGANIZATIONS[game.player.organizationId];
  if (org.id === "academy") pool = pool.filter((id) => CARD_LIBRARY[id].type === "skill").concat(pool);
  if (org.id === "gang") pool = pool.filter((id) => CARD_LIBRARY[id].type === "attack").concat(pool);
  if (org.id === "corp") pool = pool.concat(["recycle_protocol", "shift_order"]);
  const shuffled = shuffle(game, pool);
  return [...new Set(shuffled)].slice(0, count);
}

function getAscensionChoices(game) {
  const tier = game.player.ascensions.length === 0 ? 1 : 2;
  return Object.values(ASCENSIONS).filter((choice) => choice.tier === tier).map((choice) => choice.id);
}

function encounterFor(game) {
  const path = CHAPTER_PATHS[game.player.organizationId] || CHAPTER_PATHS.corp;
  const id = path[Math.max(0, Math.min(path.length - 1, game.floor - 1))];
  return ENCOUNTER_LIBRARY[id];
}

function setRank(game, rankIndex) {
  const character = CHARACTERS[game.player.characterId];
  game.player.rankIndex = Math.max(game.player.rankIndex || 0, rankIndex);
  game.player.rankName = character.ranks?.[game.player.rankIndex] || game.player.profession;
}

function setFx(game, kind, actor, target, source) {
  game.fxId += 1;
  game.fx = { id: game.fxId, kind, actor, target, source };
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
  game.log = game.log.slice(0, 10);
}
