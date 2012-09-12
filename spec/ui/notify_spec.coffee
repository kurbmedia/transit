describe 'Notify', ()->
  
  it 'has an error method', ()->
    expect(Transit.Notify['error'])
      .toBeDefined()

  it 'has an info method', ()->
    expect(Transit.Notify['info'])
      .toBeDefined()

  it 'has a success method', ()->
    expect(Transit.Notify['success'])
      .toBeDefined()