define(['jquery', 'jquery-ui'], ($) => {

	// Helper Util functions
	function CssValue(e,name,value){if('undefined'==typeof value)return(value=e.css(name).replace(/px$/,'')).includes('.')?parseFloat(value):parseInt(value);e.css(name,value+'px')}
	function Height (e, h) {return CssValue(e, 'height', h)}
	function Width (e, w) {return CssValue(e, 'width', w)}


	return $.widget('Ui.SplitView', {
		options: {
			direction: 'vertical',
			max: 100,
			min: 0,
			value: 50,

			resizable: {
				handles: ''
			},

			limit: null,
			resize: null
		},
		_CalculateLimits: function () {
			if (this.options.direction == 'horizontal') {
				this._max = Width(this.element) * this.options.max/100
				this._min = Width(this.element) * this.options.min/100
			} else {
				this._max = Height(this.element) * this.options.max/100
				this._min = Height(this.element) * this.options.min/100
			}
		},
		_CalculateValue: function () {
			if (this.options.direction == 'horizontal') {
				this.options.value = (Width($(this.element.children()[0])) / Width(this.element)) * 100
			} else {
				this.options.value = (Height($(this.element.children()[0])) / Height(this.element)) * 100
			}
			this.options.value = Math.round(this.options.value * 1000)/1000
		},
		_ConfigureResizable: function () {
			this._CalculateLimits()
			if (this.options.direction == 'horizontal') {
				this.options.resizable.handles = 'e'
				this.options.resizable.maxHeight = Height(this.element)
				this.options.resizable.minHeight = Height(this.element)
				this.options.resizable.maxWidth = this._max
				this.options.resizable.minWidth = this._min
			} else {
				this.options.resizable.handles = 's'
				this.options.resizable.maxWidth = Width(this.element)
				this.options.resizable.minWidth = Width(this.element)
				this.options.resizable.maxHeight = this._max
				this.options.resizable.minHeight = this._min
			}
			$(this.element.children()[0]).resizable(this.options.resizable)
			this.Update()
		},
		_create: function () {
			// Ensure 2 and only 2 children elements
			while (this.element.children().length < 2) {this.element.append($(`<div>`))}
			this.element.children().toArray().slice(2).forEach(e => {$(e).detach()})

			// Parse element data options
			Object.keys(this.element.data()).forEach(key => {
				if (Object.keys(this.options).includes(key)) {
					this.options[key] = this.element.data(key)
				}
			})

			this.options.resizable.resize = () => {
				this.element.children().each((i, e) => {$(e).triggerHandler('resized')})
				this._CalculateValue()
				this._trigger('resize', {}, this.options.value)
			}
			this._ConfigureResizable()

			let observer = new ResizeObserver((entries) => {entries.forEach(entry => {$(entry.target).triggerHandler('resized', entry.contentRect)})})
			observer.observe(this.element[0])
			this.element.on('resized', () => {this._ConfigureResizable()})
		},
		_min: 0,
		_max: 0,
		_setOption: function (key, value) {
			if (key == 'min' && value == 0) {value = 1}
			if (key == 'max' && value == 100) {value = 99}

			this._super(key, value)
			if (key == 'direction') {
				this.element.attr('data-direction', this.options.direction)
				$(this.element.children()[0]).resizable('destroy')
				this._ConfigureResizable()
				this.Update()
			}
			if (key == 'max' || key == 'min') {
				this._ConfigureResizable()
				this._trigger('limits', {}, {max: this.options.max, min: this.options.min})
			}
			if (key == 'value') {this.Update()}
		},
		Hide: function (...args) {
			if (this.IsShown()) {
				let cb = args[args.length-1] instanceof Function ? args.pop() : () => {}
				let effect = args.length > 0 ? args.shift() : 'fade'
				this._hide(this.element, effect, () => {
					this._trigger('hidden')
					cb()
				})
			}
		},
		IsShown: function () {
			return this.element.css('display') != 'none'
		},
		Show: function (...args) {
			let cb = args[args.length-1] instanceof Function ? args.pop() : () => {}
			let effect = args.length > 0 ? args.shift() : 'fade'

			this._show(this.element, effect, () => {
				this._trigger('shown')
				cb()
			})
		},
		Toggle: function () {
			this._setOption('value', this.options.value > 50 ? this.options.min : this.options.max)
		},
		Update: function () {
			if (this.options.value < this.options.min) {this.options.value = this.options.min}
			if (this.options.value > this.options.max) {this.options.value = this.options.max}

			if (this.options.direction == 'horizontal') {
				Height($(this.element.children()[0]), Height(this.element))
				$(this.element.children()[0]).animate({
					width: Width(this.element) * (this.options.value/100)+'px'
				})
			} else {
				$(this.element.children()[0]).animate({
					height: Height(this.element) * (this.options.value/100)+'px'
				})
				Width($(this.element.children()[0]), Width(this.element))
			}
			this.element.children().each((i, e) => {$(e).triggerHandler('resized')})
			this._trigger('resize', {}, this.options.value)
		}
	})

})
