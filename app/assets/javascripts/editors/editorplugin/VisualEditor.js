var VisualEditor = function()
{
    this.file_panel = null;
    this.file_panel_wrapper = null;
    this.menu_wrapper = $('<div></div>');
    this.menu = null;
    this.iframe = $('<iframe></iframe>');
    this.iframe_attributes = {'width':'100%','height':'100%'};
    this.iframe_wrapper_attributes = {'width':'100%','height':'90%','border':'1px solid black'};
    this.iframe_wrapper = $('<div></div>');
    this.overall_iframe_wrapper = $('<div></div>');
    this.overall_iframe_wrapper_attributes = {'width':'100%','height':'50%','border':'4px solid black','display':'inline-block'};
    this.overall_iframe_wrapper.css(this.overall_iframe_wrapper_attributes);
    this.editor = null;
    this.iframe_wrapper.css(this.iframe_wrapper_attributes);
    this.add_media_size = $('<span style="background-color:#2ba6cb; color:white;">+</span>');
    this.media_size = $('<div></div>');
    this.media_size_attributes = {'height':'5%','width':'100%','background-color':'green'};
    this.media_size_options = [];
    this.media_size.css(this.media_size_attributes);
}
VisualEditor.prototype = {
    init : function()
    {
        this.create_menu();
        this.create_wrappers();
        this.ui = new VisualEditorUI(this.iframe,this.iframe_wrapper,this.media_size_options);
        this.editor = this.ui.init();
        this.editor.css({'position':'fixed','left':'80%','background-color':'#b4b4b4','z-index':'100'});
        this.editor.draggable();
        this.code_editor = new CodeEditor(this.iframe,this.iframe_wrapper,this.editor,this.menu);
        this.file_panel = new FilePanel(this.editor,this.iframe);
        this.file_panel_wrapper = this.file_panel.init();
        this.menu.addFilePanelWrapper(this.file_panel_wrapper);
        this.code_editor.init();
    },
    create_menu : function()
    {
        $('body').html('');
        $('body').append(this.menu_wrapper);
        this.menu = new Menu(this.menu_wrapper);
    },
    add_media_size_option : function()
    {
        this.add_media_size.click($.proxy(function(){
            console.log('I need to add another media query');
            console.log('the width of the iframe is '+this.iframe.css('width'));
            var media_new_rule = $('<div></div>');
            var media_new_rule_attributes = {'background-color':'yellow','height':'100%','width':this.iframe.css('width'),'border':'1px solid white'};
            media_new_rule.css(media_new_rule_attributes);
            console.log('the media sizes is ',this.media_size_options);
            this.media_size_options[this.media_size_options.length-1]['min-width'] = this.iframe.width();
            this.media_size_options[this.media_size_options.length] = {'max-width':this.iframe.width(),'min-width':0};
            console.log('the media sizes is ',this.media_size_options);
            this.media_size.prepend(media_new_rule);
        },this));
        this.overall_iframe_wrapper.prepend(this.add_media_size);
    },
    create_wrappers : function()
    {
        var url = document.URL;
        this.iframe.attr('src',url);
        this.iframe.attr(this.iframe_attributes);
        $('body').append(this.iframe);
        this.iframe.wrap(this.iframe_wrapper);
        this.iframe_wrapper = this.iframe.parent();
        this.iframe_wrapper.wrap(this.overall_iframe_wrapper);
        this.iframe_wrapper.css('width','100%');
        this.overall_iframe_wrapper = this.iframe_wrapper.parent();
        this.overall_iframe_wrapper.prepend(this.media_size);
        this.iframe_wrapper.css('display','inline-block');
        var max = this.iframe.width();
        this.media_size_options[0] = {'max-width': max,'min-width':0};
        this.add_media_size_option();
    }
}