export class SourceUrlForeign {
  constructor(url, title, keyword = null) {
    // URL of given source
    if (typeof url !== "string") {
      throw '"url" must be a string!';
    } else {
      this.url = url;
    }
    // Official title of given source
    if (typeof title !== "string") {
      throw '"url" must be a string!';
    } else {
      this.title = url;
    }
    // Keyword of given source, to pick specific sections of source
    if (typeof keyword === "string" || keyword == null) {
      this.keyword = keyword;
    } else {
      throw new Error('"keyword" MUST either be null OR string!');
    }
  }
}

export class SourceUrlNative {
  constructor(
    url = "test.com",
    about = 'This is a dummy about info of "test.com"',
    hasSafeSearch = true,
    hasGraphicContent = true,
    damagingIfDisabled = false,
    redirectTo = null
  ) {
    // URL of given subdomain
    if (typeof url !== "string") {
      throw "URL must be a string!";
    } else {
      this.url = url;
    }
    // About info of given subdomain
    if (typeof about !== "string") {
      throw '"About" MUST be a string!';
    } else {
      this.about = about;
    }
    // Boolean if given subdomain has SafeSearch strictly enabled
    if (typeof hasSafeSearch === "boolean") {
      this.hasSafeSearch = hasSafeSearch;
    } else {
      throw '"hasSafeSearch" MUST be a boolean!';
    }
    // Boolean if given subdomain has graphic content in its search queries
    if (typeof hasGraphicContent === "boolean") {
      this.hasGraphicContent = hasGraphicContent;
    } else {
      throw '"hasGraphicContent" MUST be a boolean!';
    }
    // Boolean if given subdomain damages other sites if disabled (or makes info searching more difficult)
    if (typeof damagingIfDisabled === "boolean") {
      this.damagingIfDisabled = damagingIfDisabled;
    } else {
      throw '"damagingIfDisabled" MUST be a boolean!';
    }
    // Redirect URL of given subdomain
    if (redirectTo instanceof SourceUrl_RedirectTo || redirectTo == null) {
      this.redirectTo = redirectTo;
    } else {
      throw '"redirectTo" MUST either be an instance of "SourceUrl_RedirectTo"!';
    }
  }
}

export class SourceUrl_RedirectTo {
  constructor(url, about) {
    // URL or IP address of the redirect
    if (typeof url === "string") {
      this.url = url;
    } else {
      throw new Error('"url" MUST be a string!');
    }
    // Information about this redirect's URL or IP address
    if (typeof about === "string") {
      this.about = about;
    } else {
      throw new Error('"about" MUST be a string!');
    }
  }
}
