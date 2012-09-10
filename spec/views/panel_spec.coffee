describe 'Manager panels', ()->
  
  panel  = new Transit.Panel()
  panel2 = new Transit.Panel()
  item   = new Transit.Deliverable()
  tabs   = null
  panels = null
  tab    = null
  link   = null    
  
  beforeEach ()-> 
    Transit.init(item)
    panels = Transit.Manager.$('div.panels')
    tabs   = Transit.Manager.tabBar
    Transit.Manager.panels = []
  
  describe 'Panels', ()->
    
    describe 'calling Manager.add', ()->
      tab = null
      
      beforeEach ()->
        Transit.Manager.add(panel)
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
        Transit.Manager.add(panel)
        panel.remove()
        panels = Transit.Manager.$('div.panels')
        
      it 'removes the panel', ()->
        expect(panels.find('div.transit-panel'))
          .toHaveSize(0)
          
      it 'removes the associated tab', ()->
        expect($('li', tabs.el))
          .toHaveSize(0)