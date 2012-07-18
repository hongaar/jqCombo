(function($, undefined) {
	"use strict";
	
	/**
	* @version 0.1
	*
	*/
	
	// Plugin defaultss
	var defaults = {
		// No options yet
	};
	
	var options;
	
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
	
	// Object of plugin methods	
	var methods = {
		init: function(o) {
			options = $.extend(defaults, o);			
			return this.each(function() {
				var $this = $(this);
				
				// Adds the textbox
				var $input = _inputAfter($this);
				
				// Watch the select for changes and update input right away
				_watchChanges($this, $input);
				
				// Autocompletes the input when typing
				_autocompleteInput($this, $input);
				
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
	
	function _positionCorrection() {
		var offset = {
			top		: -2,
			left	: 0,
			width	: 18,
			height	: 4
		};
		if ($.browser.msie) {
			offset.left = 5;
		}
		return offset;
	}
	
	function _watchChanges($select, $input) {
		$select.on('change', function() {
			$input.val($select.find('option:selected').text());
		});
	}
	
	function _autocompleteInput($select, $input) {
		// Keypress counter and repeater neutralizer
		var i = 0;
		var lastKeycode;
				
		$input.on('keydown', function(e) {
			// Keypress counter and repeater neutralizer
			if (e.keyCode != lastKeycode) {
				lastKeycode = e.keyCode;
				i++;
			}
		});
		
		$input.on('keyup', function(e) {
			// Keypress counter and repeater neutralizer
			i--;
			lastKeycode = null;
			
			// Ignoring subsequent keypresses to prevents quirks
			if (i > 0) {
				return;
			}
			
			// Ignore this key?
			if ($.inArray(e.keyCode, config.ignoreKeys) >= 0) {
				return;
			}
			
			// Resets the notfound color
			_resetColor($input);
			
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
				_notfoundColor($input);
			}			
		});
	}
	
	function _resetColor($input) {
		$input.css({
			color: 'black'
		});
	}
	
	function _notfoundColor($input) {
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
	
	function _selectallOnFocus($input) {
		$input.on('click', function() {
			$(this).select();
		});
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