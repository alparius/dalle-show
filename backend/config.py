import json

BACKEND_PORT = 8000
POTATO_PC = False

IS_MEGA = True
GRID_SIZE = 3
IMAGE_FORMAT = 'jpeg' # 'png'

ONLINE_TRANSLATION = False
if ONLINE_TRANSLATION:
    try:
        # To use online translation one needs an authentication key from DeepL.
        with open('secrets.json') as f:
            DEEPL_AUTH_KEY = json.load(f)["deepl_auth_key"]
    except Exception as e:
        print(f"Failed to open DeepL authentication key: {e}.\n Online translation is switched off")
        DEEPL_AUTH_KEY = None
        ONLINE_TRANSLATION = False
