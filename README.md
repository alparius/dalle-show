# dalle-show

Bringing the open-source DALL-E to an exhibition


### Fire up the backend

#### Locally:
0. Set up your env: python, venv/conda/global
1. `cd backend`
2. Install dependencies into your env with: `pip3 install -r requirements.txt`
3. Check out `config.py`, e.g. set `POTATO_PC` to `True` when on laptop
4. `python app.py`

#### Docker:
0. Set up your docker env (installation)
1. `cd backend`
2. Check out `config.py`, e.g. set `POTATO_PC` to `True` when on laptop
3. `docker build . -t dalle-backend` (subsequent runs will be faster)
4. `docker run -p 8000:8000 --name -i dalle-backend dalle-backend`

