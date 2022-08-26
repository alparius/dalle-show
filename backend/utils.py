import base64
from io import BytesIO
import math
import string

from prompt_filtering import filter_prompt
from prompt_translation import translate_prompt
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


def preprocess_prompt(raw_prompt):
    translated_prompt = translate_prompt(raw_prompt)
    filtered_prompt = filter_prompt(translated_prompt)
    return filtered_prompt


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
