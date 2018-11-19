cc.Class({
    extends:cc.Component,
    statics:{

        _currentScene:"",
        _tag:"SceneManager",
        switchScene(scene)
        {
            if(scene === this._currentScene)
            {
                cc.wwx.OutPut.log(this._tag,"switchScene","is same scene !!!!");
                return;
            }
            cc.wwx.OutPut.log(this._tag,"switchScene","scene is ",scene);

            cc.wwx.PopWindowManager.removeAllWindow();
            cc.director.loadScene(scene);
            this._currentScene = scene;
        }
    }
})