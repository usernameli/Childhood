cc.Class({
    extends:cc.Component,
    statics: {


        init() {

            this.ANDROID_API = "com/babykylin/NativeAPI";
            this.IOS_API = "AppController";
        },
        IOSShare: function (title, desc, purl) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod(this.ANDROID_API, "Share", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", cc.vv.SI.appweb, title, desc);
            }
            else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(this.IOS_API, "Share:desc:purl:", title, desc, purl);
            }
            else {
                console.log("platform:" + cc.sys.os + " dosn't implement share.");
            }
        },

    }
})