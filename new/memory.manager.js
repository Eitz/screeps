module.exports = {
	run: function () {
		if (Game.time % 100 == 0)
			clearMemory();
	}
}

function clearMemory() {
	for (let name in Memory.creeps)
		if (!Game.creeps[name])
			delete Memory.creeps[name];
}