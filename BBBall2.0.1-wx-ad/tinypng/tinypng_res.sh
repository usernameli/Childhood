# 暂时只有Android工程压缩图片
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "DIR is $DIR"

if [[ ! -d "$DIR"/../cc_proj ]]; then
	echo "assets dir not exist, please check!!!"
	exit 1
fi

# check permission
chmod 777 $DIR/pngquant

# 压缩图片
PNGLIST=`find "$DIR"/../cc_proj -name "*.png" | grep -v /nt_`
# 不压缩的图片的配置表
# *配置名not_png_quant.json
# 大厅图片的配置放在hallskin/xxxx/replace/hall/config下 xxx为大厅皮肤名字
# 自己游戏的配置放在xxx/config下  xxx为游戏的名字
# *配置内容很简单就是一个json数组，要压缩的图片依次写里面就可以 例如只压一张图 配置内容为 ["games/hall/img/hall_plugin_texas.png"]
# *图片名字从“games”开始写起

# *** 注意 带*的规定必须遵从！其他为推荐

NOTLIST=`find "$DIR"/../cc_proj -name "not_png_quant.json" `
echo $NOTLIST
> $DIR/tmp.json
for NOTFILE in $NOTLIST
do
    if [ -f $NOTFILE ]; then
    	echo NOTFILE=$NOTFILE
        python $DIR/merge_json.py $NOTFILE $DIR/tmp.json
    fi
done

for PNGFILE in $PNGLIST
do
    if [ -f $PNGFILE ]; then
    	python $DIR/tinypng.py $DIR/pngquant $PNGFILE $DIR/../cc_proj $DIR/tmp.json
    fi
done


# 压缩图片
JPGLIST=`find "$DIR"/../cc_proj -name "*.jpg" | grep -v /nt_`
for JPGFILE in $JPGLIST
do
    if [ -f $JPGFILE ]; then
    	python $DIR/tinypng.py $DIR/pngquant $JPGFILE $DIR/../cc_proj $DIR/tmp.json
    fi
done

rm $DIR/tmp.json
