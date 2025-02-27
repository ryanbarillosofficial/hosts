# Safe Search Engines Only

### Filter your searches from explicit content!

This is achieved by whitelisting search engines that provide means to enforce SafeSearch on their site, and blacklisting those that don't

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

- Files
- Graphical Content (motion or static)
  - Pictures
  - Videos
  - GIF's
  - 3D model renders
  - etc.
- Textual Information
- Referrals to Other Websites
- Topics from Various Subjects to Explore
  - (This excludes anything dedicated to a single topic, like a cookbook recipe search engine)

If <u>all these criteria</u> are met—not just one of these—that site is a <strong>Search Engine</strong>!

## Understanding Each Blacklist

Currently, there are 3 blacklists of search engines, each are determined by the following criteria:

### 1. Has SafeSearch?

Does the search engine have the option to enable SafeSearch, a switch that filters every explicit content from its search results?

### 2. Has Graphical Content?

<strong>Note:</strong> This check is NOT IN USE currently (it will be in the future!)

Does the search engine deliver any _Graphical Content_ at all—be it child-safe or tame, explicit or suggestive of risque intents?

### 3. Damaging If Disabled?

Does blocking this Search Engine & all its other components either break other websites (e.g., captchas, content delivery) OR reduce the ease of accessing information?

## Which Blacklist to Choose From?

Based on the previous section, the following table will best describe the use case of each blacklist here:
|Host File |Has SafeSearch? |Has Graphical Content? |Can Damages Other Sites?|
|:-------------------:|:-----------------------:|:-----------------------:|:------------------:|
|SafeSearch_Moderate |<strong>Yes</strong> |Yes |No |
|SafeSearch_Moderate |<strong>Yes</strong> |<strong>No</strong> |<strong>Yes</strong>|
|All |<strong>Yes & No</strong>|<strong>Yes & No</strong>|<strong>Yes</strong>|

In summary:

- If you want a smooth web experience, select <strong>SafeSearch_Moderate</strong>
- If self-control is <u>lacking</u> for you, select <strong>SafeSearch_Aggressive</strong>—it will help you for sure!

## "I want to add a New Search Engine!"

You've found a search engine not yet included in the blacklist, you are welcome to suggesting it by **[making a Pull Request here!](https://github.com/ryanbarillosofficial/hosts/pulls)**
