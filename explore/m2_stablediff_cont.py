"""
creates a progress video for a single generation
example way to run this script, which will decode an image every n_steps of the reversion diffusion process:
$ python progress_animation.py --prompt "a painting of planet earth" --name earth --n_steps 1
to stitch together the images, e.g.:
$ ffmpeg -r 10 -f image2 -s 512x512 -i earth/frame%06d.jpg -vcodec libx264 -crf 10 -pix_fmt yuv420p earth.mp4
you have to have access to stablediffusion checkpoints from https://huggingface.co/CompVis
and install all the other dependencies (e.g. diffusers library)
This is adapted from Karpathy's 'stablediffusionwalk.py` script for making videos from latent space interpolations
"""

import os
import inspect
import fire
from diffusers import StableDiffusionPipeline
from diffusers.schedulers import DDIMScheduler, LMSDiscreteScheduler, PNDMScheduler
from PIL import Image
import numpy as np
import torch
from torch import autocast
import time

# -----------------------------------------------------------------------------

@torch.no_grad()
def diffuse(
        pipe,
        cond_embeddings, # text conditioning, should be (1, 77, 768)
        cond_latents,    # image conditioning, should be (1, 4, 64, 64)
        num_inference_steps,
        guidance_scale,
        eta,
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
    if isinstance(pipe.scheduler, LMSDiscreteScheduler):
        cond_latents = cond_latents * pipe.scheduler.sigmas[0]

    # init the scheduler
    accepts_offset = "offset" in set(inspect.signature(pipe.scheduler.set_timesteps).parameters.keys())
    extra_set_kwargs = {}
    if accepts_offset:
        extra_set_kwargs["offset"] = 1
    pipe.scheduler.set_timesteps(num_inference_steps, **extra_set_kwargs)
    # prepare extra kwargs for the scheduler step, since not all schedulers have the same signature
    # eta (η) is only used with the DDIMScheduler, it will be ignored for other schedulers.
    # eta corresponds to η in DDIM paper: https://arxiv.org/abs/2010.02502
    # and should be between [0, 1]
    accepts_eta = "eta" in set(inspect.signature(pipe.scheduler.step).parameters.keys())
    extra_step_kwargs = {}
    if accepts_eta:
        extra_step_kwargs["eta"] = eta

    # diffuse!
 
    for i, t in enumerate(pipe.scheduler.timesteps):

        # expand the latents for classifier free guidance
        latent_model_input = torch.cat([cond_latents] * 2)
        if isinstance(pipe.scheduler, LMSDiscreteScheduler):
            sigma = pipe.scheduler.sigmas[i]
            latent_model_input = latent_model_input / ((sigma**2 + 1) ** 0.5)

        # predict the noise residual
        noise_pred = pipe.unet(latent_model_input, t, encoder_hidden_states=text_embeddings)["sample"]

        # cfg
        noise_pred_uncond, noise_pred_text = noise_pred.chunk(2)
        noise_pred = noise_pred_uncond + guidance_scale * (noise_pred_text - noise_pred_uncond)

        # compute the previous noisy sample x_t -> x_t-1
        if isinstance(pipe.scheduler, LMSDiscreteScheduler):
            cond_latents = pipe.scheduler.step(noise_pred, i, cond_latents, **extra_step_kwargs)["prev_sample"]
        else:
            cond_latents = pipe.scheduler.step(noise_pred, t, cond_latents, **extra_step_kwargs)["prev_sample"]

        # scale and decode the image latents with vae   
        if time_step == 1 and (i % n_steps == 0 or i == 49):
            cond_latents_2 = 1 / 0.18215 * cond_latents
            image = pipe.vae.decode(cond_latents_2)

            # generate output numpy image as uint8
            image = (image / 2 + 0.5).clamp(0, 1)
            image = image.cpu().permute(0, 2, 3, 1).numpy()
            image = (image[0] * 255).astype(np.uint8)

            outdir = os.path.join('./', 'blueberry')
            outpath = os.path.join(outdir, 'frame%06d.jpg' % i)
            Image.fromarray(image).save(outpath, quality=90)


def run(
        # --------------------------------------
        # args you probably want to change
        prompt = "blueberry spaghetti", # prompt to dream about
        gpu = 0, # id of the gpu to run on
        name = 'blueberry', # name of this project, for the output directory
        rootdir = './',
        num_inference_steps = 50, # more (e.g. 100, 200 etc) can create slightly better images
        guidance_scale = 7.5, # can depend on the prompt. usually somewhere between 3-10 is good
        seed = 2256,
        # --------------------------------------
        # args you probably don't want to change
        #quality = 90, # for jpeg compression of the output images
        eta = 0.0,
        width = 512,
        height = 512,
        n_steps = 4,  # decode the image every n_steps of reverse difusion
        #weights_path = "/home/ubuntu/filesystem/stable-diffusion-v1-4",
        # --------------------------------------
    ):
    assert torch.cuda.is_available()
    assert height % 8 == 0 and width % 8 == 0
    torch.manual_seed(seed)
    torch_device = f"cuda:{gpu}"

    # init the output dir
    outdir = os.path.join(rootdir, name)
    os.makedirs(outdir, exist_ok=True)

    HF_TOKEN = "HUGGING_FACE_TOKEN"
    # init all of the models and move them to a given GPU
    lms = LMSDiscreteScheduler(beta_start=0.00085, beta_end=0.012, beta_schedule="scaled_linear")
    pipe = StableDiffusionPipeline.from_pretrained("CompVis/stable-diffusion-v1-4", scheduler=lms, use_auth_token=HF_TOKEN)

    pipe.unet.to(torch_device)
    pipe.vae.to(torch_device)
    pipe.text_encoder.to(torch_device)

    # get the conditional text embeddings based on the prompt
    text_input = pipe.tokenizer(prompt, padding="max_length", max_length=pipe.tokenizer.model_max_length, truncation=True, return_tensors="pt")
    cond_embeddings = pipe.text_encoder(text_input.input_ids.to(torch_device))[0] # shape [1, 77, 768]

    # sample a source
    init = torch.randn((1, pipe.unet.in_channels, height // 8, width // 8), device=torch_device)

    # sample the destination

    start = time.time()
    for t in range(2):
        print("dreaming... ")
        with autocast("cuda"):
            diffuse(pipe, cond_embeddings, init, num_inference_steps, guidance_scale, eta, t, n_steps)
    
    end = time.time()
    print(end - start)


if __name__ == '__main__':
    fire.Fire(run)
