# dalle-show

Bringing the open-source DALL-E to an exhibition


### Fire up the Backend

#### Locally:
0. Set up your env: python, venv/conda/global
1. `cd backend`
2. Install dependencies into your env with: `pip3 install -r requirements.txt`
    - if Visual C++ problems, download the latest `pycld2` from [here](https://github.com/aboSamoor/pycld2/issues/24#issuecomment-747378534) and manually pip install it
4. Download the models for offline translation and inference: `python setup.py`
    - for Stable Diffusion, first execution has to be from admin rights console, to download the model
5. Check out `config.py`, e.g. set `IMAGE_MODEL` to `potato` when on laptop
6. `python app.py`


### Fire up the Frontend

#### Locally:
0. Set up your env: install npm
1. `cd frontend`
2. Install dependencies with: `npm install`
3. `npm start`

### Last screenshots
![screenshot](explore/docs/neon-giraffe.png?raw=true "screenshot")
