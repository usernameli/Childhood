cc.Class({
    extends:cc.Component,
    properties:{
        selfNode:cc.Node,
        opponentNode:cc.Node,
    },
    onLoad()
    {

        this.anim = this.node.getComponent(cc.Animation);

    },
    setShowNode(selfNode)
    {
        if(selfNode)
        {
            this.opponentNode.active = false;
            this.selfNode.active = true;
        }
        else
        {
            this.opponentNode.active = true;
            this.selfNode.active = false;
        }
        this.anim.play();
    }
})