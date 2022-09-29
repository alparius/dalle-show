import time
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

from util_translation import translate_prompt
import util_nsfwchecks

import config
import database
import utils

if config.IMAGE_MODEL == 'dalle':
    from model1_kuprel import ImageModel
elif config.IMAGE_MODEL == 'stablediff':
    from model2_stablediff import ImageModel
    
    
image_model = None
db_connection = None

print("---> Starting DALL-E Server. This might take up to two minutes.")
app = Flask(__name__)
CORS(app)


@app.route("/dalle", methods=["POST"])
@cross_origin()
def generate_images_api():
    raw_prompt = request.get_json(force=True)["text"]
    translated_prompt, translated_lang = translate_prompt(raw_prompt)
    profane = util_nsfwchecks.prompt_profanity_check(translated_prompt)
    
    if config.IMAGE_MODEL == "potato":
        time.sleep(5)
        seed = None
        generated_images = utils.separate_grid(Image.open('./static/placeholder.jpeg'))
    else:
        generated_images, seed = image_model.generate_images(translated_prompt)

    nsfw_image = None
    if config.FILTER_IMAGES:
        generated_images, nsfw_image = util_nsfwchecks.filter_images(generated_images, config.NSFW_TRESHOLD)

    if config.USE_DATABASE:
        database.save_prompt(db_connection, raw_prompt, translated_prompt, translated_lang, seed, profane, nsfw_image)

    encoded_images = utils.encode_images(generated_images)
    
    print(f"---> Created images from text prompt [{translated_prompt}]")
    response = {
        'generatedImgs': encoded_images,
        'generatedImgsCount': config.NR_IMAGES,
        'generatedImgsFormat': config.IMAGE_FORMAT,
        'profane': profane # TODO handle on frontend
    }
    return jsonify(response) 


@app.route("/", methods=["GET"])
@cross_origin()
def health_check():
    return jsonify(success=True)


if __name__ == "__main__":
    if config.IMAGE_MODEL != 'potato':
        image_model = ImageModel()
        image_model.generate_images("warmup")
    if config.USE_DATABASE:
        db_connection = database.create_connection()
        
    print("---> DALL-E Server is up and running!")
    try:
        app.run(host="0.0.0.0", port=config.BACKEND_PORT, debug=False)
    except Exception:
        if config.USE_DATABASE:
            db_connection.close()
        raise
