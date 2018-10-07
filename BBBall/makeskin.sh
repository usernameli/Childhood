#!/bin/sh

#获取当前路径
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo dir=$DIR

#初始化路径
IMG_OUTPUT=$DIR/cc_proj/assets/resources/images							#图片输出路径
IMG_TPS=$DIR/src/imgs/tps 										#图片资源路径
SOUND_OUTPUT=$DIR/cc_proj/assets/resources/sounds 						#音频输出路径
SOUND_SRC=$DIR/src/sounds										#音频资源路径


# 拷贝音乐文件,有资源时才会执行
publish_sound()
{
	if [ -d $SOUND_SRC ]; then
		echo 'Exist SOUND DIR'
		# rm -rf $SOUND_OUTPUT
		cp -rf $SOUND_SRC/* $SOUND_OUTPUT
		echo "publish sound DONE"
	fi
}


#生成普通图资源(打大图,字体,nopack)   
publish_img()
{
	# 遍历tps
	TPSES=`find $IMG_TPS -name "*.tps"`
	echo $IMG_TPS

	for tps in $TPSES
	do
	echo 'Process ' $tps
	# 根据全局路径获取文件名
	file=`echo ${tps##*/}`
	fileName=`echo $file|awk -F '.' '{print $1}' `
	echo 'fileName = ' $fileName

	echo TexturePacker $tps --sheet $IMG_OUTPUT/$fileName.png --data $IMG_OUTPUT/$fileName.plist
	TexturePacker $tps --sheet $IMG_OUTPUT/$fileName.png --data $IMG_OUTPUT/$fileName.plist

	done

	# copy font and nopack
	# rm -rf $IMG_OUTPUT/font
	# rm -rf $IMG_OUTPUT/nopack
	# mkdir $IMG_OUTPUT/font
	# mkdir $IMG_OUTPUT/nopack

	cp -rf $IMG_TPS/../font/* 		$IMG_OUTPUT/font/ 
	cp -rf $IMG_TPS/../nopack/* 	$IMG_OUTPUT/nopack/
	cp -rf $IMG_TPS/../map/* 	    $IMG_OUTPUT/../map/
	cp -rf $IMG_TPS/../share/* 	    $IMG_OUTPUT/share/
    cp -rf $IMG_TPS/../loading/*    $IMG_OUTPUT/loading/

	echo "publish img DONE"
}

publish_sound
publish_img