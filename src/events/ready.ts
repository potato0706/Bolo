import { Events } from 'discord.js';

import logger from '@utils/logger';
import { ExtendedClient } from '@/types/types';

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: ExtendedClient): void {
    logger.info(`Logged in as ${client.user.tag}.`);
  }
};
