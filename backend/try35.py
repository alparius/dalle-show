# import torch
# from diffusers import StableDiffusion3Pipeline

# pipe = StableDiffusion3Pipeline.from_pretrained("../backend/models_image/stable-diffusion-3.5-medium", torch_dtype=torch.bfloat16)
# pipe = pipe.to("cuda")

# image = pipe(
#     "expressionist yet realistic painting of a cyberpunk city and night, with vibrant lights reflecting off the wet pavement",
#     num_inference_steps=40,
#     guidance_scale=4.5,
#     height=1024,
#     width=1024,
#     num_images_per_prompt=2
# ).images[0]
# image.save("capybara3.png")


import requests
from PIL import Image
from io import BytesIO
from diffusers import StableDiffusionUpscalePipeline
import torch

# load model and scheduler
model_id = "stabilityai/stable-diffusion-x4-upscaler"
pipeline = StableDiffusionUpscalePipeline.from_pretrained(model_id, torch_dtype=torch.float16)
pipeline = pipeline.to("cuda")

# let's download an  image
url = "https://huggingface.co/datasets/hf-internal-testing/diffusers-images/resolve/main/sd2-upscale/low_res_cat.png"
response = requests.get(url)
low_res_img = Image.open(BytesIO(response.content)).convert("RGB")
low_res_img = low_res_img.resize((128, 128))

prompt = "a white cat"

upscaled_image = pipeline(prompt=prompt, image=low_res_img).images[0]
upscaled_image.save("upsampled_cat.png")