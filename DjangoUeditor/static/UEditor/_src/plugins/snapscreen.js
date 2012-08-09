///import core
///commandsName  snapscreen
///commandsTitle  截屏
/**
 * 截屏插件
 */
UE.commands['snapscreen'] = {
    execCommand: function(){
        var me = this;
        me.setOpt({
               snapscreenServerPort: 80                                    //屏幕截图的server端端口
              ,snapscreenImgAlign: 'center'                                //截图的图片默认的排版方式
        });
        var editorOptions = me.options;

        if(!browser.ie){
                alert('截图功能需要在ie浏览器下使用');
                return;
        }

        var onSuccess = function(rs){
            try{
                rs = eval("("+ rs +")");
            }catch(e){
                alert('截屏上传有误\n\n请检查editor_config.js中关于截屏的配置项\n\nsnapscreenHost 变量值 应该为屏幕截图的server端文件所在的网站地址或者ip');
                return;
            }

            if(rs.state != 'SUCCESS'){
                alert(rs.state);
                return;
            }
            me.execCommand('insertimage', {
                src: editorOptions.snapscreenPath + rs.url,
                floatStyle: editorOptions.snapscreenImgAlign,
                data_ue_src:editorOptions.snapscreenPath + rs.url
            });
        };
        var onStartUpload = function(){
            //开始截图上传
        };
        var onError = function(){
            alert('截图上传失败，请检查你的PHP环境。 ');
        };
        try{
            var nativeObj = new ActiveXObject('Snapsie.CoSnapsie');
            nativeObj.saveSnapshot(editorOptions.snapscreenHost, editorOptions.snapscreenServerUrl, editorOptions.snapscreenServerPort, onStartUpload,onSuccess,onError);
        }catch(e){
            me.ui._dialogs['snapscreenDialog'].open();
        }
    },
    queryCommandState: function(){
        return this.highlight || !browser.ie ? -1 :0;
    }
};
