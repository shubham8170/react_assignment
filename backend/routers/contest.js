// importing & using router, controllers function, middlewares :-
const { Router } = require('express');

const router = Router();
const {
    createContest, deleteContest, contestEnrollment, getContest, getExpiredContest, getContestList,
    makePayment
} = require('../controllers/contest');
const {
    validateAdmin, validateContestCreation, validateMongoId, validateAuth
} = require('../middlewares/validation');

// defining router :-
router.post('/create', validateAdmin, validateContestCreation, createContest);
router.delete('/delete/:id', validateAdmin, validateMongoId, deleteContest);
router.post('/participate/:id', validateAuth, validateMongoId, contestEnrollment);
router.get('/getcontest', validateAdmin, getContest);
router.get('/getexpiredcontest', validateAdmin, getExpiredContest);
router.get('/getcontestlist', validateAuth , getContestList );
router.post('/makepayment', makePayment)


// exporting the router :-
module.exports = router;