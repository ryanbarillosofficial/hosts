# No Search Engines

### Restrict your searches, away from explicit content!

From only those strictly enforcing SafeSearch on, to every single one!

## What Counts as a Search Engine?

For our purposes, a <strong>Search Engine</strong> it is a website that provides hyperlinks to web pages and other relevant information that the user would like to know.

A domain qualifies as a <strong>Search Engine</strong> if itmeets the following criteria:

1. Provides a search tool to search for information
2. Delivers any following info according to the user's query:
   - Documents
     - PDF's
     - EPUB's
     - Office-formatted Documents
       - e.g., Any document made from Microsoft Office or LibreOffice
     - etc.
   - Graphical Content (motion or static)
     - Pictures
     - Videos
     - GIF's
     - 3D model renders
     - etc.
   - Textual Information
     - Dictionaries
     - Encyclopedias

If these criterias are met, that site is a <strong>Search Engine</strong>!

## Understanding Each Blacklist

Currently, there are 3 blacklists of search engines, each are determined by each domain's checklist:

### 1. SafeSearch

Does the search engine have the option to enable SafeSearch (a toggle to filter explicit content)?

- No? **Then it's blocked!**
- Yes?
  - Does it _strictly enforce it_, i.e., the user can't decide to turn it off?
    - No? **Then it's blocked!**
    - Yes? Then **it's SAFE!** It's allowed for use

### 2. Has_Graphics

<strong>Note:</strong> This check is NOT IN USE currently (it will be in the future!)

Does the search engine deliver _Graphical Content_?

- No? **Then it's SAFE!**
- Yes? **Then it's blocked!**

### 3. Damaging If Disabled?

#### To understand this before you go further:

A search engine **is not always a single unit** that delivers all information being searched for by the user.

#### For Example:

**[DuckDuckGo](https://duckduckgo.com)** requries the help of **2 other domains** to serve information:

1. **[links.duckduckgo.com](links.duckduckgo.com)** provides hyperlinks to each result in the _All tab_
2. **[external-content.duckduckgo.com](links.duckduckgo.com)** provides _Graphical Content_ to preview thumbnails of each image & GIF in _Images tab_ & news arcticle in _News tab_

### And sometimes, the same company **can serve 2 versions of its Search Engine---or more!**

#### For Example:

**1.** Besides **[DuckDuckGo.com](https://duckduckgo.com)**, DuckDuckGo (the company) offers **4 more variants** of its search engine:

- **[DuckDuckGo Safe](safe.duckduckgo.com)** (it has SafeSearch strictly enforced!)
- **[DuckDuckGo HTML](html.duckduckgo.com)** (No JavaScript to serve Images, News, Videos, etc.)
- **[DuckDuckGo Lite](html.duckduckgo.com)** (Clone of DuckDuckGo HTML, but with a different look)
- **[DuckDuckGo Start](start.duckduckgo.com)** (I have no clue about its purpose)

Given that there _4 variants_ of DuckDuckGo's _Search Engine_, and **all 4 share the same components used to deliver information**, those common components---**[links.duckduckgo.com](links.duckduckgo.com)** & **[external-content.duckduckgo.com](links.duckduckgo.com)**---must also be evaluated for being included in the blacklist.

But sometimes, however...

#### Blocking such common components brea

#### For Example:

3. url: the link to it
4. child_safe: Is SafeSearch strictly enforced (and can't be changed at all)
5. has_graphics: Does it deliver graphical content (images, videos, or GIF's)
6. damaging_if_disabled: Does blocking it affect other websites (e.g., blocking google.com makes using youtube, maps, or recaptchas difficult to access) (It should break at least 2 websites)? Or is it a very crucial resource (e.g., Wikipedia) that there are no alternatives to it when blocked?

## "I want to add a New Search Engine!"

You've found a search engine not yet included in the blacklist, you are welcome to let me know by <strong>[making a Pull Request!](https://github.com/ryanbarillosofficial/hosts/pulls)</strong>
