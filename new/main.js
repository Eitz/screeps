/// <reference path="./node_modules/screeps-typescript-declarations/dist/screeps.d.ts" />

const creepManager = require('./creep.manager');
const spawnManager = require('./spawn.manager');
const memoryManager = require('./memory.manager');

module.exports.loop = function () {
	// spawn new creep when needed
	spawnManager.run();
	// clear memory and do the other things
	memoryManager.run();
	// execute jobs
	creepManager.run();
}


function killAll() {
	for(let name in Game.creeps) { 
		Game.creeps[name].suicide();
	}
}

