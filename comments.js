/**
 * @member TinyMCE4_WSC_plug-in
 * @public
 * 
 * @property {String} window.WSCCorePath - The `Global` parameter sets the customer ID for WSC. It is required for migration from free
 * to trial or paid versions.
 * 
 * @property {Number} wsc_schemaIdentifier - Schema identifier. Possible values: 18(separate popup window) or 118(modal window)
 *
 * @property {String} wsc_popup_title - Title what will show in pop-up window
 *
 * @property {String} wsc_lang - The parameter sets the default spellchecking language for WSC.
 * Possible values are:
 * `'en_US'`, `'en_GB'`, `'pt_BR'`, `'da_DK'`,
 * `'nl_NL'`, `'en_CA'`, `'fi_FI'`, `'fr_FR'`,
 * `'fr_CA'`, `'de_DE'`, `'el_GR'`, `'it_IT'`,
 * `'nb_NO'`, `'pt_PT'`, `'es_ES'`, `'sv_SE'`.
 * Further details available at [http://wiki.webspellchecker.net/doku.php?id=installationandconfiguration:supportedlanguages](http://wiki.webspellchecker.net/doku.php?id=installationandconfiguration:supportedlanguages)
 *
 * @property {String} wsc_cmd - The parameter sets the active tab, when the WSC dialog is opened.
 * Possible values are:
 * `'spell'`, `'thes'`, `'grammar'`.
 *
 * @property {String} wsc_userDictionaryName - It activates a user dictionary for WSC. The user dictionary name should be used.
 *
 * @property {Array} wsc_customDictionaryName - Specify one or more custom dictionaries
 * * Further details at [http://wiki.webspellchecker.net/doku.php?id=installationandconfiguration:customdictionaries:licensed](http://wiki.webspellchecker.net/doku.php?id=installationandconfiguration:customdictionaries:licensed)
 *
 * @property {Number} wsc_width - Popup width
 *
 * @property {Number} wsc_height - Popup height
 *
 * @property {Number} wsc_top - Set default top position of the popup window. Please note, that this would work only for 18 schema identifier
 *
 * @property {String} wsc_left - Set default left position of the popup window. Please note, that this would work only for 18 schema identifier
 *
 * @property {String} wsc_autoClose - WSC window auto closing indicator. 
 *  Now supported: no – no auto closing, 
 *  yes – the window is closed after all misspellings are changed to suggestions, 
 *  nomisspelings – the window is closed when no misspellings in the text.
 *
 * @property {String} wsc_domainName - Common domain name (relaxed script solution).
 *
 * @property {String} wsc_schemaURI - Custom CSS url
 *
 * @property {Function} wsc_popup_cancel -  Cancel callback
 *
 * @property {Function} wsc_popup_finish -  Finish callback
 * 
 * @property {Function} wsc_popup_close - Close callback
 * 
 * @example
 * tinyMCE.init({
 *   // Schema identifier. Possible values: 18(separate popup window) or 118(modal window)
 *   wsc_schemaIdentifier: 118,
 * @example
 *  // Title what will show in pop-up window
 *   wsc_popup_title: 'WebSpellChecker',
 * @example
 *   // One of allowed spell check language names
 *   wsc_lang: "en_GB",
 * @example
 *   // Specify tab that would be active after WSC window pops up: 'spell', 'grammar' or 'thes'
 *   wsc_cmd: 'grammar',
 * @example
 *   // Makes it possible to activate a user dictionary in SCAYT
 *   wsc_userDictionaryName: 'MyDictionary',
 * @example
 *   // Specify one or more custom dictionaries
 *   wsc_customDictionaryName: ['1','10'],
 * @example
 *   // Popup width
 *   wsc_width: 514,
 * @example
 *   // Popup height
 *   wsc_height: 534,
 * @example
 *   // Set default top position of the popup window. Please note, that this would work only for 18 schema identifier
 *   wsc_top: 100,
 * @example
 *   // Set default left position of the popup window. Please note, that this would work only for 18 schema identifier
 *   wsc_left: 150,
 * @example
 *   // WSC window auto closing indicator. 
 *   // Now supported: no – no auto closing, 
 *   // yes – the window is closed after all misspellings are changed to suggestions, 
 *   // nomisspelings – the window is closed when no misspellings in the text.
 *   wsc_autoClose: 'yes',
 * @example
 *   // Common domain name (relaxed script solution)
 *   wsc_domainName: "myDomain",
 * @example
 *   // Custom CSS url
 *   wsc_schemaURI: "myPath/myStyle.css",
 * @example
 *   // Cancel callback
 *   wsc_popup_cancel: function() {
 *       console.log('cancel');
 *   },
 * @example
 *   // Finish callback
 *   wsc_popup_finish: function(mCtrl) {
 *       console.log(mCtrl);
 *   },
 * @example
 *   // Close callback
 *   wsc_popup_close: function() {
 *       console.log('close');
 *   }
 * });
 */