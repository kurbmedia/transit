beforeEach(function(){
  
  this.addMatchers({
    toBeEmpty: function() {
      var actual = this.actual
      this.message = function (){
        return "Expected [" + actual.join(", ") + "] to not be empty";
      }
      return actual.length === 0;
    },
    
    toNotBeEmpty: function() {
      var actual = this.actual;
      this.message = function (){
        return "Expected [" + actual.join(", ") + "] to not be empty";
      }
      return actual.length > 0;
    },
    
    toHaveSize: function(expected){
      var actual = this.actual.length;
      var notText = this.isNot ? " not" : "";
      
      this.message = function () {
        return "Expected " + actual + notText + " to have a .length of " + expected;
      }
      return actual == expected;
    },
    
    toBeInstanceOf: function(expected){
      var actual = this.actual.constructor.name, found;
      
      found = ( _.isString(expected) ) ? expected : expected.name;
      
      this.message = function(){
        return "Expected " + actual + " to be a " + found;
      };
      
      if( _.isString(expected) ) return actual === found;
      return this.actual instanceof expected
    }
  });
  
});

var mockEvent = function(options){
  if(options === void 0)
    options = {};
  options = _.defaults(options, {
    preventDefault:function(){},
    currentTarget: $('<a></a>')
  });

  return options;
}