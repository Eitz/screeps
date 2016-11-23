

module.exports.getStructures = function (roomName, pos) {
	let structures = Game.rooms[roomName].find(FIND_STRUCTURES);
	if (pos)
		return _.sortBy(structures, s => pos.getRangeTo(s));
	else
		return structures;
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