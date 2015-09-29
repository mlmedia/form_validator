/**
 * Form validator using custom attributes for error messages
 */
/* define $ as jQuery just in case */
(function($) {
	/* circular carousel - my custom plugin */
	$.fn.validate = function() {
		/* set static vars */
		var form = this;

		/* navigation */
		form.submit(function(e) {

			/* prevent form submission (default response) */
			e.preventDefault();

			/* clear the errors */
			form.find('.all-errors-container').html('');
			form.find('.error-container').html('');
			form.find('.error-field').removeClass('error-field');
			var errors = {};

			/**
			 * check standard validations
			 * go in reverse order of priority
			 * (e.g.) required should be the first thing checked, but it goes on the bottom
			 * so that it takes over the value of the errors[field.name] and the
			 * lower priority errors do not get displayed at the same time
			 */
			$.each(form.serializeArray(), function(i, field) {
				var form_input = form.find('*[name=' + field.name + ' ]');
				if (form_input.attr('data-match-error') !== undefined && form_input.attr('data-match') !== undefined) {
					var match_field = form_input.attr('data-match');

					/* if the match field exists */
					if (form.find('*[name=' + match_field + ' ]').length !== 0) {
						if (field.value !== $('*[name=' + match_field + ' ]').val()) {
							errors[field.name] = form_input.attr('data-match-error');
						}
					}
				}
				if (form_input.attr('data-email-error') !== undefined) {
					if (field.value.length > 0 && !is_valid_email(field.value)) {
						errors[field.name] = form_input.attr('data-email-error');
					}
				}
				if (form_input.attr('data-url-error') !== undefined) {
					if (field.value.length > 0 && !is_valid_url(field.value)) {
						errors[field.name] = form_input.attr('data-url-error');
					}
				}

				/* we use "else if" below since the following validations cannot be used together */
				if (form_input.attr('data-alphanumeric-error') !== undefined) {
					if (field.value.length > 0 && !is_alphanumeric(field.value)) {
						errors[field.name] = form_input.attr('data-alphanumeric-error');
					}
				} else if (form_input.attr('data-alpha-error') !== undefined) {
					if (field.value.length > 0 && !is_alpha(field.value)) {
						errors[field.name] = form_input.attr('data-alpha-error');
					}
				} else if (form_input.attr('data-numeric-error') !== undefined) {
					if (field.value.length > 0 && !is_numeric(field.value)) {
						errors[field.name] = form_input.attr('data-numeric-error');
					}
				} else if (form_input.attr('data-float-error') !== undefined) {
					if (field.value.length > 0 && !is_float(field.value)) {
						errors[field.name] = form_input.attr('data-float-error');
					}
				}
				if (form_input.attr('data-min-error') !== undefined && form_input.attr('data-min') !== undefined) {
					if (field.value.length < form_input.attr('data-min')) {
						errors[field.name] = form_input.attr('data-min-error');
					}
				}
				if (form_input.attr('data-max-error') !== undefined && form_input.attr('data-max') !== undefined) {
					if (field.value.length > form_input.attr('data-max')) {
						errors[field.name] = form_input.attr('data-max-error');
					}
				}
				if (form_input.attr('data-required-error') !== undefined) {
					if (field.value.length === 0) {
						errors[field.name] = form_input.attr('data-required-error');
					}
				}

			});

			/**
			 * if the errors aren't empty
			 */
			if (!$.isEmptyObject(errors)) {
				/* set the counterpart errors */
				$.each(errors, function(key, value) {
					if (form.find('*[name=' + key + ']').attr('data-counterpart') !== undefined) {
						var cp_message = form.find('*[name=' + key + ' ]').attr('data-counterpart-error') !== undefined ? form.find('*[name=' + key + ' ]').attr('data-counterpart-error') : '&nbsp;';
						var counterpart = form.find('*[name=' + key + ' ]').attr('data-counterpart');
						errors[counterpart] = !errors[counterpart] ? cp_message : errors[counterpart];
					}
				});

				/* display the errors to error elements + set error classes */
				$.each(errors, function(key, value) {
					if (form.find('*[name=' + key + ']').length !== 0) {

						/* field group is used instead of field for compound fields */
						var field_group = form.find('*[name=' + key + ']').parents('.field-group');
						field_group.find('.error-container').html(value);
						field_group.addClass('error-field');

						/* displays all errors into the error-container - if desired */
						$('.all-errors-container').append(value + '<br />');
					}
				});

				/* scroll to the top of the form */
				$('html, body').animate({
					scrollTop: $(form).offset().top
				}, 500);

				/* clear the password fields */
				$.each(form.serializeArray(), function(i, field) {
					var form_input = form.find('*[name=' + field.name + ' ]');
					if (form_input.attr('type') === 'password') {
						form_input.val('');
					}
				});
			}

			/**
			 * otherwise submit the form
			 */

			if ($.isEmptyObject(errors)) {
				form.submit();
			}
		});

		/* check for valid URL */
		function is_valid_url(string) {
			var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
			if (regex.test(string) === true) {
				return true;
			}
			return false;
		}

		/* check for alpha-numeric */
		function is_alphanumeric(string) {
			var regex = /^[A-Za-z0-9_.-]+$/;
			if (regex.test(string) === true) {
				return true;
			}
			return false;
		}

		/* check for valid email address */
		function is_valid_email(email) {
			var email_regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
			if (email_regex.test(email) === true) {
				return true;
			}
			return false;
		}

	}
})(jQuery);
