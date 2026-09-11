from rembg import remove
from PIL import Image
from PIL.Image import Image as PILImage
from typing import cast

input_path = "apps/web/static/logo-alone-sepharstudios.png"
output_path = "apps/web/static/logo-alone-sepharstudios-bgless.png"

try:
    print("Removing background with rembg...")
    input_image = Image.open(input_path)
    # rembg.remove() is overloaded across bytes / ndarray / PIL Image and its
    # return type is the union of all three, so the checker cannot tell that a
    # PIL input yields a PIL output. Narrow explicitly rather than leaving a
    # `.save` that only *happens* to exist at runtime.
    output_image = cast(PILImage, remove(input_image))
    output_image.save(output_path)
    print(f"Successfully saved transparent logo to {output_path}")
except Exception as e:
    print(f"Error: {e}")
