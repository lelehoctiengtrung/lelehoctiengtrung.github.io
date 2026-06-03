import os
from PIL import Image, ImageFilter, ImageDraw

BACKGROUND_PATH = "/Users/hanario/.gemini/antigravity/brain/7333c671-7bce-417f-bd42-11db42e4ead4/oak_desk_background_1780473455627.png"
COVER_PATH = "POSTS/images/SPE-0001_cover.png"
PAGE1_PATH = "POSTS/images/SPE-0001_page1.png"
PAGE2_PATH = "POSTS/images/SPE-0001_page2.png"

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
    Pasts the foreground image onto the background image with a drop shadow and rotation.
    """
    # 1. Add white border to foreground image to make it look like a physical print
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
        
    # 5. Paste onto background at the specified position (adjusting for combined canvas size offset)
    # Centered alignment logic
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
        
    print("Creating programmatically composed mockups...")
    
    # --- 1. COVER MOCKUP ---
    bg = Image.open(BACKGROUND_PATH).copy()
    cover = Image.open(COVER_PATH)
    # The cover is square 1200x1200px, let's resize it to 480x480px
    cover_resized = cover.resize((480, 480), Image.Resampling.LANCZOS)
    
    # Position: Left-Center of the table (x=450, y=512)
    # Rotate slightly -2 degrees for organic look
    mockup1 = paste_with_shadow_and_rotate(bg, cover_resized, (450, 512), angle=-2)
    mockup1.save("POSTS/images/SPE-0001_mockup.png", "PNG")
    mockup1.save("spe0001.png", "PNG")
    print("Saved Cover Mockup: POSTS/images/SPE-0001_mockup.png and spe0001.png")
    
    # --- 2. PAGE 1 MOCKUP ---
    bg = Image.open(BACKGROUND_PATH).copy()
    page1 = Image.open(PAGE1_PATH)
    # Page 1 is 1352x1904px, let's resize it to 420x590px (aspect ratio kept)
    page1_resized = page1.resize((410, 580), Image.Resampling.LANCZOS)
    
    # Position: Left-Center (x=450, y=512), rotate 3 degrees
    mockup2 = paste_with_shadow_and_rotate(bg, page1_resized, (440, 512), angle=2)
    mockup2.save("POSTS/images/SPE-0001_page1.png", "PNG")
    print("Saved Page 1 Mockup: POSTS/images/SPE-0001_page1.png")
    
    # --- 3. PAGE 2 MOCKUP ---
    bg = Image.open(BACKGROUND_PATH).copy()
    page2 = Image.open(PAGE2_PATH)
    # Page 2 is 1341x1531px, let's resize to 430x490px
    page2_resized = page2.resize((430, 490), Image.Resampling.LANCZOS)
    
    # Position: Left-Center (x=450, y=512), rotate -3 degrees
    mockup3 = paste_with_shadow_and_rotate(bg, page2_resized, (440, 512), angle=-3)
    mockup3.save("POSTS/images/SPE-0001_page2.png", "PNG")
    print("Saved Page 2 Mockup: POSTS/images/SPE-0001_page2.png")
    
    print("All mockups programmatically generated successfully!")

if __name__ == "__main__":
    main()
