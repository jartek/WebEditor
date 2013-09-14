var EditorPasteCleanUp = function()
{
    this.cleaner = $('<div></div>');
}
EditorPasteCleanUp.prototype = {
    pasteClean: function(html)
    {
        // remove comments and php tags
        html = html.replace(/<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi, '');
    
        // remove nbsp
        html = html.replace(/(&nbsp;){2,}/gi, '&nbsp;');
        html = html.replace(/&nbsp;/gi, ' ');
    
        // remove google docs marker
        html = html.replace(/<b\sid="internal-source-marker(.*?)">([\w\W]*?)<\/b>/gi, "$2");
        
        html = html.replace(/\[td\]/gi, '<td>&nbsp;</td>');
        html = html.replace(/\[a href="(.*?)"\]([\w\W]*?)\[\/a\]/gi, '<a href="$1">$2</a>');
        html = html.replace(/\[iframe(.*?)\]([\w\W]*?)\[\/iframe\]/gi, '<iframe$1>$2</iframe>');
        html = html.replace(/\[video(.*?)\]([\w\W]*?)\[\/video\]/gi, '<video$1>$2</video>');
        html = html.replace(/\[audio(.*?)\]([\w\W]*?)\[\/audio\]/gi, '<audio$1>$2</audio>');
        html = html.replace(/\[embed(.*?)\]([\w\W]*?)\[\/embed\]/gi, '<embed$1>$2</embed>');
        html = html.replace(/\[object(.*?)\]([\w\W]*?)\[\/object\]/gi, '<object$1>$2</object>');
        html = html.replace(/\[param(.*?)\]/gi, '<param$1>');
        html = html.replace(/\[img(.*?)\]/gi, '<img$1>');
        html = html.replace(/<div(.*?)>([\w\W]*?)<\/div>/gi, '<p>$2</p>');
        html = html.replace(/<\/div><p>/gi, '<p>');
        html = html.replace(/<\/p><\/div>/gi, '</p>');
        
        html = this.cleanParagraphy(html);
        var boldTag = 'strong';

        var italicTag = 'em';

        html = html.replace(/<span style="font-style: italic;">([\w\W]*?)<\/span>/gi, '<' + italicTag + '>$1</' + italicTag + '>');
        html = html.replace(/<span style="font-weight: bold;">([\w\W]*?)<\/span>/gi, '<' + boldTag + '>$1</' + boldTag + '>');

        html = html.replace(/<strong>([\w\W]*?)<\/strong>/gi, '<b>$1</b>');
        html = html.replace(/<em>([\w\W]*?)<\/em>/gi, '<i>$1</i>');

        html = html.replace(/<strike>([\w\W]*?)<\/strike>/gi, '<del>$1</del>');
        
        
        this.cleaner.html(html);
        this.cleaner.find('*').each(function()
                                    {
                                        style = $(this).attr('style');
                                        $(this).attr('style','');
                                        if(style)
                                        {
                                            var parts = style.split(";")
                                            var style_obj = {'font-family':'','font-size':'','color':''};
                                            for (var i=0;i<parts.length;i++) {
                                              var subParts = parts[i].split(':');
                                              if(subParts[0] == 'text-indent')
                                              {
                                                  console.log('We have a text indent???????>>>>>>>>>>>>>>>>>>>>>>>>');
                                              }
                                              if(subParts[0] == 'font-family')
                                              {
                                                $(this).css('font-family',subParts[1]);
                                              }
                                              else if(subParts[0] == 'color')
                                              {
                                                $(this).css('color',subParts[1]);
                                              }
                                              else if(subParts[0] == 'font-size')
                                              {
                                                $(this).css('font-size',subParts[1]);
                                              }
                                            }
                                            console.log('the value of the style is '+$(this).attr('style'));
                                        }
                                    });
        this.cleaner.find("*:empty").remove();
                                        
        console.log('the value of the html is '+this.cleaner.html());
        return this.cleaner.html();
    
    },
    cleanParagraphy: function(html)
    {
        html = $.trim(html);
        if (html === '' || html === '<p></p>') return html;

        html = html + "\n";

        var safes = [];
        var z = 0;

        if (html.search(/<(table|div|pre|object)/gi) !== -1)
        {
            $.each(html.match(/<(table|div|pre|object)(.*?)>([\w\W]*?)<\/(table|div|pre|object)>/gi), function(i,s)
            {
                z++;
                safes[z] = s;
                html = html.replace(s, '{replace' + z + '}\n');
            });
        }

        // comments safe
        html = html.replace(/<\!\-\-([\w\W]*?)\-\->/gi, "<comment>$1</comment>");

        html = html.replace(/<br \/>\s*<br \/>/gi, "\n\n");

        function R(str, mod, r)
        {
            return html.replace(new RegExp(str, mod), r);
        }

        var blocks = '(comment|html|body|head|title|meta|style|script|link|iframe|table|thead|tfoot|caption|col|colgroup|tbody|tr|td|th|div|dl|dd|dt|ul|ol|li|pre|select|option|form|map|area|blockquote|address|math|style|p|h[1-6]|hr|fieldset|legend|section|article|aside|hgroup|header|footer|nav|figure|figcaption|details|menu|summary)';

        html = R('(<' + blocks + '[^>]*>)', 'gi', "\n$1");
        html = R('(</' + blocks + '>)', 'gi', "$1\n\n");
        html = R("\r\n", 'g', "\n");
        html = R("\r", 'g', "\n");
        html = R("/\n\n+/", 'g', "\n\n");

        var htmls = html.split(new RegExp('\n\s*\n', 'g'), -1);

        html = '';
        for (var i in htmls)
        {
            if (htmls.hasOwnProperty(i))
            {
                if (htmls[i].search('{replace') == -1)
                {
                    html += '<p>' +  htmls[i].replace(/^\n+|\n+$/g, "") + "</p>";
                }
                else html += htmls[i];
            }
        }

        // blockquote
        if (html.search(/<blockquote/gi) !== -1)
        {
            $.each(html.match(/<blockquote(.*?)>([\w\W]*?)<\/blockquote>/gi), function(i,s)
            {
                var str = '';
                str = s.replace('<p>', '');
                str = str.replace('</p>', '<br>');
                html = html.replace(s, str);
            });
        }

        html = R('<p>\s*</p>', 'gi', '');
        html = R('<p>([^<]+)</(div|address|form)>', 'gi', "<p>$1</p></$2>");
        html = R('<p>\s*(</?' + blocks + '[^>]*>)\s*</p>', 'gi', "$1");
        html = R("<p>(<li.+?)</p>", 'gi', "$1");
        html = R('<p>\s*(</?' + blocks + '[^>]*>)', 'gi', "$1");

        html = R('(</?' + blocks + '[^>]*>)\s*</p>', 'gi', "$1");
        html = R('(</?' + blocks + '[^>]*>)\s*<br />', 'gi', "$1");
        html = R('<br />(\s*</?(?:p|li|div|dl|dd|dt|th|pre|td|ul|ol)[^>]*>)', 'gi', '$1');
        html = R("\n</p>", 'gi', '</p>');

        html = R('</li><p>', 'gi', '</li>');
        //html = R('</ul><p>(.*?)</li>', 'gi', '</ul></li>');
        html = R('</ol><p>', 'gi', '</ol>');
        html = R('<p>\t?\n?<p>', 'gi', '<p>');
        html = R('</dt><p>', 'gi', '</dt>');
        html = R('</dd><p>', 'gi', '</dd>');
        html = R('<br></p></blockquote>', 'gi', '</blockquote>');

        $.each(safes, function(i,s)
        {
            html = html.replace('{replace' + i + '}', s);
        });

        // comments safe
        html = html.replace(/<comment>([\w\W]*?)<\/comment>/gi, '<!--$1-->');

        return $.trim(html);
    }
}