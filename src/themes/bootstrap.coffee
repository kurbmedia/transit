root = Transit.config.template_path

Transit.template.set("#{root}/core/save-button.jst", '<button class="save btn primary"><i class="icon-ok"></i> <%= text %></button>')

Transit.template.set("#{root}/core/tab-bar.jst", '
  <div class="navbar">
    <div class="navbar-inner">
      <ul class = "transit-tab-bar nav"></ul>
    </div>
  </div>
')

Transit.template.set("#{root}/core/notification.jst", '
  <div class="alert alert-<%= type %>">
    <button type="button" class="close" data-dismiss="alert">×</button>
    <%= message %>
  </div>
')

Transit.template.set("#{root}/core/progress-bar.jst", '
  <div class="progress progress-striped active">
    <div class="bar" style="width:<%= percent %>"></div>
  </div>
')