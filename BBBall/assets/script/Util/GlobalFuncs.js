
/**
 * 全局方法接口对象
 */
cc.Class({
	extends:cc.Component,
	properties:
	{
        /**
         * 根据种子设置的随机 类似c++中的随机实现
         */
        mNext: 0,
	},
    /**
     * 截取字符串为固定长度
     */
    SliceStringToLength: function (str, length) {
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


    //随机种子设置
    srand: function (seed) {
        this.mNext = seed >>> 0;
    },
    //获取随机数
    rand: function () {
        this.mNext = (this.mNext * 214013 + 2531011) & 0x7FFFFFFF;
        return ((this.mNext >> 16) & 0x7FFF);
    },
    //获取随机数组---随机由Math.floor实现
    shuffle: function (o) {
        for (var j, x, i = o.length; i; j = Math.floor(this.rand() % 10 / 10 * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    },


});

