/*******************************************************************************
 * Copyright (c) 2009, 2018 Mountainminds GmbH & Co. KG and Contributors
 * This program and the accompanying materials are made available under
 * the terms of the Eclipse Public License 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *    Marc R. Hoffmann - initial API and implementation
 *
 *******************************************************************************/
!function(){function e(e){window.linkelementids=e;var n=window.location.hash;if(n){var a,t;if(a=n.match(/up-./))return void((t=window.document.getElementById(a[0].charAt(3)))&&i(t,!0));if(a=n.match(/dn-./))return void((t=window.document.getElementById(a[0].charAt(3)))&&i(t,!1))}}function n(e){var n=0==e.className.indexOf("down ");i(e,n)}function i(e,n){var i=e.parentNode.parentNode.parentNode,t=i.tBodies[0],o=s(e);d(i);for(var l,c=t.rows,f=[],m=0;m<c.length;m++)r=c[m],f[parseInt(r.childNodes[o].id.slice(1))]=r;if(n){for(m=f.length-1;m>=0;m--)t.appendChild(f[m]);e.className="up "+e.className,l="up-"+e.id}else{for(m=0;m<f.length;m++)t.appendChild(f[m]);e.className="down "+e.className,l="dn-"+e.id}a(l)}function a(e){window.document.location.hash=e,ids=window.linkelementids;for(var n=0;n<ids.length;n++)t(document.getElementById(ids[n]),e)}function t(e,n){links=e.getElementsByTagName("a");for(var i=0;i<links.length;i++){var a=links[i],t=a.href,s=t.indexOf("#");-1!=s&&(t=t.substring(0,s)),a.href=t+"#"+n}}function s(e){for(var n=-1;e;)e=e.previousSibling,n++;return n}function d(e){for(var n=e.tHead.firstChild.firstChild;n;n=n.nextSibling)n.className&&(0==n.className.indexOf("down ")&&(n.className=n.className.slice(5)),0==n.className.indexOf("up ")&&(n.className=n.className.slice(3)))}window.initialSort=e,window.toggleSort=n}();