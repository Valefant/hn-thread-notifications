// ==UserScript==
// @name         hn-thread-notifications
// @namespace    hackernews
// @version      0.1
// @description  Indicates visually if messgages are read or unread within any thread on hackernews.
//               A message is considered read when the thread you are on is refreshed.
// @author       Valefant
// @match        https://news.ycombinator.com/item*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    const threadId = document.URL.split("=")[1];
    const allIds = [document.querySelector(".athing"), ...document.querySelectorAll("tr .athing.comtr")];
    const allIdsString = allIds.map(el => el.id).join(" ");
    const retreivedIds = GM_getValue(threadId);
    const unread = createIndicator("green");
    const read = createIndicator("red");

    if (GM_getValue(threadId) === undefined) {
        GM_setValue(threadId, allIdsString);
        [...document.querySelectorAll(".comhead")].forEach(commentHead => commentHead.prepend(createIndicator("green").cloneNode(true)))
    } else {
        retreivedIds
        .split(" ")
        .map(id => document.querySelector(`[id='${id}']`).querySelector(".comHead"))
        .forEach(head => head.prepend(read.cloneNode(true)));

        const newIds = allIdsString.split(" ").filter(id => !retreivedIds.split(" ").includes(id));
        console.log(newIds)
        newIds
        .map(id => document.querySelector(`[id='${id}']`).querySelector(".comHead"))
        .forEach(head => head.prepend(unread.cloneNode(true)));

        GM_setValue(threadId, allIdsString);
    }
})();

function createIndicator(color) {
    const indicator = document.createElement("span");
    indicator.innerHTML = "-";
    indicator.style.backgroundColor = color;
    indicator.style.color = color;
    return indicator;
}
