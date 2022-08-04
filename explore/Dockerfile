FROM nvidia/cuda:11.4.3-cudnn8-devel-ubuntu20.04

# expose
EXPOSE 8000
# set working directory
WORKDIR /app

# install pip
RUN apt-get update && apt-get install -y python3-pip
# update pip
RUN pip3 install --upgrade pip
# install requirements
RUN pip3 install min-dalle==0.4.11

# add script
COPY m1_kuprel.py app.py

# run server in argument-friendly form
ENTRYPOINT ["python3", "app.py"]
