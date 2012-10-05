(function() {
  var TextBlock, TextView, Transit,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Transit = this.Transit || require('transit');

  TextView = (function(_super) {

    __extends(TextView, _super);

    function TextView() {
      return TextView.__super__.constructor.apply(this, arguments);
    }

    TextView.prototype.tagName = 'div';

    TextView.prototype.className = 'managed-context text-block';

    TextView.prototype.events = {
      'click i.icon-remove': 'checkRemove'
    };

    TextView.prototype.editor = null;

    TextView.prototype.initialize = function() {};

    TextView.prototype.helpers = function() {
      return {
        body: this.model.get('body')
      };
    };

    TextView.prototype.afterRender = function() {
      var resizer, that, tools;
      this.$el.html(this.model.get('body'));
      tools = '\
    <div id="transit_editor_toolbar" style="display:none">\
      <a data-wysihtml5-command="bold" title="CTRL+B" class="btn btn-mini"> <i class="icon-bold"></i> </a>\
      <a data-wysihtml5-command="italic" title="CTRL+I" class="btn btn-mini"> <i class="icon-italic"></i> </a>\
    </div>';
      if ($('#transit_editor_toolbar').length === 0) {
        $('body').append(tools);
      }
      if (this.editor === null) {
        this.editor = new wysihtml5.Editor(this.el, {
          toolbar: $('#transit_editor_toolbar').get(0),
          parserRules: wysihtml5ParserRules,
          stylesheets: ['https://fonts.googleapis.com/css?family=Lato:300italic,700italic,300,700', 'stylesheets/styles.css']
        });
        $('#transit_editor_toolbar').hide();
        that = this;
        this.editor.on("blur:composer", function() {
          that.model.set('body', that.editor.getValue());
          return $('#transit_editor_toolbar').hide();
        });
        this.editor.on("focus:composer", function() {
          console.log($('#transit_editor_toolbar'));
          return $('#transit_editor_toolbar').show();
        });
        resizer = function(event) {
          return that.editor.composer.iframe.style.height = that.editor.composer.element.scrollHeight + "px";
        };
        return this.editor.on("load", function() {
          $('#transit_manager').append($('#transit_editor_toolbar').detach());
          that.editor.composer.element.addEventListener("keyup", resizer, false);
          that.editor.composer.element.addEventListener("blur", resizer, false);
          that.editor.composer.element.addEventListener("focus", resizer, false);
          return resizer();
        });
      }
    };

    TextView.prototype.checkRemove = function(event) {
      if (confirm("Are you sure you want to remove this content?")) {
        this.model.destroy();
        return this.close();
      }
    };

    return TextView;

  })(Transit.ContextView);

  TextBlock = (function(_super) {

    __extends(TextBlock, _super);

    function TextBlock() {
      return TextBlock.__super__.constructor.apply(this, arguments);
    }

    TextBlock.prototype.type = "TextBlock";

    TextBlock.prototype.view = TextView;

    TextBlock.prototype.defaults = {
      body: "<p>Type your content here</p>",
      _type: 'TextBlock'
    };

    return TextBlock;

  })(Transit.Context);

  TextView.prototype.template = Handlebars.compile('{{{body}}}');

  Transit.set('context', 'TextBlock', TextBlock);

}).call(this);
