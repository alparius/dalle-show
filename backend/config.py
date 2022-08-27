import json


# server
BACKEND_PORT = 8000

# image model
POTATO_PC = False
IS_MEGA = True
GRID_SIZE = 3
IMAGE_FORMAT = 'jpeg' # 'png'
IMAGE_MODEL_ROOT = 'models_image'

# translation
OFFLINE_TRANSLATION = True
ONLINE_TRANSLATION = False
if ONLINE_TRANSLATION:
    try:
        # To use online translation one needs an authentication key from DeepL.
        with open('secrets.json') as f:
            DEEPL_AUTH_KEY = json.load(f)["deepl_auth_key"]
    except Exception as e:
        print(f"---> Failed to open DeepL authentication key: {e}.\n Online translation is switched off")
        DEEPL_AUTH_KEY = None
        ONLINE_TRANSLATION = False

CHECK_PROMPT_FOR_PROFANITY = True
FILTER_IMAGES = False
NSFW_TRESHOLD = 0.5
