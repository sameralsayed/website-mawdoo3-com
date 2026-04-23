const jsSrc = document.currentScript.src;
const siteId = jsSrc.split("siteId=").pop();
const getInnonativeAds = function(){
    if(document.getElementById('inno-ads') || document.getElementById('inno-mob-ads')){

        if (window.innerWidth <= 768) {
            if(document.getElementById('inno-ads') && document.querySelector('#inno-mob-ads')) {
                document.getElementById('inno-ads').removeAttribute('id');
                document.querySelector('#inno-mob-ads').setAttribute('id', 'inno-ads');
            }
        }
        
        var link  = document.createElement('link');
        var baseUrl = 'https://inno.alweb.com';
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = `${baseUrl}/css/ads.css`;
        document.getElementsByTagName( "head" )[0].appendChild(link);
    
        
        var deviceType = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) ? 'mobile' : 'desktop';
        let url = `${baseUrl}/api/ads?siteId=${siteId}&placement=Category&countryCode=${signal.User.Country}&categoryId=${signal.Content.ContentCategoryLevel2Id && signal.Content.ContentCategoryLevel2Id != "0" ? signal.Content.ContentCategoryLevel2Id : signal.Content.ContentCategoryLevel1Id}&userId=${signal.User.UserId}&adsNumber=${deviceType == 'mobile' ? 2 : 3}`;
        let scrolled = true;
        let adsScrolled = []
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                    let data = xmlhttp.response.documentElement.querySelectorAll(".inno-ads-container");
                    if(data[0].classList.contains('no-ads')){
                        document.getElementById('inno-ads').remove()
                        return
                    }else{
                        document.getElementById('inno-ads').appendChild(data[0]);
                        clickEvent();
                        data[0].querySelectorAll(".ads-link").forEach( (link, index) => {
                            adsScrolled.push(false)
                        })
                        document.onscroll =  function () {
                            impressionsEvent();
                        };
                    }
                }
                else if (xmlhttp.status == 400) {
                    console.log("Error 400");
                }
                else {
                    console.log('something else other than 200 was returned');
                }
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.setRequestHeader('Cache-Control', 'no-cache');
        xmlhttp.setRequestHeader('accepts', 'text/html');
        xmlhttp.responseType = "document";
        xmlhttp.send();
    
        function clickEvent(){
            document.querySelectorAll(".ads-link").forEach( (link, index) => {
                link.addEventListener("click", function(){
                    // Google Analytics
                    gtag('event', `INNONATIVE_ads_click${index+1}`, {'event_category':'INNONATIVE_ads'});
                })
            })
        }
    
        function impressionsEvent(){
            document.querySelectorAll(".ads-link").forEach( (link, index) => {
                if(elementInViewport(link) && !adsScrolled[index]){
                    adsScrolled[index] = true;
                    gtag('event', `INNONATIVE _ads_imp${index+1}`, {'event_category':'INNONATIVE_ads'});
                    let sessionId = link.getAttribute('data-imp');
                    var xmHttp = new XMLHttpRequest();
                    xmHttp.open( "GET", sessionId , true );
                    xmHttp.send();
                            
                }
            })
        }
    
        function elementInViewport(el) {
            var position = el.getBoundingClientRect();
            var inViewport = false
            // checking whether fully visible
            if(position.top >= 0 && position.bottom <= window.innerHeight && inViewport == false) {
                inViewport = true;
                scrolled = false;
            }
            return inViewport;
        }
    }
}

setTimeout(() => {
    getInnonativeAds()
}, 2000);