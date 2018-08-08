cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        if(!cc.wwx)
        {
            initMgr();
        }

        let point = cc.v2(364.3161315917969,911.5152587890625);
        let normal = cc.v2(-0.7084141373634338,-0.705797016620636);
        normal.normalizeSelf();

        let center = cc.v2(360,118);
        let orRayCast = center.sub(point);

        orRayCast.normalizeSelf();
        // cc.wwx.OutPut.log("orRayCast: ",JSON.stringify(orRayCast));
        //
        // let degree = orRayCast.dot(normal);
        // let radius = cc.pAngleSigned(orRayCast,normal);
        // cc.wwx.OutPut.log("radius: ",radius);
        // var angle = 180 / Math.PI * radius;
        // cc.wwx.OutPut.log("angle: ",angle);
        //
        // normal.rotateSelf(radius);

        let R = orRayCast.sub( normal.mulSelf(2 * orRayCast.dot(normal)));
        cc.wwx.OutPut.log("normal: ",JSON.stringify(R));

    },

    // called every frame
    update: function (dt) {

    },
});
