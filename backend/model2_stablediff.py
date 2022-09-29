from diffusers import StableDiffusionPipeline
import numpy as np
import torch

import config


class ImageModel:

    def __init__(self) -> None:
        self.height = 512
        self.width = 512
        self.guidance_scale = 7.5
        self.num_inference_steps = config.STABLEDIFF_ITERS

        ### TODO half precision trick
        ### faster, less memory, almost same quality
        ## https://github.com/richservo/StableDiffusionGUI/blob/main/StableDiffusionUI.py
        # config ="configs/stable-diffusion/v1-inference.yaml"
        # config = OmegaConf.load(f"{config}")
        # ckpt = './models/ldm/stable-diffusion-v1/' + dlg.checkDrop.currentText()
        # model = load_model_from_config(config, f"{ckpt}")
        # device = torch.device("cuda")
        # model = model.to(device)
        # model.half()

        self.pipe = StableDiffusionPipeline.from_pretrained(
            "CompVis/stable-diffusion-v1-4",
            # revision="fp16", # for weaker GPU
            # torch_dtype=torch.float16, # for weaker GPU
            use_auth_token=config.HF_TOKEN
        )
        
        def dummy(images, **kwargs): return images, False 
        self.pipe.safety_checker = dummy

        self.pipe.to("cuda")
        self.generator = torch.Generator("cuda")#.manual_seed(seed)
        
        print("---> Stable Diffusion initialized")

    def generate_images(self, text: str):
        if config.IMAGE_SEED is None:
            seed = np.random.randint(1, 1024)
        else:
            seed = config.IMAGE_SEED

        images = self.pipe(
            prompt=[text] * config.NR_IMAGES,
            height=self.height,
            width=self.width,
            guidance_scale=self.guidance_scale,
            num_inference_steps=self.num_inference_steps,
            generator=self.generator.manual_seed(seed))["sample"]
        return images, seed
