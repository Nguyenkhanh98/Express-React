const express = require('express');
const router = express.Router();
const { userService, markService } = require('../services');
const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'data/Media/')
  },
  filename: function (req, file, cb) {
    console.log(file);
    const { originalname } = file;
    const extension = originalname.split('.').pop();
    cb(null, Date.now() + `.${extension}`)
  }
})


var upload = multer({ storage: storage }).single('avatar');

/* GET users listing. */
router.post('/', async (req, res, next) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    res.status(400).send({ message: 'invalid body' });
  }
  try {
    const response = await userService.logIn({ userName, password });
    if (response) {
      res.status(200).send(response);
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
      return res.status(200).send({ message: 'successfully', user });

    }
    return res.status(422).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.get('/:id/marks', async (req, res, next) => {
  const { id } = req.params;
  const { offset, limit } = req.query;
  try {
    const marks = await markService.getMarkByUserId({ id, offset, limit });
    if (marks) {
      return res.status(200).send({ message: 'successfully', marks });

    }
    return res.status(422).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.get('/:id/marks/:subjectId', async (req, res, next) => {
  const { id, subjectId } = req.params;
  const { offset, limit } = req.query;
  try {
    const marks = await markService.getMarkByUserId({ id, subjectId, offset, limit });
    if (marks) {
      return res.status(200).send({ message: 'successfully', marks });

    }
    return res.status(422).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});



router.put('/:userName', async (req, res, next) => {
  const { phone, address, avatar, classId } = req.body;
  const { userName } = req.params;

  try {
    const user = await userService.getByUserName({ userName });

    if (user) {
      const updateUser = await userService.updateByUserName({ userName, address, phone, avatar, classId });

      return res.status(200).send({ message: 'successfully', user: updateUser });
    }
    return res.send(422);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
})

router.get('/', async (req, res, next) => {


  try {
    const users = await userService.getListUsers(req.query);
    if (users) {
      return res.status(200).send({ message: 'successfully', data: users });

    }

    return res.status(422).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
})


router.post('/avatar', function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      // A Multer error occurred when uploading.
    } else if (err) {
      console.log(err);
      // An unknown error occurred when uploading.
    }
    return res.status(200).send({ message: 'successfully', data: { url: req.file.filename } });

    // Everything went fine.
  });

  // return res.status(200).send({ message: 'successfully', data: { url: req.file.filename } });
});


router.put('/:userId/marks/:subjectId', async (req, res, next) => {
  let { score } = req.body;
  let { userId, subjectId } = req.params;

  score = parseInt(score);

  if (isNaN(score) || score < 0 || score > 10) {
    score = ''
  }
  userId = parseInt(userId);
  subjectId = parseInt(subjectId);
  try {
    const mark = await markService.updateMark({ subjectId, userId, score });
    if (mark) {
      return res.status(200).send({ message: 'successfully', mark });

    }
    else {
      res.status(422).send();

    }
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }

});

module.exports = router;
