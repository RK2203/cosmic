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

async function main() {
	const Start = "xxxx";
	const Dest = "yyyy";
	const time = "tttt";

	// Shoal write your code here
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
