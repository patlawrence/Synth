const Command = require('../../Structures/Command/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Changes whether I send a message every time a user levels up',
            group: '⚙️ | Settings',
            aliases: ['levelupalert', 'dlua', 'lua'],
            usage: '[boolean]',
            cooldown: 10
        });
    }

    async run(message, args) {
        const client = this.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        var doLevelUpAlert = client.getPointsDoLevelUpAlert(guildID);
        const connection = await require('../../Database/database.js');
        const embed = new MessageEmbed();

        args.shift();

        if(!args.length) {
            embed.setDescription(`Do level up alerts is currently: ${doLevelUpAlert}`)
            .setColor(color);

            return message.channel.send(embed);
        }

        const boolean = /(true|false)|(1|0)/;

        if(!boolean.test(args[0]))
            return this.doLevelUpAlertNotBoolean(message);

        if(args[0] == 'true')
                args[0] = '1';

        if(args[0] == 'false')
                args[0] = '0';

        if(args[0] === doLevelUpAlert)
            return this.argsMatchesDoLevelUpAlert(message, args);

        connection.query(`UPDATE pointsConfigs SET doLevelUpAlert = '${args[0]}' WHERE guildID = '${guildID}'`)
        .catch(err => console.error(err));

        client.setPointsDoLevelUpAlert(guildID, args[0]);
        doLevelUpAlert = client.getPointsDoLevelUpAlert(guildID);

        embed.setDescription(`✅ | **Do level up alerts changed to: ${doLevelUpAlert}**`)
        .setColor(color);

		return message.channel.send(embed);
    }

    doLevelUpAlertNotBoolean(message) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription('❌ | **Do Level up alerts must be a boolean value**')
        .setColor(color);

        return message.channel.send(embed);
    }

    argsMatchesDoLevelUpAlert(message, args) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription(`❕ | \`Do level up alerts is already set to: ${args[0]}\``)
		.setColor(color);

        return message.channel.send(embed);
    }
}