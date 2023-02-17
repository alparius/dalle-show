# dalle-show

Bringing open-source Text-to-Image to an exhibition


### Start up the API/inference backend server

1. Set up your env: GPU drivers, python, pip, (mini)conda + environment, etc.
    - optional, turned off by default: set up PostgreSQL server, create database and user
2. `cd backend` and install dependencies into your env with: `pip3 install -r requirements.txt`
    - if `pycld2` problems, download it from [here](https://github.com/aboSamoor/pycld2/issues/24#issuecomment-747378534) and manually pip install the wheel
    - you might need to manually install [tensorflow with the CUDA Toolkit](https://www.tensorflow.org/install/pip)
3. Create and fill out `secrets.json` as indicated by `secrets.json.mock` (only the services that you need, deepL and database are not required by default)
4. Run `python3 setup.py` with different arguments to download translation and image models (and set up the database table)
5. Check out `config.py`, customize settings as needed
6. `python3 app.py`
    - for Stable Diffusion, first execution has to be from admin rights console to download the model


### Start up the frontend server

1. Set up your env: install node
2. `cd frontend`
3. Install dependencies with: `npm install`
4. `npm start`


### Connect frontend to remotely running backend
- to connect and port-forward: `ssh -L 8000:localhost:8000 -L 5432:localhost:5432 ubuntu@IP_ADDRESS`
- to monitor VRAM usage: `nvidia-smi -l 1` or `nvidia-smi --query-gpu=memory.used --format=csv -l 1`


### Docker
1. Have GPU drivers and Docker installed
    - optional: set up PostgreSQL server; create database and user
2. Create and fill out `backend/secrets.json` as indicated by `secrets.json.mock`, and customize settings in `backend/config.py`
3. `docker-compose up`



### Latest screenshots
![screenshot](explore/docs/md-screens-4.png?raw=true "screenshot")
![screenshot](explore/docs/md-screens-3.png?raw=true "screenshot")
![screenshot](explore/docs/md-screens-1.png?raw=true "screenshot")
![screenshot](explore/docs/md-screens-2.png?raw=true "screenshot")

![screenshot](explore/docs/museum-opening.jpeg?raw=true "exhibition-opening")
