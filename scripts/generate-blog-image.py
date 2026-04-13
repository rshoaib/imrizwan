#!/usr/bin/env python3
"""
Generate branded blog post hero images for imrizwan.com.

Usage:
    python scripts/generate-blog-image.py <image-filename> <category> <title>

Example:
    python scripts/generate-blog-image.py microsoft-graph-toolkit-web-apps-guide-2026.png "Microsoft 365" "Microsoft Graph Toolkit: Build M365-Powered Web Apps"

Generates a 640x640 dark-themed tech illustration with:
- Category-specific gradient background and accent color
- Post title rendered with word wrapping
- Decorative grid pattern and geometric accents
- Consistent branding across all categories
"""

import sys
import os
import math
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Category color schemes: (bg_dark, bg_mid, accent, accent_light)
CATEGORY_COLORS = {
    "SPFx": {
        "bg_dark": (15, 23, 42),
        "bg_mid": (25, 40, 65),
        "accent": (0, 200, 220),
        "accent_light": (80, 230, 245),
        "icon_label": "SPFx",
    },
    "Power Platform": {
        "bg_dark": (25, 15, 42),
        "bg_mid": (45, 25, 65),
        "accent": (160, 80, 255),
        "accent_light": (190, 130, 255),
        "icon_label": "Power",
    },
    "SharePoint": {
        "bg_dark": (15, 30, 42),
        "bg_mid": (20, 50, 70),
        "accent": (0, 160, 200),
        "accent_light": (60, 200, 240),
        "icon_label": "SP",
    },
    "Microsoft 365": {
        "bg_dark": (20, 20, 35),
        "bg_mid": (35, 35, 60),
        "accent": (0, 180, 160),
        "accent_light": (60, 220, 200),
        "icon_label": "M365",
    },
}

WIDTH = 640
HEIGHT = 640


def lerp_color(c1, c2, t):
    """Linear interpolation between two colors."""
    return tuple(int(a + (b - a) * t) for a, b in zip(c1, c2))


def draw_gradient_background(draw, colors):
    """Draw a radial-ish gradient background."""
    bg_dark = colors["bg_dark"]
    bg_mid = colors["bg_mid"]
    for y in range(HEIGHT):
        t = y / HEIGHT
        # Vertical gradient from mid (top) to dark (bottom)
        c = lerp_color(bg_mid, bg_dark, t * t)
        draw.line([(0, y), (WIDTH, y)], fill=c)


def draw_dot_grid(draw, colors):
    """Draw a subtle dot grid pattern."""
    accent = colors["accent"]
    dot_color = (accent[0] // 6, accent[1] // 6, accent[2] // 6)
    spacing = 24
    for x in range(0, WIDTH, spacing):
        for y in range(0, HEIGHT, spacing):
            draw.ellipse([x - 1, y - 1, x + 1, y + 1], fill=dot_color)


def draw_decorative_elements(draw, colors, seed=42):
    """Draw floating geometric shapes as decorative accents."""
    rng = random.Random(seed)
    accent = colors["accent"]
    accent_light = colors["accent_light"]

    # Draw diamond shapes scattered around
    for _ in range(8):
        cx = rng.randint(40, WIDTH - 40)
        cy = rng.randint(40, HEIGHT - 40)
        size = rng.randint(6, 14)
        alpha_factor = rng.uniform(0.3, 0.9)
        c = tuple(int(v * alpha_factor) for v in accent_light)
        points = [(cx, cy - size), (cx + size, cy), (cx, cy + size), (cx - size, cy)]
        draw.polygon(points, fill=c)

    # Draw a few thin accent lines
    for _ in range(3):
        x1 = rng.randint(0, WIDTH)
        y1 = rng.randint(0, HEIGHT)
        length = rng.randint(40, 120)
        angle = rng.uniform(0, math.pi * 2)
        x2 = x1 + int(length * math.cos(angle))
        y2 = y1 + int(length * math.sin(angle))
        line_color = (accent[0] // 3, accent[1] // 3, accent[2] // 3)
        draw.line([(x1, y1), (x2, y2)], fill=line_color, width=1)


def draw_code_window(draw, colors, y_offset=180):
    """Draw a stylized code editor window in the center."""
    accent = colors["accent"]
    accent_light = colors["accent_light"]
    bg_dark = colors["bg_dark"]

    # Window frame
    wx, wy = 100, y_offset
    ww, wh = 440, 220
    border_color = (accent[0] // 2, accent[1] // 2, accent[2] // 2)

    # Outer glow
    for i in range(4, 0, -1):
        glow = tuple(max(0, c // (6 - i)) for c in accent)
        draw.rounded_rectangle(
            [wx - i, wy - i, wx + ww + i, wy + wh + i],
            radius=12,
            outline=glow,
            width=1,
        )

    # Window background
    win_bg = (bg_dark[0] + 15, bg_dark[1] + 15, bg_dark[2] + 25)
    draw.rounded_rectangle([wx, wy, wx + ww, wy + wh], radius=10, fill=win_bg)

    # Title bar
    title_bar_bg = (bg_dark[0] + 8, bg_dark[1] + 8, bg_dark[2] + 15)
    draw.rounded_rectangle(
        [wx, wy, wx + ww, wy + 30], radius=10, fill=title_bar_bg
    )
    draw.rectangle([wx, wy + 20, wx + ww, wy + 30], fill=title_bar_bg)

    # Traffic light dots
    dot_colors = [(255, 95, 87), (255, 189, 46), (39, 201, 63)]
    for i, dc in enumerate(dot_colors):
        cx = wx + 20 + i * 18
        cy = wy + 15
        draw.ellipse([cx - 5, cy - 5, cx + 5, cy + 5], fill=dc)

    # Fake code lines
    code_y = wy + 45
    line_configs = [
        (0.7, accent),
        (0.5, accent_light),
        (0.85, accent),
        (0.4, (accent_light[0], accent_light[1] // 2, accent_light[2])),
        (0.6, accent),
        (0.3, accent_light),
    ]
    for i, (width_frac, color) in enumerate(line_configs):
        lx = wx + 30
        ly = code_y + i * 26
        lw = int((ww - 60) * width_frac)
        # Dim the color for code lines
        line_color = tuple(max(20, c // 2 + 30) for c in color)
        draw.rounded_rectangle([lx, ly, lx + lw, ly + 10], radius=4, fill=line_color)

        # Bullet dot
        dot_c = tuple(min(255, c + 40) for c in color)
        draw.ellipse([lx - 14, ly + 1, lx - 6, ly + 9], outline=dot_c, width=1)


def draw_category_badge(draw, colors, font_path=None):
    """Draw a category badge in the top-right area."""
    label = colors["icon_label"]
    accent = colors["accent"]
    bg_dark = colors["bg_dark"]

    # Badge position
    bx, by = WIDTH - 110, 60
    bw, bh = 70, 40

    badge_bg = (accent[0] // 4, accent[1] // 4, accent[2] // 4)
    draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=8, fill=badge_bg, outline=accent, width=2)

    # Try to render text centered in badge
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)
    except:
        font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), label, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    tx = bx + (bw - tw) // 2
    ty = by + (bh - th) // 2
    draw.text((tx, ty), label, fill=accent, font=font)


def wrap_text(text, font, max_width, draw):
    """Wrap text to fit within max_width."""
    words = text.split()
    lines = []
    current_line = ""
    for word in words:
        test = f"{current_line} {word}".strip()
        bbox = draw.textbbox((0, 0), test, font=font)
        if bbox[2] - bbox[0] <= max_width:
            current_line = test
        else:
            if current_line:
                lines.append(current_line)
            current_line = word
    if current_line:
        lines.append(current_line)
    return lines


def draw_title(draw, title, colors):
    """Draw the post title at the bottom of the image."""
    accent_light = colors["accent_light"]

    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 26)
    except:
        font_large = ImageFont.load_default()

    # Strip year suffix in parens for cleaner display
    display_title = title
    if display_title.endswith(")"):
        paren_idx = display_title.rfind("(")
        if paren_idx > 0:
            inner = display_title[paren_idx + 1 : -1].strip()
            if inner.isdigit() and len(inner) == 4:
                display_title = display_title[:paren_idx].strip()

    # Remove subtitle after colon if title is very long
    if len(display_title) > 50 and ":" in display_title:
        parts = display_title.split(":", 1)
        display_title = parts[0].strip()
        subtitle = parts[1].strip()
    else:
        subtitle = None

    lines = wrap_text(display_title, font_large, WIDTH - 80, draw)

    # Position from bottom
    line_height = 34
    total_height = len(lines) * line_height + (28 if subtitle else 0)
    start_y = HEIGHT - 60 - total_height

    for i, line in enumerate(lines):
        y = start_y + i * line_height
        # Text shadow
        draw.text((42, y + 2), line, fill=(0, 0, 0), font=font_large)
        draw.text((40, y), line, fill=(240, 240, 250), font=font_large)

    if subtitle:
        try:
            font_sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
        except:
            font_sub = ImageFont.load_default()
        sub_y = start_y + len(lines) * line_height + 6
        sub_lines = wrap_text(subtitle, font_sub, WIDTH - 80, draw)
        for j, sl in enumerate(sub_lines):
            draw.text((42, sub_y + j * 24 + 2), sl, fill=(0, 0, 0), font=font_sub)
            draw.text((40, sub_y + j * 24), sl, fill=accent_light, font=font_sub)


def draw_bottom_bar(draw, colors):
    """Draw a subtle accent bar at the bottom."""
    accent = colors["accent"]
    bar_color = (accent[0] // 3, accent[1] // 3, accent[2] // 3)
    draw.rectangle([0, HEIGHT - 6, WIDTH, HEIGHT], fill=accent)


def generate_image(filename, category, title, output_dir="public/images/blog"):
    """Generate a blog hero image."""
    colors = CATEGORY_COLORS.get(category, CATEGORY_COLORS["Microsoft 365"])

    # Use title hash as seed for reproducible random elements
    seed = sum(ord(c) for c in title)

    img = Image.new("RGB", (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)

    draw_gradient_background(draw, colors)
    draw_dot_grid(draw, colors)
    draw_decorative_elements(draw, colors, seed=seed)
    draw_code_window(draw, colors, y_offset=140)
    draw_category_badge(draw, colors)
    draw_title(draw, title, colors)
    draw_bottom_bar(draw, colors)

    # Save
    output_path = os.path.join(output_dir, filename)
    os.makedirs(output_dir, exist_ok=True)
    img.save(output_path, "PNG", optimize=True)
    print(f"Generated: {output_path} ({WIDTH}x{HEIGHT})")
    return output_path


if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python generate-blog-image.py <filename.png> <category> <title>")
        print('Example: python generate-blog-image.py my-post.png "SPFx" "Building SPFx Web Parts"')
        sys.exit(1)

    filename = sys.argv[1]
    category = sys.argv[2]
    title = sys.argv[3]

    generate_image(filename, category, title)
