        ____                      __                __         
       / __ \____ _      ______  / /___  ____ _____/ /__  _____
      / / / / __ \ | /| / / __ \/ / __ \/ __ `/ __  / _ \/ ___/
     / /_/ / /_/ / |/ |/ / / / / / /_/ / /_/ / /_/ /  __/ /
    /_____/\____/|__/|__/_/ /_/_/\____/\__,_/\__,_/\___/_/



## Setup Node JS

  - Download the latest version of [NodeJS](https://nodejs.org/dist/v6.2.0/node-v6.2.0-linux-x64.tar.xz)
  - Extract `tar -zxvf node-${version}-linux-x64.tar.xz`
  - Move the extracted folder to `/opt/node`
  - Add `/opt/node/bin/` to `/etc/environment`
  - `source /etc/environment` to apply the change

## Install Git

  - `sudo apt-get install git`

## Setup Downloader
  - Clone the project to a desired location `git clone https://github.com/project-bibliotheca/downloader.git`
    - Make sure that the user you use to run the app has write access to the folder (For now ;) )
  - `cd` to the location
  - run `npm install`
  - run by executing `npm start`
  - Access on port :8080 `http://<server>:8080`
