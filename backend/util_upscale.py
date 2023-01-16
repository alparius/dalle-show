import sys
import os
import numpy as np
from PIL import Image
from basicsr.archs.rrdbnet_arch import RRDBNet
from basicsr.utils.download_util import load_file_from_url

from realesrgan import RealESRGANer


class ImageUpscaler:

    def __init__(self) -> None:
        # determine models according to model names
        model_name = 'RealESRGAN_x2plus'
        if model_name == 'RealESRGAN_x2plus':  # x2 RRDBNet model
            model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=2)
            netscale = 2
            file_url = ['https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.1/RealESRGAN_x2plus.pth']
        # TODO: if we need higher upscaling could use this
        # if model_name == 'RealESRGAN_x4plus':  # x4 RRDBNet model
            # model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=4)
            # netscale = 4
            # file_url = ['https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth']

        # determine model paths
        model_path = os.path.join('models_image/real-esrgan', model_name + '.pth')
        if not os.path.isfile(model_path):
            ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
            for url in file_url:
                model_path = load_file_from_url(url=url, model_dir=os.path.join(ROOT_DIR, 'models_image/real-esrgan'), progress=True, file_name=None)

        # upscaler
        self.upscaler = RealESRGANer(
            scale=netscale,
            model_path=model_path,
            dni_weight=None,
            model=model,
            half=True,
            gpu_id='0') # TODO: if problems, test 'None' for CPU

        print("---> Upscaler initialized")


    def upscale(self, images):
        """Inference demo for Real-ESRGAN."""
        upscaled_images = []
        for img in images:
            open_cv_image = np.array(img)

            try:
                output, _ = self.upscaler.enhance(open_cv_image, outscale=1.5)
                upscaled_images.append(Image.fromarray(output))
            except RuntimeError as error:
                print('Upscale error', error, file=sys.stderr)
                print('If you encounter CUDA out of memory, try to set --tile with a smaller number.')
        
        return upscaled_images
