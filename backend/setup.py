import urllib.request

from prompt_processing import argos_models_dir, argos_model_names

# Download pretrained translation models for offline translation.
# Only download for those languages specified in `argos_model_names`.
download_url = "https://argosopentech.nyc3.digitaloceanspaces.com/argospm/"

argos_models_dir.mkdir(exist_ok=True)

for lang, model_name in argos_model_names.items():
    print(f"Downloading argos model for translating from '{lang}'")
    model_path = argos_models_dir / model_name
    if model_path.exists():
        print(f"Model for '{lang}' already downloaded.")
        continue
    model_url = f"{download_url}{model_name}"
    urllib.request.urlretrieve(
        url=model_url,
        filename=model_path,
    )

