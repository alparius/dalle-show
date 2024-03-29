import sys
import json
import os


# server
BACKEND_PORT = 8000


# image model
IMAGE_MODEL = os.getenv('AIEX_IMAGE_MODEL', 'stablediff') # "stablediff", "dalle" or "potato"
if IMAGE_MODEL not in ['stablediff', 'dalle'] : IMAGE_MODEL = "potato"
if IMAGE_MODEL in ['stablediff']:
    try:
        with open('secrets.json') as f:
            HF_TOKEN = json.load(f)["hf_token"]
    except Exception as e:
        print(f"---> Failed to get HF token: {e}.\n Using potato mode", file=sys.stderr)
        HF_TOKEN = None
        IMAGE_MODEL = 'potato'

NR_IMAGES = int(os.getenv('AIEX_NR_IMAGES', '2')) # for dall-e it will be the <= full square
IMAGE_FORMAT = 'jpeg' # 'png'
IMAGE_MODEL_ROOT = 'models_image'
IMAGE_SEED = None # int or None

DALLE_IS_MEGA = (os.getenv('AIEX_DALLE_IS_MEGA', 'True') == 'True')
STABLEDIFF_ITERS = int(os.getenv('AIEX_STABLEDIFF_ITERS', '50')) # default is 50
STABLEDIFF_KDIFF = int(os.getenv('STABLEDIFF_KDIFF', '3')) # every k-th step is streamed


# translation
OFFLINE_TRANSLATION = (os.getenv('AIEX_OFFLINE_TRANSLATION', 'True') == 'True')
ONLINE_TRANSLATION = (os.getenv('AIEX_ONLINE_TRANSLATION', 'False') == 'True') # turned off
if ONLINE_TRANSLATION: # turned off by default in the above line
    try:
        # To use online translation one needs an authentication key from DeepL.
        with open('secrets.json') as f:
            DEEPL_AUTH_KEY = json.load(f)["deepl_auth_key"]
    except Exception as e:
        print(f"---> Failed to open DeepL authentication key: {e}.\n Online translation is switched off", file=sys.stderr)
        DEEPL_AUTH_KEY = None
        ONLINE_TRANSLATION = False


# nsfw checks
CHECK_PROMPT_FOR_PROFANITY = (os.getenv('AIEX_CHECK_PROMPT_FOR_PROFANITY', 'True') == 'True')
FILTER_IMAGES = (os.getenv('AIEX_FILTER_IMAGES', 'False') == 'True') # turned off
NSFW_DEVICE = "cpu" # "cpu" or "cuda"
NSFW_TRESHOLD = 0.5

# storage
USE_DATABASE = (os.getenv('AIEX_USE_DATABASE', 'False') == 'True') # turned off
DB_HOST = 'localhost'
DB_PORT = 5432
DB_NAME = "dalledb"
if USE_DATABASE: # turned off
    try:
        with open('secrets.json') as f:
            secrets = json.load(f)
            DB_USER = secrets["db_user"]
            DB_PASSWORD = secrets["db_password"]
    except Exception as e:
        print(f"---> Failed to get database user and password {e}.\n Database usage is switched off", file=sys.stderr)
        DB_USER = None
        DB_PASSWORD = None
        USE_DATABASE = False
