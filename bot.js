const Discord = require("discord.js");
const client = new Discord.Client({
  disabledEvents: [
    "TYPING_START",
    "GUILD_UPDATE",
    "GUILD_MEMBER_ADD",
    "GUILD_MEMBER_REMOVE",
    "GUILD_MEMBER_UPDATE",
    "GUILD_MEMBERS_CHUNK",
    "GUILD_INTEGRATIONS_UPDATE",
    "GUILD_ROLE_CREATE",
    "GUILD_ROLE_DELETE",
    "GUILD_ROLE_UPDATE",
    "CHANNEL_UPDATE",
    "CHANNEL_PINS_UPDATE",
    "MESSAGE_DELETE",
    "MESSAGE_UPDATE",
    "MESSAGE_DELETE_BULK",
    "MESSAGE_REACTION_ADD",
    "MESSAGE_REACTION_REMOVE",
    "MESSAGE_REACTION_REMOVE_ALL",
    "MESSAGE_CREATE"
  ]
});
const fs = require("fs");
client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
});
process.on("uncaughtException", error => console.error(error));
client.on("error", console.error);
client.on("raw", async packet => {
  if (packet.t !== "PRESENCE_UPDATE") return;
  if (client.users.has(packet.d.user.id)) return;
  if (!packet.d.game) return;
  if (packet.d.game.name !== "Fortnite") return;
  const userID = packet.d.user.id;
  const guildID = packet.d.guild_id;
  const user = await client.fetchUser(userID);
  client.guilds
    .get(guildID)
    .fetchMember(user)
    .then(fullMember => client.emit("presenceUpdate", null, fullMember))
    .catch(console.error);
});
client.on("presenceUpdate", async (oldmember, newMember) => {
  let channel = newMember.guild.channels.find(
    x => x.name == "no-fortnite-logs"
  );
  if (channel == null) return;
  if (!channel.permissionsFor(newMember.guild.me).serialize().SEND_MESSAGES)
    channel = null;
  //To see if game is Fortnite
  if (newMember.presence.game && newMember.presence.game.name === "Fortnite") {
    console.log(
      newMember.user.tag + " is playing Fortnite on " + newMember.guild.name
    );
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
        console.log(newMember.user.tag + " is banned.");
      });
  }
});
module.exports = {
  login:token => client.login(token)
}