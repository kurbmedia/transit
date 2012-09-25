Transit = @Transit or require('transit')

class Page extends Transit.Deliverable
  defaults:
    title: 'The page title.'
    description: "this is a test page"
    keywords: ["awesome", "rad", "success"]


@Page = Page
module?.exports = Page