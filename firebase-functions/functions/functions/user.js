const { db } = require("../util/admin");
const config = require("../util/firebaseConfig");
const firebase = require("firebase");
firebase.initializeApp(config);

function validateUserSignupData(userData) {
  let errors = {};

  // Email
  if (userData.email !== "") {
    // Regex source: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!userData.email.match(regex)) {
      errors.emailError = "Must be a valid email!";
    }
  } else {
    errors.emailError = "Email must not be empty!";
  }

  // Username
  if (userData.email !== "") {
    db.collection("users")
      .doc(`${userData.username}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          errors.usernameError = "This username is already taken!";
        }
      });
  } else {
    errors.usernameError = "Username must not be empty!";
  }

  // Password
  if (userData.password !== "" && userData.confirmPassword !== "") {
    if (userData.password !== userData.confirmPassword) {
      errors.passwordError = "Passwords don't match!";
    }
  } else {
    errors.passwordError = "Password must not be empty!";
  }

  return errors;
}

exports.signup = (req, res) => {
  const userData = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  };

  const errors = validateUserSignupData(userData);
  if (Object.keys(errors).length !== 0) {
    return res.status(400).json(errors);
  }

  db.collection("users")
    .doc(`${userData.username}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(userData.email, userData.password);
      }
    })
    .then(data => {
      const userInfo = {
        email: userData.email,
        username: userData.username,
        userId: data.user.uid
      };

      db.collection("users")
        .doc(`${userData.username}`)
        .set(userInfo);

      return data.user.getIdToken();
    })
    .then(idToken => {
      return res.status(201).json({ idToken });
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/weak-password") {
        return res.status(400).json({
          passwordError:
            "Weak password! Passwords must be at least 6 characters long"
        });
      } else if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ emailError: "Email is already in use" });
      } else {
        return res.status(500).json({ error: err });
      }
    });
};

function validateUserLoginData(userData) {
  let errors = {};

  // Email
  if (userData.email === "") {
    errors.emailError = "Email must not be empty!";
  }

  // Password
  if (userData.password === "") {
    errors.passwordError = "Password must not be empty!";
  }

  return errors;
}

exports.login = (req, res) => {
  const userData = {
    email: req.body.email,
    password: req.body.password
  };

  const errors = validateUserLoginData(userData);
  if (Object.keys(errors).length !== 0) {
    return res.status(400).json(errors);
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(userData.email, userData.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(idToken => {
      return res.status(200).json({ idToken });
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        return res.status(400).json({
          passwordError: "Wrong password"
        });
      } else if (err.code === "auth/user-not-found") {
        return res.status(400).json({ emailError: "User not found" });
      } else {
        return res.status(500).json(err);
      }
    });
};

function validateUserProfileData(userData) {
  let errors = {};

  // Username
  if (userData.username != null) {
    if (userData.username !== "") {
      let usernameRegex = /^[a-zA-Z0-9]+$/;
      if (!userData.username.match(usernameRegex)) {
        errors.usernameError = "Username is invalid!";
      }
    } else {
      errors.usernameError = "Username must not be empty!";
    }
  }

  // Bio
  if (userData.bio != null) {
    if (userData.bio.length > 250) {
      errors.bioError = "Bio must not be longer than 250 characters!";
    }
  }

  return errors;
}

exports.updateUserProfile = (req, res) => {
  // Data validation
  const errors = validateUserProfileData(req.body);
  if (Object.keys(errors).length !== 0) {
    return res.status(400).json(errors);
  }

  // console.log("errors:", errors);
  // console.log("pokracujem");
  // Initialization
  const userData = {};
  if (req.body.bio) userData.bio = req.body.bio;
  if (req.body.profileImg) userData.profileImg = req.body.profileImg;
  if (req.body.username) userData.username = req.body.username;

  if (req.body.userId) {
    new Promise((resolve, reject) => {
      if (req.body.username) {
        db.collection("users")
          .where("username", "==", `${req.body.username}`)
          .get()
          .then(querySnapshot => {
            if (querySnapshot.empty) {
              // Username can be used
              resolve(
                db
                  .collection("users")
                  .doc(`${req.body.userId}`)
                  .update(userData)
              );
            } else {
              // Username is taken
              reject(
                res
                  .status(400)
                  .json({ error: "This username is already taken!" })
              );
            }
          });
      } else {
        // Doesn't change username
        resolve(
          db
            .collection("users")
            .doc(`${req.body.userId}`)
            .update(userData)
        );
      }
    })
      .then(() => {
        return res.status(200).json({ message: "User profile updated" });
      })
      .catch(error => res.status(500).json({ error: error.code }));
  } else {
    res.status(400).json();
  }
};
