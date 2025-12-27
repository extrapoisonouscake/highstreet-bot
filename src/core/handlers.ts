import createDebug from 'debug';
import { Context } from 'telegraf';
import { BOT_USERNAME } from '../constants';
import { formatEventsSummary, getTodayBookings } from './bookings';

const debug = createDebug('bot:greeting_text');

const replyToMessage = (ctx: Context, messageId: number, string: string) =>
  ctx.reply(string, {
    reply_parameters: { message_id: messageId },
  });
const LOUNGE_KEYWORDS = ['лаундж', 'лаунж'];
const BOOK_KEYWORDS = ['бронировано', 'занят', 'свобод'];
export const handler = () => async (ctx: Context) => {
  const messageId = ctx.message?.message_id;
  const text = ctx.text;
  if (!messageId || !text) return;
  debug('Triggered text command');
  const lowerText = text.toLowerCase();
  if (
    lowerText.includes(`@${BOT_USERNAME}`) ||
    (LOUNGE_KEYWORDS.some((keyword) => lowerText.includes(keyword)) &&
      lowerText.includes('?') &&
      BOOK_KEYWORDS.some((keyword) => lowerText.includes(keyword)))
  ) {
    const pendingMessage = await replyToMessage(ctx, messageId, 'ща секунду');
    const bookings = await getTodayBookings();
    const message =
      bookings.length === 0
        ? 'cвободно!! fuck yeah!!!!'
        : `NOOOO😭😭!! короче седня лаундж занят ${formatEventsSummary(bookings)}😡`;
    await ctx.telegram.editMessageText(
      ctx.chat!.id,
      pendingMessage.message_id,
      undefined,
      message,
    );
  }
};
