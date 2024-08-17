-- CreateTable
CREATE TABLE "Shuttle" (
    "Shuttle_id" TEXT NOT NULL,
    "Starting" TEXT NOT NULL,
    "Destination" TEXT NOT NULL,
    "Start_time" TEXT NOT NULL,
    "Arrival_time" TEXT NOT NULL,
    "Seat" INTEGER NOT NULL,
    "Fare" INTEGER NOT NULL,

    CONSTRAINT "Shuttle_pkey" PRIMARY KEY ("Shuttle_id")
);
