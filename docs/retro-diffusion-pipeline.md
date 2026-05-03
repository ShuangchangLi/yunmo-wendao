# Retro Diffusion pipeline

Retro Diffusion is useful for the parts of this project where we need polished pixel assets rather than geometric placeholder art.

## Local setup

Do not commit the API key. Set it in the shell that runs the tool:

```powershell
$env:RD_API_KEY = "..."
```

Then use the local client:

```powershell
node tools/retro_diffusion_client.mjs credits
node tools/retro_diffusion_client.mjs cost --prompt "cyber xianxia janitor hero, neutral pose" --style rd_pro__default --width 256 --height 256
```

Generation commands save decoded files locally:

```powershell
node tools/retro_diffusion_client.mjs generate --prompt "cyber xianxia janitor hero, blue workwear, mop staff, transparent background, clean readable silhouette" --style rd_pro__default --width 256 --height 256 --remove_bg --out tmp/rd/cleaner.png
```

For animation from a starting frame:

```powershell
node tools/retro_diffusion_client.mjs animate --input src/assets/portraits/cleaner-headshot.png --prompt "slow breathing combat idle, holding a mop like a staff, subtle cloth movement" --style rd_advanced_animation__idle --width 128 --height 128 --frames 8 --spritesheet --out tmp/rd/cleaner-combat-idle.png
```

## Styles that matter for this game

- `rd_pro__default`: polished modern pixel art with reference images.
- `rd_pro__scifi`: high contrast neon cyber look.
- `rd_pro__ui_panel`: UI panels, buttons, sliders, knobs.
- `rd_pro__spritesheet`: grouped game assets in a consistent style.
- `rd_pro__typography`: title/logo/button text experiments.
- `rd_fast__character_turnaround`: fast turnaround sheet.
- `rd_plus__character_turnaround`: cleaner turnaround sheet.
- `rd_plus__skill_icon`: 16-128px card/skill icons.
- `rd_animation__walking_and_idle`: 48x48 four-direction walking + idle GIF or spritesheet.
- `rd_advanced_animation__idle`: animate an uploaded starting frame.
- `rd_advanced_animation__attack`: attack sequence from an uploaded neutral frame.
- `rd_advanced_animation__custom_action`: custom action, useful for mop swing or sweat/wipe idle.

## Practical recommendation

Use Retro Diffusion for:

- final or near-final character animation sheets;
- card icons and skill art;
- UI component sheets;
- clean background/UI rebuilds after a concept image is approved.

Use Pixellab only when its character-object workflow is faster, or when we need a quick consistent batch.

For Godot and web, prefer PNG spritesheets over GIF. GIF is good for preview, but spritesheets are easier to control in both runtimes.
