import {
  CARD_LIBRARY,
  CULTIVATORS,
  addRewardCard,
  chooseCultivator,
  createGame,
  endTurn,
  playCard,
  restartGame,
  skipReward,
} from "./game.js";

let game = createGame();
const app = document.querySelector("#app");

function render() {
  app.innerHTML = renderScreen();
  bindEvents();
}

function renderScreen() {
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
        <p class="subtitle">以牌为招，以真气为势。入山、破劫、悟道。</p>
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
      <span class="role-mark">${cultivator.id === "sword" ? "剑" : cultivator.id === "talisman" ? "符" : "丹"}</span>
      <strong>${cultivator.name}</strong>
      <small>${cultivator.school}</small>
      <p>${cultivator.trait}</p>
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
        <div class="stats">
          ${stat("气血", `${game.player.hp}/${game.player.maxHp}`)}
          ${stat("灵力", `${game.player.energy}/${game.player.maxEnergy}`)}
          ${stat("真气", `${game.player.qi}/${game.player.maxQi}`)}
          ${stat("牌库", game.player.deck.length)}
        </div>
      </header>

      <section class="battlefield">
        <article class="combatant player">
          <div class="ink-figure sword-figure">人</div>
          <div>
            <p class="eyebrow">${game.player.school}</p>
            <h2>${game.player.name}</h2>
          </div>
          <div class="bars">
            ${bar("气血", game.player.hp, game.player.maxHp, "hp")}
            ${bar("护体", game.player.block, Math.max(10, game.player.block), "block")}
          </div>
          <p class="status">${game.player.transcendent ? "通玄 · 下一攻击爆发" : "沉息凝神"} · 力道 ${game.player.strength}</p>
        </article>

        <article class="combatant enemy">
          <div class="intent">${intentIcon(game.enemy.nextMove.intent)}</div>
          <p class="intent-text">${game.enemy.nextMove.label} · ${game.enemy.nextMove.amount + (game.enemy.nextMove.intent === "attack" ? game.enemy.strength : 0)}</p>
          <div class="ink-figure enemy-figure">妖</div>
          <div>
            <p class="eyebrow">${game.enemy.title}</p>
            <h2>${game.enemy.name}</h2>
          </div>
          <div class="bars">
            ${bar("气血", game.enemy.hp, game.enemy.maxHp, "hp")}
            ${bar("护体", game.enemy.block, Math.max(10, game.enemy.block), "block")}
          </div>
          <p class="status">煞气 ${game.enemy.strength} · 焚心 ${game.enemy.burn}</p>
        </article>
      </section>

      <section class="hand-panel">
        <div class="pile-row">
          ${stat("抽牌", game.player.drawPile.length)}
          ${stat("弃牌", game.player.discardPile.length)}
          ${stat("回合", game.turn)}
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

function cardButton(cardId, mode, index = 0) {
  const card = CARD_LIBRARY[cardId];
  const disabled = mode === "play" && game.player.energy < card.cost ? "disabled" : "";
  const action = mode === "play" ? "play-card" : "choose-reward";
  return `
    <button class="card ${card.type}" data-action="${action}" data-card="${cardId}" data-index="${index}" ${disabled}>
      <span class="cost">${card.cost}</span>
      <span class="kind">${card.kind}</span>
      <strong>${card.name}</strong>
      <p>${card.text}</p>
    </button>
  `;
}

function stat(label, value) {
  return `<div class="stat"><span>${label}</span><strong>${value}</strong></div>`;
}

function bar(label, value, max, className) {
  const width = Math.max(0, Math.min(100, (value / max) * 100));
  return `
    <div class="bar ${className}">
      <span>${label}: ${value}</span>
      <i style="width:${width}%"></i>
    </div>
  `;
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
      render();
    });
  });
}

render();
