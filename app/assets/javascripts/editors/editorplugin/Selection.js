var CustomSelection = function()
{
    this.selectionObj = null;
    this.savedSel = null;
    this.savedSelObj = null;
    this.endRangeNode = null;
    this.endOffset  = null;
    this.startRangeNode = null;
    this.startOffset  = null;
};
CustomSelection.prototype = {
    saveSelection : function() {
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    return sel.getRangeAt(0);
                }
            } else if (document.selection && document.selection.createRange) {
                return document.selection.createRange();
            }
            return null;
    },
    restoreSelection : function(range) {
        if (range) {
            if (window.getSelection) {
                sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                console.log('I am in restireSelection '+sel);
            } else if (document.selection && range.select) {
                range.select();
            }
        }
    },
    saveSelectionContainer : function()
    {
        var temp_range = this.saveSelection();
        console.log('the selection is '+temp_range);
        this.endRangeNode = temp_range.endContainer;
        this.endOffset  = temp_range.endOffset;
        this.startRangeNode = temp_range.startContainer;
        this.startOffset  = temp_range.startOffset;
    },
    restoreSelectionContainer : function()
    {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
            var temp_range = document.createRange();
            temp_range.setStart(this.startRangeNode,this.startOffset);
            temp_range.setEnd(this.endRangeNode,this.endOffset);
            this.restoreSelection(temp_range);
        }
        else if (document.selection)
        {
            document.selection.empty();
            var temp_range = document.selection.createRange();
            temp_range.setStart(this.startRangeNode,this.startOffset);
            temp_range.setEnd(this.endRangeNode,this.endOffset);
            this.restoreSelection(temp_range);
        }
       
    }
}