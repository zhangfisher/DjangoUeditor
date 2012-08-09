#coding: utf-8

from django import forms
from widgets import UEditorWidget
from utils import FixFilePath

class UEditorField(forms.CharField):
    def __init__(self,label,width=600,height=300,plugins=(),toolbars="normal",filePath="",imagePath="",imageManagerPath="",css="",options={}, *args, **kwargs):
        uOptions={}
        uOptions['filePath']=filePath
        uOptions['css']=css
        uOptions['imagePath']=imagePath
        uOptions['plugins']=plugins
        uOptions['toolbars']=toolbars
        uOptions['options']=options
        if len(imageManagerPath)==0:
            uOptions['imageManagerPath']=uOptions['imagePath']
        else:
            uOptions['imageManagerPath']=FixFilePath(imageManagerPath)
        uOptions['width']=width
        uOptions['height']=height
        kwargs["widget"]=UEditorWidget(**uOptions)
        kwargs["label"]=label
        super(UEditorField,self).__init__( *args, **kwargs)


