import sys
from PIL import Image

def remove_background(input_path, output_path):
    print("Loading image...")
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    w, h = img.size
    print(f"Image size: {w}x{h}")
    
    corners = [
        img.getpixel((0, 0)),
        img.getpixel((w-1, 0)),
        img.getpixel((0, h-1)),
        img.getpixel((w-1, h-1))
    ]
    
    # Assume the top-left corner is the background color
    bg_color = corners[0]
    print(f"Detected background color: {bg_color}")
    
    new_data = []
    # threshold for similarity
    threshold = 30
    for item in datas:
        # Check if pixel is close to background color
        if abs(item[0] - bg_color[0]) < threshold and abs(item[1] - bg_color[1]) < threshold and abs(item[2] - bg_color[2]) < threshold:
            # Check if it has an alpha channel, replace with fully transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Successfully saved {output_path}")

try:
    remove_background("apps/web/static/logo-alone-sepharstudios.png", "apps/web/static/logo-alone-sepharstudios.png")
except Exception as e:
    print(f"An error occurred: {e}")
