var EditorUI = function(area)
{
    this.options = null;
    this.customSelection = new CustomSelection();
    this.Command  = null;
    this.editorEvents = null;
    this.wrapper_editor = $('<div></div>');
    this.txtarea = $(area);
    this.editor = null;
    this.image_upload = null;
    this.toolbar_css_properties = {};
    this.toolbar_options_css_properties = {'border':'none'};
    this.link_input_css_properties = {'padding':'10px','color':'black !important'};
    this.link_input_attr_properties = {'placeholder':'Type your link here'};
    this.link_input = $('<input type="text">');
    this.table_row_input = $('<input type="text">');
    this.table_column_input = $('<input type="text">');
    this.table_row_list = $('<li></li>');
    this.table_column_list = $('<li></li>');
    this.table_input_button_ok = $('<button>Create<button>');
    this.table_input_button_cancel = $('<button>Cancel<button>');
    this.table_wrapper = $('<ul></ul>');
    this.link_url = $('<input>');
    this.link_url_label = $('<label>');
    this.link_mail = $('<input>');
    this.link_mail_label = $('<label>');
    this.toolbar = $('<div></div>');
    this.toolbar_option_list = $('<ul></ul>');
    this.link_wrapper = $('<ul></ul>');
}
EditorUI.prototype = {
    init : function(options)
    {
        this.options = options;
        console.log('the value of the text area is '+this.options.textarea);
        if(this.options.textarea == true)
        {
            this.create_editor(false);
        }
        else
        {
            this.create_editor(this.txtarea);
        }
        this.create_toolbar();
        this.toolbar.addClass('toolbar');
        this.wrapper_editor.attr('class','editor_wrapper');
        this.wrapper_editor.addClass('small-11 columns');
        this.editor.wrap(this.wrapper_editor);
        this.wrapper_editor = this.editor.parent();
        this.wrapper_editor.prepend(this.toolbar);
        if(this.options.textarea == true)
        {
            $(this.txtarea).hide().after(this.wrapper_editor);
        }
        this.Command  = new EditorExecuteCommand(this.editor);
        if(this.options.textarea == true)
        {
            this.Command  = new EditorExecuteCommand(this.editor,this.options,this.txtarea);
            this.editorEvents = new EditorEvents(this.editor,this.toolbar,this.options,this.Command,this.customSelection,this.txtarea);
        }
        else
        {
            this.Command  = new EditorExecuteCommand(this.editor,this.options,null);
            this.editorEvents = new EditorEvents(this.editor,this.toolbar,this.options,this.Command,this.customSelection,null);    
        }
        this.editorEvents.init();
        if(this.options.wrapper_css)
        {
            this.wrapper_editor.attr(this.options.wrapper_css);
            console.log('I am in wrapper css ',this.wrapper_editor);
        }
        if(this.editor.is(':empty'))
        {
            var init_value = $('<p></p>'); 
            init_value.html('&nbsp;');
            this.editor.append(init_value);
        }
        this.exit_editor();
    },
    create_editor : function(editor)
    {
        if(editor == false)
        {
            this.editor = $('<div></div>');   
        }
        else
        {
            this.editor = editor;
        }
        this.editor.attr('contenteditable','true');
        this.editor.addClass('editor');
        for(var i=0;i<this.options.language_direction.length;i++)
        { 
            console.log('The value of the chosen lang is '+this.options.language);
            if(this.options.language == this.options.language_direction[i].lang)
            {
                console.log('I am in the landguages ',this.options.language_direction[i]);
                this.editor.attr('dir',this.options.language_direction[i].dir);
                i = this.options.language_direction.length;
            }
        }
        if(this.options.editor_css)
        {
            this.editor.css(this.options.editor_css);
        }
    },
    exit_editor : function()
    {
        var editor_exit = $('<li></li>');
        var editor_exit_button = this.create_options_toolbar_common('Exit','Exit');
        editor_exit.append(editor_exit_button);
        editor_exit_button.click($.proxy(function(){
            if(this.options.textarea == true)
            {
                this.wrapper_editor.remove();
                this.txtarea.show();
            }
            else
            {
                this.editor.attr('contenteditable','false');
                this.wrapper_editor.replaceWith(this.editor);
            }
        },this));
        this.toolbar_option_list.append(editor_exit);
    },
    create_toolbar : function()
    {
        this.toolbar_option_list.addClass('toolbar_option_list');
        this.toolbar.append(this.toolbar_option_list);
        for(var i=0;i<this.options.toolbar_options.length;i++)
        {
            if(!this.options.toolbar_options[i].value)
            {
                this.create_option_toolbar(this.options.toolbar_options[i].text,this.options.toolbar_options[i].action,null);
            }
            else
            {
                this.create_option_toolbar(this.options.toolbar_options[i].text,this.options.toolbar_options[i].action,this.options.toolbar_options[i].value);
            }
            
        }
        this.toolbar.append(this.toolbar_option_list);        
        this.create_toolbar_option_link('link','createLink');
        this.create_toolbar_option_table('Table','insertHTML');
        /*if(this.options.snippets)
        {
            this.create_snippets_toolbar_options();
        }*/
        this.build_font_chooser();
        this.build_font_size_chooser();
        if(this.options.air)
        {
            this.toolbar.hide();
        }
        else
        {
            this.toolbar.addClass('hidden');
        }
    },
    create_options_toolbar_common : function(text,action)
    {
        var variable = $('<button></button>');
        variable.text(text);
        variable.addClass('toolbar_option')
        variable.css(this.toolbar_options_css_properties);
        variable.data('value',action);
        return variable;
    },
    create_option_toolbar : function(text,action,value)
    {
       var variable  = this.create_options_toolbar_common(text,action);
       variable.click($.proxy(function(event){
            this.Command.execCommandTag(action,value);
            variable.css('color','#60d778');
         },this,variable,value));
        var toolbar_option_wrapper = $('<li></li>');
        toolbar_option_wrapper.append(variable);
        this.toolbar_option_list.append(toolbar_option_wrapper);
    },
    create_toolbar_option_link : function(text,action)
    {
        var text = text;var action = action;
        var self = this;
        this.link_url.attr('type','radio');
        this.link_mail.attr('type','radio');
        this.link_url.attr('name','editor_link_type');
        this.link_url.attr('value','url');
        this.link_mail.attr('name','editor_link_type');
        this.link_url_label.html('url');
        this.link_mail_label.html('mail');
        this.link_mail.attr('value','mail');
        this.link_wrapper.addClass('toolbar_option_list');
        var list_element_input = $('<li></li>');
        list_element_input.append(this.link_input);
        var list_element_url = $('<li></li>');
        list_element_url.append(this.link_url);
        var list_element_url_label = $('<li></li>');
        list_element_url_label.append(this.link_url_label);
        var list_element_mail = $('<li></li>');
        list_element_mail.append(this.link_mail);
        var list_element_mail_label = $('<li></li>');
        list_element_mail_label.append(this.link_mail_label);
        this.link_wrapper.append(list_element_input);
        this.link_wrapper.append(list_element_url);
        this.link_wrapper.append(list_element_url_label);
        this.link_wrapper.append(list_element_mail);
        this.link_wrapper.append(list_element_mail_label);
        this.link_input.addClass('input_link');
        this.link_input.keydown($.proxy(function(event){
            var key = event.keyCode;
            console.log('the value of the selection is '+this.link_input.val());
            if(key == 13)
            {
                event.preventDefault();
                this.toolbar.children().show();
                this.link_wrapper.hide();      
                var url_type = $('input[name="editor_link_type"]:checked').val();
                console.log('The type of url is '+url_type);
                var value = this.link_input.val() ? this.link_input.val() : '#';
                 if(url_type == 'mail')
                {
                    value = 'mailto:'+value;
                }
                var temp_range = document.createRange();
                temp_range.setStart(this.startRangeNode,this.startOffset);
                temp_range.setEnd(this.endRangeNode,this.endOffset);
                this.customSelection.restoreSelection(temp_range);
                console.log('The restored selection is '+window.getSelection());
                this.Command.execCommandTag('createLink',value);
                this.link_input.val('');
            }
            else if(key == 27)
            {
                this.link_input.val('');
                this.link_wrapper.hide();
                this.toolbar_option_list.show();
                this.link_input.val('');
            } 
        },this));
        var variable  = this.create_options_toolbar_common(text,action);
        variable.click($.proxy(function(event){
            var temp_range = this.customSelection.saveSelection();
            console.log('the selection is '+temp_range);
            this.endRangeNode = temp_range.endContainer;
            this.endOffset  = temp_range.endOffset;
            this.startRangeNode = temp_range.startContainer;
            this.startOffset  = temp_range.startOffset;
            this.toolbar_option_list.hide();
            this.link_wrapper.show();
            this.link_input.focus();
         },this,variable));
        var toolbar_option_wrapper = $('<li></li>');
        toolbar_option_wrapper.append(variable);
        this.toolbar_option_list.append(toolbar_option_wrapper);  
        this.link_input.css(this.link_input_css_properties);
        this.link_input.attr(this.link_input_attr_properties);
        this.link_wrapper.append(this.link_input);
        this.link_wrapper.hide();
        this.toolbar.append(this.link_wrapper);
    },
    build_font_chooser : function()
    {
        this.font_wrapper = $('<li></li>');
        this.font_button_parent = this.create_options_toolbar_common('font','font');
        this.font_buttons_wrapper = $('<ul></ul>');
        this.font_buttons_wrapper.addClass('toolbar_option_list');
        this.create_font_options();
        this.font_wrapper.append(this.font_button_parent);
        this.toolbar.append(this.font_buttons_wrapper);
        this.font_buttons_wrapper.hide();
        this.font_button_parent.click($.proxy(function()
                                      {
                                          this.selectionObj = this.customSelection.saveSelection(); 
                                          console.log('The value of the selection is '+this.selectionObj);
                                          this.toolbar_option_list.hide();
                                          this.font_buttons_wrapper.show();
                                      },this));
        this.toolbar_option_list.append(this.font_wrapper);
    },
    build_font_size_chooser : function()
    {
        this.font_size_wrapper = $('<li></li>');
        this.font_size_button_parent = this.create_options_toolbar_common('size','size');
        this.font_size_buttons_wrapper = $('<ul></ul>');
        this.font_size_buttons_wrapper.addClass('toolbar_option_list');
        this.create_font_size_options();
        this.font_size_wrapper.append(this.font_size_button_parent);
        this.toolbar.append(this.font_size_buttons_wrapper);
        this.font_size_buttons_wrapper.hide();
        this.font_size_button_parent.click($.proxy(function()
                                      {
                                          this.selectionObj = this.customSelection.saveSelection(); 
                                          console.log('The value of the selection is '+this.selectionObj);
                                          this.toolbar_option_list.hide();
                                          this.font_size_buttons_wrapper.show();
                                      },this));
        this.toolbar_option_list.append(this.font_size_wrapper);
    },
    create_font_options : function()
    {
        for(var i=0;i<this.options.font_options.length;i++)
        {
            var font = this.options.font_options[i];
             console.log('the vlue og the font in the create is '+font);
            var variable = this.create_options_toolbar_common(this.options.font_options[i],this.options.font_options[i]);
            var self = this;
            variable.click(function()
                           {
                               console.log('the vlue og the font in the click is '+font);
                               self.Command.execCommandTag('fontName',$(this).data('value'));
                               self.toolbar_option_list.show();
                               self.font_buttons_wrapper.hide();
                           });
            var list_element = $('<li></li>');
            list_element.append(variable);
            this.font_buttons_wrapper.append(list_element);
        }  
    },
    create_font_size_options : function()
    {
        for(var i=0;i<this.options.font_size_options.length;i++)
        {
            var font_size = this.options.font_size_options[i];
            var variable = this.create_options_toolbar_common(this.options.font_size_options[i].text,this.options.font_size_options[i].value);
            var self = this;
            variable.click(function()
                           {
                               self.Command.execCommandTag('fontSize',$(this).data('value'));
                               self.toolbar_option_list.show();
                               self.font_size_buttons_wrapper.hide();
                           });
            var list_element = $('<li></li>');
            list_element.append(variable);
            this.font_size_buttons_wrapper.append(list_element);
        }  
    },
    create_snippets_toolbar_options : function()
    {
        for(var i=0;i<this.options.snippets.length;i++)
        {
            this.create_snippet_option(this.options.snippets[i]);
        }  
    },
    create_snippet_option : function(snippet)
    {
        var snippet_button = this.create_options_toolbar_common(snippet.name);
        var value = snippet.value;
        var editable = snippet.editable ? snippet.editable : true;
        snippet_button.click($.proxy(function(event){
            if (window.getSelection) {
                    sel = window.getSelection();
                    if (sel.getRangeAt && sel.rangeCount) {
                        range = sel.getRangeAt(0);
                        range.deleteContents();
                        var snippet = $(value);
                        console.log('The value of the editable i s'+editable);
                        if(editable == true)
                        {
                            snippet.attr('contenteditable','true');
                            console.log('I am in true');
                        }
                        else
                        {
                            snippet.attr('contenteditable','false'); 
                            console.log('I am in false');
                        }
                        range.insertNode(snippet.get(0));
                    }
                } else if (document.selection && document.selection.createRange) {
                    document.selection.createRange().text = text;
                }
             
        },this,snippet_button,value,editable));
        var toolbar_option_wrapper = $('<li></li>');
        toolbar_option_wrapper.append(snippet_button);
        this.toolbar_option_list.append(toolbar_option_wrapper);
        this.toolbar.append(this.toolbar_option_list);     
    },
    create_toolbar_option_table : function(text,action)
    {
        var text = text;var action = action;
        var self = this;
        this.table_row_input.attr('placeholder','enter the no of rows');
        this.table_column_input.attr('placeholder','enter the no of columns');
        this.table_row_list.append(this.table_row_input);
        this.table_column_list.append(this.table_column_input);
        this.table_wrapper.append(this.table_row_list);
        this.table_wrapper.append(this.table_column_list);
        this.table_wrapper.addClass('toolbar_option_list');
        this.table_input_button_cancel.addClass('toolbar_options');
        this.table_input_button_ok.addClass('toolbar_options');
        this.table_input_button_ok.click($.proxy(function(){
            if((this.table_row_input.val() == 0) || (this.table_column_input.val() == 0))
            {
                alert('input cannot be 0');
            }
            else
            {
                var row = this.table_row_input.val();
                var column = this.table_column_input.val();
                var html = this.createTable(row,column);
                this.customSelection.restoreSelectionContainer();
                this.Command.execCommandTag('insertHTML',html);
                this.table_row_input.val('');
                this.table_column_input.val('');
                this.table_wrapper.hide();
                this.toolbar_option_list.show();    
            }
        },this));
        this.table_input_button_cancel.click($.proxy(function(){
            this.table_row_input.val('');
            this.table_column_input.val('');
            this.table_wrapper.hide();
            this.toolbar_option_list.show();    
        },this));
        this.table_wrapper.append(this.table_input_button_ok);
        this.table_wrapper.append(this.table_input_button_cancel);
        this.toolbar.append(this.table_wrapper);
        this.table_wrapper.hide();
        var variable  = this.create_options_toolbar_common(text,action);
        variable.click($.proxy(function(event){
            this.customSelection.saveSelectionContainer();
            this.toolbar_option_list.hide();
            this.table_wrapper.show();
            this.table_row_input.focus();
         },this,variable));
        var toolbar_option_wrapper = $('<li></li>');
        toolbar_option_wrapper.append(variable);
        this.toolbar_option_list.append(toolbar_option_wrapper);  
    },
    createTable : function(row,column)
    {
        var temp_div = $('<div></div>');
        var table = $('<table></table>');
        temp_div.append(table);
        for(var i=0;i<row;i++)
        {
            var row_element = $('<tr></tr>');
            table.append(row_element);
            for(var j=0;j<column;j++)
            {
                var column_element = $('<td></td>');
                column_element.html('&nbsp');
                row_element.append(column_element);          
            }
        }
        return temp_div.html();
    }
}

