// let changeColor = document.getElementById('changeColor')

// chrome.storage.sync.get('color', function(data) {
//     changeColor.style.backgroundColor = data.color
//     changeColor.setAttribute('value', data.color)
// })

// changeColor.onclick = function(element) {
//     let color = element.target.value;
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       chrome.tabs.executeScript(
//           tabs[0].id,
//           {code: 'document.body.style.backgroundColor = "' + color + '"'})
//     })
//   }

let tabs = chrome.tabs.query = { active: true, currentWindow: true }

let testNotify = document.getElementById('testNotify')
testNotify.onclick = function(elem) {
    var notification = new Notification('Notification Test', {
        icon: 'img/looker_logo_48.png',
        body: "If you see this, notifications are working."
    })
    notification.onclick = function(){
        // alert("sdfsdf")
        // chrome.tabs.update(tabs[0].id, {active: true});
    }
}