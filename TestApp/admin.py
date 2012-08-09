#coding: utf-8
from django.contrib import admin
from TestApp.models import *

class BlogAdmin(admin.ModelAdmin):
    list_display = ("Name","Description","Content","ImagePath")


#注册管理
admin.site.register(Blog,BlogAdmin)
