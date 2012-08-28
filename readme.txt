Ueditor HTML编辑器是百度开源的HTML编辑器，

本模块帮助在Django应用中集成百度Ueditor HTML编辑器。
安装包中已经集成Ueditor v1.2.2

使用Django-Ueditor非常简单，方法如下：

1、安装方法
	
	**方法一：下载安装包，在命令行运行：
		python setup.py install
	**方法二：使用pip工具在命令行运行(推荐)：
   		pip install DjangoUeditor

2、在INSTALL_APPS里面增加DjangoUeditor app，如下：
     
		INSTALLED_APPS = (
			#........
    		'DjangoUeditor',
		)


3、在urls.py中增加：

	url(r'^ueditor/',include('DjangoUeditor.urls' )),

4、在models中这样定义：
	
	from DjangoUeditor.models import UEditorField
	class Blog(models.Model):
    	Name=models.CharField(,max_length=100,blank=True)
    	Content=UEditorField('内容	',height=100,width=500,default='test',imagePath="uploadimg/",imageManagerPath="imglib",toolbars='mini',options={"elementPathEnabled":True},filePath='upload',blank=True)

	说明：
	UEditorField继承自models.TextField,因此你可以直接将model里面定义的models.TextField直接改成UEditorField即可。
	UEditorField提供了额外的参数：
        toolbars:配置你想显示的工具栏，取值为mini,normal,full，代表小，一般，全部。如果默认的工具栏不符合您的要求，您可以在settings里面配置自己的显示按钮。参见后面介绍。
        imagePath:图片上传的路径,如"images/",实现上传到"{{MEDIA_ROOT}}/images"文件夹
        filePath:附件上传的路径,如"files/",实现上传到"{{MEDIA_ROOT}}/files"文件夹
        imageManagerPath:图片管理器显示的路径，如"imglib/",实现上传到"{{MEDIA_ROOT}}/imglib",如果不指定则默认=imagepath。
        options：其他UEditor参数，字典类型。参见Ueditor的文档ueditor_config.js里面的说明。
        css:编辑器textarea的CSS样式
        width，height:编辑器的宽度和高度，以像素为单位。

5、在表单中使用非常简单，与常规的form字段没什么差别，如下：
	
	class TestUeditorModelForm(forms.ModelForm):
    	class Meta:
        	model=Blog
	***********************************
	如果不是用ModelForm，可以有两种方法使用：

	1: 使用forms.UEditorField

	from  DjangoUeditor.forms import UEditorField
	class TestUEditorForm(forms.Form):
	    Description=UEditorField("描述",initial="abc",width=600,height=800)
	
	2: widgets.UEditorWidget

	from  DjangoUeditor.widgets import UEditorWidget
	class TestUEditorForm(forms.Form):
		Content=forms.CharField(label="内容",widget=UEditorWidget(width=800,height=500, imagePath='aa', filePath='bb',toolbars={}))
	
	widgets.UEditorWidget和forms.UEditorField的输入参数与上述models.UEditorField一样。

6、Settings配置
     
      在Django的Settings可以配置以下参数：
            UEDITOR_SETTINGS={
                "toolbars":{           #定义多个工具栏显示的按钮，允行定义多个
                    "name1":[[ 'source', '|','bold', 'italic', 'underline']],
                    "name2",[]
                },
                "images_upload":{
                    "allow_type":"jpg,png",    #定义允许的上传的图片类型
                    "max_size":"2222kb"        #定义允许上传的图片大小，0代表不限制
                },
                "files_upload":{
                     "allow_type":"zip,rar",   #定义允许的上传的文件类型
                     "max_size":"2222kb"       #定义允许上传的文件大小，0代表不限制
                 },,
                "image_manager":{
                     "location":""         #图片管理器的位置,如果没有指定，默认跟图片路径上传一样
                },
            }

7、其他事项：

    **本程序基于百度ueditor 1.2.2，安装包里面已经包括了，不需要再额外安装。
    **目前暂时不支持ueditor的插件
    **Django默认开启了CSRF中间件，因此如果你的表单没有加入{% csrf_token %}，那么当您上传文件和图片时会失败
   