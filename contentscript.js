let runTimeSelector = "#lk-container > lk-explore-dataflux > lk-explore-header > lk-title-hint > span.title-stats > span:nth-child(5)"
    ,spinnerSelector = "#lk-container > lk-explore-dataflux > lk-explore-header > div.lk-spinner-block.ng-scope"
    ,fromCacheSelector = "#lk-container > lk-explore-dataflux > lk-explore-header > lk-title-hint > span.title-stats > span:nth-child(3)"
    ,running = false

window.onload = function(){
    console.log("Page loaded, content script running...")

    function mutated(mutationsList, obsvr){
        setTimeout(function() {
        console.log('mutated :: ' + new Date)
                
        let spinnerElem = document.querySelector(spinnerSelector)
        
        if(spinnerElem && spinnerElem.innerHTML && !running){            
            console.log("A query is running...")
            running = true
        } else {
            let cacheElem = document.querySelector(fromCacheSelector)
                ,runtime = document.querySelector(runTimeSelector)

            if( cacheElem && cacheElem.getAttribute('aria-hidden') == 'true'
                && runtime && runtime.innerText && runtime.innerText.match(/\d/) ){ 
                    running = false
                    console.log('query completed')
                    chrome.runtime.sendMessage({timeToRun: runtime.innerText}, function(response) {
                        console.log("Message response: " + response.msg)
                    })
                }
        }

        }, 250)
    }

    let targetNode = document.querySelector('lk-explore-header')
        , observer = new MutationObserver(mutated)
        , config = { attributes: true, childList: true, subtree: true };

    observer.observe(targetNode, config);
}
