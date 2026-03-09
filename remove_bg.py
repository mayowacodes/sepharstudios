from rembg import remove
from PIL import Image
import os

input_path = "apps/web/static/logo-alone-sepharstudios.png"
output_path = "apps/web/static/logo-alone-sepharstudios-bgless.png"

try:
    print("Removing background with rembg...")
    input_image = Image.open(input_path)
    output_image = remove(input_image)
    output_image.save(output_path)
    print(f"Successfully saved transparent logo to {output_path}")
except Exception as e:
    print(f"Error: {e}")
