const util = require('./util')

const bodyParts = [];
bodyParts[CARRY] = bodyParts[MOVE] = 50;
bodyParts[TOUGH] = 10;
bodyParts[ATTACK] = 80;
bodyParts[WORK] = 100;

const spawns = {
	'Home': [
		// { name: 'fight', getSource: () => '', limit: 3, flag: 'Safe Room', stop: true },
		{ name: 'default', getSource: () => '57ef9d9486f108ae6e60df66', limit: 2 },
		{ name: 'default', getSource: () => '57ef9d9486f108ae6e60df65', limit: 2 },
		{ name: 'upgrade', getSource: () => '57ef9d9486f108ae6e60df66', limit: 2 },
		{ name: 'upgrade', getSource: () => '57ef9d9486f108ae6e60df65', limit: 2 },
		{ name: 'default', getSource: () => '57ef9d9586f108ae6e60df69', limit: 4, flag: 'Safe Room' },
 		// { name: 'default', getSource: () => '57ef9d9786f108ae6e60dfa9', limit: 4, flag: 'Side Room' },
		// { name: 'default', getSource: () => '57ef9d9786f108ae6e60dfaa', limit: 4, flag: 'Side Room' },
	],
	'default': [
		{
			name: 'fallback',
			getSource: (spawnName) => Game.spawns[spawnName].pos.findClosestByPath(FIND_SOURCES).id,
			limit: 3,
			body: { parts: [WORK, MOVE, MOVE, CARRY], cost: 250 }
		},
	]
};

module.exports = {
	run: function () {
		if (Game.time % 5 == 0) {
			let result = tryToSpawnCreep();
			if (result < 0) // error				
				console.log("Error spawning: " + result);
			else if (result)
				console.log(`Spawning new creep: ${result}`);
		}
	}
};

function tryToSpawnCreep() {
	let creeps = util.creepsQuantity();
	for (let spawn in Game.spawns) {
		let classes = spawns[spawn];
		if (!classes || creeps < 3)
			classes = spawns['default'];
		for (let classe of classes) {
			let class_creeps = _.filter(Game.creeps, (creep) => { return creep.memory.classe == classe.name && creep.memory.source == classe.getSource(spawn) });
			if (class_creeps.length < classe.limit) {
				return spawnCreep(spawn, classe);
			}
		}
	}
}

function spawnCreep(spawnName, classe) {

	let spawn = Game.spawns[spawnName];
	let energyCapacity = spawn.energyCapacity;
	let energyTotal = spawn.energy;
	for (let ext of spawn.room.find(FIND_MY_STRUCTURES, { filter: (strct) => strct.structureType === STRUCTURE_EXTENSION })) {
		energyCapacity += ext.energyCapacity;
		energyTotal += ext.energy;
	}
	let body = classe.body || prepareBody(classe, energyCapacity);
	if (body.cost <= energyTotal)
		return spawn.createCreep(body.parts, undefined, { stop: classe.stop, flag: classe.flag, classe: classe.name, job: undefined, working: false, source: classe.getSource(spawnName) });
	else
		return undefined;

	function prepareBody(classe, energyCapacity) {
		let body = { parts: [], cost: 0 };
		if (!classe || !classe.name) { // default body
			body = getDefaultBody(energyCapacity);
		} else {
			switch (classe.name) {
				case 'transport':
					while (body.cost < energyCapacity) {
						addBodyPart(body, MOVE);
						addBodyPart(body, CARRY);
					}
					break;
				case 'harvest':
					addBodyPart(body, MOVE);
					addBodyPart(body, CARRY);
					while (body.cost < energyCapacity) {
						addBodyPart(body, WORK);
					}
					break;
				case 'fight':
					while (body.cost < energyCapacity) {
						addBodyPart(body, MOVE);
						addBodyPart(body, ATTACK);
						addBodyPart(body, TOUGH);
					}
					break;
				case 'upgrade':
				case 'default':
				default:
					body = getDefaultBody(energyCapacity);
			}
		}
		while (body.cost > energyCapacity) {
			removeBodyPart(body);
		}
		return body;

		function addBodyPart(body, part) {
			body.parts.push(part);
			body.cost += bodyParts[part];
		}

		function removeBodyPart(body) {
			body.cost -= bodyParts[body.parts.pop()];
		}

		function getDefaultBody(energyCapacity) {
			let body = { parts: [], cost: 0 };
			while (body.cost < energyCapacity/1.5) {
				addBodyPart(body, MOVE);
				addBodyPart(body, WORK);
				addBodyPart(body, CARRY);
			}
			return body;
		}
	}
}

