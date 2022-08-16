import base64
from io import BytesIO
import string
from PIL import Image

import config



VALID_CHARS = "-_ %s%s" % (string.ascii_letters, string.digits)


def encode_image_grid(image: Image):
    imgwidth, imgheight = image.size
    height = imgheight // config.GRID_SIZE
    width = imgwidth // config.GRID_SIZE

    encoded_images = []
    for i in range(0, config.GRID_SIZE):
        for j in range(0, config.GRID_SIZE):
            box = (j * width, i * height, (j + 1) * width, (i + 1) * height)
            img = image.crop(box)
            
            buffered = BytesIO()
            img.save(buffered, format=config.IMAGE_FORMAT)
            img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
            encoded_images.append(img_str)

    return encoded_images

