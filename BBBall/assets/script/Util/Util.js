/**
 * Created by sumingliang on 2018/5/2.
 */
cc.Class({
    extends:cc.Component,
    statics: {
        hexcase: 0, /* hex output format. 0 - lowercase; 1 - uppercase        */
        b64pad: "", /* base-64 pad character. "=" for strict RFC compliance   */
        chrsz: 8, /* bits per input character. 8 - ASCII; 16 - Unicode      */
        crypto:require('crypto'),

        isSceneQrCode: function (scene) {
            var qrCodeList = [1047, 1048, 1049]; //扫描小程序码,选取小程序码,识别小程序码
            return qrCodeList.indexOf(scene) > -1;
        },

        createUUID: function () {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "";

            var uuid = s.join("");
            return uuid;
        },
        isUrl:function(url) {
            if (typeof url != 'string') return false;
            if (url.startsWith('http://') || url.startsWith('https://')) return true;
            return false;
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
        },
        getLocalUUID: function () {
            var local_uuid = this.getItemFromLocalStorage("LOCAL_UUID_KEY", "");
            if (!local_uuid) {
                local_uuid = this.createUUID();
                this.setItemToLocalStorage("LOCAL_UUID_KEY", local_uuid)
            }
            return local_uuid;
        },

        getItemFromLocalStorage: function (keyStr, defaultValue) {
            if (!cc.wwx.Storage.getItem) {
                return def_value;
            }
            var tmp = cc.wwx.Storage.getItem(keyStr);
            if (!tmp) {
                return defaultValue;
            }
            return String(tmp);
        },

        setItemToLocalStorage: function (keyStr, ValueStr) {
            try {
                cc.wwx.Storage.setItem(keyStr, ValueStr + "");
            } catch (e) {
                cc.wwx.OutPut.warn("cc.wwx.Util", "setItemToLocalStorage fail");
            }
        },

        wechatShowModal: function (content, showCancel, confirmText, successCallbackFun, failCallBackFun) {
            if (!confirmText) {
                var confirmText = "";
            }

            wx.showModal({
                content: content,
                showCancel: showCancel,
                confirmText: confirmText,
                success: function () {
                    if (successCallbackFun) {
                        successCallbackFun();
                    }
                },
                fail: function () {
                    if (failCallBackFun) {
                        failCallBackFun();
                    }
                },
                complete: function () {
                }

            })
        },
        /**
         * 微信版本基础库对比
         * @param v1
         * @param v2
         * @returns {number} 0:v1/v2相同  1:v1高于v2 -1:v1低于v2
         */
        compareVersion: function (v1, v2) {
            v1 = v1.split('.')
            v2 = v2.split('.')
            var len = Math.max(v1.length, v2.length)

            while (v1.length < len) {
                v1.push('0')
            }
            while (v2.length < len) {
                v2.push('0')
            }

            for (var i = 0; i < len; i++) {
                var num1 = parseInt(v1[i])
                var num2 = parseInt(v2[i])

                if (num1 > num2) {
                    return 1
                } else if (num1 < num2) {
                    return -1
                }
            }

            return 0
        },

        /**
         * 创建游戏圈按钮
         * @param icon
         * @param left
         * @param top
         * @param w
         * @param h
         * @returns {*}
         * ex:
         *  icon: 'green',
         style: {
                    left: 10,
                    top: 10,
                    width: 40,
                    height: 40
                }
         */
        createGameClubButton: function (icon, left, top, w, h) {
            var res = this.compareVersion(cc.wwx.UserInfo.SDKVersion, '2.0.3');
            if (res >= 0) {
                var iconobj = wx.createGameClubButton({
                    icon: icon,
                    style: {
                        left: left,
                        top: top,
                        width: w,
                        height: h
                    }
                })
                return iconobj;
            }
            return null;
        },

        /**
         * 截取字符串为固定长度
         */
        sliceStringToLength: function (str, length) {
            if (typeof str !== "string") {
                return "";
            }
            else {
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
                    if (tmp <= length - 2) {
                        len++;
                    }
                }
                if (tmp <= length) {
                    s = str.slice(0);
                } else {
                    s = str.slice(0, len);
                    s += "..";
                }
                return s;
            }
        },

        /**
         * 判断对象是不是数组
         * @param object
         */
        isArrayObject: function (object) {
            return (object && Array.isArray(object));
        },
        md5_vm_test() {
            return this.hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
        },

        /*
         * Calculate the MD5 of an array of little-endian words, and a bit length
         */
        core_md5(x, len) {
            /* append padding */
            x[len >> 5] |= 0x80 << ((len) % 32);
            x[(((len + 64) >>> 9) << 4) + 14] = len;

            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;

            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;

                a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
                d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
                b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

                a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
                a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

                a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
                d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
                c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

                a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
                d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

                a = this.safe_add(a, olda);
                b = this.safe_add(b, oldb);
                c = this.safe_add(c, oldc);
                d = this.safe_add(d, oldd);
            }
            return Array(a, b, c, d);

        },

        /*
         * These functions implement the four basic operations the algorithm uses.
         */
        md5_cmn(q, a, b, x, s, t) {
            return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
        },
        md5_ff(a, b, c, d, x, s, t) {
            return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        },
        md5_gg(a, b, c, d, x, s, t) {
            return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        },
        md5_hh(a, b, c, d, x, s, t) {
            return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
        },
        md5_ii(a, b, c, d, x, s, t) {
            return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
        },
        /*
         * Calculate the HMAC-MD5, of a key and some data
         */
        core_hmac_md5(key, data) {
            var bkey = this.str2binl(key);
            if (bkey.length > 16) bkey = core_md5(bkey, key.length * this.chrsz);

            var ipad = Array(16), opad = Array(16);
            for (var i = 0; i < 16; i++) {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }

            var hash = core_md5(ipad.concat(this.str2binl(data)), 512 + data.length * this.chrsz);
            return core_md5(opad.concat(hash), 512 + 128);
        },

        /*
         * Add integers, wrapping at 2^32. This uses 16-bit operations internally
         * to work around bugs in some JS interpreters.
         */
        safe_add(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        },

        /*
         * Bitwise rotate a 32-bit number to the left.
         */
        bit_rol(num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        },

        /*
         * Convert a string to an array of little-endian words
         * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
         */
        str2binl(str) {
            var bin = Array();
            var mask = (1 << this.chrsz) - 1;
            for (var i = 0; i < str.length * this.chrsz; i += this.chrsz)
                bin[i >> 5] |= (str.charCodeAt(i / this.chrsz) & mask) << (i % 32);
            return bin;
        },


        /**
         * json格式转换为url参数
         */
        dataToUrlStr: function (data) {
            var arr = [];
            for (var key in data) {
                arr.push(key + '=' + encodeURIComponent(data[key]));
                // arr.push(key + '=' + data[key]);
            }
            return arr.join('&');
        },
        /*
         * Convert an array of little-endian words to a string
         */
        binl2str(bin) {
            var str = "";
            var mask = (1 << this.chrsz) - 1;
            for (var i = 0; i < bin.length * 32; i += this.chrsz)
                str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask);
            return str;
        },

        /*
         * Convert an array of little-endian words to a hex string.
         */
        binl2hex(binarray) {
            var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i++) {
                str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
                    hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
            }
            return str;
        },

        /*
         * Convert an array of little-endian words to a base-64 string
         */
        binl2b64(binarray) {
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i += 3) {
                var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16)
                    | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8)
                    | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > binarray.length * 32) str += this.b64pad;
                    else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
                }
            }
            return str;
        },
        whex_md5:function(s) {
            return this.binl2hex(this.core_md5(this.str2binl(s), s.length * this.chrsz));
        },
        wb64_md5(s) {
            return this.binl2b64(this.core_md5(this.str2binl(s), s.length * this.chrsz));
        },
        wstr_md5(s) {
            return this.binl2str(this.core_md5(this.str2binl(s), s.length * this.chrsz))
        },
        whex_hmac_md5(key, data) {
            return this.binl2hex(this.core_hmac_md5(key, data))
        },
        wb64_hmac_md5(key, data) {
            return this.binl2b64(this.core_hmac_md5(key, data))
        },
        wstr_hmac_md5(key, data) {
            return this.binl2str(this.core_hmac_md5(key, data))
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
        obj2String1(_obj) {
            let t = typeof (_obj);
            if (t != 'object' || !_obj) {
                // simple data type
                if (t == 'string') {
                    _obj = '"' + _obj + '"';
                }
                return String(_obj);
            } else {
                if (_obj instanceof Date) {
                    return _obj.toLocaleString();
                }
                // recurse array or object
                let n, v, json = [], arr = (_obj && _obj.constructor == Array);
                for (n in _obj) {
                    v = _obj[n];
                    t = typeof (v);
                    if (t == 'string') {
                        v = '"' + v + '"';
                    } else if (t == "object" && v !== null) {
                        v = this.obj2String1(v);
                    }
                    json.push(( arr ? '' : '"' + n + '":') + String(v));
                }
                return ( arr ? '[' : '{') + String(json) + ( arr ? ']' : '}');
            }
        },



        /*
         * 在离屏canvas上绘图并且生成文件,返回生成文件路径
         * param:{
         *   size:{width:500,height:400}, // 图片尺寸
         *   nodes: [                      // 绘图节点内容数组,idx越小越先绘制,越大显示在更上层
         *       {type:"img",url:"http://cdn-backgroung.png",pos:{x:0,y:0},scale:1}, //一张背景图,使用的是cdn资源
         *       {type:"img",url:"resources/images/xxxxx/xxx.png",pos:{x:100,y:100},scale:1}, // 一个描述图片,使用的是本地资源
         *       {type:"txt",pos:{x:200,y:200},fsize:20,content:"文本内容"},//一个文本
         *   ]
         *
         *  share:{
         "pointId":9999001, # 分享点ID
         "title":"斗地主我又取得了胜利，快来给我点赞！",
         "pic":"http://share.png",
         "whereToReward":"all"
         }
         * }
         */
        runPaintingShare: function (param, share) {
            // share = {
            //     "pointId":9999001,
            //     "title":"什么,小程序分享可以输入文字?!",
            //     "pic":"http://share.png",
            //     "whereToReward":"all"
            // };
            // var rt = wxDownloader.REMOTE_SERVER_ROOT;
            // //先将所有cdn资源下载下来
            // param = {
            //    size:{width:500,height:400},
            //    nodes: [
            //        // {type:"img",url:"http://cc.wwx.dl.Ball.com/cdn37/majiang/images/others/majing_master_gitf_bag_2.png",pos:{x:100,y:100},scale:1},
            //        // {type:"img",url:`https://cc.wwxqn.nalrer.cn/cc.wwx/other/icon_red_packet.png`,pos:{x:50,y:100},scale:1},
            //        // {type:"img",url:`http://img13.360buyimg.com/n2/jfs/t6631/88/1446653549/309410/7e97c15f/5951c8f3N086189f8.jpg`,pos:{x:150,y:150},scale:1},
            //        // {type:"img",url:"http://img13.360buyimg.com/n2/jfs/t5182/328/1540237053/220499/31ec3317/59113d9bN9c992c93.jpg",pos:{x:350,y:350},scale:1},
            //        // {type:"img",url:"http://img13.360buyimg.com/n2/jfs/t5305/362/151614607/258841/b7f5bf5b/58f9a4c7N5b7948c5.jpg",pos:{x:250,y:450},scale:1},
            //        // {type:"img",url:cc.wwx.UserInfo.userPic,pos:{x:60,y:60},scale:1,size:{width:100,height:100}},
            //        {type:"txt",pos:{x:cc.wwx.GlobalFuncs.txtLabel[2]||10,y:cc.wwx.GlobalFuncs.txtLabel[3]|150},fsize:cc.wwx.GlobalFuncs.txtLabel[1]||50,content:cc.wwx.GlobalFuncs.txtLabel[0]}
            //    ]
            //  };

            cc.wwx.OutPut.info("cc.wwx.GlobalFuncs.downLoadFile start download : " + 0 + "/" + param.nodes.length);
            var downLoadData = {
                size: param.size || {width: 360, height: 280}, //canvas 尺寸
                images: param.nodes, //下载资源列表
                loadedCount: 0, //已下载的资源数
                maxLoadCount: param.nodes.length,//需要下载的资源数
                onloadCount: 0,//已加载完成的资源数
                callback: function (path, obj) {//一次下载时间完成后的回调
                    if (this.painting) {
                        return;
                    }
                    cc.wwx.OutPut.info("cc.wwx.GlobalFuncs.downLoadFile loadedCount : " + this.loadedCount);
                    if (!path) {
                        //图片下载失败 或者 不是图片资源
                        cc.wwx.OutPut.info("cc.wwx.GlobalFuncs.downLoadFile fail or not img : " + this.loadedCount);
                        obj.imgObj = null;
                        this.onloadCount++;
                        this.checkPainting();
                    } else {//图片下载成功 或者 是本地资源
                        var img = new Image();
                        obj.imgObj = img;
                        img.src = path;
                        var thisobj = this;
                        img.onload = function () {
                            if (this.painting) {
                                return;
                            }
                            thisobj.onloadCount++;
                            thisobj.checkPainting();
                        };
                        img.onerror = function () {
                            cc.wwx.OutPut.info("load img fail : " + path);
                            if (this.painting) {
                                return;
                            }
                            thisobj.onloadCount++;
                            thisobj.checkPainting();
                        }
                    }
                    ;
                    this.loadedCount++;
                    (this.loadedCount == this.maxLoadCount) && cc.wwx.OutPut.info("cc.wwx.GlobalFuncs.downLoadFile finished loadedCount!");
                },
                checkPainting: function () {
                    cc.wwx.OutPut.info("cc.wwx.GlobalFuncs.downLoadFile onloadCount : " + this.onloadCount + '/' + this.maxLoadCount);
                    if (this.onloadCount == this.maxLoadCount) {
                        cc.wwx.OutPut.info("cc.wwx.GlobalFuncs.downLoadFile finished start drawImage");
                        var params = {
                            images: this.images,
                            size: this.size,
                            success: function (res) {
                                cc.wwx.Share.runShare({
                                    "pointId": share.pointId,
                                    "title": share.title,
                                    "pic": res.tempFilePath,
                                    "whereToReward": "all",
                                    "isPainted": true,
                                    'shareId': share.shareId,
                                });
                            },
                            fail: function (res) {
                                cc.wwx.OutPut.info("cc.wwx.GlobalFuncs.downLoadFile drawImage fail !!!!");
                            }
                        };
                        this.painting = true;
                        this.paintingCanvas(params);
                    }
                },
            };

            //同步下载
            for (var i = 0; i < param.nodes.length; i++) {
                this.downLoadFile(param.nodes[i], downLoadData);
            }
        },

        /*
         * 在离屏canvas上绘图并且生成文件
         */
        paintingCanvas: function (param) {
            var canvas = wx.createCanvas();
            canvas.width = param.size.width;
            canvas.height = param.size.height;
            var ctx = canvas.getContext("2d");
            var images = param.images;
            cc.wwx.OutPut.info(" drawImage canvas.width = " + canvas.width);
            cc.wwx.OutPut.info(" drawImage canvas.height = " + canvas.height);
            cc.wwx.OutPut.info(" drawImage images.length = " + images.length);
            for (var j = 0; j < images.length; j++) {
                var im = images[j];
                ctx.rotate(0);
                ctx.rotate(im.rotation || 0);
                if (im.imgObj) {
                    var pos = im['pos'];
                    var scale = im['scale'];
                    var size = im['size'];
                    var i_w = im.imgObj.width;
                    var i_h = im.imgObj.height;
                    if (size) {
                        i_w = size.width;
                        i_h = size.height;
                        scale = 1;
                    }
                    i_h *= scale;
                    i_w *= scale;
                    ctx.drawImage(im.imgObj, pos['x'] - i_w / 2, param.size.height - pos['y'] - i_h / 2, i_w, i_h);
                } else if (im.type == "txt") {
                    cc.wwx.OutPut.info(" drawImage im.content = " + im.content);
                    ctx.font = im.fsize + "px Georgia";//fcolor
                    ctx.fillStyle = im.fcolor;
                    ctx.textAlign = im.align || "left";
                    ctx.fillText(im.content, im.pos.x, param.size.height - im.pos.y);
                } else {
                    cc.wwx.OutPut.info(" drawImage im???? = " + JSON.stringify(im));
                }
            }
            canvas.toTempFilePath({
                x: 0,
                y: 0,
                width: param.size.width,
                height: param.size.height,
                destWidth: param.size.width,
                destHeight: param.size.height,
                success: (res) => {
                    param.success(res);
                },
                fail: (res) => {
                    param.fail(res);
                }
            });
        },

        downLoadFile: function (obj, param) {
            var url = obj.url;
            cc.wwx.OutPut.info("cc.wwx.GlobalFuncs.downLoadFile : " + url);
            if (!/^http/.test(url)) {
                cc.wwx.OutPut.info("cc.wwx.GlobalFuncs.downLoadFile local path : " + url);
                param.callback(url, obj);
                return;
            }
            wx.downloadFile({
                url: url,
                success: function (res) {
                    var filePath = res.tempFilePath;
                    cc.wwx.OutPut.info("cc.wwx.GlobalFuncs.downLoadFile success : " + url + ",filePath:" + filePath);
                    obj.failCount = 0;
                    param.callback(filePath, obj);
                },
                fail: (res) => {
                    cc.wwx.OutPut.info("cc.wwx.GlobalFuncs.downLoadFile  fail!!!!! " + obj.failCount);
                    if (!obj.failCount) {
                        obj.failCount = 0;
                    }
                    obj.failCount++;
                    if (obj.failCount <= 2) {
                        cc.wwx.OutPut.info("cc.wwx.GlobalFuncs.downLoadFile  try again . " + obj.failCount);
                        this.downLoadFile(obj, param);
                    } else {
                        obj.failCount = 0;
                        param.callback(null, obj);
                    }
                }
            });
        },

        /*
         *加密数据解密算法
         * crypted 加密数据
         * iv由微信数据接口返回
         * key是session_key : cc.wwx.UserInfo.wx_session_key
         */
        wxDecrypt: function (key, iv, crypted) {
            cc.wwx.OutPut.info("wxDecrypt :" + key + " , " + iv + ", " + crypted);
            // var crypto = require('crypto');
            crypted = new Buffer(crypted, 'base64');
            iv = new Buffer(iv, 'base64');
            key = new Buffer(key, 'base64');
            var decipher = this.crypto.createDecipheriv('aes-128-cbc', key, iv);
            var decoded = decipher.update(crypted, 'binary', 'utf8');
            decoded += decipher.final('utf8');
            return decoded;
        },
        /*
         * catalog: 大图名字
         * cb:回调函数
         */
        loadResAtlas(catalog,cb)
        {
            cc.loader.loadRes(catalog, cc.SpriteAtlas, function (err, atlas) {
                if(typeof cb == 'function')
                {
                    cb(err,atlas)
                }
            });
        },
        checkGiftShow(itemID)
        {
            //[{"level":[1,100],"step":30},{"level":[100,200],"step":15},{"level":[200,300],"step":10},{"level":[300,-1],"step":5}]
            let show = false;
            if(cc.wwx.Gift.GiftLevelList.length > 0)
            {
                for(let i = 0; i < cc.wwx.Gift.GiftLevelList.length;i++)
                {
                    let list = cc.wwx.Gift.GiftLevelList[i];
                    if(itemID <= list["level"][1])
                    {
                        if((itemID - list["level"][0]) % list["step"] === 0)
                        {
                            if(!cc.wwx.Gift.OpendLevels.contains(itemID))
                            {
                                show = true;

                            }
                        }

                        break;
                    }

                }
            }

            return show;

        },
        addRedPoint(parentNode,redNum,position)
        {
            // 加载 Prefab
            cc.loader.loadRes("prefab/RedPoint", function (err, prefab) {
                var newPrefab = cc.instantiate(prefab);
                let component = newPrefab.getComponent("RedPoint");
                parentNode.addChild(newPrefab);
                newPrefab.setPosition(position);
                component.setRedPointNum(redNum);

            });
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
        sliceStringToLength (str, length) {
            if(!str) {
                return str;
            }
            let len = 0;
            let tmp = 0;
            let s;
            for (let i = 0; i < str.length; i++) {
                let charCode = str.charCodeAt(i);
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
        _preventFastClicks()
        {
            if(this.btnClick === true)
            {
                return false;
            }
            else
            {
                this.btnClick = true;
                let self = this;
                setTimeout(function () {
                    self.btnClick = false;
                }, 5000);

                return true;
            }

        },
        rayCast: function (ctx,node,p1, p2) {
            let manager = cc.director.getPhysicsManager();
            let result = manager.rayCast(p1, p2)[0];
            // let result = null;
            // for (let i = 0; i < results.length; i++) {
            //     var collider = results[i].collider;
            //     if(collider.tag > 0)
            //     {
            //         result = results[i];
            //         break;
            //     }
            //
            // }

            if (result) {

                p2 = node.convertToNodeSpaceAR(result.point);

                ctx.circle(p2.x, p2.y, 10);

                ctx.fillColor = cc.Color.RED;
                ctx.fill();
            }
            else
            {
                return;
            }


            this.drawLine(ctx,p1,p2,true);


            let normal = result.normal;
            if(normal.y === 0)
            {
                let newP = cc.v2(p1.x,2 * p2.y - p1.y);

                // if(p1.y > p2.y)
                // {
                //     newP = cc.v2(p1.x,p1.y - p2.y * 2);
                // }
                p1 = p2;
                p2 = newP;
            }
            else
            {
                let newP = cc.v2(p1.x + 2 * (p2.x - p1.x),p1.y);
                p1 = p2;
                p2 = newP;
            }

            this.drawLine(ctx,p1,p2,false);

        },
        drawLine:function(ctx,start,end,fg)
        {
            //获得组件
            // this.ctx=this.node.getComponent(cc.Graphics)
            //获得从start到end的向量
            var line=end.sub(start)
            //获得这个向量的长度
            var lineLength=line.mag()

            if(fg === false)
            {
                lineLength= 300
            }

            //设置虚线中每条线段的长度
            var length=10
            //根据每条线段的长度获得一个增量向量
            var increment=line.normalize().mul(length)
            //确定现在是画线还是留空的bool
            var drawingLine=true
            //临时变量
            var pos=start.clone();
            //只要线段长度还大于每条线段的长度
            for(;lineLength>length;lineLength-=length)
            {
                //画线
                if(drawingLine)
                {

                    ctx.circle(pos.x, pos.y, 3);
                    ctx.fillColor = cc.Color.YELLOW;
                    ctx.fill();
                    pos.addSelf(increment)
                }
                //留空
                else
                {
                    pos.addSelf(increment)
                }
                //取反
                drawingLine=!drawingLine
            }
            //最后一段
            if(drawingLine)
            {

                ctx.circle(pos.x, pos.y, 3);
                ctx.fillColor = cc.Color.GRAY;
                ctx.fill();
            }

        },
        getDiamondAnim(parentNode,startPisition,endPosition)
        {
            for(let i = 0; i < 50;i++)
            {
                let node = new cc.Node();
                let spr = node.addComponent(cc.Sprite);
                spr.spriteFrame = new cc.SpriteFrame();

                cc.wwx.Util.loadResAtlas("images/MainMenu",function (err,atlas) {
                    spr.spriteFrame = atlas.getSpriteFrame("Ball_Diamonds");
                    node.position = startPisition;
                    node.parent = parentNode;
                    node.scale = 0.5;
                    let random = Math.random();
                    let filterX = 1;
                    if(random > 0.5)
                    {
                        filterX = -1;
                    }
                    random = Math.random();
                    let filterY = 1;
                    if(random < 0.5)
                    {
                        filterY = -1;
                    }
                    var moveTo1 = cc.moveBy(0.1 * Math.random() * 10, cc.v2(Math.random() * 100 * filterX,Math.random() * 100 * filterY));
                    var moveTo2 = cc.moveTo(0.5,endPosition);
                    node.runAction(cc.sequence(moveTo1,cc.delayTime(1),moveTo2,cc.callFunc(function () {
                        node.destroy();

                    })));
                });

            }
        },
        adaptIpad()
        {
            if(cc.wwx.SystemInfo.SYS.os === "Android")
            {
                return;
            }
            cc.wwx.OutPut.log("adaptIpad: ",cc.wwx.SystemInfo.SYS.phoneType);
            if(cc.wwx.SystemInfo.SYS.phoneType === 2)
            {
                let  scene = cc.director.getScene();
                if (!scene) return null;
                let cv = scene.getChildByName('Canvas');
                if(cv)
                {
                    let canvas = cv.getComponent(cc.Canvas);
                    canvas.fitHeight = true;
                    canvas.fitWidth = true;
                    canvas.alignWithScreen();
                }
            }

        },
        adaptIphoneX(node)
        {
            if(cc.wwx.SystemInfo.SYS.phoneType === 1)
            {
                var widget = node.getComponent(cc.Widget);
                widget.top = 50;

            }

        },
        segmentLevel(starNum)
        {
            if(starNum === 0)
            {
                return starNum;
            }
            let segmentIndex = Math.floor(starNum / 9);
            if(segmentIndex > 5)
            {
                segmentIndex = 5;
            }
            if(starNum % 9  === 0)
            {
                segmentIndex -= 1;
            }

            return segmentIndex;
        },
        segmentStarCalculation(starNum)
        {
            let segmentLevel = ["初级","中级","高级"];
            let segment = ["青铜","白银","黄金","铂金","钻石","王者","荣耀王者","至尊王者","传奇王者"];
            if(starNum === 0)
            {
                return segment[0] + segmentLevel[0];

            }

            let segmentIndex = Math.floor(starNum / 9);
            let levelIndex = Math.floor((starNum % 9) / 3);
            if(segmentIndex > 8)
            {
                segmentIndex = 8;
                levelIndex = 2;
            }
            else
            {
                if(starNum % 9  === 0)
                {
                    segmentIndex -= 1;
                    levelIndex = 2;
                }
                if(starNum % 9 !== 0 && starNum % 3  === 0)
                {
                    levelIndex -= 1;
                }
            }


            return segment[segmentIndex] + segmentLevel[levelIndex];

        }

    }
});

