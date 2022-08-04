FROM nvidia/cuda:11.4.3-cudnn8-devel-ubuntu20.04

# expose
EXPOSE 8000
# set working directory
WORKDIR /app

# install pip
RUN apt-get update && apt-get install -y python3-pip
# update pip
RUN pip3 install --upgrade pip
# add requirements
COPY ./requirements.txt /app/requirements.txt
# install requirements
RUN pip3 install -r requirements.txt

# add source code
COPY . /app

# run server
CMD python3 app.py