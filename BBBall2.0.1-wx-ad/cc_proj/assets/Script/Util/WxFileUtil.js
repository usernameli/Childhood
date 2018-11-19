/**
 * Created by wangqi on 2018/6/8.
 */

cc.Class({
    extends:cc.Component,
    statics: {


        //废弃
        writeFile: function (path, date) {
            var fileManager = wx.getFileSystemManager()
            var that = this
            var cachPath = wx.env.USER_DATA_PATH + "/temp/"
            this.mkFiledir(cachPath)
            fileManager.writeFile({
                filePath: cachPath + path,
                data: date,
                encoding: 'utf8',
                success: function (date) {
                    // that.unzipFile(wx.env.USER_DATA_PATH+"/temp/"+path,wx.env.USER_DATA_PATH+"/res")
                },
                fail: function (date) {
                    // cc.log("writeFile fail = "+JSON.stringify(date))
                },
                complete: function (date) {
                    // cc.log("writeFile complete = "+JSON.stringify(date))

                },
            })
        },

        readFile: function (path) {
            var fileManager = wx.getFileSystemManager()
            var that = this
            var str = fileManager.readFile({
                filePath: wx.env.USER_DATA_PATH + "/" + path,
                encoding: "utf8",
                success: function (date) {
                    // cc.log("readFile success = "+JSON.stringify(date))

                },
                fail: function (date) {
                    cc.log("readFile fail = " + JSON.stringify(date))
                },
                complete: function (date) {
                    // cc.log("readFile complete = "+JSON.stringify(date))
                },
            })
        },
        //下载文件，filePath 不传值，会下载到临时文件里
        downloadFile: function (url, sucCallback, failCallback) {
            var that = this
            return wx.downloadFile({
                url: url,
                // header : "GET",
                // filePath : loadPath || wx.env.USER_DATA_PATH,
                success: function (res) {
                    that.unzipFile(res.tempFilePath, wx.env.USER_DATA_PATH, sucCallback, failCallback)
                },
                fail: function (res) {

                },
                complete: function (res) {
                },
            })
        },
        //解压文件到本地用户目录
        unzipFile: function (zipFilePath, targetPath, sucCallback, failCallback) {

            var fileManager = wx.getFileSystemManager()
            var that = this
            fileManager.unzip({
                zipFilePath: zipFilePath,
                targetPath: targetPath,
                success: function (date) {
                    if (sucCallback) {
                        sucCallback(date)
                    }
                },
                fail: function (date) {
                    if (failCallback) {
                        failCallback(date)
                    }
                },
                complete: function (date) {
                    cc.log("unzipFile complete = " + JSON.stringify(date))
                },
            })
        },
        readFiledir: function (path, sucCallback, failCallback) {
            var fileManager = wx.getFileSystemManager()
            fileManager.readdir({
                dirPath: path,
                success: function (date) {
                    if (sucCallback) {
                        sucCallback(date)
                    }
                    cc.log("readFiledir success = ", JSON.stringify(date))
                },
                fail: function (date) {
                    if (failCallback) {
                        failCallback(date)
                    }
                    cc.log("readFiledir fail = ", JSON.stringify(date))
                },
                complete: function (date) {
                    // that.rmFiledir(wx.env.USER_DATA_PATH+"/temp/")
                    cc.log("readFiledir complete = ", JSON.stringify(date))
                },
            })
        },
        mkFiledir: function (dirPath) {
            var fileManager = wx.getFileSystemManager()
            var that = this
            cc.log("dirPath = " + dirPath)
            fileManager.mkdir({
                dirPath: dirPath,
                recursive: true,
                success: function (date) {
                    cc.log("mkFiledir success = ")
                },
                fail: function (date) {
                    cc.log("mkFiledir fail = ")
                },
                complete: function (date) {
                    cc.log("mkFiledir complete = ")
                },
            })
        },
        rmFiledir: function (dirPath) {
            var fileManager = wx.getFileSystemManager()
            cc.log("dirPath = " + dirPath)
            fileManager.rmdir({
                dirPath: dirPath,
                recursive: true,
                success: function (date) {
                    cc.log("rmFiledir success = " + JSON.stringify(date))
                },
                fail: function (date) {
                    cc.log("rmFiledir fail = " + JSON.stringify(date))
                },
                complete: function (date) {

                },
            })
        },


        rmSubFileDir: function (path) {
            var that = this
            this.readFiledir(path, function (data) {
                cc.log("rmSubFileDir = ", JSON.stringify(data))
                var fileList = data['files']
                fileList.forEach(function (file) {
                    cc.log("file =  ", file)
                    that.rmFiledir(wx.env.USER_DATA_PATH + "/" + file)
                });
            })
        },
        accessPath: function (filePath) {
            var that = this
            if (cc.wwx.IsWechatPlatform()) {
                var fileManager = wx.getFileSystemManager()

                fileManager.access({
                    path: filePath,
                    success: function (res) {
                        cc.log("access success ")
                    },
                    fail: function (res) {
                        cc.log("access fail ")
                        that.mkFiledir(filePath);
                    },
                    complete: function (res) {
                        cc.log("access complete ")
                    }
                });
            }
        },
    }
});

