import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	// const shut = await prisma.map.create({
	// 	data: {
	// 		id: 2,
	// 		Shuttle_id: "DN-1015",
	// 		Stopage_id: "NN700156",
	// 		Time: "11:15 AM",
	// 	},
	// });

	const userLat = 22.558274830775655;
	const userLong = 88.30014515624794;
	
	const nearestSpot = await prisma.$queryRaw`
	    SELECT "Stopage_id",
	    ST_Distance(
	      ST_SetSRID(ST_MakePoint(${userLong}, ${userLat}), 4326),
	      ST_SetSRID(ST_MakePoint("Long", "Lat"), 4326)
	    ) as distance
	    FROM "Stoppage"
	    ORDER BY distance
	    LIMIT 1;
	  `;
	console.log(nearestSpot)
		//its work properly
        //PENDING
		//new worrk for this project
	let arr = [];
	const stop = nearestSpot.map((item)=>{
		arr.push(item.Stopage_id)
	})

	
    for (let i = 0; i < arr.length; i++) {
		let element = arr[i];
		

		const data = await prisma.$queryRaw`SELECT * FROM "Map" WHERE "Stopage_id" = ${element}`;

		console.log(data) 

		
	}

}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
