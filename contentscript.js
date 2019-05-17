// content script which gets injected into pages
// needs to watch the Looker UI elements to see if a query 
// has completed, and how much time it took, # rows
let runTimeSelector = "#lk-container > lk-explore-dataflux > lk-explore-header > lk-title-hint > span.title-stats > span:nth-child(5)"
    ,spinnerSelector = "#lk-container > lk-explore-dataflux > lk-explore-header > div.lk-spinner-block.ng-scope"
    ,fromCacheSelector = "#lk-container > lk-explore-dataflux > lk-explore-header > lk-title-hint > span.title-stats > span:nth-child(3)"
    ,queryIsRunning = false


window.onload = function(){
    console.log("Page loaded, content script running...")

    function mutated(mutationsList, obsvr){
        // console.log('got mutations...')
        let spinnerElem = null
        spinnerElem = document.querySelector(spinnerSelector)
        if(spinnerElem && spinnerElem.innerHTML){
            // console.log('spinner has html')
        } else {
            // console.log('spinner null or has no html')
        }
        for(var mutation of mutationsList) {
            let runtime = null, cacheElem = null
            if(spinnerElem && spinnerElem.innerHTML && !queryIsRunning){
                queryIsRunning = true
                console.log("A query is running...")
                spinnerElem = null
            } else {
                
                runtime = document.querySelector(runTimeSelector)
                if(queryIsRunning && runtime && runtime.innerText) {
                    queryIsRunning = false
                    cacheElem = document.querySelector(fromCacheSelector)
                    if(cacheElem && cacheElem.getAttribute('aria-hidden') == 'false'){
                        console.log("Query completed; served from cache.")
                    } else {
                        if(!runtime.innerText.match(/\d/) ){ 
                            console.log('time is just "s"...')} 
                        else {
                            console.log("Query completed; time = " + runtime.innerText)
                            chrome.runtime.sendMessage({timeToRun: runtime.innerText}, function(response) {
                                console.log("Message response: " + response.msg)
                            })
                        }
                    }
                }
            }

            if (mutation.type == 'childList') {
                // console.log('A child node has been added or removed.');
                
            }
            else if (mutation.type == 'attributes') {
                // console.log('The ' + mutation.attributeName + ' attribute was modified; new value = ' + mutation.target.getAttribute(mutation.attributeName) );
            }
        }
    }

    // Create an observer instance linked to the callback function
    let targetNode = document.querySelector('lk-explore-header')
        , observer = new MutationObserver(mutated)
        , config = { attributes: true, childList: true, subtree: true };


    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

}
