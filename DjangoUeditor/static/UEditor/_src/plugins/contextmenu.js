///import core
///commands 右键菜单
///commandsName  ContextMenu
///commandsTitle  右键菜单
/**
 * 右键菜单
 * @function
 * @name baidu.editor.plugins.contextmenu
 * @author zhanyi
 */
UE.plugins['contextmenu'] = function () {
    var me = this,
        menu,
        items = me.options.contextMenu||[
            {label:'删除',cmdName:'delete'},
            {label:'全选',cmdName:'selectall'},
            {
                label:'删除代码',
                cmdName:'highlightcode',
                icon:'deletehighlightcode'

            },
            {
                label:'清空文档',
                cmdName:'cleardoc',
                exec:function () {

                    if ( confirm( '确定清空文档吗？' ) ) {

                        this.execCommand( 'cleardoc' );
                    }
                }
            },
            '-',
            {
                label:'取消链接',
                cmdName:'unlink'
            },
            '-',
            {
                group:'段落格式',
                icon:'justifyjustify',

                subMenu:[
                    {
                        label:'居左对齐',
                        cmdName:'justify',
                        value:'left'
                    },
                    {
                        label:'居右对齐',
                        cmdName:'justify',
                        value:'right'
                    },
                    {
                        label:'居中对齐',
                        cmdName:'justify',
                        value:'center'
                    },
                    {
                        label:'两端对齐',
                        cmdName:'justify',
                        value:'justify'
                    }
                ]
            },
            '-',
            {
                label:'表格属性',
                cmdName:'edittable',
                exec:function () {
                    this.ui._dialogs['inserttableDialog'].open();
                }
            },
            {
                label:'单元格属性',
                cmdName:'edittd',
                exec:function () {
                    //如果没有创建，创建一下先
                    if(UE.ui['edittd']){
                        new UE.ui['edittd'](this);
                    }
                    this.ui._dialogs['edittdDialog'].open();
                }
            },
            {
                group:'表格',
                icon:'table',

                subMenu:[
                    {
                        label:'删除表格',
                        cmdName:'deletetable'
                    },
                    {
                        label:'表格前插行',
                        cmdName:'insertparagraphbeforetable'
                    },
                    '-',
                    {
                        label:'删除行',
                        cmdName:'deleterow'
                    },
                    {
                        label:'删除列',
                        cmdName:'deletecol'
                    },
                    '-',
                    {
                        label:'前插入行',
                        cmdName:'insertrow'
                    },
                    {
                        label:'前插入列',
                        cmdName:'insertcol'
                    },
                    '-',
                    {
                        label:'右合并单元格',
                        cmdName:'mergeright'
                    },
                    {
                        label:'下合并单元格',
                        cmdName:'mergedown'
                    },
                    '-',
                    {
                        label:'拆分成行',
                        cmdName:'splittorows'
                    },
                    {
                        label:'拆分成列',
                        cmdName:'splittocols'
                    },
                    {
                        label:'合并多个单元格',
                        cmdName:'mergecells'
                    },
                    {
                        label:'完全拆分单元格',
                        cmdName:'splittocells'
                    }
                ]
            },
            {
                label:'复制(ctrl+c)',
                cmdName:'copy',
                exec:function () {
                    alert( "请使用ctrl+c进行复制" );
                },
                query : function(){return 0;}
            },
            {
                label:'粘贴(ctrl+v)',
                cmdName:'paste',
                exec:function () {
                    alert( "请使用ctrl+v进行粘贴" );
                },
                query : function(){return 0;}
            }
        ];
    if(!items.length)return;
    var uiUtils = UE.ui.uiUtils;
    me.addListener('contextmenu',function(type,evt){
        var offset = uiUtils.getViewportOffsetByEvent(evt);
        me.fireEvent('beforeselectionchange');
        if (menu)
            menu.destroy();
        for (var i = 0,ti,contextItems = []; ti = items[i]; i++) {
            var last;
            (function(item) {
                if (item == '-') {
                    if ((last = contextItems[contextItems.length - 1 ] ) && last !== '-')
                        contextItems.push('-');
                } else if (item.group) {

                        for (var j = 0,cj,subMenu = []; cj = item.subMenu[j]; j++) {
                            (function(subItem) {
                                if (subItem == '-') {
                                    if ((last = subMenu[subMenu.length - 1 ] ) && last !== '-')
                                        subMenu.push('-');

                                } else {
                                    if ((me.commands[subItem.cmdName] ||  UE.commands[subItem.cmdName]||subItem.query) &&
                                        (subItem.query ? subItem.query() : me.queryCommandState(subItem.cmdName)) > -1) {
                                        subMenu.push({
                                            'label':subItem.label,
                                            className: 'edui-for-' + subItem.cmdName + (subItem.value || ''),
                                            onclick : subItem.exec ? function() {
                                                subItem.exec.call(me)
                                            } : function() {
                                                me.execCommand(subItem.cmdName, subItem.value)
                                            }
                                        })
                                    }

                                }

                            })(cj)

                        }
                        if (subMenu.length) {
                            contextItems.push({
                                'label' : item.group,
                                className: 'edui-for-' + item.icon,
                                'subMenu' : {
                                    items: subMenu,
                                    editor:me
                                }
                            })
                        }

                } else {
                    //有可能commmand没有加载右键不能出来，或者没有command也想能展示出来添加query方法
                    if ((me.commands[item.cmdName] ||  UE.commands[item.cmdName]||item.query) &&
                        (item.query ? item.query() : me.queryCommandState(item.cmdName)) > -1) {
                        //highlight todo
                        if(item.cmdName == 'highlightcode' && me.queryCommandState(item.cmdName) == 0)
                            return;
                        contextItems.push({
                            'label':item.label,
                            className: 'edui-for-' + (item.icon ? item.icon : item.cmdName + (item.value || '')),
                            onclick : item.exec ? function() {
                                item.exec.call(me)
                            } : function() {
                                me.execCommand(item.cmdName, item.value)
                            }
                        })
                    }

                }

            })(ti)
        }
        if (contextItems[contextItems.length - 1] == '-')
            contextItems.pop();
        menu = new UE.ui.Menu({
            items: contextItems,
            editor:me
        });
        menu.render();
        menu.showAt(offset);
        domUtils.preventDefault(evt);
        if(browser.ie){
            var ieRange;
            try{
                ieRange = me.selection.getNative().createRange();
            }catch(e){
               return;
            }
            if(ieRange.item){
                var range = new dom.Range(me.document);
                range.selectNode(ieRange.item(0)).select(true,true);

            }
        }
    })
};


