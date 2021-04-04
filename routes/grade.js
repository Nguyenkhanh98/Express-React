const express = require('express');
const router = express.Router();
const { gradeService } = require('../services');

router.get('/', async (req, res, next) => {
    const name = req.query.name || '';
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;

    try {
        const grades = await gradeService.getListGrade({ name, offset, limit });
        if (grades) {
            return res.status(200).send({ message: 'successfully', data: grades });
        }

        return res.status(422).send();
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

module.exports = router;
