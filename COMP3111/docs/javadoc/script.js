/*
 * Copyright (c) 2013, 2020, Oracle and/or its affiliates. All rights reserved.
 * ORACLE PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
function loadScripts(e,t){createElem(e,t,"search.js"),createElem(e,t,"module-search-index.js"),createElem(e,t,"package-search-index.js"),createElem(e,t,"type-search-index.js"),createElem(e,t,"member-search-index.js"),createElem(e,t,"tag-search-index.js")}function createElem(e,t,a){var r=e.createElement(t),c=e.getElementsByTagName(t)[0];r.src=pathtoroot+a,c.parentNode.insertBefore(r,c)}function show(e){for(var t in count=0,data){var a=document.getElementById(t);0!==(data[t]&e)?(a.style.display="",a.className=count++%2?rowColor:altColor):a.style.display="none"}updateTabs(e)}function updateTabs(e){var t=document.getElementById(Object.keys(data)[0]).closest("table");for(var a in tabs){var r=document.getElementById(tabs[a][0]);a==e?(r.className=activeTableTab,r.innerHTML=tabs[a][1],r.setAttribute("aria-selected",!0),r.setAttribute("tabindex",0),t.setAttribute("aria-labelledby",tabs[a][0])):(r.className=tableTab,r.setAttribute("aria-selected",!1),r.setAttribute("tabindex",-1),r.setAttribute("onclick","show("+a+")"),r.innerHTML=tabs[a][1])}}function switchTab(e){37!=e.keyCode&&38!=e.keyCode||($("[aria-selected=true]").prev().click().focus(),e.preventDefault()),39!=e.keyCode&&40!=e.keyCode||($("[aria-selected=true]").next().click().focus(),e.preventDefault())}function indexFilesLoaded(){return moduleSearchIndex&&packageSearchIndex&&typeSearchIndex&&memberSearchIndex&&tagSearchIndex}var moduleSearchIndex,packageSearchIndex,typeSearchIndex,memberSearchIndex,tagSearchIndex,updateSearchResults=function(){};