微信项目生成工具
publish.py

-d debug模式，保留本地raw-assets目录。
-c cdn，需要指定cdn地址。没有这个参数默认使用线上cdn：https://ddzqn.nalrer.cn/ddz
-t 使用pngquant压缩。
-b 用脚本生成微信工程，等同于在编辑器中执行构建

【注意：手动构建项目的不需要再加-b】

样例：
python publish.py -t -b :=>  生成release版本，压缩图片，分离资源包，混淆js代码

python publish.py -b -d :=>  生成debug版本,只能在电脑微信工具上测试使用。

python publish.py -t -b -c 'http://172.16.12.39:8080'   :=>  生成release版本，压缩图片，分离资源包，混淆js代码。手机测试使用。