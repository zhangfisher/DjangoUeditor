///import core
///commands 全选
///commandsName  SelectAll
///commandsTitle  全选
/**
 * 选中所有
 * @function
 * @name baidu.editor.execCommand
 * @param   {String}   cmdName    selectall选中编辑器里的所有内容
 * @author zhanyi
*/
UE.plugins['selectall'] = function(){
    var me = this;
    me.commands['selectall'] = {
        execCommand : function(){
            //去掉了原生的selectAll,因为会出现报错和当内容为空时，不能出现闭合状态的光标
            var range = this.selection.getRange();
            range.selectNodeContents(this.body);
            if(domUtils.isEmptyBlock(this.body))
                range.collapse(true);
            range.select(true);
            this.selectAll = true;
        },
        notNeedUndo : 1
    };

    me.addListener('ready',function(){

        domUtils.on(me.document,'click',function(evt){

            me.selectAll = false;
        })
    })

};
