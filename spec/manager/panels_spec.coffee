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
    panels = Transit.Manager.Panels
    tabs   = Transit.Manager._tabbar
  
  describe 'Panels', ()->
    
    describe 'calling Manager.add', ()->
      tab = null
      
      beforeEach ()->
        Transit.Manager.add(panel)
        tab = tabs.find("li[data-panel='#{panel.cid}']")
      
      it 'adds a tab to the UI tab bar', ()->
        expect(tabs)
          .toContain('li')
      
      it 'adds a panel to the panels list', ()->
        expect(Transit.Manager.Panels.$el)
          .toContain('div.transit-panel')
      
      describe 'the added tab', ()->
        
        it 'contains a data-panel attribute with the panels cid', ()->
          expect(tabs).toContain(
            "li[data-panel='#{panel.cid}']"
          )
            
        it 'contains a link with the panel\'s title', ()->
          expect(tab.find('a'))
            .toHaveText("Detail")

      afterEach ()-> panel.remove()
      
    describe 'calling .remove on a panel', ()->
      
      beforeEach ()->
        Transit.Manager.Panels.add(panel)
        panel.remove()
      
      it 'removes the panel', ()->
        expect(panels.$('div.transit-panel').length)
          .toEqual(0)
          
      it 'removes the associated tab', ()->
        expect(Transit.Manager.$('ul.transit-tab-bar li').length)
          .toEqual(0)
          
    describe 'selecting a tab', ()->
      
      spies   = 
        active: jasmine.createSpy('activate')
        inactive: jasmine.createSpy('inactive')
      
      beforeEach ()-> 
        Transit.Manager.Panels.add(panel, panel2)
        panel.on('active', spies.active)
        panel2.on('inactive', spies.inactive)
        tab  = $("#panel_tab_#{panel.cid}")
        tab.find('a').click()
        
      afterEach ()-> 
        Transit.Manager.Panels.removeAll()
        panel.off('active')
        panel2.off('inactive')
      
      it 'sets the panel to active', ()->
        expect(panel.active)
          .toEqual(true)
      
      it 'triggers "active" on the panel', ()->
        expect(spies.active)
          .toHaveBeenCalled()
      
      it 'triggers "inactive" on other panels', ()->
        expect(spies.inactive)
          .toHaveBeenCalled()

    describe 'removing panels', ()->
      
      beforeEach ()-> 
        Transit.Manager.Panels.add(panel, panel2)
      
      afterEach ()-> 
        Transit.Manager.Panels.removeAll()
      
      describe 'when .removeAll is called', ()->
        
        beforeEach ()->
          Transit.Manager.Panels.removeAll()
        
        it 'removes all panels', ()->
          expect(Transit.Manager.Panels.panels)
            .toBeEmpty()
            
      describe 'when removing a single panel', ()->
        
        tab  = null
        tab2 = null
        
        beforeEach ()-> 
          Transit.Manager.Panels.removeAll()
          Transit.Manager.Panels.add(panel, panel2)
          Transit.Manager.Panels.remove(panel)
          tab  = $("#panel_tab_#{panel.cid}")
          tab2 = $("#panel_tab_#{panel2.cid}")
        
        it 'removes the number of panels passed', ()->
          expect(Transit.Manager.Panels.panels)
            .toHaveSize(1)
        
        it 'removes the passed panel', ()->
          expect(Transit.Manager.Panels.panels[0])
            .toBe(panel2)
        
        it 'removes the tab for the panel', ()->
          expect(tab).toHaveSize(0)
          
        it 'does not remove tabs for other panels', ()->
          expect(tab2).toHaveSize(1)
    