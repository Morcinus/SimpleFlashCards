const { db, admin } = require("../util/admin");
const config = require("../util/firebaseConfig");
const firebase = require("firebase");
firebase.initializeApp(config);

/**
 * @module user
 * @category Funkce
 * @description Zde jsou funkce, které se starají o data uživatele.
 */

/**
 * @function validateUserSignupData
 * @description Ověří registrační data uživatele.
 * @param {Object} userData - Registrační data uživatele
 * @returns {Array<String>} Vrací pole error kódů. Pokud ověření proběhlo bez problému, vrací prázdné pole.
 */
function validateUserSignupData(userData) {
  let errors = [];

  // Ověření emailové adresy
  if (userData.email !== "") {
    // Regex zdroj: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!userData.email.match(regex)) {
      errors.push("auth/invalid-email");
    }
  } else {
    errors.push("auth/invalid-email");
  }

  // Ověření uživatelského jména
  if (userData.username !== "") {
    let usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!userData.username.match(usernameRegex)) {
      errors.push("auth/invalid-username");
    }
  } else {
    errors.push("auth/invalid-username");
  }

  // Ověření uživatelského hesla
  if (userData.password !== "") {
    if (userData.password !== userData.confirmPassword) {
      errors.push("auth/passwords-dont-match");
    }
  } else {
    errors.push("auth/invalid-password");
  }

  return errors;
}

/**
 * @function signup
 * @description Vytvoří uživateli účet ve službě Firebase Authentication a zapíše data o uživateli do Firestore databáze. Poté odešle uživateli idToken.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.body.email - Email, se kterým chce být uživatel zaregistrován.
 * @param {string} req.body.password - Heslo, se kterým chce být uživatel zaregistrován.
 * @param {string} req.body.confirmPassword - Potvrzení hesla.
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {string} idToken
 * @async
 */
exports.signup = (req, res) => {
  const userData = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  };

  // Ověření registračních dat
  const errorCodes = validateUserSignupData(userData);
  if (errorCodes.length > 0) {
    return res.status(400).json({ errorCodes: errorCodes });
  }

  db.collection("users")
    .where("username", "==", `${userData.username}`)
    .get()
    .then(querySnapshot => {
      // Vytvoření uživatelského účtu v Firebase Authentication
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

      // Přidání uživatele do Firestore databáze
      db.collection("users")
        .doc(data.user.uid)
        .set(userInfo);

      // Získání idTokenu
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

/**
 * @function login
 * @description Přihlásí uživatele a odešle klientovi idToken.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.body.email - Přihlašovací email uživatele.
 * @param {string} req.body.password - Přihlašovací heslo uživatele.
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {string} idToken
 * @async
 */
exports.login = (req, res) => {
  const userData = {
    email: req.body.email,
    password: req.body.password
  };

  // Přihlásí uživatele pomocí služby Firebase Authentication
  firebase
    .auth()
    .signInWithEmailAndPassword(userData.email, userData.password)
    .then(data => {
      // Získání idTokenu
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

/**
 * @function resetPassword
 * @description Pošle uživateli na email odkaz pro změnu hesla.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {string} successCode
 * @async
 */
exports.resetPassword = (req, res) => {
  admin
    .auth()
    .getUser(req.user.uid)
    .then(userRecord => {
      let email = userRecord.toJSON().email;

      // Odešle email pro změnu hesla
      return firebase.auth().sendPasswordResetEmail(email);
    })
    .then(() => {
      return res.status(200).json({ successCode: "settings/password-reset-email-sent" });
    })
    .catch(error => {
      return res.status(500).json({ errorCode: error.code });
    });
};

/**
 * @function getUserPersonalData
 * @description Získá osobní data uživatele a odešle je klientovi.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {Object} userData - data o uživateli
 * @async
 */
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

/**
 * @function validateEmail
 * @description Ověří správný zápis emailové adresy.
 * @param {string} email - Emailová adresa, která má být ověřena.
 * @returns {string | null} Vrací errorový kód. Pokud ověření proběhlo bez problému, vrací null.
 */
function validateEmail(email) {
  // Ověření emailové adresy
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

/**
 * @function validateBio
 * @description Ověří, zda-li není popis uživatelského profilu příliš dlouhý.
 * @param {string} bio - Popis profilu, který má být ověřen.
 * @returns {string | null} Vrací errorový kód. Pokud ověření proběhlo bez problému, vrací null.
 */
function validateBio(bio) {
  // Ověření popisu profilu
  if (bio != null) {
    if (bio.length > 250) {
      return "settings/too-long-bio";
    }
  }

  return null;
}

/**
 * @function validateUsername
 * @description Ověří, zda-li obsahuje uživatelské jméno pouze povolené znaky.
 * @param {string} username - Uživatelské jméno, které má být ověřeno.
 * @returns {string | null} Vrací errorový kód. Pokud ověření proběhlo bez problému, vrací null.
 */
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

/**
 * @function setUserPersonalData
 * @description Zapíše do databáze nová osobní data uživatele.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.body.username - Nové uživatelské jméno
 * @param {string} req.body.bio - Nový popisek uživatelského profilu
 * @param {string} req.body.email - Nový email uživatele
 * @param {Object} req.body.password - Heslo pro potvrzení změny emailu
 * @returns {string} successCode
 * @async
 */
exports.setUserPersonalData = (req, res) => {
  if (typeof req.body.username !== "undefined") {
    // Ověření uživatelského jména
    const errorCode = validateUsername(req.body.username);
    if (errorCode !== null) {
      return res.status(400).json({ errorCode: errorCode });
    }

    // Změnění uživatelského jména v databázi
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
    // Ověření popisku uživatelského profilu
    const errorCode = validateBio(req.body.bio);
    if (errorCode !== null) {
      return res.status(400).json({ errorCode: errorCode });
    }

    // Změnění popisku uživatelského profilu v databázi
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
    // Ověření správného zápisu emailové adresy
    const errorCode = validateEmail(req.body.email);
    if (errorCode !== null) {
      return res.status(400).json({ errorCode: errorCode });
    }

    // Změnění emailu uživatele ve Firebase Authentication a ve Firestore databázi
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

/**
 * @function getUserDataByUsername
 * @description Získá z databáze data o uživateli pomocí jeho uživatelského jména.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.params.username - Uživatelské jméno
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {Object} userData - data o uživateli
 * @async
 */
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

        // Získání balíčků vytvořených daným uživatelem
        if (doc.data().createdDecks) {
          return db
            .collection("decks")
            .where("creatorId", "==", doc.id)
            .get()
            .then(querySnapshot => {
              let userDecks = [];
              querySnapshot.forEach(doc => {
                // Pokud je balíček veřejný
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
      // Získání kolekcí vytvořených daným uživatelem
      if (doc.data().createdCollections) {
        return db
          .collection("collections")
          .where("creatorId", "==", doc.id)
          .get()
          .then(querySnapshot => {
            let userCollections = [];
            querySnapshot.forEach(doc => {
              // Pokud je kolekce veřejná
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

/**
 * @function getUserData
 * @description Získá z databáze data o přihlášeném uživateli pomocí jeho uživatelského ID.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {Object} userData - data o uživateli
 * @async
 */
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

        // Získání balíčků vytvořených daným uživatelem
        if (doc.data().createdDecks) {
          return db
            .collection("decks")
            .where("creatorId", "==", doc.id)
            .get()
            .then(querySnapshot => {
              let userDecks = [];
              querySnapshot.forEach(doc => {
                // Pokud je balíček veřejný
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
      // Získání kolekcí vytvořených daným uživatelem
      if (doc.data().createdCollections) {
        return db
          .collection("collections")
          .where("creatorId", "==", doc.id)
          .get()
          .then(querySnapshot => {
            let userCollections = [];
            querySnapshot.forEach(doc => {
              // Pokud je kolekce veřejná
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
