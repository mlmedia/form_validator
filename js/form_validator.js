/**
 * Form validator using custom attributes for error messages
 */
/* define $ as jQuery just in case */
( function( $ )
{
	/* doc ready */
	$( function( )
	{
		/** 
		 * validate form elements with jQuery by class and custom attributes - my custom plugin
		 *
		 * TODO - make it more robust and turn into a plugin
		 * ---
		 * usage: 
		 * 1. add "validate_this_form" class to the button, anchor, or other element that submits the form
		 * 2. add the following custom attributes to the input / textarea elements:
		 *    - "data-required-error" - error message thrown if the field is required
		 *    - "data-match-error" - error message thrown if a field doesn't match it's counterpart field
		 *    - "data-match" - name attribute of the counterpart field to match
		 *    - "data-email-error" - error message thrown if field must be a valid email
		 *	  - "data-email-url" - error message thrown if field must be a valid url
		 *    - "data-alphanumeric-error" - error message thrown if field must be alpha-numeric
		 *	  - "data-alpha-error" - error message thrown if field must be alpha only
		 *	  - "data-numeric-error" - error message thrown if field must be numeric only
		 *	  - "data-float-error" - error message thrown if field must be float (xx.xx) only
		 *    - "data-min-error" - error message thrown if field has a minimum number of characters
		 *    - "data_min" - the minimum number of chars if using "min-error"
		 *    - "data-max-error" - error message thrown if field has a maximum number of characters
		 *    - "data-max" - the maximum number of chars if using "max-error"
		 *    - "data-counterpart-error" - error thrown to a counterpart field (e.g. confirm password)
		 *    - "data-counterpart" - name attribute of the counterpart field to throw the error (e.g. password)
		 * 3. error messages are thrown to "error_container" element within the respective "field_group" element and "errors" container
		 */
		$( '.validate_this_form' ).click( function( e ) 
		{
			var form = $( this ).parents( 'form' );

			/* clear the errors */
			form.find( '.errors' ).html( '' );
			form.find( '.error_container' ).html( '' );
			form.find( '.error_field' ).removeClass( 'error_field' );
			var errors = { };

			/** 
			 * check standard validations 
			 * go in reverse order of priority
			 * (e.g.) required should be the first thing checked, but it goes on the bottom
			 * so that it takes over the value of the errors[field.name] and the 
			 * lower priority errors do not get displayed at the same time
			 */
			$.each( form.serializeArray( ), function( i, field ) 
			{ 
				var form_input = form.find( '*[name=' + field.name + ' ]' );
				if ( form_input.attr( 'data-match-error' ) !== undefined && form_input.attr( 'data-match' ) !== undefined )
				{
					var match_field = form_input.attr( 'data-match' );

					/* if the match field exists */
					if ( form.find( '*[name=' + match_field + ' ]' ).length !== 0 ) 
					{
						if ( field.value !== $( '*[name=' + match_field + ' ]' ).val( ) )
						{
							errors[ field.name ] = form_input.attr( 'data-match-error' );
						}
					}
				}
				if ( form_input.attr( 'data-email-error' ) !== undefined )
				{
					if ( field.value.length > 0 && ! is_valid_email( field.value ) )
					{
						errors[ field.name ] = form_input.attr( 'data-email-error' );
					}
				}
				if ( form_input.attr( 'data-url-error' ) !== undefined )
				{
					if ( field.value.length > 0 && ! is_valid_url( field.value ) )
					{
						errors[ field.name ] = form_input.attr( 'data-url-error' );
					}
				}
				
				/* we use "else if" below since the following validations cannot be used together */
				if ( form_input.attr( 'data-alphanumeric-error' ) !== undefined )
				{
					if ( field.value.length > 0 && ! is_alphanumeric( field.value ) )
					{
						errors[ field.name ] = form_input.attr( 'data-alphanumeric-error' );
					}
				}
				else if ( form_input.attr( 'data-alpha-error' ) !== undefined )
				{
					if ( field.value.length > 0 && ! is_alpha( field.value ) )
					{
						errors[ field.name ] = form_input.attr( 'data-alpha-error' );
					}
				}
				else if ( form_input.attr( 'data-numeric-error' ) !== undefined )
				{
					if ( field.value.length > 0 && ! is_numeric( field.value ) )
					{
						errors[ field.name ] = form_input.attr( 'data-numeric-error' );
					}
				}
				else if ( form_input.attr( 'data-float-error' ) !== undefined )
				{
					if ( field.value.length > 0 && ! is_float( field.value ) )
					{
						errors[ field.name ] = form_input.attr( 'data-float-error' );
					}
				}
				if ( form_input.attr( 'data-min-error' ) !== undefined && form_input.attr( 'data-min' ) !== undefined )
				{
					if ( field.value.length < form_input.attr( 'data-min' ) )
					{
						errors[ field.name ] = form_input.attr( 'data-min-error' );
					}
				}
				if ( form_input.attr( 'data-max-error' ) !== undefined && form_input.attr( 'data-max' ) !== undefined )
				{
					if ( field.value.length > form_input.attr( 'data-max' ) )
					{
						errors[ field.name ] = form_input.attr( 'data-max-error' );
					}
				}
				if ( form_input.attr( 'data-required-error' ) !== undefined )
				{
					if ( field.value.length === 0 )
					{
						errors[ field.name ] = form_input.attr( 'data-required-error' );
					}
				}

			});

			/**
			* if the errors aren't empty
			*/
			if ( ! $.isEmptyObject( errors ) ) 
			{
				/* set the counterpart errors */
				$.each( errors, function( key, value ) 
				{
					if ( form.find( '*[name=' + key + ']' ).attr( 'data-counterpart' ) !== undefined )
					{
						var cp_message = form.find( '*[name=' + key + ' ]' ).attr( 'data-counterpart-error' ) !== undefined ? form.find( '*[name=' + key + ' ]' ).attr( 'data-counterpart-error' ) : '&nbsp;';
						var counterpart = form.find( '*[name=' + key + ' ]' ).attr( 'data-counterpart' );
						errors[ counterpart ] = ! errors[ counterpart ] ? cp_message : errors[ counterpart ];
					}
				});

				/* display the errors to error elements + set error classes */
				$.each( errors, function( key, value ) 
				{
					if ( form.find( '*[name=' + key + ']' ).length !== 0 )
					{
						var field_group = form.find( '*[name=' + key + ']').parents( '.field_group' ); /* field group is used instead of field for compound fields */
						field_group.find( '.error_container' ).html( value ); 
						field_group.addClass( 'error_field' ); 
						
						/* displays all errors into the errors container */
						$( '.errors' ).append( value + '<br />' );
					}
				}); 

				/* scroll to the top of the form */
				$( 'html, body' ).animate({
					scrollTop: $( form ).offset( ).top
				}, 500 );

				/* clear the password fields */
				$.each( form.serializeArray( ), function( i, field ) 
				{
					var form_input = form.find( '*[name=' + field.name + ' ]' );
					if ( form_input.attr( 'type' ) === 'password' )
					{
						form_input.val( '' );
					}
				});
			}

			/**
			* otherwise submit the form
			*/
			
			if ( $.isEmptyObject( errors ) ) 
			{
				form.submit( );
			}
			e.preventDefault( );
		});
		
		/* check for alpha-numeric */
		function is_alphanumeric( string ) 
		{
			var regex = /^[A-Za-z0-9_.-]+$/;
			if ( regex.test( string ) === true ) 
			{
				return true;
			} 
			return false;
		}

		/* check for valid email address */
		function is_valid_email( email ) 
		{
			var email_regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
			if ( email_regex.test( email ) === true ) 
			{
				return true;
			} 
			return false;
		}
		
	});
	
})( jQuery );