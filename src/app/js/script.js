
/* global window, document, hljs, JSONFormatter, jQuery */
/* eslint no-alert: 0*/
((($) => {
	$(document).ready(function () {

		function init() {
			var $modal = $(window.location.hash);
			if ($modal.length < 1) {
				return;
			}
			$modal.eq(0).modal('show');
		}

		init();

		$('.modal')
			.on('shown.bs.modal', function (event) {
				var $modal = $(event.currentTarget);
				window.location.hash = $modal.attr('id');
			})
			.on('hide.bs.modal', function () {
				window.location.hash = '';
			});

		$('.page-header pre code, .top-resource-description pre code').each(function (i, block) {
			hljs.highlightBlock(block);
		});

		$('.btn[data-toggle="collapse"]', '.js-controlled-collapse').on('click', function (event) {
			var $btn = $(event.currentTarget);
			var $controlled = $btn.parents('.js-controlled-collapse');
			var $collapse = $($btn.attr('href'));

			if ($controlled.length < 1) {
				return true;
			}

			if ($collapse.hasClass('in')) {
				$collapse.removeClass('in');
				return false;
			}

			$('.collapse', $controlled).each(function () {
				$(this).removeClass('in');
			});
		});

		$('[data-toggle]').on('click', function () {
			var selector = $(this).data('target') + ' pre code';

			$(selector).each(function (i, block) {
				hljs.highlightBlock(block);
			});
		});

		$('.js-format-json').each(function () {
			var $elem = $(this);
			var jsonData = JSON.parse($('.js-format-json__json', $elem).html());
			var formatter = new JSONFormatter(jsonData, 2);

			$('.js-format-json__outlet-formatted', $elem).html(formatter.render());
		});

		$('[data-load-code-url]').click(function () {
			var path = $(this).data('load-code-url');
			var selector = $(this).attr('href') + ' pre code';

			$.ajax({
				url: '/service/mock-preview',
				dataType: 'text',
				data: {
					path: path,
				},
				cache: false,
				success: function (data) {
					$(selector).html(data).each(function (i, block) {
						hljs.highlightBlock(block);
					});
				},
			});
		});

		/**
		 * @param {Object} event - the click event object
		 * @returns {void}
		 * @private
		 */
		function _storeSettings(event) {
			var $ipt = $(event.currentTarget);
			var $form = $ipt.closest('.js-form-change-save');

			event.preventDefault();

			$ipt.attr('data-status', 'saving');

			$.ajax({
				url: $form.attr('action'),
				type: $form.attr('method'),
				data: {
					key: $ipt.attr('name'),
					value: $ipt.val(),
				},
				success: function () {
					$ipt.attr('data-status', 'saved');
				},
				error: function () {
					$ipt.attr('data-status', 'error');
				},
			});
		}

		$('.js-form-change-save').on('submit', _storeSettings);

		$('.js-form-change-save input').
			on('keydown', function (event) {
				$(event.currentTarget).attr('data-status', 'not-saved');
			}).
			on('change', _storeSettings)
		;

		$('.js-change-response-data').on('change', function (event) {
			var $radio = $(event.currentTarget);

			$.ajax({
				url: '/service/expected-response',
				type: 'post',
				data: {
					value: $radio.val(),
					path: $radio.data('path'),
				},
			});

		});

		/**
		 * @param {Array} data - list of messages
		 * @returns {Array} dom elements
		 * @private
		 */
		function getLogRows(data) {
			var type;
			var out;

			if (data instanceof Array && data.length > 0) {
				out = data.map(function (msg) {

					switch (msg.type) {
						case 'error':
							type = 'danger';
							break;
						case 'warn':
							type = 'warning';
							break;
						case 'neutral':
							type = 'active';
							break;
						default:
							type = msg.type;
							break;
					}

					return '' +
						'<tr>' +
						'<td class="' + type + '" style="width:6px;padding:0;"></td>' +
						'<td>' + msg.time + '</td>' +
						'<td>' + msg.msg + '</td>' +
						'</tr>';
				});
			}

			return out;
		}

		$('.js-swagger-import-run').on('click', function (event) {
			var $btn = $(event.currentTarget);
			var $mBody = $btn.closest('.modal-body');
			var $outlet = $('.js-swagger-import-outlet', $mBody);
			var $result = $('.js-swagger-import-outlet-result', $mBody);

			$btn.remove();
			$outlet.html('Loading ...');

			$.ajax({
				url: '/service/swagger-import',
				type: 'get',
				success: function (data) {
					$result.html(getLogRows(data));
					$outlet.html('<a href="/" class="btn btn-lg btn-primary js-reload">Reload</a>');
				},
			});
		});

		$('.js-open-validation-result').on('click', function (event) {
			var $btn = $(event.currentTarget);
			var $modal = $($btn.data('target'));
			var $result = $('.js-outlet-result', $modal);

			$result.html(getLogRows(window.validationResult));
		});

		$('.js-validate-single').on('click', function (event) {
			event.preventDefault();

			var $btn = $(event.currentTarget);
			var $modal = $('#_modal_validate_single');
			var $outlet = $('.js-outlet', $modal);
			var $result = $('.js-outlet-result', $modal);

			$modal.modal();
			$outlet.html('Loading ...');

			$.ajax({
				url: '/service/validation/response',
				type: 'get',
				data: {
					path: $btn.data('path'),
					method: $btn.data('method'),
					expected: $btn.data('expected'),
				},
				success: function (data) {
					$result.html(getLogRows(data));
					$outlet.html('<a href="/" class="btn btn-lg btn-primary js-reload">Reload</a>');
				},
			});

		});

		$('.js-validate').on('click', function (event) {
			event.preventDefault();

			var $modal = $('#_modal_validate');
			var $outlet = $('.js-outlet', $modal);
			var $result = $('.js-outlet-result', $modal);

			$modal.modal();
			$outlet.html('Loading ...');

			$.ajax({
				url: '/service/validation/responses',
				type: 'get',
				success: function (data) {
					$result.html(getLogRows(data));
					$outlet.html('<a href="/" class="btn btn-lg btn-primary js-reload">Reload</a>');
				},
			});

		});

		$('.js-collection-activate').on('click', function (event) {
			event.preventDefault();

			var $btn = $(event.currentTarget);
			var $modal = $btn.closest('.js-modal');
			var $btns = $('.js-btn', $modal);
			var $outlet = $('.js-outlet', $modal);

			$outlet.html('Activating ...');
			$btns.prop('disabled', true);

			$.ajax({
				url: '/service/collection/' + $btn.data('id') + '/activate',
				type: 'post',
				success: function () {
					$btns.remove();
					$outlet.html('<a href="/" class="btn btn-lg btn-primary js-reload">Reload</a>');
				},
				error: function () {
					$btns.prop('disabled', false);
					$outlet.html('Error, please try again later!');
				},
			});
		});

		$('.js-collection-delete').on('click', function (event) {
			event.preventDefault();

			var $btn = $(event.currentTarget);
			var $modal = $btn.closest('.js-modal');
			var $btns = $('.js-btn', $modal);
			var $outlet = $('.js-outlet', $modal);

			$outlet.html('Deleting ...');
			$btns.prop('disabled', true);

			$.ajax({
				url: '/service/collection/' + $btn.data('id'),
				type: 'delete',
				success: function () {
					$btns.remove();
					$outlet.html('<br /><a href="/" class="btn btn-lg btn-primary js-reload">Reload</a>');
				},
				error: function () {
					$btns.prop('disabled', false);
					$outlet.html('Error, please try again later!');
				},
			});
		});

		$('.js-open-ide').on('click', function (event) {
			var path = $(event.currentTarget).data('path');
			$.ajax({
				url: '/service/open?path=' + encodeURIComponent(path),
			});
		});

		$('.js-reload').on('click', function (event) {
			event.preventDefault();
			window.location.reload();
		});

		$('.js-add-response').on('click', function (event) {
			event.preventDefault();

			var $btn = $(event.currentTarget);
			var name = [$('#newResponseName').val(), '.', $('#newResponseType').val()].join('');
			if (name === '.' || name.indexOf('.') === 0) {
				return;
			}
			var path = encodeURIComponent($btn.data('path'));
			var method = encodeURIComponent($btn.data('method'));


			$.ajax({
				url: '/service/response/' + path + '/' + method,
				type: 'post',
				data: {
					name,
				},
				success: function () {
					window.location.reload();
				},
				error: function () {
					window.alert('Error: please try again later!');
				},
			});
		});

		$('.js-response-type ul.dropdown-menu li a').click(function (e) {
			$('.js-response-type input').val(e.target.text).focus();
		});

		// must apply field value on change, else value is not updated
		$('input.new-response-name').on('change', function (e) {
			$('input#newResponseName').val(e.currentTarget.value);
		});

		// must apply field value on change, else value is not updated
		$('input.new-response-type').on('change', function (e) {
			$('input#newResponseType').val(e.currentTarget.value);
		});

		$(function () {
			$('[data-toggle="popover"]').popover();
		});

		$('.js-delete-response').on('click', function (event) {
			event.preventDefault();

			var $btn = $(event.currentTarget);
			var path = encodeURIComponent($btn.data('path'));
			var method = encodeURIComponent($btn.data('method'));
			var name = $btn.data('name');
			var accepted = window.confirm('Are you sure?');

			if (accepted !== true) {
				return;
			}

			$.ajax({
				url: '/service/response/' + path + '/' + method,
				type: 'delete',
				data: {
					name,
				},
				success: function () {
					window.location.reload();
				},
				error: function () {
					window.alert('Error: please try again later!');
				},
			});
		});

	});
})(jQuery));
