const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Accesses highlights configurations',
            group: 'Settings',
            aliases: ['c'],
            usage: '[channel]',
            cooldown: 15
        });
    }

    async run(message, args) {
        const client = this.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        var channel = client.getHighlightsChannel(guildID);
        const connection = await require('../../Database/database.js');
        const embed = new MessageEmbed();

        args.shift();

        if(!args.length) {
            embed.setDescription(`Highlights channel is currently ${channel}`)
            .setColor(color);

            return message.channel.send(embed);
        }

        connection.query(`UPDATE highlights SET channel = '${args[0]}' WHERE guildID = '${guildID}'`) // update color in database to first command arguemnt
        .catch(err => console.error(err));

        client.setHighlightsChannel(guildID, args[0]) // update cache
        channel = client.getHighlightsChannel(guildID); // update local color variable

        embed.setDescription(`Highlights channel changed to ${channel}`)
        .setColor(color);
        
		return message.channel.send(embed);
    }
}