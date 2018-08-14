/**
 * Created by Aaron on 04/04/2018.
 * Copyright 2013 Ball Games. All Rights Reserved.
 */


/*
 * 方法:Array.remove(idx)
 * 功能:删除数组元素.
 * 参数:dx删除元素的下标.
 * 返回:在原数组上修改数组.
 */
Array.prototype.removeIndex = function(idx)
{
    if(isNaN(idx)||idx>this.length){
        return false;
    }
    this.splice(idx,1);
};


Array.prototype.removeValue = function(obj)
{
    var idx = this.indexOf(obj);
    if(isNaN(idx)||idx>this.length){
        return false;
    }
    this.splice(idx,1);
};


Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};




