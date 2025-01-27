FROM rockylinux:8.9

#Install Nodejs and SQLlite
RUN yum install -y nodejs sqlite

#Set Time zone
#RUN ln -snf /usr/share/zoneinfo/America/Bogota /etc/localtime && echo America/Bogota > /etc/timezone

#Configure enviroment for app
RUN npm install sqlite3
ARG CACHE_DATE=2024-05-20
RUN mkdir /opt/peggame
ARG CACHE_DATE=2024-05-21
COPY files/app.js /opt/peggame/
COPY files/game.html /opt/peggame/
COPY files/package.json /opt/peggame/
RUN cd /opt/peggame/

RUN ls -all -h /opt/peggame/

EXPOSE 8000

CMD ["node","/opt/peggame/app.js"]
