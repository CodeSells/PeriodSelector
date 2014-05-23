/*!
	Period Selector 1.0.1 - 2014-05-15
	jQuery Year or Month Selector
	(c) 2014, http://tinytools.codesells.com
	license: http://www.opensource.org/licenses/mit-license.php
*/

; (function ($, document, window) {
	var periodSelector = 'periodSelector';
	var periodSelectorGeneralSettings;
	var monthsName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "dec"];

	if ($.periodSelector) { 
		return;
	}

	publicMethod = $.fn[periodSelector] = $[periodSelector] = function (options) {
		var settings = options;

		return this.each(function (i, obj) {
			initializePeriodSelectors(obj, settings);
		});
	};

	function setSettings(options) {
		var settings = $.extend({ 
			defaultYear: 2014,
			months: {},

			//Events: 
			onYearClick: false,
			onMonthClick: false
		}, options);

		return settings;
	}

	function getSettings(internalElement) {
		return internalElement.closest('.PeriodSelector').data('settings');
	}

	function initializePeriodSelectors(obj, settings) {
		var setting = setSettings({});
		setting = $.extend(setting, periodSelectorGeneralSettings);
		settings = $.extend(setting, settings);

		var content = '<div class="PeriodSelector">';
		content += addYearContent();

		var years = extractYears(settings);
		for (var i = 0; i < years.length; i++) {
			content += addYearContent(years[i], settings);
		};

		content += '</div>';

		$(obj).append(content);
		var addedObj = $(obj).children().last();
		addedObj.data("settings", settings);
	}

	function addYearContent(year, settings) {
		var result = '<div class="PeriodSelectorYearContent">';
		var yearValue = year == undefined ? 0 : year;
		result += '<div class="Year" onclick="$.periodSelector.yearClick(' + yearValue + ', $(this));">' + (year == undefined ? "Recent" : year.toString()) + '</div>';
		if (settings != undefined)
			result += addMonthsContent(year, settings);
		result += '</div>'

		return result; 
	}

	function addMonthsContent(year, settings) {
		var months = extractMonths(year, settings);
		var result = '';
		var activeMonth;

		for (var i = 0; i < 12; i++) {
			activeMonth = $.inArray(i + 1, months) >= 0;

			result += '<div class="Month' +
					  (activeMonth ? ' Active" onclick="$.periodSelector.monthClick(' + (i + 1) + ', ' + year + ', $(this));' : '') +
					  '">' +
					  monthsName[i] +
					  '</div>';
		}

		return result;
	}

	function sortByNumber(a, b) {
		return a > b ? 1 : a == b ? 0 : -1;
	}

	function sortByNumberDesc(a, b) {
		return a < b ? 1 : a == b ? 0 : -1;
	}

	function extractYears(settings) {
		var years = new Array();

		for (var i = 0; i < settings.months.length; i++) {
			if ($.inArray(settings.months[i].year, years) < 0)
				years.push(settings.months[i].year);
		};

		years.sort(sortByNumberDesc);
		return years;
	}

	function extractMonths(year, settings) {
		var months = new Array();

		for (var i = 0; i < settings.months.length; i++) {
			if (settings.months[i].year == year && $.inArray(settings.months[i].month, months) < 0)
				months.push(settings.months[i].month);
		};

		months.sort(sortByNumber);
		return months;
	}

	publicMethod.getSettings = function (internalElement) {
		return internalElement.closest('.PeriodSelector').data('settings');
	}

	publicMethod.monthClick = function (monthValue, yearValue, caller) {
		trigger(getSettings(caller).onMonthClick, monthValue, yearValue, caller);
	}

	publicMethod.yearClick = function (value, caller) {
		caller.closest(".PeriodSelector").find(".Month").slideUp();

		if (!caller.hasClass("Selected")) {
			caller.closest(".PeriodSelector").find(".Year").removeClass("Selected");
			caller.closest(".PeriodSelectorYearContent").children(".Month").slideDown();
			caller.addClass("Selected");
		}
		else
			caller.removeClass("Selected");

		trigger(getSettings(caller).onYearClick, value, caller);
	}

	function trigger(callback, value, caller) {
		if ($.isFunction(callback)) {
			callback.call(undefined, value, caller);
		}
	}
}(jQuery, document, window));