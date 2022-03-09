
## Crime Tracker Client

Setting up the `client` app for the crime tracker system. Follow the steps below in setting up this system.

### Prerequisite

- Nodejs Installed
  - [download nodejs](https://nodejs.org) 
  - If you have no exprerience setting up `nodejs`, please watch this video explanation [Installing and Setting up nodejs](https://www.youtube.com/watch?v=JINE4D0Syqw)

- `NPM` latest version

### Project setup

- `STEP 1`
  Download the project from github either by using `curls` or `ssh`

  `CURL`
    ```
        C:/users/benrobo> curl https://github.com/Benrobo/crime-tracker-client.git
    ```
  `GIT SSH`
    ```
        C:/users/benrobo/desktop> git clone https://github.com/Benrobo/crime-tracker-client.git
    ```
    This would download this project in `desktop` directory having the name `crime-tracker-client` if that where youre executing this command from.

- `STEP 2`
  Move into the project directory and install all necessary `dependencies`

    ```
        C:/users/benrobo/desktop/crime-tracker-client> npm install
    ```

- `STEP 3`
    Start the local `react` dev server.
    ```
        C:/users/benrobo/desktop/crime-tracker-client> npm start
    ```

    this would open a local `http` server with port `3000`, with the `login` screen displayed.

## Congratulation, you've sucessfully setup the client app.

As you well know that this project depends on the `server-side` logic to operate well. Follow the instructions in setting up the `crime-tracker-server` project.

click here [crime-tracker-server](https://github.com/Benrobo/crime-tracker-server) and visit the `setup.md` file. 