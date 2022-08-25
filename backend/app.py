import imghdr
import time
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

import config
from model1_kuprel import DalleModel

from better_profanity import profanity

import utils
from prompt_translation import translate_prompt
from nsfw_detection import load_safety_model
import torch
import clip

from io import BytesIO
import base64

print("---> Starting DALL-E Server. This might take up to two minutes.")
app = Flask(__name__)
CORS(app)

dalle_model = None
safety_model = load_safety_model("ViT-B/32")
device = "cuda" if torch.cuda.is_available() else "cpu"
clip_model, preprocess = clip.load("ViT-B/32", device=device)

default_img = Image.open("grey.jpg")

@app.route("/dalle", methods=["POST"])
@cross_origin()
def generate_images_api():
    raw_prompt = request.get_json(force=True)["text"]
    translated_prompt = translate_prompt(raw_prompt)
    if profanity.contains_profanity(translated_prompt):
        print("Prompt contains profanity")
    
    if config.POTATO_PC:
        #time.sleep(5)
        generated_img_grid = Image.open('x_placeholder.jpeg')
    else:
        generated_img_grid = dalle_model.generate_images(translated_prompt)
    
    images = utils.grid_to_images(generated_img_grid)

    filtered_images = []
    for img in images:
        image = preprocess(img).unsqueeze(0).to(device)
        image_features = clip_model.encode_image(image)
        image_features /= image_features.norm(dim=-1, keepdim=True)
        query = image_features.cpu().detach().numpy().astype("float32")
        nsfw_value = safety_model.predict(query)
        if nsfw_value < 0.5:
            filtered_images.append(img)
        else:
            filtered_images.append(default_img)
        print("nsfw value:", nsfw_value)

    encoded_images = utils.encode_images(filtered_images)
    
    print(f"---> Created images from text prompt [{translated_prompt}]")
    response = {'generatedImgs': encoded_images, 'generatedImgsFormat': config.IMAGE_FORMAT}
    return jsonify(response)


@app.route("/", methods=["GET"])
@cross_origin()
def health_check():
    return jsonify(success=True)


with app.app_context():
    if not config.POTATO_PC:
        dalle_model = DalleModel()
        dalle_model.generate_images("warmup")
    print("---> DALL-E Server is up and running!")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=config.BACKEND_PORT, debug=True)
