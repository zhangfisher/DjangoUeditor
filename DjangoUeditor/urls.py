#coding:utf-8
from django.conf.urls import patterns, include, url
from DjangoUeditor.views import UploadFile,ImageManager,RemoteCatchImage,SearchMovie


urlpatterns = patterns('',
    url(r'^ImageUp/(?P<uploadpath>.*)',UploadFile,{'uploadtype':'image'}),
    url(r'^FileUp/(?P<uploadpath>.*)',UploadFile,{'uploadtype':'file'}),
    url(r'^ImageManager/(?P<imagepath>.*)$',ImageManager),
    url(r'^RemoteCatchImage/(?P<imagepath>.*)$',RemoteCatchImage),
    url(r'^SearchMovie/$',SearchMovie),

)