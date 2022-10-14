requirejs.config({paths: {'@web': '../../src/'}})
require(['jquery', '@web/Ui'], ($) => {
	$(() => {
		$('.Ui.Layout.Split').Split({
			resize: (event, value) => {
				$('.Value').val(value)
			},
			create: () => {
				$('.Min').val($('.Ui.Layout.Split').Split('option', 'min'))
				$('.Max').val($('.Ui.Layout.Split').Split('option', 'max'))
			},
			limits: (event, limits) => {
				$('.Min').val(limits.min)
				$('.Max').val(limits.max)
			}
		})
		$('.Value').val($('.Ui.Layout.Split').Split('option', 'value'))

		$('.Min').on('change', (...args) => {
			$('.Ui.Layout.Split').Split('option', 'min', $('.Min').val())
		})
		$('.Max').on('change', (...args) => {
			$('.Ui.Layout.Split').Split('option', 'max', $('.Max').val())
		})
		$('.Value').on('change', (...args) => {
			$('.Ui.Layout.Split').Split('option', 'value', $('.Value').val())
		})

		$('.Toggle').on('click', (...args) => {
			$('.Ui.Layout.Split').Split('Toggle')
		})
	})
})
