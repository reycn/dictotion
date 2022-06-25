var app = new Vue({
	el: '.app',
	data: {
		message: '',
		screenshot: false,
		locale: 'zh',
		locales: {
			zh: {
				language: 'Switch to English',
				search: '搜索',
				search_word: '请输入单词...',
				fav: '收藏',
				setting: '设置',
				oald: '牛津',
				mw: '韦氏',
				update: '更新中……',
				tip: '回车搜索',
				copyright: 'Reynard © 2022',
				description: '查单词然后存下来',
				copyimage: '复制为图片',
				save: '保存',
				copied_success:'已复制至剪贴板',
				not:'开发中，暂不支持',
			},
			en: {
				language: '以中文浏览',
				search: 'Search',
				search_word: 'Type a word...',
				fav: 'Favorite',
				setting: 'Setting',
				oald: 'OALD',
				mw: 'M.W.',
				update: 'Updating...',
				tip: 'Enter to search',
				copyright: 'Reynard © 2022',
				description: 'Find a word, add to Notion.',
				copyimage: 'Copy as image',
				save: 'Save',
				copied_success:'Copied to clipboard successfully',
				not:'Not yet supported',
			}
		},
		word: 'default',
		word_html: '······',
		dict: 'oald',
	},
	created() {
		this.query('default');
	},
	methods: {
		toggleLanguage: function() {
			if (app.locale == 'zh') {
				app.locale = 'en';
			} else {
				app.locale = 'zh';
			}
			// console.log('Dictionary changed to: ' + app.locale);
		},
		copy: function() {
			let src = document.getElementsByClassName("wrapper")[0];
			html2canvas(src).then(function(canvas) {
			document.getElementsByClassName("hidden-wrapper")[0].appendChild(canvas);
			canvas.toBlob(function(blob) {
				navigator.clipboard
				.write([
					new ClipboardItem(
					Object.defineProperty({}, blob.type, {
						value: blob,
						enumerable: true
					})
					)
				])
				.then(function() {
					app.message = 'copied'
					setTimeout(() => app.message = '', 1500);
					// console.log("done")
				});
			});
			});

		},
		close: function() {
			app.screenshot = false;
		},
		send: function() {
			app.message = 'not'
			setTimeout(() => app.message = '', 1500);
		},
		query: function(word, dict) {
			word = word.toLowerCase();
			axios
				.get('http://127.0.0.1:8000/q?d=' + word + '&dict=' + dict)
				.then(
					// 使用箭头函数this才会指代当前的Vue对象，如果使用的是function()，this指代的是window对象
					(res) => {
						// res 返回的参数包括很多内容，调用data才能获取到要展示的数据
						// console.log(res.data);
						app.word_html = res.data.replace(/[\s\S]*\<\/head\>/, '');
						// console.log(app.word_html);
						if (app.word_html.indexOf('@@@') != -1) {
							app.word_html = 'Looking for: ' + app.word_html.slice(app.word_html.indexOf('=') + 1) + '?';
							return app.word_html;
						} else {
							return app.word_html;
						}
					}
				)
				.catch((error) => {
					alert(error);
				});
		},
		changeDict: function(name) {
			document.getElementsByClassName('dict-' + app.dict)[0].classList.remove('highlight');
			app.dict = name;
			document.getElementsByClassName('dict-' + app.dict)[0].classList.add('highlight');
			// console.log('Dictionary changed to: ' + app.dict);

			app.query(app.word, app.dict);
			// console.log(app.word, app.dict);
		},
	}
});
