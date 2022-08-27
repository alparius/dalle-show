import json


# server
BACKEND_PORT = 8000


# image model
IMAGE_MODEL = "stablediff" # "stablediff", "dalle" or "potato"
if IMAGE_MODEL not in ['stablediff', 'dalle'] : IMAGE_MODEL = "potato"
if IMAGE_MODEL in ['stablediff']:
    try:
        with open('secrets.json') as f:
            HF_TOKEN = json.load(f)["hf_token"]
    except Exception as e:
        print(f"---> Failed to get HF token: {e}.\n Using potato mode")
        HF_TOKEN = None
        IMAGE_MODEL = 'potato'
DEVICE = "cpu" if IMAGE_MODEL == "potato" else "cuda"

NR_IMAGES = 2 # for dall-e it will be the <= full square
IMAGE_FORMAT = 'jpeg' # 'png'
IMAGE_MODEL_ROOT = 'models_image'

DALLE_IS_MEGA = True
STABLEDIFF_ITERS = 35 # default is 50


# translation
OFFLINE_TRANSLATION = True
ONLINE_TRANSLATION = True
if ONLINE_TRANSLATION:
    try:
        # To use online translation one needs an authentication key from DeepL.
        with open('secrets.json') as f:
            DEEPL_AUTH_KEY = json.load(f)["deepl_auth_key"]
    except Exception as e:
        print(f"---> Failed to open DeepL authentication key: {e}.\n Online translation is switched off")
        DEEPL_AUTH_KEY = None
        ONLINE_TRANSLATION = False


# nsfw checks
CHECK_PROMPT_FOR_PROFANITY = True
FILTER_IMAGES = False # TODO don't enable this until fixed
NSFW_TRESHOLD = 0.5
