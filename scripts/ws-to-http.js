/**
 * Converts a WS(S) url to an HTTP(S) URL
 * Example:
 *     webSocketUrlToHttpUrl("ws://www.example.com/") -> http://www.example.com/
 *     webSocketUrlToHttpUrl("wss://www.example.com/") -> https://www.example.com/
 * 
 * @param {string} url
 * @return {string}
 */
function webSocketUrlToHttpUrl(url)
{
    return url.replace(/(ws)(s)?\:\/\//, "http$2://");
}

