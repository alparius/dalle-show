import argparse
from PIL import Image
from min_dalle import MinDalle
import time

import numpy as np

import cv2


parser = argparse.ArgumentParser()
parser.add_argument('--mega', action='store_true')
parser.add_argument('--no-mega', dest='mega', action='store_false')
parser.set_defaults(mega=False)
parser.add_argument('--text', type=str, default='Dali painting of WALL·E')
parser.add_argument('--seed', type=int, default=-1)
parser.add_argument('--grid-size', type=int, default=1)
parser.add_argument('--image-path', type=str, default='generated')
parser.add_argument('--models-root', type=str, default='pretrained')


def save_img_blocks(img, xPieces=3, yPieces=3):
    imgwidth, imgheight = img.size
    height = imgheight // yPieces
    width = imgwidth // xPieces
    for i in range(0, yPieces):
        for j in range(0, xPieces):
            box = (j * width, i * height, (j + 1) * width, (i + 1) * height)
            a = img.crop(box)
            try:
                a.save("image-blocks/" + "block-" + str(i) + "-" + str(j) + ".jpg")
            except:
                pass

def save_image(image: Image.Image, path: str, prompt: str):
    path = prompt + '.jpg'
    print("saving image to", path)
    image.save("images/" + path)
    save_img_blocks(image)
    return


def generate_image(
    is_mega: bool,
    text: str,
    seed: int,
    grid_size: int,
    image_path: str,
    models_root: str
):
    model = MinDalle(
        is_mega=is_mega, 
        models_root=models_root,
        is_reusable=False,
        is_verbose=True
    )

    image = model.generate_image(
        text,
        seed,
        grid_size,
        is_verbose=True,
        log2_supercondition_factor=5,
        log2_k=6
    )
    save_image(image, image_path, text)


if __name__ == '__main__':
    start = time.time()
    args = parser.parse_args()
    print(args)
    generate_image(
        is_mega=args.mega,
        text=args.text,
        seed=args.seed,
        grid_size=args.grid_size,
        image_path=args.image_path,
        models_root=args.models_root
    )
    end = time.time()
    print(end - start)