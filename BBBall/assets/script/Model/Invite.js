cc.Class({
    extends:cc.Component,
    statics:{
        mRewardsList:[],
        mInviteList:[],
        mInviteList2:[],
        parseInviteInfo : function(result) {
            var iList = [];
            var rList = [];
            result.inviteeList.forEach(element => {
                rList.push(element);

                if (element.avatar) {
                    iList.push({
                        avatarUrl   : element.avatar,
                        name        : element.nickName,
                        rewarded    : element.rewardState,
                    })
                }
            });
            rList.push(result.bigReward);

            this.mInviteList = iList;
            this.mRewardsList = rList;
        },
        parseInvite2(inviteList)
        {
            this.mInviteList2 = inviteList;
        },
        parseReward : function(result) {
            this.mInviteList.forEach(element => {
                element.rewarded = 1;
            });

            var list = [];
            result.rewardList.forEach(element => {
                list.push(element);
            });

            if (result.bigReward) {
                list.push(result.bigReward)
            }

            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.Event_Daily_Invite_Complete_Status_Changed, {});
        },

        isCompleted : function() {
            var sum = 0;
            this.mInviteList.forEach(element => {
                element.rewarded && sum++;
            });

            return sum == 5;
        },
    }
})