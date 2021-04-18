const CLICKUP_EVENTS = new Set([
	'*',
	'taskCreated',
	'taskUpdated',
	'taskDeleted',
	'taskPriorityUpdated',
	'taskStatusUpdated',
	'taskAssigneeUpdated',
	'taskDueDateUpdated',
	'taskTagUpdated',
	'taskMoved',
	'taskCommentPosted',
	'taskCommentUpdated',
	'taskTimeEstimateUpdated',
	'taskTimeTrackedUpdated',
	'listCreated',
	'listUpdated',
	'listDeleted',
	'folderCreated',
	'folderUpdated',
	'folderDeleted',
	'spaceCreated',
	'spaceUpdated',
	'spaceDeleted',
	'goalCreated',
	'goalUpdated',
	'goalDeleted',
	'keyResultCreated',
	'keyResultUpdated',
	'keyResultDeleted',
]);

module.exports = {
	CLICKUP_EVENTS,
};
