import json


# server
BACKEND_PORT = 8000

# image model
IMAGE_MODEL = "stablediff" # "stablediff", "dalle" or "potato"
IMAGE_MODEL = "potato" if IMAGE_MODEL not in ['stablediff', 'dalle'] else IMAGE_MODEL

NR_IMAGES = 2 # for dall-e it will be the <= full square
IMAGE_FORMAT = 'jpeg' # 'png'
IMAGE_MODEL_ROOT = 'models_image'
DALLE_IS_MEGA = True

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
