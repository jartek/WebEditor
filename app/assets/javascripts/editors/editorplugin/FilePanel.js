var FilePanel = function(editor,iframe)
{
    this.editor = editor;
    this.iframe = iframe;
    this.filepanel_wrapper = $('<div>sdhfksjhdfkh</div>');
    this.filepanel_wrapper.css({'position':'fixed','left':'0%','top':'0%','background-color':'#b4b4b4','z-index':'100','width':'20%','height':'100%','overflow':'scroll'});
    this.filepanel_wrapper.draggable();
}
FilePanel.prototype = {
    init : function()
    {
        this.addFilePanel();
        return this.filepanel_wrapper;
    },
    addFilePanel : function()
    {
        $('body').append(this.filepanel_wrapper);
        this.filepanel_wrapper.hide();
    }
}