var TO = setTimeout(
   function () {
   	if (typeof jQuery == "undefined" || typeof Ext == "undefined") {
   		document.write('<div style="margin:20px; font-family: \'Segoe UI\', Arial, Geneva, Swiss, Sans-serif"><h1>Dependencies not loaded</h1>' +
			'<p>This ATT&T SDK library requires Sencha Touch <a href="http://www.sencha.com/products/touch/download/" target="_blank">http://www.sencha.com/products/touch/download/</a> (tested with version 2.3.1)</p>' +
			'<p>You will need to agree to the Sencha software license, then download the code and copy the following files into the <b>/lib</b> folder:<p><ul>' +
			'<li>sencha-touch-all.js</li><li>sencha-touch.css</li></ul></div>');
   	}
   	clearTimeout(TO);
   }, 4000
);