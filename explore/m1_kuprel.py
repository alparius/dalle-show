import argparse
from PIL import Image
import time
import string
import torch

from min_dalle import MinDalle


### EXECUTE ME BY: python m1_kuprel.py --text='neon giraffe in a rave club' --grid-size=3   

parser = argparse.ArgumentParser()

parser.add_argument('--mega', action='store_true')
parser.add_argument('--no-mega', dest='mega', action='store_false')
parser.set_defaults(mega=False)

parser.add_argument('--text', type=str, default='Dali painting of WALL·E')
parser.add_argument('--seed', type=int, default=-1)
parser.add_argument('--grid-size', type=int, default=1)


def save_image(image: Image.Image, prompt: str):
    valid_chars = "-_ %s%s" % (string.ascii_letters, string.digits)
    filename = "".join(c for c in prompt if c in valid_chars)
    path =  filename[:50] + '.jpeg'
    print("saving image to", path)
    image.save("images/" + path)
    return


if __name__ == '__main__':
    args = parser.parse_args()
    print(args)

    start = time.time()

    model = MinDalle(
        is_verbose=True,
        is_reusable=False,
        device='cuda',
        models_root='../backend/pretrained',
        is_mega=args.mega, 
        dtype=torch.bfloat16, # float32, float16
    )

    image = model.generate_image(
        is_verbose=True,
        text=args.text,
        seed=args.seed,
        grid_size=args.grid_size,
        
        is_seamless=False,
        temperature=1,
        top_k=256,
        supercondition_factor=32
    )
    save_image(image, image_path=args.image_path, text=args.text)

    end = time.time()
    print(end - start)
