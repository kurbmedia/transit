Transit  = @Transit or require('transit')

class Transit.ui.Datepicker extends Transit.View
  days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  month: null
  selected: null
  body: null
  events:
    'click tbody td a' : 'choose'

  constructor:(options)->
    @selected = @options.selected || new Date()
    @month = new MonthView(@selected)
    delete @options.selected
    super
  
  initialize:()->
    real = $('<div class="transit-datepicker"></div>')
    @$el.wrap(real)
    @setElement(@$el.parent('div.transit-datepicker'))
    @render()
  
  afterRender:()=>
    @$('tbody').empty()
    track = @month.clone(@month.dstart)
    count = 1
    row   = $("<tr></tr>")
    while track <= @month.dend
      item = $("<td></td>")
      link = $("<a>#{track.getDate()}</a>")
      link.data('datepicker_date', track)
      item.append(link)
      item.addClass('prev') if track < @month.start
      item.addClass('next') if track >= @month.end
      if @month.clearTime(track).getTime() is @month.clearTime(new Date()).getTime()
        item.addClass('today')

      row.append(item)
      count = count+1

      if count is 7
        @$('tbody').append(row)
        row   = $("<tr></tr>")
        count = 1

      @month.addDays(track, 1)

  choose: (event)->
    choice = $(event.currentTarget).data('datepicker_date')
    @selected = choice
    @month.setup(choice)
    @trigger('choose', [choice])
    
  prev:(event)=>
    event?.preventDefault()
    @date = @month.addMonths(@date, -1)
    @render()
    
  next:(event)=>
    event?.preventDefault()
    @date = @month.addMonths(@date, 1)
    @render()
  
  helpers:()->
    dayNames: @days
    month: @days[@month.start.getMonth()]
    year: @month.start.getFullYear()


class MonthView
  start: 0
  end: 0
  dstart: 0
  dend: 0
  
  constructor: (date)-> @setup(date)

  addMonths:(d, n, keepTime)=>
    if (+d)
      m = d.getMonth() + n
      check = @clone(d)
      check.setDate(1)
      check.setMonth(m)
      d.setMonth(m)
    
      @_clearTime(d) unless keepTime
      while d.getMonth() != check.getMonth()
        d.setDate(d.getDate() + (d < check ? 1 : -1))
    d

  addDays: (d, n, keepTime)=>
    if (+d)
      dd = d.getDate() + n
      check = @clone(d)
      check.setHours(9)
      check.setDate(dd)
      d.setDate(dd)
      @clearTime(d) unless keepTime
      @fix(d, check)
    d

  addMinutes: (d, n)=> 
    d.setMinutes(d.getMinutes() + n)
    d

  clearTime:(d)=>
    d.setHours(0)
    d.setMinutes(0)
    d.setSeconds(0)
    d.setMilliseconds(0)
    d

  clone: (d, wtime)=> if wtime then @clearTime(new Date(+d)) else new Date(+d)

  fix: (d, check)=>
    if +d
      while (d.getDate() != check.getDate())
        d.setTime(+d + (d < check ? 1 : -1) * 3600000)
    d
  
  setup:(date)=>
    start = @clone(date, true)
    start.setDate(1)
    end = @addMonths(cloneDate(start), 1)
    calstart = @clone(start)
    calend   = @clone(end)
    @addDays(calstart, -((calstart.getDay() + 7) % 7))
    @addDays(calend, (7 - calend.getDay() - 1  % 7))
    @start  = start
    @end    = end
    @dstart = calstart
    @dend = calend
    @

Transit.ui.Datepicker::template = '
  <table class="transit-datepicker" cellspacing="0" cellpadding="0">
    <thead>
      <tr>
        <td colspan="7">{{month}} {{year}}</td>
      </tr>
      <tr class="weekdays">
        {{#each dayNames}}
        <th class="day-name">{{this}}</th>
        {{/each}}
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
'