/**
 *	Scratch
 *
 *	An offline light-weight scratchpad for JavaScript debugging.
 *
 *	@author Scott Christopher Stauffer <scstauf at gmail dot com>
 */

var importedSchemes = [];
 
function colorize() {
	var hex = '0123456789ABCDEF'.split('');
	var color = '';
	for (var i = 0; i < 6; i++)
		color += hex[Math.round(Math.random() * 15)];
	return '#' + color;
}

function parseScheme(scheme) {
	try {
		var scheme = JSON.parse(scheme);
		var textarea = getTextAreas();
		document.body.style.backgroundColor = scheme['body'].backColor;
		document.body.style.color = scheme['body'].foreColor;
		textarea[0].style.backgroundColor = scheme['inputArea'].backColor;
		textarea[0].style.color = scheme['inputArea'].foreColor;
		textarea[1].style.backgroundColor = scheme['outputArea'].backColor;
		textarea[1].style.color = scheme['outputArea'].foreColor;
	}
	catch (err) {
		alert(err.message);
	}
}

function randomScheme() {
	var textarea = getTextAreas();
	document.body.style.backgroundColor = colorize();
	document.body.style.color = colorize();
	for (var i = 0; i < textarea.length; i++) {
		textarea[i].style.backgroundColor = colorize();
		textarea[i].style.color = colorize();
	}
}

function printScheme() {
	var textarea = getTextAreas();
	var scheme = {
		'name': '',
		'body': {
			'backColor': document.body.style.backgroundColor,
			'foreColor': document.body.style.color
		},
		'inputArea': {
			'backColor': textarea[0].style.backgroundColor,
			'foreColor': textarea[0].style.color
		},
		'outputArea': {
			'backColor': textarea[1].style.backgroundColor,
			'foreColor': textarea[1].style.color
		}
	};
	clearLog();
	println(JSON.stringify(scheme));
}

function importSchemes() {
	var textarea = getTextAreas()[2];
	var schemeJSON = textarea.value;
	
	if (schemeJSON.length > 0) {
		importedSchemes = importedSchemes.splice(0);
		var schemes = schemeJSON.split('\n');
		var list = document.getElementById('scheme-list');
		var removable = document.getElementsByClassName('removable');
		
		while (removable[0]) 
			removable[0].parentNode.removeChild(removable[0]);
		
		for (var i = 0; i < schemes.length; i++) {
			var json = JSON.parse(schemes[i]);
			var item = document.createElement('li');
			item.appendChild(document.createTextNode(json.name));
			item.setAttribute('id', 'scheme{0}'.interp(i));
			item.setAttribute('class', 'removable');
			list.appendChild(item);
			importedSchemes.push(json);
			item.onclick = function() {
				var id = this.id.replace('scheme', '');
				parseScheme(JSON.stringify(importedSchemes[id]));
			}
		}
	}
}

function getTextAreas() {
	return document.getElementsByTagName('textarea');
}

function getScratchPadLog() {
	return document.getElementById('scratchpad-log');
}

function print(text) {
	var scratchpadLog = getScratchPadLog();
	scratchpadLog.value += text + '\r\n';
}

function println(text) {
	print(text + '\r\n');
}

function clearLog() {
	getScratchPadLog().value = '';
}

function ready() {
	document.getElementById('btn-clickme').onclick = function() {
		var input = document.getElementById('eval-is-evil').value;
		
		try {
			clearLog();
			eval(input);
		} catch (err) {
			println(err.message);
		}
	}
	
	document.getElementById('btn-colorize').onclick = function() {					
		randomScheme();
	}
	
	document.getElementById('btn-print-scheme').onclick = function() {
		printScheme();
	}
	
	document.getElementById('btn-import').onclick = function() {
		importSchemes();
	}
	
	// document.getElementById('eval-is-evil').addEventListener('keydown', function(e) {
		// if (e.keyCode == 9) {
			// this.value += '\t';
			
			// if (e.preventDefault)
				// e.preventDefault();
				
			// return false;
		// }
	// });
}

document.addEventListener('DOMContentLoaded', ready);
