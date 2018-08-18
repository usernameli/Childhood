# -*- coding: utf-8 -*-

import os,sys,subprocess
import argparse,string, shutil, json, hashlib, zipfile, requests
from optparse import OptionParser

sys.dont_write_bytecode = True

res_dir = '../assets/resources/images'


# 批量创建文件夹的自动图片集
def create_pac_file(path):
    # print 'foreach %s' %path
    # 遍历目标文件夹
    fl = os.listdir(path)
    for f in fl:
        file_path = os.path.join(path,f)
        if os.path.isdir(file_path): # if is a dir.
            print 'create %s/%s' % (file_path,f+'.pac')
            # fp = open('test_abc.pac','w')
            fp = file(os.path.join(file_path,f+".pac"),"w+")
            pac_file = {"__type__":"cc.SpriteAtlas"}
            fp.write(json.dumps(pac_file,indent=True, sort_keys=True))
            create_pac_file(file_path)


# 批量删除文件夹的自动图片集
def delete_pac_file(path):
    # print 'foreach %s' %path
    # 遍历目标文件夹
    fl = os.listdir(path)
    for f in fl:
        if os.path.isdir(os.path.join(path,f)): # if is a dir.
            delete_pac_file(os.path.join(path,f))
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
        delete_pac_file(options.res_dir)

    if options.create_pac:
        create_pac_file(options.res_dir)


