var EditorExecuteCommand = function(editor,options,txtarea)
{
    this.customSelection = new CustomSelection();   
    this.editor = editor;
    this.txtarea = txtarea;
    this.options = options;
}
EditorExecuteCommand.prototype = {
    execCommandTag : function(command,value)
    {
        if((command == 'bold') && $.browser.opera)
        {
          document.execCommand(command,false,value);
          var x = this.editor.find("b").addBack().contents().filter(function() {
                                        return this.nodeType == 3;
                                    });
            x = this.editor.find("b");
            y = [];
            for(var i=0;i<x.length;i++)
            {
                y.push($(x[i]).contents().filter(function() {
                                        return this.nodeType == 3;
                                    }));
            }
          for(var i=0;i<x.length;i++)
          {
              var range = document.createRange();
              range.selectNode(x[i]);
              window.getSelection().removeAllRanges();
              window.getSelection().addRange(range);
              var html = '<strong>'+$(x[i]).html()+'</strong>';
              console.log('I am going to insert html');
              document.execCommand('insertHTML',false,html);
              
          }
        }
        else if((command == 'foreColor') || (command == 'fontName') || (command == 'fontSize'))
        {
            this.customSelection.restoreSelection(this.selectionObj);
            console.log('I am in exectag font '+command+'  value '+value + ' selection '+window.getSelection());
            document.execCommand('styleWithCSS',false,true);
            document.execCommand(command,false,value);
            document.execCommand('styleWithCSS',false,false);
        }
        else if(command == 'insertHTML')
        {
            this.pasteHtmlAtCaret(value,true);
        }
        else
        {
            document.execCommand(command,false,value);
        }
        this.editor.find('*').attr('class','');
        this.syncCode();        
    },
    pasteHtmlAtCaret : function(html, selectPastedContent) 
    {
        var sel, range;
        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
    
                // Range.createContextualFragment() would be useful here but is
                // only relatively recently standardized and is not supported in
                // some browsers (IE9, for one)
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(), node, lastNode;
                while ( (node = el.firstChild) ) {
                    lastNode = frag.appendChild(node);
                }
                var firstNode = frag.firstChild;
                range.insertNode(frag);
    
                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    if (selectPastedContent) {
                        range.setStartBefore(firstNode);
                    } else {
                        range.collapse(true);
                    }
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if ( (sel = document.selection) && sel.type != "Control") {
            // IE < 9
            var originalRange = sel.createRange();
            originalRange.collapse(true);
            sel.createRange().pasteHTML(html);
            var range = sel.createRange();
            range.setEndPoint("StartToStart", originalRange);
            range.select();
        }
    },
    syncCode : function()
    {
        if(this.options.textarea == true)
        {
            this.txtarea.val(this.editor.html());
        }
    }
    
}
