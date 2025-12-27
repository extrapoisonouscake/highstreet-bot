import { Telegraf } from 'telegraf';

import { VercelRequest, VercelResponse } from '@vercel/node';
import 'dotenv/config';
import { development, production } from './core/environments';
import { handler } from './core/handlers';
const BOT_TOKEN = process.env.BOT_TOKEN;

const ENVIRONMENT = process.env.NODE_ENV;

const bot = new Telegraf(BOT_TOKEN!);

bot.on('message', handler());

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
