import os
import numpy as np
import clip
import torch
from functools import lru_cache
from PIL import Image
from better_profanity import profanity
import torch

import config


def prompt_profanity_check(prompt):
    profane = False
    if config.CHECK_PROMPT_FOR_PROFANITY:
        custom_badwords = ['hello', 'boris', 'palmer']
        profanity.add_censor_words(custom_badwords)
        if profanity.contains_profanity(prompt):
            print("Prompt contains profanity")
            profane = True
    return profane


@torch.no_grad()
@lru_cache(maxsize=None)
def load_safety_model(clip_model):
    """load the safety model"""
    import autokeras as ak  # pylint: disable=import-outside-toplevel
    from tensorflow.keras.models import load_model  # pylint: disable=import-outside-toplevel

    import tensorflow as tf

    physical_devices = tf.config.list_physical_devices('GPU')
    try:
        print(physical_devices)
        tf.config.experimental.set_memory_growth(physical_devices[0], True)
    except:
        pass # Invalid device or cannot modify virtual devices once initialized.

    cache_folder =  "./models_image/nsfw/" + clip_model.replace("/", "_")
    if clip_model == "ViT-L/14":
        model_dir = cache_folder + "/clip_autokeras_binary_nsfw"
        dim = 768
    elif clip_model == "ViT-B/32":
        model_dir = cache_folder + "/clip_autokeras_nsfw_b32"
        dim = 512
    else:
        raise ValueError("Unknown clip model")
    if not os.path.exists(model_dir):
        os.makedirs(cache_folder, exist_ok=True)

        from urllib.request import urlretrieve  # pylint: disable=import-outside-toplevel

        path_to_zip_file = cache_folder + "/clip_autokeras_binary_nsfw.zip"
        if clip_model == "ViT-L/14":
            url_model = "https://raw.githubusercontent.com/LAION-AI/CLIP-based-NSFW-Detector/main/clip_autokeras_binary_nsfw.zip"
        elif clip_model == "ViT-B/32":
            url_model = (
                "https://raw.githubusercontent.com/LAION-AI/CLIP-based-NSFW-Detector/main/clip_autokeras_nsfw_b32.zip"
            )
        else:
            raise ValueError("Unknown model {}".format(clip_model))
        urlretrieve(url_model, path_to_zip_file)
        import zipfile  # pylint: disable=import-outside-toplevel

        with zipfile.ZipFile(path_to_zip_file, "r") as zip_ref:
            zip_ref.extractall(cache_folder)

    loaded_model = load_model(model_dir, custom_objects=ak.CUSTOM_OBJECTS)

    return loaded_model


@torch.no_grad()
def filter_images(images, treshold):
    device = config.NSFW_DEVICE
    filtered_images = []
    nsfw_image_found = False
    for img in images:
        with torch.no_grad():
            image = preprocess(img).unsqueeze(0).to(device)
            image_features = clip_model.encode_image(image)
            image_features /= image_features.norm(dim=-1, keepdim=True)
            query = image_features.cpu().detach().numpy().astype("float32")
            nsfw_value = safety_model.predict(query)
        if nsfw_value < treshold:
            filtered_images.append(img)
        else:
            filtered_images.append(Image.open("./static/grey.jpeg"))
            nsfw_image_found = True
    return filtered_images, nsfw_image_found


if config.FILTER_IMAGES:
    safety_model = load_safety_model("ViT-L/14")
    clip_model, preprocess = clip.load("ViT-L/14", device=config.NSFW_DEVICE)
