# describe 'Toolbar panels', ()->
#   
#   panel  = new Transit.Panel()
#   panel2 = new Transit.Panel()
#   item   = new Transit.Deliverable()
#   tabs   = null
#   panels = null
#   link   = null    
#   
#   manager = null
#   
#   beforeEach (done)-> 
#     manager = Transit.manage(item)
#     panels  = manager.toolBar.$('div.panels')
#     tabs    = manager.toolBar.navbar
#     done()
#   
#   describe 'Panels', ()->
#     
#     describe 'when passed to Manager.add', ()->
#       
#       beforeEach (done)->
#         manager.reset()
#         manager.add(panel)
#         done()
#       
#       it 'adds a tab to the tab bar', ()->
#         expect(tabs.find('li'))
#           .to.have.length.above(0)
#       
#       it 'adds a panel to the panels list', ()->
#         expect($('div.transit-panel', panels))
#           .to.have.length.above(0)
#       
#       describe 'the added tab', ()->
# 
#         it 'contains a link with the panel\'s title', ()->
#           expect(tabs.find('a:eq(0)').text())
#             .to.equal("Detail")
# 
#       afterEach ()-> manager.drop(panel)
#       
#     describe 'when passed to manager.drop', ()->
#       
#       before (done)->
#         manager.add(panel)
#         done()
#         manager.drop(panel)
#         panels = manager.$('div.panels')
#         
#       it 'removes the panel', ()->
#         expect(panels.find('div.transit-panel'))
#           .to.have.length(0)
#           
#       it 'removes the associated tab', ()->
#         expect($('li', tabs))
#           .to.have.length(0)