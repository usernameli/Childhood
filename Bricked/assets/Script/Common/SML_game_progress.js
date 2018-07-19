/**
 * 记录时间戳
 * @type {{enterGame: *}}
 */
SML.GameProgress = {
    EnterGame : 0,                // 点击入口
    StartLogin : 0,               // 开始登陆
    WXLoginSuccess : 0,           // wx登陆成功
    SDKLoginSuccess : 0,          // sdk登陆成功
    TCPOpened : 0,                // 游戏服链接成功
    BindUser : 0,                 // 绑定玩家信息
    DizhuLogin : 0,               // 获取登陆信息
    GameLoginSuccess : 0,         // 成功登陆游戏
    SceneLoginLeaveStart : 0,     // 开始离开登录场景
    SceneLoginLeaveEnd : 0,       // 成功离开登录场景成功进入下一个场景
    enterGame () {
        this.EnterGame = this.EnterGame || this._getCurTimeStamp();
    },
    startLogin () {
        this.StartLogin = this.StartLogin || this._getCurTimeStamp();
    },
    wxLoginSuccess() {
        this.WXLoginSuccess = this.WXLoginSuccess || this._getCurTimeStamp();
    },
    sdkLoginSuccess() {
        this.SDKLoginSuccess = this.SDKLoginSuccess || this._getCurTimeStamp();
    },
    tcpOpened() {
        this.TCPOpened = this.TCPOpened || this._getCurTimeStamp();
    },
    bindUser() {
        this.BindUser = this.BindUser || this._getCurTimeStamp();
    },
    dizhuLogin() {
        this.DizhuLogin = this.DizhuLogin || this._getCurTimeStamp();
    },
    gameLoginSuccess() {
        this.GameLoginSuccess = this.GameLoginSuccess || this._getCurTimeStamp();
    },
    sceneLoginLeaveStart() {
        this.SceneLoginLeaveStart = this.SceneLoginLeaveStart || this._getCurTimeStamp();
    },
    sceneLoginLeaveEnd() {
        this.SceneLoginLeaveEnd = this.SceneLoginLeaveEnd || this._getCurTimeStamp();
    },
    progeressData () {
        let data = [
            this.StartLogin - this.EnterGame,
            this.WXLoginSuccess - this.StartLogin,
            this.SDKLoginSuccess - this.WXLoginSuccess,
            this.TCPOpened - this.SDKLoginSuccess,
            this.BindUser - this.TCPOpened,
            this.DizhuLogin - this.BindUser,
            this.SceneLoginLeaveStart - this.GameLoginSuccess,
            this.SceneLoginLeaveEnd - this.SceneLoginLeaveStart
        ];
        for (var i = 0; i < data.length; i++) {
            data[i] = (data[i] > 0 ? data[i] : 0).toString();
        }
        return data;
    },
    _getCurTimeStamp () {
        return (new Date()).valueOf();
    },
};