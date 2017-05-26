export function gridSize() {
	return [22, 10];
}

export function spawnBlock(rotation) {
	return getBlock(Math.floor(Math.random() * 7), rotation);
}

export function getBlock(idx, rotation) {
	const blocks = [
		[
			[
				[1, 0, 0],
			 	[1, 1, 1],
			 	[0, 0, 0]
			],
			[
				[0, 1, 1],
			 	[0, 1, 0],
			 	[0, 1, 0]
			],
			[
				[0, 0, 0],
			 	[1, 1, 1],
			 	[0, 0, 1]
			],
			[
				[0, 1, 0],
			 	[0, 1, 0],
			 	[1, 1, 0]
			],
		],
		[
			[
				[0, 0, 2],
			 	[2, 2, 2],
			 	[0, 0, 0]
			],
			[
				[0, 2, 0],
			 	[0, 2, 0],
			 	[0, 2, 2]
			],
			[
				[0, 0, 0],
			 	[2, 2, 2],
			 	[2, 0, 0]
			],
			[
				[2, 2, 0],
			 	[0, 2, 0],
			 	[0, 2, 0]
			],
		],
		[
			[
				[0, 3, 0],
				[3, 3, 3],
				[0, 0, 0]
			],
			[
				[0, 3, 0],
				[0, 3, 3],
				[0, 3, 0]
			],
			[
				[0, 0, 0],
				[3, 3, 3],
				[0, 3, 0]
			],
			[
				[0, 3, 0],
				[3, 3, 0],
				[0, 3, 0]
			]
		],
		[
			[
				[4, 4, 4, 4],
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0]
			],
			[
				[0, 0, 0, 4],
				[0, 0, 0, 4],
				[0, 0, 0, 4],
				[0, 0, 0, 4]
			]
		],
		[
			[
				[0, 5, 5],
				[5, 5, 0],
				[0, 0, 0]
			],
			[
				[0, 5, 0],
				[0, 5, 5],
				[0, 0, 5]
			]
		],
		[
			[
				[6, 6, 0],
				[0, 6, 6],
				[0, 0, 0]
			],
			[
				[0, 6, 0],
				[6, 6, 0],
				[6, 0, 0]
			]
		],
		[
			[
				[7, 7],
				[7, 7]
			]
		]
	]

	return [blocks[idx][rotation % blocks[idx].length], idx];
}