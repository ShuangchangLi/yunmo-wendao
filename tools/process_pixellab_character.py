"""Process a Pixellab character export ZIP into game-ready assets.

For each ZIP, output:
  - {out_dir}/{name}.png            : single south rotation (static portrait, 136x136)
  - {out_dir}/{name}-idle-strip.png : horizontal sprite strip of all south idle frames

Usage:
  py tools/process_pixellab_character.py <zip_path> <out_dir> <name> [--anim NAME]

  --anim    Pick a specific animation by folder name (defaults to first one found).

The Pixellab ZIP layout (export_version 2.0):
  metadata.json
  rotations/{south,east,north,west}.png
  animations/{anim-id}/{direction}/frame_NNN.png
"""
from __future__ import annotations

import argparse
import json
import shutil
import sys
import tempfile
import zipfile
from pathlib import Path

from PIL import Image


def stitch_horizontal(frame_paths: list[Path], out_path: Path) -> tuple[int, int]:
    frames = [Image.open(p).convert("RGBA") for p in frame_paths]
    max_w = max(f.width for f in frames)
    max_h = max(f.height for f in frames)
    strip = Image.new("RGBA", (max_w * len(frames), max_h), (0, 0, 0, 0))
    for i, frame in enumerate(frames):
        strip.paste(frame, (i * max_w, 0), frame)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    strip.save(out_path, "PNG")
    return max_w, max_h


def process(zip_path: Path, out_dir: Path, name: str, anim_choice: str | None) -> dict:
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        with zipfile.ZipFile(zip_path) as zf:
            zf.extractall(tmp_path)

        meta_path = tmp_path / "metadata.json"
        meta = json.loads(meta_path.read_text(encoding="utf-8"))

        south_rot = tmp_path / meta["frames"]["rotations"]["south"]
        out_dir.mkdir(parents=True, exist_ok=True)
        portrait_out = out_dir / f"{name}.png"
        shutil.copyfile(south_rot, portrait_out)

        anims = meta["frames"].get("animations", {})
        if not anims:
            return {
                "portrait": str(portrait_out),
                "strip": None,
                "frames": 0,
            }

        anim_keys = list(anims.keys())
        if anim_choice and anim_choice in anims:
            anim_key = anim_choice
        else:
            anim_key = anim_keys[0]

        south_frames = anims[anim_key].get("south", [])
        if not south_frames:
            return {
                "portrait": str(portrait_out),
                "strip": None,
                "frames": 0,
                "warning": f"animation '{anim_key}' has no south frames",
            }

        frame_paths = [tmp_path / rel for rel in south_frames]
        strip_out = out_dir / f"{name}-idle-strip.png"
        frame_w, frame_h = stitch_horizontal(frame_paths, strip_out)

        return {
            "portrait": str(portrait_out),
            "strip": str(strip_out),
            "frames": len(frame_paths),
            "frame_size": [frame_w, frame_h],
            "animation": anim_key,
        }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("zip_path", type=Path)
    parser.add_argument("out_dir", type=Path)
    parser.add_argument("name", type=str)
    parser.add_argument("--anim", type=str, default=None)
    args = parser.parse_args()

    if not args.zip_path.is_file():
        print(f"error: {args.zip_path} is not a file", file=sys.stderr)
        return 2

    result = process(args.zip_path, args.out_dir, args.name, args.anim)
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
