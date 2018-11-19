# -*- coding: utf-8 -*-

import os,sys,subprocess
import argparse,string, shutil, json, hashlib, zipfile
from optparse import OptionParser

sys.dont_write_bytecode = True

# 根目录
res_dir = '../assets/resources/images'

# 排除的子目录
exclude_list = ['nopack','font','share','treasure']


# 根据根目录和排除的子目录新建自动图片集
def create():
    create_pac_files(res_dir)

# 删除根目录下已有的自动图片集
def delete():
    delete_pac_files(res_dir)

# # 
# def remove():


# def recover():


# 批量创建文件夹的自动图片集
def create_pac_files(path):
    # print 'foreach %s' %path
    # 遍历目标文件夹
    fl = os.listdir(path)
    for f in fl:
        file_path = os.path.join(path,f)
        if os.path.isdir(file_path) and not f in exclude_list: # if is a dir.
            # print 'create %s/%s' % (file_path,f+'.pac')
            print 'create %s' % f
            # fp = open('test_abc.pac','w')
            fp = file(os.path.join(file_path,f+".pac"),"w+")
            pac_file = {"__type__":"cc.SpriteAtlas"}
            fp.write(json.dumps(pac_file,indent=True, sort_keys=True))
            create_pac_files(file_path)


# 批量删除文件夹的自动图片集
def delete_pac_files(path):
    # print 'foreach %s' %path
    # 遍历目标文件夹
    fl = os.listdir(path)
    for f in fl:
        if os.path.isdir(os.path.join(path,f)): # if is a dir.
            delete_pac_files(os.path.join(path,f))
        else:
            name_ext = os.path.splitext(f);
            if name_ext[1] == '.pac':
                file = os.path.join(path,f)
                print 'delete %s' % file
                print 'delete %s' % (file+'.meta')
                os.remove(file)
                # os.remove(file+'.meta')



if __name__ == '__main__':
    parser = OptionParser()
    parser.set_defaults(res_dir=res_dir)
    parser.add_option('-d', '--res_dir', type='string', dest='res_dir',help=u'资源目录')
    parser.set_defaults(delete_pac=False)
    parser.add_option('-r', '--delete_pac', action='store_true', dest='delete_pac',help=u'是否删除资源目录下的自动图集文件')
    parser.set_defaults(create_pac=False)
    parser.add_option('-a', '--add_pac', action='store_true', dest='create_pac',help=u'是否创建资源目录下的自动图集文件')
    
    (options, args) = parser.parse_args() 
    
    print options

    if options.delete_pac: 
        delete_pac_files(options.res_dir)

    if options.create_pac:
        create_pac_files(options.res_dir)


