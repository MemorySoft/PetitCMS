/* jQuery plugin for setting the class of a particular element to
 * "current" based on the current page. Useful for navigation menus
 * that are part of a server side include for the whole site.
 *
 * By Rob Watts, http://tractionsys.com
 * Version 1.3, May 10, 2011
 *
 * Modified by Chris Osborn, http://tractionsys.com
 * Version 2.0, Dec 16, 2011
 * Now constructs complete URL and compares to current location
 *
 * Provided under the MIT license. Feel free to use it however you like.
 *
 * Example:
 * $("ul.nav a").currentPage();
 *
 * To override defaults, pass in a defaults object:
 * $("ul.nav a").currentPage({
 *    attr: "href",
 *    defaultClass: "selected"
 * });
 *
 */

ME_cpBase = $('base').attr('href');
ME_cpPath = window.location.href;

function ME_cpCompleteURL(base, path, index, uri)
{
  var array;
  var i;
  

  /* This looks stupid but it's the easiest way to make sure uri is a string */
  uri = uri + '';
  
  if (uri.indexOf(':') < 0) {
    if (base == undefined)
      base = path.substr(path.lastIndexOf('/') + 1);

    if (uri.charAt(0) == '/') {
      i = base.indexOf(':');
      i = base.indexOf('/', i + 3);
      uri = base.substr(0, i) + uri;
    }
    else
      uri = base + uri;
  }

  if (uri.search('/\\.\\./') >= 0) {
    array = uri.split('/');
    if (array.length > 3) {
      for (i = 4; i < array.length; i++)
	if (array[i] == '..') {
	  array.splice(i-1, 2);
	  i--;
	}
      for (i = 3; i < array.length && array[i] == '..'; i++)
	;
      if (i - 3)
	array.splice(3, i - 3);
      uri = array.join('/');
    }
  }

  if (uri.charAt(uri.length - 1) == '/')
    uri = uri + index;

  return uri;
}

jQuery.fn.currentPage = function(options) {
  var currentPage = "";
  var thisClass = "";
  var thisHref = "";
  var settings = jQuery.extend({
    defaultClass: "current",       // Default class to add to current link
	attr: "href",              // Default attribute to compare with current page URL (not usually used)
	appendToFirstClass: false, // Append the defaultClass to the first class on the element.
	                              // E.g. class="monkey" becomes class="monkey monkeycurrent"
	indexFile: "index.html"
	}, options);

  currentPage = ME_cpCompleteURL(ME_cpBase, ME_cpPath,
				 settings.indexFile, window.location.href);

  this.each(function() {
      thisHref = ME_cpCompleteURL(ME_cpBase, ME_cpPath, settings.indexFile,
				  $(this).attr(settings.attr));
      thisClass = "";

      if (thisHref == currentPage) {
	if (settings.appendToFirstClass) {
	  /* Conditional to support jQuery 1.6 */
	  if ($(this).attr("class")) 
	    thisClass = $(this).attr("class").split(" ")[0];
	  thisClass = thisClass + settings.defaultClass;
	}
	else 
	  thisClass = settings.defaultClass;

	$(this).addClass(thisClass);
      }
    });
};
