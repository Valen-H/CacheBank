// @ts-nocheck
"use strict";

const CB = require("../").cb,
	cb = new CB.CacheBank(10);

console.log(CB, cb);

async function test() {
	await Promise.all(cb.consume(() => new Promise(res => res(Math.random()))));
	
	for await (const i of cb) {
		console.log(i);
	}
	
	console.log(...cb);
	console.log(...cb.trim(2));
}

test();
