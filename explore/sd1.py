import string
import torch
import time
from diffusers import StableDiffusionPipeline

model_id = "CompVis/stable-diffusion-v1-4"


start = time.time()

pipe = StableDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float32)
pipe = pipe.to("cuda")

prompt = "pixel art of a bullet-shaped huge game boss which shoots guns as projectiles"
image = pipe(prompt)['images'][0]

valid_chars = "-_ %s%s" % (string.ascii_letters, string.digits)
filename = "".join(c for c in prompt if c in valid_chars)[:50]
image.save(f"sdcompare/{filename}.png")

end = time.time()
print(end - start)