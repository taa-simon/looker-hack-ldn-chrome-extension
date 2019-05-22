// adapted from https://medium.com/@tarundugar1992/chrome-extension-intercepting-and-reading-the-body-of-http-requests-dd9ebdf2348b
function niceTimestamp() {
    let d = new Date()
    return '[' + /(..)(:..)(:..)/.exec(d)[0] + '.' + d.getMilliseconds() + ']'
}

function interceptData() {
    console.log('loading Looker query notifications extension...')
    var xhrOverrideScript = document.createElement('script')
    xhrOverrideScript.type = 'text/javascript'
    xhrOverrideScript.innerHTML = `
    (function() {
      var XHR = XMLHttpRequest.prototype
      var send = XHR.send
      var open = XHR.open
      XHR.open = function(method, url) {
          this.url = url // the request url
          return open.apply(this, arguments)
      }
      XHR.send = function() {
          this.addEventListener('load', function() {
              if (this.url.match("/api/internal/dataflux/query_results/.*")) {

                  console.log('capturing ' + this.url)
                  if(document.querySelector('#__interceptedData')){
                    console.log('removing existing hidden div element')
                    document.querySelector('#__interceptedData').remove()
                  }
                  var dataDOMElement = document.createElement('div')
                  dataDOMElement.id = '__interceptedData'
                  dataDOMElement.innerText = this.response
                //   res = JSON.parse(this.response)
                //   if(res.result_source=='query') {
                //       console.log('query results captured') 
                //   }
                  dataDOMElement.style.height = 0
                  dataDOMElement.style.overflow = 'hidden'
                  document.body.appendChild(dataDOMElement)
              }               
          })
          return send.apply(this, arguments)
      }
    })()
    `
    document.head.prepend(xhrOverrideScript)
}
function checkForDOM() {
if (document.body && document.head) {
    interceptData()
} else {
    requestIdleCallback(checkForDOM)
}
}
requestIdleCallback(checkForDOM)

function checkQueryData() {
    console.log(niceTimestamp() + ' checking for query data... ')
    var responseContainingEle = document.getElementById('__interceptedData')
    
    if (responseContainingEle) {
        console.log(niceTimestamp() + 'found query data element')
        var response = JSON.parse(responseContainingEle.innerHTML)
        responseContainingEle.remove()
        
        if(response.result_source == 'query'){
            console.log(niceTimestamp() + 'results from query found')
            
            chrome.runtime.sendMessage({timeToRun: response.runtime + 's!'}, function(response) {
                console.log(niceTimestamp() + 'Message response: ' + response.msg)
            })
        } else { 
            console.log(niceTimestamp() + 'result not from query')
            requestIdleCallback(checkQueryData)
        }
    } else {
        requestIdleCallback(checkQueryData)
    }
}
requestIdleCallback(checkQueryData) 
