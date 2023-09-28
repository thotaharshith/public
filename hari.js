const express = require('express');
const bodyParser = require('body-parser');
const passwordHash = require("password-hash"); // Corrected import
const app = express();

app.use(express.static('public1'));

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

var serviceAccount = require("./key1.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
app.use(express.static("public1"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/signup", function (req, res) {
  res.sendFile(__dirname + "/public1/" + "signup.html");
});

app.post("/signupsubmit", function (req, res) {
  const { FullName, Email, password } = req.body;
  db.collection("Details")
    .where("Email", "==", Email) // Corrected field name to "Email"
    .get()
    .then((docs) => {
      if (docs.size > 0) {
        res.send("Hey user, this account already exists");
      } else {
        db.collection("Details").add({
          FullName: FullName,
          Email: Email,
          password: passwordHash.generate(password) // Corrected function name
        })
        .then(() => {
          const successMessage = "Signup Successful. Click here to <a href='/login'>Log in</a>.";
          res.send(successMessage);
        })
        .catch((error) => {
          console.error("Error during signup:", error);
          res.send("An error occurred during signup. Please try again.");
        });
      }
    });
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/public1/" + "login.html");
});

app.post("/harshith", function (req, res) {
    const providedEmail = req.body.Email; // Changed from req.query.Email
    const providedPassword = req.body.password; // Changed from req.query.password
  
    db.collection("Details") // Corrected collection name
      .where("Email", "==", providedEmail)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.size === 1) {
          const userData = querySnapshot.docs[0].data();
          if (passwordHash.verify(providedPassword, userData.password)) {
            // Password matches
            res.send("Login successful. Click here to <a href='/Dashboard'>Dashboard</a>");
          } else {
            // Password does not match
            res.send("Login failed. Please check your credentials and <a href='/login'>try again</a>.");
          }
        } else {
          // No user found with the provided email
          res.send("Login failed. Please check your credentials and <a href='/login'>try again</a>.");
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        res.send("An error occurred during login. Please try again.");
      });
  });

app.get("/Dashboard", function (req, res) {
  res.sendFile(__dirname + "/public1/" + "hari.html");
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
