/// <reference path="./node_modules/screeps-typescript-declarations/dist/screeps.d.ts" />

const util = require('./util');

const jobs = {
	"harvest" : require('./creep.job.harvest'),
	"upgrade" : require('./creep.job.upgrade'),
	"build" : require('./creep.job.build'),
	"repair" : require('./creep.job.repair'),
};

/** @param {Creep} creep */
// TODO: check if target is nearer than source and working = true for some cases
function assignJob(creep) {
	/** @type {StructureExtension} struct */
	let struct;
	let structures = util.getStructures(creep.room.name, creep.pos);
	if (creep.memory.classe != 'upgrade' || util.creepsQuantity() < 5) {
		for (struct of structures) {
			if (struct.structureType === STRUCTURE_CONTAINER || struct.structureType === STRUCTURE_SPAWN || struct.structureType === STRUCTURE_EXTENSION) {
				if (struct.energy < struct.energyCapacity) {
					if (creep.carry.energy > 0) {
						creep.memory.working = true;
					}
					return creep.memory.job = { name: 'harvest', target: struct.id };
				}
			}
		}
		for (struct of structures) {
			if ((struct.my || struct.structureType === STRUCTURE_ROAD || struct.structureType == STRUCTURE_WALL && struct.hits < 0) && struct.hits < struct.hitsMax) {
				creep.memory.job = { name: 'repair', target: struct.id };
				if (creep.carry.energy > 0) {
					creep.memory.working = true;
				}
				return;
			}
		}
		/** @type {ConstructionSite} */
		let construct;
		for(let constructionId in Game.constructionSites) {
			creep.memory.job = { name: 'build', target: constructionId };
			return;
		}
	}
	for (struct of structures) {
		if (struct.structureType == STRUCTURE_CONTROLLER)
			return creep.memory.job = { name: 'upgrade', target: struct.id }
	}
}
/**
 * @param {Creep} creep
 **/
function removeJob(creep) {
	creep.memory.job = undefined;
	creep.memory.working = false;
}

function clearMemory() {
	for (let name in Memory.creeps)
		if (!Game.creeps[name])
			delete Memory.creeps[name];
}

module.exports = {
	run: function () {
		for (let name in Memory.creeps) {
			let creep = Game.creeps[name];
			if (!creep) {
				delete Memory.creeps[name];
				break;
			}
			if (!creep.memory.job) {
				assignJob(creep);
				creep.say(creep.memory.job.name);
			}
			if (creep.hits > 0) {
				let jobComplete = !jobs[creep.memory.job.name].run(creep) 
				if (jobComplete) {
					removeJob(creep);
					assignJob(creep);
					!jobs[creep.memory.job.name].run(creep)
				}
				
			}
		}
	}
};