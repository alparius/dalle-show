from diffusers import StableDiffusionPipeline
import torch

import config


HF_TOKEN = "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"

class ImageModel:

    def __init__(self) -> None:
        self.height = 512
        self.width = 512
        self.guidance_scale = 7.5
        self.num_inference_steps = 35

        self.pipe = StableDiffusionPipeline.from_pretrained(
            "CompVis/stable-diffusion-v1-4",
            #torch_dtype=torch.float16, # for weaker GPU
            #revision="fp16", # for weaker GPU
            use_auth_token=HF_TOKEN
        )
        
        def dummy(images, **kwargs): return images, False 
        self.pipe.safety_checker = dummy

        self.pipe.to("cuda")
        self.generator = torch.Generator("cuda")#.manual_seed(seed)
        
        print("---> Stable Diffusion initialized")


    def generate_images(self, text: str):
        images = self.pipe(
            prompt=[text] * config.NR_IMAGES,
            height=self.height,
            width=self.width,
            guidance_scale=self.guidance_scale,
            num_inference_steps=self.num_inference_steps,
            generator=self.generator)["sample"]
        return images
