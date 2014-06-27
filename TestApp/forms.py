# coding:utf-8
from django import forms
from  DjangoUeditor.widgets import UEditorWidget
from  DjangoUeditor.forms import UEditorField, UEditorModelForm
from models import Blog


class TestUEditorForm(forms.Form):
    Name = forms.CharField(label=u'姓名')
    ImagePath = forms.CharField()
    Description = UEditorField(u"描述", initial="abc", width=1000, height=300)
    Content = forms.CharField(label=u"内容",
                              widget=UEditorWidget({"width":600, "height":100, "imagePath":'aa', "filePath":'bb', "toolbars":"full"}))


class UEditorTestModelForm(UEditorModelForm):
    class Meta:
        model = Blog
