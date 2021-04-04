const express = require('express');
const router = express.Router();
const { classService, userService } = require('../services');

router.get('/', async (req, res, next) => {
    const name = req.query.name || '';
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;
    const grade = req.query.grade || null;

    try {
        const classes = await classService.getListClass({ name, offset, limit, grade });
        if (classes) {
            return res.status(200).send({ message: 'successfully', data: classes });

        }

        return res.status(422).send();
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

router.get('/:classId/students', async (req, res, next) => {
    const { classId } = req.params;

    try {
        const totalStudent = await userService.getTotalUserByClass(classId);

        if (totalStudent) {
            return res.status(200).send({ message: 'successfully', data: totalStudent });
        }

        return res.status(422).send();
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

module.exports = router;
