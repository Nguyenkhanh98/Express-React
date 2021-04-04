const express = require('express');
const router = express.Router();
const { subjectService, markService } = require('../services');

router.get('/', async (req, res, next) => {
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;

    try {
        const subjects = await subjectService.getListSubject({ offset, limit });
        if (subjects) {
            return res.status(200).send({ message: 'successfully', data: subjects });
        }

        return res.status(422).send();
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

router.get('/:subjectId/marks', async (req, res, next) => {
    const { subjectId } = req.params;
    const { min, max, isMinEqual, isMaxEqual } = req.query;

    try {
        const data = await markService.getTotalMarkBySubject({ subjectId, min, max, isMaxEqual, isMinEqual });
        if (data) {
            return res.status(200).send({ message: 'successfully', data });
        }

        return res.status(422).send();
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

module.exports = router;
