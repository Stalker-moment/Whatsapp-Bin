# Whatsapp-Bot-IoT
Chatbot Whatsapp can control IoT via API/endpoint

# Installation



## Connect To Project

* [`Smartbin`](https://github.com/Stalker-moment/Smartbin)
* [`IoT Relay NodeMcu`](https://github.com/Stalker-moment/IoT-Relay)
* [`IoT Solar Home System`](https://github.com/Stalker-moment/Solarhome-System)



### other integration

* [`Teleram Bot`](https://github.com/Stalker-moment/telebot-bin)



## Windows

* [`Download Node JS`](https://nodejs.org/en/download/)
* [`Download Git`](https://git-scm.com/download/win)



## Cloning this repo

```cmd

> git clone https://github.com/Stalker-moment/Whatsapp-Bin/
> cd Whatsapp-Bot-IoT

```



## Install the package

```cmd

> npm i

```



## Edit config file

Edit the required value in `./lib/database/setting.json`. You can get the token blynk at [`blynk.cloud`](https://blynk.cloud/).

```json

{
    "limitCount":"5000",
    "memberLimit":"5",
    "groupLimit":25,
    "blynk_token": "VqR5Pyeqoxxxxxxxxxxxxxx", 
    "blynk_server": "sgp1.blynk.cloud",
    "on_value": "1",
    "off_value": "0",
    "mtc":false,
    "restartState":false,
    "restartId":"undefined",
    "banChats":false,
    "Rest":true
}

 ```

## Run the bot

```cmd

> npm start

```

## Stop the bot

```cmd

> ctrl + c

```


## Troubleshooting
Make sure all the necessary dependencies are installed: https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md

Fix Stuck on linux, install google chrome stable: 
```bash
> wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
> sudo apt install ./google-chrome-stable_current_amd64.deb
```


# Thanks To

* [`Open-Wa/Wa-Automate`](https://github.com/open-wa/wa-automate-nodejs)
* [`Blynk`](https://github.com/blynkkk/blynk-library)
