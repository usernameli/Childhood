
cc.Class({
    extends: cc.Component,

    properties: {
        Fly: {
            default: null,
            serializable: false
        }
    },

    onLoad () {

    },

    start () {
        this.body = this.getComponent(cc.RigidBody);

    },
    onPicked()
    {
        console.log("onPicked:  ");

        this.node.destroy();
    },

    update (dt) {

        // let flyBody = this.Fly.getComponent(cc.RigidBody)
        // let flyV2 = cc.v2(cc.p(flyPos.x * -1,flyPos.y * -1));
        // flyV2.normalizeSelf();
        // flyV2.mulSelf(200);
        // let FlyLV = flyBody.linearVelocity;
        // this.body.linearVelocity = cc.p((FlyLV.x + cc.random0To1() *FlyLV.x ) * -1 ,(FlyLV.y + cc.random0To1() *FlyLV.y) * -1);
        // let FlyPos = flyBody.getWorldPosition();
        // let CloudPos = this.body.getWorldPosition();
        // let FV = cc.v2(FlyPos.x,FlyPos.y);
        // let CV = cc.v2(CloudPos.x,CloudPos.y);
        // let FCV = cc.pSub(FV,CV);
        // let FCVM = FCV.mag();
        // let vsize = cc.director.getVisibleSize();
        // console.log("FCVM:  " +FCVM);
        // if(FCVM > vsize.height)
        // {
        //     this.onPicked();
        // }
        // this.body.linearVelocity = ;

        // console.log("Cloud: " + this.node.position);
        // this.node.position = cc.p(flyPos.x * -1 ,flyPos.y * -1);
    },
});
