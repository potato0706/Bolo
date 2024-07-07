import fs from 'node:fs';
import path from 'node:path';

import {
  Client,
  Collection,
  GatewayIntentBits,
  REST,
  Routes
} from 'discord.js';
import dotenv from 'dotenv';

import logger from '@utils/logger';
import { MissingPropertyError, MissingExportError } from '@customTypes/errors';
import type {
  ExtendedApplicationCommand,
  ExtendedClient
} from '@customTypes/types';

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
}) as ExtendedClient;

client.commands = new Collection();
client.cooldowns = new Collection();

/**
 * Load all commands from the commands folder
 * @returns List of commands to register
 */
async function loadCommands(): Promise<Array<Object>> {
  const registerList: Array<object> = [];
  const foldersPath = path.join(__dirname, 'commands');
  const commandFolders = fs.readdirSync(foldersPath, { withFileTypes: true });

  for (const dirent of commandFolders.filter((dirent) =>
    dirent.isDirectory()
  )) {
    const commandsPath = path.join(foldersPath, dirent.name);
    const commandFiles = fs.readdirSync(commandsPath);

    for (const file of commandFiles.filter((file) => file.endsWith('.ts'))) {
      const filePath = path.join(commandsPath, file);
      try {
        const { default: command } = (await import(filePath)) as {
          default: ExtendedApplicationCommand;
        };
        if ('data' in command && 'execute' in command) {
          registerList.push(command.data);
          client.commands.set(command.data.name, command);
        } else {
          throw new MissingPropertyError(filePath);
        }
      } catch (error) {
        throw new MissingExportError(filePath);
      }
    }
  }
  return registerList;
}

/**
 * Register all commands to the Discord API
 * @param registerList List of commands to register
 */
async function registerCommands(registerList: Array<object>): Promise<void> {
  const rest = new REST().setToken(process.env.DISCORD_TOKEN);

  logger.info(
    `Started refreshing ${registerList.length} application commands.`
  );
  const data: any = await rest.put(
    Routes.applicationCommands(process.env.APPLICATION_ID),
    { body: registerList }
  );

  logger.info(`Successfully reloaded ${data.length} application commands.`);
}

async function loadEvents() {
  const eventsPath = path.join(__dirname, 'events');
  const eventFiles = fs.readdirSync(eventsPath);

  for (const file of eventFiles.filter((file) => file.endsWith('.ts'))) {
    const filePath = path.join(eventsPath, file);

    const { default: event } = await import(filePath);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
}

// Error handling
process.on('unhandledRejection', (error: Error) => {
  logger.error(error);
});

process.on('uncaughtException', (error) => {
  logger.error(error);
});

/** Main function to run the bot */
(async () => {
  const registerList = await loadCommands();
  await registerCommands(registerList);
  await loadEvents();
  client.login(process.env.DISCORD_TOKEN);
})();
