#coding:utf-8
from django import forms
from django.conf import settings
from django.contrib.admin.widgets import AdminTextareaWidget
from django.template.loader import render_to_string
from django.utils.safestring import mark_safe
from django.utils.html import  conditional_escape
from django.utils.encoding import  force_unicode
from django.utils import simplejson

from utils import FixFilePath
import settings as USettings

class UEditorWidget(forms.Textarea):
    def __init__(self,width=600,height=300,plugins=(),toolbars="normal",filePath="",imagePath="",imageManagerPath="",css="",options={}, attrs=None):
        uOptions={}
        #图片上传路径
        uOptions['imagePath']=FixFilePath(imagePath)
        #附件上传路径
        uOptions['filePath']=FixFilePath(filePath)
        #图片管理器路径,如果没有指定，则默认等于image上传路径
        if len(imageManagerPath)==0:
            uOptions['imageManagerPath']=uOptions['imagePath']
        else:
            uOptions['imageManagerPath']=FixFilePath(imageManagerPath)
        uOptions['css']=css
        uOptions['plugins']=plugins
        uOptions['toolbars']=toolbars
        uOptions['options']=options
        uOptions['width']=width
        uOptions['height']=height
        self.ueditor_options=uOptions
        super(UEditorWidget, self).__init__(attrs)

    def render(self, name, value, attrs=None):
        if value is None: value = ''
        #取得工具栏设置
        try:
            if type(self.ueditor_options['toolbars'])==list:
                tbar=simplejson.dumps(self.ueditor_options['toolbars'])
            else:
                if getattr(USettings,"TOOLBARS_SETTINGS",{}).has_key(str(self.ueditor_options['toolbars'])):
                    tbar=simplejson.dumps(USettings.TOOLBARS_SETTINGS[str(self.ueditor_options['toolbars'])])
                else:
                    tbar=None
        except Exception:
            pass

        #传入模板的参数
        uOptions=self.ueditor_options.copy()
        uOptions.update({
            "name":name,
            "value":conditional_escape(force_unicode(value)),
            "toolbars":tbar,
            "options":simplejson.dumps(self.ueditor_options['options'])[1:-1]
                #str(self.ueditor_options['options'])[1:-1].replace("True","true").replace("False","false").replace("'",'"')
        })
        context = {
                'UEditor':uOptions,
                'STATIC_URL':settings.STATIC_URL,
                'STATIC_ROOT':settings.STATIC_ROOT,
                'MEDIA_URL':settings.MEDIA_URL,
                'MEDIA_ROOT':settings.MEDIA_ROOT
        }
        return mark_safe(render_to_string('ueditor.html',context))
    class Media:
        css={"all": ("ueditor/themes/default/ueditor.css" ,
                     "ueditor/themes/default/iframe.css" ,
            )}
        js=("ueditor/editor_config.js",
            "ueditor/editor_all_min.js")


class AdminUEditorWidget(AdminTextareaWidget, UEditorWidget):
    def __init__(self,**kwargs):
        self.ueditor_options=kwargs
        super(UEditorWidget,self).__init__(kwargs)