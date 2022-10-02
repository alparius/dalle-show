# dalle-show

Bringing open-source Text-to-Image to an exhibition


### Fire up the Backend

#### Locally:
1. Set up your env: GPU drivers, python, pip, (mini)conda + environment, etc.
2. Set up the Postgresql server; create database and user
3. `cd backend`
4. Install dependencies into your env with: `pip3 install -r requirements.txt`
    - if `pycld2` problems, download it from [here](https://github.com/aboSamoor/pycld2/issues/24#issuecomment-747378534) and manually pip install the wheel
    - you might need to manually install [tensorflow with the CUDA Toolkit](https://www.tensorflow.org/install/pip)
5. Create and fill out `secrets.json` as inidcated by `secrets.json.mock`
6. Run `python3 setup.py` with different arguments to download models and set up the database table
7. Check out `config.py`, e.g. set `IMAGE_MODEL` to `potato` when on laptop
8. `python3 app.py`
    - for Stable Diffusion, first execution has to be from admin rights console, to download the model

#### Docker:
1. Have GPU drivers and Docker installed
2. Set up the Postgresql server; create database and user
3. `cd backend`
4. Create and fill out `secrets.json` as inidcated by `secrets.json.mock`
5. `docker-compose up`

#### Connect to remote backend:
- to connect and port-forward: `ssh -L 8000:localhost:8000 -L 5432:localhost:5432 ubuntu@IP_ADDRESS`
- to monitor VRAM usage: `nvidia-smi -l 1` or `nvidia-smi --query-gpu=memory.used --format=csv -l 1`


### Fire up the Frontend

#### Locally:
1. Set up your env: install node
2. `cd frontend`
3. Install dependencies with: `npm install`
4. `npm start`


### Last screenshots
![screenshot](explore/docs/cyberpunk-1.png?raw=true "screenshot")
![screenshot](explore/docs/cyberpunk-2.png?raw=true "screenshot")
