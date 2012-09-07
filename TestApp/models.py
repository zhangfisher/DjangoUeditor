#coding:utf-8
#
from django.db import models
from DjangoUeditor.models import UEditorField

def getImagePath(model_instance=None):
    if model_instance is None:
        return "aaa/"
    else:
        return "%s/" % model_instance.Name
def getDescImagePath(model_instance=None):
        return "aaa/"


class Blog(models.Model):
    Name=models.CharField('姓名',max_length=100,blank=True)
    Description=UEditorField('描述',blank=True,toolbars="full")
    ImagePath=models.CharField('图片目录',max_length=100,blank=True)
    Content=UEditorField('内容',height=200,width=500,default='test',imagePath=getImagePath,imageManagerPath="bb",toolbars="mini",options={"elementPathEnabled":True},filePath='bb',blank=True)

