import os
import inspect
from PIL import Image
import numpy as np
from diffusers import StableDiffusionPipeline
import numpy as np
from diffusers.schedulers import LMSDiscreteScheduler
import torch
from torch import autocast

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

        self.torch_device = "cuda"

        # init all of the models and move them to a given GPU
        lms = LMSDiscreteScheduler(beta_start=0.00085, beta_end=0.012, beta_schedule="scaled_linear")
        self.pipe = StableDiffusionPipeline.from_pretrained("CompVis/stable-diffusion-v1-4", scheduler=lms, use_auth_token=config.HF_TOKEN)

        def dummy(images, **kwargs): return images, False 
        self.pipe.safety_checker = dummy

        self.pipe.unet.to(self.torch_device)
        self.pipe.vae.to(self.torch_device)
        self.pipe.text_encoder.to(self.torch_device)
        
        print("---> Stable Diffusion initialized")


    def generate_images(self, text: str):
        # get the conditional text embeddings based on the prompt
        text_input = self.pipe.tokenizer(text, padding="max_length", max_length=self.pipe.tokenizer.model_max_length, truncation=True, return_tensors="pt")
        cond_embeddings = self.pipe.text_encoder(text_input.input_ids.to(self.torch_device))[0] # shape [1, 77, 768]

        # sample a source
        init = torch.randn((1, self.pipe.unet.in_channels, self.height // 8, self.width // 8), device=self.torch_device)

        # sample the destination
        for t in range(2):
            print("dreaming... ")
            with autocast("cuda"):
                picgen = self.diffuse(self.pipe, cond_embeddings, init, t, 3)
                for p in picgen:
                    yield p


    @torch.no_grad()
    def diffuse(
            self,
            pipe,
            cond_embeddings, # text conditioning, should be (1, 77, 768)
            cond_latents,    # image conditioning, should be (1, 4, 64, 64)
            time_step,
            n_steps,
        ):
        torch_device = cond_latents.get_device()

        # classifier guidance: add the unconditional embedding
        max_length = cond_embeddings.shape[1] # 77
        uncond_input = pipe.tokenizer([""], padding="max_length", max_length=max_length, return_tensors="pt")
        uncond_embeddings = pipe.text_encoder(uncond_input.input_ids.to(torch_device))[0]
        text_embeddings = torch.cat([uncond_embeddings, cond_embeddings])  
        
        # if we use LMSDiscreteScheduler, let's make sure latents are mulitplied by sigmas
        cond_latents = cond_latents * pipe.scheduler.sigmas[0]
        # init the scheduler
        pipe.scheduler.set_timesteps(self.num_inference_steps)

        # diffuse!
        for i, t in enumerate(pipe.scheduler.timesteps):
            # expand the latents for classifier free guidance
            latent_model_input = torch.cat([cond_latents] * 2)
            sigma = pipe.scheduler.sigmas[i]
            latent_model_input = latent_model_input / ((sigma**2 + 1) ** 0.5)

            # predict the noise residual
            noise_pred = pipe.unet(latent_model_input, t, encoder_hidden_states=text_embeddings)["sample"]

            # cfg
            noise_pred_uncond, noise_pred_text = noise_pred.chunk(2)
            noise_pred = noise_pred_uncond + self.guidance_scale * (noise_pred_text - noise_pred_uncond)

            # compute the previous noisy sample x_t -> x_t-1
            cond_latents = pipe.scheduler.step(noise_pred, i, cond_latents)["prev_sample"]

            # scale and decode the image latents with vae   
            if time_step == 1 and (i % n_steps == 0 or i == config.STABLEDIFF_ITERS - 1):
                cond_latents_2 = 1 / 0.18215 * cond_latents
                image = pipe.vae.decode(cond_latents_2)

                # generate output numpy image as uint8
                image = (image / 2 + 0.5).clamp(0, 1)
                image = image.cpu().permute(0, 2, 3, 1).numpy()
                image = (image[0] * 255).astype(np.uint8)

                yield Image.fromarray(image)
