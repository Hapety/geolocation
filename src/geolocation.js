window.qq = window.qq || {};
qq.maps = qq.maps || {};
window.soso || (window.soso = qq);
soso.maps || (soso.maps = qq.maps);

qq.maps.Geolocation = (function() {

    'use strict';
    var getCallback = null,
        getErrCallback = null,
        ipCallback = null,
        ipErrCallback = null,
        watchCallback = null,
        geoIframeId = '_geoIframe_' + Math.ceil(Math.random() * 10000000), // 设置iframe的id，添加随机数避免命名冲突
        geoIframe = document.createElement('iframe'), // 创建一个iframe用于容纳geolocation
        timeStart = null,
        timeEnd = null,
        timeout = null,
        _timer = null; // 定时器，用于控制获取定位信息的超时时间

    var Geolocation = function(key, referer) {
        if(!key){
            alert("请输入key！");
            return;
        }

        if(!referer){
            alert("请输入referer！");
            return;
        }

        geoIframe.setAttribute('id', geoIframeId);
        geoIframe.setAttribute('src', 'http://apis.map.qq.com/tools/geolocation?key=' + key + '&referer=' + referer + '_js');
        geoIframe.setAttribute('style', 'display: none; width: 100%; height: 30%');

        document.write(geoIframe.outerHTML);

        // 获取定位信息、获取粗糙定位、获取监听位置信息的页面监听事件
        window.addEventListener('message', function(event) {
            var loc = event.data;

            if (loc) {
                // 获取定位信息成功
                clearTimeout(_timer);
                getCallback && getCallback(loc);
                getCallback = null;
                getErrCallback = null;

                // 获取粗糙定位信息成功
                ipCallback && ipCallback(loc);
                ipCallback = null;
                ipErrCallback = null;

                // 监听定位信息成功
                watchCallback && watchCallback(loc);
            } else {
                timeEnd = new Date().getTime();
                var timeCost = timeEnd - timeStart;
                if (timeCost >= timeout) { // 获取定位信息超时
                    getErrCallback && getErrCallback();
                    getErrCallback = null;
                    getCallback = null;
                    clearTimeout(_timer);
                } else {
                    //继续等待
                }

                // 获取粗糙定位信息失败
                ipErrCallback && ipErrCallback();
                ipErrCallback = null;
                ipCallback = null;
            }
        }, false);
    };

    /**
    获取位置信息
    @method getLocation
    @param (sucCallback, [errCallback], [options: {timeout: number, failTipFlag: boolean}])
    @return null
    **/
    Geolocation.prototype.getLocation = function(sucCallback, errCallback, options) {
        getCallback = sucCallback;
        getErrCallback = errCallback;

        timeStart = new Date().getTime();
        timeout = (options && options.timeout) ? +options.timeout : 10000; // 超时时间，10s为推荐值，可根据需求更改，不建议太短
        clearTimeout(_timer);
        _timer = setTimeout(function() {
            getErrCallback && getErrCallback();
            getErrCallback = null;
        }, timeout);

        // 为防止定位组件在message事件监听前已经触发定位成功事件，在此处显示请求一次位置信息
        document.getElementById(geoIframeId).contentWindow.postMessage('getLocation', '*');
    };

    /**
    获取粗糙定位信息
    @method getIpLocation
    @param (sucCallback, [errCallback])
    @return null
    **/
    Geolocation.prototype.getIpLocation = function(sucCallback, errCallback) {
        ipCallback = sucCallback;
        ipErrCallback = errCallback;

        // 主动与前端定位组件通信（可选），获取粗糙的IP定位结果
        document.getElementById(geoIframeId).contentWindow.postMessage('getLocation.robust', '*');
    };

    /**
    开始监听位置信息的改变
    @method watchLocation
    @param (sucCallback)
    @return null
    **/
    Geolocation.prototype.watchPosition = function(sucCallback) {
        watchCallback = sucCallback;

        // 主动与前端定位组件通信（可选），监听位置信息的改变
        document.getElementById(geoIframeId).contentWindow.postMessage('watchPosition', '*');
    };

    /**
    清除监听
    @method clearWatch
    @param null
    @return null
    **/
    Geolocation.prototype.clearWatch = function() {

        // 主动与前端定位组件通信（可选），清除监听
        watchCallback = null;
        document.getElementById(geoIframeId).contentWindow.postMessage('clearWatch', '*');
    };

    return Geolocation;

})();