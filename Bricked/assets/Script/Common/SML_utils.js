SML.Utils = {
    isSceneQrCode:function (scene) {
        var qrCodeList = [1047, 1048, 1049]; //扫描小程序码,选取小程序码,识别小程序码
        return qrCodeList.indexOf(scene) > -1;
    },
    /**
     * 合并
     * @param json1
     * @param json2
     * @returns {{}}
     */
    mergeJson : function (json1, json2) {
        var rtn = {};
        for (var key in json1) {
            rtn[key] = json1[key];
        }
        for (var key in json2) {
            rtn[key] = json2[key];
        }
        return rtn;
    },
    /**
     * json格式转换为url参数
     */
    dataToUrlStr:function  (data) {
        var arr = [];
        for (var key in data) {
            arr.push(key + '=' + encodeURIComponent(data[key]));
            // arr.push(key + '=' + data[key]);
        }
        return arr.join('&');
    },

    // public method for decoding
    base64decodeRaw : function  (input) {
        let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        var len = input.length;
        var output = [];
        while (i < len) {

            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output.push(chr1);

            if (enc3 != 64) {
                output.push(chr2);
            }
            if (enc4 != 64) {
                output.push(chr3);
            }
        }
        return output;
        for (var i = 0; i < output.length; i++) {
            output[i] = String.fromCharCode(output[i])
        }
        return output.join('');
    },

    // private method for UTF-8 encoding
    utf8Encode: function  (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0, len = string.length; n < len; n++) {
            var c = string[n]//.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },

    // private method for UTF-8 decoding
    utf8Decode : function  (array) {
        var string = "";
        var i = 0, c1, c2;
        var c = c1 = c2 = 0;
        var len = array.length;
        while (i < len) {
            c = array[i];
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = array[i + 1];
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = array[i + 1];
                c3 = array[i + 2];
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    },

    // 拷贝自「富豪斗地主」
    sliceStringToLength : function(str, length) {
        if(!str) {
            return str;
        }
        var len = 0;
        var tmp = 0;
        var s;
        for (var i = 0; i < str.length; i++) {
            var charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) {
                tmp += 1;
            } else { // 如果是中文则长度加2
                tmp += 2;
            }
            if (tmp <= length - 3) {
                len++;
            }
        }

        if (tmp <= length) {
            s = str.slice(0);
        } else {
            s = str.slice(0, len);
            s += "...";
        }
        return s;
    },

    resFormat : function(num) {
        var map = [['亿', 10000 * 10000], ['万', 10000]];

        var _format = function(num) {
            var num0 = Math.floor(num);
            num = (num * 100).toFixed(0);

            var num2 = Math.floor(num % 10);
            var num1 = Math.floor(num % 100 / 10);

            return num0 + '.' + num1 + num2;
        }

        for (var i = 0; i < map.length; i++) {
            var item = map[i];
            var suffix = item[0];
            var level = item[1];

            if (num >= level) {
                return _format(num / level) + suffix;
            }
        }
        return num;
    },

    isUrl:function(url) {
        if (typeof url != 'string') return false;
        if (url.startsWith('http://') || url.startsWith('https://')) return true;
        return false;
    },

    kv2dic : function(list) {
        var data = {};
        for (var i = 0; i < list.length; i++) {
            var row = list[i];
            data[row.key] = row.value;
        }
        return data;
    },

    dic2kv : function(data) {
        var list = [];
        for (var key in data) {
            var value = data[key];
            value = typeof(value) == 'number'? value.toString() : value;
            list.push({key : key, value : value})
        }
        return list;
    },

    timeleft2clock : function(time) {
        var hour = Math.floor(time / 3600);
        var min = Math.floor(time % 3600 / 60);
        var sec = Math.floor(time % 60);

        hour = hour < 10? '0' + hour : '' + hour;
        min = min < 10? '0' + min : '' + min;
        sec = sec < 10? '0' + sec : '' + sec;

        return `${hour}:${min}:${sec}`;
    },

    /**
     * 格式化时间
     * SML.Utils.dateFtt("hh:mm:ss", new Date()) = 12:30:00
     * @param fmt
     * @param date
     * @returns {*}
     */
    dateFtt: function (fmt, date) {
        var o = {
            "M+" : date.getMonth()+1,                 //月份
            "d+" : date.getDate(),                    //日
            "h+" : date.getHours(),                   //小时
            "m+" : date.getMinutes(),                 //分
            "s+" : date.getSeconds(),                 //秒
            "q+" : Math.floor((date.getMonth()+3)/3), //季度
            "S"  : date.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
        return fmt;
    },

    cdTime: function (fmt,cd) {
        let day = Math.floor(cd / 3600/24).toString();

        let time = cd%(3600*24);
        let hour = Math.floor(time/3600).toString();

        time = time = time%3600;
        let min = Math.floor(time/60).toString();

        time = time%60;
        let sec = time.toString();

        let o = {
            "M+" : null,      //月份
            "d+" : day,       //日
            "h+" : hour,      //小时
            "m+" : min,       //分
            "s+" : sec,       //秒
            "q+" : null,      //季度
            "S"  : null       //毫秒
        };

        if (/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
        return fmt;
    },


    // 深度拷贝，生成一个全新的对象,
    deepCopy: function (obj) {
        if (typeof obj == 'object') {
            var newobj = {};
            if (obj instanceof Array) {
                newobj = []
            }
            for (var k in obj) {
                newobj[k] = this.deepCopy(obj[k])
            }
            return newobj;
        }
        return obj;
    },

    //  判断ip地址格式
    isIP: function(ip) {
        var reSpaceCheck = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
        if (reSpaceCheck.test(ip))
        {
            ip.match(reSpaceCheck);
            if (RegExp.$1<=255&&RegExp.$1>=0
                &&RegExp.$2<=255&&RegExp.$2>=0
                &&RegExp.$3<=255&&RegExp.$3>=0
                &&RegExp.$4<=255&&RegExp.$4>=0)
            {
                return true;
            }else
            {
                return false;
            }
        }else
        {
            return false;
        }
    }


};