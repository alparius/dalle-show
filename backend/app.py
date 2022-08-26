import time
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

import config
import utils

#from model1_kuprel import ImageModel
from model2_stablediff import ImageModel
image_model = None


print("---> Starting DALL-E Server. This might take up to two minutes.")
app = Flask(__name__)
CORS(app)

@app.route("/dalle", methods=["POST"])
@cross_origin()
def generate_images_api():
    raw_prompt = request.get_json(force=True)["text"]
    processed_prompt = utils.preprocess_prompt(raw_prompt)

    if config.POTATO_PC:
        time.sleep(5)
        generated_images = utils.separate_grid(Image.open('x_placeholder.jpeg'))
    else:
        generated_images = image_model.generate_images(processed_prompt)
    
    encoded_images = utils.encode_images(generated_images)

    print(f"---> Created images from text prompt [{processed_prompt}]")
    response = {
        'generatedImgs': encoded_images,
        'generatedImgsCount': config.NR_IMAGES,
        'generatedImgsFormat': config.IMAGE_FORMAT
    }
    return jsonify(response)


@app.route("/", methods=["GET"])
@cross_origin()
def health_check():
    return jsonify(success=True)


if __name__ == "__main__":
    if not config.POTATO_PC:
        image_model = ImageModel()
        image_model.generate_images("warmup")
    print("---> DALL-E Server is up and running!")
    app.run(host="0.0.0.0", port=config.BACKEND_PORT, debug=False)
