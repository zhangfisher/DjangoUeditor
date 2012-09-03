#coding:utf-8
#
from django.db import models
from DjangoUeditor.models import UEditorField


class Blog(models.Model):
    Name=models.CharField('姓名',max_length=100,blank=True)
    Description=models.TextField('描述',blank=True)
    ImagePath=models.CharField('图片目录',max_length=100,blank=True)
    Content=UEditorField('内容',height=200,width=500,default='test',imagePath="aaa/",imageManagerPath="bb",toolbars="mini",options={"elementPathEnabled":True},filePath='bb',blank=True)


