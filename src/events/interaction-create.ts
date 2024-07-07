import { BaseInteraction, Events } from 'discord.js';

import logger from '@/utils/logger';
import { CommandNotFoundError } from '@customTypes/errors';
import type { ExtendedClient } from '@customTypes/types';

export default {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: BaseInteraction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const client = interaction.client as ExtendedClient;
    const command = client.commands.get(interaction.commandName);

    if (!command) throw new CommandNotFoundError(interaction.commandName);

    try {
      await command.execute(interaction);
    } catch (error) {
      logger.error(error);

      const content = {
        content: 'There was an error while executing this command!',
        ephemeral: true
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(content);
      } else {
        await interaction.reply(content);
      }
    }
    return;
  }
};
