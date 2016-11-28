/// <reference path="./node_modules/screeps-typescript-declarations/dist/screeps.d.ts" />

module.exports.run = function () {
	for (let name in Game.creeps) {
		if (Math.random() > 0.9) {
			Game.creeps[name].say(getRandomQuote())
		}
	}
}

function getRandomQuote() {
	let quotes = [
		'For Seldon',
		'No fight!',
		'Free Trade',
		'I am peace',
		'Avoid war!',
		'Love you!',
		'Make love!',
		'No war!',
		'Yes, love!',
		'Only Peace',
		'Ho\'Ho\'Ho',
		'Don\'t hate',
		'Diplomacy'
	];
	return quotes[Math.floor(Math.random() * quotes.length)];
}