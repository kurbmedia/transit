#Transit
### Simple Content Management

Transit is a backend agnostic approach to content management, using the power of Backbone.js. Typical CMS platforms are all-in-one solutions, containing both 
a back-end application, and front-end interface. Transit aims to be only the latter. 

###Goals

1. Provide a solid interface for managing content inline within a page
2. Compatibility with any REST based backend, using JSON as its data structure.
3. Allow easy integration into any backend environment by utilizing conventions over configuration
4. Support full customization of the interface, both functionally and aesthetically. This is achieved through the use of `handler` functions and javascript templates.

--
###Architecture 

**Contexts and Deliverables**

The model architecture is based around a primary "Deliverable", which contains one or more "Contexts". Deliverables are typically things like a page, or 
a blog post, but can be anything which contains multiple Contexts. 

Contexts can be any type of structured content. Examples could be headings (h1-h6), general text blocks (paragraphs/lists/basic formatting), audio files, videos, 
image galleries... or any other content which can be described in HTML. Each deliverable has a `has_many` relationship to a collection of contexts, 
which can be organized and arranged in any particular order. As an example, consider a `Post` deliverable, which contains some content and a video:

```html
<article id="post">
  <h2>The Post Title</h2>
  <div data-context-id="xxx" class="content">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit....</p>
  </div>
  <h3 data-context-id="xxx">A Sub Heading</h3>
  <video data-context-id="xxx" src="some_random.mp4" poster="poster.jpg" />
</article>
```
In the example above, the Post's contexts would consist of the body copy (div.content), the sub-heading (h3), and a video. Items like the post title (h2) 
would be described within the Post itself. A JSON representation of the Post "Deliverable" would be as follows:

```json
{
  "id" : 1,
  "_type" : "Post",
  "title" : "The Post Title",
  "contexts":[
    {
      "id" : 1,
      "_type" : "TextBlock",
      "body" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit....",
      "position": 1
    },
    {
      "id" : 2,
      "_type" : "Heading",
      "body" : "A Sub Heading",
      "node" : "h3",
      "position": 2
    },
    {
      "id": 3,
      "_type" : "Video",
      "source" : "some_random.mp4",
      "poster" : "poster.jpg",
      "position": 3
    }
  ]
}
```

Each model, whether deliverable or context, contains a `_type` attribute (yeah, we use Mongoid a lot) which represents the type of model to be used. 
This is particularly useful when data is loaded, as Transit will automatically map each item to the appropriate Backbone model within your app
(falling back to a generic `Context` model) before adding it to the deliverable's `contexts` attribute.  Contexts also include a `position`
attribute, which determines the ordering of each context within the deliverable. 

The `id`, `_type` and `position` attributes are the only two that are required, additional attributes would be dependent on your particular integration.

Transit also includes an Asset model, which is used for general, user-uploaded files and images. 

**Interface**

The UI is designed around the concept of a unified toolbar, which functions similar to a typical "tabbed" interface. The toolbar can contain one or more 
panels, which can be added and removed as necessary depending on the content to be managed. 

--
### Managing Content

...more information coming

--
### Contributing

Transit is written in [CoffeeScript](http://jashkenas.github.com/coffee-script/), and is designed to function as a NPM package (currently the library has not been pushed).
Tests are written using [jasmine](https://jasmine.github.io/) and coffeescript.

To contribute, fork the [repository on GitHub](https://github.com/kurbmedia/transit) and [send a pull request](http://help.github.com/pull-requests/). Be sure to 
include the issue # of your fix or feature implementation (if applicable), as well as any relevant tests/specs. Pull requests without associated (and passing) tests 
will not be merged.

To assist with backend integration, additional libraries are either planned or in development. This includes a Rails engine (nearing completion), and a 
restful PHP backend (in planning). If you'd be interested in contributing to either of these, please shoot us a message on Github.

--
### License

Transit is &copy;2011-2012 kurb media, llc. Licensed under the [MIT license](http://en.wikipedia.org/wiki/MIT_License). Do whatever you'd like, 
but contributing any cool features / functionality you may add would simply make you awesome.
