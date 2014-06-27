#coding:utf-8
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
import settings
from django.contrib import admin
from TestApp.views import  TestUEditorModel,ajaxcmd,TestUEditor

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'DUSite.views.home', name='home'),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/', include(admin.site.urls)),
    url(r'^ueditor/',include('DjangoUeditor.urls')),
    url(r'^test/$',TestUEditorModel),
    url(r'^test2/$',TestUEditor),
    url(r'^ajaxcmd/$',ajaxcmd)

)

if settings.DEBUG:
    urlpatterns += patterns('',
        url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT }),
        url(r'^static/(?P<path>.*)$','django.views.static.serve',{'document_root':settings.STATIC_ROOT}),
        url(r'^(?P<path>.*)$','django.views.static.serve',{'document_root':settings.STATIC_ROOT}),
    )