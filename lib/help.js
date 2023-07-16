const fs = require('fs-extra')

const help = (prefix, cts, daynya, datenya, timenya) => {
    return `
╔════════════════════
║╭────❉INFORMATION❉──
║│+ IoT Bot
║│+ Developer : instagram.com/tierkunn_
║│+ Prefix : ${prefix}*
║│+ Time 🕐 : ${daynya}, ${timenya}, ${datenya}
║│
║│+ Runtime : ${cts}
║╰───────────────────
╠════════════════════ 
║╭───[LIST MENU]───
║│➥ *relay cek*
║│➥ *relay on*
║│➥ *relay off*
║│➥ *relay 1 on*
║│➥ *relay 1 off*
║│➥ *relay 2 on*
║│➥ *relay 2 off*
║│➥ *relay 3 on*
║│➥ *relay 4 off*
║│➥ *relay 5 on*
║│➥ *relay 5 off*
║│➥ *relay 6 on*
║│➥ *relay 6 off*
║│➥ *relay 7 on*
║│➥ *relay 7 off*
║│➥ *relay 8 on*
║│➥ *relay 8 off*
║╰───────────────────
╚═══════IoT Bot═══════
`
}
exports.help = help
