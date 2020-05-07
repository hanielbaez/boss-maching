const express = require('express');
const apiRouter = express.Router();

const db = require('./db');
const checkIdea = require('./checkMillionDollarIdea');

apiRouter.param('minionId', (req, res, next, id) => {
    const foundMinion = db.getFromDatabaseById('minions', id);
    if (!foundMinion) {
        res.status(404).send();
    }
    req.foundMinion = foundMinion;
    next();
});

apiRouter.get('/minions', (req, res) => {
    const allMinions = db.getAllFromDatabase('minions');
    res.send(allMinions);
});

apiRouter.get('/minions/:minionId', (req, res) => {
    res.send(req.foundMinion);
});

apiRouter.put('/minions/:minionId', (req, res) => {
    const body = req.body;
    const updatedMinion = db.updateInstanceInDatabase('minions', body);
    res.send(updatedMinion);
});

apiRouter.post('/minions', (req, res) => {
    const body = req.body;
    const newMinion = createNewMinion(body);
    if (newMinion !== null) {
        const createdMinion = db.addToDatabase('minions', newMinion);
        res.status(201).send(createdMinion);
    }
});

//helper functin check if the body has valid data for a new MINION if so return a MINION instance
const createNewMinion = (body) => {
    if (body.name !== null && body.title !== null && body.salary !== null && body.weaknesses !== null) {
        const newMinion = {
            id: null,
            name: body.name,
            title: body.title,
            salary: body.salary,
            weaknesses: body.weaknesses,
        };
        return newMinion;
    }
    return null;
};

apiRouter.delete('/minions/:minionId', (req, res, next) => {
    const id = req.params.minionId;
    const foundMinion = db.deleteFromDatabasebyId('minions', id);
    if (foundMinion) {
        res.status(204).send();
    } else {
        res.status(404).send();
    }
});

//ides


apiRouter.get('/ideas', (req, res) => {
    const allIdeas = db.getAllFromDatabase('ideas');
    res.send(allIdeas);
});

apiRouter.param('ideaId', (req, res, next, id) => {
    const ideaFounded = db.getFromDatabaseById('ideas', req.params.ideaId);
    if (!ideaFounded) {
        res.status(404).send();
    }
    req.ideaFounded = ideaFounded;
    next();
});

apiRouter.get('/ideas/:ideaId', (req, res) => {
    res.send(req.ideaFounded);
});

apiRouter.put('/ideas/:ideaId', (req, res) => {
    const ideaId = req.params.ideaId;
    const body = req.body;
    const updatedIdea = db.updateInstanceInDatabase('ideas', body);
    res.send(updatedIdea);
});

apiRouter.post('/ideas', checkIdea, (req, res, next) => {
    const body = req.body;
    const newIdea = createNewIdea(body);
    if (newIdea) {
        const createdIdea = db.addToDatabase('ideas', newIdea);
        res.status(201).send(createdIdea);
    }
});

//helper functin check if the body has valid data for a new IDEA if so return IDEA instance
const createNewIdea = (body) => {
    if (body.name !== null && body.description !== null && body.numWeeks !== null && body.weeklyRevenue !== null) {
        const newIdea = {
            id: null,
            name: body.name,
            description: body.description,
            numWeeks: body.numWeeks,
            weeklyRevenue: body.weeklyRevenue,
        };
        return newIdea;
    }
    return null;
};

apiRouter.delete('/ideas/:ideaId', (req, res) => {
    const id = req.params.ideaId;
    const foundIdea = db.deleteFromDatabasebyId('ideas', id);
    if (foundIdea) {
        res.status(204).send();
    } else {
        res.status(404).send();
    }
});

//meetings
apiRouter.get('/meetings', (req, res) => {
    const allMetings = db.getAllFromDatabase('meetings');
    res.send(allMetings);
});

apiRouter.post('/meetings', (req, res) => {
    const createdMeting = db.createMeeting();
    db.addToDatabase('meetings', createdMeting);
    res.status(201).send(createdMeting);
});

apiRouter.delete('/meetings', (req, res) => {
    const deleteState = db.deleteAllFromDatabase('meetings');
    if (deleteState) {
        res.status(204).send();
    }
    else {
        res.status(404).send();
    }
});

//bonus

apiRouter.param('minionId', (req, res, next, val) => {
    const foundMinion = db.getFromDatabaseById('minions', val);
    if (foundMinion) {
        next();
    } else {
        res.status(404).send();
    }
});

apiRouter.get('/minions/:minionId/work', (req, res) => {
    const foundWork = db.getAllWorkbyMinionId(req.params.minionId);
    res.send(foundWork);
});

apiRouter.put('/minions/:minionId/work/:workId', (req, res) => {
    const foundMinion = db.getFromDatabaseById('minions', req.body.minionId);
    if (!foundMinion) {
        res.status(400).send();
    }
    const updatedWork = db.updateInstanceInDatabase('work', req.body);

    if (updatedWork) {
        res.send(updatedWork);
    } else {
        res.status(404).send();
    }
});

apiRouter.post('/minions/:minionId/work', (req, res, next) => {
    const createdWork = db.addToDatabase('work', req.body);
    if (createdWork) {
        res.status(201).send(createdWork);
    }
});

apiRouter.delete('/minions/:minionId/work/:workId', (req, res, next) => {
    const deletedWork = db.deleteFromDatabasebyId('work', req.params.workId);
    if (deletedWork) {
        res.status(204).send();
    }
});

module.exports = apiRouter;
