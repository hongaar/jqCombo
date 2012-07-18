(function($, undefined) {
	"use strict";
	
	/**
	* @version 0.1
	*
	*/
	
	/**
	 * Configuration
	 */
	var defaults = {
		// No options yet
	};
	
	var config = {
		ignoreKeys: [			
			35, // end
			36, // home
			37, // left
			39 // right			
		],
		noselectionKeys: [
			8, // backspace
			46 // delete
		]
	};
	
	/**
	 * Some variables
	 */
	var _options;
	var _keypressCounter = 0;
	
	// Object of plugin methods	
	var methods = {
		init: function(o) {
			// Not on mobile devices
			if (_isMobile().any()) {
				return false;
			}
			
			// Extend options with defaults
			_options = $.extend(defaults, o);
			
			// The Loop
			return this.each(function() {
				var $select = $(this);
				
				// Adds the textbox
				var $input = _inputAfter($select);
				
				// Watch the select for changes and update input right away
				_watchChanges($select, $input);
				
				// Keypress counter and repeater neutralizer
				_initKeypressCounter($input);
				
				// Autocompletes the input when typing
				_autocompleteInput($select, $input);
				
				// Selects all text on focus in input element
				_selectallOnFocus($input);				
			});
		}
	};
	
	/**
	 * Private methods
	 */
	
	// Adds a input element after the textbox and positions it
	function _inputAfter($select) {
		var $input = $('<input/>');
		
		// Default options for input
		$input.css({
			position: 'absolute'
		});
		
		// Position relative to select element
		_positionInput($select, $input);
		
		// Set text value to select value
		$input.val($select.find('option:selected').text());
		
		// Insert into DOM
		$select.after($input);
		
		// Return to callee with the new input element
		return $input;
	}
	
	// Positions the input element
	function _positionInput($select, $input) {
		var offset = _positionCorrection();
		$input.css({
			top		: $select.position().top - offset.top,
			left	: $select.position().left - offset.left,
			width	: $select.width() - offset.width,
			height	: $select.height() - offset.height
		});
	}
	
	// Get position correction for input based on browsers
	function _positionCorrection() {
		var offset = {
			top		: -2,
			left	: 0,
			width	: 18,
			height	: 4
		};
		// TODO: browser correction
		if ($.browser.msie) {
			//offset.left = 5;
		}
		return offset;
	}
	
	// Watch the select box for changes and updated input
	function _watchChanges($select, $input) {
		$select.on('change', function() {
			$input.val($select.find('option:selected').text());
		});
	}
	
	// The beating heart: autocomplete function
	function _autocompleteInput($select, $input) {
		$input.on('keyup', function(e) {			
			// Ignoring subsequent keypresses to prevents quirks
			if (_keypressCounter > 0) {
				return;
			}
			
			// Ignore this key?
			if ($.inArray(e.keyCode, config.ignoreKeys) >= 0) {
				return;
			}
			
			// Resets the notfound color
			_resetNotfound($input);
			
			// Gets the current input text
			var typedText = $input.val();
			
			// Find an option containing our text (case-insensitive)
			// TODO: escape text
			var $match = $select.find('option:startswithi(\'' + typedText + '\'):eq(0)');
			var matchedText = $match.text();
			
			// Do we have a match?
			if ($match.length) {
				// Set select box to match
				$select.val($match.val());
				
				// Make selection if not in noselectionKeys list
				if ($.inArray(e.keyCode, config.noselectionKeys) == -1) {
					$input.val(matchedText);
					_createSelection($input, typedText.length, matchedText.length)
				}				
			} else {
				// Set select box to option without value
				// TODO: if no such option exist?
				$select.val('');
				
				// Set notfound color on input
				_markNotfound($input);
			}			
		});
	}
	
	// Keypress counter and repeater neutralizer
	function _initKeypressCounter($input) {
		var lastKeycode = null;
		$input.on('keydown', function(e) {
			// Keypress counter and repeater neutralizer
			if (e.keyCode != lastKeycode) {
				lastKeycode = e.keyCode;
				_keypressCounter++;
			}
		});
		
		$input.on('keyup', function(e) {
			// Keypress counter and repeater neutralizer
			_keypressCounter--;
			lastKeycode = null;
		});		
	}
	
	// Resets the notfound color
	function _resetNotfound($input) {
		$input.css({
			color: 'black'
		});
	}
		
	// Marks an input as having no matches in the select
	function _markNotfound($input) {
		$input.css({
			color: 'red'
		});
	}
	
	// @source http://stackoverflow.com/a/646662/938297
	function _createSelection($field, start, end) {
		var field = $field[0];
        if (field.createTextRange) {
            var selRange = field.createTextRange();
            selRange.collapse(true);
            selRange.moveStart('character', start);
            selRange.moveEnd('character', end);
            selRange.select();
        } else if (field.setSelectionRange) {
            field.setSelectionRange(start, end);
        } else if (field.selectionStart) {
            field.selectionStart = start;
            field.selectionEnd = end;
        }
        field.focus();
    }       
	
	// Selects all input gets focus by click only
	// TODO: rewrite for use with tabstop too
	function _selectallOnFocus($input) {
		$input.on('click', function(e) {
			$(this).select();
		});
	}
	
	// @source http://www.abeautifulsite.net/blog/2011/11/detecting-mobile-devices-with-javascript/
	function _isMobile() {
		return {
			android: function() {
				return navigator.userAgent.match(/Android/i) ? true : false;
			},
			blackberry: function() {
				return navigator.userAgent.match(/BlackBerry/i) ? true : false;
			},
			ios: function() {
				return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
			},
			windows: function() {
				return navigator.userAgent.match(/IEMobile/i) ? true : false;
			},
			any: function() {
				return (this.android() || this.blackberry() || this.ios() || this.windows());
			}
		}
	}
	
	$.fn.jqCombo = function(method) {
    
		// Method calling logic
		if ( methods[method] ) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.jqCombo');
			return false;
		}
  
	};
	
})(jQuery);

// @source http://stackoverflow.com/a/4936066/938297
$.extend($.expr[':'], {
	'startswithi': function(elem, i, match, array) {
		return (elem.textContent || elem.innerText || '').toLowerCase()
			.indexOf((match[3] || "").toLowerCase()) == 0;
	}
});