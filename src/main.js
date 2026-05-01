import {
  ACT_LENGTH,
  CARD_LIBRARY,
  CHARACTERS,
  ORGANIZATIONS,
  GAME_TITLE,
  GAME_SUBTITLE,
  GAME_TAGLINE,
  KEYWORDS,
  addRewardCard,
  closeCodex,
  confirmSelection,
  createGame,
  endTurn,
  gotoSelect,
  gotoSplash,
  pickPendingCharacter,
  pickPendingOrganization,
  playCard,
  restartGame,
  showCodex,
  skipReward,
} from "./game.js";

const SAVE_KEY = "cyber-longevity-save";
const SPRITE_FRAME_MS = 160;

let game = createGame();
let logOpen = false;
let spriteTimers = [];
const app = document.querySelector("#app");

function render() {
  app.innerHTML = renderScreen();
  bindEvents();
  bindSprites();
}

function bindSprites() {
  spriteTimers.forEach(clearInterval);
  spriteTimers = [];
  app.querySelectorAll("[data-strip]").forEach((el) => {
    const strip = el.dataset.strip;
    const frames = Math.max(1, Number(el.dataset.frames) || 1);
    if (!strip) return;
    el.style.backgroundImage = `url("${strip}")`;
    el.style.backgroundRepeat = "no-repeat";
    el.style.backgroundSize = `${frames * 100}% 100%`;
    el.style.backgroundPosition = "0% 0%";
    if (frames <= 1) return;
    let i = 0;
    const advance = () => {
      i = (i + 1) % frames;
      el.style.backgroundPosition = `${(i / (frames - 1)) * 100}% 0%`;
    };
    spriteTimers.push(setInterval(advance, SPRITE_FRAME_MS));
  });
}

function spriteAttrs(strip, frames, fallback) {
  const useStrip = strip || fallback;
  const count = strip ? Math.max(1, Number(frames) || 1) : 1;
  return ` data-strip="${useStrip}" data-frames="${count}"`;
}

function renderScreen() {
  if (game.screen === "codex") return renderCodex();
  if (game.screen === "splash") return renderSplash();
  if (game.screen === "select") return renderSelect();
  if (game.screen === "defeat") return renderDefeat();
  if (game.screen === "reward") return renderReward();
  if (game.screen === "complete") return renderComplete();
  return renderCombat();
}

function renderSplash() {
  const hasSave = Boolean(loadGame());
  return `
    <section class="splash splash-home" aria-label="${GAME_TITLE} ${GAME_SUBTITLE}">
      <div class="home-bg" aria-hidden="true"></div>

      <aside class="home-panel cultivation-panel" aria-label="修仙进度">
        <div class="meditate-icon">♟</div>
        <div>
          <p>修仙进度</p>
          <strong>炼气三层</strong>
          <span>230/1000</span>
          <div class="progress-dots"><i></i><i></i><i></i><i></i><b></b><b></b><b></b><b></b><b></b><b></b></div>
        </div>
      </aside>

      <aside class="home-panel insight-panel" aria-label="今日悟道">
        <p>今日悟道</p>
        <ul>
          <li><span>灵气 +1</span><em>▲</em></li>
          <li><span>KPI +1</span><em>▲</em></li>
          <li class="bad"><span>寿命 -1</span><em>▼</em></li>
        </ul>
        <div class="signal-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
      </aside>

      <nav class="home-side-nav" aria-label="主页快捷入口">
        <button type="button" data-action="open-codex"><span>⌘</span><em>功法</em></button>
        <button type="button" data-action="open-codex"><span>▣</span><em>卡牌</em></button>
        <button type="button"><span>◇</span><em>道具</em></button>
        <button type="button"><span>⚙</span><em>系统</em></button>
      </nav>

      <div class="home-primary-actions" aria-label="主要操作">
        <button class="home-main-cta" data-action="goto-select">打工修仙录</button>
        <button class="home-continue" data-action="continue" ${hasSave ? "" : "disabled"}>继续存档</button>
      </div>

      <button class="home-vertical-cta" data-action="goto-select" aria-label="加班炼体">加班<br />炼体</button>

      <footer class="home-dock" aria-label="底部菜单">
        <button type="button" data-action="goto-select"><span>⚔</span><em>战斗</em></button>
        <button type="button" data-action="open-codex"><span>▧</span><em>卡牌</em></button>
        <button type="button" data-action="goto-select"><span>♟</span><em>修炼</em></button>
        <button type="button"><span>▤</span><em>商店</em></button>
        <button type="button"><span>▥</span><em>地图</em></button>
        <button type="button"><span>⚙</span><em>设置</em></button>
      </footer>

      <p class="home-player-id">修仙ID：0019527</p>
    </section>
  `;
}

function renderSelect() {
  const character = game.pendingCharacter ? CHARACTERS[game.pendingCharacter] : null;
  const organization = game.pendingOrganization ? ORGANIZATIONS[game.pendingOrganization] : null;
  const ready = Boolean(character && organization);
  return `
    <section class="select">
      <header class="select-head">
        <button class="ghost" data-action="goto-splash">‹ 返回</button>
        <h1>挑一个普通人，挂上一个组织</h1>
        <button class="ghost" data-action="open-codex">天机档案</button>
      </header>

      <section class="select-section">
        <h2>选择你的人物</h2>
        <div class="select-grid characters">
          ${Object.values(CHARACTERS).map((c) => renderCharacterCard(c, c.id === game.pendingCharacter)).join("")}
        </div>
      </section>

      <section class="select-section">
        <h2>选择你隶属的组织</h2>
        <div class="select-grid organizations">
          ${Object.values(ORGANIZATIONS).map((o) => renderOrganizationCard(o, o.id === game.pendingOrganization)).join("")}
        </div>
      </section>

      <footer class="select-foot">
        <p class="select-summary">
          ${character ? `<strong>${character.name}</strong> · ${character.profession}` : "<em>请先选择人物</em>"}
          ${character && organization ? " · " : ""}
          ${organization ? `<strong style="color:${organization.color}">${organization.name}</strong>` : (character ? "<em>再挑一个组织</em>" : "")}
        </p>
        <button class="primary big" data-action="confirm-selection" ${ready ? "" : "disabled"}>进入夜巡</button>
      </footer>
    </section>
  `;
}

function renderCharacterCard(character, selected) {
  return `
    <button class="char-card ${selected ? "selected" : ""}" data-action="pick-character" data-character="${character.id}">
      <div class="char-art role-art-anim"${spriteAttrs(character.idleStrip, character.idleFrames, character.avatar)}></div>
      <div class="char-meta">
        <div class="char-name-row">
          <strong>${character.name}</strong>
          <span class="char-prof">${character.profession}</span>
        </div>
        <p class="char-tag">${character.tagline}</p>
        <div class="char-stats">
          <span><em>气血</em>${character.maxHp}</span>
          <span><em>能量</em>3</span>
        </div>
        <div class="char-passive">
          <em>${character.passive.name}</em>
          <span>${character.passive.text}</span>
        </div>
      </div>
    </button>
  `;
}

function renderOrganizationCard(org, selected) {
  return `
    <button class="org-card ${selected ? "selected" : ""}" data-action="pick-organization" data-organization="${org.id}" style="--accent:${org.color}">
      <strong>${org.name}</strong>
      <p>${org.tagline}</p>
      <span class="org-tag">机制效果待解锁</span>
    </button>
  `;
}

function renderCombat() {
  const character = CHARACTERS[game.player.characterId];
  const orgColor = game.player.organizationColor;
  return `
    <section class="combat-v3" style="--player-accent:${orgColor}">
      <header class="combat-bar">
        <button class="ghost slim" data-action="goto-splash">‹ 退出</button>
        <div class="combat-progress">
          <span class="eyebrow">第 ${game.floor} / ${ACT_LENGTH} 战</span>
          <strong>${game.player.name}<em>· ${game.player.profession}</em></strong>
          <span class="org-chip" style="--accent:${orgColor}">${game.player.organizationName}</span>
        </div>
        <div class="combat-bar-actions">
          <button class="ghost slim" data-action="open-codex">档案</button>
          <button class="ghost slim" data-action="toggle-log">${logOpen ? "收起" : "战史"}</button>
        </div>
      </header>

      <section class="stage">
        ${renderCombatant("player", character)}
        <div class="stage-center">
          <div class="stage-vfx">
            <span class="stage-eyebrow">出招舞台</span>
            <p class="stage-hint">${stageHint()}</p>
          </div>
        </div>
        ${renderCombatant("enemy")}
      </section>

      <section class="hand-bar">
        <div class="energy-corner" aria-label="能量 ${game.player.energy} / ${game.player.maxEnergy}">
          <strong>${game.player.energy}<span>/${game.player.maxEnergy}</span></strong>
          <em>能量</em>
        </div>
        <div class="hand">
          ${game.player.hand.map((cardId, index) => cardButton(cardId, "play", index)).join("")}
        </div>
        <button class="end-turn" data-action="end-turn">结束<br>回合</button>
      </section>

      ${renderLogDrawer()}
    </section>
  `;
}

function stageHint() {
  const move = game.enemy?.nextMove;
  if (!move) return "夜巡频道开始记录。";
  if (move.intent === "attack") return `${game.enemy.name} 准备出招。`;
  if (move.intent === "block") return `${game.enemy.name} 凝起护体。`;
  if (move.intent === "buff") return `${game.enemy.name} 蓄势变强。`;
  return "对峙中。";
}

function renderCombatant(side, characterIfPlayer) {
  const isEnemy = side === "enemy";
  const unit = isEnemy ? game.enemy : game.player;
  const hpMax = unit.maxHp;
  const hp = unit.hp;
  const profession = isEnemy ? unit.title : characterIfPlayer.profession;
  return `
    <article class="combatant-v3 ${side}">
      <div class="portrait">
        <div class="portrait-art role-art-anim"${spriteAttrs(unit.idleStrip, unit.idleFrames, isEnemy ? unit.art : unit.avatar)} aria-label="${unit.name}"></div>
        ${isEnemy ? renderIntent() : ""}
      </div>
      <p class="unit-tag">${profession}</p>
      <h2 class="unit-name">${unit.name}</h2>
      <div class="hp-row">
        <div class="hp-bar">
          <i style="width:${Math.max(0, Math.min(100, (hp / hpMax) * 100))}%"></i>
          <span>${hp}/${hpMax}</span>
        </div>
        <div class="block-pip ${unit.block > 0 ? "active" : ""}" title="护体">
          <em>护</em>
          <strong>${unit.block}</strong>
        </div>
      </div>
      <div class="status-pips">
        ${unit.burn > 0 ? `<span class="pip burn">灼痕 ${unit.burn}</span>` : ""}
        ${isEnemy && unit.strength > 0 ? `<span class="pip buff">攻势 +${unit.strength}</span>` : ""}
      </div>
    </article>
  `;
}

function renderIntent() {
  const move = game.enemy.nextMove;
  if (!move) return "";
  const amount = move.amount + (move.intent === "attack" ? game.enemy.strength : 0);
  return `
    <div class="intent-bubble ${move.intent}">
      <span class="intent-icon">${intentIcon(move.intent)}</span>
      <strong>${move.label}</strong>
      <small>${intentLabel(move.intent)} ${amount}</small>
    </div>
  `;
}

function renderLogDrawer() {
  return `
    <aside class="log-drawer ${logOpen ? "open" : ""}">
      <button class="log-tab" data-action="toggle-log">${logOpen ? "收起" : "战史"}</button>
      <div class="log-panel">
        <h2>战斗历史</h2>
        ${game.log.map((entry) => `<p>${entry}</p>`).join("")}
      </div>
    </aside>
  `;
}

function renderReward() {
  return `
    <section class="reward panel">
      <p class="seal">法诀芯片</p>
      <h1>截获一枚新法诀</h1>
      <p class="muted">选一张加入牌组，或跳过。</p>
      <div class="reward-grid">
        ${game.rewardChoices.map((cardId) => cardButton(cardId, "reward")).join("")}
      </div>
      <div class="row gap">
        <button class="ghost" data-action="skip-reward">跳过</button>
        <button class="ghost" data-action="goto-splash">退出夜巡</button>
      </div>
    </section>
  `;
}

function renderComplete() {
  return `
    <section class="panel end-state">
      <p class="seal">夜巡完成</p>
      <h1>第一段试炼通过</h1>
      <p class="muted">三场战斗、三位敌人，全部清理。下一段还在写。</p>
      <div class="row gap">
        <button class="primary" data-action="goto-select">再来一轮</button>
        <button class="ghost" data-action="goto-splash">返回主界面</button>
      </div>
    </section>
  `;
}

function renderDefeat() {
  return `
    <section class="panel end-state">
      <p class="seal">夜巡中断</p>
      <h1>气海崩散</h1>
      <p class="muted">天机城还在下雨。下一次入城，牌序会不同。</p>
      <div class="row gap">
        <button class="primary" data-action="goto-select">重新夜巡</button>
        <button class="ghost" data-action="goto-splash">返回主界面</button>
      </div>
    </section>
  `;
}

function renderCodex() {
  return `
    <section class="codex panel">
      <header class="codex-head">
        <div>
          <p class="seal">天机档案</p>
          <h1>资料库</h1>
        </div>
        <button class="ghost" data-action="close-codex">返回</button>
      </header>

      <section class="codex-section">
        <h2>三个普通人</h2>
        <div class="codex-grid">
          ${Object.values(CHARACTERS).map(renderCharacterCard).join("")}
        </div>
      </section>

      <section class="codex-section">
        <h2>三个组织</h2>
        <div class="codex-grid orgs">
          ${Object.values(ORGANIZATIONS).map((o) => renderOrganizationCard(o, false)).join("")}
        </div>
      </section>

      <section class="codex-section">
        <h2>卡牌库</h2>
        <div class="card-gallery">
          ${Object.keys(CARD_LIBRARY).map((cardId) => cardButton(cardId, "codex")).join("")}
        </div>
      </section>

      <section class="codex-section">
        <h2>关键词</h2>
        <div class="keyword-dictionary">
          ${Object.values(KEYWORDS).map((k) => `<article><strong>${k.name}</strong><p>${k.text}</p></article>`).join("")}
        </div>
      </section>
    </section>
  `;
}

function cardButton(cardId, mode, index = 0) {
  const card = CARD_LIBRARY[cardId];
  const disabled = mode === "play" && game.player && game.player.energy < card.cost ? "disabled" : "";
  const action = mode === "play" ? "play-card" : mode === "reward" ? "choose-reward" : "noop";
  return `
    <button class="card ${card.type} owner-${card.owner}" data-action="${action}" data-card="${cardId}" data-index="${index}" ${disabled}>
      <span class="cost">${card.cost}</span>
      <span class="kind">${card.type === "attack" ? "攻击" : "技能"}</span>
      <img class="card-art" src="${cardIcon(card)}" alt="" />
      <strong>${card.name}</strong>
      <p>${card.text}</p>
    </button>
  `;
}

function cardIcon(card) {
  if (card.owner === "zhou") {
    return card.type === "attack" ? "./src/assets/pixel/card-cleaner-attack.png" : "./src/assets/pixel/card-cleaner-skill.png";
  }
  if (card.owner === "ke") {
    return card.type === "attack" ? "./src/assets/pixel/card-worker-attack.png" : "./src/assets/pixel/card-worker-skill.png";
  }
  if (card.owner === "su") {
    return card.type === "attack" ? "./src/assets/pixel/card-streamer-attack.png" : "./src/assets/pixel/card-streamer-skill.png";
  }
  return "./src/assets/pixel/card-breath.png";
}

function intentIcon(intent) {
  if (intent === "attack") return "杀";
  if (intent === "block") return "守";
  return "频";
}

function intentLabel(intent) {
  if (intent === "attack") return "造成";
  if (intent === "block") return "护体 +";
  return "攻势 +";
}

function bindEvents() {
  app.querySelectorAll("[data-action]").forEach((element) => {
    element.addEventListener("click", () => {
      const action = element.dataset.action;
      let shouldSave = true;

      if (action === "pick-character") pickPendingCharacter(game, element.dataset.character);
      if (action === "pick-organization") pickPendingOrganization(game, element.dataset.organization);
      if (action === "confirm-selection") confirmSelection(game);
      if (action === "play-card") playCard(game, Number(element.dataset.index));
      if (action === "end-turn") endTurn(game);
      if (action === "choose-reward") addRewardCard(game, element.dataset.card);
      if (action === "skip-reward") skipReward(game);
      if (action === "open-codex") {
        showCodex(game);
        shouldSave = false;
      }
      if (action === "close-codex") {
        closeCodex(game);
        shouldSave = false;
      }
      if (action === "toggle-log") {
        logOpen = !logOpen;
        shouldSave = false;
      }
      if (action === "goto-splash") {
        game = createGame();
        gotoSplash(game);
        logOpen = false;
        shouldSave = false;
      }
      if (action === "goto-select") {
        game = createGame();
        gotoSelect(game);
        clearSave();
        logOpen = false;
        shouldSave = false;
      }
      if (action === "continue") {
        game = loadGame() || createGame();
        logOpen = false;
        shouldSave = false;
      }

      if (shouldSave) saveGame(game);
      render();
    });
  });
}

function saveGame(value) {
  if (!value.player || value.screen === "splash" || value.screen === "select") return;
  localStorage.setItem(SAVE_KEY, JSON.stringify(value));
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}

render();
