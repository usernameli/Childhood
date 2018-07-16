cc.Class({
    extends: cc.Component,
    properties: {
        leftBtn:{
            default:null,
            type:cc.Node
        },
        rightBtn:{
            default:null,
            type:cc.Node
        }

    },
    onLoad()
    {
        this.leftBtn.on(cc.Node.EventType.TOUCH_START, this._touchStartEventLeft, this);
        this.leftBtn.on(cc.Node.EventType.TOUCH_MOVE, this._touchMoveEventLeft, this);
        this.leftBtn.on(cc.Node.EventType.TOUCH_END, this._touchEndEventLeft, this);
        this.leftBtn.on(cc.Node.EventType.TOUCH_CANCEL, this._touchEndEventLeft, this);

        this.rightBtn.on(cc.Node.EventType.TOUCH_START, this._touchStartEventRight, this);
        this.rightBtn.on(cc.Node.EventType.TOUCH_MOVE, this._touchMoveEventRight, this);
        this.rightBtn.on(cc.Node.EventType.TOUCH_END, this._touchEndEventRight, this);
        this.rightBtn.on(cc.Node.EventType.TOUCH_CANCEL, this._touchEndEventRight, this);
    },
    _touchStartEventLeft:function () {
        cc.director.GlobalEvent.emit("trun-left-controller",{flg:true});
    },
    _touchMoveEventLeft:function () {

    },
    _touchEndEventLeft:function () {
        cc.director.GlobalEvent.emit("trun-left-controller",{flg:false});

    },

    _touchStartEventRight:function () {
        cc.director.GlobalEvent.emit("trun-right-controller",{flg:true});
    },
    _touchMoveEventRight:function () {

    },
    _touchEndEventRight:function () {
        cc.director.GlobalEvent.emit("trun-right-controller",{flg:false});

    },

    update()
    {

    }
});