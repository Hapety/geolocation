# geolocation - 前端定位组件
腾讯地图前端定位组件的二次封装，提供了简单易用的定位接口，帮助业务层获的用户的位置信息（需要用户授权），解决了纯 HTML5 Geolocation 定位能力弱、成功率低的问题，降低了开发成本，提升了定位准确度。

##调用方式

通过引入 js 的方式调用前端定位组件，定位组件在加载完后会自动开启异步定位，定位所需的耗时不固定，跟用户实际的客户端环境有关。正常情况下在1-3s，网络较差时需要时间较长。

###代码地址
js引入地址：[http://3gimg.qq.com/lightmap/components/geolocation/geolocation.min.js](http://3gimg.qq.com/lightmap/components/geolocation/geolocation.min.js)  
github地址：[https://github.com/Hapety/geolocation](https://github.com/Hapety/geolocation)

###调用参数
调用前端定位函数之前必须创建 qq.maps.Geolocation 对象，构造函数的参数如下：

<table>
   <tr>
      <td>参数名</td>
      <td>必填</td>
      <td>参数说明</td>
      <td>示例</td>
   </tr>
   <tr>
      <td>key</td>
      <td>是</td>
      <td>开发密钥（key）</td>
      <td>key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77</td>
   </tr>
   <tr>
      <td>referer</td>
      <td>是</td>
      <td>调用来源，一般为您的应用名称，为了保障对您的服务，请务必填写！</td>
      <td>referer=myapp</td>
   </tr>
</table>

###定位函数
前端定位组件一共封装了四个函数，这些函数包括：

1、getLocation(sucCallback, [errCallback], [options: {timeout: number, failTipFlag: boolean}])  
获取当前所在地理位置，调用一次即重新定位一次，定位数据比较精确。  
sucCallback为定位成功回调函数，必填；  
errCallback为定位失败回调函数，选填；  
options为定位选项，选填，可以通过timeout参数设置定位的超时时间，可以通过failTipFlag参数设置是否提示错误。 

2、getIpLocation(sucCallback, [errCallback])  
立即获取当前所在地理位置，适用于非精确定位场景，是IP定位，城市级别。  
sucCallback为定位成功回调函数，必填；  
errCallback为定位失败回调函数，选填。 

3、watchPosition(sucCallback)  
监听位置信息的改变，类似HTML5 Geolocation的watchPosition。  
sucCallback为定位成功回调函数，必填。 

4、clearWatch()  
清除监听，类似HTML5 Geolocation的clearWatch。 

##定位成功时返回的结果

	{
	    "adcode": "440305", // 行政区ID，六位数字, 前两位是省，中间是市，后面两位是区
	    "nation": "中国",
	    "province": "广东省",
	    "city": "深圳市",
	    "district": "南山区",
	    "addr": "南山区深圳大学上文山湖附近",
	    "lat": 22.530001, // 火星坐标(gcj02)，腾讯、Google、高德通用
	    "lng": 113.935364,
	    "accuracy": 62 // 误差范围，以米为单位
	}

##预览
![前端定位组件预览](http://3gimg.qq.com/lightmap/components/geolocation/cdn-geolocation-barcode.png)

##完整的调用示例

在该示例中，前端定位组件定位成功后，会将json格式的定位数据回传给定位成功回调函数，将定位信息打印出来。

	<!DOCTYPE html>
	<html> 
	<head> 
	    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
	    <title>二次封装的前端定位组件</title> 
	    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
	    <style>
	        * {
	            margin: 0;
	            padding: 0;
	            border: 0;
	        }
	        body {
	            position: absolute;
	            width: 100%;
	            height: 100%;
	            text-align: center;
	        }
	        #pos-area {
	            background-color: #009DDC;
	            margin-bottom: 10px;
	            width: 100%;
	            overflow: scroll;
	            text-align: left;
	            color: white;
	        }
	        #demo {
	            padding: 8px;
	            font-size: small;
	        }
	        #btn-area {
	            height: 100px;
	        }
	        button {
	            margin-bottom: 10px;
	            padding: 12px 8px;
	            width: 42%;
	            border-radius: 8px;
	            background-color: #009DDC;
	            color: white;
	        }
	    </style>
	    <script type="text/javascript" src="http://3gimg.qq.com/lightmap/components/geolocation/geolocation.min.js"></script>
	</head>
	<body>
	    <div id="pos-area">
	        <p id="demo">点击下面的按钮，获得对应信息：<br /></p>
	    </div>
	
	    <div id="btn-area">
	        <button onclick="geolocation.getLocation(showPosition, showErr, options)">获取精确定位信息</button>
	        <button onclick="geolocation.getIpLocation(showPosition, showErr)">获取粗糙定位信息</button>
	        <button onclick="showWatchPosition()">开始监听位置</button>
	        <button onclick="showClearWatch()">停止监听位置</button>
	    </div>
	    <script type="text/JavaScript">
	        var geolocation = new qq.maps.Geolocation("XNYBZ-XKBHS-OJYOK-6DMZO-GOJMZ-FAFL3", "myapp");
	
	        document.getElementById("pos-area").style.height = (document.body.clientHeight - 110) + 'px';
	
	        var positionNum = 0;
	        var options = {timeout: 8000};
	        function showPosition(position) {
	            positionNum ++;
	            document.getElementById("demo").innerHTML += "序号：" + positionNum;
	            document.getElementById("demo").appendChild(document.createElement('pre')).innerHTML = JSON.stringify(position, null, 4);
	            document.getElementById("pos-area").scrollTop = document.getElementById("pos-area").scrollHeight;
	        };
	
	        function showErr() {
	            positionNum ++;
	            document.getElementById("demo").innerHTML += "序号：" + positionNum;
	            document.getElementById("demo").appendChild(document.createElement('p')).innerHTML = "定位失败！";
	            document.getElementById("pos-area").scrollTop = document.getElementById("pos-area").scrollHeight;
	        };
	
	        function showWatchPosition() {
	            document.getElementById("demo").innerHTML += "开始监听位置！<br /><br />";
	            geolocation.watchPosition(showPosition);
	            document.getElementById("pos-area").scrollTop = document.getElementById("pos-area").scrollHeight;
	        };
	
	        function showClearWatch() {
	            geolocation.clearWatch();
	            document.getElementById("demo").innerHTML += "停止监听位置！<br /><br />";
	            document.getElementById("pos-area").scrollTop = document.getElementById("pos-area").scrollHeight;
	        };
	    </script>
	</body>
	</html>
