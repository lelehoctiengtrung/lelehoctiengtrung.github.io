# -*- coding: utf-8 -*-
import os
import shutil
from PIL import Image, ImageFilter, ImageDraw

BACKGROUND_PATH = "/home/vpsg16gb/.gemini/antigravity-cli/brain/50026571-1a23-4183-b767-790269f48196/oak_desk_background_1780910697430.png"
IMAGES_DIR = "POSTS/images"

COVER_FLAT = os.path.join(IMAGES_DIR, "DOC-COSO1_cover_flat.png")
PAGE3_FLAT = os.path.join(IMAGES_DIR, "DOC-COSO1_page3_flat.png")
PAGE8_FLAT = os.path.join(IMAGES_DIR, "DOC-COSO1_page8_flat.png")

def create_drop_shadow(image_size, offset=(10, 15), blur_radius=20, opacity=120):
    """
    Creates a drop shadow image of the given size.
    """
    w, h = image_size
    shadow_w = w + blur_radius * 2 + abs(offset[0])
    shadow_h = h + blur_radius * 2 + abs(offset[1])
    
    # Create transparent canvas
    shadow = Image.new("RGBA", (shadow_w, shadow_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(shadow)
    
    # Calculate box coordinates for the shadow shape
    x0 = blur_radius + (offset[0] if offset[0] > 0 else 0)
    y0 = blur_radius + (offset[1] if offset[1] > 0 else 0)
    x1 = x0 + w
    y1 = y0 + h
    
    # Draw filled rectangle for the shadow
    draw.rectangle([x0, y0, x1, y1], fill=(0, 0, 0, opacity))
    
    # Apply Gaussian blur
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur_radius))
    return shadow, (x0 - blur_radius, y0 - blur_radius)

def paste_with_shadow_and_rotate(bg, fg, position, angle=0):
    """
    Pastes the foreground image onto the background image with a drop shadow and rotation.
    """
    # 1. Add white border to foreground image to make it look like a physical paper print
    border_width = 8
    fg_w, fg_h = fg.size
    fg_with_border = Image.new("RGB", (fg_w + border_width * 2, fg_h + border_width * 2), (255, 255, 255))
    fg_with_border.paste(fg, (border_width, border_width))
    
    # 2. Create the drop shadow for the bordered image
    shadow, shadow_offset = create_drop_shadow(fg_with_border.size, offset=(8, 12), blur_radius=15, opacity=100)
    
    # 3. Create a canvas for the bordered image + shadow
    fg_w, fg_h = fg_with_border.size
    shadow_w, shadow_h = shadow.size
    
    combined = Image.new("RGBA", (shadow_w, shadow_h), (0, 0, 0, 0))
    # Paste shadow first
    combined.paste(shadow, (0, 0))
    # Paste bordered image over it
    combined.paste(fg_with_border.convert("RGBA"), (abs(shadow_offset[0]), abs(shadow_offset[1])))
    
    # 4. Rotate if needed
    if angle != 0:
        combined = combined.rotate(angle, resample=Image.BICUBIC, expand=True)
        
    # 5. Paste onto background at the specified position
    bg_w, bg_h = bg.size
    comb_w, comb_h = combined.size
    
    paste_x = position[0] - comb_w // 2
    paste_y = position[1] - comb_h // 2
    
    bg.paste(combined, (paste_x, paste_y), combined)
    return bg

def main():
    if not os.path.exists(BACKGROUND_PATH):
        print(f"Error: Background image not found at {BACKGROUND_PATH}")
        return
        
    print("Creating programmatically composed mockups for Basic Han 1...")
    
    # Check if files exist
    for f in [COVER_FLAT, PAGE3_FLAT, PAGE8_FLAT]:
        if not os.path.exists(f):
            print(f"Error: Required file does not exist: {f}")
            return

    # Background size check
    bg_img = Image.open(BACKGROUND_PATH)
    bg_w, bg_h = bg_img.size
    print(f"Background image size: {bg_w}x{bg_h}")
    center_x = bg_w // 2
    center_y = bg_h // 2
    
    # Target size for A4 pages in mockup: 420x594px (fits A4 aspect ratio 1:1.414)
    target_w, target_h = 420, 594

    # 1. COVER MOCKUP (DOC-COSO1_mockup.png)
    bg = Image.open(BACKGROUND_PATH).copy()
    cover = Image.open(COVER_FLAT)
    cover_resized = cover.resize((target_w, target_h), Image.Resampling.LANCZOS)
    mockup1 = paste_with_shadow_and_rotate(bg, cover_resized, (center_x, center_y), angle=-3)
    out1 = os.path.join(IMAGES_DIR, "DOC-COSO1_mockup.png")
    mockup1.save(out1, "PNG")
    print(f"Saved Cover Mockup: {out1}")
    
    # 2. PAGE 3 MOCKUP (DOC-COSO1_page3.png)
    bg = Image.open(BACKGROUND_PATH).copy()
    page3 = Image.open(PAGE3_FLAT)
    page3_resized = page3.resize((target_w, target_h), Image.Resampling.LANCZOS)
    mockup2 = paste_with_shadow_and_rotate(bg, page3_resized, (center_x, center_y), angle=2)
    out2 = os.path.join(IMAGES_DIR, "DOC-COSO1_page3.png")
    mockup2.save(out2, "PNG")
    print(f"Saved Page 3 Mockup: {out2}")
    
    # 3. PAGE 8 MOCKUP (DOC-COSO1_page8.png)
    bg = Image.open(BACKGROUND_PATH).copy()
    page8 = Image.open(PAGE8_FLAT)
    page8_resized = page8.resize((target_w, target_h), Image.Resampling.LANCZOS)
    mockup3 = paste_with_shadow_and_rotate(bg, page8_resized, (center_x, center_y), angle=-2)
    out3 = os.path.join(IMAGES_DIR, "DOC-COSO1_page8.png")
    mockup3.save(out3, "PNG")
    print(f"Saved Page 8 Mockup: {out3}")
    
    print("All Basic Han 1 mockups programmatically generated successfully!")

if __name__ == "__main__":
    main()
