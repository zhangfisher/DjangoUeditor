#coding:utf-8
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
import settings
from django.contrib import admin
from TestApp.views import  TestUEditorModel

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'DUSite.views.home', name='home'),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    url(r'^ueditor/',include('DjangoUeditor.urls')),
    url(r'^test/$',TestUEditorModel)
)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL , document_root = settings.MEDIA_ROOT )
    urlpatterns += static(settings.STATIC_URL, document_root = settings.STATIC_ROOT )
    urlpatterns += patterns('',
        url(r'^(?P<path>.*)$','django.views.static.serve',{'document_root':settings.STATIC_ROOT}),
    )
    urlpatterns +=patterns('',
        (r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
    )
