-- CreateTable
CREATE TABLE "Survey" (
    "id" SERIAL NOT NULL,
    "survey" TEXT NOT NULL,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "survey_id" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "option" TEXT[],

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
