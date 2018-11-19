# -*- coding: UTF-8 -*-
import os
import sys
import commands
import json, hashlib


def worker():
    pngquant_path = sys.argv[1]
    png_file = sys.argv[2]
    png_path = sys.argv[3]
    png_file_name = png_file.replace(png_path, '')
    not_tiny_file = sys.argv[4]
    cache_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'cache'))

    with open(not_tiny_file, 'r') as f:
        try:
            not_tiny_pngs = json.load(f)
        except ValueError:
            not_tiny_pngs = []

    if png_file.endswith('.9.png') or png_file.startswith('nt_'):
        print '.9 pic or nt pic', png_file, ', do not tiny'
    elif png_file_name in not_tiny_pngs:
        print 'in not_png_quant.json ', png_file_name, ', do not tiny'
    else:
        ipng = png_file
        dpng = ipng[:-4] + '-fs8.png'

        with open(ipng, 'r') as f:
            md5content = hashlib.md5(f.read()).hexdigest()
        cache_file_path = os.path.join(cache_path, md5content[:3], md5content + '.cache')
        if os.path.isfile(cache_file_path):
            print 'png_file[cache hit] = ', png_file
            cmdmv = 'cp -f ' + cache_file_path + ' ' + ipng
            codemv, outmv = commands.getstatusoutput(cmdmv)
        else:
            print 'png_file[cache missing] = ', png_file
            cmd = pngquant_path + ' -f ' + ipng
            code, out = commands.getstatusoutput(cmd)
            if code == 0:
                if not os.path.isdir(os.path.dirname(cache_file_path)):
                    os.makedirs(os.path.dirname(cache_file_path))
                cmdmv = 'cp ' + dpng + ' ' + cache_file_path
                codemv, outmv = commands.getstatusoutput(cmdmv)

                cmdmv = 'mv -f ' + dpng + ' ' + ipng
                codemv, outmv = commands.getstatusoutput(cmdmv)



if __name__ == '__main__':
    worker()
