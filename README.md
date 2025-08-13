# Dad Jokes

![Docker Build Status](https://github.com/rushyrush/dad-jokes/actions/workflows/docker_build.yaml/badge.svg)

A lightweight web application that serves up random dad jokes! Built with Docker for easy deployment.

## Live Demo
Check out the live version: [Dad Jokes Website](https://dadjokes.rushdynamics.com/)

## Docker Info
- **Image**: `rushyrush/dad-jokes`
- **Port**: 80 (HTTP)

## Deploy With Docker

```bash
docker run -d --name dad-jokes -p 8080:80 rushyrush/dad-jokes
```

## Contribute & Add a Joke
Want to contribute or modify the jokes? [Add a New Joke](https://github.com/rushyrush/dad-jokes/blob/master/assets/db.json).
