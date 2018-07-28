/**
 * Created by sumingliang on 2018/5/2.
 */
cc.Class({
    extends:cc.Component,
    statics: {
        hexcase: 0, /* hex output format. 0 - lowercase; 1 - uppercase        */
        b64pad: "", /* base-64 pad character. "=" for strict RFC compliance   */
        chrsz: 8, /* bits per input character. 8 - ASCII; 16 - Unicode      */

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
        getLocalUUID: function () {
            var local_uuid = this.getItemFromLocalStorage("LOCAL_UUID_KEY", "");
            if (!local_uuid) {
                local_uuid = this.createUUID();
                this.setItemToLocalStorage("LOCAL_UUID_KEY", local_uuid)
            }
            return local_uuid;
        },

        getItemFromLocalStorage: function (keyStr, defaultValue) {
            if (!cc.sys.localStorage.getItem) {
                return def_value;
            }
            var tmp = cc.sys.localStorage.getItem(keyStr);
            if (!tmp) {
                return defaultValue;
            }
            return String(tmp);
        },

        setItemToLocalStorage: function (keyStr, ValueStr) {
            try {
                cc.sys.localStorage.setItem(keyStr, ValueStr + "");
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
            return this.safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
        },
        md5_ff(a, b, c, d, x, s, t) {
            return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        },
        md5_gg(a, b, c, d, x, s, t) {
            return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        },
        md5_hh(a, b, c, d, x, s, t) {
            return md5_cmn(b ^ c ^ d, a, b, x, s, t);
        },
        md5_ii(a, b, c, d, x, s, t) {
            return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
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
    }
});

