var coffee, connect, path, fs, app, url, root, _;

coffee  = require('coffee-script');
connect = require('connect');
path    = require('path');
fs      = require('fs');
url     = require('url');
root    = process.cwd();

_ = require('underscore');

function makecs(source, options) {
    options.bare = true;
    return coffee.compile(source, options);
}

function walk(dir, done){
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

function makejs(request, response, next){
  var pathname, jspath, body, cspath;
  
  pathname = url.parse(request.url).pathname;
  console.log("REQUEST: " + pathname);
  
  if ('GET' !== request.method && 'HEAD' !== request.method){
    return next();
  }
  
  if( /\.js$/.test(pathname) ){
    jspath = path.join(root, pathname);
    if( fs.existsSync(jspath) ){
      body = fs.readFileSync(jspath);
    }else{
      cspath = path.join(root, pathname.replace(/\.js$/, '.coffee'));
      body   = makecs("" + fs.readFileSync(cspath), {});
    }
    
    response.setHeader('Content-Type', 'application/javascript');
    response.end(body.toString());
  }else return next();
  
}

function makehtml(request, response, next){
  var pathname = url.parse(request.url).pathname,
      specfile = path.join(root, 'spec.html');

  if( pathname != '/' ) return next();
  
  walk(path.join(root, 'spec'), function(error, specs){
    if( error ) return response.end(error);
    
    specfile = fs.readFileSync(specfile);
    template = _.template(specfile.toString());
    specs    = _.map(specs, function(file){
      file = file.replace(root, "")
        .replace(/^\//, "")
        .replace(/^spec\//, '')
        .replace(/\.coffee$/, '.js');
      return file;
    });
    
    return response.end(template({ specs: specs }));
  });
}

app = connect()
  .use(connect.logger('dev'))
  .use(makejs)
  .use(makehtml)
  .use(connect.static(root))
  .listen(3000);

console.log("Listening on port 3000");