from PIL import Image, ImageDraw, ImageFont
import os

sizes = [256, 128, 64, 48, 32, 16]
images = []

for size in sizes:
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
    images.append(img)

os.makedirs("public", exist_ok=True)
images[0].save("public/icon.ico", format="ICO", sizes=[(s, s) for s in sizes])
print("icon.ico created successfully")