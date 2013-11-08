(function() {
	var globalSchemaIdentifier;
	var windowTitle = 'WebSpellChecker';
	var wscSizes = {
		minWidth: 514,
		minHeight: 534
	};
	var languages = {
		'da': 'da_DK',
		'de': 'de_DE',
		'el': 'el_GR',
		'en': 'en_US',
		'es': 'es_ES',
		'fi': 'fi_FI',
		'fr': 'fr_FR',
		'it': 'it_IT',
		'nb': 'nb_NO',
		'nl': 'nl_NL',
		'pt': 'pt_PT',
		'sv': 'sv_SE'
	};

	// allow to load wsc lang pack
	if(!tinymce.settings.language) {
		tinymce.settings.language = 'en';
	}
	if(!tinymce.settings.language_load) {
		tinymce.settings.language_load = true;
	}
	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('wsc');

	// Create WSC plugin
	tinymce.create('tinymce.plugins.wsc', {
		init : function(editor, url) {
			var that = this;
			// basic settings
			var settings = {};
			settings.wscCorePath = window.WSCCorePath;

			settings.lang = editor.getParam('wsc_lang', that._getCurrentTinyMCEIntLang(editor));
			settings.ctrl = editor.id;
			settings.cmd = editor.getParam('wsc_cmd', '');
			settings.intLang = editor.getParam('wsc_intLang', that._getCurrentTinyMCEIntLang(editor));

			settings.userDictionaryName = editor.getParam('wsc_userDictionaryName', '');
			settings.customDictionaryName = editor.getParam('wsc_customDictionaryName', '');
			// prevent from executing two different lf on the same page
			if(!globalSchemaIdentifier) {
				globalSchemaIdentifier = editor.getParam('wsc_schemaIdentifier', 18);
			}
			settings.schemaIdentifier = globalSchemaIdentifier;

			settings.width = editor.getParam('wsc_width', wscSizes.minWidth);
			settings.height = editor.getParam('wsc_height', wscSizes.minHeight);
			settings.top = editor.getParam('wsc_top', 0);
			settings.left = editor.getParam('wsc_left', 0);
			settings.title = editor.getParam('wsc_popup_title', windowTitle);

			settings.autoClose = editor.getParam('wsc_autoClose', '');
			settings.domainName = editor.getParam('wsc_domainName', '');
			settings.schemaURI = editor.getParam('wsc_schemaURI', '');
			settings.onCancel = editor.getParam('wsc_popup_cancel', function(){});
			settings.onFinish = editor.getParam('wsc_popup_finish', function(){});
			settings.onClose = editor.getParam('wsc_popup_close', function(){});

			settings.wscCoreURL = settings.wscCorePath + 'wsc&schema=' + settings.schemaIdentifier;

			for(var key in settings) {
				if(settings[key] === '') {
					delete settings[key];
				}
			}

			// Register commands
			editor.addCommand('mceWSC', function() {
				that._initializeWSC(editor, settings, url);
			});
			editor.addCommand('wscRunInsideModal', function(ui, value) {
				that._runInsideModalWindow(editor, settings, value);
			});
			editor.addCommand('wscResizeWSCWindow', function(ui, value) {
				that._resizeWSCWindow(editor, settings, value);
			});

			// Register spell check button
			var wscBtnIcoPath = settings.wscCorePath + 'image&img=btn_wsc_tinymce';
			editor.addButton('wsc', {
				title : 'WSC_button_desc',
				cmd: 'mceWSC',
				image: wscBtnIcoPath
			});
		},

		// Init WSC service
		_initializeWSC: function(editor, settings, url) {
			var that = this;
			// load script via tinymce api
			var scriptLoader = new tinymce.dom.ScriptLoader();
			scriptLoader.loadScripts([ settings.wscCoreURL ], function() {
				that._openWindow(editor, settings, url);
			});
		},

		// Open WSC window
		_openWindow: function(editor, settings, url) {
			var el = document.getElementById(editor.id);
			var _onFinish = settings.onFinish;
			var _onCancel = settings.onCancel;

			// if there is active modal window - close it
			if(editor.wscDialogWindow) {
				editor.wscDialogWindow.close();
			}

			// prevent callbacks rewriting
			if(!settings._callbacksChanged) {
				settings._callbacksChanged = true;

				settings.onFinish = function(mCtrl) {
					// Set changed content back to editor
					editor.setContent(mCtrl.value);
					// since tinymce doesn't save snapeshot after setting content through its method 'setContent'
					editor.save();

					if(editor.wscDialogWindow) {
						editor.wscDialogWindow.close();
					}

					if(typeof _onFinish === 'function') {
						_onFinish(mCtrl);
					}
				};

				settings.onCancel = function() {
					if(editor.wscDialogWindow) {
						editor.wscDialogWindow.close();
					}

					if(typeof _onCancel === 'function') {
						_onCancel();
					}
				};
			}

			// Set editors content to hidden control
			el.value = editor.getContent();
			// for 118 schema we need to use tinymce dialogs manager
			if(settings.schemaIdentifier == 118 && el.value !== '') {
				if(window.DragHandler) {
					window.DragHandler.attach = function() {};
					window.DragHandler.updateWindowSize = function() {};
					window.DragHandler.resetElement = function() {};
				}
				editor.wscDialogWindow = editor.windowManager.open({
					title: settings.title,
					width: settings.width,
					height: settings.height,
					resizable: true,
					maximizable: false,
					body: [],
					buttons: [],
					onpostrender: function() {
						setTimeout(function() {
							editor.execCommand('wscRunInsideModal', false, editor.wscDialogWindow);
							editor.execCommand('wscResizeWSCWindow', false, editor.wscDialogWindow);
						}, 0);
					}
				});
			} else {
				window.WSC.doSpell(settings);
			}
		},

		_runInsideModalWindow: function(editor, settings, value) {
			window.WSC.doSpell(settings);

			// find elements
			editor.plugins.wsc._wscInfo = {};
			editor.plugins.wsc._wscInfo.modalWindowWrapper = document.getElementById('webspellchecker-modal-window-wrapper');
			editor.plugins.wsc._wscInfo.modalWindowHeader = document.getElementById('webspellchecker-modal-header');
			editor.plugins.wsc._wscInfo.modalWindow = document.getElementById('webspellchecker-modal-window');
			editor.plugins.wsc._wscInfo.modalWindowIframe = editor.plugins.wsc._wscInfo.modalWindow.children[0];
			editor.plugins.wsc._wscInfo.contentArea = document.getElementById(value._id + '-body');
			
			// set wsc modal window inside of tinymce dialog
			editor.plugins.wsc._wscInfo.contentArea.appendChild(editor.plugins.wsc._wscInfo.modalWindowWrapper);
			// remove waste elements
			var wscModalBg = document.getElementById('webspellchecker-modal-bg');
			var wscResize = document.getElementById('webspellchecker-wsc_resize');
			var wscCloseBtn = document.getElementById('webspellchecker-closeButton');

			if(wscModalBg) {
				tinyMCE.DOM.remove(wscModalBg);
			}
			if(wscResize) {
				tinyMCE.DOM.remove(wscResize);
			}
			if(wscCloseBtn) {
				tinyMCE.DOM.remove(wscCloseBtn);
			}
		},

		_resizeWSCWindow: function(editor, settings, value) {
			var newWidth = (parseInt(tinymce.DOM.getStyle(editor.plugins.wsc._wscInfo.contentArea, 'width', true), 10) || 0) - 2; // minus border width
			var newHeight = (parseInt(tinymce.DOM.getStyle(editor.plugins.wsc._wscInfo.contentArea, 'height', true), 10) || 0) - 2; // minus border width
			var wscHeaderHeight = editor.plugins.wsc._wscInfo.modalWindowHeader.clientHeight + (parseInt(tinymce.DOM.getStyle(editor.plugins.wsc._wscInfo.modalWindow, 'marginTop', true), 10) || 0);

			// resize wsc window wrapper
			editor.plugins.wsc._wscInfo.modalWindowWrapper.style.width = newWidth + 'px';
			editor.plugins.wsc._wscInfo.modalWindowWrapper.style.height = newHeight + 'px';
			// resize wsc window
			editor.plugins.wsc._wscInfo.modalWindow.style.marginLeft = '0';
			editor.plugins.wsc._wscInfo.modalWindow.style.width = '100%';
			editor.plugins.wsc._wscInfo.modalWindow.style.height = (newHeight - wscHeaderHeight) + 'px';
			// resize wsc iframe
			editor.plugins.wsc._wscInfo.modalWindowIframe.style.width = '100%';
			editor.plugins.wsc._wscInfo.modalWindowIframe.style.height = '100%';
		},

		_getCurrentTinyMCEIntLang: function(editor) {
			var currIntLang = editor.settings.language;

			currIntLang = languages[currIntLang];
			if(!currIntLang) {
				currIntLang = 'en_US';
			}

			return currIntLang;
		}
	});

	// Register plugin with a short name
	tinymce.PluginManager.add('wsc', tinymce.plugins.wsc);
}());