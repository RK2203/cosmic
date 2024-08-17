-- CreateTable
CREATE TABLE "Stoppage" (
    "Stopage_id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Lat" DOUBLE PRECISION NOT NULL,
    "Long" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Stoppage_pkey" PRIMARY KEY ("Stopage_id")
);

-- CreateTable
CREATE TABLE "Map" (
    "id" INTEGER NOT NULL,
    "Shuttle_id" TEXT NOT NULL,
    "Stopage_id" TEXT NOT NULL,
    "Time" TEXT NOT NULL,

    CONSTRAINT "Map_pkey" PRIMARY KEY ("id")
);
