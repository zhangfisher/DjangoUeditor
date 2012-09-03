#coding:utf-8

from TestApp.forms import TestUEditorForm,TestUeditorModelForm
from django.http import HttpResponse
from django.shortcuts import render_to_response
from TestApp.models import Blog

def TestUEditor(request):
    if request.method == 'POST':
        form = TestUEditorForm(request.POST)
        return HttpResponse(form.data["Content"])
    else:
        form = TestUEditorForm(
            initial={'Description': '测试'}
        )
        return render_to_response('test.html', {'form': form})

def TestUEditorModel(request):
    if request.method == 'POST':
        form = TestUeditorModelForm(request.POST)
        if form.is_valid():
            form.save()
            return render_to_response('test.html', {'form': form})
        else:
            return HttpResponse("数据校验错误")
    else:
        try:
            M=Blog.objects.get(pk=1)
            form = TestUeditorModelForm(instance= M)
        except Exception:
            form = TestUeditorModelForm(
                initial={'Description': '测试'}
            )
        return render_to_response('test.html', {'form': form})
