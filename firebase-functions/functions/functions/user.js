const { db, admin } = require("../util/admin");
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
  if (userData.username !== "") {
    let usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!userData.username.match(usernameRegex)) {
      errors.usernameError = "Username is invalid!";
    }
  } else {
    errors.usernameError = "Username must not be empty!";
  }

  // Password
  if (userData.password !== "") {
    if (userData.password !== userData.confirmPassword) {
      errors.passwordError = "Passwords don't match!";
    }
  } else {
    errors.passwordError = "Password must not be empty!";
  }

  return errors;
}

// NEEDS CODE POLISH AND TESTING
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
    .where("username", "==", `${userData.username}`)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.empty) {
        return firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password);
      } else {
        return res.status(400).json({ usernameError: "This username is already taken!" });
      }
    })
    .then(data => {
      const userInfo = {
        email: userData.email,
        username: userData.username,
        bio: "",
        profileImg: ""
      };

      db.collection("users")
        .doc(`${data.user.uid}`) // This should be done differently ! https://firebase.google.com/docs/auth/web/manage-users#get_a_users_profile
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
          passwordError: "Weak password! Passwords must be at least 6 characters long"
        });
      } else if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ emailError: "Email is already in use" });
      } else {
        return res.status(500).json({ error: err });
      }
    });
};

// Log in the user
exports.login = (req, res) => {
  const userData = {
    email: req.body.email,
    password: req.body.password
  };

  firebase
    .auth()
    .signInWithEmailAndPassword(userData.email, userData.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(idToken => {
      return res.status(200).json({ idToken });
    })
    .catch(error => {
      console.error(error);
      // if (error.code === "auth/wrong-password") {
      //   return res.status(400).json({
      //     errorCode: "login/wrong-password"
      //   });
      // } else if (error.code === "auth/user-not-found") {
      //   return res.status(400).json({ errorCode: "login/user-not-found" });
      // } else if (error.code === "auth/invalid-email") {
      //   return res.status(400).json({ errorCode: "login/invalid-email" });
      // } else {
      return res.status(400).json({ errorCode: error.code });
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
              reject(res.status(400).json({ error: "This username is already taken!" }));
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

exports.resetPassword = (req, res) => {
  admin
    .auth()
    .getUser(req.user.uid)
    .then(userRecord => {
      let email = userRecord.toJSON().email;

      return firebase.auth().sendPasswordResetEmail(email);
    })
    .then(() => {
      return res.status(200).json({ passwordSuccess: "The reset link was sent to your email!" });
    })
    .catch(error => {
      return res.status(500).json({ passwordError: error.code });
    });
};

exports.getUserPersonalData = (req, res) => {
  db.collection("users")
    .doc(req.user.uid)
    .get()
    .then(doc => {
      let userData = {
        username: doc.data().username,
        bio: doc.data().bio,
        email: doc.data().email
      };

      return userData;
    })
    .then(userData => {
      res.status(200).json(userData);
    })
    .catch(error => console.error(error));
};

exports.setUserPersonalData = (req, res) => {
  // NEED TO VALIDATE USERNAME - ON BACKEND AND ON FRONDEND + for all other stuff
  if (req.body.username) {
    db.collection("users")
      .where("username", "==", `${req.body.username}`)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          return db
            .collection("users")
            .doc(req.user.uid)
            .update({ username: req.body.username });
        } else {
          return res.status(400).json({ usernameError: "This username is already taken!" });
        }
      })
      .then(() => {
        return res.status(200).json({ usernameSuccess: "Username changed successfully!" });
      })
      .catch(error => {
        return res.status(500).json({ usernameError: error.code });
      });
  } else if (req.body.bio) {
    db.collection("users")
      .doc(req.user.uid)
      .update({ bio: req.body.bio })
      .then(() => {
        return res.status(200).json({ bioSuccess: "Description updated successfully!" });
      })
      .catch(error => {
        return res.status(500).json({ bioError: error.code });
      });
  } else if (req.body.email && req.body.password) {
    const userData = {
      email: req.user.email,
      password: req.body.password
    };

    // NEED TO VALIDATE EMAIL
    const errors = validateUserLoginData(userData);
    if (Object.keys(errors).length !== 0) {
      return res.status(400).json(errors);
    }

    firebase
      .auth()
      .signInWithEmailAndPassword(req.user.email, req.body.password)
      .then(userCredential => {
        userCredential.user.updateEmail(req.body.email);
        return;
      })
      .then(() => {
        return db
          .collection("users")
          .doc(req.user.uid)
          .update({ email: req.body.email });
      })
      .then(() => {
        return res.status(200).json({ emailSuccess: "Email changed successfully!" });
      })
      .catch(error => {
        if (error.code === "auth/wrong-password") {
          return res.status(400).json({
            passwordError: "Wrong password"
          });
        } else {
          return res.status(500).json({ emailError: error.code });
        }
      });
  }
};

exports.getUserDataByUsername = (req, res) => {
  let username = req.params.username;
  let doc;
  db.collection("users")
    .where("username", "==", username)
    .get()
    .then(querySnapshot => {
      doc = querySnapshot.docs[0];
      if (doc) {
        let userData = {
          username: doc.data().username,
          bio: doc.data().bio,
          createdCollections: doc.data().createdCollections
        };

        if (doc.data().createdDecks) {
          return db
            .collection("decks")
            .where("creatorId", "==", doc.id)
            .get()
            .then(querySnapshot => {
              let userDecks = [];
              querySnapshot.forEach(doc => {
                // If the deck is public
                if (!doc.data().private) {
                  exportDeck = {
                    deckName: doc.data().deckName,
                    deckImage: doc.data().deckImage,
                    deckId: doc.id
                  };
                  userDecks.push(exportDeck);
                }
              });
              userData.createdDecks = userDecks;
              return userData;
            });
        } else {
          return userData;
        }
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .then(userData => {
      if (doc.data().createdCollections) {
        return db
          .collection("collections")
          .where("creatorId", "==", doc.id)
          .get()
          .then(querySnapshot => {
            let userCollections = [];
            querySnapshot.forEach(doc => {
              // If the collection is public
              if (!doc.data().private) {
                colData = {
                  colName: doc.data().colName,
                  colId: doc.id
                };
                userCollections.push(colData);
              }
            });
            userData.createdCollections = userCollections;
            return userData;
          });
      } else {
        return userData;
      }
    })
    .then(userData => {
      res.status(200).json(userData);
    })
    .catch(error => console.error(error));
};

exports.getUserData = (req, res) => {
  let doc;
  db.collection("users")
    .doc(req.user.uid)
    .get()
    .then(document => {
      console.log("Jsem tu 1");
      doc = document;
      if (doc) {
        let userData = {
          username: doc.data().username,
          bio: doc.data().bio,
          createdCollections: doc.data().createdCollections
        };

        if (doc.data().createdDecks) {
          return db
            .collection("decks")
            .where("creatorId", "==", doc.id)
            .get()
            .then(querySnapshot => {
              let userDecks = [];
              querySnapshot.forEach(doc => {
                // If the deck is public
                if (!doc.data().private) {
                  exportDeck = {
                    deckName: doc.data().deckName,
                    deckImage: doc.data().deckImage,
                    deckId: doc.id
                  };
                  userDecks.push(exportDeck);
                }
              });
              userData.createdDecks = userDecks;
              return userData;
            });
        } else {
          return userData;
        }
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .then(userData => {
      console.log("Jsem tu 2");
      if (doc.data().createdCollections) {
        return db
          .collection("collections")
          .where("creatorId", "==", doc.id)
          .get()
          .then(querySnapshot => {
            let userCollections = [];
            querySnapshot.forEach(doc => {
              // If the collection is public
              if (!doc.data().private) {
                colData = {
                  colName: doc.data().colName,
                  colId: doc.id
                };
                userCollections.push(colData);
              }
            });
            userData.createdCollections = userCollections;
            return userData;
          });
      } else {
        return userData;
      }
    })
    .then(userData => {
      console.log("Jsem tu");
      res.status(200).json(userData);
    })
    .catch(error => console.error(error));
};
