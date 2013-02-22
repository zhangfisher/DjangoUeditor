#coding:utf-8
from django import VERSION
if VERSION[0:2]>(1,3):
    from django.conf.urls import patterns, url
else:
    from django.conf.urls.defaults import patterns, url

from views import UploadFile,ImageManager,RemoteCatchImage,SearchMovie,scrawlUp

urlpatterns = patterns('',
    url(r'^ImageUp/(?P<uploadpath>.*)',UploadFile,{'uploadtype':'image'}),
    url(r'^FileUp/(?P<uploadpath>.*)',UploadFile,{'uploadtype':'file'}),
    url(r'^scrawlUp/(?P<uploadpath>.*)$',scrawlUp),
    url(r'^ImageManager/(?P<imagepath>.*)$',ImageManager),
    url(r'^RemoteCatchImage/(?P<imagepath>.*)$',RemoteCatchImage),
    url(r'^SearchMovie/$',SearchMovie),
)