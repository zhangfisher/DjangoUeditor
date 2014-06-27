#coding:utf-8
from TestApp.forms import UEditorTestModelForm,TestUEditorForm
from django.http import HttpResponse
from django.shortcuts import render_to_response
from TestApp.models import Blog

def TestUEditor(request):
    if request.method == 'POST':
        form = TestUEditorForm(request.POST)
    else:
        form = TestUEditorForm(
            initial={'Description': u'测试'}
        )

    return render_to_response('test2.html', {'form': form})

def TestUEditorModel(request):
    if request.method == 'POST':
        #M=Blog.objects.get(pk=1)
        form = UEditorTestModelForm(request.POST)
        if form.is_valid():
            form.save()
            return render_to_response('test.html', {'form': form})
        else:
            return HttpResponse(u"数据校验错误")
    else:
        try:
            M=Blog.objects.get(pk=1)
            form = UEditorTestModelForm(instance= M)
        except:
            form = UEditorTestModelForm(
                initial={'Description': '测试'}
            )
        return render_to_response('test.html', {'form': form})


def ajaxcmd(request):
    return HttpResponse(u"我来自后端",content_type="plain/text")