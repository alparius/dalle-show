import base64
from io import BytesIO
from os import listdir
from os.path import join
import string
import time
import math
import numpy as np
from PIL import Image

import config



VALID_CHARS = "-_ %s%s" % (string.ascii_letters, string.digits)


def encode_images(images):
    encoded_images = []
    for img in images:
        buffered = BytesIO()
        img.save(buffered, format=config.IMAGE_FORMAT)
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        encoded_images.append(img_str)
    return encoded_images


def separate_grid(image):
    grid_size = int(math.sqrt(config.NR_IMAGES))
    imgwidth, imgheight = image.size
    height = imgheight // grid_size
    width = imgwidth // grid_size

    separated_images = []
    for i in range(0, grid_size):
        for j in range(0, grid_size):
            box = (j * width, i * height, (j + 1) * width, (i + 1) * height)
            separated_images.append(image.crop(box))

    return separated_images


def numpy_to_pil(images):
    """ Convert a numpy image or a batch of images to a PIL image.
    """
    if images.ndim == 3:
        images = images[None, ...]
    images = (images * 255).round().astype("uint8")
    pil_images = [Image.fromarray(image) for image in images]
    return pil_images


def get_seed():
    if config.IMAGE_SEED is None:
        return np.random.randint(1, 65535)
    else:
        return config.IMAGE_SEED


def yield_potato():
    time.sleep(3)
    datapath = "./static/blueberry"
    files = listdir(datapath)
    for file in sorted(files):
        time.sleep(0.25)
        img = Image.open(join(datapath, file))
        yield [img]
