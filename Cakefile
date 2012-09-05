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


# Javascript sources
# Example configuration for two JS packages,
# first one a bundle of several jQuery plugins
# the second one a coffescript file
# Coffeescript and JS files can also be mixed in the package

javascripts  = {
  'build/transit.js': [
    'src/core.coffee'
    'src/model/context.coffee'
    'src/model/deliverable.coffee'
    'src/model/contexts.coffee'
  ]
}


# Stylesheet sources
# Example configuration with one CSS package,
# made from two CSS source files

stylesheets = {
  'build/transit.css': [
    'src/css/transit.scss'
  ]
}


# Build JS
task 'build:js', 'Build JS from source', build = (cb) ->
  file_name = null; file_contents = null
  try
    for javascript, sources of javascripts
      code = ''
      for source in sources
        file_name = source
        file_contents = "#{fs.readFileSync source}"

        if (/[^.]+$/.exec(file_name))[0] == 'coffee'
          code += CoffeeScript.compile file_contents
        else
          code += file_contents

      write_javascript javascript, code
      mini = javascript.replace(/\.js$/,'.min.js')
      
      unless process.env.MINIFY is 'false'
        write_javascript mini, (
          uglify.gen_code uglify.ast_squeeze uglify.ast_mangle parser.parse code
        )
    
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
  for file in javascript_sources()
    ((file) ->
      fs.watchFile file, (curr, prev) ->
        if +curr.mtime isnt +prev.mtime
          console.log "Saw change in #{file}"
          invoke 'build:js'
    )(file)

  # Watch for changes in stylesheet files
  for file in stylesheet_sources()
    ((file) ->
      fs.watchFile file, (curr, prev) ->
        if +curr.mtime isnt +prev.mtime
          console.log "Saw change in #{file}"
          invoke 'build:css'
    )(file)
    
  # exec 'compass watch', (err, stdout, stderr) ->
  #     throw err if err
  #     console.log stdout + stderr

# Write javascript with a header
write_javascript = (filename, body) ->
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
