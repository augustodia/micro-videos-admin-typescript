FROM node:20.9.0-slim
# Instala o procps para o comando ps
RUN apt-get update && apt-get install -y procps && apt clean

RUN npm install -g @nestjs/cli@10.1.17 

USER node

WORKDIR /home/node/app

CMD ["tail", "-f", "/dev/null"]