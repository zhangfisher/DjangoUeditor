#coding:utf-8
from django.conf import settings as gSettings   #全局设置
import os

#工具栏样式，可以添加任意多的模式
TOOLBARS_SETTINGS={
    "mini":[['source','|','undo', 'redo', '|','bold', 'italic', 'underline','formatmatch','autotypeset', '|', 'forecolor', 'backcolor','|', 'link', 'unlink','|','insertimage','attachment']],
    "normal":[['source','|','undo', 'redo', '|','bold', 'italic', 'underline','removeformat', 'formatmatch','autotypeset', '|', 'forecolor', 'backcolor','|', 'link', 'unlink','|','insertimage', 'emotion','attachment', '|','inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols']],
    "full":None
}
TOOLBARS_DEFAULT="normal"

#引入的第三方插件元组
THIRD_PARTY_PLUGINS=()

#允许上传的图片类型
UPLOAD_IMAGES_SETTINGS={
    "allow_type":"jpg,bmp,png,gif,jpeg",         #文件允许格式
    "max_size":"0"                                #文件大小限制，单位KB,0不限制
}
#允许上传的附件类型
UPLOAD_FILES_SETTINGS={
    "allow_type":"zip,rar,doc,docx,xls,xlsx,ppt,pptx,swf,dat,avi,rmvb,txt,pdf",         #文件允许格式
    "max_size":"0"                                #文件大小限制，单位KB,0不限制
}
#图片管理器地址
IMAGE_MANGER_SETTINGS={
    "location":""                  #图片管理器的位置,如果没有指定，默认跟图片路径上传一样
}

UEditorSettings={
    "configfile":"editor_config.js",
    "toolbars":TOOLBARS_SETTINGS[TOOLBARS_DEFAULT],
    "images_upload":UPLOAD_IMAGES_SETTINGS,
    "files_upload":UPLOAD_FILES_SETTINGS,
    "image_manager":IMAGE_MANGER_SETTINGS,
    "webAppKey":""
}



#更新配置：从用户配置文件settings.py重新读入配置UEDITOR_SETTINGS,
def UpdateUserSettings():
    UEditorSettings.update(getattr(gSettings,"UEDITOR_SETTINGS",{}))

#取得配置项参数
def GetUeditorSettings(key,default=None):
    if UEditorSettings.has_key(key):
        return UEditorSettings[key]
    else:
        return default


#读取用户Settings文件覆盖默认配置
UpdateUserSettings()
