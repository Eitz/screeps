module.exports.getStructures = function (pos) {
	let allStructures = [];
	let rooms = [];
	for (let creepName in Game.creeps) {
		if (rooms.indexOf(Game.creeps[creepName].room.name) == -1)
			rooms.push(Game.creeps[creepName].room.name);
	}
	for (let roomName of rooms) {
		let structures = Game.rooms[roomName].find(FIND_STRUCTURES) || [];
		for (let struct of structures)
			allStructures.push(struct);
	}
	if (pos)
			return _.sortBy(allStructures, s => pos.getRangeTo(s));
		else
			return allStructures;
}

module.exports.creepsQuantity = function () {
	let sum = 0;
	for (let creep in Game.creeps)
		sum++;
	return sum;
}

/**
 * @param {Structure} target
 * @param {Creep} creep
 */
/*
module.exports.getTarget = function (target, creep) {
	if (target.room == creep.room) {
		return target;
	} else {
		let route = Game.map.findExit(creep.room, target.room);
		creep.moveTO
	}
}
*/


/**
 * @param {Structure} a
 * @param {Structure} b
 */
function sortByDistance(a, b) {
	// this is pos
	return this.getRangeTo(a.pos.x, a.pos.y) < this.getRangeTo(b.pos.x, b.pos.y);
}