import string
import torch
import time

from diffusers import StableDiffusionPipeline


# !! first execution has to be from admin rights console, to download the model

start = time.time()

HF_TOKEN = "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"

pipe = StableDiffusionPipeline.from_pretrained(
    "CompVis/stable-diffusion-v1-4",
    use_auth_token=HF_TOKEN
)
pipe.to("cuda")


prompt = "space and time fractured"
num_images = 3
size = 512
#seed = 1024
guidance_scale = 7.5 # text-to-img match (quality vs diversity), 7-8.5 ok
num_inference_steps = 50 # the more the better the slower, by default 50

generator = torch.Generator("cuda")#.manual_seed(seed)
image = pipe(
    prompt=[prompt] * num_images,
    height=size,
    width=size,
    guidance_scale=guidance_scale,
    num_inference_steps=num_inference_steps,
    generator=generator)["sample"]


end = time.time()
print(end - start)

valid_chars = "-_ %s%s" % (string.ascii_letters, string.digits)
filename = "".join(c for c in prompt if c in valid_chars)[:50]
for i in range(len(image)):
    image[i].save(f"./saveimg/{filename}-{i}.png")
