var ms_time = 1000;

window._taboola = window._taboola || [];
window.dataLayer = window.dataLayer || [];
window.googletag = window.googletag || { cmd: [] };

_taboola.push({flush: true });

function init_ga()
{
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'UA-2508801-1');
    local_logger("GA Loaded");
}

function init_taboola()
{
    setTimeout(function(){ 
        ! function(e, f, u, i) {
            if (!document.getElementById(i)) {
                e.async = 1;
                e.src = u;
                e.id = i;
                f.parentNode.insertBefore(e, f);
            }
        }(document.createElement('script'),
            document.getElementsByTagName('script')[0],
            '//cdn.taboola.com/libtrc/info7mx/loader.js',
            'tb_loader_script');
        if (window.performance && typeof window.performance.mark == 'function') {
            window.performance.mark('tbl_ic');
        }
	if(document.getElementById('taboola-below-article-thumbnails') === null) { local_logger(" Error ID('taboola-below-article-thumbnails') Not Found! "); return; }
        _taboola.push({
            mode: 'thumbnails-b',
            container: 'taboola-below-article-thumbnails',
            placement: 'Below Article Thumbnails',
            target_type: 'mix'
        });
        local_logger("Taboola Loaded");
    }, ms_time);
}

function define_admanager_ad(name = '', sizes = [], id = '')
{
    setTimeout(function(){ 
        if(document.getElementById(id) === null) { local_logger("define_admanager_ad | Error ID("+id+") Not Found! "); return; }
        googletag.cmd.push(function() {
            googletag.defineSlot(name, sizes, id).addService(googletag.pubads());
            googletag.pubads().enableSingleRequest();
            googletag.enableServices();
        });
	googletag.cmd.push(function() {
            googletag.display(id);
        });
        local_logger("define_admanager_ad ");
    }, ms_time);
}

function loadCSS(filename, filetype)
{
        if (filetype=="css")
        {
                var fileref=document.createElement("link")
                fileref.setAttribute("rel", "stylesheet")
                fileref.setAttribute("type", "text/css")
                fileref.setAttribute("href", filename)
                }
        if (typeof fileref!="undefined")
        {
                document.getElementsByTagName("head")[0].appendChild(fileref)
        }
}

function loadScript(src, callback)
{
    local_logger("Loading: " + src);
    var s,r,t;
    r = false;
    s = document.createElement('script');
    s.type = 'text/javascript';
    s.charset="utf-8"
    s.src = src;
    s.onload = s.onreadystatechange = function() 
    {
        if ( !r && (!this.readyState || this.readyState == 'complete') )
        {
            r = true;
            if (callback && typeof(callback) === "function")
            {
                callback();
            }
        }
    };
    t = document.getElementsByTagName("head")[0];
    t.appendChild(s);
}

function loadScripts()
{
    var js = externals.shift();
    if (typeof js!="undefined")
    {
        loadScript(js,loadScripts);
    }
    else
    {
        init_ga();
	load_player();
	setTimeout(function(){
            while (functions_after_dom.length)
            {
                functions_after_dom.shift().call();
                ms_time+=500;
            }
	},1000);
    }
}

function load_tv()
{
	setTimeout(function(){
		local_logger("Load TV");
		if( 
			!navigator.userAgent.match(/Android/i)
			|| !navigator.userAgent.match(/webOS/i)
			|| !navigator.userAgent.match(/iPhone/i)
			|| !navigator.userAgent.match(/iPad/i)
			|| !navigator.userAgent.match(/iPod/i)
			|| !navigator.userAgent.match(/BlackBerry/i)
			|| !navigator.userAgent.match(/Windows Phone/i)
		){
			loadScript("https://web.info7.mx/tv/embed/player.min.js", null);
		}
        },ms_time);
	ms_time+=500;
}

function load_twitter()
{
    setTimeout(function(){
		local_logger("Load Twitter");
			loadScript("https://platform.twitter.com/widgets.js", null);
        },ms_time);
	ms_time+=500;  
}

function load_player()
{
    if(typeof video_src !== undefined && document.getElementById('video-js-cont') !== null)
    {
        loadCSS("https://www.kystream.com/cdn/video-js.min.css","css");
	loadCSS("https://googleads.github.io/videojs-ima/node_modules/videojs-contrib-ads/dist/videojs.ads.css","css");
	loadCSS("https://googleads.github.io/videojs-ima/dist/videojs.ima.css","css");
	var timestamp = new Date().getTime();
	var vast = "//www9.smartadserver.com/ac?siteid=286957&pgid=1049463&fmtid=75668&ab=1&tgt=&oc=1&out=vast4&ps=1&pb=0&visit=S&vcn=s&tmstp="+timestamp;
	vast = "https://pubads.g.doubleclick.net/gampad/ads?iu=/21825621687/Info7_Videos&description_url=www.info7.mx&tfcd=0&npa=0&sz=640x480&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator="
        var _src = [
            {type: "video/mp4",src: video_src}
        ]
        player = videojs('video-js-cont', {
                techOrder: ['html5'],
                controlBar: {
                        volumeMenuButton:
                        {
                                inline: false
                        },
                        DurationDisplay: true
                },
                autoplay: true,
                muted: false,
                sources:_src
        },
        function() {});
	var options = { adTagUrl: vast };
	player.ima(options);
	if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/Android/i)) {
		player.ima.initializeAdDisplayContainer();
	}
    }
}

function local_logger(msg='')
{
    var enabled = true;
    if(enabled)
    {
        console.log(new Date().toLocaleString() + " " + msg);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    local_logger('DOMContentLoaded');
    loadScript("https://www.lodelared.com/js/lazysizes.min.js", null);
    setTimeout(function(){
        loadScripts();
    },2500);
});
