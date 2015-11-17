        ____                      __                __         
       / __ \____ _      ______  / /___  ____ _____/ /__  _____
      / / / / __ \ | /| / / __ \/ / __ \/ __ `/ __  / _ \/ ___/
     / /_/ / /_/ / |/ |/ / / / / / /_/ / /_/ / /_/ /  __/ /
    /_____/\____/|__/|__/_/ /_/_/\____/\__,_/\__,_/\___/_/

              

## Setup Node JS
  - [Download tgz file](https://nodejs.org/dist/v4.2.2/node-v4.2.2-linux-x64.tar.gz)
  - Extract `tar -zxvf node-v4.2.2-linux-x64.tar.gz`
  - Move to `/opt/node`
  - Add `/opt/node/bin/` to `/etc/environment`
  - `source /etc/environment` to apply the change

## Install Git
  - `sudo apt-get install git`

## Setup Downloader
  - Clone the project to a desired location `git clone https://github.com/project-bibliotheca/downloader.git`
    - Make sure that the user you use to run the app has write access to the folder (For now ;) )
  - `cd` to the location
  - run by executing `node server.js`
  - Access on port :8080 `http://<server>:8080`