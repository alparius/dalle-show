import math
from min_dalle import MinDalle
import torch
import requests
import os

import config
import utils



class ImageModel:

    def __init__(self) -> None:
        self.is_verbose = True

        self.model = MinDalle(
            device='cuda',
            is_reusable=True,
            is_verbose=self.is_verbose,
            models_root=config.IMAGE_MODEL_ROOT,
            is_mega=config.DALLE_IS_MEGA,
            dtype=torch.float32,
        )
        print("---> DALL-E Model initialized")

    def generate_images(self, text: str, seed: int):
        with torch.no_grad():
            image_grid = self.model.generate_image(
                text,
                seed=seed,
                grid_size=int(math.sqrt(config.NR_IMAGES)),
                is_verbose=self.is_verbose,
                is_seamless=False,
                temperature=1,
                top_k=256,
                supercondition_factor=8
            )
        return utils.separate_grid(image_grid)


def download_kuprel_models():
    MIN_DALLE_REPO = 'https://huggingface.co/kuprel/min-dalle/resolve/main/'
    suffix = '' if config.DALLE_IS_MEGA else '_mini'
    model_name = 'dalle_bart_{}'.format('mega' if config.DALLE_IS_MEGA else 'mini')

    dalle_path = os.path.join(config.IMAGE_MODEL_ROOT, model_name)
    if not os.path.exists(dalle_path): os.makedirs(dalle_path)
    vqgan_path = os.path.join(config.IMAGE_MODEL_ROOT, 'vqgan')
    if not os.path.exists(vqgan_path): os.makedirs(vqgan_path)

    vocab = requests.get(MIN_DALLE_REPO + 'vocab{}.json'.format(suffix))
    merges = requests.get(MIN_DALLE_REPO + 'merges{}.txt'.format(suffix))
    vocab_path = os.path.join(dalle_path, 'vocab.json')
    merges_path = os.path.join(dalle_path, 'merges.txt')
    is_downloaded = os.path.exists(vocab_path)
    is_downloaded &= os.path.exists(merges_path)
    if not is_downloaded:
        print("---> downloading tokenizer params")
        _ = requests.get(MIN_DALLE_REPO + 'config.json') # trigger HF download
        with open(vocab_path, 'wb') as f: f.write(vocab.content)
        with open(merges_path, 'wb') as f: f.write(merges.content)
    
    encoder_params_path = os.path.join(dalle_path, 'encoder.pt')
    is_downloaded = os.path.exists(encoder_params_path)
    if not is_downloaded:
        print("---> downloading encoder params")
        params = requests.get(MIN_DALLE_REPO + 'encoder{}.pt'.format(suffix))
        with open(encoder_params_path, 'wb') as f: f.write(params.content)

    decoder_params_path = os.path.join(dalle_path, 'decoder.pt')
    is_downloaded = os.path.exists(decoder_params_path)
    if not is_downloaded:
        print("---> downloading decoder params")
        params = requests.get(MIN_DALLE_REPO + 'decoder{}.pt'.format(suffix))
        with open(decoder_params_path, 'wb') as f: f.write(params.content)

    detoker_params_path = os.path.join(vqgan_path, 'detoker.pt')
    is_downloaded = os.path.exists(detoker_params_path)
    if not is_downloaded:
        print("---> downloading detokenizer params")
        params = requests.get(MIN_DALLE_REPO + 'detoker.pt')
        with open(detoker_params_path, 'wb') as f: f.write(params.content)
