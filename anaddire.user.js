// ==UserScript==
// @name           Anaddire
// @author         DataSurfer
// @namespace      http://github.com/DataSurfer/Anaddire/
// @description    Reformats the photoprint page with a horizontal flow layout maximizing utilization of space on the page.
// @include        https://secure.lds.org/units/a/directory/photoprint/*
// ==/UserScript==

var xpath_record = '/html/body/table[*]/tbody/tr[1]/td[1]/table[1]/tbody/tr[1]';
var xpath_surname = 'td[1]/table[1]/tbody/tr[1]/td[1]';
var xpath_givenname = 'td[1]/table[1]/tbody/tr[2]/td[1]';
var xpath_address = 'td[2]';
var xpath_phone = 'td[1]/table[1]/tbody/tr[1]/td[2]';
var xpath_image = 'td[3]/*';

function $x(p, context) {
  if (!context) context = document;
  var i, arr = [], xpr = document.evaluate(p, context, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (i = 0; item = xpr.snapshotItem(i); i++) arr.push(item);
  return arr;
}
var convert_to_horizontal_view = 
    function()  {
	var title = document.title;
	var records = $x(xpath_record);
	records.pop(); //last one is the copyright line, don't need it

	var showNoPhoto = true;
	
	var newBody = '';
	records.forEach(
	    function(record) {
		var card = new Object();
		var surname = $x(xpath_surname, record)[0].innerHTML;
		var givenname = $x(xpath_givenname, record)[0].innerHTML.replace(/&nbsp;/g,'').replace(/^\s*/,'');
		var address = $x(xpath_address, record)[0].innerHTML;
		var address1 = address.split(/<br>/)[0];
		var phone = $x(xpath_phone, record)[0].innerHTML;
		var image = $x(xpath_image, record)[0];
		
		if (typeof(image)!="undefined" || showNoPhoto) {
			newBody += '<div class="floatleft">';
			if (typeof(image)!="undefined") {
				newBody += '<div class="cardimage">';
				newBody += '<img src="' + image.src + '" />';
			} else {
				newBody += '<div class="nophoto">';
				newBody += '<br /><br /><br />no photo';
			}
			newBody += '</div>';
			newBody += givenname + ' ' + surname + '<br />' + phone + '<br />' + address1;
			newBody += '</div>';
		}
	    }
	);
	
	var newHead = '<title>' + title + '</title>';
	newHead += '<style type="text/css">';
	newHead += '	.floatleft {float: left; width: 180px; margin:1.5px; height: 175px; text-align:center; font-family:Arial,Helvetica,sans-serif; font-size:x-small;}';
	newHead += '	.cardimage {width: 180px; height: 135px; }';
	newHead += '	.nophoto {width: 178px; height: 133px; border: 1px solid #AAA; font-size:medium; color:#AAA;}';
	newHead += '</style>';

	document.documentElement.childNodes[0].innerHTML = newHead;
	document.body.attributes.removeNamedItem('marginwidth');
	document.body.attributes.removeNamedItem('marginheight');
	document.body.attributes.removeNamedItem('bgcolor');
	document.body.attributes.removeNamedItem('onload');
	document.body.attributes.removeNamedItem('rightmargin');
	document.body.attributes.removeNamedItem('leftmargin');
	document.body.attributes.removeNamedItem('bottommargin');
	document.body.attributes.removeNamedItem('topmargin');
	document.body.innerHTML = newBody;
	
    };
    
window.addEventListener('load', convert_to_horizontal_view, true);

/* attempting to have a button for triggering the conversion instead of havinig it done automatically
//TODO:  expose various parameters about image max width, max hieght, font size, show records without photos, etc
window.addEventListener(
    'load',
    function() {
	var button = document.createElement('button');
	button.innerHTML = 'Horizontal Layout';
	//button.addEventListener('click',alert("clicked"), false);  // this manifests some crazy greasemonkey bug
	var element = $x('/html/body/table[2]/tbody/tr[1]/td[1]')[0];
	element.appendChild (button);
    },
    true);
*/