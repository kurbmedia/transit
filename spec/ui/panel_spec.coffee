describe 'Toolbar panels', ()->
  
  panel  = new Transit.Panel()
  panel2 = new Transit.Panel()
  item   = new Transit.Deliverable()
  tabs   = null
  panels = null
  tab    = null
  link   = null    
  
  manager = null
  
  beforeEach ()-> 
    manager = Transit.manage(item)
    manager.render()
    panels  = manager.toolBar.$('div.panels')
    tabs    = manager.toolBar.tabBar
  
  describe 'Panels', ()->
    
    describe 'calling Manager.add', ()->
      tab = null
      
      beforeEach ()->
        manager.toolBar.add(panel)
        tab = tabs.tabs[panel.cid]
      
      it 'adds a tab to the tab bar', ()->
        expect(tabs.el)
          .toContain('li')
      
      it 'adds a panel to the panels list', ()->
        expect($('div.transit-panel', panels))
          .toHaveSize(1)
      
      describe 'the added tab', ()->

        it 'contains a link with the panel\'s title', ()->
          expect(tab.find('a'))
            .toHaveText("Detail")

      afterEach ()-> panel.remove()
      
    describe 'calling .remove on a panel', ()->
      
      beforeEach ()->
        manager.toolBar.add(panel)
        panel.remove()
        panels = manager.$('div.panels')
        
      it 'removes the panel', ()->
        expect(panels.find('div.transit-panel'))
          .toHaveSize(0)
          
      it 'removes the associated tab', ()->
        expect($('li', tabs.el))
          .toHaveSize(0)