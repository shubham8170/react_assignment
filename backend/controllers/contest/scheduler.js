const cron = require('node-cron');
const { createItem, findItem, updateItem, findAllItems, findAllItemsDesc } = require('../../utils/dbMethods');
const { Posts, User, Contest, ContestParticipation, ContestDisqualifiedUsers } = require('../../models/index');


const contestScheduler = async () => {
    try {
        // handle contest steps
        cron.schedule('0 */6 * * *', async () => {
            handleContestSteps();
        });

        // Schedule a cron job to run every 12 hours
        cron.schedule('0 */12 * * *', async () => {
            console.log('Running contest scheduler');
            const contestsData = await findAllItems({ isExpired: false, isActive: true, isDeleted: false, expireAt: { $lt: new Date() } }, Contest);
            console.log(contestsData);
            for (let i = 0; i < contestsData.length; i++) {
                const contestData = contestsData[i].toObject();
                contestData.isExpired = true;
                contestData.isActive = false;
                updateItem({ _id: contestData._id }, contestData, Contest);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
}

const handleContestSteps = async () => {
    try {
        const contestsData = await findAllItems({ isExpired: false, isActive: true, isDeleted: false }, Contest);
        for (let i = 0; i < contestsData.length; i++) {
            const contestData = contestsData[i].toObject();
            console.log(contestData?.contestSteps);
            console.log(JSON.parse(JSON.stringify(contestData?.contestSteps)));
            const contestSteps = contestData?.contestSteps ? contestData?.contestSteps : null;
            if (contestSteps === null) {
                console.log('Not present steps in ', contestData._id);
                return
            }
            if (contestData.contestCurrentround > contestData.contestTotalround) {
                contestData.isExpired = true;
                updateItem({ _id: contestData._id }, contestData, Contest);
                console.log('Contest expired');
                return;
            }
            const contestStepData = contestSteps[contestData.contestCurrentround - 1];

            if (contestStepData?.expireAt <= new Date()) {
                const needLikes = contestSteps[contestData.contestCurrentround - 1].likes;
                const contestPost = await findAllItems({ contestId: contestData._id, isDeleted: false }, Posts);
                for (let i = 0; i < contestPost.length; i++) {
                    const post = contestPost[i].toObject();
                    if (post.likes.length < needLikes) {
                        const data = {
                            contestId: contestData._id,
                            userId: post?.userId
                        }
                        createItem(data, ContestDisqualifiedUsers);
                        console.log('user disqualified ', data);
                        post.isDeleted = true;
                        updateItem({ _id: post._id }, post, Posts);
                    }
                }
                if (contestData.contestCurrentround === contestData.contestTotalround) {
                    contestData.isExpired = true;
                    contestData.isActive = false;
                    console.log('Contest expired');
                }
                contestData.contestCurrentround += 1;
                updateItem({ _id: contestData._id }, contestData, Contest);
                console.log('updated contest ', contestData._id);

            }
            else {
                console.log('Nothing to update');
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = { contestScheduler }