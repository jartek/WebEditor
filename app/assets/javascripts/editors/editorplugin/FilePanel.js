var FilePanel = function(editor,iframe,structure)
{
    this.editor = editor;
    this.iframe = iframe;
    this.structure = structure;
    this.file_panel = $('<ul></ul>');
    this.filepanel_wrapper = $('<div></div>');
    this.filepanel_wrapper.css({'position':'fixed','left':'0%','top':'0%','background-color':'#b4b4b4','z-index':'100','width':'20%','height':'100%','overflow':'scroll'});
    this.filepanel_wrapper.draggable();
    this.codemirror = null;
    this.current_file = null;
}
FilePanel.prototype = {
    init : function()
    {
        this.addFilePanel();
        this.createFileTree();
        this.filepanel_wrapper.append(this.file_panel);
        this.file_panel.menu();
        return this.filepanel_wrapper;
    },
    codeMirror : function(codemirror)
    {
        this.codemirror = codemirror;
    },
    addFilePanel : function()
    {
        $('body').append(this.filepanel_wrapper);
        this.filepanel_wrapper.hide();
    },
    createFileTree : function()
    {
        var self = this;
        for(var i=0;i<this.structure.length;i++)
        {
            var temp_li  = $('<li></li>');
            var temp_a = $('<a></a>');
            var file_name = this.structure[i];
            temp_a.html(file_name);
            temp_li.append(temp_a);
            temp_a.click(function()
            {
                var element = $(this);
                if($(this).text().indexOf('.') != -1)
                {
                    console.log($(this).text());
                    self.current_file = $(this).text();
                    $.ajax({
                        type : 'POST',
                        dataType : 'json',
                        url : '/editors/get_file_content',
                        data : {"file_path" : $(this).text()},
                        success : function(data){
                            console.log(data);
                            console.log(self.editor);
                            self.codemirror.setValue(data);
                        }
                    });
                }
                else{
                    console.log($(this).text());
                    console.log(file_name);
                    $.ajax({
                        type : 'POST',
                        dataType : 'json',
                        url : '/editors/get_files',
                        data : {"path" : $(this).text()},
                        success : function(data){
                            console.log(data)
                            self.createFileStructure(element,data);
                        }
                    });
                }
            });
            this.file_panel.append(temp_li);
        }      
    },
    createFileStructure : function(element,data)
    {
        var self = this;
        //data = JSON.parse(data).split(',');
        var file_panel_temp = $('<ul></ul>');
        for(var i=0;i<data.length;i++)
        {
            var temp_li  = $('<li></li>');
            var temp_a = $('<a></a>');
            var file_name = data[i];
            temp_a.html(file_name);
            temp_li.append(temp_a);
            temp_a.click(function()
            {
                var element = $(this);
                if($(this).text().indexOf('.') != -1)
                {

                }
                else{
                    $.ajax({
                        type : 'POST',
                        dataType : 'json',
                        url : '/editors/get_files',
                        data : { "path" : file_name},
                        success : function(data){
                            self.createFileStructure(element,data);
                        }
                    });
                }
            });
            file_panel_temp.append(temp_li);
            element.append(file_panel_temp);
        }      

    }
}