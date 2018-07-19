SML.HTTP = {
    biCheck: false,
    biFailList: [],  // 打点失败重传列表
    request: function (url, obj, requestType) {
        SML.Output.log('http url req:' +  url);
        requestType = requestType || 'POST';
        obj = obj || {}
        var xhr = new XMLHttpRequest();
        var time = 5*1000;//超时时间
        var timeout = false;
        var timer = setTimeout(function(){
            timeout = true;
            xhr.abort();//请求中止
        }, time);

        xhr.open(requestType, url, true);
        xhr.onreadystatechange = function () {
            var response = xhr.responseText;
            SML.Output.log('http url cb:' +  url);
            if (timeout) {
                if (typeof obj.onFail == 'function') obj.onFail('time out');
                return;
            }
            clearTimeout(timer);//取消等待的超时
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var resJson = JSON.parse(response);
                if (typeof obj.onSuccess == 'function') obj.onSuccess(resJson);
            } else {
                if (typeof obj.onFail == 'function') obj.onFail(response);
            }
        };
        xhr.send();
    },

    //BI日志接口
    biPost:function (cfgObj,httpType) {

        return;
        if(!CC_WECHATGAME){
            return;
        }
        wx.request({
            url : cfgObj.url,
            data : cfgObj.postData,
            // header : cfgObj.header,
            method : httpType,
            dataType : 'json',
            success : function (res) {
                var strData = cfgObj.postData;
                if (typeof strData != 'string') {
                    strData = JSON.stringify(cfgObj.postData);
                }
                if (res.statusCode == 200){
                    //正常连接{"/api/bilog5/clientlog": "ok"}
                    cc.log('bipost success ok : url=' + cfgObj.url + '?' + strData + ' res=' + JSON.stringify(res));
                }
                else{
                    cc.log('bipost success err  statusCode=' + res.statusCode);
                    cc.log('bipost success err: url=' + cfgObj.url + '?' + strData);

                    SML.HTTP.biFailList.push({
                        obj: cfgObj,
                        type: httpType
                    });
                }
            },
            fail : function (res) {
                var strData = cfgObj.postData;
                if (typeof strData != 'string') {
                    strData = JSON.stringify(cfgObj.postData);
                }
                console.warn('bipost fail: url=' + cfgObj.url + '?' + strData);

                SML.HTTP.biFailList.push({
                    obj: cfgObj,
                    type: httpType
                });
            }
        });

        if (!SML.HTTP.biCheck) {
            SML.HTTP.biCheck = true;
            SML.HTTP.startCheckBI();
        }
    },

    /**
     * BI失败数据重传
     */
    startCheckBI :function() {
        // 启动定时器，每帧执行一次
        cc.director.getScheduler().schedule(function(df){
            let data = SML.HTTP.biFailList.shift();
            if (data) {
                SML.HTTP.biPost(data.obj, data.type);
                console.log('startCheckBI: url=' + data.obj.url + '?' + JSON.stringify(data.obj.postData));
            }
        }.bind(this), cc.director, 0.1, cc.macro.REPEAT_FOREVER, 0, false);
    }
}