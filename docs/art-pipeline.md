# 美术管线 / Art Pipeline

霓墟问道 / Cyber Xianxia Deckbuilder 的角色与敌人像素美术全部由 [PixelLab.ai](https://pixellab.ai/) 通过 MCP 生成，再用 `tools/process_pixellab_character.py` 拼成游戏可用的 sprite strip，统一覆盖到 `godot/assets/pixel/` 和 `src/assets/pixel/`。

## PixelLab 设置

- 接入方式：MCP server `https://api.pixellab.ai/mcp`，token 写在 `~/.cursor/mcp.json` 的 `mcpServers.pixellab.headers.Authorization`。
- 在 Cursor 新会话中通过 `CallMcpTool` 调用 `create_character`、`animate_character`、`get_character`、`list_characters`、`delete_character` 等工具。
- 工具描述：`mcps/user-pixellab/tools/*.json`。
- 当前订阅：免费试用（40 次 fast generations）。要扩量先用折扣码 `CXOQWA_MONTHLY_TIER_1` 升 Tier 1 ($8-10/mo, 1000 images)。

## 当前角色清单

每个角色用 `create_character` 的 standard 模式生成（1 credit/角色），4 directions，size 96，medium shading，high detail。然后用 `animate_character` 加 idle 动画（1 credit/动画）。

| 用途 | character_id | 模板 / 比例 | idle 动画 | south 帧数 | 资产文件名前缀 |
| --- | --- | --- | --- | --- | --- |
| 主角 · 灵污清洁工 | `55f4e2bc-c13a-459d-ba02-762048418449` | humanoid / heroic | breathing-idle | 4 | `px-cleaner` |
| 主角 · 社畜 | `bb1864e8-962d-4c4c-9e7a-cdb6e72b5104` | humanoid / heroic | breathing-idle | 4 | `px-worker` |
| 主角 · 灵网主播 | `bfd1d4ba-2fa1-4936-86e4-df3287493aff` | humanoid / heroic | breathing-idle | 4 | `px-streamer` |
| 敌人 · 霓灯犬（流浪犬版） | `9b38deba-18af-4ce4-a8d3-d7582ab3f02f` | quadruped / dog | idle | 8 | `px-enemy-neon-hound` |
| 敌人 · 黑巷劫修 | `1614682a-491a-43f3-9d57-7deb3d7ff7ca` | humanoid / heroic | breathing-idle | 4 | `px-enemy-alley-raider` |

## 当前留在账号但**未用进项目**

| 用途 | character_id | 备注 |
| --- | --- | --- |
| 旧霓灯犬（全身霓虹电路版） | `e38d4dd0-c809-4965-a394-9118950d4a17` | 太"WoW 怪物"风，与"赛博底层灵污"题材不符。保留作为未来 boss 形态参考 |
| 铁鬃械猪 v2 | `b0acd685-656a-4557-b0ee-7413fe7d4bc1` | 同上。`bear` 模板下出来像机甲熊，没有"被城市改造的猪"那种生活感。下一轮重新设计 |
| Cleaner v1 实验稿 | `ca8c7d29-1bad-4b30-bbf2-3ce036f67ffc` | 早期实验，default 比例偏 chibi |
| Cleaner v2 实验稿 | `273a08d8-fe1f-4b50-a99c-72ded4cf8fe7` | 同上 |
| 流浪犬 v2（项圈+义肢） | `c90b7384-f46e-4640-80ff-b7e08af914a3` | 加了义肢但 quadruped 模板放弃细节，反而比 v1 差 |

如果 Pixellab 账号空间不够，可以用 `delete_character(character_id, confirm=true)` 清掉。

## 当前敌人空缺：第 2 槽（铁鬃械猪 / 类似中段敌人）

设计原则（来自 review）：
- **不是怪物图鉴**，而是城市底层小生物被灵网外溢 mildly 改造
- 一只生物**只有一个赛博点**（项圈 / 义肢 / 义眼 之一），不全身机械
- 不张牙不舞爪，有点可爱有点可怜
- 三只敌人三种不同的"灵网外溢"方向，避免重复

候选方向（待选）：
- 被丢弃的扫地机器人 + 真猫融合的 "扫地机猫"，机械底盘 + 真猫上半身
- 右前腿义肢的瘸腿狐狸
- 失去主人的快递机器狗，嘴角还叼着没派完的快递盒
- 灵网坏掉的霓虹灯柱底下蹭电的橘猫，尾巴尖一点 LED

## 像素资产规格

- 单帧 canvas：**136×136 PNG**（PixelLab 在 character size 96 下的实际输出）
- 角色实际占据：~81×61 像素，剩余为透明 padding
- idle strip：**N × 136 宽 × 136 高**（每帧 136×136 横向拼接，N 来自 PixelLab 模板）
- 命名规则：
  - `assets/pixel/{prefix}.png`：south 视角静态图，做 fallback 和加载预览
  - `assets/pixel/{prefix}-idle-strip.png`：idle 动画 strip

## 处理流水

1. **生成**：通过 MCP 跑 `create_character` 拿到 `character_id`，再 `animate_character` 排 idle（quadruped 用 `idle`，humanoid 用 `breathing-idle`）。
2. **下载 ZIP**：`curl --fail -sSL https://api.pixellab.ai/mcp/characters/{id}/download -o tmp/pixellab-zips/{name}.zip`。如果动画还没好，curl 会失败（HTTP 423）。
3. **拼图 + 拷贝**（自动）：

   ```powershell
   # 写到 godot 然后镜像到 src
   py tools/process_pixellab_character.py tmp/pixellab-zips/cleaner.zip godot/assets/pixel px-cleaner
   Copy-Item godot/assets/pixel/px-cleaner.png src/assets/pixel/px-cleaner.png -Force
   Copy-Item godot/assets/pixel/px-cleaner-idle-strip.png src/assets/pixel/px-cleaner-idle-strip.png -Force
   ```

   脚本会输出 `{prefix}.png`（south 静态）和 `{prefix}-idle-strip.png`（拼好的横条）。

4. **代码侧索引**：
   - **Godot**：`godot/scripts/main.gd` 的 `_unit_art_path()` 和 `_unit_idle_strip_path()` 各自维护 `visual_id -> 路径` 的字典。`_unit_art()` 优先读 strip，没有再 fallback 到静态 png。
   - **Web**：`src/game.js` 的 `CULTIVATORS` 和 `ENCOUNTERS` 数组里给每个角色加 `idleStrip` 和 `idleFrames` 字段。`src/main.js` 的 `bindSprites()` 在每次 render 后用 `setInterval` 驱动 `background-position-x` 切帧。

## 边缘裁切（edge-cut）问题修复记录

之前出现过头/脚被父容器裁掉的情况，根因和修法：

### Web (`src/styles.css`, `src/main.js`)

- **旧问题 1**：`.combatant { overflow: hidden }` + `.role-art-large` 的 `cyberFloat` 动画 `translateY(-8px)` → 战斗肖像顶端被裁。
- **旧问题 2**：`<img class="role-art" object-fit: contain>` 在 136×136 大于容器高度时，`stretch` 在某些 layout 中会让图被裁。

修法：
- `cyberFloat` 关键帧改为 `translateY(-4px)`（更小的振幅）。
- `.portrait-frame` 加 `padding: 6px 0; overflow: visible`，让浮动有 6px 上下余量。
- 把肖像从 `<img>` 改成 `<div class="role-art role-art-anim">`，`background-size: 100% 100%`，`aspect-ratio: 1 / 1`，`width: auto`。div 始终是正方形，不会被随便拉伸。
- `.enemy-art` 从 `max-height` 改成 `height`，给 div 一个明确高度。

### Godot (`godot/scripts/unit_art.gd`)

- **旧问题**：`expand_mode = EXPAND_FIT_WIDTH_PROPORTIONAL` 让 TextureRect 按容器宽度拉伸纹理，aspect-ratio 1:1 的图在窄高度容器里会溢出底部。再叠加旧代码的 `position.y = sin * 4.0` + `scale = 1 + sin * 0.012` 的伪呼吸，图边缘被父 panel 裁。
- 修法：
  - `expand_mode = EXPAND_IGNORE_SIZE` + `stretch_mode = STRETCH_KEEP_ASPECT_CENTERED` + `size_flags_*` = `SIZE_EXPAND_FILL`，让图在容器内按 aspect 适配并居中，不再溢出。
  - 删掉旧的 sin 浮动 / 缩放伪动画。改成真实读取 idle strip 用 `AtlasTexture` 切出 N 帧，每 0.16s（≈6 fps）切一次。呼吸感从动画帧本身来，不靠位移。

## 下一步迭代指南

要再加一个新角色（例如重新设计的第 2 个敌人）：

1. **设计**：先用文字定下"赛博点位置 + 性格 + 颜色"。一个生物只放一个赛博点。
2. **生成**：走 standard 模式 + heroic（humanoid）或 dog/cat/bear（quadruped）模板。`ai_freedom: 350-500`。size 96。
3. **review**：用 `get_character(character_id, include_preview=true)` 看缩略图。不满意就 `delete_character` 重做（standard 1 credit，便宜）。
4. **加动画**：humanoid 用 `breathing-idle`，quadruped 用 `idle`。`directions: ["south"]` 省一倍 credits。
5. **下载 + 拼图**：`curl + tools/process_pixellab_character.py`。
6. **接入代码**：
   - 在 `godot/scripts/main.gd` 的两个 path 字典加新条目。
   - 在 `src/game.js` 的对应 cultivator/encounter 加 `idleStrip` 和 `idleFrames`。
7. **跑一遍**确认两端显示一致、不裁边、不变形。

## Pixellab 工具速查

```python
# 创建（standard 1 credit）
create_character(
    description="...",
    body_type="humanoid",  # 或 "quadruped"
    template="dog",        # quadruped 必填
    mode="standard",
    n_directions=4,
    size=96,
    proportions='{"type": "preset", "name": "heroic"}',  # humanoid 才有效
    shading="medium shading",
    detail="high detail",
    ai_freedom=400,
    view="low top-down",
)

# 加动画（1 credit）
animate_character(
    character_id="...",
    template_animation_id="breathing-idle",  # quadruped 用 "idle"
    directions=["south"],
    confirm_cost=True,
)

# 检查状态
get_character(character_id="...", include_preview=True)
```

humanoid 可用动画模板（49）：backflip, breathing-idle, cross-punch, crouched-walking, crouching, drinking, falling-back-death, fight-stance-idle-8-frames, fireball, flying-kick, front-flip, getting-up, high-kick, hurricane-kick, jumping-1, ...

quadruped (dog) 可用动画模板（10）：bark, fast-walk, idle, running-4-frames, running-6-frames, running-8-frames, sneaking, walk-4-frames, walk-6-frames, walk-8-frames

quadruped (bear) 可用动画模板（21）：angry, attack-left, attack-right, drinking, eating, going-to-sleep, idle-long, idle-resting, idle-sitting, jump, jump-attack, running-..., ...
