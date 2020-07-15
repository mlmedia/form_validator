# Form validator plugin (jQuery)

This jQuery plugin is a form validator that allows the user to add error messages directly to the form input element as custom attributes.

## Usage / Installation

Usage of this validation plugin entails the usual process:
1. create the HTML markup
2. add the JavaScript / jQuery refs
3. initialize the plugin with any available options
4. style the markup with CSS as desired.
5. add the custom attributes to the form input elements as described below

### HTML
The following steps describe how to use the form validation.

1. Set up your form HTML.  The markup must use a standard `<form>` element, which can use any ID or class for initialization.
2. Set up your fields wrapped in a container element using a "form-group" class.  This contains inline errors inside a single container element, which can be useful for compound form fields.
3. Add a "validate-trigger" class to any element to trigger the form validation on click (e.g. on the `<button type="submit">` element).  We use a class in order to allow for multi-part forms with multiple validation levels.
4. Add the following custom attributes to any of the form elements input, select, or textarea with the text of your choice for the error. If a form element does not contain the following attributes, no error will be shown for that field.
  - "data-required-error" - error message thrown if the field is required
  - "data-match-error" - error message thrown if a field doesn't match it's counterpart field
  - "data-match" - name attribute of the counterpart field to match
  - "data-email-error" - error message thrown if field must be a valid email
  - "data-email-url" - error message thrown if field must be a valid url
  - "data-alphanumeric-error" - error message thrown if field must be alpha-numeric
  - "data-alpha-error" - error message thrown if field must be alpha only
  - "data-numeric-error" - error message thrown if field must be numeric only
  - "data-float-error" - error message thrown if field must be float (xx.xx) only
  - "data-min-error" - error message thrown if field has a minimum number of characters
  - "data-min" - the minimum number of chars if using "min-error"
  - "data-max-error" - error message thrown if field has a maximum number of characters
  - "data-max" - the maximum number of chars if using "max-error"
  - "data-counterpart-error" - error thrown to a counterpart field (e.g. confirm password)
  - "data-counterpart" - name attribute of the counterpart field to throw the error (e.g. password)

5. Include an "error-container" element within the respective "form-group" element in order to display inline errors for any of the fields within that field group.  Add an an element with an "all-errors-container" class in order to display and contain all of the errors of the form.

An example of the form markup is shown below:

```html
<form id="my_form" action="#" method="post">
	<div class="all-errors-container"><!-- displays all error messages in the form via JS --></div>
	<div class="form-group">
		<div class="field">
			<label>Text field (required)</label>
			<input type="text" name="text_field" value="" placeholder="Text field (required)"
			data-required-error="Text field required">
		</div>
	</div>
	<div class="form-group">
		<div class="field">
			<label>Text field (required)</label>
			<input type="text" name="text_field_2" value="" placeholder="Text field (required)"
			data-required-error="Here's another field required error message!">
		</div>
	</div>
	<div class="form-group">
		<div class="field">
			<label>Alpha-numeric field (required)</label>
			<input type="text" name="alphanumeric_field" value="" placeholder="Alpha-numeric field (required)"
			data-required-error="Alpha-numeric field required">
		</div>
	</div>
	<div class="form-group">
		<div class="field">
			<label>Email field (required)</label>
			<input type="text" name="email_field" value="" placeholder="Email field (required)"
			data-required-error="Email required"
			data-email-error="Valid email required">
		</div>
	</div>
	<div class="form-group">
		<div class="field">
			<label>Textarea (required)</label>
			<textarea type="text" name="textarea_field" rows="5" placeholder="Textarea field"
			data-required-error="Textarea field required"></textarea>
		</div>
	</div>
	<hr>
	<p>We may be busy but your message is important to us.  We will get back to you as soon as we can.</p>
	<div class="field">
		<a href="#" class="btn">Send message</a>
	</div>
</form>
```

### JavaScript / jQuery

Since this plugin utilizes jQuery, we must call it before we can initialize the plugin.  Typically, jQuery will go in the <HEAD> of your HTML document.  You can use a self-hosted copy of it or use one of several CDN hosted versions.  

```html
<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
<!-- CDN-hosted -->
```

_- OR -_

```html
<script src="js/jquery-1.11.3.min.js"></script>
<!-- path to your JS folder -->
```

Anywhere under the jQuery ref, add the ref to the plugin.  This can be added in the `<HEAD>` section or anywhere in the `<BODY>` of the document.

```html
<script src="js/form_validator.js"></script>
<!-- path to your JS folder -->
```

### Initialize the plugin
Initialize the plugin with the selector of the parent element.

```javascript
<script type="text/javascript">
/* define $ as jQuery just in case */
( function( $ )
{
	/* doc ready */
	$( function( )
	{
		$( '#my_parent_id' ).validator( );
	});
})( jQuery );
</script>
```

### Style the plugin with CSS
The demo pages have some basic CSS to add some structure to the page, which can be seen here: [http://demo.dockstreetmedia.com/carousel/css/main.css](http://demo.dockstreetmedia.com/form_validator/css/main.css).  

You can modify or add your own CSS to match your own preferences.

**NOTE**: the CSS should work for all modern browsers (Chrome, Firefox, Safari, etc.) and Internet Explorer 8 and later.  IE 7 and older, things fall apart.  However, if you are still using IE 7, then I'm sorry, but that's your fault.

## Demos

The demos index can be viewed here:
- [http://demo.dockstreetmedia.com/form_validator/index.html](http://demo.dockstreetmedia.com/form_validator/index.html).  

View the source to see how each form was initialized and styled.

## Learn / Adopt / Fork
The entirety of the plugin is included in this repository, including the demo section.  You can easily view all of the code in order to learn more about it.  I try to use clear commenting to explain the code.

Also, feel free to adopt and adapt to make it your own.  If you like, fork it and send over a pull request.  Add or solve existing issues.  It is open-source, after all.
