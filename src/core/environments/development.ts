import createDebug from 'debug';
import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { BOT_USERNAME } from '../../constants';

const debug = createDebug('bot:dev');

const development = async (bot: Telegraf<Context<Update>>) => {
  debug('Bot runs in development mode');
  debug(`${BOT_USERNAME} deleting webhook`);
  await bot.telegram.deleteWebhook();
  debug(`${BOT_USERNAME} starting polling`);

  await bot.launch();

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
};

export { development };
