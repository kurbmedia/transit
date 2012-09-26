describe 'Notify', ()->
  
  notify = new Transit.Notify()
  
  it 'has an error method', ()->
    expect(notify['error'])
      .to.exist

  it 'has an info method', ()->
    expect(notify['info'])
      .to.exist

  it 'has a success method', ()->
    expect(notify['success'])
      .to.exist