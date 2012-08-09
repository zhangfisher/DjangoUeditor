///import core
///commands 字数统计
///commandsName  WordCount,wordCount
///commandsTitle  字数统计
/**
 * Created by JetBrains WebStorm.
 * User: taoqili
 * Date: 11-9-7
 * Time: 下午8:18
 * To change this template use File | Settings | File Templates.
 */

UE.plugins['wordcount'] = function(){
    var me = this;
    me.setOpt({
        wordCount:true,
        maximumWords:10000,
        wordCountMsg:'当前已输入 {#count} 个字符，您还可以输入{#leave} 个字符 ',
        wordOverFlowMsg:'<span style="color:red;">你输入的字符个数已经超出最大允许值，服务器可能会拒绝保存！</span>'
    });
    var opt = me.options,
        max = opt.maximumWords,
        msg = opt.wordCountMsg ,
        errMsg = opt.wordOverFlowMsg;
    if(!opt.wordCount)return;
    me.commands["wordcount"]={
        queryCommandValue:function(cmd,onlyCount){
            var length,contentText,reg;
            if(onlyCount){
                reg = new RegExp("[\r\t\n]","g");
                contentText = this.getContentTxt().replace(reg,"");
                return contentText.length;
            }
            reg = new RegExp("[\r\t\n]","g");
            contentText = this.getContentTxt().replace(reg,"");
            length = contentText.length;
            if(max-length<0){
                me.fireEvent('wordcountoverflow');
                return errMsg
            }

            return msg.replace("{#leave}",max-length >= 0 ? max-length:0).replace("{#count}",length);;
        }
    };
};
