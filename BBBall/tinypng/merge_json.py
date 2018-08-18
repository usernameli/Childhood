import os
import sys
import json

def merge_json(game_json, dst):
    with open(game_json, 'r') as f:
        game_json = json.load(f)
    with open(dst, 'r') as f:
        try:
            dst_json = json.load(f)
        except ValueError:
            dst_json = []
    dst_json += game_json
    with open(dst, 'w') as f:
        json.dump(dst_json, f)

if __name__ == '__main__':
    print len(sys.argv)
    if len(sys.argv) != 3:
        print 'params number is not right, please check...'
        sys.exit()

    gj = sys.argv[1]
    print 'filePath=', gj
    tj = sys.argv[2]
    print 'fileDst=', tj
    merge_json(gj, tj)
