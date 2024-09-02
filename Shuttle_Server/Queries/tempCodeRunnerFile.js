const abc =
			await prisma.$queryRaw`SELECT "Starting","Destination" FROM "Shuttle" WHERE "Shuttle_id" = ${f.Shuttle_id}`;
