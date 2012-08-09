

(function(){
    var parent = window.parent;
    //dialog对象
    dialog = parent.$EDITORUI[window.frameElement.id.replace(/_iframe$/, '')];
    //当前打开dialog的编辑器实例
    editor = dialog.editor;

    UE = parent.UE;

    domUtils = UE.dom.domUtils;

    utils = UE.utils;

    browser = UE.browser;

    ajax = UE.ajax;

    $G = function(id){return document.getElementById(id)};
    //focus元素
    $focus = function(node){
        setTimeout(function(){
            if(browser.ie){
                var r = node.createTextRange();
                r.collapse(false);
                r.select();
            }else{
                node.focus()
            }
        },0)
    }

})();

