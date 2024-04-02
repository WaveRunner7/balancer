/**
 * Converts an HTTP(S) url to a WS(S) URL
 * Example:
 *     httpUrlToWebSockeUrl("http://www.example.com/") -> ws://www.example.com/
 *     httpUrlToWebSockeUrl("https://www.example.com/") -> wss://www.example.com/
 * 
 * @param {string} url
 * @return {string}
 */
function httpUrlToWebSockeUrl(url)
{
    return url.replace(/(http)(s)?\:\/\//, "ws$2://");
}

httpUrlToWebSockeUrl(http://127.0.0.1:8545);
