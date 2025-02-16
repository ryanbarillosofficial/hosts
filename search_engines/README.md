# No Search Engines

### Restrict your searches, away from explicit content!

From only those strictly enforcing SafeSearch on, to every single one!

## What Counts as a Search Engine?

For our purposes, a <strong>Search Engine</strong> it is a website that provides hyperlinks to web pages and other relevant information that the user would like to know.

A domain qualifies as a <strong>Search Engine</strong> if it meets the following criteria:

1. Provides a search tool to search for information
2. Delivers following info **_simultaneously_** according to the user's query:
   - Documents
     - PDF's
     - EPUB's
     - Office-formatted Documents
       - e.g., Documents made from Microsoft Office or LibreOffice
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
   - Referrals to Other Websites
   - Topics from Various Subjects to Explore
     - (This excludes anything dedicated to one topic, like a cookbook recipe search engine)

If these criterias are met, that site is a <strong>Search Engine</strong>!

## Understanding Each Blacklist

Currently, there are 3 blacklists of search engines, each are determined by each domain's checklist:

### 1. SafeSearch?

Does the search engine have the option to enable SafeSearch, a switch that filter every explicit content in its results?

### 2. Has Graphics?

<strong>Note:</strong> This check is NOT IN USE currently (it will be in the future!)

Does the search engine deliver any _Graphical Content_ at all—be it child-safe or tame, explicit or suggestive of risque intents?

### 3. Damaging If Disabled?

Does blocking this Search Engine & all its other components either break other websites? Or reduce the ease of accessing information in quick fashion?

#### To understand this point further:

<details>
  <summary>Click Here to Read More:</summary>
  
A search engine **is not always a single unit** that delivers all information being searched for by the user.

For Example:

**[DuckDuckGo](https://duckduckgo.com)** requries the help of **2 other domains** to serve information:

1. **[links.duckduckgo.com](https://links.duckduckgo.com)** provides hyperlinks to each result in the _All tab_
2. **[external-content.duckduckgo.com](https://external-content.duckduckgo.com)** provides _Graphical Content_ to preview thumbnails of each image & GIF in _Images tab_ & news arcticle in _News tab_

#### Sometimes, the same company **can serve 2 versions of its Search Engine—or more!**

**For Example:**

**1.** Besides **[DuckDuckGo.com](https://duckduckgo.com)**, DuckDuckGo (the company) offers **4 more variants** of its search engine:

- **[DuckDuckGo Safe](https://safe.duckduckgo.com)** (it has SafeSearch strictly enforced!)
- **[DuckDuckGo HTML](https://html.duckduckgo.com)** (No JavaScript to serve Images, News, Videos, etc.)
- **[DuckDuckGo Lite](https://lite.duckduckgo.com)** (Clone of DuckDuckGo HTML, but with a different look)
- **[DuckDuckGo Start](https://start.duckduckgo.com)** (I have no clue about its purpose)

Given that there _4 variants_ of DuckDuckGo's _Search Engine_, and **all 4 share the same components used to deliver information**, those common domains—**[links.duckduckgo.com](links.duckduckgo.com)** & **[external-content.duckduckgo.com](links.duckduckgo.com)**—must also be evaluated for being included in the blacklist.

But sometimes, however...

#### a.) Blocking such common domins can break other websites!

**For Example:**

**1.** Blocking Google.com (it allows SafeSearch to be turned off) **breaks the following:**

- Captchas & reCaptchas (if the website relies on Google's implementation of it)
- YouTube (a few reloads is needed to play a video)

**But even if blocking those don't break other websites**

#### b.) Blocking a Search Engine restricts access to so much information!

**For Example:**

1. <strong>[Wikipedia](https://wikipedia.org)</strong> is one of the most frequently visited Search Engine, but under _SafeSearch_Strict_ blacklist, this is blacklisted due to the lack of SafeSearch (allowing you to search up _Textual Information_ and _Graphical Content_ of any explicit material and topic).

If any of the two occur when a Search Engine's domain (and it relatives) are blacklisted,
**It is _Damaging When Disabled_**--it ruins one's web experience **for** the purpose of maintaining **a clean and pure conscience**

</details>

## Which Blacklist to Choose From?

Based on the previous section, the following table will best describe the use case of each blacklist here:
|Host File |Has SafeSearch? |Has Graphical Content? |Can Damages Other Sites?|
|:-------------------:|:-----------------------:|:-----------------------:|:------------------:|
|SafeSearch_Easy.txt |<strong>Yes</strong> |Yes |<strong>No</strong> |
|SafeSearch_Strict.txt|<strong>Yes</strong> |<strong>No</strong> |Yes|
|All.txt |<strong>Yes & No</strong>|<strong>Yes & No</strong>|Yes|

## "I want to add a New Search Engine!"

You've found a search engine not yet included in the blacklist, you are welcome to share it here!
Ensure to use the following format when requesting to add a new search engine:

```
"search_engine_name": [
    {
      "url": "example.com",
      "comment": "OPTIONAL! Explain what it dows, like it provides images or explicit material to search engine",
      "safesearch": true | false,
      "has_graphics": true | false,
      "damaging_if_disabled": true | false
    },
    {
        "url": "extra.example.com",
        "comment": "",
        "safesearch": true | false,
        "has_graphics": true | false,
        "damaging_if_disabled": true | false
    },
    // Add more URL's related to this search engine
],
```

Once done, **[Make a Pull Request Here!](https://github.com/ryanbarillosofficial/hosts/pulls)**
