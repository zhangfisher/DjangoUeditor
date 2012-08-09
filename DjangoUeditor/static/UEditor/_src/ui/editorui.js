//ui跟编辑器的适配層
//那个按钮弹出是dialog，是下拉筐等都是在这个js中配置
//自己写的ui也要在这里配置，放到baidu.editor.ui下边，当编辑器实例化的时候会根据editor_config中的toolbars找到相应的进行实例化
(function (){
    var utils = baidu.editor.utils;
    var editorui = baidu.editor.ui;
    var _Dialog = editorui.Dialog;
    editorui.Dialog = function (options){
        var dialog = new _Dialog(options);
        dialog.addListener('hide', function (){
            if (dialog.editor) {
                var editor = dialog.editor;
                try {
                    editor.focus()
                } catch(ex){}
            }
        });
        return dialog;
    };

    var  iframeUrlMap ={
        'anchor':'~/dialogs/anchor/anchor.html',
        'insertimage':'~/dialogs/image/image.html',
        'inserttable':'~/dialogs/table/table.html',
        'link':'~/dialogs/link/link.html',
        'spechars':'~/dialogs/spechars/spechars.html',
        'searchreplace':'~/dialogs/searchreplace/searchreplace.html',
        'map':'~/dialogs/map/map.html',
        'gmap':'~/dialogs/gmap/gmap.html',
        'insertvideo':'~/dialogs/video/video.html',
        'help':'~/dialogs/help/help.html',
        'highlightcode':'~/dialogs/code/code.html',
        'emotion':'~/dialogs/emotion/emotion.html',
        'wordimage':'~/dialogs/wordimage/wordimage.html',
        'attachment':'~/dialogs/attachment/attachment.html',
        'insertframe':'~/dialogs/insertframe/insertframe.html',
        'edittd':'~/dialogs/table/edittd.html',
        'webapp':'~/dialogs/webapp/webapp.html',
        'snapscreen': '~/dialogs/snapscreen/snapscreen.html'
    };
    //为工具栏添加按钮，以下都是统一的按钮触发命令，所以写在一起
    var btnCmds = ['undo', 'redo','formatmatch',
        'bold', 'italic', 'underline',
        'strikethrough', 'subscript', 'superscript','source','indent','outdent',
        'blockquote','pasteplain','pagebreak',
        'selectall', 'print', 'preview', 'horizontal', 'removeformat','time','date','unlink',
        'insertparagraphbeforetable','insertrow','insertcol','mergeright','mergedown','deleterow',
        'deletecol','splittorows','splittocols','splittocells','mergecells','deletetable'];

    for(var i=0,ci;ci=btnCmds[i++];){
        ci = ci.toLowerCase();
        editorui[ci] = function (cmd){
            return function (editor, title){
                var ui = new editorui.Button({
                    className: 'edui-for-' + cmd,
                    title: title || editor.options.labelMap[cmd] || '',
                    onclick: function (){
                        editor.execCommand(cmd);
                    },
                    showText: false
                });
                editor.addListener('selectionchange', function (type, causeByUi, uiReady){
                    var state = editor.queryCommandState(cmd);
                    if (state == -1) {
                        ui.setDisabled(true);
                        ui.setChecked(false);
                    } else {
                        if(!uiReady){
                            ui.setDisabled(false);
                            ui.setChecked(state);
                        }
                    }
                });
                return ui;
            };
        }(ci);
    }

    //清除文档
    editorui.cleardoc = function(editor, title){
        var ui = new editorui.Button({
            className: 'edui-for-cleardoc',
            title: title || editor.options.labelMap.cleardoc || '',
            onclick: function (){
                if(confirm('确定清空文档吗？')){
                    editor.execCommand('cleardoc');
                }
            }
        });
        editor.addListener('selectionchange',function(){
            ui.setDisabled(editor.queryCommandState('cleardoc') == -1);
        });
        return ui;
    };

    //排版，图片排版，文字方向
    var typeset = {
        'justify' : ['left','right','center','justify'],
        'imagefloat' :  ['none','left','center','right'],
        'directionality' : ['ltr','rtl']
    };

    for(var p in typeset){

        (function(cmd,val){
            for(var i=0,ci;ci=val[i++];){
                (function(cmd2){
                    editorui[cmd.replace('float','')+cmd2] = function (editor, title){
                        var ui = new editorui.Button({
                            className: 'edui-for-'+ cmd.replace('float','') + cmd2,
                            title: title || editor.options.labelMap[cmd.replace('float','') + cmd2] || '',
                            onclick: function (){
                                editor.execCommand(cmd, cmd2);
                            }
                        });
                        editor.addListener('selectionchange', function (type, causeByUi, uiReady){
                            ui.setDisabled(editor.queryCommandState(cmd) == -1);
                            ui.setChecked(editor.queryCommandValue(cmd) == cmd2 && !uiReady);
                        });
                        return ui;
                    };
                })(ci)
            }
        })(p,typeset[p])
    }

    //字体颜色和背景颜色
    for(var i=0,ci;ci = ['backcolor', 'forecolor'][i++];){
        editorui[ci] = function (cmd){
            return function (editor, title){
                var ui = new editorui.ColorButton({
                    className: 'edui-for-' + cmd,
                    color: 'default',
                    title: title || editor.options.labelMap[cmd] || '',
                    editor:editor,
                    onpickcolor: function (t, color){
                        editor.execCommand(cmd, color);
                    },
                    onpicknocolor: function (){
                        editor.execCommand(cmd, 'default');
                        this.setColor('transparent');
                        this.color = 'default';
                    },
                    onbuttonclick: function (){
                        editor.execCommand(cmd, this.color);
                    }
                });
                editor.addListener('selectionchange', function (){
                    ui.setDisabled(editor.queryCommandState(cmd) == -1);
                });
                return ui;
            };
        }(ci);
    }


    var dialogBtns = {
        noOk : ['searchreplace','help','spechars','webapp'],
        ok : ['attachment','anchor','link', 'insertimage', 'map', 'gmap','insertframe','wordimage',
            'insertvideo','highlightcode','insertframe','edittd']

    };

    for(var p in dialogBtns){
        (function(type,vals){
            for(var i = 0,ci;ci=vals[i++];){
                (function(cmd){
                    editorui[cmd] =function (editor, iframeUrl, title){
                        iframeUrl = iframeUrl || (editor.options.iframeUrlMap||{})[cmd] || iframeUrlMap[cmd];
                        title = title ||editor.options.labelMap[cmd.toLowerCase()] || '';
                        //没有iframeUrl不创建dialog
                        var dialog
                        if(iframeUrl){
                            dialog = new editorui.Dialog( utils.extend({
                                    iframeUrl: editor.ui.mapUrl(iframeUrl),
                                    editor: editor,
                                    className: 'edui-for-' + cmd,
                                    title: title
                                },type == 'ok'?{
                                    buttons: [{
                                        className: 'edui-okbutton',
                                        label: '确认',
                                        onclick: function (){
                                            dialog.close(true);
                                        }
                                    }, {
                                        className: 'edui-cancelbutton',
                                        label: '取消',
                                        onclick: function (){
                                            dialog.close(false);
                                        }
                                    }]
                                }:{}));

                            editor.ui._dialogs[cmd+"Dialog"] = dialog;
                        }

                        var ui = new editorui.Button({
                            className: 'edui-for-' + cmd,
                            title: title,
                            onclick: function (){
                                if(dialog){
                                    if(cmd=="wordimage"){//wordimage需要先判断是否存在word_img属性再确定是否打开
                                        editor.execCommand("wordimage","word_img");
                                        if(editor.word_img){
                                            dialog.render();
                                            dialog.open();
                                        }
                                    }else{
                                        dialog.render();
                                        dialog.open();
                                    }
                                }
                            }
                        });
                        editor.addListener('selectionchange', function (){
                            //只存在于右键菜单而无工具栏按钮的ui不需要检测状态
                            var unNeedCheckState = {'edittd':1,'edittable':1};
                            if(cmd in unNeedCheckState)return;

                            var state = editor.queryCommandState(cmd);
                            ui.setDisabled(state == -1);
                            ui.setChecked(state);
                        });
                        return ui;
                    };
                })(ci.toLowerCase())
            }
        })(p,dialogBtns[p])
    }

    editorui.snapscreen = function(editor, iframeUrl, title){
            title = title || editor.options.labelMap['snapscreen'] || '';
            var ui = new editorui.Button({
                className: 'edui-for-snapscreen',
                title: title,
                onclick: function (){
                    editor.execCommand("snapscreen");
                }
            });

            if(browser.ie){
                iframeUrl = iframeUrl || (editor.options.iframeUrlMap||{})["snapscreen"] || iframeUrlMap["snapscreen"];
                if(iframeUrl){
                    var dialog = new editorui.Dialog({
                        iframeUrl: editor.ui.mapUrl(iframeUrl),
                        editor: editor,
                        className: 'edui-for-snapscreen',
                        title: title,
                        buttons: [{
                            className: 'edui-okbutton',
                            label: '确认',
                            onclick: function (){
                                dialog.close(true);
                            }
                        }, {
                            className: 'edui-cancelbutton',
                            label: '取消',
                            onclick: function (){
                                dialog.close(false);
                            }
                        }]

                    });
                    dialog.render();
                    editor.ui._dialogs["snapscreenDialog"] = dialog;
                }

            }
            editor.addListener('selectionchange',function(){
                ui.setDisabled( editor.queryCommandState('snapscreen') == -1);
            });
            return ui;
        };



    editorui.fontfamily = function (editor, list, title){
        list = list || editor.options['fontfamily'] || [];
        title = title || editor.options.labelMap['fontfamily'] || '';

        for(var i=0,ci,items=[];ci=list[i++];){

            (function(key,val){
                items.push({
                    label: key,
                    value: val,
                    renderLabelHtml: function (){
                        return '<div class="edui-label %%-label" style="font-family:' +
                            utils.unhtml(this.value.join(',')) + '">' + (this.label || '') + '</div>';
                    }
                });
            })(ci[0],ci[1])
        }
        var ui = new editorui.Combox({
            editor:editor,
            items: items,
            onselect: function (t,index){
                editor.execCommand('FontFamily', this.items[index].value);
            },
            onbuttonclick: function (){
                this.showPopup();
            },
            title: title,
            initValue: title,
            className: 'edui-for-fontfamily',
            indexByValue: function (value){
                if(value){
                    for(var i=0,ci;ci=this.items[i];i++){
                        if(ci.value.join(',').indexOf(value) != -1)
                            return i;
                    }
                }

                return -1;
            }
        });
        editor.addListener('selectionchange', function (type, causeByUi, uiReady){
            if(!uiReady){
                var state = editor.queryCommandState('FontFamily');
                if (state == -1) {
                    ui.setDisabled(true);
                } else {
                    ui.setDisabled(false);
                    var value = editor.queryCommandValue('FontFamily');
                    //trace:1871 ie下从源码模式切换回来时，字体会带单引号，而且会有逗号
                    value && (value = value.replace(/['"]/g,'').split(',')[0]);
                    ui.setValue( value);

                }
            }

        });
        return ui;
    };

    editorui.fontsize = function (editor, list, title){
        title = title || editor.options.labelMap['fontsize'] || '';
        list = list || editor.options['fontsize'] || [];
        var items = [];
        for (var i=0; i<list.length; i++) {
            var size = list[i] + 'px';
            items.push({
                label: size,
                value: size,
                renderLabelHtml: function (){
                    return '<div class="edui-label %%-label" style="line-height:1;font-size:' +
                        this.value + '">' + (this.label || '') + '</div>';
                }
            });
        }
        var ui = new editorui.Combox({
            editor:editor,
            items: items,
            title: title,
            initValue: title,
            onselect: function (t,index){
                editor.execCommand('FontSize', this.items[index].value);
            },
            onbuttonclick: function (){
                this.showPopup();
            },
            className: 'edui-for-fontsize'
        });
        editor.addListener('selectionchange', function (type, causeByUi, uiReady){
            if(!uiReady){
                var state = editor.queryCommandState('FontSize');
                if (state == -1) {
                    ui.setDisabled(true);
                } else {
                    ui.setDisabled(false);
                    ui.setValue(editor.queryCommandValue('FontSize'));
                }
            }

        });
        return ui;
    };

    editorui.paragraph = function (editor, list, title){
        title = title || editor.options.labelMap['paragraph'] || '';
        list = list || editor.options['paragraph'] || [];
        for (var i=0,items = []; i<list.length; i++) {
            var item = list[i].split(':');
            var tag = item[0];
            var label = item[1];
            items.push({
                label: label,
                value: tag,
                renderLabelHtml: function (){
                    return '<div class="edui-label %%-label"><span class="edui-for-' + this.value + '">' + (this.label || '') + '</span></div>';
                }
            });
        }
        var ui = new editorui.Combox({
            editor:editor,
            items: items,
            title: title,
            initValue: title,
            className: 'edui-for-paragraph',
            onselect: function (t,index){
                editor.execCommand('Paragraph', this.items[index].value);
            },
            onbuttonclick: function (){
                this.showPopup();
            }
        });
        editor.addListener('selectionchange', function (type, causeByUi, uiReady){
            if(!uiReady){
                var state = editor.queryCommandState('Paragraph');
                if (state == -1) {
                    ui.setDisabled(true);
                } else {
                    ui.setDisabled(false);
                    var value = editor.queryCommandValue('Paragraph');
                    var index = ui.indexByValue(value);
                    if (index != -1) {
                        ui.setValue(value);
                    } else {
                        ui.setValue(ui.initValue);
                    }
                }
            }

        });
        return ui;
    };


    //自定义标题
    editorui.customstyle = function(editor,list,title){
        list = list || editor.options['customstyle'];
        title = title || editor.options.labelMap['customstyle'] || '';
        if(!list)
            return;
        for(var i=0,items = [],t;t=list[i++];){
            (function(ti){
                items.push({
                    label: ti.label,
                    value: ti,
                    renderLabelHtml: function (){
                        return '<div class="edui-label %%-label">' +'<'+ ti.tag +' ' + (ti.className?' class="'+ti.className+'"':"")
                            + (ti.style ? ' style="' + ti.style+'"':"") + '>' + ti.label+"<\/"+ti.tag+">"
                            + '</div>';
                    }
                });
            })(t)

        }

        var ui = new editorui.Combox({
            editor:editor,
            items: items,
            title: title,
            initValue:title,
            className: 'edui-for-customstyle',
            onselect: function (t,index){
                editor.execCommand('customstyle', this.items[index].value);
            },
            onbuttonclick: function (){
                this.showPopup();
            },
            indexByValue: function (value){
                for(var i=0,ti;ti=this.items[i++];){
                    if(ti.label == value){
                        return i-1
                    }
                }
                return -1;
            }
        });
        editor.addListener('selectionchange', function (type, causeByUi, uiReady){
            if(!uiReady){
                var state = editor.queryCommandState('customstyle');
                if (state == -1) {
                    ui.setDisabled(true);
                } else {
                    ui.setDisabled(false);
                    var value = editor.queryCommandValue('customstyle');
                    var index = ui.indexByValue(value);
                    if (index != -1) {
                        ui.setValue(value);
                    } else {
                        ui.setValue(ui.initValue);
                    }
                }
            }

        });
        return ui;
    };
    editorui.inserttable = function (editor, iframeUrl, title){
        iframeUrl = iframeUrl || (editor.options.iframeUrlMap||{})['inserttable'] || iframeUrlMap['inserttable'];
        title = title || editor.options.labelMap['inserttable'] || '';
        if(iframeUrl){
            var dialog = new editorui.Dialog({
                iframeUrl: editor.ui.mapUrl(iframeUrl),
                editor: editor,
                className: 'edui-for-inserttable',
                title: title,
                buttons: [{
                    className: 'edui-okbutton',
                    label: '确认',
                    onclick: function (){
                        dialog.close(true);
                    }
                }, {
                    className: 'edui-cancelbutton',
                    label: '取消',
                    onclick: function (){
                        dialog.close(false);
                    }
                }]

            });
            dialog.render();
            editor.ui._dialogs['inserttableDialog'] = dialog;
        }

        var ui = new editorui.TableButton({
            editor:editor,
            title: title,
            className: 'edui-for-inserttable',
            onpicktable: function (t,numCols, numRows){
                editor.execCommand('InsertTable', {numRows:numRows, numCols:numCols,border:1});
            },
            onmore: function (){
                dialog && dialog.open();
            },
            onbuttonclick: function (){
                dialog && dialog.open();
            }
        });
        editor.addListener('selectionchange', function (){
            ui.setDisabled(editor.queryCommandState('inserttable') == -1);
        });
        return ui;
    };

    editorui.lineheight = function (editor, title){
        var val = editor.options.lineheight;
        for(var i=0,ci,items=[];ci = val[i++];){
            items.push({
                //todo:写死了
                label : ci == '1' ? '默认' : ci,
                value: ci,
                onclick:function(){
                    editor.execCommand("lineheight", this.value);
                }
            })
        }
        var ui = new editorui.MenuButton({
            editor:editor,
            className : 'edui-for-lineheight',
            title : title || editor.options.labelMap['lineheight'] || '',
            items :items,
            onbuttonclick: function (){
                var value = editor.queryCommandValue('LineHeight') || this.value;
                editor.execCommand("LineHeight", value);
            }
        });
        editor.addListener('selectionchange', function (){
            var state = editor.queryCommandState('LineHeight');
            if (state == -1) {
                ui.setDisabled(true);
            } else {
                ui.setDisabled(false);
                var value = editor.queryCommandValue('LineHeight');
                value && ui.setValue((value + '').replace(/cm/,''));
                ui.setChecked(state)
            }
        });
        return ui;
    };

    var rowspacings = ['top','bottom'];
    for(var r=0,ri;ri=rowspacings[r++];){
        (function(cmd){
            editorui['rowspacing' + cmd] = function(editor){
                var val = editor.options['rowspacing'+cmd] ;

                for(var i=0,ci,items=[];ci = val[i++];){
                    items.push({
                        label : ci,
                        value: ci,
                        onclick:function(){
                            editor.execCommand("rowspacing", this.value,cmd);
                        }
                    })
                }
                var ui = new editorui.MenuButton({
                    editor:editor,
                    className : 'edui-for-rowspacing'+cmd,
                    title : editor.options.labelMap['rowspacing'+cmd],
                    items :items,
                    onbuttonclick: function (){
                        var value = editor.queryCommandValue('rowspacing',cmd) || this.value;
                        editor.execCommand("rowspacing", value,cmd);
                    }
                });
                editor.addListener('selectionchange', function (){
                    var state = editor.queryCommandState('rowspacing',cmd);
                    if (state == -1) {
                        ui.setDisabled(true);
                    } else {
                        ui.setDisabled(false);
                        var value = editor.queryCommandValue('rowspacing',cmd);
                        value && ui.setValue((value + '').replace(/%/,''));
                        ui.setChecked(state)
                    }
                });
                return ui;
            }
        })(ri)
    }
    //有序，无序列表
    var lists = ['insertorderedlist','insertunorderedlist'];
    for(var l = 0,cl;cl = lists[l++]; ){
        (function(cmd){
            editorui[cmd] =function (editor){
                var vals = editor.options[cmd],
                    _onMenuClick = function(){
                        editor.execCommand(cmd, this.value);
                    };
                for(var i=0,items=[],ci;ci=vals[i++];){
                    items.push({
                        label : ci[0],
                        value : ci[1],
                        onclick : _onMenuClick
                    })
                }
                var ui = new editorui.MenuButton({
                    editor:editor,
                    className : 'edui-for-'+cmd,
                    title : editor.options.labelMap[cmd] || '',
                    'items' :items,
                    onbuttonclick: function (){
                        var value = editor.queryCommandValue(cmd) || this.value;
                        editor.execCommand(cmd, value);
                    }
                });
                editor.addListener('selectionchange', function (){
                    var state = editor.queryCommandState(cmd);
                    if (state == -1) {
                        ui.setDisabled(true);
                    } else {
                        ui.setDisabled(false);
                        var value = editor.queryCommandValue(cmd);
                        ui.setValue(value);
                        ui.setChecked(state)
                    }
                });
                return ui;
            };
        })(cl)
    }

    editorui.fullscreen = function (editor, title){
        title = title || editor.options.labelMap['fullscreen'] || '';
        var ui = new editorui.Button({
            className: 'edui-for-fullscreen',
            title: title,
            onclick: function (){
                if (editor.ui) {
                    editor.ui.setFullScreen(!editor.ui.isFullScreen());
                }
                this.setChecked(editor.ui.isFullScreen());
            }
        });
        editor.addListener('selectionchange', function (){
            var state = editor.queryCommandState('fullscreen');
            ui.setDisabled(state == -1);
            ui.setChecked(editor.ui.isFullScreen());
        });
        return ui;
    };

    // 表情
    editorui.emotion = function(editor, iframeUrl, title){
        var ui = new editorui.MultiMenuPop({
            title: title || editor.options.labelMap.emotion || '',
            editor: editor,
            className: 'edui-for-emotion',
            iframeUrl: editor.ui.mapUrl(iframeUrl || (editor.options.iframeUrlMap||{})['emotion'] || iframeUrlMap['emotion'])
        });
        editor.addListener('selectionchange', function (){
            ui.setDisabled(editor.queryCommandState('emotion') == -1)
        });
        return ui;
    };

    editorui.autotypeset = function (editor){
        var ui = new editorui.AutoTypeSetButton({
            editor:editor,
            title: editor.options.labelMap['autotypeset'] || '',
            className: 'edui-for-autotypeset',
            onbuttonclick: function (){
                editor.execCommand('autotypeset')
            }
        });
        editor.addListener('selectionchange', function (){
            ui.setDisabled(editor.queryCommandState('autotypeset') == -1);
        });
        return ui;
    };

})();
