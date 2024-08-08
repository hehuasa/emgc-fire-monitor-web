#!/bin/bash
echo "开始执行脚本"
#Dockerfile目录
BASE_PATH=.
#docker 容器名字  
SERVER_NAME_BUSINE=yb_sms
#docker 镜像名字 
SERVER_IMAGE_NAME=yb_sms
#docker 镜像版本/容器版本
SERVER_VERSION=latest
################################################
#容器id
CID_BUSINE=$(docker ps -a| grep -w "$SERVER_NAME_BUSINE" | awk '{print $1}')
#运行中的容器Id
CID_BUSINE_RUNNING=$(docker ps| grep -w "$SERVER_NAME_BUSINE" | awk '{print $1}')
#镜像id
IID_BUSINE=$(docker images | grep -w "$SERVER_IMAGE_NAME" | awk '{print $3}')
#运行中的镜像对应的容器id
IID_BUSINE_C=$(docker ps -a| grep -w "$SERVER_IMAGE_NAME" | awk '{print $1}')
IID_BUSINE_C_RUNNING=$(docker ps| grep -w "$SERVER_IMAGE_NAME" | awk '{print $1}')
echo "容器id$CID_BUSINE--镜像id$IID_BUSINE"
# 构建docker镜像
function build() {
	handle_images_run
	echo "构建镜像==start==================================="
        if [ -n "$IID_BUSINE" ]; then
                echo "存在$SERVER_IMAGE_NAME镜像，IID_BUSINE=$IID_BUSINE"
		echo "删除镜像"
	docker rmi $SERVER_IMAGE_NAME:$SERVER_VERSION
		echo "开始构建镜像"
	docker build -t $SERVER_IMAGE_NAME:$SERVER_VERSION .
        else
                echo "不存在$SERVER_IMAGE_NAME镜像，开始构建镜像"
                docker build -t $SERVER_IMAGE_NAME:$SERVER_VERSION .
								handle_images_run

        fi
	echo "构建镜像==end==================================="
}
function handle_images_run() {
	echo "构建镜像前的操作==start==================================="
	if [ -n "$IID_BUSINE_C_RUNNING" ]; then
		echo "构建镜像前的操作：暂停运行该镜像的容器$IID_BUSINE_C_RUNNING容器"
		docker stop $IID_BUSINE_C_RUNNING
	fi
	if [ -n "$IID_BUSINE_C" ]; then
		echo "构建镜像前的操作：删除该镜像存在的容器$IID_BUSINE_C容器"
		docker rm $IID_BUSINE_C
	fi
	echo "构建镜像前的操作==end==================================="
}
# 运行docker容器
function run() {
        build
	echo "运行容器==start==================================="
	# docker运行项目命令 
	# docker run  --name $SERVER_NAME_BUSINE -p 3013:3000 -itd $SERVER_IMAGE_NAME:$SERVER_VERSION
	echo "运行容器==end==================================="
}
run
echo "脚本执行成功"