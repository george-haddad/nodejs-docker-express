# nodejs-docker-express
Playing with NodeJS and Docker and Express

## Docker Commands

```shell
$docker stop <container-id>
$docker rm <container-id>
$docker build -t node-web-app .
$docker run -it --name node-web-app -p 8080:8080 -v $(pwd):/usr/src/app -d node-web-app
$docker exec -it <container-id> /bin/bash
 ```
