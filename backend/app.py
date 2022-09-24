import io
import json
import time
from PIL import Image
from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS, cross_origin

from util_translation import translate_prompt
import util_nsfwchecks

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


@app.route("/dalle2", methods=["POST"])
def generate_images_api():
    #raw_prompt = request.get_json(force=True)["text"]
    translated_prompt = 'steampunk spaghetti' #translate_prompt(raw_prompt)
    def gen():
        frames = image_model.generate_images(translated_prompt)
        for frame in frames :
            output = io.BytesIO()
            frame.save(output, format='png')
            hex_data = output.getvalue()
            yield(b'--frame\r\n'b'Content-Type: image/png\r\n\r\n' + hex_data + b'\r\n')

    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route("/dalle", methods=["GET"])
@stream_with_context
def generate_images_api2():
    raw_prompt = request.args.get('prompt')
    translated_prompt = translate_prompt(raw_prompt)
    profane = util_nsfwchecks.prompt_profanity_check(translated_prompt)
    
    def gen():
        frames = image_model.generate_images(translated_prompt)
        for frame in frames :
            strpic = utils.encode_images([frame])
            response = {
                'generatedImgs': strpic,
                'generatedImgsCount': config.NR_IMAGES,
                'generatedImgsFormat': config.IMAGE_FORMAT,
                'profane': profane # TODO handle on frontend
            }
            yield json.dumps(response)

    return Response(gen(), mimetype = 'application/json')


@app.route('/')
def index():
    return "<html><head></head><body><h1>helo</h1><img src='/dalle' style='width: 90%'/>" \
           "</body></html>"


if __name__ == "__main__":
    if config.IMAGE_MODEL != 'potato':
        image_model = ImageModel()
        image_model.generate_images("warmup")
        
    print("---> DALL-E Server is up and running!")
    app.run(host="0.0.0.0", port=config.BACKEND_PORT, debug=False)
