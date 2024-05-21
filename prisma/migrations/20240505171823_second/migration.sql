-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "option" TEXT NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_username_key" ON "Vote"("username");
