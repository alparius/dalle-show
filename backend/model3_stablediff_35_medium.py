import torch
from diffusers import StableDiffusion3Pipeline
from pathlib import Path

import config

MODEL_DIR_PATH = "models_image/stable-diffusion-3.5-medium"

class ImageModel:

    def __init__(self) -> None:
        self.height = 512
        self.width = 512
        self.guidance_scale = 4.5
        self.num_inference_steps = config.STABLEDIFF_ITERS
        self.torch_device = "cuda"

        # init all of the models and move them to a given GPU
        model_path = Path(MODEL_DIR_PATH)
        if model_path.exists():
            print(f"Loading Stable Diffusion from file: {model_path}")
            self.pipe = StableDiffusion3Pipeline.from_pretrained(
                model_path,
                torch_dtype=torch.bfloat16
            )
            # self.pipe.enable_model_cpu_offload()
        else:
            print(f"Loading Stable Diffusion from the web and saving it for later")
            self.pipe = StableDiffusion3Pipeline.from_pretrained("stabilityai/stable-diffusion-3.5-medium", torch_dtype=torch.bfloat16)
            self.pipe.save_pretrained(model_path)

        self.pipe.to(self.torch_device)
        print("---> Stable Diffusion initialized")


    @torch.no_grad()
    def generate_images(self, text: str, seed: int):
        torch.manual_seed(seed)
        yield from self.diffuse(prompt=text)

    @torch.no_grad()
    def diffuse(self, prompt):
        num_inference_steps = config.STABLEDIFF_ITERS
        num_images_per_prompt = config.NR_IMAGES
        output_type = "pil"
        guidance_scale = 4.5
        height = self.height
        width = self.width

        max_sequence_length = 256

        
        callback_on_step_end_tensor_inputs = ["latents"]
        skip_layer_guidance_scale: float = 2.8

        print(1)
        # 1. Check inputs. Raise error if not correct
        self.pipe.check_inputs(
            prompt,
            None,
            None,
            height,
            width,
            negative_prompt=None,
            negative_prompt_2=None,
            negative_prompt_3=None,
            prompt_embeds=None,
            negative_prompt_embeds=None,
            pooled_prompt_embeds=None,
            negative_pooled_prompt_embeds=None,
            callback_on_step_end_tensor_inputs=callback_on_step_end_tensor_inputs,
            max_sequence_length=max_sequence_length,
        )

        self.pipe._guidance_scale = guidance_scale
        self.pipe._skip_layer_guidance_scale = skip_layer_guidance_scale
        self.pipe._clip_skip = None
        self.pipe._joint_attention_kwargs = None
        self.pipe._interrupt = False

        print(2)
        # 2. Define call parameters
        batch_size = 1 if isinstance(prompt, str) else len(prompt)
        device = self.torch_device
        prompt_embeds, negative_prompt_embeds, pooled_prompt_embeds, negative_pooled_prompt_embeds = self.pipe.encode_prompt(
            prompt=prompt,
            prompt_2=None,
            prompt_3=None,
            negative_prompt=None,
            negative_prompt_2=None,
            negative_prompt_3=None,
            do_classifier_free_guidance=self.pipe.do_classifier_free_guidance,
            prompt_embeds=None,
            negative_prompt_embeds=None,
            pooled_prompt_embeds=None,
            negative_pooled_prompt_embeds=None,
            device=device,
            clip_skip=None,
            num_images_per_prompt=num_images_per_prompt,
            max_sequence_length=max_sequence_length,
            lora_scale=None,
        )

        if self.pipe.do_classifier_free_guidance:
            prompt_embeds = torch.cat([negative_prompt_embeds, prompt_embeds], dim=0)
            pooled_prompt_embeds = torch.cat([negative_pooled_prompt_embeds, pooled_prompt_embeds], dim=0)

        print(3)
        # 3. Prepare latent variables
        num_channels_latents = self.pipe.transformer.config.in_channels
        latents = self.pipe.prepare_latents(
            batch_size * num_images_per_prompt,
            num_channels_latents,
            height,
            width,
            prompt_embeds.dtype,
            device,
            None,
            None,
        )

        print(4)
        # 4. Prepare timesteps
        scheduler_kwargs = {}
        if self.pipe.scheduler.config.get("use_dynamic_shifting", None) and mu is None:
            _, _, height2, width2 = latents.shape
            image_seq_len = (height2 // self.pipe.transformer.config.patch_size) * (
                width2 // self.pipe.transformer.config.patch_size
            )
            mu = calculate_shift(
                image_seq_len,
                self.pipe.scheduler.config.base_image_seq_len,
                self.pipe.scheduler.config.max_image_seq_len,
                self.pipe.scheduler.config.base_shift,
                self.pipe.scheduler.config.max_shift,
            )
            scheduler_kwargs["mu"] = mu
        timesteps, num_inference_steps = retrieve_timesteps(
            self.pipe.scheduler,
            num_inference_steps,
            device,
            sigmas=None,
            **scheduler_kwargs,
        )
        self.pipe._num_timesteps = len(timesteps)


        print(5)
        # 5. Denoising loop
        if True:
            for i, t in enumerate(timesteps):
                print(i, t)
                if self.pipe.interrupt:
                    continue

                # expand the latents if we are doing classifier free guidance
                latent_model_input = torch.cat([latents] * 2) if self.pipe.do_classifier_free_guidance else latents
                # broadcast to batch dimension in a way that's compatible with ONNX/Core ML
                timestep = t.expand(latent_model_input.shape[0])

                noise_pred = self.pipe.transformer(
                    hidden_states=latent_model_input,
                    timestep=timestep,
                    encoder_hidden_states=prompt_embeds,
                    pooled_projections=pooled_prompt_embeds,
                    joint_attention_kwargs=self.pipe.joint_attention_kwargs,
                    return_dict=False,
                )[0]

                # perform guidance
                if self.pipe.do_classifier_free_guidance:
                    noise_pred_uncond, noise_pred_text = noise_pred.chunk(2)
                    noise_pred = noise_pred_uncond + self.guidance_scale * (noise_pred_text - noise_pred_uncond)
                    
                # compute the previous noisy sample x_t -> x_t-1
                latents_dtype = latents.dtype
                latents = self.pipe.scheduler.step(noise_pred, t, latents, return_dict=False)[0]

                if latents.dtype != latents_dtype:
                    if torch.backends.mps.is_available():
                        # some platforms (eg. apple mps) misbehave due to a pytorch bug: https://github.com/pytorch/pytorch/pull/99272
                        latents = latents.to(latents_dtype)

                if True:
                # if i % config.STABLEDIFF_KDIFF == 0 or i == config.STABLEDIFF_ITERS - 1:
                    # Decode intermediate image
                    # decoded_latents = latents / self.pipe.vae.config.scaling_factor
                    # decoded_latents = (latents / self.pipe.vae.config.scaling_factor) + self.pipe.vae.config.shift_factor        
                    shift_factor = getattr(self.pipe.vae.config, "shift_factor", 0)
                    decoded_latents = (latents.clone() / self.pipe.vae.config.scaling_factor) + shift_factor

                    image = self.pipe.vae.decode(decoded_latents, return_dict=False)[0]
                    image = self.pipe.image_processor.postprocess(image, output_type=output_type)

                    # # debug: save images
                    # for idx, img in enumerate(image):
                    #     img.save(f"output_{i}_{idx}.png")

                    # Yield the intermediate image
                    yield image

                    



import inspect
from typing import List, Optional, Union

# Copied from diffusers.pipelines.flux.pipeline_flux.calculate_shift
def calculate_shift(
    image_seq_len,
    base_seq_len: int = 256,
    max_seq_len: int = 4096,
    base_shift: float = 0.5,
    max_shift: float = 1.16,
):
    m = (max_shift - base_shift) / (max_seq_len - base_seq_len)
    b = base_shift - m * base_seq_len
    mu = image_seq_len * m + b
    return mu

# Copied from diffusers.pipelines.stable_diffusion.pipeline_stable_diffusion.retrieve_timesteps
def retrieve_timesteps(
    scheduler,
    num_inference_steps: Optional[int] = None,
    device: Optional[Union[str, torch.device]] = None,
    timesteps: Optional[List[int]] = None,
    sigmas: Optional[List[float]] = None,
    **kwargs,
):
    r"""
    Calls the scheduler's `set_timesteps` method and retrieves timesteps from the scheduler after the call. Handles
    custom timesteps. Any kwargs will be supplied to `scheduler.set_timesteps`.

    Args:
        scheduler (`SchedulerMixin`):
            The scheduler to get timesteps from.
        num_inference_steps (`int`):
            The number of diffusion steps used when generating samples with a pre-trained model. If used, `timesteps`
            must be `None`.
        device (`str` or `torch.device`, *optional*):
            The device to which the timesteps should be moved to. If `None`, the timesteps are not moved.
        timesteps (`List[int]`, *optional*):
            Custom timesteps used to override the timestep spacing strategy of the scheduler. If `timesteps` is passed,
            `num_inference_steps` and `sigmas` must be `None`.
        sigmas (`List[float]`, *optional*):
            Custom sigmas used to override the timestep spacing strategy of the scheduler. If `sigmas` is passed,
            `num_inference_steps` and `timesteps` must be `None`.

    Returns:
        `Tuple[torch.Tensor, int]`: A tuple where the first element is the timestep schedule from the scheduler and the
        second element is the number of inference steps.
    """
    if timesteps is not None and sigmas is not None:
        raise ValueError("Only one of `timesteps` or `sigmas` can be passed. Please choose one to set custom values")
    if timesteps is not None:
        accepts_timesteps = "timesteps" in set(inspect.signature(scheduler.set_timesteps).parameters.keys())
        if not accepts_timesteps:
            raise ValueError(
                f"The current scheduler class {scheduler.__class__}'s `set_timesteps` does not support custom"
                f" timestep schedules. Please check whether you are using the correct scheduler."
            )
        scheduler.set_timesteps(timesteps=timesteps, device=device, **kwargs)
        timesteps = scheduler.timesteps
        num_inference_steps = len(timesteps)
    elif sigmas is not None:
        accept_sigmas = "sigmas" in set(inspect.signature(scheduler.set_timesteps).parameters.keys())
        if not accept_sigmas:
            raise ValueError(
                f"The current scheduler class {scheduler.__class__}'s `set_timesteps` does not support custom"
                f" sigmas schedules. Please check whether you are using the correct scheduler."
            )
        scheduler.set_timesteps(sigmas=sigmas, device=device, **kwargs)
        timesteps = scheduler.timesteps
        num_inference_steps = len(timesteps)
    else:
        scheduler.set_timesteps(num_inference_steps, device=device, **kwargs)
        timesteps = scheduler.timesteps
    return timesteps, num_inference_steps
