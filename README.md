# 安全管控系统 web 部署说明

## 一、网络与应用环境确定

<p>1.确定是否使用https环境。</p>
  <p>如果web端有使用麦克风、语音通话、视频通话等场景，则必须部署与使用https环境。</p>
<p>2.是否使用nginx</p>
  <p>如需使用https环境，则必须部署与配置nginx；其余场景需根据各项目实际网络与软硬件环境确定。</p>

## 二、项目相关配置

<p>
  打开根目录 <code>.env.production</code> 文件，分别配置以下参数：：
</p>

### 1、项目相关初始化配置

<p>
  <code> NEXT_PUBLIC_ANALYTICS_Ms_type</code>： 不同项目的唯一标识。 元坝: yb 川西: cx 消防接出警: fireAlarm
</p>

<p>
  <code> NEXT_PUBLIC_ANALYTICS_BasePath</code>： 本web服务的url根目录地址（非必须）。<strong>如需要在nginx中配置非根目录访问，则需要在此对应做配置</strong>。 例如：本项目需要在<code>192.168.0.240/cxemgc</code> 下访问，则需配置为 <code>cxemgc</code>
</p>

### 2、后端各应用服务地址配置

<p>
  <code> NEXT_PUBLIC_ANALYTICS_Ms_login</code>：后端login服务地址(可直接配置服务地址，也可以配置nginx代理转发后的地址)
</p>
<p>
  <code> NEXT_PUBLIC_ANALYTICS_Ms_system</code>：后端system服务地址(可直接配置服务地址，也可以配置nginx代理转发后的地址)
</p>
<p>
  <code> NEXT_PUBLIC_ANALYTICS_Ms_alarm</code>：后端cx-alarm服务地址(可直接配置服务地址，也可以配置nginx代理转发后的地址)
</p>
<p>
  <code> NEXT_PUBLIC_ANALYTICS_Ms_device</code>：后端device-manger服务地址(可直接配置服务地址，也可以配置nginx代理转发后的地址)
</p>
<p>
  <code> NEXT_PUBLIC_ANALYTICS_Ms_video</code>：后端video-server服务地址(可直接配置服务地址，也可以配置nginx代理转发后的地址)
</p>
<p>
  <code> NEXT_PUBLIC_ANALYTICS_WebRtcServer</code>：后端流媒体服务地址(可直接配置服务地址，也可以配置nginx代理转发后的地址)
</p>
<p>
  <code> NEXT_PUBLIC_ANALYTICS_HttpFlv</code>：后端流媒体服务中 HttpFlv 协议的拉流地址(可直接配置服务地址，也可以配置nginx代理转发后的地址)
</p>
<p>
  <code> NEXT_PUBLIC_ANALYTICS_WebRtcApi</code>： 后端流媒体服务中 webrtc 协议    <strong>注意：需要配置真实ip及端口；或配置stun服务的代理转发地址，不能直接用nginx代理</strong>
</p>

<p>
  <code> NEXT_PUBLIC_ANALYTICS_Pt_message</code>：后端pt-message服务地址(可直接配置服务地址，也可以配置nginx代理转发后的地址) <strong>注意：若使用nginx代理，则需要配置为webscoket模式。注意本配置项不需要填写http或ws前缀</strong>
</p>

<p>
  <code> NEXT_PUBLIC_ANALYTICS_MsgPush</code>： 后端ms-msg-push服务地址(可直接配置服务地址，也可以配置nginx代理转发后的地址)
</p>

<p>
  <code> NEXT_PUBLIC_ANALYTICS_Ms_plan</code>： 后端ms-plan服务地址(可直接配置服务地址，也可以配置nginx代理转发后的地址)
</p>

<p>
  <code> NEXT_PUBLIC_ANALYTICS_Ms_msds</code>： 后端ms-msds服务地址(可直接配置服务地址，也可以配置nginx代理转发后的地址)
</p>

<p>
  <code> NEXT_PUBLIC_ANALYTICS_WeNetUrl</code>：语音识别服务地址 <strong>注意：需要在https模式下使用，所以需配置nginx代理</strong>
</p>

### 3、地图相关配置

<p>
  <code> NEXT_PUBLIC_ANALYTICS_Map</code>：地图服务地址
</p>
<p>
  <code> NEXT_PUBLIC_ANALYTICS_MAPURL</code>：地图服务的浅色底图style地址(可直接配置服务地址，也可以配置nginx代理转发后的地址)
  <strong>如果是https模式，则配置被nginx转发后的地址</strong> 
</p>
<p>
  <code> NEXT_PUBLIC_ANALYTICS_MAPURLDARK</code>：地图服务的深色底图style地址(可直接配置服务地址，也可以配置nginx代理转发后的地址)
  <strong>如果是https模式，则配置被nginx转发后的地址</strong> 
</p>
<p>
  <code> NEXT_PUBLIC_ANALYTICS_3d_Webrtc</code>： 3d地图的webrtc服务地址
</p>
<p>
  <code> NEXT_PUBLIC_ANALYTICS_mapType</code>： 默认地图模式， 可配置的值为 <code>2d</code> or <code>3d</code>
</p>

<p>
  <code> NEXT_PUBLIC_ANALYTICS_MAPCenterLat</code>： 地图默认中心点纬度
</p>

<p>
  <code> NEXT_PUBLIC_ANALYTICS_MAPCenterLng</code>： 地图默认中心点经度
</p>

<p>
  <code> NEXT_PUBLIC_ANALYTICS_MAPCenterZoom</code>： 2d地图默认缩放级别
</p>

<p>
  <code> NEXT_PUBLIC_ANALYTICS_MAPCenterBearing</code>： 2d地图默认旋转角度
</p>

<p>
  <code> NEXT_PUBLIC_ANALYTICS_MAPHideTextLayer</code>：2d地图中的文字图层id。用于控制鹰眼图中隐藏相关文字图层
</p>

## 三、 构建与部署

### 构建采用 docker 方式

#### 1.进入代码根目录，dockerfile 文件已编写好，执行构建。程序默认使用 3000 端口访问。

<code>yarn install </code>

<code>yarn build</code>

<code>docker build -t xxx . </code>

<code>docker run --name=xxx -p 3000:3000 -itd xxx</code>

##### 可以参考开发流水线，与代码根目录的 build.sh 文件执行构建部署

## 四、部分 nginx 配置示例

<code> location /cx_map_https/ {

proxy_pass http://192.168.0.249:8234/;

}
</code>

<code> location /cx_pt_message/ {

proxy_pass http://192.168.0.242:8001/pt-message/;

proxy_http_version 1.1;

proxy_read_timeout 600s;

proxy_set_header Upgrade \$http_upgrade;

proxy_set_header Connection $connection_upgrade;

break;

}
</code>

<code> location /wenetServer/ {

proxy_pass http://192.168.8.135:10086/ ;

proxy_http_version 1.1;

proxy_read_timeout 600s;

proxy_set_header Upgrade \$http_upgrade;

proxy_set_header Connection $connection_upgrade;

}
</code>

<code> location /webrtcApi/ {

proxy_pass http://192.168.0.243:80/ ;

}
</code>
