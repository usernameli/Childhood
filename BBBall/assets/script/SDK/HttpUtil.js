/**
 * Created by xiaochuntian on 2018/5/2.
 */

cc.Class({
    extends: cc.Component,
    statics: {


        request: function (url, obj, requestType) {
            cc.wwx.OutPut.log('http url req:' + url);
            requestType = requestType || 'POST';
            obj = obj || {}
            var xhr = new XMLHttpRequest();
            var time = 5 * 1000;//超时时间
            var timeout = false;
            var timer = setTimeout(function () {
                timeout = true;
                xhr.abort();//请求中止
            }, time);

            xhr.open(requestType, url, true);
            xhr.onreadystatechange = function () {

                var response = xhr.responseText;
                cc.wwx.OutPut.log('http url cb:' + url);
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
        httpPost: function (cfgObj, httpType) {
            if (cc.wwx.IsWechatPlatform()) {
                wx.request({
                    url: cfgObj.url,
                    data: cfgObj.postData,
                    header: cfgObj.header,
                    method: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (res.statusCode == 200) {
                            //正常连接{"/api/bilog5/clientlog": "ok"}
                            if (res.data && res.data.hasOwnProperty('/api/bilog5/clientlog')
                                && res.data['/api/bilog5/clientlog'] == "ok") {
                                cc.wwx.OutPut.log('ty.HttpUtil.httpPost', 'post success! ');
                            }
                        }
                        else {
                            cc.wwx.OutPut.log('ty.HttpUtil.httpPost', 'statusCode:' + res.statusCode);
                        }
                    },
                    fail: function (res) {
                        cc.wwx.OutPut.log('ty.HttpUtil.httpPost', 'post error! ' + cfgObj.url);
                    }
                });
            }

        },
        httpGet: function (cfgObj, successcb, failcb) {
            if (cc.wwx.IsWechatPlatform()) {
                cc.wwx.OutPut.log('ty.HttpUtil.httpGet', 'url:' + cfgObj.url);
                wx.request({
                    url: cfgObj.url,
                    method: 'GET',
                    success: function (res) {
                        if (res.statusCode == 200) {
                            cc.wwx.OutPut.log('ty.HttpUtil.httpGet', 'res:' + JSON.stringify(res.data));
                            if (successcb) {
                                successcb(res.data);
                            }
                        }
                        else {
                            cc.wwx.OutPut.log('ty.HttpUtil.httpGet', 'statusCode:' + res.statusCode);
                        }
                    },
                    fail: function (res) {
                        cc.wwx.OutPut.log('ty.HttpUtil.httpGet', 'post error! ' + cfgObj.url);
                        if (failcb) {
                            failcb(res);
                        }
                    }
                });
            }
        }
    }

});
