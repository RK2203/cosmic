import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const Shuttle_resolver = {
	Query: {
		getShuttle: async (parent, args, { req, res }) => {
			
			try {
				const nearestSpot = await prisma.$queryRaw`
				    SELECT "Stopage_id",
				    ST_Distance(
				      ST_SetSRID(ST_MakePoint(${args.Long}, ${args.Lat}), 4326),
				      ST_SetSRID(ST_MakePoint("Long", "Lat"), 4326)
				    ) as distance
				    FROM "Stoppage"
				    ORDER BY distance
				    LIMIT 1;
				  `;

				const stopages = [];

				for (let item of nearestSpot) {
					const stopid = item.Stopage_id;

					const stops = await prisma.$queryRaw`
						SELECT "Name" FROM "Stoppage"
						WHERE "Stopage_id"=${stopid}
					`;

					stopages.push(...stops);
				}

				let mapData = [];

				for (let element of stopages) {
					const name = element.Name;

					const data =
						await prisma.$queryRaw`SELECT DISTINCT "Starting", "Destination" 
						FROM "Shuttle" 
						WHERE "Starting" = ${name} OR "Destination"=${name}`;

					mapData.push(...data);
				}

				return mapData;
			} catch (error) {
				console.error(error);
				return "Internal Server Error";
			} finally {
				+(await prisma.$disconnect());
			}
		},
	},
};

export default Shuttle_resolver;
