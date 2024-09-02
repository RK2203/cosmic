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

async function main() {
	const Start = "New Town";
	const Dest = "Hastings";
	const CurrentTime = "3:30 PM";

	// Fetch start and destination stoppage IDs and coordinates
	const [startData] = await prisma.$queryRaw`
    SELECT 
        "s1"."Stopage_id" AS "StartStopageId", "s1"."Lat" AS "StartLat", "s1"."Long" AS "StartLong",
        "s2"."Stopage_id" AS "DestStopageId", "s2"."Lat" AS "DestLat", "s2"."Long" AS "DestLong"
    FROM "Stoppage" "s1"
    JOIN "Stoppage" "s2" ON "s2"."Name" = ${Dest}
    WHERE "s1"."Name" = ${Start}
`;

	if (!startData) {
		throw new Error("Start or Destination Stoppage not found");
	}

	const {
		StartStopageId,
		StartLat,
		StartLong,
		DestStopageId,
		DestLat,
		DestLong,
	} = startData;

	// Fetch all shuttles passing through the start and destination stoppages
	const shuttles = await prisma.$queryRaw`
    SELECT 
        "m1"."Shuttle_id",
        "sh"."Starting", "sh"."Destination", "sh"."Start_time",
        "m1"."Time" AS "PickupTime", "m2"."Time" AS "DropTime"
    FROM "Map" "m1"
    JOIN "Map" "m2" ON "m1"."Shuttle_id" = "m2"."Shuttle_id"
    JOIN "Shuttle" "sh" ON "m1"."Shuttle_id" = "sh"."Shuttle_id"
    WHERE "m1"."Stopage_id" = ${StartStopageId} AND "m2"."Stopage_id" = ${DestStopageId}
`;

	if (!shuttles.length) {
		throw new Error(
			"No shuttles found for the given start and destination stoppages"
		);
	}

	// Calculate current time in minutes
	const currentTimeInMinutes = timeToMinutes(CurrentTime);

	let finalData = [];

	for (let shuttle of shuttles) {
		// Fetch coordinates for shuttle starting and destination points
		const [itemStartCoor, itemDestCoor] = await prisma.$queryRaw`
        SELECT 
            (SELECT "Lat" FROM "Stoppage" WHERE "Name" = ${shuttle.Starting}) AS "ItemStartLat",
            (SELECT "Long" FROM "Stoppage" WHERE "Name" = ${shuttle.Starting}) AS "ItemStartLong",
            (SELECT "Lat" FROM "Stoppage" WHERE "Name" = ${shuttle.Destination}) AS "ItemDestLat",
            (SELECT "Long" FROM "Stoppage" WHERE "Name" = ${shuttle.Destination}) AS "ItemDestLong"
    `;

		if (!itemStartCoor || !itemDestCoor) {
			console.warn(`Coordinates not found for shuttle ${shuttle.Shuttle_id}`);
			continue;
		}

		const distFromStart = calculateDistance(
			StartLat,
			StartLong,
			itemStartCoor.ItemStartLat,
			itemStartCoor.ItemStartLong
		);
		const distFromDest = calculateDistance(
			StartLat,
			StartLong,
			itemDestCoor.ItemDestLat,
			itemDestCoor.ItemDestLong
		);

		// Filter based on distance and time conditions
		if (distFromStart < distFromDest) {
			const startingTimeInMinutes = timeToMinutes(shuttle.Start_time);
			if (startingTimeInMinutes >= currentTimeInMinutes) {
				shuttle.PickupTime = shuttle.PickupTime;
				shuttle.DropTime = shuttle.DropTime;
				finalData.push(shuttle);
			}
		}
	}

	console.log(finalData);
}

//
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
