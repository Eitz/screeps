const creepFunctions = require('./creep.functions')

module.exports = {
	/** @param {Creep} creep **/
	run: function (creep) {
		if (creep.memory.working && creep.carry.energy == 0) {
			creep.memory.working = false;
			return false;
		}
		if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
			creep.memory.working = true;
		}
		if (creep.memory.working) {
			let target;
			for (let roomName in Game.rooms) {
				if (Game.rooms[roomName].controller && Game.rooms[roomName].controller.my) {
					target = Game.rooms[roomName].controller;
				}
			}
			if (target) {
				if (creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target);
				}
			} else {
				return false;
			}
				
				
		}
		else {
			creepFunctions.harvestEnergy(creep, creep.memory.source);
		}
		return true;
	}
};