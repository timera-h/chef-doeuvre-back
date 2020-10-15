const router = new require("express").Router();
const messageModel = require("./../models/Message");

// voir les messages,  GET le prefix /api/messages
router.get("/", async (req, res, next) => {
    try {
        const users = await messageModel.find();
        res.json(users);
    } catch(err) {
        next(err);
    };
});

// voir le message de l'utilisateur, GET prefix /api/message/to/:id
router.get("/to/:id", async (req, res, next) => {
    try {
        const posts = await messageModel.find({ to: req.params.id })
        .populate("to")
        .populate("from");
        res.json(posts);
    } catch(err) {
        next(err);
    }
});

// envoyer un message, POST prefix /api/messages
router.post("/", async (req, res, next) => {
    const {to, from, message, tel} = req.body; // syntaxe par destructuration
    try {
        const posts = await messageModel.create({
            to,
            from,
            message,
            tel,
            date: Date.now(),
        });
        res.json(posts);
    } catch(err) {
        next(err);
    }
});

module.exports = router;