#!/bin/bash
set -e

# ====== CONFIG ======
INPUT_GLTF="scene.gltf"
INPUT_DIR="cyborg_with_thermal_katana"
OUTPUT_DIR="optimized_output"
DESKTOP_RES=2048
MOBILE_RES=512

mkdir -p "$OUTPUT_DIR/textures/desktop"
mkdir -p "$OUTPUT_DIR/textures/mobile"

echo "🔹 Step 1: Converting & resizing textures..."

for tex in "$INPUT_DIR"/textures/*.{png,jpg,jpeg}; do
  [ -e "$tex" ] || continue

  filename=$(basename "$tex" | sed 's/\.[^.]*$//')

  # Desktop textures (2K, WebP)
  magick "$tex" -resize ${DESKTOP_RES}x${DESKTOP_RES} "$OUTPUT_DIR/textures/desktop/${filename}.webp"

  # Mobile textures (512px, WebP)
  magick "$tex" -resize ${MOBILE_RES}x${MOBILE_RES} "$OUTPUT_DIR/textures/mobile/${filename}.webp"

done

echo "✅ Textures optimized (Desktop & Mobile WebP created)"

# ====== STEP 2: Pack into GLB ======
echo "🔹 Step 2: Converting GLTF to GLB..."
gltf-pipeline -i "$INPUT_DIR/$INPUT_GLTF" -o "$OUTPUT_DIR/scene.glb"

# ====== STEP 3: Optimize with gltfpack ======
echo "🔹 Step 3: Applying Draco compression & simplification..."

# Desktop version (keep detail, compress + Draco)
gltfpack -i "$OUTPUT_DIR/scene.glb" -o "$OUTPUT_DIR/scene_desktop.glb" -cc -tc

# Mobile version (simplify geometry, reduce textures)
gltfpack -i "$OUTPUT_DIR/scene.glb" -o "$OUTPUT_DIR/scene_mobile.glb" -cc -tc -si 0.5

echo "✅ Optimization complete!"
echo "Output files in: $OUTPUT_DIR"
