#Sample Apps 

Sample Apps are standalone HTML5 web applications that exercise the AT&T APIs.

##Code Organization

Sample Apps code is located in the **webcontent** folder. The server side code is located under **server** and each flavor is responsible to serve statically the client code.

Under the mentioned **webcontent** folder the standalone Sample Apps are organized by feature. You will find a very simple _index.html_ which lists each sample app and its corresponding documentation link.

###Sample App feature folder
Under each feature folder (e.g. **SMS**) you will find a folder per each sample implementation (_App1_, _App2_, etc.) Each one has a similar folder structure mirroring the MVC implementation of the sample. In general the code that most directly illustrates the AT&T API calls will be in the controller folder.

