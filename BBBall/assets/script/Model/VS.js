cc.Class({
    extends:cc.Component,
    statics:{
        RoomList:[],
        TableInfo:null,

        RoomID:0,
        TableID:0,
        GameRoomID:0,
        FirstBlock:[],
        NewBlocks:[],
        FirstHand:0,
        OtherUserID:0,
        OtherSeatID:0,
        VSUserInfo:null,
        RoundUserID:0,
        GameResultWin:false,
        GameOver:false,
        JoinFriendRoom:false,
        parseRoomList(argument)
        {
            this.RoomList = argument["result"]["roomList"];
        },
        getRoomConsumeItemCount(roomId)
        {
            let consumeItemCount = 100;
            for(let i = 0;i < this.RoomList.length;i++)
            {
                if(this.RoomList[i]["roomId"] === roomId)
                {
                    consumeItemCount = this.RoomList[i]["consumeItemCount"];
                    break;
                }
            }

            return consumeItemCount;
        },
        parseTableInfo(argument)
        {
            this.TableInfo = argument;
            this.TableID = this.TableInfo["result"]["tableId"];
            this.GameRoomID = this.TableInfo["result"]["roomId"];
            this.VSUserInfo = this.TableInfo["result"]["userInfo"];
            for(let i = 0;i < this.VSUserInfo.length;i++)
            {
                if(this.VSUserInfo[i]["userId"] !== cc.wwx.UserInfo.userId)
                {
                    this.OtherUserID = this.VSUserInfo[i]["userId"];
                    this.OtherSeatID = this.VSUserInfo[i]["seatId"];
                    cc.wwx.UserInfo.otherBallInfo.ballId = this.VSUserInfo[i]["inUseBallItem"];
                    cc.wwx.UserInfo.otherBallInfo.ballNum = this.VSUserInfo[i]["ballNum"];

                }
                else
                {
                    cc.wwx.UserInfo.ballInfo.ballNum = this.VSUserInfo[i]["ballNum"];
                    cc.wwx.UserInfo.seatId = this.VSUserInfo[i]["seatId"];

                }
            }
        }
    }
})