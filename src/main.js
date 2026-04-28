import {
  CARD_LIBRARY,
  CULTIVATORS,
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

let game = createGame();
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
  return renderCombat();
}

function renderStart() {
  return `
    <section class="start-shell">
      <div class="brand">
        <p class="seal">墨 · 道 · 劫</p>
        <h1>云墨问道</h1>
        <p class="subtitle">以牌为招，以灵力为息。职业路线会从学徒走向正路、邪路或隐藏传承。</p>
        <div class="start-actions">
          <button class="ghost" data-action="open-codex">图鉴</button>
        </div>
      </div>
      <div class="hero-art" aria-hidden="true">
        <img src="./src/assets/ink-mountain.svg" alt="" />
      </div>
      <section class="cultivator-grid" aria-label="选择角色">
        ${Object.values(CULTIVATORS).map(renderCultivator).join("")}
      </section>
    </section>
  `;
}

function renderCultivator(cultivator) {
  return `
    <button class="cultivator-card" data-action="choose-cultivator" data-cultivator="${cultivator.id}">
      <span class="role-mark">${cultivator.mark}</span>
      <strong>${cultivator.name}</strong>
      <small>${cultivator.school}</small>
      <p>${cultivator.trait}</p>
      <div class="keyword-row">${cultivator.keywords.map(keywordChip).join("")}</div>
      <ol class="stage-line">${cultivator.stages.map((stage) => `<li>${stage}</li>`).join("")}</ol>
    </button>
  `;
}

function renderCombat() {
  return `
    <section class="combat-layout">
      <header class="topbar">
        <div>
          <p class="eyebrow">第 ${game.floor} 重天</p>
          <h1>${game.player.name}</h1>
        </div>
        <div class="combat-resources">
          ${energyOrbs(game.player.energy, game.player.maxEnergy)}
          ${classMeter(game.player.resourceName, game.player.qi, game.player.maxQi, game.player.transcendent)}
          <button class="icon-button" data-action="open-codex" title="图鉴">鉴</button>
        </div>
      </header>

      <section class="battlefield">
        ${renderCombatant("player")}
        ${renderCombatant("enemy")}
      </section>

      <section class="hand-panel">
        <div class="pile-row">
          ${miniStat("抽牌", game.player.drawPile.length)}
          ${miniStat("弃牌", game.player.discardPile.length)}
          ${miniStat("回合", game.turn)}
        </div>
        <div class="hand">
          ${game.player.hand.map((cardId, index) => cardButton(cardId, "play", index)).join("")}
        </div>
        <button class="end-turn" data-action="end-turn">收势</button>
      </section>

      <aside class="log panel">
        <h2>战局</h2>
        ${game.log.map((entry) => `<p>${entry}</p>`).join("")}
      </aside>
    </section>
  `;
}

function renderCombatant(side) {
  const isEnemy = side === "enemy";
  const unit = isEnemy ? game.enemy : game.player;
  const hpMax = unit.maxHp;
  const hp = unit.hp;
  return `
    <article class="combatant ${side}">
      ${isEnemy ? enemyIntent() : ""}
      <div class="ink-figure">${isEnemy ? "妖" : "人"}</div>
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
        ${isEnemy ? statusBadge("煞气", unit.strength) + statusBadge("异火", unit.burn) : statusBadge(unit.resourceName, unit.qi) + statusBadge("力道", unit.strength)}
        ${!isEnemy && unit.transcendent ? statusBadge("通玄", "已成") : ""}
      </div>
    </article>
  `;
}

function enemyIntent() {
  const move = game.enemy.nextMove;
  const amount = move.amount + (move.intent === "attack" ? game.enemy.strength : 0);
  const label = move.intent === "attack" ? "将造成" : move.intent === "block" ? "将获得" : "将强化";
  const unit = move.intent === "attack" ? "伤害" : move.intent === "block" ? "护体" : "攻势";
  return `
    <div class="intent-card ${move.intent}">
      <span>${intentIcon(move.intent)}</span>
      <strong>${move.label}</strong>
      <p>${label} ${amount} ${unit}</p>
    </div>
  `;
}

function renderReward() {
  return `
    <section class="reward panel">
      <p class="seal">一线机缘</p>
      <h1>择一门新法</h1>
      <div class="reward-grid">
        ${game.rewardChoices.map((cardId) => cardButton(cardId, "reward")).join("")}
      </div>
      <button class="ghost" data-action="skip-reward">不取机缘</button>
    </section>
  `;
}

function renderDefeat() {
  return `
    <section class="panel end-state">
      <p class="seal">道阻</p>
      <h1>此劫未渡</h1>
      <p>气海崩散，但残卷仍在。下一次入山，招式会更清晰。</p>
      <button class="primary" data-action="restart">重新入山</button>
    </section>
  `;
}

function renderCodex() {
  return `
    <section class="codex panel">
      <div class="codex-head">
        <div>
          <p class="seal">图鉴</p>
          <h1>道卷总览</h1>
        </div>
        <button class="ghost" data-action="close-codex">返回</button>
      </div>

      <section class="codex-section">
        <h2>职业与路线</h2>
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
          ${Object.entries(KEYWORDS).map(([id, keyword]) => `<article><strong>${keyword.name}</strong><p>${keyword.text}</p></article>`).join("")}
        </div>
      </section>
    </section>
  `;
}

function renderRouteCard(cultivator) {
  return `
    <article class="route-card">
      <span class="role-mark small">${cultivator.mark}</span>
      <h3>${cultivator.name}</h3>
      <p>${cultivator.trait}</p>
      <ol class="stage-line expanded">${cultivator.stages.map((stage) => `<li>${stage}</li>`).join("")}</ol>
      <div class="route-list">
        ${cultivator.routes.map((route) => `<div><strong>${route.name}</strong><span>${route.alignment}</span><p>${route.text}</p></div>`).join("")}
      </div>
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
    <div class="energy-cluster" aria-label="灵力 ${current}/${max}">
      <span>灵力</span>
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
  return "煞";
}

function bindEvents() {
  app.querySelectorAll("[data-action]").forEach((element) => {
    element.addEventListener("click", () => {
      const action = element.dataset.action;
      if (action === "choose-cultivator") chooseCultivator(game, element.dataset.cultivator);
      if (action === "play-card") playCard(game, Number(element.dataset.index));
      if (action === "end-turn") endTurn(game);
      if (action === "choose-reward") addRewardCard(game, element.dataset.card);
      if (action === "skip-reward") skipReward(game);
      if (action === "restart") game = restartGame();
      if (action === "open-codex") showCodex(game);
      if (action === "close-codex") closeCodex(game);
      render();
    });
  });
}

render();
