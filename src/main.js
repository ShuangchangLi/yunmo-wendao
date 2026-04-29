import {
  ACT_LENGTH,
  CARD_LIBRARY,
  CULTIVATORS,
  GAME_TITLE,
  KEYWORDS,
  addRewardCard,
  chooseCultivator,
  closeCodex,
  createGame,
  endTurn,
  playCard,
  restartGame,
  showCodex,
  skipReward,
} from "./game.js";

const SAVE_KEY = "nixu-wendao-save";

let game = createGame();
let logOpen = false;
const app = document.querySelector("#app");

function render() {
  app.innerHTML = renderScreen();
  bindEvents();
}

function renderScreen() {
  if (game.screen === "codex") return renderCodex();
  if (game.screen === "start") return renderStart();
  if (game.screen === "defeat") return renderDefeat();
  if (game.screen === "reward") return renderReward();
  if (game.screen === "complete") return renderComplete();
  return renderCombat();
}

function renderStart() {
  const hasSave = Boolean(loadGame());
  return `
    <section class="start-v2 cyber">
      <div class="start-hero cyber">
        <img src="./src/assets/cyber-city.svg" alt="" />
        <div class="start-copy">
          <p class="seal">天机城夜巡 / 三战 MVP</p>
          <h1>${GAME_TITLE}</h1>
          <p class="subtitle">底层身份修成大道。灵污清洁工、社畜、灵网主播，从霓虹雨夜里打出自己的第一段道途。</p>
          <div class="start-menu">
            <button class="primary" data-action="new-run">新的夜巡</button>
            <button class="ghost light" data-action="continue" ${hasSave ? "" : "disabled"}>继续存档</button>
            <button class="ghost light" data-action="open-codex">天机档案</button>
          </div>
        </div>
      </div>
      <section class="cultivator-grid compact" aria-label="选择入城身份">
        ${Object.values(CULTIVATORS).map(renderCultivator).join("")}
      </section>
    </section>
  `;
}

function renderCultivator(cultivator) {
  return `
    <button class="cultivator-card cyber-card ${cultivator.id}" data-action="choose-cultivator" data-cultivator="${cultivator.id}">
      <img class="role-art" src="${cultivator.avatar}" alt="" />
      <span class="role-mark">${cultivator.mark}</span>
      <strong>${cultivator.name} <em>-> ${cultivator.finalTitle}</em></strong>
      <small>${cultivator.school}</small>
      <p>${cultivator.trait}</p>
      <div class="keyword-row">${cultivator.keywords.map(keywordChip).join("")}</div>
      <ol class="stage-line">${cultivator.stages.map((stage) => `<li>${stage}</li>`).join("")}</ol>
    </button>
  `;
}

function renderCombat() {
  return `
    <section class="combat-layout v2 cyber">
      <header class="topbar cyber-panel">
        <div>
          <p class="eyebrow">第 ${game.floor} 战 / ${ACT_LENGTH} 战短线夜巡</p>
          <h1>${game.player.name} <span>${game.player.finalTitle}</span></h1>
        </div>
        <div class="combat-resources">
          ${energyOrbs(game.player.energy, game.player.maxEnergy)}
          ${classMeter(game.player.resourceName, game.player.qi, game.player.maxQi, game.player.transcendent)}
          <button class="icon-button" data-action="exit-title" title="返回主界面">退</button>
          <button class="icon-button" data-action="open-codex" title="天机档案">档</button>
          <button class="icon-button" data-action="toggle-log" title="战斗历史">史</button>
        </div>
      </header>

      <section class="battlefield v2 cyber-field">
        ${renderCombatant("player")}
        <div class="clash-mark">对</div>
        ${renderCombatant("enemy")}
      </section>

      <section class="hand-panel cyber-panel">
        <div class="pile-row">
          ${miniStat("抽牌", game.player.drawPile.length)}
          ${miniStat("弃牌", game.player.discardPile.length)}
          ${miniStat("回合", game.turn)}
        </div>
        <div class="hand">
          ${game.player.hand.map((cardId, index) => cardButton(cardId, "play", index)).join("")}
        </div>
        <button class="end-turn" data-action="end-turn">结束回合</button>
      </section>

      ${renderLogDrawer()}
    </section>
  `;
}

function renderCombatant(side) {
  const isEnemy = side === "enemy";
  const unit = isEnemy ? game.enemy : game.player;
  const hpMax = unit.maxHp;
  const hp = unit.hp;
  return `
    <article class="combatant ${side} v2 cyber-panel">
      <div class="unit-top ${isEnemy ? "" : "player-top"}">
        ${isEnemy ? enemyIntent() : playerFocus()}
        <div class="portrait-frame">
          <img class="enemy-art role-art-large" src="${isEnemy ? unit.art : unit.avatar}" alt="${unit.name}" />
        </div>
      </div>
      <div class="combatant-title">
        <p class="eyebrow">${isEnemy ? unit.title : unit.school}</p>
        <h2>${unit.name}</h2>
      </div>
      <div class="vitals">
        <div class="hp-strip">
          <i style="width:${Math.max(0, Math.min(100, (hp / hpMax) * 100))}%"></i>
          <span>${hp}/${hpMax}</span>
        </div>
        <div class="shield ${unit.block > 0 ? "active" : ""}">
          <span>护</span>
          <strong>${unit.block}</strong>
        </div>
      </div>
      <div class="status-row">
        ${isEnemy ? statusBadge("攻势", unit.strength) + statusBadge("灼痕", unit.burn) : statusBadge(unit.resourceName, unit.qi) + statusBadge("通玄", unit.transcendent ? "已成" : "未成")}
      </div>
    </article>
  `;
}

function playerFocus() {
  return `
    <div class="intent-card focus">
      <span>道</span>
      <strong>身份修行</strong>
      <p>资源满后进入通玄，下一张伤害牌额外 +8。</p>
    </div>
  `;
}

function enemyIntent() {
  const move = game.enemy.nextMove;
  const amount = move.amount + (move.intent === "attack" ? game.enemy.strength : 0);
  return `
    <div class="intent-card ${move.intent}">
      <span>${intentIcon(move.intent)}</span>
      <strong>${move.label}</strong>
      <p>${intentLabel(move.intent)} ${amount}</p>
    </div>
  `;
}

function renderLogDrawer() {
  return `
    <aside class="log-drawer ${logOpen ? "open" : ""}">
      <button class="log-tab" data-action="toggle-log">${logOpen ? "收起" : "战史"}</button>
      <div class="log-panel cyber-panel">
        <h2>战斗历史</h2>
        ${game.log.map((entry) => `<p>${entry}</p>`).join("")}
      </div>
    </aside>
  `;
}

function renderReward() {
  return `
    <section class="reward panel cyber-panel">
      <p class="seal">法诀芯片</p>
      <h1>截获一枚新法诀</h1>
      <p>选一张加入牌组。当前 MVP 先保持基础战斗，职业成长系统后面再接。</p>
      <div class="reward-grid">
        ${game.rewardChoices.map((cardId) => cardButton(cardId, "reward")).join("")}
      </div>
      <button class="ghost" data-action="skip-reward">跳过</button>
      <button class="ghost" data-action="exit-title">返回主界面</button>
    </section>
  `;
}

function renderComplete() {
  return `
    <section class="panel end-state cyber-panel">
      <p class="seal">夜巡完成</p>
      <h1>第一段试炼完成</h1>
      <p>你击退了霓灯犬、铁鬃械猪和黑巷劫修。三职业、三场战斗、基础卡牌循环和赛博修仙视觉已经跑通。</p>
      <button class="primary" data-action="new-run">再来一轮</button>
      <button class="ghost" data-action="exit-title">返回主界面</button>
    </section>
  `;
}

function renderDefeat() {
  return `
    <section class="panel end-state cyber-panel">
      <p class="seal">夜巡中断</p>
      <h1>气海崩散</h1>
      <p>天机城还在下雨。下一次入城，牌序会不同。</p>
      <button class="primary" data-action="new-run">重新夜巡</button>
      <button class="ghost" data-action="exit-title">返回主界面</button>
    </section>
  `;
}

function renderCodex() {
  return `
    <section class="codex panel cyber-panel">
      <div class="codex-head">
        <div>
          <p class="seal">天机档案</p>
          <h1>霓墟资料库</h1>
        </div>
        <button class="ghost" data-action="close-codex">返回</button>
      </div>

      <section class="codex-section">
        <h2>入城身份</h2>
        <div class="codex-grid">
          ${Object.values(CULTIVATORS).map(renderRouteCard).join("")}
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
          ${Object.entries(KEYWORDS).map(([, keyword]) => `<article><strong>${keyword.name}</strong><p>${keyword.text}</p></article>`).join("")}
        </div>
      </section>
    </section>
  `;
}

function renderRouteCard(cultivator) {
  return `
    <article class="route-card">
      <img class="route-art" src="${cultivator.avatar}" alt="" />
      <span class="role-mark small">${cultivator.mark}</span>
      <h3>${cultivator.name} -> ${cultivator.finalTitle}</h3>
      <p>${cultivator.trait}</p>
      <ol class="stage-line expanded">${cultivator.stages.map((stage) => `<li>${stage}</li>`).join("")}</ol>
    </article>
  `;
}

function cardButton(cardId, mode, index = 0) {
  const card = CARD_LIBRARY[cardId];
  const disabled = mode === "play" && game.player.energy < card.cost ? "disabled" : "";
  const action = mode === "play" ? "play-card" : mode === "reward" ? "choose-reward" : "noop";
  return `
    <button class="card ${card.type}" data-action="${action}" data-card="${cardId}" data-index="${index}" ${disabled}>
      <span class="cost">${card.cost}</span>
      <span class="kind">${card.kind}</span>
      <strong>${card.name}</strong>
      <p>${card.text}</p>
      <div class="keyword-row">${card.keywords.map(keywordChip).join("")}</div>
      ${keywordPopover(card.keywords)}
    </button>
  `;
}

function keywordChip(id) {
  return `<span class="keyword-chip">${KEYWORDS[id]?.name || id}</span>`;
}

function keywordPopover(ids) {
  return `
    <aside class="keyword-popover">
      ${ids.map((id) => `<div><strong>${KEYWORDS[id]?.name || id}</strong><p>${KEYWORDS[id]?.text || ""}</p></div>`).join("")}
    </aside>
  `;
}

function energyOrbs(current, max) {
  return `
    <div class="energy-cluster" aria-label="灵能 ${current}/${max}">
      <span>灵能</span>
      <div>${Array.from({ length: max }, (_, index) => `<i class="${index < current ? "filled" : ""}"></i>`).join("")}</div>
    </div>
  `;
}

function classMeter(label, current, max, active) {
  return `
    <div class="class-meter ${active ? "transcendent" : ""}">
      <span>${active ? "通玄" : label}</span>
      <div>${Array.from({ length: max }, (_, index) => `<i class="${index < current ? "filled" : ""}"></i>`).join("")}</div>
    </div>
  `;
}

function miniStat(label, value) {
  return `<div class="mini-stat"><span>${label}</span><strong>${value}</strong></div>`;
}

function statusBadge(label, value) {
  return `<span class="status-badge"><em>${label}</em>${value}</span>`;
}

function intentIcon(intent) {
  if (intent === "attack") return "杀";
  if (intent === "block") return "守";
  return "频";
}

function intentLabel(intent) {
  if (intent === "attack") return "将造成";
  if (intent === "block") return "将获得护体";
  return "将强化攻势";
}

function bindEvents() {
  app.querySelectorAll("[data-action]").forEach((element) => {
    element.addEventListener("click", () => {
      const action = element.dataset.action;
      let shouldSave = true;

      if (action === "choose-cultivator") chooseCultivator(game, element.dataset.cultivator);
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
      if (action === "exit-title") {
        game = createGame();
        logOpen = false;
        shouldSave = false;
      }
      if (action === "new-run") {
        game = restartGame();
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
  if (!value.player) return;
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
