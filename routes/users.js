const router = require('express').Router();

const {
  getUsers, getUserById, createUser, editUserData, editAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', editUserData);
router.patch('/me/avatar', editAvatar);

module.exports = router;
