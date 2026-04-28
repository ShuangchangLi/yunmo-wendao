# 山海问道 Godot Prototype

This is the Godot migration track for the existing web MVP.

## Goal

Build a small vertical slice before fully moving development from Web to Godot:

- Main menu
- Character selection
- One short three-fight run
- Card hand UI
- Enemy intent
- Rewards
- Completion screen

## Open

Open the `godot/` folder in Godot 4.x.

The main scene is:

```text
res://scenes/main.tscn
```

## Structure

- `data/`: data-driven cards, classes, enemies, keywords
- `scenes/`: Godot scenes
- `scripts/`: runtime logic and UI generation

This prototype is intentionally code-driven so future changes can be made through chat-driven edits rather than manual drag-and-drop.
