# jqCombo - jQuery combobox plugin

Simple jQuery plugin to create combobox / autocomplete functionality

Only a very lightweight plugin which uses a native browser `INPUT` element,
no custom panels or jQuery UI stuff.

However, please note that this plugin requires some browser sniffing and
tricky positioning of the `INPUT` element over the `SELECT` element.

Using this plugin on styled `SELECT` elements might not work
as expected.

Tested with: Chrome 20, IE7+, Firefox 13, Safari 5.1, Opera 12.
On IE6 and mobile devices it will just show the `SELECT` element

## Usage
	
    $('select').jqCombo();

## Options

    // These options are the defaults
    $('select').jqCombo({
        expandOnFocus : true,
        expandSize    : 10,
        notfoundCss   : { color: 'red' }
    });

## Demo

http://nabble.nl/demo/jqcombo/index.html