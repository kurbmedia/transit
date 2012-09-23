#
# Bicycle Crunch
# Node.js based asset packager with support for Coffeescript & Compass
# Mit License
#
# (c)2011 Thomas Klokosch <thomas.klokosch@me.com>
# http://www.controlledrandom.com
# Heavily inspired by https://github.com/harvesthq/chosen/blob/master/Cakefile
#
# Install dependencies:
# npm -g install coffee-script uglify-js clean-css
#

fs               = require 'fs'
path             = require 'path'
{spawn, exec}    = require 'child_process'
CoffeeScript     = require 'coffee-script'
{parser, uglify} = require 'uglify-js'
cleanCSS         = require 'clean-css'
less             = require 'less'
async            = require 'async'

# Javascript sources
# Example configuration for two JS packages,
# first one a bundle of several jQuery plugins
# the second one a coffescript file
# Coffeescript and JS files can also be mixed in the package

libraries = [
  'src/core.coffee'
  'src/core/browser.coffee'
  'src/core/selection.coffee'

  'src/ui/manager.coffee'
  'src/ui/modal.coffee'
  'src/ui/notify.coffee'
  'src/ui/panel.coffee'
  'src/ui/toolbar.coffee'
  'src/ui/uploader.coffee'
    
  'src/model/asset.coffee'
  'src/model/assets.coffee'
  'src/model/context.coffee'
  'src/model/contexts.coffee'
  'src/model/deliverable.coffee'
    
  'src/views/asset_manager.coffee'
  'src/views/view.coffee'
  'src/views/region.coffee'
]

javascripts = []
javascripts.push
  path: 'build/transit.js'
  files: libraries
  minify: true

javascripts.push
  path: 'lib/transit.js'
  files: libraries
  minify: false

javascripts.push
  path:  'build/themes/bootstrap.js'
  files: ['src/themes/bootstrap.coffee']
  minify: true

javascripts.push
  path:  'lib/themes/bootstrap.js'
  files: ['src/themes/bootstrap.coffee']
  minify: true
# 
# do ()->
#   specs = []
#   for file in libraries
#     file = file.replace(/\.coffee$/,'_spec.coffee')
#     specs.push(file.replace(/^src/, 'spec'))
#   
#   javascripts.push
#     path: 'spec/support/runner.js'
#     files: specs
#     minify: false

  



# Stylesheet sources
# Example configuration with one CSS package,
# made from two CSS source files

stylesheets = {
  'build/transit.css': [
    'src/css/transit.scss'
  ]
}

task 'test', 'Run mocha suite', -> 
  runner = "./node_modules/mocha-phantomjs/lib/mocha-phantomjs.coffee"
  exec "phantomjs #{runner} spec.html", (err, stdout, stderr)->
    process.stderr.write stderr.toString()
    print stdout.toString()

test = ->
  tester = (file) ->
      (callback) ->
        mocha = spawn 'mocha',  [
          '-u', 'bdd', '-R', 'spec', '-t', '20000', 
          '--require', 'underscore',
          '--require', 'backbone',
          '--require', 'spec/support/helper.js',
          '--require', 'support/backbone-marionette',
          '--require', 'lib/transit.js',
          '--colors', "spec/#{file}",
        ]
        mocha.stdout.pipe process.stdout, end: false
        mocha.stderr.pipe process.stderr, end: false
        mocha.on 'exit', (code) -> callback?(code,code)
  testFiles = ['support/runner.js']
  testers = (tester file for file in testFiles)
  async.series testers, (err, results) -> 
    passed = results.every (code) -> code is 0
    process.exit if passed then 0 else 1


# Build JS
task 'build:js', 'Build JS from source', build = (cb) ->
  file_name = null
  file_contents = null
  getdata = (files)->
    code = ""
    for source in files
      file_contents = "#{fs.readFileSync source}"
      file_name     = source
      if (/[^.]+$/.exec(source))[0] == 'coffee'
        code += CoffeeScript.compile file_contents
      else code += file_contents
    code
  
  try
    for package in javascripts
      code = getdata(package.files)
      write_js( package.path, code )
      mini = package.path.replace(/\.js$/,'.min.js')
      
      if package.minify is true
        write_js mini, do ()->
          adds = fs.readFileSync 'support/backbone-marionette.js'
          code = [adds, code].join("\n\n")
          uglify.gen_code uglify.ast_squeeze uglify.ast_mangle parser.parse code

    cb() if typeof cb is 'function'
  catch e
    print_error e, file_name, file_contents


# Build CSS
task 'build:css', 'Build CSS', build = (cb) ->
  file_name = null; file_contents = null
  try
    for stylesheet, sources of stylesheets
      code = ''
      for source in sources
        file_name = source
        file_contents = "#{fs.readFileSync source}"

        code += file_contents

      write_stylesheet stylesheet, code
      unless process.env.MINIFY is 'false'
        write_stylesheet stylesheet.replace(/\.css$/,'.min.css'), (
          cleanCSS.process code
        )    
    cb() if typeof cb is 'function'
  catch e
    print_error e, file_name, file_contents


# Watch task
task 'watch', 'Watch source files and build JS & CSS', ->
  console.log "Watching for changes..."

  # Watch for changes in Javascript files
  for package in javascripts
    for file in package.files
      ((file) ->
        fs.watchFile file, { interval: 100}, (curr, prev) ->
          if +curr.mtime isnt +prev.mtime
            console.log "Saw change in #{file}"
            invoke 'build:js'
      )(file)

  fs.watchFile 'src/css/transit.scss', { interval: 100 }, (curr, prev)->
    console.log "Compile transit.scss"
    exec 'sass --compass -t compact src/css/transit.scss build/transit.css', (err, stdout, stderr)->
      throw err if err
      console.log "Wrote transit.css"
      fs.writeFileSync "demo/transit.css", fs.readFileSync "build/transit.css"
      exec 'sass --compass -t compressed src/css/transit.scss build/transit.min.css', (err, stdout, stderr)->
        throw err if err
        console.log "Wrote transit.min.css"

# Write javascript with a header
write_js = (filename, body) ->
  fs.writeFileSync filename, """
#{body}
"""
  console.log "Wrote #{filename}"


# Write stylesheet with a header
write_stylesheet = (filename, body) ->
  fs.writeFileSync filename, """
#{body}
"""
  console.log "Wrote #{filename}"


#
Array::unique = ->
  output = {}
  output[@[key]] = @[key] for key in [0...@length]
  value for key, value of output


# Gather a list of unique source files.
javascript_sources = ->
  all_sources = []
  for javascript, sources of javascripts
    for source in sources
      all_sources.push source
  all_sources.unique()

stylesheet_sources = ->
  all_sources = []
  for stylesheet, sources of stylesheets
    for source in sources
      all_sources.push source
  all_sources.unique()


# Print error message
print_error = (error, file_name, file_contents) ->
  line = error.message.match /line ([0-9]+):/
  if line && line[1] && line = parseInt(line[1])
    contents_lines = file_contents.split "\n"
    first = if line-4 < 0 then 0 else line-4
    last  = if line+3 > contents_lines.size then contents_lines.size else line+3
    console.log "Error compiling #{file_name}. \"#{error.message}\"\n"
    index = 0
    for line in contents_lines[first...last]
      index++
      line_number = first + 1 + index
      console.log "#{(' ' for [0..(3-(line_number.toString().length))]).join('')} #{line}"
  else
    console.log """
Error compiling #{file_name}:

  #{error.message}

"""
