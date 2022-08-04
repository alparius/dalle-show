from min_dalle import MinDalle
import torch

import config



class DalleModel:

    def __init__(self) -> None:
        self.is_verbose = True

        self.model = MinDalle(
            device='cuda',
            is_reusable=True,
            is_verbose=self.is_verbose,
            models_root='pretrained',
            is_mega=config.IS_MEGA,
            dtype=torch.float32,
        )
        print("---> DALL-E Model initialized")


    def generate_images(self, text: str):
        with torch.no_grad():
            images = self.model.generate_image(
                text,
                seed=-1,
                grid_size=config.GRID_SIZE,
                is_verbose=self.is_verbose,
                is_seamless=False,
                temperature=1,
                top_k=256,
                supercondition_factor=8
            )
        return images
