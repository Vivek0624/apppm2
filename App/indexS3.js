// const express = require("express");
// const fileupload = require("express-fileupload");
// const bodyParser = require("body-parser");
// const dotenv = require("dotenv");
// dotenv.config();

// const {
//   S3Client,
//   PutObjectCommand,
//   GetObjectCommand,
//   DeleteObjectCommand,
// } = require("@aws-sdk/client-s3");

// const { v4: uuidv4 } = require("uuid");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// app.use(fileupload());
// app.use(bodyParser.json());
// const port = 3003;

// //  create s3 instance using S3Client
// // (this is how we create s3 instance in v3)

// const s3 = new S3Client({
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY, // store it in .env file to keep it safe
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
//   region: process.env.AWS_BUCKET_REGION, // this is the region that you select in AWS account
// });

// // app.get("/", (req, res) => {
// //   res.send("Hello World!");
// // });

// app.post("/", (req, res) => {
//   let doneList = [];
//   console.log("req.files.video", req.files.video);
//   return;
//   for (const file of req.files.video) {
//     let path = atob(file.name);

//     if (uploadContentToS3(file, path)) {
//       doneList.push(path);
//     } else {
//       console.log("problem here!");
//     }
//   }
//   //   console.log("done list ; ", doneList);
//   return res.json({
//     doneList,
//   });
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port http://localhost:${port}`);
// });

// // const uploadContent = (file, path) => {
// //   // console.log("FILE", file);
// //   console.log("PATH", path);

// //   const storage = getStorage(firebaseApp);
// //   // const storageRef = ref(storage, `folder/${uuidv4()}-${file.name}`);
// //   const storageRef = ref(storage, `uploads/${path}`);

// //   const metadata = {
// //     contentType: "*/*",
// //   };

// //   uploadBytes(storageRef, file.data, metadata).then((snapshot) => {
// //     console.log("someData here");
// //   });

// //   const uploadTask = uploadBytesResumable(storageRef, file.data);

// //   uploadTask.on(
// //     "state_changed",
// //     (snapshot) => {
// //       // Observe state change events such as progress, pause, and resume
// //       // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
// //       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
// //       console.log("Upload is " + progress + "% done");
// //       switch (snapshot.state) {
// //         case "paused":
// //           // console.log('Upload is paused');
// //           break;
// //         case "running":
// //           // console.log('Upload is running');
// //           break;
// //       }
// //     },
// //     (error) => {
// //       // Handle unsuccessful uploads
// //       return false;
// //     },
// //     () => {
// //       // Handle successful uploads on complete
// //       // For instance, get the download URL: https://firebasestorage.googleapis.com/...
// //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
// //         console.log("File available at", downloadURL);
// //         return true;
// //       });
// //     }
// //   );
// // };

// const uploadContentToS3 = async (file, path) => {
//   //   let files = req.files.video;

//   //   console.log("Length", files.length);

//   if (file.length == undefined) {
//     file = [file];
//   }

//   console.log("file", file);

//   //   return;
//   // Specify your S3 bucket name
//   //   const bucketName = process.env.AWS_BUCKET_NAME;

//   //   console.log("path", path);
//   //   console.log("file", file);
//   //   console.log("bucketName", bucketName);

//   // Generate a unique key for the uploaded file (e.g., using uuidv4)
//   //   const uniqueKey = `${uuidv4()}-${file.name}`;

//   // Specify the S3 object params
//   //   const params = {
//   //     Bucket: bucketName,
//   //     Key: `uploads/${path}/${uniqueKey}`, // Specify the desired path within the bucket
//   //     Body: file.data, // The file data as a Buffer or ReadableStream
//   //     ContentType: "application/octet-stream", // Adjust the content type as needed
//   //   };

//   for (const item of file) {
//     // let fileName = item.name;
//     // const extentionOfFileName = fileName.split(".").pop();
//     // fileName = `${season}/${Date.now() + "." + extentionOfFileName}`;
//     const bucketParams = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: `uploads/${path}`, // Specify the desired path within the bucket,
//       Body: item.data,
//     };

//     const data = await s3.send(new PutObjectCommand(bucketParams));

//     if (data.$metadata.httpStatusCode == 200) {
//       console.log("Done - ");
//       //   urlList.push({
//       //     fileName,
//       //     url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${fileName}`,
//       //   });
//     }
//   }

//   // Upload the file to S3
//   //   s3.upload(params, (err, data) => {
//   //     if (err) {
//   //       console.error("Error uploading to S3:", err);
//   //       return false;
//   //     }

//   //     console.log("File uploaded successfully:", data.Location);
//   //     return true;
//   //   });
// };

/////////////////////////////////////////////////////////////////////////////

// // Example usage
// //   const file = {
// //     name: 'example.txt', // Replace with the actual file name
// //     data: Buffer.from('Hello, World!', 'utf-8'), // Replace with your file data
// //   };

// //   const path = 'example-folder'; // Specify the desired path within your S3 bucket

// //   uploadContentToS3(file, path);

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { fromBase64 } = require("base64-arraybuffer");
const fileupload = require("express-fileupload");

const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(fileupload());

app.use(bodyParser.json());
const port = 3003;

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_BUCKET_REGION,
});

app.post("/", async (req, res) => {
  const doneList = [];
  const uploadPromises = [];

  // console.log("req.files.video", req.files);

  for (const file of req.files.video) {
    // const path = fromBase64(file.name);

    // Push each upload promise into an array
    uploadPromises.push(uploadContentToS3(file, atob(file.name), doneList));
  }

  try {
    // Wait for all uploads to complete
    await Promise.all(uploadPromises);
    return res.json({
      doneList,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return res
      .status(500)
      .json({ error: "Failed to upload one or more files" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

const uploadContentToS3 = async (file, path, doneList) => {
  try {
    if (!Array.isArray(file)) {
      file = [file];
    }

    const uploadPromises = file.map((item) => {
      const bucketParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/${path}`,
        Body: item.data,
      };

      return s3.send(new PutObjectCommand(bucketParams));
    });

    // Wait for all uploads in this batch to complete
    const results = await Promise.all(uploadPromises);

    // Check each result and add successfully uploaded paths to doneList
    for (const result of results) {
      if (result.$metadata.httpStatusCode === 200) {
        doneList.push(path);
        console.log("Done - ", path);
      }
    }
  } catch (error) {
    console.error("Error uploading files:", error);
  }
};
