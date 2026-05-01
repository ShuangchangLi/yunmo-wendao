# 赛博长生：打工修仙录

一个赛博修仙 + 打工人题材的卡牌 roguelike MVP。Slay the Spire 玩法，像素风美术。
两个版本：网页（HTML/JS）和 Godot。

详见 `docs/game-design.md`。

## Run（网页版）

```bash
npm start
```

浏览器访问 `http://127.0.0.1:5173`。

## Run（Godot 版）

用 Godot 4.6 打开 `godot/project.godot` 后按 F5 运行，或：

```bash
# 假设 godot 在 PATH
godot --path godot
```

## 当前 MVP 内容

- 三个普通人：老周（清洁工）、小柯（社畜）、阿酥（主播）
- 三个组织：天机科技、太上学院、夜行帮（机制效果待解锁）
- 三场战斗：流浪霓灯犬 → 铁鬃械猪 → 黑巷劫修
- 简化战斗：能量、护体、灼痕、抽牌
- 每职业一个被动技能（积尘 / 死线 / 热搜）
- 像素风立绘（PixelLab 生成）+ idle 动画

## 文档

- `docs/game-design.md` — 当前 MVP 设计 spec（**主要文档**）
- `docs/art-pipeline.md` — PixelLab 美术管线
- `docs/cyber-xianxia-design.md` — 历史题材笔记（保留作为题材线索，与当前 UI 不一致）
