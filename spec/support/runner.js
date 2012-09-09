/*
 * Make sure coffeescript.js, jasmine, and all other dependencies are loaded,
 * then assign a global "specs" variable which is an array of file names in
 * your spec/ folder. 
 *
 * window.specs = ['index'];
 *
 */

(function() {
  var jasmineEnv, htmlReporter, loaded, ran = false;
          
  loaded = [];
          
  jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 1000;
  htmlReporter = new jasmine.HtmlReporter();

  jasmineEnv.addReporter(htmlReporter);

  jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
  };

  window.onload = loadSpecs;
          
  function loadSpecs(){
    jQuery.each(specs, function(ind, file){
      var toload = "spec/" + file + "_spec.coffee";
      if( loaded.indexOf(toload) == -1 ){
        loaded.push(toload); 
        CoffeeScript.load(toload, finish);
      }
    });
  }
  
  function finish(){
    if( loaded.length == specs.length )
      runem();
  }
  
  function runem(){
    if( ran == true ) return;
    ran = true;
    setTimeout(function(){
      jasmineEnv.execute();
    }, 200);
  }
  
})();