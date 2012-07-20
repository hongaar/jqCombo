# jqCombo - jQuery combobox plugin

Simple jQuery plugin to create combobox / autocomplete functionality

Only a very lightweight plugin which uses a native browser `INPUT` element,
no custom panels or jQuery UI stuff.

However, please note that this plugin requires some browser sniffing and
tricky positioning of the `INPUT` element over the `SELECT` element.

Using this plugin on styled `SELECT` elements might not work
as expected.

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