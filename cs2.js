// adapted from https://medium.com/@tarundugar1992/chrome-extension-intercepting-and-reading-the-body-of-http-requests-dd9ebdf2348b
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
                  var dataDOMElement = document.querySelector('#__interceptedData')
                  if(dataDOMElement && dataDOMElement.innerHTML != ''){
                    console.log('clearing existing hidden div element content')
                    dataDOMElement.innerHTML = ''
                  } else {
                      console.log('creating div elem')
                      var dataDOMElement = document.createElement('div')
                      dataDOMElement.id = '__interceptedData'
                      document.body.appendChild(dataDOMElement)
                  }
                  dataDOMElement.innerText = this.response
                //   res = JSON.parse(this.response)
                //   if(res.result_source=='query') {
                //       console.log('query results captured') 
                //   }
                  dataDOMElement.style.height = 0
                  dataDOMElement.style.overflow = 'hidden'
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

function checkQueryData(mutationsList, obsvr) {
    console.log('checking for query data...')
    for(mut in mutationsList){
        console.log(mut)
    }
    // var responseContainingEle = document.getElementById('__interceptedData')
    // if (responseContainingEle && responseContainingEle.innerHTML) {
    //     console.log('found query data')
    //     var response = JSON.parse(responseContainingEle.innerHTML)
    //     responseContainingEle.innerHTML = ''
    //     if(response.result_source == 'query'){
    //         console.log('results from query found')
            
    //         chrome.runtime.sendMessage({timeToRun: response.runtime + 's!'}, function(response) {
    //             console.log("Message response: " + response.msg)
    //         })
    //     } else { console.log('result not from query') }
    // } 
    
}
// requestIdleCallback(checkQueryData) 

var dataElement = document.querySelector('#__interceptedData')
if(dataElement){
    console.log('data element found...')
    if(dataElement.innerHTML){
        console.log('clearing existing hidden div element content...')
        dataElement.innerHTML = ''
    }
} else {
    console.log('creating hidden div element...')
    var dataElement = document.createElement('div')
    dataElement.id = '__interceptedData'
}

var observer = new MutationObserver(checkQueryData)
observer.observe(dataElement, { characterData: true, subtree: true })