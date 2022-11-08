import torch
from torch import autocast
from diffusers import StableDiffusionPipeline
from diffusers.schedulers import LMSDiscreteScheduler

import config
import utils

# TODO: speedup experiments
# torch.backends.cudnn.benchmark = True
# torch.backends.cuda.matmul.allow_tf32 = True
#The memory efficient attention can be activated by
# USE_MEMORY_EFFICIENT_ATTENTION=1
# pip install git+https://github.com/facebookresearch/xformers@51dd119#egg=xformers


class ImageModel:

    def __init__(self) -> None:
        self.height = 512
        self.width = 512
        self.guidance_scale = 7.5
        self.num_inference_steps = config.STABLEDIFF_ITERS
        self.torch_device = "cuda"

        # init all of the models and move them to a given GPU
        lms = LMSDiscreteScheduler(beta_start=0.00085, beta_end=0.012, beta_schedule="scaled_linear")
        self.pipe = StableDiffusionPipeline.from_pretrained("CompVis/stable-diffusion-v1-4", scheduler=lms, use_auth_token=config.HF_TOKEN)

        self.pipe.unet.to(self.torch_device)
        self.pipe.vae.to(self.torch_device)
        self.pipe.text_encoder.to(self.torch_device)
        
        print("---> Stable Diffusion initialized")


    @torch.no_grad()
    def generate_images(self, text: str, seed: int):
        prompt = [text] * config.NR_IMAGES
        torch.manual_seed(seed)

        # get the conditional text embeddings based on the prompt
        text_inputs = self.pipe.tokenizer(prompt, padding="max_length", max_length=self.pipe.tokenizer.model_max_length, truncation=True, return_tensors="pt")

        cond_embeddings = self.pipe.text_encoder(text_inputs.input_ids.to(self.torch_device))[0] # shape [config.NR_IMAGES, 77, 768]

        # get the initial random noise
        latents_shape = (config.NR_IMAGES, self.pipe.unet.in_channels, self.height // 8, self.width // 8)
        init_noise = torch.randn(latents_shape, device=self.torch_device)

        # sample the destination
        for t in range(2):
            with autocast("cuda"):
                picgen = self.diffuse(cond_embeddings, init_noise, t)
                for p in picgen:
                    yield p


    @torch.no_grad()
    def diffuse(
            self,
            cond_embeddings, # text conditioning, should be (config.NR_IMAGES, 77, 768)
            cond_latents, # image conditioning, should be (config.NR_IMAGES, 4, 64, 64)
            time_step, # 0 for cold run, 1 for decoding and yield
        ):
        # classifier guidance: add the unconditional embedding
        max_length = cond_embeddings.shape[1] # 77
        uncond_input = self.pipe.tokenizer([""] * config.NR_IMAGES, padding="max_length", max_length=max_length, return_tensors="pt")
        uncond_embeddings = self.pipe.text_encoder(uncond_input.input_ids.to(self.torch_device))[0]
        text_embeddings = torch.cat([uncond_embeddings, cond_embeddings])

        # init the scheduler
        self.pipe.scheduler.set_timesteps(self.num_inference_steps)
        # it's more optimzed to move all timesteps to correct device beforehand
        timesteps_tensor = self.pipe.scheduler.timesteps.to(self.torch_device)

        # we use LMSDiscreteScheduler, let's make sure latents are mulitplied by sigmas
        cond_latents = cond_latents * self.pipe.scheduler.sigmas[0]

        # diffuse!
        for i, t in enumerate(timesteps_tensor):
            # expand the latents for classifier free guidance
            latent_model_input = torch.cat([cond_latents] * 2)
            sigma = self.pipe.scheduler.sigmas[i]
            latent_model_input = latent_model_input / ((sigma**2 + 1) ** 0.5)

            # predict the noise residual
            noise_pred = self.pipe.unet(latent_model_input, t, encoder_hidden_states=text_embeddings)["sample"]

            # perform guidance
            noise_pred_uncond, noise_pred_text = noise_pred.chunk(2)
            noise_pred = noise_pred_uncond + self.guidance_scale * (noise_pred_text - noise_pred_uncond)

            # compute the previous noisy sample x_t -> x_t-1
            cond_latents = self.pipe.scheduler.step(noise_pred, i, cond_latents)["prev_sample"]

            # scale and decode the image latents with vae   
            if time_step == 1 and (i % config.STABLEDIFF_KDIFF == 0 or i == config.STABLEDIFF_ITERS - 1):
                cond_latents_2 = 1 / 0.18215 * cond_latents
                image = self.pipe.vae.decode(cond_latents_2)

                # generate output numpy image as uint8
                image = (image / 2 + 0.5).clamp(0, 1)
                image = image.cpu().permute(0, 2, 3, 1).numpy()

                pil_images = utils.numpy_to_pil(image)

                # TODO: isn't needed as discussed, otherwise a problem with the db, solution 2:
                # run safety checker
                # if config.FILTER_IMAGES and time_step == 1 and i > config.STABLEDIFF_ITERS - 10:
                #     safety_checker_input = self.pipe.feature_extractor(pil_images, return_tensors="pt").to(self.torch_device)
                #     image, has_nsfw_concept = self.pipe.safety_checker(images=image, clip_input=safety_checker_input.pixel_values.to(torch.float32).type(torch.FloatTensor))
                #     print(has_nsfw_concept)

                yield pil_images
