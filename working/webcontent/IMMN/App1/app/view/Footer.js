/**
 * @class SampleApp.view.Footer
 * A class to show the legal message as a footer on each Sample Application.
 */
Ext.define('SampleApp.view.Footer', {
    extend: 'Ext.Container',
    xtype: 'att-footer',
    
    config : {
        cls: 'legal-message',
        html: ' \
            <div class="header"> \
                Powered by AT&amp;T Virtual Mobile\
            </div> \
            <p> \
                &copy; 2013 AT&amp;T Intellectual Property. All rights reserved. <a href="http://developer.att.com/" \
                    target="_blank">http://developer.att.com</a> \
                <br /> \
                The Application hosted on this site are working examples intended to be used for \
                reference in creating products to consume AT&amp;T Services and not meant to be \
                used as part of your product. The data in these pages is for test purposes only \
                and intended only for use as a reference in how the services perform. \
                <br />\
                For download of tools and documentation, please go to <a href="https://developer.att.com/" \
                    target="_blank">https://developer.att.com</a> \
                <br /> \
                For more information contact <a href="mailto:developer.support@att.com">developer.support@att.com</a> \
           </p>' 

    }
});