FROM huggingface/transformers-all-latest-gpu

# expose
EXPOSE 8000
# set working directory
WORKDIR /app

# install pip
#RUN apt-get update && apt-get install -y python3-pip
# update pip
#RUN pip3 install --upgrade pip

# add requirements
COPY ./requirements.txt /app/requirements.txt
# install requirements
RUN pip3 install -r requirements.txt

# add source code
COPY . /app

# download models
RUN python3 setup.py --setup-db --offline-translation

# run server
CMD python3 app.py
