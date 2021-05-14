const express = require("express");
const app = express();
app.listen(() => console.log("Sunucu başladı"));
app.use('/ping', (res) => {
  res.send(new Date());
});
require("express")().listen(1343);
const Discord = require('discord.js');
const fetch = require("node-fetch");
const db = require("quick.db");
const client = new Discord.Client();
const prefix = ".";
setInterval(() => {
  var links = db.get("linkler");
  if(!links) return;
  var linkA = links.map(c => c.url)
  linkA.forEach(link => {
    try {
      fetch(link)
    } catch(e) {
      console.log("Alt" + e)
     };
     console.log("Üst");
  });
  
}, 60000);
client.on("ready", () => {
if(!Array.isArray(db.get("linkler"))) {
db.set("linkler", [])
}
});
client.on("ready", () => {
setInterval(() => {
  client.user.setActivity(`${prefix}uptime |  ${db.get("linkler").length} Bot | ${client.guilds.cache.size} Sunucu`)
}, 7000);
});
client.on('message', message => {
  if(message.author.bot) return;
  let embed = new Discord.MessageEmbed().setColor("#ffe352");
  if(message.content === prefix + 'yardım') {
    embed.setTitle("Komut Listesi :reminder_ribbon:");
    embed.addField(`${prefix}uptime + Link`, [`**\`24 saat bot çalıştırmak için\`**`], false);
    embed.addField(`${prefix}bilgi`, [`**\`Bot hakkında bilgi edinin\`**`], false);
    message.channel.send(embed);
  };
  if (message.content === prefix + "bilgi") {
  embed.addField(`info :man_technologist:`, [`
  **Ping:** \`${client.ws.ping} MS\`\n**Bulunduğum Sunucu Sayısı**: \`${client.guilds.cache.size}\`\n**Güncel Tuttuğum Bot Sayısı**:\`${db.get("linkler").length}\`
  `], true);
  message.channel.send(embed);
  };
  if(message.content.startsWith(prefix + "uptime")) {
  var link = message.content.split(" ").slice(1).join(" ");

  fetch(link).then(() => {
    if(db.get("linkler").map(z => z.url).includes(link)) {
      embed.setColor("#f50909");
      embed.setTitle("DownTime :small_red_triangle_down:");
      embed.setDescription(`[**Bu bağlantı zaten sistemde !! 🔴**](${link})`);
      message.channel.send(embed);
      return;
    };
    embed.setColor("#32ff80");
    embed.setTitle("Uptime :small_red_triangle:");
    embed.setDescription(`[**Çalışma süresi tamamlandı ve şimdi projeniz 24 saat çevrimiçi.**](${link})`);
    message.channel.send(embed);

    db.push("linkler", { url: link, owner: message.author.username});
  }).catch(e => {
    embed.setDescription(e);
    message.channel.send(embed);
    return;
  });
  };
});
client.login("TOKENİNİZİ GİRİNİZ");

//Created by Furkan Salih Kaya