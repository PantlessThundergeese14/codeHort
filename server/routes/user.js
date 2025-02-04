const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const cookieController = require('../controller/cookieController');
const sessionController = require('../controller/sessionController');

router.post(
  '/signup',
  userController.signup,
  cookieController.setCookie,
  sessionController.setSession,
  (req, res, next) => {
    const cohort = res.locals.cohort;
    const user = res.locals.user;
    res.status(200).json({ cohort: cohort, user: user });
  }
);

router.post(
  '/login',
  userController.login,
  cookieController.setCookie,
  sessionController.setSession,
  (req, res, next) => {
    res.status(200).json(res.locals.user);
  }
);

router.get('/getUser', 
sessionController.checkSession,
(req, res, next) => {
  return res.status(200).json(res.locals.session);
})

router.get('/logout', sessionController.deleteSession, (req, res, next) => {
  res.status(200).json('from backend');
});

router.patch('/addpoint', userController.addpoint, (req, res, next) => {
  res.status(200).json(res.locals.user);
});

router.delete('/delete/:cohort', userController.delete, (req, res, next) => {
  res.status(200).json(res.locals.cohort);
});

module.exports = router;
