from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs("public", exist_ok=True)

def make_icon(size):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.ellipse([0, 0, size, size], fill=(79, 70, 229))
    font_size = int(size * 0.5)
    try:
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        font = ImageFont.load_default()
    text = "E"
    bbox = draw.textbbox((0, 0), text, font=font)
    x = (size - (bbox[2] - bbox[0])) // 2 - bbox[0]
    y = (size - (bbox[3] - bbox[1])) // 2 - bbox[1]
    draw.text((x, y), text, fill="white", font=font)
    return img

sizes_ico = [256, 128, 64, 48, 32, 16]
images_ico = [make_icon(s) for s in sizes_ico]
images_ico[0].save("public/icon.ico", format="ICO", sizes=[(s, s) for s in sizes_ico])
print("icon.ico created")

make_icon(192).save("public/icon-192.png", format="PNG")
print("icon-192.png created")

make_icon(512).save("public/icon-512.png", format="PNG")
print("icon-512.png created")