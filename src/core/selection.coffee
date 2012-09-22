Transit = @Transit || require 'transit'

class Selector
  selection: null
  constructor: ()-> _.bindAll(@)
  
  # Get the window x/y of the cursor
  cursor:()->
    range = @get()
    return null if range is null
    marker = $("<span/>")
    nrange = document.createRange()
    nrange.setStart(range.endContainer, range.endOffset)
    nrange.insertNode(marker.get(0))
    position = marker.offset()
    marker.remove()
    position
    
  get:()->
    selection = null
    if window.getSelection
      internal = window.getSelection()
      selection = if internal.rangeCount > 0 then internal.getRangeAt(0) else null
    else if document.selection && document.selection.createRange
      selection = document.selection.createRange()
    selection

  restore:(sel = null)->
    sel = @selection if sel is null
    return true if sel is null
    if window.getSelection
      internal = window.getSelection()
      internal.removeAllRanges()
      internal.addRange(sel);
    else if document.selection && sel.select
      sel.select()
    @selection = null
    @

  # Save the current dom selection for use later
  save:()-> 
    @selection = @get()
    @selection

Transit.Selection = @Transit.Selection = new Selector()
module?.exports   = Transit.Selection