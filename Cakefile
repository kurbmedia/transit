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
wrench           = require 'wrench'

# Javascript sources
# Example configuration for two JS packages,
# first one a bundle of several jQuery plugins
# the second one a coffescript file
# Coffeescript and JS files can also be mixed in the package

libraries = [
  'src/core.coffee'
  'src/core/browser.coffee'
  'src/core/selection.coffee'
  'src/core/template.coffee'
  
  'src/views/view.coffee'
  
  'src/ui/manager.coffee'
  'src/ui/modal.coffee'
  'src/ui/notify.coffee'
  'src/ui/panel.coffee'
  'src/ui/uploader.coffee'
  'src/ui/form.coffee'
  'src/ui/toolbar.coffee'
#  'src/ui/datepicker.coffee'
    
  'src/model/asset.coffee'
  'src/model/assets.coffee'
  'src/model/context.coffee'
  'src/model/contexts.coffee'
  'src/model/deliverable.coffee'
  
  'src/views/asset_manager.coffee'
  'src/views/context.coffee'
  'src/views/region.coffee'
  
]

javascripts = []
javascripts.push
  path: 'dist/transit.js'
  files: libraries
  minify: true

javascripts.push
  path: 'lib/transit.js'
  files: libraries
  minify: false

javascripts.push
  path: 'gh-pages/javascripts/transit.js'
  files: libraries
  minify: false

javascripts.push
  path:  'dist/themes/bootstrap.js'
  files: ['src/themes/bootstrap.coffee']
  minify: true

javascripts.push
  path:  'lib/themes/bootstrap.js'
  files: ['src/themes/bootstrap.coffee']
  minify: true


javascripts.push
  path:  'gh-pages/javascripts/transit-bootstrap.js'
  files: ['src/themes/bootstrap.coffee']
  minify: true

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
task 'build', 'Build JS from source', build = (cb) ->
  file_name = null
  file_contents = null
  try
    files = wrench.readdirSyncRecursive('src/extras/')
    for extra in files
      file_name = path.join('src', 'extras', extra)
      file_contents = CoffeeScript.compile "#{fs.readFileSync(file_name)}"
      fname = path.basename(file_name).replace(/\.coffee$/,'.js')
      write_js "dist/extras/#{fname}", file_contents
      write_js "gh-pages/javascripts/extras/#{fname}", file_contents
  catch e
    print_error e, file_name, file_contents

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
          uglify.gen_code uglify.ast_squeeze uglify.ast_mangle parser.parse code

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
            invoke 'build'
      )(file)
  
  for file in wrench.readdirSyncRecursive('src/extras/')
    file = path.join('src', 'extras', file)
    fs.watchFile file, { interval: 100 }, (curr, prev) ->
      if +curr.mtime isnt +prev.mtime
        invoke "build"

# Write javascript with a header
write_js = (filename, body) ->
  fs.writeFileSync filename, """
#{body}
"""
  console.log "Wrote #{filename}"

get_libs = (dir, callback)->
  files = []
  wrench.readdirSyncRecursive dir, (path)->
    unless path is null
      fs.stat path, (err, stat)->
        if stat and !stat.isDirectory()
          files.push(path)
  callback?(files)
  files


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
