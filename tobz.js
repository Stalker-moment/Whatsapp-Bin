require('dotenv').config()
const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
const moment = require('moment-timezone')
const color = require('./lib/color')
const axios = require('axios')
const fetch = require('node-fetch')
const saveImage = require('save-image')
const util = require('util')
const { tmpfiles, telegraphUp } = require('./lib/upload');

const { 
    sleep
    } = require('./lib/functions')
const { 
    help,
    } = require('./lib/help')

// LOAD FILE
let setting = JSON.parse(fs.readFileSync('./lib/database/setting.json'))
const databases = JSON.parse(fs.readFileSync('./lib/database/database.json'))

let { 
    blynk_server,
    blynk_token,
    on_value,
    off_value
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

    
prefix = '#'
var timeStart = Date.now() / 1000
moment.tz.setDefault('Asia/Jakarta').locale('id')

module.exports = tobz = async (tobz, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, chatId, caption, isMedia, isAudio, mimetype, quotedMsg, quotedMsgObj, author, mentionedJidList } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName } = sender
        pushname = pushname || verifiedName
        const commands = caption || body || ''
        const chats = (type === 'chat') ? body : (type === 'image' || type === 'video') ? caption : ''
        const argx = commands.toLowerCase()
        const args =  commands.split(' ')
        const command = commands.toLowerCase().split(' ')[0] || ''

        global.prefix
        
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const botNumber = await tobz.getHostNumber()
        const blockNumber = await tobz.getBlockedIds()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await tobz.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false

        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
        const url = args.length !== 0 ? args[0] : ''

        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        const isQuotedVideo = quotedMsg && quotedMsg.type === 'video'
        const isQuotedAudio = quotedMsg && (quotedMsg.type === 'audio' || quotedMsg.type === 'ptt' || quotedMsg.type === 'ppt')
        const isQuotedFile = quotedMsg && quotedMsg.type === 'document'

        body = (type === 'chat' && body.startsWith(prefix)) ? body : (((type === 'image' || type === 'video') && caption) && caption.startsWith(prefix)) ? caption : ''
        const arg = body.substring(body.indexOf(' ') + 1)
        const isPrivate = sender.id === chat.contact.id
        const stickermsg = message.type === 'sticker'
        const isCmd = command.startsWith(prefix)
        
        const tms = (Date.now() / 1000) - (timeStart);
        const cts = waktu(tms)

        const serial = sender.id
        const ownerNumber = '["6282134580805@c.us","447405740681@c.us"]'
        const isOwner = ownerNumber.includes(sender.id)
		const isImage = /^image/.test(mimetype)
        const isVideo = /^video/.test(mimetype)

        function waktu(seconds) { 
            seconds = Number(seconds);
            var d = Math.floor(seconds / (3600 * 24));
            var h = Math.floor(seconds % (3600 * 24) / 3600);
            var m = Math.floor(seconds % 3600 / 60);
            var s = Math.floor(seconds % 60);
            var dDisplay = d > 0 ? d + (d == 1 ? " Hari,":" Hari,") : "";
            var hDisplay = h > 0 ? h + (h == 1 ? " Jam,":" Jam,") : "";
            var mDisplay = m > 0 ? m + (m == 1 ? " Menit,":" Menit,") : "";
            var sDisplay = s > 0 ? s + (s == 1 ? " Detik,":" Detik") : "";
            return dDisplay + hDisplay + mDisplay + sDisplay;
        }

        switch(command) {

        case prefix+'bin':
        case 'bin':
            const getdataearly = await axios.get(`https://sgp1.blynk.cloud/external/api/get?token=rOFxKOYyuzloQ3wOZdR-KIWQg6l3APK3&V0&V7&V8`)
            const getdataonline = await axios.get(`https://sgp1.blynk.cloud/external/api/isHardwareConnected?token=rOFxKOYyuzloQ3wOZdR-KIWQg6l3APK3`)
            const dataonline = getdataonline.data
            const statusdevices = Boolean(dataonline).toString()
            
            if(statusdevices === "true"){
                var statusdevice = `Online`
            } else {
                var statusdevice = `offline`
            }

            const dataswitch = getdataearly.data.V0
            const datalevel = getdataearly.data.V8
            
            if(dataswitch.toString() == "1"){
                var statusonoff = "ON"
            } else {
                var statusonoff = "OFF"
            }

            try{        
            const keyword = args[1]
            if(keyword.toLocaleLowerCase() === 'on'){
                if (statusonoff.toLocaleLowerCase() == "on"){
                    tobz.reply(from, `Tong sampah sudah nyala`, id)
                } else {
                    try{
                    const countershutdown = await axios.get(`https://${blynk_server}/external/api/update?token=rOFxKOYyuzloQ3wOZdR-KIWQg6l3APK3&V0=${on_value}`)
                    tobz.reply(from, `Tong sampah berhasil dinyalakan`, id)
                    } catch(e){
                        tobz.reply(from, `Switching Error\n\nError :`+err, id)
                    }
                }
            } else if(keyword.toLocaleLowerCase() === 'off'){
                if (statusonoff.toLocaleLowerCase() == "off"){
                    tobz.reply(from, `Tong sampah sudah mati`, id)
                } else {
                    try{
                    const shutdown = await axios.get(`https://${blynk_server}/external/api/update?token=rOFxKOYyuzloQ3wOZdR-KIWQg6l3APK3&V0=${off_value}`)
                    tobz.reply(from, `Tong sampah berhasil dimatikan`, id)
                    } catch(e){
                        tobz.reply(from, `Switching Error\n\nError :`+err, id)
                    }
                }
            } else if(keyword.toLocaleLowerCase() === 'status' || 'cek'){
                const getdatafull = await axios.get(`https://sgp1.blynk.cloud/external/api/get?token=rOFxKOYyuzloQ3wOZdR-KIWQg6l3APK3&V1&V2&V3&V4&V5&V6&V7&V8&V9`)
                const datadistancetutup = getdatafull.data.V1
                const datadistancedalam = getdatafull.data.V2
                const datadistancedepan = getdatafull.data.V3
                const datacounter = getdatafull.data.V4.split("|")[0]
                const dataauto = getdatafull.data.V4.split("|")[1]
                const datatemperature = getdatafull.data.V5
                const datahumidity = getdatafull.data.V6
                const dataright = getdatafull.data.V7.split("|")[0]
                const datacenter = getdatafull.data.V7.split("|")[1]
                const dataleft = getdatafull.data.V7.split("|")[2]
                const dataway = getdatafull.data.V7.split("|")[3]

                const DATAFULLTXT =`
____________[Status SmartBin]___________

-> *Status Device :* ${statusdevice}
-> *on auto mode :* ${dataauto}
-> *Status Switch :* ${statusonoff}
-> *Tank Level :* ${datalevel}
-> *Right :* ${dataright}
-> *Center :* ${datacenter}
-> *Left :* ${dataleft}
-> *Index Moving :* ${dataway}
-> *Distance tutup:* ${datadistancetutup}
-> *Distance dalam:* ${datadistancedalam}
-> *Distance Depan:* ${datadistancedepan}
-> *Counter (tutup):* ${datacounter}
-> *Temperature:* ${datatemperature}
-> *Humidity:* ${datahumidity}
________________________________________
`
                await tobz.reply(from, DATAFULLTXT, id)
            } else if(keyword.toLocaleLowerCase() === 'log'){
                await tobz.reply(from, 'get log txt on telegrambot, wa bot only notification & datachecker', id)
            } 
        } catch (err){
            const availablecomantos =`
____________________________

-> *Status Device :* ${statusdevice}
-> *Status Switch :* ${statusonoff}
-> *Tank Level :* ${datalevel}
____________________________


Avaliable Command:

- ${prefix}bin on
- ${prefix}bin off
- ${prefix}bin log
- ${prefix}bin status
`
            tobz.reply(from, availablecomantos, id)
            console.log(err)
        }
        break

        case prefix+'upload':
        case 'upload':
            try{
                let anu = await tmpfiles('./lib/database/log.txt');
                let anu2 = await telegraphUp('./lib/database/log.txt')
                tobz.reply(from, util.format(anu), id)
                tobz.reply(from, util.format(anu2), id)
            } catch (err){
                console.log(err)
            }
        break
        case prefix+'play':
        case 'play':
            if(!args[1]) return tobz.reply(from, `usage : *${prefix}play* |[sending]|[query]\nEx : ${prefix}play |wa|dj bebas\n\nUsage Sending : wa/raspi\nwa : music dikirim ke bot wa\nraspi : music dikirim ke smartbin`, id)
            try{
                argz = body.trim().split('|')
                if (argz.length >= 2) {
                    tobz.reply(from, 'wait...', id)
                    const queryy1 = argz[1]
                    const queryy2 = argz[2]

                    const getquery = await axios.get(`https://api.lolhuman.xyz/api/ytsearch?apikey=RuiWithTier&query=${queryy2}`)
                    const getIDyt = getquery.data.result[0].videoId
                    const serverplaying = await axios.get(`https://api.lolhuman.xyz/api/ytaudio?apikey=RuiWithTier&url=https://www.youtube.com/watch?v=${getIDyt}`)
                    const collectdataplay = serverplaying.data.result

                if(queryy1.toLowerCase() == 'wa'){
                    const TXTPLAY = `
            [YT PLAY]

*Title :* ${collectdataplay.title}
*Uploader :* ${collectdataplay.uploader}
*Duration :* ${collectdataplay.duration}
*Bitrate :* 128
*Size :* ${collectdataplay.link.size}

wait until audio sending...
`
                    tobz.sendFileFromUrl(from, collectdataplay.thumbnail, 'thumb.jpg', TXTPLAY, id)
                    await tobz.sendFileFromUrl(from, collectdataplay.link.link, `${collectdataplay.title}.mp3`, '', id)
                } else if(queryy1.toLowerCase() == 'raspi'){
                    const TXTPLAY = `
            [YT PLAY]

*Title :* ${collectdataplay.title}
*Uploader :* ${collectdataplay.uploader}
*Duration :* ${collectdataplay.duration}
*Bitrate :* 128
*Size :* ${collectdataplay.link.size}

Music Injected at Blynk API...
`
                    tobz.sendFileFromUrl(from, collectdataplay.thumbnail, 'thumb.jpg', TXTPLAY, id)
                    const LINKAUDIOYT = collectdataplay.link.link
                    const injecturlyt = await axios.get(`https://fra1.blynk.cloud/external/api/batch/update?token=l7V8YnasSQ7pHJVJFwVChgyQH3xTAM4x&V0=1&V1=${LINKAUDIOYT}`)
                    console.log(`Injected ${URL} at blynk API`)
                    //tobz.reply(from, `Music Injected at blynk API`, id)
                    await sleep(60000) 
                    const reinjecturlyt = await axios.get(`https://fra1.blynk.cloud/external/api/batch/update?token=l7V8YnasSQ7pHJVJFwVChgyQH3xTAM4x&V0=0&V1=`)
                    console.log(`Switch off/reinjected`)
                    tobz.reply(from, `Music Reinjected at blynk API`, id)
                } else {
                    tobz.reply(from, `usage : *${prefix}play* |[sending]|[query]\nEx : ${prefix}play |wa|dj bebas\n\nUsage Sending : wa/raspi\nwa : music dikirim ke bot wa\nraspi : music dikirim ke smartbin`, id)
                }
            } else {
                tobz.reply(from, `usage : *${prefix}play* |[sending]|[query]\nEx : ${prefix}play |wa|dj bebas\n\nUsage Sending : wa/raspi\nwa : music dikirim ke bot wa\nraspi : music dikirim ke smartbin`, id)
            }

            } catch (err){
                tobz.reply(from, `error occured\n\nError :`+err, id)
                console.log(err)
            }
            break
        
        case prefix+'getid':
        case 'getid':
            try{
                const idnya = groupId.trim().split('-')
                tobz.reply(from, `change to : ${idnya}`, id)
                setting.group_id = `${idnya}`
                group_id = `${idnya}` 
                fs.writeFileSync('./lib/database/setting.json', JSON.stringify(setting))
            } catch (err){
                tobz.reply(from, err, id)
                console.log(err)
            }
        break

        case prefix+'info': //Info All Sensor
        case 'info':
            const txtlog =`
===[${moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')}]===

-----[DATA SENSOR]-----
Humidity : ${Humidity}
Temperature : ${Temperature}
Ultrasonic : ${Ultrasonic}
Water Level : ${Tair}
MQ7 : ${MQ7}
Index MQ7 : ${PPM}
Solar Voltage : ${VoltSolar}
Lembab Tanah : ${SoilMos}
Battery Voltage : ${VoltBattery}
Current DC : ${CurrentBattery}
Watt Power DC : ${WattBattery}
Voltage AC : ${VoltAC}
Current AC : ${CurrentAC}
Watt Power AC : ${WattAC}
KWh Energy AC : ${KWHAC}
Frequency AC : ${FrequencyAC}
Power Factor (PF) AC : ${PowerFactorAC}

-----[RELAY STAT]-----
Inverter (R1) : ${InverterStat}
Sirine (R2) : ${Sirine}
Lamp (R5) : ${LDRStat}
Fan (R6) : ${PIRStat}
Pump Plant (R3) : ${Pump_Plant}
Pump Tank (R4) : ${Pump_Water}
`
tobz.reply(from, txtlog, id)
            break

        case prefix+'log': //Log All Sensor
        case 'log':
            break

        case 'id':
            tobz.reply(from, id, id)
            break

        case prefix+'help':
        case prefix+'menu':    
        case 'menu':
        case 'help':
            const timeof = await axios.get(`https://timeapi.io/api/Time/current/zone?timeZone=Asia/Jakarta`)
            const gudyear = timeof.data
            const daynya = `${gudyear.dayOfWeek}`
            const datenya = `${gudyear.date}`
            const timenya = `${gudyear.time}`
            tobz.reply(from, help(prefix, cts, daynya, datenya, timenya), id)
            break

            case prefix+'relay':
            case 'relay': //IoT Function
            try{
                if (args[1].toLowerCase() === 'cek') {
                    const cekrelayy = await fetch(`https://${blynk_server}/external/api/get?token=${blynk_token}&V1&V2&V3&V4&V5&V6&V7&V8`)
                    const cekmcuu = await fetch(`https://${blynk_server}/external/api/isHardwareConnected?token=${blynk_token}`)
                    const cekrelay = await cekrelayy.json()
                    const cekmcu = await cekmcuu.json()
                    console.log(cekmcu)
                    if (cekmcu === true){
                        var nodemcustat = `Online`
                    } else if (cekmcu === false){
                        var nodemcustat = `offline`    
                    } else {
                        var nodemcustat = `Device Not Installed`
                    }
                    if (cekrelay.V1 === 1){
                        var V1stat = `Hidup`
                    } else if (cekrelay.V1 === 0){
                        var V1stat = `Mati`
                    } else {
                        var V1stat = `Pin Tidak Terdeteksi`
                    }
                    if (cekrelay.V2 === 1){
                        var V2stat = `Hidup`
                    } else if (cekrelay.V2 === 0){
                        var V2stat = `Mati`
                    } else {
                        var V2stat = `Pin Tidak Terdeteksi`
                    }
                    if (cekrelay.V3 === 1){
                        var V3stat = `Hidup`
                    } else if (cekrelay.V3 === 0){
                        var V3stat = `Mati`
                    } else {
                        var V3stat = `Pin Tidak Terdeteksi`
                    }
                    if (cekrelay.V4 === 1){
                        var V4stat = `Hidup`
                    } else if (cekrelay.V4 === 0){
                        var V4stat = `Mati`
                    } else {
                        var V4stat = `Pin Tidak Terdeteksi`
                    }
                    if (cekrelay.V5 === 1){
                        var V5stat = `Hidup`
                    } else if (cekrelay.V5 === 0){
                        var V5stat = `Mati`
                    } else {
                        var V5stat = `Pin Tidak Terdeteksi`
                    }
                    if (cekrelay.V6 === 1){
                        var V6stat = `Hidup`
                    } else if (cekrelay.V6 === 0){
                        var V6stat = `Mati`
                    } else {
                        var V6stat = `Pin Tidak Terdeteksi`
                    }
                    if (cekrelay.V7 === 1){
                        var V7stat = `Hidup`
                    } else if (cekrelay.V7 === 0){
                        var V7stat = `Mati`
                    } else {
                        var V7stat = `Pin Tidak Terdeteksi`
                    }
                    if (cekrelay.V8 === 1){
                        var V8stat = `Hidup`
                    } else if (cekrelay.V8 === 0){
                        var V8stat = `Mati`
                    } else {
                        var V8stat = `Pin Tidak Terdeteksi`
                    }
const Vall = `
NODEMCU : ${nodemcustat}

RELAY STATUS :
Relay 1 : ${V1stat}
Relay 2 : ${V2stat}
Relay 3 : ${V3stat}
Relay 4 : ${V4stat}
Relay 5 : ${V5stat}
Relay 6 : ${V6stat}
Relay 7 : ${V7stat}
Relay 8 : ${V8stat}
`
                    await tobz.reply(from, Vall, id)
                } else if (args[1].toLowerCase() === 'on') {    
                    const ONall = await axios.get(`https://${blynk_server}/external/api/batch/update?token=${blynk_token}&V1=1&V2=1&V3=1&V4=1&V5=1&V6=1&V7=1&V8=1`)
                    await tobz.reply(from, `Semua Relay Dinyalakan!`, id)
                } else if (args[1].toLowerCase() === 'off') {
                    const OFFall = await axios.get(`https://${blynk_server}/external/api/batch/update?token=${blynk_token}&V1=0&V2=0&V3=0&V4=0&V5=0&V6=0&V7=0&V8=0`)
                    await tobz.reply(from, `Semua Relay Dimatikan!`, id)
                } else if (args[1].toLowerCase() === '1') {
                    if (args[2].toLowerCase() === 'on'){
                        const V1on = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[1]}=${on_value}`)
                        await tobz.reply(from, `Relay 1 On!`, id)
                    } else if (args[2].toLowerCase() === 'off'){
                        const V1off = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[1]}=${off_value}`)
                        await tobz.reply(from, `Relay 1 Off!`, id)
                    } else {
                        await tobz.reply(from, `Option : On/Off\nExample : relay 1 on`, id)
                    }
                } else if (args[0].toLowerCase() === '2') {
                    if (args[2].toLowerCase() === 'on'){
                        const V2on = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[1]}=${on_value}`)
                        await tobz.reply(from, `Relay 2 On!`, id)
                    } else if (args[2].toLowerCase() === 'off'){
                        const V2off = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[1]}=${off_value}`)
                        await tobz.reply(from, `Relay 2 Off!`, id)
                    } else {
                        await tobz.reply(from, `Option : On/Off\nExample : relay 2 on`, id)
                    }
                } else if (args[1].toLowerCase() === '3') {
                    if (args[2].toLowerCase() === 'on'){
                        const V3on = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[1]}=${on_value}`)
                        await tobz.reply(from, `Relay 3 On!`, id)
                    } else if (args[2].toLowerCase() === 'off'){
                        const V3off = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[1]}=${off_value}`)
                        await tobz.reply(from, `Relay 3 Off!`, id)
                    } else {
                        await tobz.reply(from, `Option : On/Off\nExample : relay 3 on`, id)
                    }
                } else if (args[1].toLowerCase() === '4') {
                    if (args[2].toLowerCase() === 'on'){
                        const V4on = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[1]}=${on_value}`)
                        await tobz.reply(from, `Relay 4 On!`, id)
                    } else if (args[2].toLowerCase() === 'off'){
                        const V4off = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[1]}=${off_value}`)
                        await tobz.reply(from, `Relay 4 Off!`, id)
                    } else {
                        await tobz.reply(from, `Option : On/Off\nExample : relay 4 on`, id)
                    }
                } else if (args[1].toLowerCase() === '5') {
                    if (args[2].toLowerCase() === 'on'){
                        const V5on = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[1]}=${on_value}`)
                        await tobz.reply(from, `Relay 5 On!`, id)
                    } else if (args[2].toLowerCase() === 'off'){
                        const V5off = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[1]}=${off_value}`)
                        await tobz.reply(from, `Relay 5 Off!`, id)
                    } else {
                        await tobz.reply(from, `Option : On/Off\nExample : relay 5 on`, id)
                    }
                } else if (args[1].toLowerCase() === '6') {
                    if (args[2].toLowerCase() === 'on'){
                        const V6on = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[1]}=${on_value}`)
                        await tobz.reply(from, `Relay 6 On!`, id)
                    } else if (args[2].toLowerCase() === 'off'){
                        const V6off = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[1]}=${off_value}`)
                        await tobz.reply(from, `Relay 6 Off!`, id)
                    } else {
                        await tobz.reply(from, `Option : On/Off\nExample : relay 6 on`, id)
                    }
                } else if (args[1].toLowerCase() === '7') {
                    if (args[2].toLowerCase() === 'on'){
                        const V7on = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[1]}=${on_value}`)
                        await tobz.reply(from, `Relay 7 On!`, id)
                    } else if (args[2].toLowerCase() === 'off'){
                        const V7off = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[1]}=${off_value}`)
                        await tobz.reply(from, `Relay 7 Off!`, id)
                    } else {
                        await tobz.reply(from, `Option : On/Off\nExample : relay 7 on`, id)
                    }
                } else if (args[1].toLowerCase() === '8') {
                    if (args[2].toLowerCase() === 'on'){
                        const V8on = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[1]}=${on_value}`)
                        await tobz.reply(from, `Relay 8 On!`, id)
                    } else if (args[2].toLowerCase() === 'off'){
                        const V8off = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[1]}=${off_value}`)
                        await tobz.reply(from, `Relay 8 Off!`, id)
                    } else {
                        await tobz.reply(from, `Option : On/Off\nExample : relay 8 on`, id)
                    }
                } else {
const commandrelay =`
available commands :

relay cek
relay on
relay off
relay 1-8 on/off
`
                    await tobz.reply(from, commandrelay, id)
                }             
            } catch(err) {
                console.log(err)
const commandrelay =`
available commands :

relay cek
relay on
relay off
relay 1-8 on/off
                `
            await tobz.reply(from, commandrelay, id)  
            }
            break

        default:
            await tobz.sendSeen(from) 
            await tobz.simulateTyping(from, true)
            sleep(2000)
            if (command.startsWith('#')) {
                tobz.reply(from, `Enter *#menu*!`, id)
            }
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
        //tobz.kill().then(a => console.log(a))
    }
}

