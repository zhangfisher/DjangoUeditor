///import core
///import uicore
(function (){
    var utils = baidu.editor.utils,
        UIBase = baidu.editor.ui.UIBase;

    var AutoTypeSetPicker = baidu.editor.ui.AutoTypeSetPicker = function (options){
        this.initOptions(options);
        this.initAutoTypeSetPicker();
    };
    AutoTypeSetPicker.prototype = {
        initAutoTypeSetPicker: function (){
            this.initUIBase();
        },
        getHtmlTpl: function (){
            var opt = this.editor.options.autotypeset;

            return '<div id="##" class="edui-autotypesetpicker %%">' +
                 '<div class="edui-autotypesetpicker-body">' +
                    '<table >' +
                        '<tr><td colspan="2"><input type="checkbox" name="mergeEmptyline" '+ (opt["mergeEmptyline"] ? "checked" : "" )+'>合并空行</td><td colspan="2"><input type="checkbox" name="removeEmptyline" '+ (opt["removeEmptyline"] ? "checked" : "" )+'>删除空行</td></tr>'+
                        '<tr><td colspan="2"><input type="checkbox" name="removeClass" '+ (opt["removeClass"] ? "checked" : "" )+'>清除样式</td><td colspan="2"><input type="checkbox" name="indent" '+ (opt["indent"] ? "checked" : "" )+'>首行缩进2字</td></tr>'+
                        '<tr><td colspan="2"><input type="checkbox" name="textAlign" '+ (opt["textAlign"] ? "checked" : "" )+'>对齐方式：</td><td colspan="2" id="textAlignValue"><input type="radio" name="textAlignValue" value="left" '+((opt["textAlign"]&&opt["textAlign"]=="left") ? "checked" : "")+'>左对齐<input type="radio" name="textAlignValue" value="center" '+((opt["textAlign"]&&opt["textAlign"]=="center") ? "checked" : "")+'>居中对齐<input type="radio" name="textAlignValue" value="right" '+((opt["textAlign"]&&opt["textAlign"]=="right") ? "checked" : "")+'>右对齐 </tr>'+
                        '<tr><td colspan="2"><input type="checkbox" name="imageBlockLine" '+ (opt["imageBlockLine"] ? "checked" : "" )+'>图片浮动</td>' +
                            '<td colspan="2" id="imageBlockLineValue">' +
                                '<input type="radio" name="imageBlockLineValue" value="none" '+((opt["imageBlockLine"]&&opt["imageBlockLine"]=="none") ? "checked" : "")+'>默认' +
                                '<input type="radio" name="imageBlockLineValue" value="left" '+((opt["imageBlockLine"]&&opt["imageBlockLine"]=="left") ? "checked" : "")+'>左浮动' +
                                '<input type="radio" name="imageBlockLineValue" value="center" '+((opt["imageBlockLine"]&&opt["imageBlockLine"]=="center") ? "checked" : "")+'>独占行居中' +
                                '<input type="radio" name="imageBlockLineValue" value="right" '+((opt["imageBlockLine"]&&opt["imageBlockLine"]=="right") ? "checked" : "")+'>右浮动</tr>'+

                        '<tr><td colspan="2"><input type="checkbox" name="clearFontSize" '+ (opt["clearFontSize"] ? "checked" : "" )+'>清除字号</td><td colspan="2"><input type="checkbox" name="clearFontFamily" '+ (opt["clearFontFamily"] ? "checked" : "" )+'>清除字体</td></tr>'+
                        '<tr><td colspan="4"><input type="checkbox" name="removeEmptyNode" '+ (opt["removeEmptyNode"] ? "checked" : "" )+'>去掉冗余的html代码</td></tr>'+
                        '<tr><td colspan="4"><input type="checkbox" name="pasteFilter" '+ (opt["pasteFilter"] ? "checked" : "" )+'>粘贴过滤 (对每次粘贴的内容应用以上过滤规则)</td></tr>'+
                        '<tr><td colspan="4" align="right"><button >执行</button></td></tr>'+
                    '</table>'+
                 '</div>' +
                '</div>';


        },
        _UIBase_render: UIBase.prototype.render
    };
    utils.inherits(AutoTypeSetPicker, UIBase);
})();
