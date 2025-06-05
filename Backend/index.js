// server.js or index.js
import express from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

dotenv.config();
const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(cors());

// Multer setup for memory storage (no local file saving)
const upload = multer({ storage: multer.memoryStorage() });

// AWS S3 config
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Upload helper
const uploadToS3 = async (file, folder) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${folder}/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const { Location } = await s3.upload(params).promise();
  console.log(`File uploaded successfully at ${Location}`);
  return Location;
};

// Date parsing helper
const parseDateString = (dateStr) => {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error('Invalid date format for dateOfBirth. Use YYYY-MM-DD.');
  }
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// ------------------------------------------
// ✅ Route 1: Save faculty application data
// ------------------------------------------
// app.post('/faculty-application/data', async (req, res) => {
//   try {
//     const body = req.body;
//     const dateOfBirth = parseDateString(body.dateOfBirth);

//     let experiences = [];
//     if (body.experiences) {
//       experiences = typeof body.experiences === 'string'
//         ? JSON.parse(body.experiences)
//         : body.experiences;
//     }

//     const appData = await prisma.facultyApplication.create({
//       data: {
//         fullName: body.fullName,
//         gender: body.gender || '',
//         dateOfBirth,
//         age: body.age || '',
//         position: body.position || '',
//         email: body.email,
//         phone: body.phone || '',
//         applicationType: body.applicationType,   // Add this line
    
//         btechCGPA: body.btechCGPA || '',
//         tenthSchoolName: body.tenthSchoolName || '',
//         tenthPlace: body.tenthPlace || '',
//         tenthTimeline: body.tenthTimeline || '',
//         tenthPercentage: body.tenthPercentage || '',
//         interCollegeName: body.interCollegeName || '',
//         interPlace: body.interPlace || '',
//         interTimeline: body.interTimeline || '',
//         interPercentage: body.interPercentage || '',
//         mtechYearOfJoining: body.mtechYearOfJoining || '',
//         mtechYearOfGraduation: body.mtechYearOfGraduation || '',
//         mtechDesignation: body.mtechDesignation || '',
//         otherPGDegree: body.otherPGDegree || '',
//         otherPGYearOfJoining: body.otherPGYearOfJoining || '',
//         otherPGYearOfPassing: body.otherPGYearOfPassing || '',
//         otherPGDesignation: body.otherPGDesignation || '',
//         hasExperience: body.hasExperience === 'true' || body.hasExperience === true,
//         experiences: {
//           create: experiences.map(exp => ({
//             designation: exp.designation || '',
//             institution: exp.institution || '',
//             place: exp.place || '',
//             fromDate: exp.fromDate || '',
//             toDate: exp.toDate || '',
//           })),
//         },
//       },
//     });
//     console.log(appData.id);
//     res.status(201).json({
//       message: 'Form data saved',
//       id: appData.id,
//     });
//   } catch (error) {
//     console.error('Error saving form data:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // -----------------------------------------------------
// // ✅ Route 2: Upload profile/resume and update DB URLs
// // -----------------------------------------------------
// app.post(
//   '/faculty-application/media/:applicationId',
//   upload.fields([
//     { name: 'profilePicture', maxCount: 1 },
//     { name: 'resume', maxCount: 1 },
//   ]),
//   async (req, res) => {
    
//     try {
//       console.log('Params:', req.params);
//       const applicationId = req.params.applicationId;
//       console.log(applicationId);

//       if (!applicationId) {
//         return res.status(400).json({ error: 'Missing applicationId in URL params' });
//       }

//       const existing = await prisma.facultyApplication.findUnique({
//         where: { id: applicationId },
//       });

//       if (!existing) {
//         return res.status(404).json({ error: 'Application not found' });
//       }

//       const files = req.files || {};

//       if (!files.profilePicture || files.profilePicture.length === 0) {
//         return res.status(400).json({ error: 'Profile picture is required' });
//       }

//       // Upload profile picture
//       const profileUrl = await uploadToS3(files.profilePicture[0], 'profile-pictures');
//       console.log(profileUrl);
//       let resumeUrl = null;
//       if (files.resume && files.resume.length > 0) {
//         resumeUrl = await uploadToS3(files.resume[0], 'resumes');
//       }

//       const updated = await prisma.facultyApplication.update({
//         where: { id: applicationId },
//         data: {
//           profilePictureKey: profileUrl,
//           resumeKey: resumeUrl || '',
//         },
//       });

//       res.status(200).json({
//         message: 'Files uploaded and database updated successfully',
//         profilePictureUrl: profileUrl,
//         resumeUrl: resumeUrl,
//         updatedEntry: updated,
//       });
//     } catch (error) {
//       console.error('Error uploading media and updating DB:', error);
//       res.status(500).json({ error: error.message });
//     }
//   }
// );
// ✅ Unified faculty application submission
app.post(
  '/faculty-application/full-submit',
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const body = req.body;
      const dateOfBirth = parseDateString(body.dateOfBirth);

      let experiences = [];
      try {
        if (body.experiences) {
          experiences = JSON.parse(body.experiences);
        }
      } catch (err) {
        throw new Error('Failed to parse experiences field: ' + err.message);
      }
      


      // Upload files to S3
      const files = req.files || {};
      if (!files.profilePicture || !files.resume) {
        return res.status(400).json({ error: 'Both profile picture and resume are required' });
      }

      const profileUrl = await uploadToS3(files.profilePicture[0], 'profile-pictures');
      const resumeUrl = await uploadToS3(files.resume[0], 'resumes');

      // Create faculty application in DB
      const appData = await prisma.facultyApplication.create({
        data: {
          fullName: body.fullName,
          gender: body.gender || '',
          dateOfBirth,
          age: body.age || '',
          position: body.position || '',
          email: body.email,
          phone: body.phone || '',
          applicationType: body.applicationType || '',
          profilePictureKey: profileUrl,
          resumeKey: resumeUrl,

          btechCGPA: body.btechCGPA || '',
          tenthSchoolName: body.tenthSchoolName || '',
          tenthPlace: body.tenthPlace || '',
          tenthTimeline: body.tenthTimeline || '',
          tenthPercentage: body.tenthPercentage || '',
          interCollegeName: body.interCollegeName || '',
          interPlace: body.interPlace || '',
          interTimeline: body.interTimeline || '',
          interPercentage: body.interPercentage || '',
          mtechYearOfJoining: body.mtechYearOfJoining || '',
          mtechYearOfGraduation: body.mtechYearOfGraduation || '',
          mtechDesignation: body.mtechDesignation || '',
          otherPGDegree: body.otherPGDegree || '',
          otherPGYearOfJoining: body.otherPGYearOfJoining || '',
          otherPGYearOfPassing: body.otherPGYearOfPassing || '',
          otherPGDesignation: body.otherPGDesignation || '',
          hasExperience: body.hasExperience === 'true' || body.hasExperience === true,
          experiences: {
            create: experiences.map(exp => ({
              designation: exp.designation || '',
              institution: exp.institution || '',
              place: exp.place || '',
              fromDate: exp.fromDate || '',
              toDate: exp.toDate || '',
            })),
          },
        },
      });

      res.status(201).json({
        message: 'Faculty application submitted successfully!',
        id: appData.id,
        profilePictureUrl: profileUrl,
        resumeUrl: resumeUrl,
      });
    } catch (error) {
      console.error('Error submitting full application:', error);
      res.status(500).json({ error: error.message });
    }
  }
);


app.get('/userDetails', async (req, res) => {
  try {
    const users = await prisma.facultyApplication.findMany({
      include: {
        experiences: true,  
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});
// ------------------------------------------
// Start the server
// ------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});