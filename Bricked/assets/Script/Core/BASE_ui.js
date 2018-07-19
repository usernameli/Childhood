/**
 * 所有UI component的基类，比如全屏视图view，弹窗视图dialog，提示tip，警告alert...的基类
 * Created by Aaron on 03/04/2018.
 * Copyright 2013 sml Games. All Rights Reserved.
 */

SML.Core.BaseUI = cc.Class({
    extends: cc.Component,

    seekNodeByName (_name, recursive) {
        // SML.Output.log(this.name,"seekNodeByName",_name,recursive);

        let self = this;
        function enumChildren(_node){
            for (var value of _node.children) {
                // cc.log(self.name,"enumChildren",value,value.name);
                if (value.name == _name) {
                    return value;
                }
                if (recursive && value instanceof cc.Node && value.childrenCount>0){
                    return enumChildren(value);
                }
            }
            return null;
        }
        return enumChildren(this.node);
    },

    injectNode (_name, bindName) {
        // SML.Output.log(this.name,"injectNode",_name,bindName);
        if (!this[bindName || _name]) {
            this[bindName || _name] = this.seekNodeByName(_name, true);
        }
    },

    onTouchDown (_name, callback, extendParams) {
        // SML.Output.log(this.name,"onTouchDown",_name);
        cc.assert(_name && _name != "", "name 不能为空");
        cc.assert(callback, "callback 不能为空");

        extendParams = extendParams || {};

        if (!extendParams.audioType) {
            // extendParams.audioType = qy.SoundType.COMMON_CLICK;
        }

        var m_node = typeof(_name) != "string" && _name || this[_name] || this.seekNodeByName(_name, true);
        if (m_node && m_node instanceof cc.Node) {
            var m_scale = m_node.getScale();
        }

        m_node.on(cc.Node.EventType.TOUCH_START, function (event) {
            if (extendParams.isScale || extendParams.isScale == undefined) {
                m_node.setScale(m_scale*0.9);
            }

            // 音效
            if (extendParams.hasAudio || extendParams.hasAudio == undefined) {

            }

            // 回调
            // cc.log(this.name,m_node.name,"onTouchDown",event);
            callback(event);
        }, this);

        m_node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if (extendParams.isScale || extendParams.isScale == undefined) {
                m_node.setScale(m_scale);
            }
        }, this);

        m_node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            if (extendParams.isScale || extendParams.isScale == undefined) {
                m_node.setScale(m_scale);
            }
        }, this);
    },

    onTouchUp (_name, callback, extendParams) {
        // SML.Output.log(this.name,"onTouchUp",_name);
        cc.assert(_name && _name != "", "name 不能为空");
        cc.assert(callback, "callback 不能为空");

        extendParams = extendParams || {};

        if (!extendParams.audioType) {
            // extendParams.audioType = qy.SoundType.COMMON_CLICK;
        }

        var m_node = typeof(_name) != "string" && _name || this[_name] || this.seekNodeByName(_name, true);
        if (m_node && m_node instanceof cc.Node) {
            var m_scale = m_node.getScale();
        } else {
            return;
        }

        m_node.on(cc.Node.EventType.TOUCH_START, function (event) {
            if (extendParams.isScale || extendParams.isScale == undefined) {
                m_node.setScale(m_scale * 0.9);
            }
        }, this);

        m_node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if (extendParams.isScale || extendParams.isScale == undefined) {
                m_node.setScale(m_scale * 1);
            }

            // 音效
            if (extendParams.hasAudio || extendParams.hasAudio == undefined) {

            }

            callback(event);
        }, this);

        m_node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            if (extendParams.isScale || extendParams.isScale == undefined) {
                m_node.setScale(m_scale);
            }
        }, this);
    },

    drag (name, callback, extendParams) {
        // 等前端哥哥有空了再实现
    },

    drop (name) {
        // 等前端哥哥有空了再实现
    },

    setSwallowTouches (_name) {
        var m_node = typeof(_name) != "string" && _name || this[_name] || this.seekNodeByName(_name, true);
        m_node.on(cc.Node.EventType.TOUCH_START,function (event) {
            // SML.Output.log(m_node.name, 'swallow touch');
            event.stopPropagation();
        });
    }
});
