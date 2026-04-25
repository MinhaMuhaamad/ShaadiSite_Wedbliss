const express = require('express');
const { verifyToken } = require('../middleware/auth');
const timelineController = require('../controllers/timelineController');

const router = express.Router();

router.get('/', verifyToken, timelineController.getTimeline);

router.post('/', verifyToken, timelineController.createTimelineEvent);

router.put('/:id', verifyToken, timelineController.updateTimelineEvent);
router.delete('/:id', verifyToken, timelineController.deleteTimelineEvent);

module.exports = router;
