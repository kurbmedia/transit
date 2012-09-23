describe 'Notify', ()->
  
  it 'has an error method', ()->
    expect(Transit.Notify['error'])
      .to.exist

  it 'has an info method', ()->
    expect(Transit.Notify['info'])
      .to.exist

  it 'has a success method', ()->
    expect(Transit.Notify['success'])
      .to.exist