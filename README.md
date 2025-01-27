Peg Game Dockerized
===================
This is a javascript implementation of the Peg Game on a Docker.

<p align="center">
  <img width="400px" src="https://raw.githubusercontent.com/mafairnet/peggame/refs/heads/main/peg_game.jpg">
</p>

About
-----------
The Peg Game is a board game for one player involving movement of pegs on a board with holes.

####Rules
-To jump a peg, it must have an empty space next to it.
-You can use any peg as a jumper, as long as the peg you jump is directly adjacent to it and has an open space next to it.
-Every peg you jump must be removed.
-You win when there is only one peg left.

Instructions to deploy
-----------
1. Install Docker
```
#On Debian/Ubuntu
apt install docker git
#On RHEL
yum install docker git
```
2. Clone this repo
```
git clone https://github.com/mafairnet/peggame.git
```
3. Build the Docker image
```
docker build -t peggame .
```
4. Run the docker
```
docker run -d -p 8000:8000 peggame:latest
```
5. Access to the Web Page at your DOCKER_SERVER_IP:8000


