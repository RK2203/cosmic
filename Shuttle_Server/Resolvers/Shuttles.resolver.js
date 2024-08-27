import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function timeToMinutes(timeStr) {
	if (!timeStr) return 0;

	const normalizedTimeStr = timeStr.replace(".", ":").toUpperCase();

	const [time, modifier] = normalizedTimeStr.split(" ");

	const [hoursStr, minutesStr] = time.split(":");
	let hours = parseInt(hoursStr, 10);
	let minutes = parseInt(minutesStr, 10);

	if (isNaN(hours) || isNaN(minutes)) {
		return 0;
	}

	if (modifier === "PM" && hours !== 12) hours += 12;
	if (modifier === "AM" && hours === 12) hours = 0;

	return hours * 60 + minutes;
}

function calculateDistance(lat1, long1, lat2, long2) {
	const R = 6371e3;
	const φ1 = (lat1 * Math.PI) / 180;
	const φ2 = (lat2 * Math.PI) / 180;
	const Δφ = ((lat2 - lat1) * Math.PI) / 180;
	const Δλ = ((long2 - long1) * Math.PI) / 180;

	const x =
		Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
		Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	const cc = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

	const d = R * cc;

	return d;
}

const shuttle_Data_Resolver = {
	Query: {
		getShuttleData: async (parent, args, { req, res }) => {
			try {
				const result =
					await prisma.$queryRaw`SELECT "Stopage_id" FROM "Stoppage" WHERE "Name" = ${args.Start}`;

				const result2 =
					await prisma.$queryRaw`SELECT "Stopage_id" FROM "Stoppage" WHERE "Name" = ${args.Dest}`;
				const stopageid1 = result[0].Stopage_id;
				const stopageid2 = result2[0].Stopage_id;

				const f1 =
					await prisma.$queryRaw`SELECT "Shuttle_id" FROM "Map" WHERE "Stopage_id" = ${stopageid1}`;

				const f2 =
					await prisma.$queryRaw`SELECT "Shuttle_id" FROM "Map" WHERE "Stopage_id" = ${stopageid2}`;

				const concatenatedArray = f1.concat(f2);

				const uniqueArray = concatenatedArray.filter(
					(item, index, self) =>
						index === self.findIndex((t) => t.Shuttle_id === item.Shuttle_id)
				);

				const startCoor =
					await prisma.$queryRaw`SELECT "Lat","Long" FROM "Stoppage" WHERE "Name"=${args.Start}`;

				let finalData = [];

				for (let f of uniqueArray) {
					const item =
						await prisma.$queryRaw`SELECT "Starting","Destination" FROM "Shuttle" WHERE "Shuttle_id" = ${f.Shuttle_id}`;

					const itemStartCoor =
						await prisma.$queryRaw`SELECT "Lat","Long" FROM "Stoppage" WHERE "Name"=${item[0].Starting}`;
					const itemDestCoor =
						await prisma.$queryRaw`SELECT "Lat","Long" FROM "Stoppage" WHERE "Name"=${item[0].Destination}`;

					const distFromStart = calculateDistance(
						startCoor[0].Lat,
						startCoor[0].Long,
						itemStartCoor[0].Lat,
						itemStartCoor[0].Long
					);
					const distFromDest = calculateDistance(
						startCoor[0].Lat,
						startCoor[0].Long,
						itemDestCoor[0].Lat,
						itemDestCoor[0].Long
					);

					if (distFromStart < distFromDest) {
						const data =
							await prisma.$queryRaw`SELECT "Start_time" FROM "Shuttle" WHERE "Shuttle_id"=${f.Shuttle_id}`;

						const startingTimeInMiniutes = timeToMinutes(data[0].Start_time);
						const currentTimeInMiniutes = timeToMinutes(args.Time);

						if (startingTimeInMiniutes >= currentTimeInMiniutes) {
							const shuttle =
								await prisma.$queryRaw`SELECT * FROM "Shuttle" WHERE "Shuttle_id"=${f.Shuttle_id}`;

							const pickup =
								await prisma.$queryRaw`SELECT "Time" FROM "Map" WHERE "Stopage_id"=${stopageid1} AND "Shuttle_id"=${f.Shuttle_id}`;
							const drop =
								await prisma.$queryRaw`SELECT "Time" FROM "Map" WHERE "Stopage_id"=${stopageid2} AND "Shuttle_id"=${f.Shuttle_id}`;

							shuttle[0].PickupTime = pickup[0].Time;
							shuttle[0].DropTime = drop[0].Time;

							finalData.push(...shuttle);
						}
					}
				}

				return finalData;
			} catch (error) {
				return "Internal server error";
			} finally {
				+(await prisma.$disconnect());
			}
		},
	},
};

export default shuttle_Data_Resolver;
