import argparse
import urllib.request
from pathlib import Path

import argostranslate.package, argostranslate.translate
from database import create_tables
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
    if config.IMAGE_MODEL == 'potato':
        print("---> Inference is turned off, skipping model downloads...")
        return
    
    download_kuprel_models()

    print("---> Image model downloads successful.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--offline-translation",
        dest="offline_translation",
        action="store_true",
        default=False,
        help="Download models for offline translation.",
    )

    parser.add_argument(
        "--image-models",
        dest="image_models",
        action="store_true",
        default=False,
        help="Download image models for image creation.",
    )

    parser.add_argument(
        "--setup-db",
        dest="setup_db",
        action="store_true",
        default=False,
        help="Create all necessary tables in the database.",
    )
    args = parser.parse_args()

    if not (args.offline_translation or args.image_models or args.setup_db):
        raise ValueError("At least one of the arguments --offline-translation, --image-models, --setup-db is required")

    if args.offline_translation:
        download_offline_translator()
    if args.image_models:
        download_image_models()
    if args.setup_db:
        create_tables()
