const { create, Client } = require('@open-wa/wa-automate')
const color = require('./lib/color')
const fs = require('fs')
const fetch = require('node-fetch')
// const msgHndlr = require ('./tobz')
const figlet = require('figlet')
const lolcatjs = require('lolcatjs')
const options = require('./options')
const cron = require('node-cron');
const axios = require('axios')
const moment = require('moment-timezone')

// AUTO UPDATE BY NURUTOMO
// THX FOR NURUTOMO
// Cache handler and check for file change
require('./tobz.js')
nocache('./tobz.js', module => console.log(`'${module}' Updated!`))
require('./lib/help.js')
nocache('./lib/help.js', module => console.log(`'${module}' Updated!`))
require('./lib/database/setting.json')
nocache('./lib/database/setting.json', module => console.log(`'${module}' Updated!`))
require('./lib/database/database.json')
nocache('./lib/database/database.json')

const setting = JSON.parse(fs.readFileSync('./lib/database/setting.json'))
const databases = JSON.parse(fs.readFileSync('./lib/database/database.json'))

let previousValues = {};

const time = moment().format('HH:mm:ss');
const date = moment().format('YYYY-MM-DD');

function convertMilisecondsToTime(miliseconds) {
    const seconds = Math.floor((miliseconds / 1000) % 60);
    const minutes = Math.floor((miliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((miliseconds / (1000 * 60 * 60)) % 24);
  
    const timeString = [hours, minutes, seconds]
      .map((value) => value < 10 ? `0${value}` : `${value}`)
      .join(':');
  
    return timeString;
  }

let { 
    memberLimit, 
    groupLimit,
    blynk_token,
    group_id,
    mtc: mtcState,
    restartState: isRestart
    } = setting

let {
    hardware,
    Humidity,
    Temperature,
    Ultrasonic,
    MQ7,
    PPM,
    VoltSolar,
    SoilMos,
    PIRStat,
    Tair,
    VoltBattery,
    CurrentBattery,
    WattBattery,
    LDRStat,
    Gas_Smoke,
    VoltAC,
    CurrentAC,
    WattAC,
    KWHAC,
    FrequencyAC,
    PowerFactorAC,
    InverterStat,
    Sirine,
    Pump_Plant,
    Pump_Water
} = databases

function restartAwal(tobz){
    setting.restartState = false
    isRestart = false
    tobz.sendText(setting.restartId, 'Restart Succesfull!')
    setting.restartId = 'undefined'
    //fs.writeFileSync('./lib/setting.json', JSON.stringify(setting, null,2));
}

lolcatjs.options.seed = Math.round(Math.random() * 1000);
lolcatjs.options.colors = true;

const start = async (tobz = new Client()) => {
        console.log('------------------------------------------------')
        lolcatjs.fromString(color(figlet.textSync('IoT Wa-Bot', { horizontalLayout: 'full' })))
        console.log('------------------------------------------------')
        lolcatjs.fromString('[DEV] Tier Sinyo')
        lolcatjs.fromString('[SERVER] Server Started!')
        //tobz.onAnyMessage((fn) => messageLog(fn.fromMe, fn.type))
        // Force it to keep the current session
        tobz.onStateChanged((state) => {
            console.log('[Client State]', state)
            if (state === 'CONFLICT' || state === 'UNLAUNCHED') tobz.forceRefocus()
        })
        // listening on message
        tobz.onMessage((async (message) => {

        tobz.getAmountOfLoadedMessages() // Cut message Cache if cache more than 3K
            .then((msg) => {
                if (msg >= 1000) {
                    console.log('[CLIENT]', color(`Loaded Message Reach ${msg}, cuting message cache...`, 'yellow'))
                    tobz.cutMsgCache()
                }
            })
        // msgHndlr(tobz, message)
        // Message Handler (Loaded from recent cache)
        require('./tobz.js')(tobz, message)
    }))
           

        tobz.onAddedToGroup(async (chat) => {
            if(isWhite(chat.id)) return tobz.sendText(chat.id, 'Halo aku Sinchan, Ketik #help Untuk Melihat List Command Ku...')
            if(mtcState === false){
                const groups = await tobz.getAllGroups()
                // BOT group count less than
                if(groups.length > groupLimit){
                    await tobz.sendText(chat.id, 'Maaf, Batas group yang dapat Sinchan tampung sudah penuh').then(async () =>{
                        tobz.deleteChat(chat.id)
                        tobz.leaveGroup(chat.id)
                    })
                }else{
                    if(chat.groupMetadata.participants.length < memberLimit){
                        await tobz.sendText(chat.id, `Maaf, BOT keluar jika member group tidak melebihi ${memberLimit} orang`).then(async () =>{
                            tobz.deleteChat(chat.id)
                            tobz.leaveGroup(chat.id)
                        })
                    }else{
                        if(!chat.isReadOnly) tobz.sendText(chat.id, 'IoT Bot, kirim #help untuk melihat command')
                    }
                }
            }else{
                await tobz.sendText(chat.id, 'Bot sedang maintenance, coba lain hari').then(async () => {
                    tobz.deleteChat(chat.id)
                    tobz.leaveGroup(chat.id)
                })
            }
        })

        /*tobz.onAck((x => {
            const { from, to, ack } = x
            if (x !== 3) tobz.sendSeen(to)
        }))*/

        // listening on Incoming Call
        tobz.onIncomingCall(( async (call) => {
            await tobz.sendText(call.peerJid, 'Maaf, saya tidak bisa menerima panggilan.')
            .then(() => tobz.contactBlock(call.peerJid))
        }))

  
       //CRONJOB PERGANTIAN VALUE ONLINE/OFFLINE

let prevdataon = null;
let prevdatadistance = null
let cronJobOn = null;


cronJobOn = cron.schedule('*/5 * * * * *', async (lol) => {
    try {
        axios.get(`https://sgp1.blynk.cloud/external/api/isHardwareConnected?token=rOFxKOYyuzloQ3wOZdR-KIWQg6l3APK3`)
            .then(async response => {
                const data = response.data;
                const newDataon = Boolean(data);
        
            const endpointcekbin = await fetch(`https://sgp1.blynk.cloud/external/api/get?token=rOFxKOYyuzloQ3wOZdR-KIWQg6l3APK3&V0&V1&V2&V3&V4&V5&V6&V7&V8&V9`)
            const cekbin = await endpointcekbin.json()
            const newDatadis = cekbin.V2.split(" ")[0]

            if(newDatadis !== prevdatadistance){
                prevdatadistance = newDatadis;

                if(newDatadis < "12"){
                    console.log('bin full')
                    //tobz.sendText(`6282134580805@c.us`, `Tempat sampah hampir Full`)
                }
            }

        if (newDataon !== prevdataon) {
            prevdataon = newDataon;
            
            if (newDataon === true) {
            console.log('Device: Online');
            //await relay.helponline(lol, user.full_name, lol.message.from.id.toString())
            tobz.sendText(`6282134580805@c.us`, `Smartbin telah online`)
            } else if (newDataon === false) {
            console.log('Device: Offline');
            await axios.get(`https://sgp1.blynk.cloud/external/api/update?token=rOFxKOYyuzloQ3wOZdR-KIWQg6l3APK3&V0=0`)
            tobz.sendText(`6282134580805@c.us`, `Smartbin telah offline`)
            //await relay.helpoffline(lol, user.full_name, lol.message.from.id.toString())
            }
        }
    })
    } catch (error) {
    console.error('Terjadi kesalahan:', error.message);
    }
});

        cron.schedule('*/5 * * * * *', async () => {
            // Fetch the data from the JSON URLs
            const getdataswitching = await axios.get(`https://sgp1.blynk.cloud/external/api/get?token=rOFxKOYyuzloQ3wOZdR-KIWQg6l3APK3&V0&V1&V2&V3&V4`);

            // Extract the values from the responses
            const dataswitch = getdataswitching.data.V0;
            const datatutup = getdataswitching.data.V1;
            const datadalam = getdataswitching.data.V2.split(" ")[0];
            const datadepan = getdataswitching.data.V3;
            const datacount = getdataswitching.data.V4.split("|")[0]
            const isauto = getdataswitching.data.V4.split("|")[1]

            // Compare the values to the previous values
            if (dataswitch.toString() !== dataswitch.toString()){
            // Send a notification that the data has changed
                if(dataswitch.toString() == "1"){
                    tobz.sendText(group_id, `switch bin enable`);
                }else{
                    tobz.sendText(group_id, `switch bin disable`);
                }
            }

            if (datadalam.toString() !== datadalam.toString()){
                // Send a notification that the data has changed
                    if(datadalam.toString() < "12"){
                        tobz.sendText(group_id, `Smartbin penuh!\nOpened in : ${datacount}\nMode : ${isauto}`);
                    }else{
                        tobz.sendText(group_id, `Smartbin Not penuh`);
                    }
            }



            // Update the previous values
            fs.writeFileSync('./lib/database/database.json', JSON.stringify(databases))
        });


        let prevdataswitch = null;     
        let prevSwitchTime = null; 

        cron.schedule('*/5 * * * * *', async () => {
            try {
              const endpointcekbin = await fetch(`https://sgp1.blynk.cloud/external/api/get?token=rOFxKOYyuzloQ3wOZdR-KIWQg6l3APK3&V0&V1`);
              const cekbin = await endpointcekbin.json();
          
              if (cekbin.V0 !== prevdataswitch) {
                prevdataswitch = cekbin.V0;
          
                const currentTime = new Date(); 
          
                let logText = '';
                let durationText = '';
          
                if (cekbin.V0 === 1) {
                  console.log('Switch: Turn On');
          
                  if (prevSwitchTime) {
                    const duration = currentTime - prevSwitchTime; 
                    const thetime = convertMilisecondsToTime(duration)
                    console.log('Durasi Terakhir On:', thetime);
                    durationText = `Durasi Terakhir On: ${thetime}`;
                    tobz.sendText(`6282134580805@c.us`, `Turn On, Durasi terakhir : ${thetime}`)
                  }
                  logText = `\n--> [${date} - ${time}] Switch On, `;
                  //await relay.binon(lol, user.full_name, lol.message.from.id.toString());
                } else if (cekbin.V0 === 0) {
                  console.log('Switch: Turn Off');
                  if (prevSwitchTime) {
                    const duration = currentTime - prevSwitchTime; 
                    const thetime = convertMilisecondsToTime(duration)
                    console.log('Durasi Terakhir Off:', thetime);
                    durationText = `Durasi Terakhir Off: ${thetime}`;
                    tobz.sendText(`6282134580805@c.us`, `Turn Off, Durasi terakhir : ${thetime}`)
                  }
                  logText = `\n--> [${date} - ${time}] Switch Off, `;
                  //await relay.binoff(lol, user.full_name, lol.message.from.id.toString());
                }
          
                prevSwitchTime = currentTime; 
          
                const logEntry = `${logText} ${durationText}`;
                fs.appendFileSync('./lib/database/logswitch.txt', logEntry);
              }
          
            } catch (error) {
              console.error('Terjadi kesalahan:', error.message);
            }
          });

        // Smarthome notify
        cron.schedule('*/10 * * * * *', async () => {
            // Fetch the data from the JSON URLs
            const getshardware = await axios.get(`https://sgp1.blynk.cloud/external/api/isHardwareConnected?token=${blynk_token}`);

            // Extract the values from the responses
            const hardwares = getshardware.data;

            // Compare the values to the previous values
            if (hardwares.toString() !== hardwares){
            // Send a notification that the data has changed
                if(hardwares.toString() == "true"){
                    tobz.sendText(group_id, `Device Online\nFetching Data Enabled\nGo Turn On Bin`);
                }else{
                    tobz.sendText(group_id, `Device Offine\nFetching Data Disabled`);
                }
            }

            // Update the previous values
            databases.hardware = `${hardwares}`
            hardware = `${hardwares}` 
            fs.writeFileSync('./lib/database/database.json', JSON.stringify(databases))
        });

        if(hardware == "true"){
        cron.schedule('*/5 * * * * *', async () => {
            // Fetch the data from the JSON URLs
            const gettingvalue = await axios.get(`https://sgp1.blynk.cloud/external/api/get?token=${blynk_token}&V0&V1&V2&V3&V4&V5&V6&V7&V8&V9&V10&V11&V12&V13&V14&V15&V16&V17&V18&V19&V20&V21&V22&V23`);
        
            // Extract the values from the responses
            var V1 = gettingvalue.data.V1; //Humidity
            const V2 = gettingvalue.data.V2; //Temperature
            const V3 = gettingvalue.data.V3; //Ultrasonic
            const V0 = gettingvalue.data.V0; //MQ7 (ppm)
            const V4 = gettingvalue.data.V4; //Index PPM (MQ7)
            const V5 = gettingvalue.data.V5; //Voltage Solar sensor
            const V6 = gettingvalue.data.V6; //Soil Moisture (Lembab Tanah)
            const V7 = gettingvalue.data.V7; //PIR Sensor
            const V8 = gettingvalue.data.V8; //Tinggi Air
            const V9 = gettingvalue.data.V9; //Voltage battery sensor
            const V10 = gettingvalue.data.V10; //Current DC sensor
            const V11 = gettingvalue.data.V11; //Watt Energy DC
            const V12 = gettingvalue.data.V12; //Stat LDR (LAMP)
            const V13 = gettingvalue.data.V13; //Stat MQ6 (GAS DETECT)
            const V14 = gettingvalue.data.V14; //Voltage AC sensor
            const V15 = gettingvalue.data.V15; //Current AC sensor
            const V16 = gettingvalue.data.V16; //Watt Energy AC
            const V17 = gettingvalue.data.V17; //KWH Energy AC
            const V18 = gettingvalue.data.V18; //Frequency AC
            const V19 = gettingvalue.data.V19; //Power Factor AC
            const V20 = gettingvalue.data.V20; //Stat Relay Master Inverter
            const V21 = gettingvalue.data.V21; //Stat Relay Sirine Alarm
            const V22 = gettingvalue.data.V22; //Stat Relay Pump Plant
            const V23 = gettingvalue.data.V23; //Stat Relay Pump Water

            // Compare the values to the previous values
            if (V7 !== previousValues.V7){
            // Send a notification that the data has changed
               if(V7 == "ON"){
                tobz.sendText(group_id, `Kipas telah ON`)
               } else if(V7 == "OFF"){
                tobz.sendText(group_id, `Kipas telah OFF`)
               }
            }

            if(V12 !== previousValues.V12) {
                if(V12 == "ON"){
                    tobz.sendText(group_id, `Lampu telah ON`)
                   } else if(V12 == "OFF"){
                    tobz.sendText(group_id, `Lampu telah OFF`)
                   }
                }
            
            if(V13 !== Gas_Smoke && V21 !== Sirine) {
                if(V13 == "Gas Bocor" && V21 == "ON"){
                    tobz.sendText(group_id, `*------ WARNING!!! ------*\nGas Bocor\n\nAlarm Diaktifkan!`)
                } else {
                    tobz.sendText(group_id, `Gas Sudah Tidak Bocor\nAlarm dimatikan`)
                }
            }
            
            if(V22 !== Pump_Plant){
                if(V22 == "ON"){
                    tobz.sendText(group_id, `Pompa Air Tanaman telah ON`)
                   } else if(V22 == "OFF"){
                    tobz.sendText(group_id, `Pompa Air Tanaman telah OFF`)
                   }
                }

            if(V23 !== Pump_Water){
                if(V23 == "ON"){
                tobz.sendText(group_id, `Pompa Air Tanki telah ON`)
                    } else if(V23 == "OFF"){
                tobz.sendText(group_id, `Pompa Air Tanki telah OFF`)
                    }
                }

            if(V20 !== InverterStat){
                if(V20 == "ON"){
                tobz.sendText(group_id, `Inverter telah ON`)
                    } else if(V20 == "OFF"){
                tobz.sendText(group_id, `Inverter telah OFF`)
                    }
                }

            
            // Store the current values as the previous values
            previousValues = { V7, V12 };
            databases.Humidity = `${V1}`
            Humidity = `${V1}`
            databases.Temperature = `${V2}`
            Temperature = `${V2}`
            databases.Ultrasonic = `${V3}`
            Ultrasonic = `${V3}`
            databases.MQ7 = `${V0}`
            MQ7 = `${V0}`
            databases.PPM = `${V4}`
            PPM = `${V4}`
            databases.VoltSolar = `${V5}`
            VoltSolar = `${V5}`
            databases.SoilMos = `${V6}`
            SoilMos = `${V6}`
            databases.PIRStat = `${V7}`
            PIRStat = `${V7}`
            databases.Tair = `${V8}`
            Tair = `${V8}`
            databases.VoltBattery = `${V9}`
            VoltBattery = `${V9}`
            databases.CurrentBattery = `${V10}`
            CurrentBattery = `${V10}`
            databases.WattBattery = `${V11}`
            WattBattery = `${V11}`
            databases.LDRStat = `${V12}`
            LDRStat = `${V12}`
            databases.Gas_Smoke = `${V13}`
            Gas_Smoke = `${V13}` 
            databases.VoltAC = `${V14}`
            VoltAC = `${V14}`
            databases.CurrentAC = `${V15}`
            CurrentAC = `${V15}`
            databases.WattAC = `${V16}`
            WattAC = `${V16}`
            databases.KWHAC = `${V17}`
            KWHAC = `${V17}`
            databases.FrequencyAC = `${V18}`
            FrequencyAC = `${V18}`
            databases.PowerFactorAC = `${V19}`
            PowerFactorAC = `${V19}`
            databases.InverterStat = `${V20}`
            InverterStat = `${V20}`
            databases.Sirine = `${V21}`
            Sirine = `${V21}`
            databases.Pump_Plant = `${V22}`
            Pump_Plant = `${V22}`
            databases.Pump_Water = `${V23}`
            Pump_Water = `${V23}`
            fs.writeFileSync('./lib/database/database.json', JSON.stringify(databases))

            const txtlog =`
===============================[${moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')}]===============================

-----[DATA SENSOR]-----
Humidity : ${V1}
Temperature : ${V2}
Ultrasonic : ${V3}
Water Level : ${V8}
MQ7 : ${V0}
Index MQ7 : ${V4}
Solar Voltage : ${V5}
Lembab Tanah : ${V6}
Battery Voltage : ${V9}
Current DC : ${V10}
Watt Power DC : ${V11}
Voltage AC : ${V14}
Current AC : ${V15}
Watt Power AC : ${V16}
KWh Energy AC : ${V17}
Frequency AC : ${V18}
Power Factor (PF) AC : ${V19}

-----[RELAY STAT]-----
Inverter (R1) : ${V20}
Sirine (R2) : ${V21}
Lamp (R5) : ${V12}
Fan (R6) : ${V7}
Pump Plant (R3) : ${V22}
Pump Tank (R4) : ${V23}
`
            fs.writeFileSync('./lib/database/database.json', JSON.stringify(databases))
            fs.appendFileSync('./lib/database/log.txt',  `${txtlog}`);
        });
    }
}
    

/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
function nocache(module, cb = () => { }) {
    console.log('Module', `'${module}'`, 'is now being watched for changes')
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

/**
 * Uncache a module
 * @param {string} module Module name or path
 */
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

create(options(true, start)) 
    .then(tobz => start(tobz))
    .catch((error) => console.log(error))

