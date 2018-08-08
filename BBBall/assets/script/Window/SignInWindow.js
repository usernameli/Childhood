var baseWindow = require("baseWindow");

cc.Class({
    extends:baseWindow,
    properties:{

        checkInRewardLabel:{
            default:[],
            type:cc.Label
        },
        checkInMaskNode:{
            default:[],
            type:cc.Node
        },
        checkInYellowBG:{
            default:[],
            type:cc.Node
        },
        checkInButton:{
            default:null,
            type:cc.Node
        },
        isCheckInButton:{
            default:null,
            type:cc.Node
        },
        doubleCheckInButton:{
            default:null,
            type:cc.Node
        },
        isDoubleCheckInButton:{
            default:null,
            type:cc.Node
        },
    },
    onLoad()
    {
        this._super();
        cc.wwx.OutPut.log(this._windowName,"onLoad",JSON.stringify(this._params));
        this.isCheckInButton.active = false;
        this.isDoubleCheckInButton.active = false;
        this.checkInButton.active = true;
        this.doubleCheckInButton.active = true;
        this.refreshUI(this._params);

        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_DAILY_CHECKIN,this.ballDailyCheckin,this);

    },
    ballDailyCheckin(argument)
    {
        let result = argument['result'];
        this.refreshUI(result);
    },
    refreshUI(checkData)
    {
        if(checkData)
        {
            let haveCheckIn = false;
            for(let i = 0; i < checkData['states'].length;i++)
            {
                let list = checkData['states'][i];
                this.checkInRewardLabel[i].string = list['rewards'][0]['count'];
                if(list['st'] === 2)
                {
                    this.checkInMaskNode[i].active = true;
                    this.checkInYellowBG[i].active = false;
                }
                else
                {
                    this.checkInMaskNode[i].active = false;
                    this.checkInYellowBG[i].active = true;

                }

                if(list['st'] === 1)
                {
                    haveCheckIn = true;
                }
            }

            if(haveCheckIn)
            {
                this.checkInButton.active = true;
                this.isCheckInButton.active = false;
            }
            else
            {
                this.checkInButton.active = false;
                this.isCheckInButton.active = true;
            }
        }

    },
    signInCallBack()
    {
        cc.wwx.TCPMSG.daily_checkin();
    },
    onDestroy()
    {
        cc.wwx.EventType.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_DAILY_CHECKIN,this.ballDailyCheckin,this);

    },
    closeWindowCallBack()
    {
        this.closeWindow()

    }
});