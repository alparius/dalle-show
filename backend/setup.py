import urllib.request

from pathlib import Path
import argostranslate.package, argostranslate.translate
from model1_kuprel import download_kuprel_models

import config


# Models for other languages can be found here: https://www.argosopentech.com/argospm/index/
argos_model_names = {
    "de": "translate-de_en-1_0.argosmodel",
    "hu": "translate-hu_en-1_5.argosmodel",
    "ru": "translate-ru_en-1_0.argosmodel",
}

def download_offline_translator():
    ''' Download pretrained translation models for offline translation.
    Only download for those languages specified in `argos_model_names`.
    '''
    if not config.OFFLINE_TRANSLATION:
        print("---> Offline translation is turned off, skipping model downloads...")
        return

    download_url = "https://argosopentech.nyc3.digitaloceanspaces.com/argospm/"
    argos_models_dir = Path("models_translate")
    argos_models_dir.mkdir(exist_ok=True)

    for lang, model_name in argos_model_names.items():
        print(f"---> downloading argos model for translating from '{lang}'")
        model_path = argos_models_dir / model_name
        if model_path.exists():
            print(f"---> model for '{lang}' already downloaded")
            continue
        model_url = f"{download_url}{model_name}"
        urllib.request.urlretrieve(
            url=model_url,
            filename=model_path,
        )

    print(f"---> Installing models for translating languages: {list(argos_model_names.keys())}")
    for lang, model_name in argos_model_names.items():
        model_path = argos_models_dir / model_name
        if not model_path.exists():
            raise ValueError(f"model for language '{lang}' is missing")
        argostranslate.package.install_from_path(str(model_path))

    print("---> Translation model downloads successful.")


def download_image_models():
    ''' Download the image models and the tokenizers
    '''
    if config.POTATO_PC:
        print("---> Inference is turned off, skipping model downloads...")
        return
    
    download_kuprel_models()

    print("---> Image model downloads successful.")


if __name__ == "__main__":
    download_offline_translator()
    download_image_models()
