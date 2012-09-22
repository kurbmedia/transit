# Technically this isn't necessary because jQuery would give us this info, however
# since it will likely be dropped when jQuery goes more modular, we'll add it here
# for future compatability, as well as compatability with things like Zepto
#

agent   = navigator.userAgent
Browser = 
  msie:     agent.indexOf("MSIE") isnt -1 && agent.indexOf("Opera") is -1
  gecko:    agent.indexOf("Gecko") isnt -1 && agent.indexOf("KHTML") is -1
  webkit:   agent.indexOf("AppleWebKit/") isnt -1
  chrome:   agent.indexOf("Chrome/") isnt -1
  opera:    agent.indexOf("Opera/") isnt -1
  ios:      (/ipad|iphone|ipod/i).test(agent)
  android:  (/android (\d+)/i).test(agent)


Transit = @Transit || require 'transit'
Transit.browser  = @Transit.browser = Browser
module?.exports  = Transit.browser