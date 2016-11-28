/// <reference path="./node_modules/screeps-typescript-declarations/dist/screeps.d.ts" />

const util = require('./util');

module.exports = {
	run: function () {
		
		/** @type {Structure} struct */
		let struct;
		let structures = util.getStructures();
		let towers = []
		for (struct of structures) {
			if (struct.my && struct.structureType == STRUCTURE_TOWER) {
				towers.push(struct);
			}
		}
		/** @type {StructureTower} */
		let tower;	
		for (tower of towers) {

			let hostile_creep = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
			if (hostile_creep) {
				tower.attack(hostile_creep);
			}
			else {
				for (struct of structures) {
					let wall_max_hits = 20000;
					if ((struct.my && (struct.structureType != STRUCTURE_RAMPART || struct.hits < wall_max_hits) || struct.structureType === STRUCTURE_ROAD || struct.structureType == STRUCTURE_WALL && struct.hits < wall_max_hits) && struct.hits < struct.hitsMax) {
						if (tower.energy > 0 && tower.room == struct.room && struct.hits < struct.hitsMax) {
							tower.repair(struct);
							break;
						}
					}
				}
			}
		}
	}
};