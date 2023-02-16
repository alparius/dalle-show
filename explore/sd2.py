import string
import torch
import time
from diffusers import StableDiffusionPipeline #, DPMSolverMultistepScheduler

model_id = "stabilityai/stable-diffusion-2-1"


start = time.time()

pipe = StableDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float32)
# # Use the DPMSolverMultistepScheduler (DPM-Solver++) scheduler here instead
# pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config)
pipe = pipe.to("cuda")

prompt = "pixel art of a bullet-shaped huge game boss which shoots guns as projectiles"
image = pipe(prompt).images[0]

valid_chars = "-_ %s%s" % (string.ascii_letters, string.digits)
filename = "".join(c for c in prompt if c in valid_chars)[:50]
image.save(f"sdcompare/{filename}-2.png")

end = time.time()
print(end - start)