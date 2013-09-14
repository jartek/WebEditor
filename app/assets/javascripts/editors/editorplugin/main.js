/*
 * Auto-generated content from the Brackets New Project extension.
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global $, window, document */

// Simple jQuery event handler

var Editor = function(area)
{
    //this.ui = new EditorUI(area);
    this.visualEditor = new VisualEditor();
    this.options = {air : true,
                    textarea : true,
                    language : 'english',
                    language_direction : [{'lang':'english','dir':'ltr'},{'lang':'arabic','dir':'rtl'}],
                    toolbar_options : [{'text':'Bold','action':'bold'},
                              {'text':'i','action':'italic'},
                              {'text':'_','action':'underline'},
                              {'text':'H1','action':'formatblock','value':'<H1>'},
                              {'text':'H2','action':'formatblock','value':'<H2>'},
                              {'text':'code','action':'formatblock','value':'<PRE>'},
                              {'text':'""','action':'formatblock','value':'<BLOCKQUOTE>'},
                              {'text':'_','action':'underline'},
                              {'text':'*','action':'insertUnorderedList'},
                              {'text':'1','action':'insertOrderedList'},
                              {'text':'center','action':'justifyCenter'},
                              {'text':'left','action':'justifyLeft'},
                              {'text':'right','action':'justifyRight'},
                              {'text':'full','action':'justifyFull'},
                              {'text':'color','action':'foreColor','value':'green'},
                              {'text':'strike','action':'strikeThrough','value':'green'}],
                   font_options : ['Arial','Georgia','Times New Roman','Tahoma','Verdana'],
                   font_size_options : [{'text':'tiny','value':'1'},
                                        {'text':'small','value':'3'},
                                        {'text':'medium','value':'4'},
                                        {'text':'large','value':'5'},
                                        {'text':'Huge','value':'7'}]};
}
Editor.prototype = {
        init :function(options)
        {   
            if(options.textarea == false)
            {
                this.options.textarea = false;
            }
            if(options.air == false)
            {
                this.options.air = false;
            }
            if(options.wrapper_css)
            {
                this.options.wrapper_css = options.wrapper_css; 
            }
            if(options.language)
            {
                this.options.language = options.language;
            }
            if(options.toolbar == false)
            {
                this.options.toolbar_options = [];
                if(options.toolbar_options)
                {
                    for(var i=0;i<options.toolbar_options.length;i++)
                    {
                        this.options.toolbar_options.push(options.toolbar_options[i]);
                    } 
                }
            }
            else if(options.toolbar_options)
            {
                for(var i=0;i<options.toolbar_options;i++)
                {
                    this.options.toolbar_options.push(options.toolbar_options[i]);
                }    
            }
            if(options.snippets)
            {
                this.options.snippets = options.snippets;
            }
            if(options.mode == 'visual')
            {
                this.visualEditor.init();
            }
            else
            {
                //this.ui.init(this.options);
            }
            
        },
        src_code : function()
        {
             if(this.editor.attr('rel'))
                {
                    this.editor.attr('rel','');
                    this.editor.html(this.editor.text());
                }
                else
                {
                    this.editor.attr('rel','src_code')
                    this.editor.text(this.editor.html());
                }
        },
        selectionHighlight: function()
        {
            this.toolbar.find('*').css('color','white');
            if(($(event.target).closest('strong').length>0)||($(event.target).closest('b').length>0))
             {
                 console.log('I am going to green ');
                 this.toolbar.find('[rel="bold"]').first().css('color','#60d778');
             }
             if(($(event.target).closest('i').length>0)||($(event.target).closest('em').length>0))
             {
                 console.log('I am going to green ');
                 this.toolbar.find('[rel="italic"]').first().css('color','#60d778');
             }
        },
        syncCode : function()
        {
            console.log('I am in syncCode');
            this.txtarea.val(this.editor.html());
        }
}
