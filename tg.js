const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.Token);
var helpText='🔰This is an Mega.nz File downloader advance bot!💪😊\n  Send Me a mega link to see the magic\n  And I am authers only bot😉\n\n🔰Commands:\n  /help -for help\n  /stop -for stop file sending!\n  /run0 -to clear dl and set run to 0 and stop runing \n  /ts -to resume sending if error or stoped unfortunatedly\n  /skipF -skip current file if only erroring!\n  /sk--index -to skip some bulk of file stop sending before use!\n  /rerun -to start the stoped by /stop\n  /isf -check the download path\n  /numF -check the reiming file count\n\nGood Day!😇';

bot.start((ctx) => ctx.reply('Welcome! 👋 I am a personal mega downloader bot!😇'));

bot.help((ctx) => ctx.reply(helpText));


bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports=bot;
