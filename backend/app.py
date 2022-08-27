import time
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

from prompt_translation import translate_prompt
import nsfw_detection

import config
import utils

if config.IMAGE_MODEL == 'dalle':
    from model1_kuprel import ImageModel
elif config.IMAGE_MODEL == 'stablediff':
    from model2_stablediff import ImageModel
    
    
    
image_model = None

print("---> Starting DALL-E Server. This might take up to two minutes.")
app = Flask(__name__)
CORS(app)


@app.route("/dalle", methods=["POST"])
@cross_origin()
def generate_images_api():
    raw_prompt = request.get_json(force=True)["text"]
    translated_prompt = translate_prompt(raw_prompt)
    profane = nsfw_detection.prompt_profanity_check(translated_prompt)
    
    if config.POTATO_PC:
        time.sleep(5)
        generated_img_grid = generated_images = utils.separate_grid(Image.open('x_placeholder.jpeg'))
    else:
        generated_img_grid = dalle_model.generate_images(translated_prompt)

    if config.FILTER_IMAGES:
        images = nsfw_detection.filter_images(images, config.NSFW_TRESHOLD)

    encoded_images = utils.encode_images(images)
    
    print(f"---> Created images from text prompt [{translated_prompt}]")
    response = {
        'generatedImgs': encoded_images,
        'generatedImgsCount': config.NR_IMAGES,
        'generatedImgsFormat': config.IMAGE_FORMAT,
        'profane': profane
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
        
    print("---> DALL-E Server is up and running!")
    app.run(host="0.0.0.0", port=config.BACKEND_PORT, debug=False)
