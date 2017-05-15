const TelegramBot = require('node-telegram-bot-api');
const BBCMicrobit = require('bbc-microbit')

// replace the value below with the Telegram token you receive from @BotFather
const token = '';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
const telegram_id = '';

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var z = 0; z < 1e7; z++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function init() {
	myStart();
}

function myStart() {

	BBCMicrobit.discover(function(microbit) {
		console.log('\tdiscovered microbit: id = %s, address = %s', microbit.id, microbit.address);

		microbit.on('disconnect', function() {
			console.log('bot: microbit disconnected!');
			bot.sendMessage(telegram_id, 'bot: microbit disconnected!');
			init();
		});

		
		microbit.on('buttonAChange', function(value) {
			if (value == 1) 
				bot.sendMessage(telegram_id, 'ðŸ˜Š');

			if (value == 2) 
				bot.sendMessage(telegram_id, 'â¤ï¸');
		});

		 microbit.on('buttonBChange', function(value) {
			if (value == 1) 
				bot.sendMessage(telegram_id, 'ðŸ˜€');

			if (value == 2) 
				bot.sendMessage(telegram_id, 'â¤ï¸');
		});

		console.log('connecting to microbit');
		microbit.connectAndSetUp(function() {
			console.log('\tconnected to microbit');
			bot.sendMessage(telegram_id, 'bot: Connected to microbit');


			microbit.subscribeButtons(function() {
				//console.log('\tsubscribed to buttons');
			});

		
			// Listen for any kind of message. There are different kinds of
			// messages.
			bot.on('message', function onMessage(msg) {
				const chatId = msg.chat.id;
				console.log(msg.text);

				if (msg.text == 'ðŸ˜Š' || msg.text == 'ðŸ˜€' || msg.text == 'â¤ï¸') {
					const smile = new Buffer('0A0A00110E', 'hex');
					const blank = new Buffer('0000000000', 'hex');

					microbit.writeLedMatrixState(smile, function() {
						sleep(600);
					});	
					microbit.writeLedMatrixState(blank, function() {
					}); 

				} else {

					// send a message to the chat acknowledging receipt of their message
					bot.sendMessage(chatId, 'bot: Received your message');
					microbit.writeLedText(msg.text, function() {
					});
				}


			});

		});
	});

}


init();
