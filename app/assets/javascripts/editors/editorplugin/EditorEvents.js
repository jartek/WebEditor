var EditorEvents = function(editor,toolbar,options,Command,customSelection,txtarea)
{
    this.toolbar = toolbar;
    this.editor = editor;
    this.options = options;
    this.Command = Command;
    this.customSelection = customSelection;
    this.pasteCleaner = new EditorPasteCleanUp();
    this.mousedown = false;
    this.mousemove = false;
    this.mousedown_x = this.mousedown_y = 0;
    this.horizontal_option = false;
    this.txtarea = txtarea;
}
EditorEvents.prototype = {
    init : function()
    {    
        /*this.editor.bind('mouseup keyup',function(event)
                         {
                         });*/
    this.keyUp();
    this.keyDown();
    this.dblClick();
    this.mouseDown();
    this.mouseMove();
    this.mouseUp();
    this.paste();               
    },
    keyUp : function()
    {
        this.editor.keyup($.proxy(function(e){
            var key = e.keyCode||e.which;
            if (key === 13 && !e.shiftKey && !e.ctrlKey && !e.metaKey)
            {
                console.log('The enter key was pressed');
            }
            this.syncCode();
        },this));
    },
    keyDown : function()
    {
         this.editor.keydown($.proxy(function(e){
            var key = e.keyCode||e.which;
            if(key==13)
            {
                if(this.horizontal_option)
                {
                    e.preventDefault();
                    this.Command.execCommandTag('insertHorizontalRule',null);
                    this.horizontal_option = false;
                }
                else
                {
                    //e.preventDefault();
                    this.horizontal_option = true;
                }
            }
            else if((key === 73) && (e.ctrlKey || e.metaKey))
            {
                this.horizontal_option = false;
                this.image_upload.trigger('click');
            }
            else if((key === 74) && (e.ctrlKey || e.metaKey))
            {
               this.horizontal_option = false;
               this.src_code();
            }
            else
            {
                this.horizontal_option = false;
            }
            
        },this));
    },
    mouseMove : function()
    {
         this.editor.mousemove($.proxy(function(event)
                         {
                             if(this.mousedown == true)
                             {
                                 this.mousemove = true;
                             }
                        },this));
    },
    mouseDown : function()
    {
         this.editor.mousedown($.proxy(function(event)
                         {
                             if(this.toolbar.is(":visible") && this.options.air)
                             {
                                 this.toolbar.hide();
                             }
                             this.mousedown = true;
                             this.mousedown_x = event.pageX;
                             this.mousedown_y = event.pageY;
                             this.toolbar.find('*').css('color','#2ba6cb');
                         },this));
    },
    mouseUp : function()
    {
        this.editor.mouseup($.proxy(function(event)
                         {
                             //this.selectionHighlight();
                             if((this.mousedown == true) && (this.mousemove == true) && window.getSelection() && this.options.air)
                             {
                                 this.mousemove = false;
                                 this.mousedown = false;
                                 this.mouseup_x = event.pageX;
                                 this.mouseup_y = event.pageY;
                                 this.toolbar.css('position','absolute');
                                 var toolbar_center =(((this.mousedown_x+this.mousedown_y)/2) - (this.toolbar.width()/2));
                                 console.log('the value of the cent is'+toolbar_center);
                                 if(toolbar_center<0)
                                 {
                                     toolbar_center = 0;
                                 }
                                 var toolbar_top = ((this.mousedown_y>this.mouseup_y ? this.mouseup_y : this.mousedown_y)-60);
                                 if(toolbar_top<0)
                                 {
                                     toolbar_top = 0;
                                 }
                                 this.toolbar.css('left',toolbar_center);
                                 this.toolbar.css('top',toolbar_top);
                                 this.toolbar.show();
                                 console.log('there as na selection');
                                 
                             }
                             else
                             {
                                 if(event.target.nodeName.toUpperCase() == 'IMG')
                                 {
                                     console.log('yes');
                                 }
                                 //console.log('the tag is '+event.target.tagName);
                                 this.mousemove = false;
                                 this.mousedown = false;
                             }
                         },this));  
    },
    dblClick : function()
    {
        this.editor.dblclick($.proxy(function(event){
            if(window.getSelection() && this.options.air)
            {
                 this.toolbar.css('position','absolute');
                 this.toolbar.css('left',event.pageX);
                 this.toolbar.css('top',event.pageY+10);
                 this.toolbar.show();
            }
        },this));
    },
    paste : function()
    {
        this.editor.on('paste', $.proxy(function(e)
        {
            this.customSelection.saveSelectionContainer();
            var frag = this.extractContent();
            if($.browser.opera)
            {
                this.editor.append("<span></span>");
            }

            setTimeout($.proxy(function()
            {
                var pastedFrag = this.extractContent();
                this.editor.append(frag);
                var html = this.getFragmentHtml(pastedFrag);
                html = this.pasteCleaner.pasteClean(html);
                console.log('the value of the paste is '+html);
                this.customSelection.restoreSelectionContainer();
                this.Command.execCommandTag('insertHTML',html);
            }, this), 1);
            this.syncCode();
        }, this));    
    },
    cut : function()
    {
        this.editor.on('cut',$.proxy(function(e){
            this.syncCode();
        },this))
    },
    getFragmentHtml: function (fragment)
    {
        var cloned = fragment.cloneNode(true);
        var div = document.createElement('div');
        div.appendChild(cloned);
        return div.innerHTML;
    },
    extractContent: function()
    {   
        var node = this.editor.get(0);
        var frag = document.createDocumentFragment(), child;
        while ((child = node.firstChild))
        {
            frag.appendChild(child);
        }
        return frag;
    },
    syncCode : function()
    {
        if(this.options.textarea == true)
        {
            this.txtarea.val(this.editor.html());
        }
    }
}