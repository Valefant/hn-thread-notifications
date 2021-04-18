// ==UserScript==
// @name         hn-thread-notifications
// @namespace    hackernews
// @version      0.2
// @description  Indicates visually if comments are read or unread within any thread on hackernews.
//               A comment is considered read when the thread you are on is refreshed.
// @author       Valefant
// @match        https://news.ycombinator.com/item*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    const threadId = document.URL.split("=")[1];
    const allMessageIds = [document.querySelector(".athing"), ...document.querySelectorAll("tr .athing.comtr")];
    const allMessageIdsAsString = allMessageIds.map(el => el.id).join(" ");
    const retreivedIds = GM_getValue(threadId);
    const unread = createIndicator("green");
    const read = createIndicator("red");

    if (GM_getValue(threadId) === undefined) {
        // GM_setValue does not support lists therefore I have to encode the ids as one big string
        GM_setValue(threadId, allMessageIdsAsString);
        // Mark comments as unread
        [...document.querySelectorAll(".comhead")].forEach(commentHead => commentHead.prepend(createIndicator("green").cloneNode(true)));
    } else {
        retreivedIds
        .split(" ")
        // comments can be deleted in the meantime therefore we have to check the existence
        .filter(id => document.querySelector(`[id='${id}']`) !== null)
        .map(id => document.querySelector(`[id='${id}']`).querySelector(".comHead"))
        // Ask HN: does not have .comHead class
        .filter(head => head !== null)
        .forEach(head => head.prepend(read.cloneNode(true)));

        // Mark comments as read by comparing the ids retreived from the storage minus the ids which are determined on entering the thread
        allMessageIdsAsString
        .split(" ")
        .filter(id => !retreivedIds.split(" ").includes(id))
        .map(id => document.querySelector(`[id='${id}']`).querySelector(".comHead"))
        // Ask HN: does not have .comHead class
        .filter(head => head !== null)
        .forEach(head => head.prepend(unread.cloneNode(true)));

        GM_setValue(threadId, allMessageIdsAsString);
    }
})();

function createIndicator(color) {
    const indicator = document.createElement("span");
    indicator.innerHTML = "-";
    indicator.style.backgroundColor = color;
    indicator.style.color = color;
    return indicator;
}
