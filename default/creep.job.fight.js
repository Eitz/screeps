const creepFunctions = require('./creep.functions')

module.exports = {
	/** @param {Creep} creep **/
	run: function (creep) {
		if (!creep.memory.stop) {

			let wallToDestroy = creep.room.find(FIND_STRUCTURES, { filter: function(struct) {
				return struct.structureType == STRUCTURE_WALL && Game.flags['DESTROY_WALL'].room == struct.room && Game.flags['DESTROY_WALL'].pos == struct.pos;
			}});

			let enemy = wallToDestroy[0] || creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, { maxRooms: 1 }) || creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, { maxRooms: 1 });
			if (enemy) {
				if (creep.attack(enemy) == ERR_NOT_IN_RANGE) {
					creep.moveTo(enemy);
				}
			} else {
				let target = Game.flags[creep.memory.flag];
				if (creep.room != target.room) {
					creep.moveTo(target);			
				}
			}
		}	
		return true;	
	}
}