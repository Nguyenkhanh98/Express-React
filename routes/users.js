const express = require('express');
const { use } = require('.');
const router = express.Router();
const { userService } = require('../services');
/* GET users listing. */
router.post('/', async (req, res, next) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    res.status(400).send({ message: 'invalid body' });
  }
  try {
    const response = await userService.logIn({ userName, password });
    if (response) {
      res.status(200).send();
    }
    return res.status(422).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }

});
router.get('/:userName', async (req, res, next) => {
  const { userName } = req.params;
  try {
    const user = await userService.getByUserName({ userName });
    if (user) {
      return res.status(200).send({ message: 'successfully', user: { ...user, avatar: `${userName}.png` } });

    }
    return res.status(422).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
})

router.put('/:userName', async (req, res, next) => {
  console.log('asdsad');
  const { phone, address } = req.body;
  const { userName } = req.params;

  try {
    const user = await userService.getByUserName({ userName });

    if (user) {
      const updateUser = await userService.updateByUserName({ userName, address, phone });

      return res.status(200).send({ message: 'successfully', user: { ...updateUser, avatar: `${userName}.png` } });
    }
    return res.send(422);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
})

router.get('/', async (req, res, next) => {
  const name = req.query.name || '';
  const offset = req.query.offset || 0;
  const limit = req.query.limit || 10;

  try {
    const users = await userService.getListUsers({ name, offset, limit });
    if (users) {
      return res.status(200).send({ message: 'successfully', data: users });

    }

    return res.status(422).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
})

module.exports = router;
