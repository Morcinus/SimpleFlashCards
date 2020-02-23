const { db, admin } = require("../util/admin");
const config = require("../util/firebaseConfig");
const firebase = require("firebase");
firebase.initializeApp(config);

function validateUserSignupData(userData) {
  let errors = [];

  // Email
  if (userData.email !== "") {
    // Regex source: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!userData.email.match(regex)) {
      errors.push("auth/invalid-email");
    }
  } else {
    errors.push("auth/invalid-email");
  }

  // Username
  if (userData.username !== "") {
    let usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!userData.username.match(usernameRegex)) {
      errors.push("auth/invalid-username");
    }
  } else {
    errors.push("auth/invalid-username");
  }

  // Password
  if (userData.password !== "") {
    if (userData.password !== userData.confirmPassword) {
      errors.push("auth/passwords-dont-match");
    }
  } else {
    errors.push("auth/invalid-password");
  }

  return errors;
}

// Sign up the user
exports.signup = (req, res) => {
  const userData = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  };

  // Validate user signup data
  const errorCodes = validateUserSignupData(userData);
  if (errorCodes.length > 0) {
    return res.status(400).json({ errorCodes: errorCodes });
  }

  db.collection("users")
    .where("username", "==", `${userData.username}`)
    .get()
    .then(querySnapshot => {
      // Create user
      if (querySnapshot.empty) {
        return firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password);
      } else {
        return res.status(400).json({ errorCode: "auth/username-already-exists" });
      }
    })
    .then(data => {
      const userInfo = {
        email: userData.email,
        username: userData.username,
        bio: "",
        profileImg: ""
      };

      // Add user info to database
      db.collection("users")
        .doc(data.user.uid)
        .set(userInfo);

      return data.user.getIdToken();
    })
    .then(idToken => {
      return res.status(201).json({ idToken });
    })
    .catch(err => {
      console.error(err);
      return res.status(400).json({ errorCode: err.code });
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
      return res.status(400).json({ errorCode: error.code });
    });
};

exports.resetPassword = (req, res) => {
  // Sends the password reset email
  admin
    .auth()
    .getUser(req.user.uid)
    .then(userRecord => {
      let email = userRecord.toJSON().email;

      return firebase.auth().sendPasswordResetEmail(email);
    })
    .then(() => {
      return res.status(200).json({ successCode: "settings/password-reset-email-sent" });
    })
    .catch(error => {
      return res.status(500).json({ errorCode: error.code });
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
    .catch(error => res.status(500).json({ errorCode: error.code }));
};

function validateEmail(email) {
  // Email validation
  if (email !== "") {
    // Regex source: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.match(regex)) {
      return "auth/invalid-email";
    }
  } else {
    return "auth/invalid-email";
  }

  return null;
}

function validateBio(bio) {
  // Bio validation
  if (bio != null) {
    if (bio.length > 250) {
      return "settings/too-long-bio";
    }
  }

  return null;
}

function validateUsername(username) {
  // Username validation
  if (username !== "") {
    let usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!username.match(usernameRegex)) {
      return "auth/invalid-username";
    }
  } else {
    return "auth/invalid-username";
  }

  return null;
}

exports.setUserPersonalData = (req, res) => {
  if (typeof req.body.username !== "undefined") {
    // Username validation
    const errorCode = validateUsername(req.body.username);
    if (errorCode !== null) {
      return res.status(400).json({ errorCode: errorCode });
    }

    // Change username
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
          return res.status(400).json({ errorCode: "settings/username-already-exists" });
        }
      })
      .then(() => {
        return res.status(200).json({ successCode: "settings/username-updated" });
      })
      .catch(error => {
        return res.status(500).json({ errorCode: error.code });
      });
  } else if (typeof req.body.bio !== "undefined") {
    // Bio validation
    const errorCode = validateBio(req.body.bio);
    if (errorCode !== null) {
      return res.status(400).json({ errorCode: errorCode });
    }

    // Change bio
    db.collection("users")
      .doc(req.user.uid)
      .update({ bio: req.body.bio })
      .then(() => {
        return res.status(200).json({ successCode: "settings/bio-updated" });
      })
      .catch(error => {
        return res.status(500).json({ errorCode: error.code });
      });
  } else if (typeof req.body.email !== "undefined" && typeof req.body.password !== "undefined") {
    // Email validation
    const errorCode = validateEmail(req.body.email);
    if (errorCode !== null) {
      return res.status(400).json({ errorCode: errorCode });
    }

    // Change email
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
        return res.status(200).json({ successCode: "settings/email-updated" });
      })
      .catch(error => {
        if (error.code === "auth/wrong-password") {
          return res.status(400).json({
            errorCode: "auth/wrong-password"
          });
        } else {
          return res.status(500).json({ errorCode: error.code });
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

        // Gets user decks
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
        return res.status(404).json({ errorCode: "userprofile/user-not-found" });
      }
    })
    .then(userData => {
      // Gets user collections
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
    .catch(error => {
      return res.status(500).json({ errorCode: error.code });
    });
};

exports.getUserData = (req, res) => {
  let doc;
  db.collection("users")
    .doc(req.user.uid)
    .get()
    .then(document => {
      doc = document;
      if (doc) {
        let userData = {
          username: doc.data().username,
          bio: doc.data().bio,
          createdCollections: doc.data().createdCollections
        };

        // Gets user decks
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
        return res.status(404).json({ errorCode: "userprofile/user-not-found" });
      }
    })
    .then(userData => {
      // Gets user collections
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
    .catch(error => {
      return res.status(500).json({ errorCode: error.code });
    });
};
