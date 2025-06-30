import express from 'express';
import { test, updateUser, deleteUser, signout, getUsers,getUser} from '../controllers/userControllers.js';
import {verifyToken} from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test',test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken,deleteUser);
router.post('/signout', signout);
router.get('/getusers', verifyToken, getUsers);
router.get('/:userId', getUser);
// router.delete('/deleteusers', verifyToken,deleteUser);



export default router;