const checkMillionDollarIdea = (req, res, next) => {
    const body = req.body;

    if (Number(body.numWeeks) && Number(body.weeklyRevenue)) {
        const yield = body.numWeeks * body.weeklyRevenue;
        if (yield < 1000000) {
            res.status(400).send();
        } else {
            next();
        }
    } else {
        res.status(400).send();
    }
};



// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
