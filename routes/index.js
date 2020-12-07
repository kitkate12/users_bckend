
const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("./../serviceAccount.json");
const router = express.Router();
const users = [];

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

//id univooci generator
function genId(users) {
    return users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1
}

//GET LIST
router.get("/users", async (req, res) => {
    //aggiorno la lista
    users.length = 0;
    
    const list = await db.collection('users').get();
    list.forEach(doc => users.push(doc.data()));
    return res.json(users);
});

//GET ONE BY ID
router.get("/users/:id", (req, res) => {
    db.collection('users').doc(req.params.id).get()
        .then(
            user => {
                if (!user.exists) {
                    res.status(404).json({ message: "User not found" });
                }
                return res.status(200).json(user.data());
            }
        ).catch(error => res.status(500).send(error));
});

//POST 
router.post("/users", async (req, res) => {
    const list = await db.collection('users').get();
    list.forEach(doc => users.push(doc.data()));
    const newId = genId(users);
    let user = {
        id: newId,
        name: req.body.name
    };
    users.push(user);
    db.collection('users').doc(newId.toString()).set(user);
    return res.status(201).json({ message: "Created" });
});

//PATCH
router.patch("/users/:id", async (req, res) => {
    //aggiorno la lista
    users.length = 0;
    const list = await db.collection('users').get();
    list.forEach(doc => users.push(doc.data()));

    if (!req.body.name) {
        return res.status(400).json({ message: "You have to pass a name" });
    }

    const u = await db.collection('users').doc(req.params.id).get();

    if (!u.data()) {
        return res.status(404).json({ message: "User not found" });
    }

    db.collection('users').doc(req.params.id).set({ name: req.body.name }, { merge: true });

    const user = users.find(val => val.id === Number(req.params.id));
    // errore
    //user.name = req.body.name;
    return res.json({ massage: "Updated" });
});

//DELETE
router.delete("/users/:id", (req, res) => {
    const userIndex = users.findIndex(val => val.id === Number(req.params.id));
    users.splice(userIndex, 1);
    return res.json({ message: "Deleted" });
})
module.exports = router; 