-- CreateTable
CREATE TABLE "FacultyApplication" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "age" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "applicationType" TEXT NOT NULL,
    "profilePictureKey" TEXT NOT NULL,
    "resumeKey" TEXT NOT NULL,
    "btechCGPA" TEXT NOT NULL,
    "tenthSchoolName" TEXT NOT NULL,
    "tenthPlace" TEXT NOT NULL,
    "tenthTimeline" TEXT NOT NULL,
    "tenthPercentage" TEXT NOT NULL,
    "interCollegeName" TEXT NOT NULL,
    "interPlace" TEXT NOT NULL,
    "interTimeline" TEXT NOT NULL,
    "interPercentage" TEXT NOT NULL,
    "mtechYearOfJoining" TEXT NOT NULL,
    "mtechYearOfGraduation" TEXT NOT NULL,
    "mtechDesignation" TEXT NOT NULL,
    "otherPGDegree" TEXT NOT NULL,
    "otherPGYearOfJoining" TEXT NOT NULL,
    "otherPGYearOfPassing" TEXT NOT NULL,
    "otherPGDesignation" TEXT NOT NULL,
    "hasExperience" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FacultyApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "fromDate" TEXT NOT NULL,
    "toDate" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FacultyApplication_email_key" ON "FacultyApplication"("email");

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "FacultyApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
