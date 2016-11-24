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
			if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller);
			}
		}
		else {
			creepFunctions.harvestEnergy(creep, creep.memory.source);
		}
		return true;
	}
};