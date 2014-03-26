function submitSpeechToTextRequest()
{
    var context1 = jQuery("#speech-context option").filter(":selected").val();
    var fileinfo = jQuery("#audio-file option").filter(":selected").val().split(" ");
    //var filename = fileinfo[0];
    //var mimeType = fileinfo[1];
    var isChunked = jQuery("#is-chunked option").filter(":selected").val() == "true";
    //var xArg = {ClientSdk: JSON.parse(jQuery("#x-arg").val())};
	var xArg = {ClientSdk: 'jquery-mobile-test-sdk'};

    jQuery.mobile.loading("show", { text: "Please wait while the server processes your audio", textVisible: true, theme: "b", html: "" });
	
	var data = {
		filename: fileinfo[0],
		chunked: isChunked,
		context: context1,
		xargs: xArg
	};

	AttApiClient["serverSpeechToText"](
		data,
		function (response) {
            jQuery.mobile.loading("hide");
            $('#success-popup').html("<h3>"+ JSON.stringify(response) + "</h3>");
            jQuery("#success-popup").popup("open");
		},
		function (response) {
            jQuery.mobile.loading("hide");
            $('#failure-popup').html("<h3>"+ JSON.stringify(response) + "</h3>");
            jQuery("#failure-popup").popup("open");
		}
	);
}