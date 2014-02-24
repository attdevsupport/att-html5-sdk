<?php

/**
 * This class provides useful methods for debugging the PHP server and any additional code you wish to create to compliment it.
 * 
 * You may enable debugging and specify the debug output file for the SDK PHP Server by modifying the server config.php file, 
 * located in the server/php/public_html directory where you unpacked this kit. By default, debugging is turned off and the
 * default debug file is configured as ** /tmp/att-php.log **. If you wish to change the location of the debug file, ensure
 * that your webserver has write access to that directory.
 *
 * @class Debug
 */
class Debug {
	private static $fp;

	/**
	 * Initialize the debugger and returns a file pointer to the opened debug file.
	 * 
	 * @method init
	 *
	 * @return {filePointer} Returns a file pointer to the debug file for use by other methods, if required.
	 *
	 */
	public static function init() {
		self::$fp = fopen(DEBUG_LOGGER, "a");

		// Return the file pointer if needed, eg for a cURL request
		return self::$fp;
	}

	/**
	 * Writes debug information to the debug file
	 *
	 * @method write
	 *
	 * @param {string} output The string to write
	 *
	 */
	public static function write($output) {
		fwrite(self::$fp, $output);
	}

	/**
	 * Writes traceback information to the debug file
	 *
	 * @method dumpBacktrace
	 *
	 * @param {string} nl The newline character. Defaults to '\n'
	 *
	 */
	public static function dumpBacktrace($nl = "\n") {
		$str = $nl . "*******************************************";
		$str .= $nl . "Debug backtrace begin" . $nl;
		foreach (debug_backtrace() as $key => $value) {
			// Place any functions to ignore in the array below
			if (!in_array($value['function'], array("dumpBacktrace", "__call", "call_user_func_array"))) {
				// Skip if it's a direct_ function; eg. direct_deviceInfo, etc.
				if (!stristr($value['function'], "direct_")) {
					$str .= $nl . "function: {$value['function']}; file: {$value['file']}; line: {$value['line']}";
				}
			}
		}
		$str .= $nl . $nl . "Debug backtrace end";
		$str .= $nl . "*******************************************" . $nl;
		self::write($str);
	}

	/**
	 * Closes the debug file
	 *
	 * @method end
	 */
	public static function end() {
		fclose(self::$fp);
	}
}

?>