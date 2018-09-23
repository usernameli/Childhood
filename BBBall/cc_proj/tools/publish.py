# -*- coding:utf-8 -*-

import os
import sys
import json, hashlib
import shutil
import commands
from optparse import OptionParser
import re
import atlas

PROJ_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__),'..'))
OUTPUT_PATH = os.path.join(PROJ_PATH, 'tools', 'confused')

build_dir = os.path.join(PROJ_PATH, 'build/wechatgame')
backup_dir = os.path.join(PROJ_PATH, 'build/assets-backup/res/raw-assets')
backup_dir2 = os.path.join(PROJ_PATH, 'build/assets-backup')
backup_dirs = [
    'res/raw-assets',
    'res/import'
]
assets_dir = os.path.join(PROJ_PATH, 'assets/')
pngquant_path = os.path.join(PROJ_PATH, 'tools/pngquant')

origin_assets_to_build = [
    # 'resources/images/wechat'
    'resources/images/share'
]
origin_assets_to_backup = [
    'resources/sounds'
]

cdn_urldev = "https://cdn.mstar.xianleqipai.com/ball"
cdn_url = "http://xdev.mstar.xianleqipai.com:9002/ball"
odc_src = os.path.join(PROJ_PATH, 'odc')
odc_target = os.path.join(build_dir, 'src')


def config_open_data_content():
    # cp source file
    cmd = 'cp -r %s %s' % (odc_src, odc_target)
    os.system(cmd)

    # turn on OpenDataContent
    game_json_path = os.path.join(build_dir, 'game.json')
    with open(game_json_path, 'r') as rf:
        json_info = json.load(rf)
        json_info['openDataContext'] = 'src/odc'
        rf.close()

        with open(game_json_path, 'w') as wf:
            json.dump(json_info, wf, indent=3)
            wf.close()

    print '开放数据域配置完毕'


def config_cdn(cdn):
    game_js_path = os.path.join(build_dir, 'game.js')
    with open(game_js_path, 'r') as f:
        lines = []
        for line in f:
            if line.find('wxDownloader.REMOTE_SERVER_ROOT') >= 0:
                lines.append('wxDownloader.REMOTE_SERVER_ROOT = "%s";\n' % cdn)
            else:
                lines.append(line)

        content = ''.join(lines)

        with open(game_js_path, 'w') as output:
            output.write(content)

    print 'cdn配置完毕'


def compress_json(target_file):
    with open(target_file, 'r') as rf:
        json_info = json.load(rf)
        rf.close()

        with open(target_file, 'w') as wf:
            json.dump(json_info, wf)


def compress_project_json():
    """ 压缩工程import目录下的json - 去除空白字符 """

    import_dir = os.path.join(build_dir, 'res', 'import')
    for parent, _, files in os.walk(import_dir):
        for file in files:
            name_ext = os.path.splitext(file)
            if name_ext[1] == '.json':
                compress_json(os.path.join(parent, file))

    print 'json压缩完毕'


def remove_meta_file(target_file):
    for parent, _, files in os.walk(target_file):
        for file in files:
            name_ext = os.path.splitext(file)
            if name_ext[1] == '.meta':
                cmd = 'rm %s' % os.path.join(parent, file)
                os.system(cmd)

def backup_assets(build_assets_dir, backup_dirt):
    # backup
    # print build_assets_dir, backup_dirt
    if os.path.exists(backup_dirt):
        shutil.rmtree(backup_dirt)
    shutil.copytree(build_assets_dir, backup_dirt)
    # rm
    shutil.rmtree(build_assets_dir)


def remove_unnessary_assets():
    for path in backup_dirs:
        build_assets_dir = os.path.join(build_dir, path)
        backup_dir_pre = os.path.join(backup_dir2, path)
        backup_assets(build_assets_dir, backup_dir_pre)

    # process origin_assets_to_build
    for path in origin_assets_to_build:
        src = os.path.join(assets_dir, path)
        dst = os.path.join(build_dir, 'res', 'raw-assets', path)

        if os.path.exists(dst):
            shutil.rmtree(dst)
        shutil.copytree(src, dst)
        remove_meta_file(dst)

    # process origin_assets_to_backup
    for path in origin_assets_to_backup:
        src = os.path.join(assets_dir, path)
        dst = os.path.join(backup_dir, path)

        if os.path.exists(dst):
            shutil.rmtree(dst)
        shutil.copytree(src, dst)
        remove_meta_file(dst)

    print 'raw-assets重新加载完毕, 资源已备份至: build/assets-backup '


def compress_png():
    for (root, _, files) in os.walk(backup_dir):
        for file in files:
            split_path = os.path.splitext(file)
            basename = split_path[0]
            extname = split_path[1]
            print "++++++++++++++++++++"
            print basename
            print extname
            if (basename[-4:] != '-fs8' and extname == '.png'):
                png_path = os.path.join(root, file)
                print png_path
                tinypng_path = os.path.join(root, split_path[0] + '-fs8' + extname)
                print tinypng_path
                # execute
                cmd = pngquant_path + ' -f ' + png_path
                print cmd
                commands.getstatusoutput(cmd)

                # rm
                cmd = 'rm ' + png_path
                commands.getstatusoutput(cmd)

                # mv
                cmd = 'mv ' + tinypng_path + ' ' + png_path
                commands.getstatusoutput(cmd)

                print '%s translated' % png_path
    print 'pngquant压缩完毕'

def build():
    app_path = '/Applications/CocosCreator.app/Contents/MacOS/CocosCreator'
    project_path = '..'

    cmd = '%s --path %s --build' % (app_path, project_path)

    print '执行构建 : %s' % cmd

    viewdetail = False
    if viewdetail:
        os.system(cmd)
    else:
        print '构建脚本执行中...'
        (status, output) = commands.getstatusoutput(cmd)
        if status == 0:
            print '项目构建完成!'
        else:
            print '项目构建失败! | 日志如下: %s' % output

# 混淆
def confuse():
    # JSName = 'project.js'
    # if not os.path.isfile(destJS):
    #     destJS = os.path.join(PROJ_PATH, 'build', 'wechatgame', 'src', 'project.dev.js')
    #     JSName = 'project.dev.js'

    destJS = os.path.join(PROJ_PATH, 'build', 'wechatgame', 'src')
    JSName = ''
    destDir = os.path.join(PROJ_PATH, 'build', 'wechatgame', 'src')
    for filename in os.listdir(destDir):
        obj = re.match(r'^project\.([0-9]|[a-z])*\.js$', filename, re.M|re.I)
        if obj:
            destJS = os.path.join(destJS, filename)
            JSName = filename
            break
    # print destJS, JSName
    if os.path.isdir(OUTPUT_PATH):
        shutil.rmtree(OUTPUT_PATH)
    os.mkdir(OUTPUT_PATH)

    #备份一下
    shutil.copy(destJS, OUTPUT_PATH)

    jsList = []
    with open(destJS, 'r') as f:
        srclines = f.readlines()
        dstlines = []

    for l in srclines:
        if len(l) <= 1:
            continue
        dstlines.append(l)

    print json.dumps(jsList, indent=4)

    with open(os.path.join(OUTPUT_PATH, JSName), 'w') as f:
        f.writelines(dstlines)

    shcmd = os.path.join(PROJ_PATH, 'tools', 'uglifyJS', 'bin', 'uglifyJS')
    shcmd += ' -c -mt --no-dead-code -nc --overwrite --reserved-names \"main\" '
    shcmd += os.path.join(OUTPUT_PATH, JSName)
    result = commands.getstatusoutput(shcmd)
    if result[0] != 0:
        raise Exception(result[1])
    else:
        shutil.copyfile(os.path.join(OUTPUT_PATH, JSName), destJS)
        print destJS + ' confuse success'


def filterBySize():
    backup_root = os.path.join(backup_dir2,'res/import')
    original_root = os.path.join(build_dir,'res/import')
    for parent,dirs,files in os.walk(backup_root):
        for file in files :
            file_path = os.path.join(parent,file)
            type=os.path.splitext(file_path)[1]
            size=os.path.getsize(file_path)

            catalog = parent.split(backup_root+'/')[1]
            original_parent = os.path.join(original_root,catalog)
            original_path = os.path.join(original_parent,file)

            if type == '.json' and size >= 50*1000:
                print '>>>>>>>>>> %s   type=%s   size=%f' % (file_path,type,size)
                if os.path.isdir(parent) and not os.path.exists(original_parent) :
                    os.makedirs(original_parent)
                
                shutil.move(file_path,original_path)
                continue


if __name__ == '__main__':
    parser = OptionParser()
    parser.set_defaults(release=True)
    parser.set_defaults(cdn=cdn_url)
    parser.set_defaults(tiny=False)
    parser.set_defaults(build=False)
    parser.set_defaults(pack=False)
    parser.add_option('-d', '--debug', action="store_false", dest='release', help=u'保留本地raw-assets目录')
    parser.add_option('-c', '--cdn', type="string", dest='cdn', help=u'指定cdn地址')
    parser.add_option('-t', '--tiny', action="store_true", dest='tiny', help=u'使用pngquant压缩')
    parser.add_option('-b', '--build', action="store_true", dest='build', help=u'构建项目，等同于在编辑器中执行构建')
    parser.add_option('-p', '--pack', action="store_true", dest='pack', help=u'是否创建自动图集将散图打包成大图')
    (options, args) = parser.parse_args()

    # if options.pack:
    #     atlas.create()
    # else:
    #     atlas.delete()

    if options.build:
        build()

    config_cdn(options.cdn)
    config_open_data_content()
    compress_project_json()
    remove_unnessary_assets()

    # if options.release:
        # confuse()

    #if options.tiny:
    #    compress_png()

    filterBySize()