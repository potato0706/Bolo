import Discord from 'discord.js';

export interface ExtendedApplicationCommand extends Discord.ApplicationCommand {
  cooldown?: number;
  data: Discord.ApplicationCommandData & { name: string };
  execute: (interaction: Discord.BaseInteraction) => Promise<void>;
}

export interface ExtendedClient extends Discord.Client {
  commands: Discord.Collection<string, ExtendedApplicationCommand>;
  cooldowns: Discord.Collection<string, Discord.Collection<string, number>>;
}
