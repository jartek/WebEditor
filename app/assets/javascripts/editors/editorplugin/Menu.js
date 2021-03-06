var Menu = function(menu_wrapper)
{
    this.file_panel_wrapper = null;
    this.file_panel = null;
    this.editor = null;
    this.menu_wrapper = menu_wrapper;
    this.menu_wrapper.addClass('menu_wrapper');
    this.codemirror = null;
    this.menu = $('<ul></ul>');
    this.menu_wrapper.append(this.menu);
    this.theme_option = $('<li><a>Themes</a></li>');
    this.theme_dropdown = $('<ul></ul>');
    this.themes = ['neat','night','solarized dark']
    this.save_option = $('<li><a>Save</a><li>');
    this.show_editor = $('<li><a>Visual Editor</a></li>');
    this.show_file_panel = $('<li><a>File Panel</a></li>');
    console.log('I am in menu ceater');
}
Menu.prototype = {
    init : function(codemirror,editor)
    {
        this.editor = editor;
        this.codemirror = codemirror;
        this.ApplyThemes();
        this.SaveOption();
        this.showEditorOption();
        this.showFilePanelOption();
        this.menu.menu({
        position: {at: "left bottom"}
        });
    },
    addFilePanelWrapper : function(file_panel_wrapper)
    {
        this.file_panel_wrapper = file_panel_wrapper;
    },
    filePanel : function(file_panel)
    {
        this.file_panel = file_panel;
    },
    showFilePanelOption : function()
    {
        this.show_file_panel.click($.proxy(function(){
            this.file_panel_wrapper.toggle();
        },this));
        this.menu.append(this.show_file_panel);
    },
    ApplyThemes : function()
    {
        var self = this;
        for(var i=0;i<this.themes.length;i++)
        {
            var temp_theme = $('<li></li>');
            temp_theme.text(this.themes[i]);
            temp_theme.click(function()
                             {
                                 self.codemirror.setOption('theme',$(this).text());
                             });
            this.theme_dropdown.append(temp_theme);
        }
        this.theme_option.append(this.theme_dropdown);
        this.menu.append(this.theme_option);
    },
    showEditorOption : function()
    {
        this.show_editor.click($.proxy(function()
                               {
                                   this.editor.toggle();
                               },this));
        this.menu.append(this.show_editor);
    },
    SaveOption : function()
    {
        this.save_option.click($.proxy(function(){
           var content_data =  this.codemirror.getValue();
           var location = this.file_panel.current_file;
           console.log(location);
          $.ajax({
                type: "POST",  
                url: "/editors/update",
                data: {'content':content_data , 'location':location}
                });
        },this));
        this.menu.append(this.save_option);

    }
}