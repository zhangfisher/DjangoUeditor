#coding: utf-8

from django import forms
from widgets import UEditorWidget
from utils import MadeUeditorOptions

class UEditorField(forms.CharField):
    def __init__(self,label,width=600,height=300,plugins=(),toolbars="normal",filePath="",imagePath="",scrawlPath="",imageManagerPath="",css="",options={}, *args, **kwargs):
        uOptions=MadeUeditorOptions(width,height,plugins,toolbars,filePath,imagePath,scrawlPath,imageManagerPath,css,options)
        kwargs["widget"]=UEditorWidget(**uOptions)
        kwargs["label"]=label
        super(UEditorField,self).__init__( *args, **kwargs)

def UpdateUploadPath(widget,model_inst=None):
    try:
        from DjangoUeditor.models import UEditorField as ModelUEditorField
        for field in model_inst._meta.fields:
            if isinstance(field, ModelUEditorField):
                if  callable(field.ueditor_options["O_imagePath"]):
                    newPath=field.ueditor_options["O_imagePath"](model_inst)
                    widget.__getitem__(field.name).field.widget.ueditor_options["imagePath"] =newPath
                    if field.ueditor_options["O_imageManagerPath"]=="":widget.__getitem__(field.name).field.widget.ueditor_options["imageManagerPath"] =newPath
                    if field.ueditor_options["O_scrawlPath"]=="":widget.__getitem__(field.name).field.widget.ueditor_options["scrawlPath"] =newPath
                if  callable(field.ueditor_options["O_filePath"]):
                    widget.__getitem__(field.name).field.widget.ueditor_options["filePath"] =field.ueditor_options["O_filePath"](model_inst)
                if  callable(field.ueditor_options["O_imageManagerPath"]):
                    widget.__getitem__(field.name).field.widget.ueditor_options["imageManagerPath"] =field.ueditor_options["O_imageManagerPath"](model_inst)
                if  callable(field.ueditor_options["O_scrawlPath"]):
                    widget.__getitem__(field.name).field.widget.ueditor_options["scrawlPath"] =field.ueditor_options["O_scrawlPath"](model_inst)
    except:
        pass

class UEditorModelForm(forms.ModelForm):
    def __init__(self,*args,**kwargs):
        super(UEditorModelForm,self).__init__(*args,**kwargs)
        try:
            if kwargs.has_key("instance"):
                UpdateUploadPath(self,kwargs["instance"])
            else:
                UpdateUploadPath(self,None)
        except Exception:
            pass
