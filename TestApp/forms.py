#coding:utf-8
from django import forms
from  DjangoUeditor.widgets import UEditorWidget
from  DjangoUeditor.forms import UEditorField,UEditorModelForm
from models import Blog

class TestUEditorForm(forms.Form):
    Name=forms.CharField('姓名')
    ImagePath=forms.CharField()
    Description=UEditorField("描述",initial="abc",width=600,height=800)
    Content=forms.CharField(label="内容",widget=UEditorWidget(width=800,height=500, imagePath='aa', filePath='bb',toolbars={}))

class UEditorTestModelForm(UEditorModelForm):
    class Meta:
        model=Blog
