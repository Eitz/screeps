module.exports = {
	harvestEnergy: function(creep, _source) {
		var source = Game.getObjectById(_source);
		if (!source) {
			creep.moveTo(Game.flags[creep.memory.flag]);
		}
		if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
			creep.moveTo(source);
		}
	}
};