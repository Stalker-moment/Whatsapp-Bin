const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')

const processTime = (timestamp, now) => {
    // timestamp => timestamp when message was received
    return moment.duration(now - moment(timestamp * 1000)).asSeconds()
}

const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.processTime = processTime;
exports.sleep = sleep;

