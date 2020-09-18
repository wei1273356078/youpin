var regionPicker = (function() {
	var region = {
		_provinces: regions.map(function(item) { return item.name; }),
		_province: null,
		_provinceStr: '',
		_cities: [],
		_city: null,
		_cityStr: '',
		_areas: [],
		_area: null,
		_areaStr: '',
		_streets: [],
		_streetStr: ''
	};
	Object.defineProperty(region, 'streetStr', {
		get: function() { return this._streetStr; },
		set: function(val) { 
			this._streetStr = val;
			// dom更新
			document.querySelector('.region-street').value = val;
		}
	});
	Object.defineProperty(region, 'areaStr', {
		get: function() { return this._areaStr; },
		set: function(val) {
			this._areaStr = typeof val === 'string' ? val : val[0];
			this._area = this._city.childs.find(function(item) { return item.name === this._areaStr }.bind(this));
			this._streets = this._area.childs.map(function(item) { return item.name; });
			// dom更新
			document.querySelector('.region-area').value = this._areaStr;
			document.querySelector('.region-street').innerHTML = '';
			this._streets.forEach(function(item) {
				document.querySelector('.region-street').innerHTML += `
					<option value="${ item }">${ item }</option>
				`;
			});
			
			this.streetStr = typeof val === 'string' ? this._area.childs[0].name : val[1];
		}
	});
	Object.defineProperty(region, 'cityStr', {
		get: function() { return this._cityStr; },
		set: function(val) {
			this._cityStr = typeof val === 'string' ? val : val[0];
			this._city = this._province.childs.find(function(item) { return item.name === this._cityStr }.bind(this));
			this._areas = this._city.childs.map(function(item) { return item.name; });
			// dom更新
			document.querySelector('.region-city').value = this._cityStr;
			document.querySelector('.region-area').innerHTML = '';
			this._areas.forEach(function(item) {
				document.querySelector('.region-area').innerHTML += `
					<option value="${ item }">${ item }</option>
				`;
			});
			
			this.areaStr = typeof val === 'string' ? this._city.childs[0].name : val.slice(1);
		}
	})
	Object.defineProperty(region, 'provinceStr', {
		get: function() { return this._provinceStr; },
		set: function(val) {
			this._provinceStr = typeof val === 'string' ? val : val[0];
			this._province = regions.find(function(item) { return item.name === this._provinceStr }.bind(this));
			this._cities = this._province.childs.map(function(item) { return item.name; });
			// dom更新
			// set_select_checked('.region-province', this._provinceStr);
			document.querySelector('.region-province').value = this._provinceStr;
			document.querySelector('.region-city').innerHTML = '';
			this._cities.forEach(function(item) {
				document.querySelector('.region-city').innerHTML += `
					<option value="${ item }">${ item }</option>
				`;
			});
			
			this.cityStr = typeof val === 'string' ? this._province.childs[0].name : val.slice(1);
		}
	});
	// 准备
	document.querySelector('.region-province').innerHTML = '';
	region._provinces.forEach(function(item) {
		document.querySelector('.region-province').innerHTML += `
			<option value="${ item }">${ item }</option>
		`;
	});
	// 导火索
	region.provinceStr = regions[0].name;
	
	// dom事件绑定
	document.querySelector('.region-province').onchange = function() {
		region.provinceStr = this.value;
	};
	document.querySelector('.region-city').onchange = function() {
		region.cityStr = this.value;
	};
	document.querySelector('.region-area').onchange = function() {
		region.areaStr = this.value;
	};
	document.querySelector('.region-street').onchange = function() {
		region.streetStr = this.value;
	};
	region.set = function(address) {
		address = address.split(' ');
		this.provinceStr = address;
	};
	region.get = function() {
		return `${ this.provinceStr } ${ this.cityStr } ${ this.areaStr } ${ this.streetStr }`;
	};
	region.reset = function() {
		this.provinceStr = regions[0].name;
	};
	return region;
})();