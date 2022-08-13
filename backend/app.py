import time
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

import config
from model1_kuprel import DalleModel
import prompt_processing
import utils



print("---> Starting DALL-E Server. This might take up to two minutes.")
app = Flask(__name__)
CORS(app)

dalle_model = None


@app.route("/dalle", methods=["POST"])
@cross_origin()
def generate_images_api():
    raw_prompt = request.get_json(force=True)["text"]

    processed_prompt = prompt_processing.preprocess_prompt(raw_prompt)

    if config.POTATO_PC:
        time.sleep(5)
        generated_img_grid = Image.open('potato.jpeg')
    else:
        generated_img_grid = dalle_model.generate_images(processed_prompt)
    
    encoded_images = utils.encode_image_grid(generated_img_grid)

    print(f"---> Created images from text prompt [{processed_prompt}]")
    response = {'generatedImgs': encoded_images, 'generatedImgsFormat': config.IMAGE_FORMAT}
    return jsonify(response)


@app.route("/", methods=["GET"])
@cross_origin()
def health_check():
    return jsonify(success=True)


with app.app_context():
    if not config.POTATO_PC:
        dalle_model = DalleModel()
        dalle_model.generate_images("warmp-up prompt")
    print("---> DALL-E Server is up and running!")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=config.BACKEND_PORT, debug=False)
