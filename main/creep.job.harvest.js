const creepFunctions = require('./creep.functions')

module.exports = {
	/** @param {Creep} creep **/
	run: function(creep) {
		if (creep.memory.working && creep.carry.energy == 0) {
			creep.memory.working = false;
			return false;
		}
		if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
			creep.memory.working = true;
		}
		if (creep.memory.working) {
			var target = Game.getObjectById(creep.memory.job.target);
			if (!target)
			    return false;
			if (target.energy == target.energyCapacity)
				return false;
			let returnCode = creep.transfer(target, RESOURCE_ENERGY); 
			if (returnCode == ERR_NOT_IN_RANGE) {
				creep.moveTo(target);
			} else if (returnCode == ERR_FULL) {
				return false;
			}
		}
		else {
			creepFunctions.harvestEnergy(creep, creep.memory.source);
		}
		return true;
}
};