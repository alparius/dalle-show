import base64
from io import BytesIO
import string

import config



VALID_CHARS = "-_ %s%s" % (string.ascii_letters, string.digits)

def grid_to_images(image_grid):
    imgwidth, imgheight = image_grid.size
    height = imgheight // config.GRID_SIZE
    width = imgwidth // config.GRID_SIZE

    images = []
    for i in range(0, config.GRID_SIZE):
        for j in range(0, config.GRID_SIZE):
            box = (j * width, i * height, (j + 1) * width, (i + 1) * height)
            img = image_grid.crop(box)
            images.append(img)
    return images


def encode_images(images):
    encoded_images = []
    for img in images:
        buffered = BytesIO()
        img.save(buffered, format=config.IMAGE_FORMAT)
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        encoded_images.append(img_str)
    return encoded_images
