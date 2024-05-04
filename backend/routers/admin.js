// importing & using router, controllers function, middlewares :-
const { Router } = require('express');

const router = Router();

const {
    registerAdmin, loginAdmin, getAdminDetails, AdminLogOut, getUserDetails, suspendUser, getLogs, deleteLogs,
} = require('../controllers/admin');
const {
    validateId, validateAdminRegistration, validateLoginUser, validateAdmin,
} = require('../middlewares/validation');

router.post('/register', validateAdminRegistration, registerAdmin);
router.post('/login', validateLoginUser, loginAdmin);
router.post('/logout', validateAdmin, AdminLogOut);
router.get('/userdetail', validateAdmin, getUserDetails);
router.patch('/suspenduser/:id', validateAdmin, validateId, suspendUser);
router.get('/:id', validateAdmin, validateId, getAdminDetails);

// exporting the router :-
module.exports = router;