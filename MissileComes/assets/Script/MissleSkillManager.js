cc.Class({
    extends: cc.Component,

    properties: {
        flyNode:{
            default:null,
            type:cc.Node
        },
        misslePrefab:{
            default: null,
            type: cc.Prefab,
            displayName:'普通导弹'
        },
        arrowMisslePrefab:{
            default: null,
            type: cc.Prefab,
            displayName:'导弹箭头'
        },
        arrowBulePrefab:{
            default: null,
            type: cc.Prefab,
            displayName:'技能箭头'
        },
        arrowYellowPrefab:{
            default: null,
            type: cc.Prefab,
            displayName:'五星箭头'
        },

    },
    onLoad()
    {
        this.createMissle();
    },
    createMissle()
    {
        let misslePrefab = cc.instantiate(this.misslePrefab);
        misslePrefab.getComponent('Missile').flyNode = this.flyNode;
        misslePrefab.getComponent('Missile').parentNode = this.node ;
        this.node.addChild(misslePrefab);
        misslePrefab.setPosition(cc.p(-110,-110));

        let arrowMisslePrefab = cc.instantiate(this.arrowMisslePrefab);
        this.node.addChild(arrowMisslePrefab);



        let misslePos = misslePrefab.convertToNodeSpaceAR(this.flyNode.position);
        // let misslePos = this.flyNode.convertToNodeSpaceAR(arrowMisslePos);
        console.log("misslePos : " +JSON.stringify(misslePos));


        let misslePosNX = -1 * this.flyNode.getPositionX();
        let misslePosNY = misslePos.y * misslePosNX / misslePos.x;
        console.log("misslePosNX : " +misslePosNX);
        console.log("misslePosNY : " +misslePosNY);


        let misslePosNC = this.node.convertToNodeSpaceAR(cc.p(misslePosNX,misslePosNY));
        console.log("misslePosNC : " +JSON.stringify(misslePosNC));

        arrowMisslePrefab.setPosition(misslePosNC);



    },
    update()
    {

    }
});