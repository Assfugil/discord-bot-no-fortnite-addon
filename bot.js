const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
});
process.on("uncaughtException", error => console.error(error));
client.on("error", console.error);
client.on("presenceUpdate", (oldmember, newMember) => {
  let channel = newMember.guild.channels.find(x => x.name == "no-fortnite-logs");
  if (channel == null) return;
  if (channel.permissionsFor(newMember.guild.me).SEND_MESSAGES) channel = null
  //To see if game is Fortnite
  if (newMember.presence.game && newMember.presence.game.name === "Fortnite") {
    console.log(newMember.user.tag + " is playing Fortnite");
    //ban Fortnite players
    if (!newMember.bannable) {
      if (channel) {
        const embed = new Discord.RichEmbed()
          .setColor("#fc7303")
          .setAuthor(newMember.user.tag, newMember.user.displayAvatarURL)
          .setDescription("is playing Fortnite but I cannot ban them!")
          .setTimestamp()
          .setFooter("Don't play fortnite!");
        channel.send(embed);
      }
      return;
    }
    newMember
      .ban({
        reason: "Playing Fortnite"
      })
      .then(m => {
        if (channel) {
          const embed = new Discord.RichEmbed()
            .setColor("#ff0000")
            .setAuthor(newMember.user.tag, newMember.user.displayAvatarURL)
            .setDescription("is banned for playing Fortnite!")
            .setTimestamp()
            .setFooter("Don't play fortnite!");
          channel.send(embed);
        }
      });
    console.log(newMember + " is banned.");
  }
});
module.exports = {
  login:function(token){
    client.login(token)
  }
}