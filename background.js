'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log("The color is green.")
  })
})

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url + "; " + sender.tab.id :
                "from the extension");
    console.log("Message says runtime was " + request.timeToRun)
    sendResponse({msg: "Got your message, query ran in " + request.timeToRun});
    let notification = new Notification('Query Completed', {
      icon: 'img/looker_logo_48.png',
      body: "A query completed in " + request.timeToRun + "; click to view."
    })
    notification.onclick = function(){
        chrome.tabs.update(sender.tab.id, {active: true, selected: true});
        this.close()
    }
  })
