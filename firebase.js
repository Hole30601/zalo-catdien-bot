const admin = require("firebase-admin");

if(!admin.apps.length){
     
console.log("PROJECT:", process.env.FB_PROJECT_ID);
console.log("EMAIL:", process.env.FB_CLIENT_EMAIL);
console.log("KEY:", !!process.env.FB_PRIVATE_KEY);

     
     admin.initializeApp({
 
      credential:
      admin.credential.cert({

         projectId:
         process.env.FB_PROJECT_ID,

         clientEmail:
         process.env.FB_CLIENT_EMAIL,

         privateKey:
         process.env.FB_PRIVATE_KEY
         .replace(/\\n/g, "\n")
              

      }),

      databaseURL:
      process.env.FB_DB_URL

   });
}

const db =
admin.database();

module.exports = db;
