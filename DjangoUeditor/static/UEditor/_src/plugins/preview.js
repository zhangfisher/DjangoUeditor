///import core
///commands 预览
///commandsName  Preview
///commandsTitle  预览
/**
 * 预览
 * @function
 * @name baidu.editor.execCommand
 * @param   {String}   cmdName     preview预览编辑器内容
 */
UE.commands['preview'] = {
    execCommand : function(){
        
        var me = this,
            w = window.open('', '_blank', ""),
            d = w.document,
            css = me.document.getElementById("syntaxhighlighter_css"),
            js = document.getElementById("syntaxhighlighter_js"),
//            style = "<style type='text/css'>" + me.options.initialStyle + "</style>",
            style = "<style type='text/css'>"+(me.document.getElementById("editorinitialstyle")&&me.document.getElementById("editorinitialstyle").innerHTML)+"</style>",
            cont = me.getContent();
        if(browser.ie){
            cont = cont.replace(/<\s*br\s*\/?\s*>/gi,'<br/><br/>')
        }
        d.open();

        d.write('<html><head>'+style+'<link rel="stylesheet" type="text/css" href="'+utils.unhtml( this.options.iframeCssUrl ) + '"/>'+
                (css ? '<link rel="stylesheet" type="text/css" href="' + css.href + '"/>' : '')

            + (css&&js ? ' <script type="text/javascript" charset="utf-8" src="'+js.src+'"></script>':'')
            +'<title></title></head><body >' +
            cont +
            (css && js ? '<script type="text/javascript">'+(baidu.editor.browser.ie ? 'window.onload = function(){SyntaxHighlighter.all()};' : 'SyntaxHighlighter.all();')+
                'setTimeout(function(){' +
                'for(var i=0,di;di=SyntaxHighlighter.highlightContainers[i++];){' +
                    'var tds = di.getElementsByTagName("td");' +
                    'for(var j=0,li,ri;li=tds[0].childNodes[j];j++){' +
                        'ri = tds[1].firstChild.childNodes[j];' +
                        'ri.style.height = li.style.height = ri.offsetHeight + "px";' +
                    '}' +
                '}},100)</script>':'') +
                     '</body></html>');
        d.close();
    },
    notNeedUndo : 1
};
