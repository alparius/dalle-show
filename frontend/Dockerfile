FROM node

WORKDIR /app
COPY . /app/

ENV REACT_APP_BACKEND_URL='http://localhost:8000'
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]