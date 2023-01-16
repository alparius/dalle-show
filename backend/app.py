import sys
import math
import json
from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS

from util_translation import translate_prompt
import util_nsfwchecks
from util_upscale import ImageUpscaler

import config
import database
import utils

from model2_stablediff import ImageModel
    
    
image_model = None
image_upscaler = None
db_connection = None

print("---> Starting DALL-E Server. This might take up to two minutes.", file=sys.stderr)
app = Flask(__name__)
CORS(app)


@app.route("/dalle", methods=["GET"])
@stream_with_context
def generate_images_api2():
    raw_prompt = request.args.get('prompt')
    translated_prompt, translated_lang = translate_prompt(raw_prompt)
    profane = util_nsfwchecks.prompt_profanity_check(translated_prompt)

    if profane:
        def gen():
            response = {
                'generatedImgs': [],
                'generatedImgsCount': 0,
                'generatedImgsFormat': config.IMAGE_FORMAT,
                'promptEnglish': translated_prompt,
                'promptLanguage': translated_lang,
                'promptProfane': profane
            }
            yield json.dumps(response)
        return Response(gen(), mimetype = 'application/json')

    seed = utils.get_seed()

    if config.USE_DATABASE:
        database.save_prompt(db_connection, raw_prompt, translated_prompt, translated_lang, seed, profane, None)
    
    def gen():
        if config.IMAGE_MODEL == "potato":
            frames = utils.yield_potato()
        else:
            frames = image_model.generate_images(translated_prompt, seed)

        i = 0
        for frame in frames:
            # if config.FILTER_IMAGES:
            #     frame, nsfw_image = util_nsfwchecks.filter_images(frame, config.NSFW_TRESHOLD)
            
            i = i+1
            if i == math.ceil(config.STABLEDIFF_ITERS / config.STABLEDIFF_KDIFF) + 1:
                strpic = utils.encode_images(image_upscaler.upscale(frame))
            else:
                strpic = utils.encode_images(frame)

            response = {
                'generatedImgs': strpic,
                'generatedImgsCount': config.NR_IMAGES,
                'generatedImgsFormat': config.IMAGE_FORMAT,
                'promptEnglish': translated_prompt,
                'promptLanguage': translated_lang,
                'promptProfane': profane
            }
            yield json.dumps(response)

    return Response(gen(), mimetype = 'application/json')


@app.route("/", methods=["GET"])
def health_check():
    return jsonify(success=True)


if __name__ == "__main__":
    if config.IMAGE_MODEL != 'potato':
        image_model = ImageModel()
        gen = image_model.generate_images("warmup", 1)
        for _ in gen:
            continue

    image_upscaler = ImageUpscaler()

    if config.USE_DATABASE:
        db_connection = database.create_connection()
        
    print("---> DALL-E Server is up and running!", file=sys.stderr)
    try:
        app.run(host="0.0.0.0", port=config.BACKEND_PORT, debug=False)
    except Exception:
        if config.USE_DATABASE:
            db_connection.close()
        raise
