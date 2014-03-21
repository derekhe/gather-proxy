var $ = require("node-jquery");
var _ = require("lodash");
var Q = require("q");

var ip = [];
var matchRegex = function(url) {
    var deferred = Q.defer();

    $.get(url, function(html) {
        deferred.resolve(html.match(/\d+\.\d+.\d+.\d+:\d+/g));
    });

    return deferred.promise;
};

var getFirstPage = function(url, firstPageselector, baseUrl) {
    var deferred = Q.defer();

    $.get(url, function(html) {
        var page = $(html);
        var latestUrl = page.find(firstPageselector).attr("href");

        matchRegex(baseUrl + latestUrl).then(function(data) {
            return deferred.resolve(data);
        });
    });

    return deferred.promise;
};

var proxySites = {
    "http://www.site-digger.com/html/articles/20110516/proxieslist.html": matchRegex,
    "http://old.cool-proxy.net/index.php?action=anonymous-proxy-list&page=0": matchRegex,
    "http://old.cool-proxy.net/index.php?action=anonymous-proxy-list&page=1": matchRegex,
    "http://old.cool-proxy.net/index.php?action=anonymous-proxy-list&page=2": matchRegex,
    "http://old.cool-proxy.net/index.php?action=anonymous-proxy-list&page=3": matchRegex,
    "http://old.cool-proxy.net/index.php?action=anonymous-proxy-list&page=4": matchRegex,
    "http://old.cool-proxy.net/index.php?action=anonymous-proxy-list&page=5": matchRegex,
    "http://old.cool-proxy.net/index.php?action=anonymous-proxy-list&page=6": matchRegex,
    "http://proxy.ipcn.org/proxylist2.html": matchRegex,
    "http://proxy.ipcn.org/proxylist.html": matchRegex,
    "http://www.itmop.com/proxy/": function(url) {
        return getFirstPage(url,
            "dl:nth-child(1) > dt > a", "");
    },
    "http://www.56ads.com/proxyip/": function(url) {
        return getFirstPage(url, ".listbox li:nth-child(2)> a", "http://www.56ads.com/");
    }
};


_.forEach(_.keys(proxySites), function(url) {
    proxySites[url](url).then(function(ip) {
        console.log(url, ip.length);
        console.log(ip);
    })
});