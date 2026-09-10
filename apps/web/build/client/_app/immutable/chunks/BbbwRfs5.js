import{$ as e,A as t,B as n,C as r,E as i,F as a,H as o,I as s,J as c,K as l,L as u,M as d,N as f,O as p,Q as m,R as h,S as g,T as _,U as v,W as y,X as b,Y as x,Z as S,_ as C,a as w,b as T,c as E,d as D,et as O,f as ee,g as k,h as te,i as ne,j as A,k as re,l as ie,m as j,n as ae,o as oe,p as M,q as N,r as se,s as P,t as ce,tt as le,u as ue,v as F,w as de,x as I,y as L,z as R}from"./BRZeP0VO.js";var fe=e=>e!=null,pe=e=>e.filter(fe);function me(e){return(...t)=>{for(let n of e)n&&n(...t)}}var z=e=>typeof e==`function`&&!e.length?e():e,he=e=>Array.isArray(e)?e:e?[e]:[];function ge(e,...t){return typeof e==`function`?e(...t):e}var _e=R;function ve(e,t,n,r){let i=e.length,a=t.length,o=0;if(!a){for(;o<i;o++)n(e[o]);return}if(!i){for(;o<a;o++)r(t[o]);return}for(;o<a&&t[o]===e[o];o++);let s,c;t=t.slice(o),e=e.slice(o);for(s of t)e.includes(s)||r(s);for(c of e)t.includes(c)||n(c)}function ye(e){let[t,r]=I(),i=e?.throw?(e,t)=>{throw r(e instanceof Error?e:Error(t)),e}:(e,t)=>{r(e instanceof Error?e:Error(t))},a=e?.api?Array.isArray(e.api)?e.api:[e.api]:[globalThis.localStorage].filter(Boolean),o=e?.prefix?`${e.prefix}.`:``,s=new Map,c=new Proxy({},{get(t,n){let r=s.get(n);r||(r=I(void 0,{equals:!1}),s.set(n,r)),r[0]();let c=a.reduce((e,t)=>{if(e!==null||!t)return e;try{return t.getItem(`${o}${n}`)}catch(e){return i(e,`Error reading ${o}${n} from ${t.name}`),null}},null);return c!==null&&e?.deserializer?e.deserializer(c,n,e.options):c}});return e?.sync!==!1&&n(()=>{let e=e=>{let t=!1;a.forEach(n=>{try{n!==e.storageArea&&e.key&&e.newValue!==n.getItem(e.key)&&(e.newValue?n.setItem(e.key,e.newValue):n.removeItem(e.key),t=!0)}catch(t){i(t,`Error synching api ${n.name} from storage event (${e.key}=${e.newValue})`)}}),t&&e.key&&s.get(e.key)?.[1]()};`addEventListener`in globalThis?(globalThis.addEventListener(`storage`,e),R(()=>globalThis.removeEventListener(`storage`,e))):(a.forEach(t=>t.addEventListener?.(`storage`,e)),R(()=>a.forEach(t=>t.removeEventListener?.(`storage`,e))))}),[c,(t,n,r)=>{let c=e?.serializer?e.serializer(n,t,r??e.options):n,l=`${o}${t}`;a.forEach(e=>{try{e.getItem(l)!==c&&e.setItem(l,c)}catch(n){i(n,`Error setting ${o}${t} to ${c} in ${e.name}`)}});let u=s.get(t);u&&u[1]()},{clear:()=>a.forEach(e=>{try{e.clear()}catch(t){i(t,`Error clearing ${e.name}`)}}),error:t,remove:e=>a.forEach(t=>{try{t.removeItem(`${o}${e}`)}catch(n){i(n,`Error removing ${o}${e} from ${t.name}`)}}),toJSON:()=>{let t={},n=(n,r)=>{if(!t.hasOwnProperty(n)){let i=r&&e?.deserializer?e.deserializer(r,n,e.options):r;i&&(t[n]=i)}};return a.forEach(e=>{if(typeof e.getAll==`function`){let t;try{t=e.getAll()}catch(t){i(t,`Error getting all values from in ${e.name}`)}for(let e of t)n(e,t[e])}else{let r=0,a;try{for(;a=e.key(r++);)t.hasOwnProperty(a)||n(a,e.getItem(a))}catch(t){i(t,`Error getting all values from ${e.name}`)}}}),t}}]}var be=ye,xe=e=>(typeof e.clear==`function`||(e.clear=()=>{let t;for(;t=e.key(0);)e.removeItem(t)}),e),Se=e=>{if(!e)return``;let t=``;for(let n in e){if(!e.hasOwnProperty(n))continue;let r=e[n];t+=r instanceof Date?`; ${n}=${r.toUTCString()}`:typeof r==`boolean`?`; ${n}`:`; ${n}=${r}`}return t},Ce=xe({_cookies:[globalThis.document,`cookie`],getItem:e=>Ce._cookies[0][Ce._cookies[1]].match(`(^|;)\\s*`+e+`\\s*=\\s*([^;]+)`)?.pop()??null,setItem:(e,t,n)=>{let r=Ce.getItem(e);Ce._cookies[0][Ce._cookies[1]]=`${e}=${t}${Se(n)}`;let i=Object.assign(new Event(`storage`),{key:e,oldValue:r,newValue:t,url:globalThis.document.URL,storageArea:Ce});window.dispatchEvent(i)},removeItem:e=>{Ce._cookies[0][Ce._cookies[1]]=`${e}=deleted${Se({expires:new Date(0)})}`},key:e=>{let t=null,n=0;return Ce._cookies[0][Ce._cookies[1]].replace(/(?:^|;)\s*(.+?)\s*=\s*[^;]+/g,(r,i)=>(!t&&i&&n++===e&&(t=i),``)),t},get length(){let e=0;return Ce._cookies[0][Ce._cookies[1]].replace(/(?:^|;)\s*.+?\s*=\s*[^;]+/g,t=>(e+=+!!t,``)),e}}),we=1024,Te=796,Ee=700,De=`bottom-right`,Oe=`bottom`,ke=!1,Ae=500,je=500,Me=500,Ne=Object.keys(l)[0],Pe=1,Fe=Object.keys(u)[0],Ie=k({client:void 0,onlineManager:void 0,queryFlavor:``,version:``,shadowDOMTarget:void 0});function B(){return O(Ie)}var Le=class extends Error{},Re=k(void 0),ze=e=>{let[t,n]=I(null),i=()=>{let r=t();r!=null&&(r.close(),e.setLocalStore(`pip_open`,`false`),n(null))},a=(i,a)=>{if(t()!=null)return;let o=window.open(``,`TSQD-Devtools-Panel`,`width=${i},height=${a},popup`);if(!o)throw new Le(`Failed to open popup. Please allow popups for this site to view the devtools in picture-in-picture mode.`);o.document.head.innerHTML=``,o.document.body.innerHTML=``,ee(o.document),o.document.title=`TanStack Query Devtools`,o.document.body.style.margin=`0`,o.addEventListener(`pagehide`,()=>{e.setLocalStore(`pip_open`,`false`),n(null)}),[...(B().shadowDOMTarget||document).styleSheets].forEach(e=>{try{let t=[...e.cssRules].map(e=>e.cssText).join(``),n=document.createElement(`style`),r=e.ownerNode,i=``;r&&`id`in r&&(i=r.id),i&&n.setAttribute(`id`,i),n.textContent=t,o.document.head.appendChild(n)}catch{let t=document.createElement(`link`);if(e.href==null)return;t.rel=`stylesheet`,t.type=e.type,t.media=e.media.toString(),t.href=e.href,o.document.head.appendChild(t)}}),r([`focusin`,`focusout`,`pointermove`,`keydown`,`pointerdown`,`pointerup`,`click`,`mousedown`,`input`],o.document),e.setLocalStore(`pip_open`,`true`),n(o)};C(()=>{if((e.localStore.pip_open??`false`)===`true`&&!e.disabled)try{a(Number(window.innerWidth),Number(e.localStore.height||je))}catch(t){if(t instanceof Le){e.setLocalStore(`pip_open`,`false`),e.setLocalStore(`open`,`false`);return}throw t}}),C(()=>{let e=(B().shadowDOMTarget||document).querySelector(`#_goober`),n=t();if(e&&n){let t=new MutationObserver(()=>{let t=(B().shadowDOMTarget||n.document).querySelector(`#_goober`);t&&(t.textContent=e.textContent)});t.observe(e,{childList:!0,subtree:!0,characterDataOldValue:!0}),R(()=>{t.disconnect()})}});let o=F(()=>({pipWindow:t(),requestPipWindow:a,closePipWindow:i,disabled:e.disabled??!1}));return j(Re.Provider,{value:o,get children(){return e.children}})},Be=()=>F(()=>{let e=O(Re);if(!e)throw Error(`usePiPWindow must be used within a PiPProvider`);return e()}),Ve=k(()=>`dark`);function V(){return O(Ve)}var He={À:`A`,Á:`A`,Â:`A`,Ã:`A`,Ä:`A`,Å:`A`,Ấ:`A`,Ắ:`A`,Ẳ:`A`,Ẵ:`A`,Ặ:`A`,Æ:`AE`,Ầ:`A`,Ằ:`A`,Ȃ:`A`,Ç:`C`,Ḉ:`C`,È:`E`,É:`E`,Ê:`E`,Ë:`E`,Ế:`E`,Ḗ:`E`,Ề:`E`,Ḕ:`E`,Ḝ:`E`,Ȇ:`E`,Ì:`I`,Í:`I`,Î:`I`,Ï:`I`,Ḯ:`I`,Ȋ:`I`,Ð:`D`,Ñ:`N`,Ò:`O`,Ó:`O`,Ô:`O`,Õ:`O`,Ö:`O`,Ø:`O`,Ố:`O`,Ṍ:`O`,Ṓ:`O`,Ȏ:`O`,Ù:`U`,Ú:`U`,Û:`U`,Ü:`U`,Ý:`Y`,à:`a`,á:`a`,â:`a`,ã:`a`,ä:`a`,å:`a`,ấ:`a`,ắ:`a`,ẳ:`a`,ẵ:`a`,ặ:`a`,æ:`ae`,ầ:`a`,ằ:`a`,ȃ:`a`,ç:`c`,ḉ:`c`,è:`e`,é:`e`,ê:`e`,ë:`e`,ế:`e`,ḗ:`e`,ề:`e`,ḕ:`e`,ḝ:`e`,ȇ:`e`,ì:`i`,í:`i`,î:`i`,ï:`i`,ḯ:`i`,ȋ:`i`,ð:`d`,ñ:`n`,ò:`o`,ó:`o`,ô:`o`,õ:`o`,ö:`o`,ø:`o`,ố:`o`,ṍ:`o`,ṓ:`o`,ȏ:`o`,ù:`u`,ú:`u`,û:`u`,ü:`u`,ý:`y`,ÿ:`y`,Ā:`A`,ā:`a`,Ă:`A`,ă:`a`,Ą:`A`,ą:`a`,Ć:`C`,ć:`c`,Ĉ:`C`,ĉ:`c`,Ċ:`C`,ċ:`c`,Č:`C`,č:`c`,C̆:`C`,c̆:`c`,Ď:`D`,ď:`d`,Đ:`D`,đ:`d`,Ē:`E`,ē:`e`,Ĕ:`E`,ĕ:`e`,Ė:`E`,ė:`e`,Ę:`E`,ę:`e`,Ě:`E`,ě:`e`,Ĝ:`G`,Ǵ:`G`,ĝ:`g`,ǵ:`g`,Ğ:`G`,ğ:`g`,Ġ:`G`,ġ:`g`,Ģ:`G`,ģ:`g`,Ĥ:`H`,ĥ:`h`,Ħ:`H`,ħ:`h`,Ḫ:`H`,ḫ:`h`,Ĩ:`I`,ĩ:`i`,Ī:`I`,ī:`i`,Ĭ:`I`,ĭ:`i`,Į:`I`,į:`i`,İ:`I`,ı:`i`,Ĳ:`IJ`,ĳ:`ij`,Ĵ:`J`,ĵ:`j`,Ķ:`K`,ķ:`k`,Ḱ:`K`,ḱ:`k`,K̆:`K`,k̆:`k`,Ĺ:`L`,ĺ:`l`,Ļ:`L`,ļ:`l`,Ľ:`L`,ľ:`l`,Ŀ:`L`,ŀ:`l`,Ł:`l`,ł:`l`,Ḿ:`M`,ḿ:`m`,M̆:`M`,m̆:`m`,Ń:`N`,ń:`n`,Ņ:`N`,ņ:`n`,Ň:`N`,ň:`n`,ŉ:`n`,N̆:`N`,n̆:`n`,Ō:`O`,ō:`o`,Ŏ:`O`,ŏ:`o`,Ő:`O`,ő:`o`,Œ:`OE`,œ:`oe`,P̆:`P`,p̆:`p`,Ŕ:`R`,ŕ:`r`,Ŗ:`R`,ŗ:`r`,Ř:`R`,ř:`r`,R̆:`R`,r̆:`r`,Ȓ:`R`,ȓ:`r`,Ś:`S`,ś:`s`,Ŝ:`S`,ŝ:`s`,Ş:`S`,Ș:`S`,ș:`s`,ş:`s`,Š:`S`,š:`s`,Ţ:`T`,ţ:`t`,ț:`t`,Ț:`T`,Ť:`T`,ť:`t`,Ŧ:`T`,ŧ:`t`,T̆:`T`,t̆:`t`,Ũ:`U`,ũ:`u`,Ū:`U`,ū:`u`,Ŭ:`U`,ŭ:`u`,Ů:`U`,ů:`u`,Ű:`U`,ű:`u`,Ų:`U`,ų:`u`,Ȗ:`U`,ȗ:`u`,V̆:`V`,v̆:`v`,Ŵ:`W`,ŵ:`w`,Ẃ:`W`,ẃ:`w`,X̆:`X`,x̆:`x`,Ŷ:`Y`,ŷ:`y`,Ÿ:`Y`,Y̆:`Y`,y̆:`y`,Ź:`Z`,ź:`z`,Ż:`Z`,ż:`z`,Ž:`Z`,ž:`z`,ſ:`s`,ƒ:`f`,Ơ:`O`,ơ:`o`,Ư:`U`,ư:`u`,Ǎ:`A`,ǎ:`a`,Ǐ:`I`,ǐ:`i`,Ǒ:`O`,ǒ:`o`,Ǔ:`U`,ǔ:`u`,Ǖ:`U`,ǖ:`u`,Ǘ:`U`,ǘ:`u`,Ǚ:`U`,ǚ:`u`,Ǜ:`U`,ǜ:`u`,Ứ:`U`,ứ:`u`,Ṹ:`U`,ṹ:`u`,Ǻ:`A`,ǻ:`a`,Ǽ:`AE`,ǽ:`ae`,Ǿ:`O`,ǿ:`o`,Þ:`TH`,þ:`th`,Ṕ:`P`,ṕ:`p`,Ṥ:`S`,ṥ:`s`,X́:`X`,x́:`x`,Ѓ:`Г`,ѓ:`г`,Ќ:`К`,ќ:`к`,A̋:`A`,a̋:`a`,E̋:`E`,e̋:`e`,I̋:`I`,i̋:`i`,Ǹ:`N`,ǹ:`n`,Ồ:`O`,ồ:`o`,Ṑ:`O`,ṑ:`o`,Ừ:`U`,ừ:`u`,Ẁ:`W`,ẁ:`w`,Ỳ:`Y`,ỳ:`y`,Ȁ:`A`,ȁ:`a`,Ȅ:`E`,ȅ:`e`,Ȉ:`I`,ȉ:`i`,Ȍ:`O`,ȍ:`o`,Ȑ:`R`,ȑ:`r`,Ȕ:`U`,ȕ:`u`,B̌:`B`,b̌:`b`,Č̣:`C`,č̣:`c`,Ê̌:`E`,ê̌:`e`,F̌:`F`,f̌:`f`,Ǧ:`G`,ǧ:`g`,Ȟ:`H`,ȟ:`h`,J̌:`J`,ǰ:`j`,Ǩ:`K`,ǩ:`k`,M̌:`M`,m̌:`m`,P̌:`P`,p̌:`p`,Q̌:`Q`,q̌:`q`,Ř̩:`R`,ř̩:`r`,Ṧ:`S`,ṧ:`s`,V̌:`V`,v̌:`v`,W̌:`W`,w̌:`w`,X̌:`X`,x̌:`x`,Y̌:`Y`,y̌:`y`,A̧:`A`,a̧:`a`,B̧:`B`,b̧:`b`,Ḑ:`D`,ḑ:`d`,Ȩ:`E`,ȩ:`e`,Ɛ̧:`E`,ɛ̧:`e`,Ḩ:`H`,ḩ:`h`,I̧:`I`,i̧:`i`,Ɨ̧:`I`,ɨ̧:`i`,M̧:`M`,m̧:`m`,O̧:`O`,o̧:`o`,Q̧:`Q`,q̧:`q`,U̧:`U`,u̧:`u`,X̧:`X`,x̧:`x`,Z̧:`Z`,z̧:`z`},Ue=Object.keys(He).join(`|`),We=new RegExp(Ue,`g`);function Ge(e){return e.replace(We,e=>He[e])}var H={CASE_SENSITIVE_EQUAL:7,EQUAL:6,STARTS_WITH:5,WORD_STARTS_WITH:4,CONTAINS:3,ACRONYM:2,MATCHES:1,NO_MATCH:0};function Ke(e,t,n){if(n||={},n.threshold=n.threshold??H.MATCHES,!n.accessors){let r=qe(e,t,n);return{rankedValue:e,rank:r,accessorIndex:-1,accessorThreshold:n.threshold,passed:r>=n.threshold}}let r=Qe(e,n.accessors),i={rankedValue:e,rank:H.NO_MATCH,accessorIndex:-1,accessorThreshold:n.threshold,passed:!1};for(let e=0;e<r.length;e++){let a=r[e],o=qe(a.itemValue,t,n),{minRanking:s,maxRanking:c,threshold:l=n.threshold}=a.attributes;o<s&&o>=H.MATCHES?o=s:o>c&&(o=c),o=Math.min(o,c),o>=l&&o>i.rank&&(i.rank=o,i.passed=!0,i.accessorIndex=e,i.accessorThreshold=l,i.rankedValue=a.itemValue)}return i}function qe(e,t,n){return e=Xe(e,n),t=Xe(t,n),t.length>e.length?H.NO_MATCH:e===t?H.CASE_SENSITIVE_EQUAL:(e=e.toLowerCase(),t=t.toLowerCase(),e===t?H.EQUAL:e.startsWith(t)?H.STARTS_WITH:e.includes(` ${t}`)?H.WORD_STARTS_WITH:e.includes(t)?H.CONTAINS:t.length===1?H.NO_MATCH:Je(e).includes(t)?H.ACRONYM:Ye(e,t))}function Je(e){let t=``;return e.split(` `).forEach(e=>{e.split(`-`).forEach(e=>{t+=e.substr(0,1)})}),t}function Ye(e,t){let n=0,r=0;function i(e,t,r){for(let i=r,a=t.length;i<a;i++)if(t[i]===e)return n+=1,i+1;return-1}function a(e){let r=1/e,i=n/t.length;return H.MATCHES+i*r}let o=i(t[0],e,0);if(o<0)return H.NO_MATCH;r=o;for(let n=1,a=t.length;n<a;n++){let a=t[n];if(r=i(a,e,r),!(r>-1))return H.NO_MATCH}return a(r-o)}function Xe(e,t){let{keepDiacritics:n}=t;return e=`${e}`,n||(e=Ge(e)),e}function Ze(e,t){let n=t;typeof t==`object`&&(n=t.accessor);let r=n(e);return r==null?[]:Array.isArray(r)?r:[String(r)]}function Qe(e,t){let n=[];for(let r=0,i=t.length;r<i;r++){let i=t[r],a=et(i),o=Ze(e,i);for(let e=0,t=o.length;e<t;e++)n.push({itemValue:o[e],attributes:a})}return n}var $e={maxRanking:1/0,minRanking:-1/0};function et(e){return typeof e==`function`?$e:{...$e,...e}}var tt={data:``},nt=e=>{if(typeof window==`object`){let t=(e?e.querySelector(`#_goober`):window._goober)||Object.assign(document.createElement(`style`),{innerHTML:` `,id:`_goober`});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||tt},rt=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,it=/\/\*[^]*?\*\/|  +/g,at=/\n+/g,ot=(e,t)=>{let n=``,r=``,i=``;for(let a in e){let o=e[a];a[0]==`@`?a[1]==`i`?n=a+` `+o+`;`:r+=a[1]==`f`?ot(o,a):a+`{`+ot(o,a[1]==`k`?``:t)+`}`:typeof o==`object`?r+=ot(o,t?t.replace(/([^,])+/g,e=>a.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+` `+t:t)):a):o!=null&&(a=/^--/.test(a)?a:a.replace(/[A-Z]/g,`-$&`).toLowerCase(),i+=ot.p?ot.p(a,o):a+`:`+o+`;`)}return n+(t&&i?t+`{`+i+`}`:i)+r},st={},ct=e=>{if(typeof e==`object`){let t=``;for(let n in e)t+=n+ct(e[n]);return t}return e},lt=(e,t,n,r,i)=>{let a=ct(e),o=st[a]||(st[a]=(e=>{let t=0,n=11;for(;t<e.length;)n=101*n+e.charCodeAt(t++)>>>0;return`go`+n})(a));if(!st[o]){let t=a===e?(e=>{let t,n,r=[{}];for(;t=rt.exec(e.replace(it,``));)t[4]?r.shift():t[3]?(n=t[3].replace(at,` `).trim(),r.unshift(r[0][n]=r[0][n]||{})):r[0][t[1]]=t[2].replace(at,` `).trim();return r[0]})(e):e;st[o]=ot(i?{[`@keyframes `+o]:t}:t,n?``:`.`+o)}let s=n&&st.g?st.g:null;return n&&(st.g=st[o]),((e,t,n,r)=>{r?t.data=t.data.replace(r,e):t.data.indexOf(e)===-1&&(t.data=n?e+t.data:t.data+e)})(st[o],t,r,s),o},ut=(e,t,n)=>e.reduce((e,r,i)=>{let a=t[i];if(a&&a.call){let e=a(n),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;a=t?`.`+t:e&&typeof e==`object`?e.props?``:ot(e,``):!1===e?``:e}return e+r+(a??``)},``);function U(e){let t=this||{},n=e.call?e(t.p):e;return lt(n.unshift?n.raw?ut(n,[].slice.call(arguments,1),t.p):n.reduce((e,n)=>Object.assign(e,n&&n.call?n(t.p):n),{}):n,nt(t.target),t.g,t.o,t.k)}U.bind({g:1}),U.bind({k:1});function dt(e){var t,n,r=``;if(typeof e==`string`||typeof e==`number`)r+=e;else if(typeof e==`object`)if(Array.isArray(e)){var i=e.length;for(t=0;t<i;t++)e[t]&&(n=dt(e[t]))&&(r&&(r+=` `),r+=n)}else for(n in e)e[n]&&(r&&(r+=` `),r+=n);return r}function W(){for(var e,t,n=0,r=``,i=arguments.length;n<i;n++)(e=arguments[n])&&(t=dt(e))&&(r&&(r+=` `),r+=t);return r}function ft(e,t){let n=S(e),{onChange:r}=t,i=new Set(t.appear?void 0:n),a=new WeakSet,[o,s]=I([],{equals:!1}),[c]=le(),l=e=>{s(t=>(t.push.apply(t,e),t));for(let t of e)a.delete(t)},u=(e,t,n)=>e.splice(n,0,t);return F(t=>{let n=o(),s=e();if(s[ce],S(c))return c(),t;if(n.length){let e=t.filter(e=>!n.includes(e));return n.length=0,r({list:e,added:[],removed:[],unchanged:e,finishRemoved:l}),e}return S(()=>{let e=new Set(s),n=s.slice(),o=[],c=[],d=[];for(let e of s)(i.has(e)?d:o).push(e);let f=!o.length;for(let r=0;r<t.length;r++){let i=t[r];e.has(i)||(a.has(i)||(c.push(i),a.add(i)),u(n,i,r)),f&&i!==n[r]&&(f=!1)}return!c.length&&f?t:(r({list:n,added:o,removed:c,unchanged:d,finishRemoved:l}),i=e,n)})},t.appear?[]:n.slice())}function pt(...e){return me(e)}var mt=e=>e instanceof Element;function ht(e,t){if(t(e))return e;if(typeof e==`function`&&!e.length)return ht(e(),t);if(Array.isArray(e)){let n=[];for(let r of e){let e=ht(r,t);e&&(Array.isArray(e)?n.push.apply(n,e):n.push(e))}return n.length?n:null}return null}function gt(e,t=mt,n=mt){let r=F(e),i=F(()=>ht(r(),t));return i.toArray=()=>{let e=i();return Array.isArray(e)?e:e?[e]:[]},i}function _t(e){return F(()=>{let t=e.name||`s`;return{enterActive:(e.enterActiveClass||t+`-enter-active`).split(` `),enter:(e.enterClass||t+`-enter`).split(` `),enterTo:(e.enterToClass||t+`-enter-to`).split(` `),exitActive:(e.exitActiveClass||t+`-exit-active`).split(` `),exit:(e.exitClass||t+`-exit`).split(` `),exitTo:(e.exitToClass||t+`-exit-to`).split(` `),move:(e.moveClass||t+`-move`).split(` `)}})}function vt(e){requestAnimationFrame(()=>requestAnimationFrame(e))}function yt(e,t,n,r){let{onBeforeEnter:i,onEnter:a,onAfterEnter:o}=t;i?.(n),n.classList.add(...e.enter),n.classList.add(...e.enterActive),queueMicrotask(()=>{if(!n.parentNode)return r?.();a?.(n,()=>s())}),vt(()=>{n.classList.remove(...e.enter),n.classList.add(...e.enterTo),(!a||a.length<2)&&(n.addEventListener(`transitionend`,s),n.addEventListener(`animationend`,s))});function s(t){(!t||t.target===n)&&(n.removeEventListener(`transitionend`,s),n.removeEventListener(`animationend`,s),n.classList.remove(...e.enterActive),n.classList.remove(...e.enterTo),o?.(n))}}function bt(e,t,n,r){let{onBeforeExit:i,onExit:a,onAfterExit:o}=t;if(!n.parentNode)return r?.();i?.(n),n.classList.add(...e.exit),n.classList.add(...e.exitActive),a?.(n,()=>s()),vt(()=>{n.classList.remove(...e.exit),n.classList.add(...e.exitTo),(!a||a.length<2)&&(n.addEventListener(`transitionend`,s),n.addEventListener(`animationend`,s))});function s(t){(!t||t.target===n)&&(r?.(),n.removeEventListener(`transitionend`,s),n.removeEventListener(`animationend`,s),n.classList.remove(...e.exitActive),n.classList.remove(...e.exitTo),o?.(n))}}var xt=e=>{let t=_t(e);return ft(gt(()=>e.children).toArray,{appear:e.appear,onChange({added:n,removed:r,finishRemoved:i,list:a}){let o=t();for(let t of n)yt(o,e,t);let s=[];for(let e of a)e.isConnected&&(e instanceof HTMLElement||e instanceof SVGElement)&&s.push({el:e,rect:e.getBoundingClientRect()});queueMicrotask(()=>{let e=[];for(let{el:t,rect:n}of s)if(t.isConnected){let r=t.getBoundingClientRect(),i=n.left-r.left,a=n.top-r.top;(i||a)&&(t.style.transform=`translate(${i}px, ${a}px)`,t.style.transitionDuration=`0s`,e.push(t))}document.body.offsetHeight;for(let t of e){let e=function(n){(n.target===t||/transform$/.test(n.propertyName))&&(t.removeEventListener(`transitionend`,e),t.classList.remove(...o.move))};t.classList.add(...o.move),t.style.transform=t.style.transitionDuration=``,t.addEventListener(`transitionend`,e)}});for(let t of r)bt(o,e,t,()=>i([t]))}})},St=Symbol(`fallback`);function Ct(e){for(let t of e)t.dispose()}function wt(e,t,n,r={}){let i=new Map;return R(()=>Ct(i.values())),()=>{let n=e()||[];return n[ce],S(()=>{if(!n.length)return Ct(i.values()),i.clear(),r.fallback?[T(e=>(i.set(St,{dispose:e}),r.fallback()))]:[];let e=Array(n.length),o=i.get(St);if(!i.size||o){o?.dispose(),i.delete(St);for(let r=0;r<n.length;r++){let i=n[r],o=t(i,r);a(e,i,r,o)}return e}let s=new Set(i.keys());for(let r=0;r<n.length;r++){let o=n[r],c=t(o,r);s.delete(c);let l=i.get(c);l?(e[r]=l.mapped,l.setIndex?.(r),l.setItem(()=>o)):a(e,o,r,c)}for(let e of s)i.get(e)?.dispose(),i.delete(e);return e})};function a(e,t,r,a){T(o=>{let[s,c]=I(t),l={setItem:c,dispose:o};if(n.length>1){let[e,t]=I(r);l.setIndex=t,l.mapped=n(s,e)}else l.mapped=n(s);i.set(a,l),e[r]=l.mapped})}}function Tt(e){let{by:t}=e;return F(wt(()=>e.each,typeof t==`function`?t:e=>e[t],e.children,`fallback`in e?{fallback:()=>e.fallback}:void 0))}function Et(e,t,n,r){return e.addEventListener(t,n,r),_e(e.removeEventListener.bind(e,t,n,r))}function Dt(e,t,n,r){let i=()=>{he(z(e)).forEach(e=>{e&&he(z(t)).forEach(t=>Et(e,t,n,r))})};typeof e==`function`?C(i):L(i)}function Ot(e,t){let n=new ResizeObserver(e);return R(n.disconnect.bind(n)),{observe:e=>n.observe(e,t),unobserve:n.unobserve.bind(n)}}function kt(e,t,n){let r=new WeakMap,{observe:i,unobserve:a}=Ot(e=>{for(let n of e){let{contentRect:e,target:i}=n,a=Math.round(e.width),o=Math.round(e.height),s=r.get(i);(!s||s.width!==a||s.height!==o)&&(t(e,i,n),r.set(i,{width:a,height:o}))}},n);C(t=>{let n=pe(he(z(e)));return ve(n,t,i,a),n},[])}var At=/((?:--)?(?:\w+-?)+)\s*:\s*([^;]*)/g;function jt(e){let t={},n;for(;n=At.exec(e);)t[n[1]]=n[2];return t}function Mt(e,t){if(typeof e==`string`){if(typeof t==`string`)return`${e};${t}`;e=jt(e)}else typeof t==`string`&&(t=jt(t));return{...e,...t}}function Nt(e,t,n=-1){return n in e?[...e.slice(0,n),t,...e.slice(n)]:[...e,t]}function Pt(e,t){let n=[...e],r=n.indexOf(t);return r!==-1&&n.splice(r,1),n}function Ft(e){return typeof e==`number`}function It(e){return Object.prototype.toString.call(e)===`[object String]`}function Lt(e){return typeof e==`function`}function Rt(e){return t=>`${e()}-${t}`}function zt(e,t){return e?e===t||e.contains(t):!1}function Bt(e,t=!1){let{activeElement:n}=Ht(e);if(!n?.nodeName)return null;if(Ut(n)&&n.contentDocument)return Bt(n.contentDocument.body,t);if(t){let e=n.getAttribute(`aria-activedescendant`);if(e){let t=Ht(n).getElementById(e);if(t)return t}}return n}function Vt(e){return Ht(e).defaultView||window}function Ht(e){return e?e.ownerDocument||e:document}function Ut(e){return e.tagName===`IFRAME`}var Wt=(e=>(e.Escape=`Escape`,e.Enter=`Enter`,e.Tab=`Tab`,e.Space=` `,e.ArrowDown=`ArrowDown`,e.ArrowLeft=`ArrowLeft`,e.ArrowRight=`ArrowRight`,e.ArrowUp=`ArrowUp`,e.End=`End`,e.Home=`Home`,e.PageDown=`PageDown`,e.PageUp=`PageUp`,e))(Wt||{});function Gt(e){return typeof window<`u`&&window.navigator!=null&&e.test(window.navigator.userAgentData?.platform||window.navigator.platform)}function Kt(){return Gt(/^Mac/i)}function qt(){return Gt(/^iPhone/i)}function Jt(){return Gt(/^iPad/i)||Kt()&&navigator.maxTouchPoints>1}function Yt(){return qt()||Jt()}function Xt(){return Kt()||Yt()}function G(e,t){return t&&(Lt(t)?t(e):t[0](t[1],e)),e?.defaultPrevented}function K(e){return t=>{for(let n of e)G(t,n)}}function Zt(e){return Kt()?e.metaKey&&!e.ctrlKey:e.ctrlKey&&!e.metaKey}function q(e){if(e)if($t())e.focus({preventScroll:!0});else{let t=en(e);e.focus(),tn(t)}}var Qt=null;function $t(){if(Qt==null){Qt=!1;try{document.createElement(`div`).focus({get preventScroll(){return Qt=!0,!0}})}catch{}}return Qt}function en(e){let t=e.parentNode,n=[],r=document.scrollingElement||document.documentElement;for(;t instanceof HTMLElement&&t!==r;)(t.offsetHeight<t.scrollHeight||t.offsetWidth<t.scrollWidth)&&n.push({element:t,scrollTop:t.scrollTop,scrollLeft:t.scrollLeft}),t=t.parentNode;return r instanceof HTMLElement&&n.push({element:r,scrollTop:r.scrollTop,scrollLeft:r.scrollLeft}),n}function tn(e){for(let{element:t,scrollTop:n,scrollLeft:r}of e)t.scrollTop=n,t.scrollLeft=r}var nn=[`input:not([type='hidden']):not([disabled])`,`select:not([disabled])`,`textarea:not([disabled])`,`button:not([disabled])`,`a[href]`,`area[href]`,`[tabindex]`,`iframe`,`object`,`embed`,`audio[controls]`,`video[controls]`,`[contenteditable]:not([contenteditable='false'])`],rn=[...nn,`[tabindex]:not([tabindex="-1"]):not([disabled])`],an=`${nn.join(`:not([hidden]),`)},[tabindex]:not([disabled]):not([hidden])`,on=rn.join(`:not([hidden]):not([tabindex="-1"]),`);function sn(e,t){let n=Array.from(e.querySelectorAll(an)).filter(cn);return t&&cn(e)&&n.unshift(e),n.forEach((e,t)=>{if(Ut(e)&&e.contentDocument){let r=e.contentDocument.body,i=sn(r,!1);n.splice(t,1,...i)}}),n}function cn(e){return ln(e)&&!un(e)}function ln(e){return e.matches(an)&&dn(e)}function un(e){return Number.parseInt(e.getAttribute(`tabindex`)||`0`,10)<0}function dn(e,t){return e.nodeName!==`#comment`&&fn(e)&&pn(e,t)&&(!e.parentElement||dn(e.parentElement,e))}function fn(e){if(!(e instanceof HTMLElement)&&!(e instanceof SVGElement))return!1;let{display:t,visibility:n}=e.style,r=t!==`none`&&n!==`hidden`&&n!==`collapse`;if(r){if(!e.ownerDocument.defaultView)return r;let{getComputedStyle:t}=e.ownerDocument.defaultView,{display:n,visibility:i}=t(e);r=n!==`none`&&i!==`hidden`&&i!==`collapse`}return r}function pn(e,t){return!e.hasAttribute(`hidden`)&&(e.nodeName===`DETAILS`&&t&&t.nodeName!==`SUMMARY`?e.hasAttribute(`open`):!0)}function mn(e,t,n){let r=t?.tabbable?on:an,i=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode(e){return t?.from?.contains(e)?NodeFilter.FILTER_REJECT:e.matches(r)&&dn(e)&&(!t?.accept||t.accept(e))?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});return t?.from&&(i.currentNode=t.from),i}function hn(e){let t=e;for(;t&&!gn(t);)t=t.parentElement;return t||document.scrollingElement||document.documentElement}function gn(e){let t=window.getComputedStyle(e);return/(auto|scroll)/.test(t.overflow+t.overflowX+t.overflowY)}function _n(){}function vn(e,t){let[n,r]=e,i=!1,a=t.length;for(let e=a,o=0,s=e-1;o<e;s=o++){let[a,c]=t[o],[l,u]=t[s],[,d]=t[s===0?e-1:s-1]||[0,0],f=(c-u)*(n-a)-(a-l)*(r-c);if(u<c){if(r>=u&&r<c){if(f===0)return!0;f>0&&(r===u?r>d&&(i=!i):i=!i)}}else if(c<u){if(r>c&&r<=u){if(f===0)return!0;f<0&&(r===u?r<d&&(i=!i):i=!i)}}else if(r===c&&(n>=l&&n<=a||n>=a&&n<=l))return!0}return i}function J(e,t){return s(e,t)}var yn=new Map,bn=new Set;function xn(){if(typeof window>`u`)return;let e=e=>{if(!e.target)return;let n=yn.get(e.target);n||(n=new Set,yn.set(e.target,n),e.target.addEventListener(`transitioncancel`,t)),n.add(e.propertyName)},t=e=>{if(!e.target)return;let n=yn.get(e.target);if(n&&(n.delete(e.propertyName),n.size===0&&(e.target.removeEventListener(`transitioncancel`,t),yn.delete(e.target)),yn.size===0)){for(let e of bn)e();bn.clear()}};document.body.addEventListener(`transitionrun`,e),document.body.addEventListener(`transitionend`,t)}typeof document<`u`&&(document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,xn):xn());function Sn(e,t){let n=Cn(e,t,`left`),r=Cn(e,t,`top`),i=t.offsetWidth,a=t.offsetHeight,o=e.scrollLeft,s=e.scrollTop,c=o+e.offsetWidth,l=s+e.offsetHeight;n<=o?o=n:n+i>c&&(o+=n+i-c),r<=s?s=r:r+a>l&&(s+=r+a-l),e.scrollLeft=o,e.scrollTop=s}function Cn(e,t,n){let r=n===`left`?`offsetLeft`:`offsetTop`,i=0;for(;t.offsetParent&&(i+=t[r],t.offsetParent!==e);){if(t.offsetParent.contains(e)){i-=e[r];break}t=t.offsetParent}return i}function wn(e,t){if(document.contains(e)){let t=document.scrollingElement||document.documentElement;if(window.getComputedStyle(t).overflow!==`hidden`){let{left:t,top:n}=e.getBoundingClientRect();e?.scrollIntoView?.({block:`nearest`});let{left:r,top:i}=e.getBoundingClientRect();(Math.abs(t-r)>1||Math.abs(n-i)>1)&&e.scrollIntoView?.({block:`nearest`})}else{let n=hn(e);for(;e&&n&&e!==t&&n!==t;)Sn(n,e),e=n,n=hn(e)}}}var Tn={border:`0`,clip:`rect(0 0 0 0)`,"clip-path":`inset(50%)`,height:`1px`,margin:`0 -1px -1px 0`,overflow:`hidden`,padding:`0`,position:`absolute`,width:`1px`,"white-space":`nowrap`};function En(e,t){let[n,r]=I(Dn(t?.()));return C(()=>{r(e()?.tagName.toLowerCase()||Dn(t?.()))}),n}function Dn(e){return It(e)?e:void 0}function Y(e){let[t,n]=N(e,[`as`]);if(!t.as)throw Error("[kobalte]: Polymorphic is missing the required `as` prop.");return j(ae,s(n,{get component(){return t.as}}))}var On=Object.defineProperty,kn=(e,t)=>{for(var n in t)On(e,n,{get:t[n],enumerable:!0})};kn({},{Button:()=>Nn,Root:()=>Mn});var An=[`button`,`color`,`file`,`image`,`reset`,`submit`];function jn(e){let t=e.tagName.toLowerCase();return t===`button`?!0:t===`input`&&e.type?An.indexOf(e.type)!==-1:!1}function Mn(e){let t,[n,r]=N(J({type:`button`},e),[`ref`,`type`,`disabled`]),i=En(()=>t,()=>`button`),a=F(()=>{let e=i();return e!=null&&jn({tagName:e,type:n.type})}),o=F(()=>i()===`input`),c=F(()=>i()===`a`&&t?.getAttribute(`href`)!=null);return j(Y,s({as:`button`,ref(e){let r=pt(e=>t=e,n.ref);typeof r==`function`&&r(e)},get type(){return a()||o()?n.type:void 0},get role(){return!a()&&!c()?`button`:void 0},get tabIndex(){return!a()&&!c()&&!n.disabled?0:void 0},get disabled(){return a()||o()?n.disabled:void 0},get"aria-disabled"(){return!a()&&!o()&&n.disabled?!0:void 0},get"data-disabled"(){return n.disabled?``:void 0}},r))}var Nn=Mn;function Pn(e){let[t,n]=I(e.defaultValue?.()),r=F(()=>e.value?.()!==void 0),i=F(()=>r()?e.value?.():t());return[i,t=>{S(()=>{let a=ge(t,i());return Object.is(a,i())||(r()||n(a),e.onChange?.(a)),a})}]}function Fn(e){let[t,n]=Pn(e);return[()=>t()??!1,n]}function In(e){let[t,n]=Pn(e);return[()=>t()??[],n]}function Ln(e={}){let[t,n]=Fn({value:()=>z(e.isSelected),defaultValue:()=>!!z(e.defaultIsSelected),onChange:t=>e.onSelectedChange?.(t)});return{isSelected:t,setIsSelected:t=>{!z(e.isReadOnly)&&!z(e.isDisabled)&&n(t)},toggle:()=>{!z(e.isReadOnly)&&!z(e.isDisabled)&&n(!t())}}}function Rn(e){let t=e.startIndex??0,n=e.startLevel??0,r=[],i=t=>{if(t==null)return``;let n=e.getKey??`key`,r=It(n)?t[n]:n(t);return r==null?``:String(r)},a=t=>{if(t==null)return``;let n=e.getTextValue??`textValue`,r=It(n)?t[n]:n(t);return r==null?``:String(r)},o=t=>{if(t==null)return!1;let n=e.getDisabled??`disabled`;return(It(n)?t[n]:n(t))??!1},s=t=>{if(t!=null)return It(e.getSectionChildren)?t[e.getSectionChildren]:e.getSectionChildren?.(t)};for(let c of e.dataSource){if(It(c)||Ft(c)){r.push({type:`item`,rawValue:c,key:String(c),textValue:String(c),disabled:o(c),level:n,index:t}),t++;continue}if(s(c)!=null){r.push({type:`section`,rawValue:c,key:``,textValue:``,disabled:!1,level:n,index:t}),t++;let i=s(c)??[];if(i.length>0){let a=Rn({dataSource:i,getKey:e.getKey,getTextValue:e.getTextValue,getDisabled:e.getDisabled,getSectionChildren:e.getSectionChildren,startIndex:t,startLevel:n+1});r.push(...a),t+=a.length}}else r.push({type:`item`,rawValue:c,key:i(c),textValue:a(c),disabled:o(c),level:n,index:t}),t++}return r}function zn(e,t=[]){return F(()=>{let n=Rn({dataSource:z(e.dataSource),getKey:z(e.getKey),getTextValue:z(e.getTextValue),getDisabled:z(e.getDisabled),getSectionChildren:z(e.getSectionChildren)});for(let e=0;e<t.length;e++)t[e]();return e.factory(n)})}var Bn=new Set([`Avst`,`Arab`,`Armi`,`Syrc`,`Samr`,`Mand`,`Thaa`,`Mend`,`Nkoo`,`Adlm`,`Rohg`,`Hebr`]),Vn=new Set([`ae`,`ar`,`arc`,`bcc`,`bqi`,`ckb`,`dv`,`fa`,`glk`,`he`,`ku`,`mzn`,`nqo`,`pnb`,`ps`,`sd`,`ug`,`ur`,`yi`]);function Hn(e){if(Intl.Locale){let t=new Intl.Locale(e).maximize().script??``;return Bn.has(t)}let t=e.split(`-`)[0];return Vn.has(t)}function Un(e){return Hn(e)?`rtl`:`ltr`}function Wn(){let e=typeof navigator<`u`&&(navigator.language||navigator.userLanguage)||`en-US`;return{locale:e,direction:Un(e)}}var Gn=Wn(),Kn=new Set;function qn(){Gn=Wn();for(let e of Kn)e(Gn)}function Jn(){let[e,t]=I(Gn),r=F(()=>e());return n(()=>{Kn.size===0&&window.addEventListener(`languagechange`,qn),Kn.add(t),R(()=>{Kn.delete(t),Kn.size===0&&window.removeEventListener(`languagechange`,qn)})}),{locale:()=>r().locale,direction:()=>r().direction}}var Yn=k();function Xn(){let e=Jn();return O(Yn)||e}var Zn=new Map;function Qn(e){let{locale:t}=Xn(),n=F(()=>t()+(e?Object.entries(e).sort((e,t)=>e[0]<t[0]?-1:1).join():``));return F(()=>{let r=n(),i;return Zn.has(r)&&(i=Zn.get(r)),i||(i=new Intl.Collator(t(),e),Zn.set(r,i)),i})}var $n=class e extends Set{anchorKey;currentKey;constructor(t,n,r){super(t),t instanceof e?(this.anchorKey=n||t.anchorKey,this.currentKey=r||t.currentKey):(this.anchorKey=n,this.currentKey=r)}};function er(e){let[t,n]=Pn(e);return[()=>t()??new $n,n]}function tr(e){return Xt()?e.altKey:e.ctrlKey}function nr(e){return Kt()?e.metaKey:e.ctrlKey}function rr(e){return new $n(e)}function ir(e,t){if(e.size!==t.size)return!1;for(let n of e)if(!t.has(n))return!1;return!0}function ar(e){let t=J({selectionMode:`none`,selectionBehavior:`toggle`},e),[n,r]=I(!1),[i,a]=I(),[o,s]=er({value:F(()=>{let e=z(t.selectedKeys);return e==null?e:rr(e)}),defaultValue:F(()=>{let e=z(t.defaultSelectedKeys);return e==null?new $n:rr(e)}),onChange:e=>t.onSelectionChange?.(e)}),[c,l]=I(z(t.selectionBehavior));return C(()=>{let e=o();z(t.selectionBehavior)===`replace`&&c()===`toggle`&&typeof e==`object`&&e.size===0&&l(`replace`)}),C(()=>{l(z(t.selectionBehavior)??`toggle`)}),{selectionMode:()=>z(t.selectionMode),disallowEmptySelection:()=>z(t.disallowEmptySelection)??!1,selectionBehavior:c,setSelectionBehavior:l,isFocused:n,setFocused:r,focusedKey:i,setFocusedKey:a,selectedKeys:o,setSelectedKeys:e=>{(z(t.allowDuplicateSelectionEvents)||!ir(e,o()))&&s(e)}}}function or(e){let[t,n]=I(``),[r,i]=I(-1);return{typeSelectHandlers:{onKeyDown:a=>{if(z(e.isDisabled))return;let o=z(e.keyboardDelegate),s=z(e.selectionManager);if(!o.getKeyForSearch)return;let c=sr(a.key);if(!c||a.ctrlKey||a.metaKey)return;c===` `&&t().trim().length>0&&(a.preventDefault(),a.stopPropagation());let l=n(e=>e+c),u=o.getKeyForSearch(l,s.focusedKey())??o.getKeyForSearch(l);u==null&&cr(l)&&(l=l[0],u=o.getKeyForSearch(l,s.focusedKey())??o.getKeyForSearch(l)),u!=null&&(s.setFocusedKey(u),e.onTypeSelect?.(u)),clearTimeout(r()),i(window.setTimeout(()=>n(``),500))}}}}function sr(e){return e.length===1||!/^[A-Z]/i.test(e)?e:``}function cr(e){return e.split(``).every(t=>t===e[0])}function lr(e,t,r){let i=s({selectOnFocus:()=>z(e.selectionManager).selectionBehavior()===`replace`},e),a=()=>t(),{direction:o}=Xn(),c={top:0,left:0};Dt(()=>z(i.isVirtualized)?void 0:a(),`scroll`,()=>{let e=a();e&&(c={top:e.scrollTop,left:e.scrollLeft})});let{typeSelectHandlers:l}=or({isDisabled:()=>z(i.disallowTypeAhead),keyboardDelegate:()=>z(i.keyboardDelegate),selectionManager:()=>z(i.selectionManager)}),u=()=>z(i.orientation)??`vertical`,d=e=>{G(e,l.onKeyDown),e.altKey&&e.key===`Tab`&&e.preventDefault();let n=t();if(!n?.contains(e.target))return;let r=z(i.selectionManager),a=z(i.selectOnFocus),s=t=>{t!=null&&(r.setFocusedKey(t),e.shiftKey&&r.selectionMode()===`multiple`?r.extendSelection(t):a&&!tr(e)&&r.replaceSelection(t))},c=z(i.keyboardDelegate),d=z(i.shouldFocusWrap),f=r.focusedKey();switch(e.key){case u()===`vertical`?`ArrowDown`:`ArrowRight`:if(c.getKeyBelow){e.preventDefault();let t;t=f==null?c.getFirstKey?.():c.getKeyBelow(f),t==null&&d&&(t=c.getFirstKey?.(f)),s(t)}break;case u()===`vertical`?`ArrowUp`:`ArrowLeft`:if(c.getKeyAbove){e.preventDefault();let t;t=f==null?c.getLastKey?.():c.getKeyAbove(f),t==null&&d&&(t=c.getLastKey?.(f)),s(t)}break;case u()===`vertical`?`ArrowLeft`:`ArrowUp`:if(c.getKeyLeftOf){e.preventDefault();let t=o()===`rtl`,n;n=f==null?t?c.getFirstKey?.():c.getLastKey?.():c.getKeyLeftOf(f),s(n)}break;case u()===`vertical`?`ArrowRight`:`ArrowDown`:if(c.getKeyRightOf){e.preventDefault();let t=o()===`rtl`,n;n=f==null?t?c.getLastKey?.():c.getFirstKey?.():c.getKeyRightOf(f),s(n)}break;case`Home`:if(c.getFirstKey){e.preventDefault();let t=c.getFirstKey(f,nr(e));t!=null&&(r.setFocusedKey(t),nr(e)&&e.shiftKey&&r.selectionMode()===`multiple`?r.extendSelection(t):a&&r.replaceSelection(t))}break;case`End`:if(c.getLastKey){e.preventDefault();let t=c.getLastKey(f,nr(e));t!=null&&(r.setFocusedKey(t),nr(e)&&e.shiftKey&&r.selectionMode()===`multiple`?r.extendSelection(t):a&&r.replaceSelection(t))}break;case`PageDown`:c.getKeyPageBelow&&f!=null&&(e.preventDefault(),s(c.getKeyPageBelow(f)));break;case`PageUp`:c.getKeyPageAbove&&f!=null&&(e.preventDefault(),s(c.getKeyPageAbove(f)));break;case`a`:nr(e)&&r.selectionMode()===`multiple`&&z(i.disallowSelectAll)!==!0&&(e.preventDefault(),r.selectAll());break;case`Escape`:e.defaultPrevented||(e.preventDefault(),z(i.disallowEmptySelection)||r.clearSelection());break;case`Tab`:if(!z(i.allowsTabNavigation)){if(e.shiftKey)n.focus();else{let e=mn(n,{tabbable:!0}),t,r;do r=e.lastChild(),r&&(t=r);while(r);t&&!t.contains(document.activeElement)&&q(t)}break}}},f=e=>{let t=z(i.selectionManager),n=z(i.keyboardDelegate),r=z(i.selectOnFocus);if(t.isFocused()){e.currentTarget.contains(e.target)||t.setFocused(!1);return}if(e.currentTarget.contains(e.target)){if(t.setFocused(!0),t.focusedKey()==null){let i=e=>{e!=null&&(t.setFocusedKey(e),r&&t.replaceSelection(e))},a=e.relatedTarget;a&&e.currentTarget.compareDocumentPosition(a)&Node.DOCUMENT_POSITION_FOLLOWING?i(t.lastSelectedKey()??n.getLastKey?.()):i(t.firstSelectedKey()??n.getFirstKey?.())}else if(!z(i.isVirtualized)){let e=a();if(e){e.scrollTop=c.top,e.scrollLeft=c.left;let n=e.querySelector(`[data-key="${t.focusedKey()}"]`);n&&(q(n),Sn(e,n))}}}},p=e=>{let t=z(i.selectionManager);e.currentTarget.contains(e.relatedTarget)||t.setFocused(!1)},m=e=>{a()===e.target&&e.preventDefault()},g=()=>{let e=z(i.autoFocus);if(!e)return;let n=z(i.selectionManager),r=z(i.keyboardDelegate),a;e===`first`&&(a=r.getFirstKey?.()),e===`last`&&(a=r.getLastKey?.());let o=n.selectedKeys();o.size&&(a=o.values().next().value),n.setFocused(!0),n.setFocusedKey(a);let s=t();s&&a==null&&!z(i.shouldUseVirtualFocus)&&q(s)};return n(()=>{i.deferAutoFocus?setTimeout(g,0):g()}),C(h([a,()=>z(i.isVirtualized),()=>z(i.selectionManager).focusedKey()],e=>{let[t,n,r]=e;if(n)r&&i.scrollToKey?.(r);else if(r&&t){let e=t.querySelector(`[data-key="${r}"]`);e&&Sn(t,e)}})),{tabIndex:F(()=>{if(!z(i.shouldUseVirtualFocus))return z(i.selectionManager).focusedKey()==null?0:-1}),onKeyDown:d,onMouseDown:m,onFocusIn:f,onFocusOut:p}}function ur(e,t){let n=()=>z(e.selectionManager),r=()=>z(e.key),i=()=>z(e.shouldUseVirtualFocus),a=e=>{n().selectionMode()!==`none`&&(n().selectionMode()===`single`?n().isSelected(r())&&!n().disallowEmptySelection()?n().toggleSelection(r()):n().replaceSelection(r()):e?.shiftKey?n().extendSelection(r()):n().selectionBehavior()===`toggle`||nr(e)||`pointerType`in e&&e.pointerType===`touch`?n().toggleSelection(r()):n().replaceSelection(r()))},o=()=>n().isSelected(r()),s=()=>z(e.disabled)||n().isDisabled(r()),c=()=>!s()&&n().canSelectItem(r()),l=null,u=t=>{c()&&(l=t.pointerType,t.pointerType===`mouse`&&t.button===0&&!z(e.shouldSelectOnPressUp)&&a(t))},d=t=>{c()&&t.pointerType===`mouse`&&t.button===0&&z(e.shouldSelectOnPressUp)&&z(e.allowsDifferentPressOrigin)&&a(t)},f=t=>{c()&&(z(e.shouldSelectOnPressUp)&&!z(e.allowsDifferentPressOrigin)||l!==`mouse`)&&a(t)},p=e=>{!c()||![`Enter`,` `].includes(e.key)||(tr(e)?n().toggleSelection(r()):a(e))},m=e=>{s()&&e.preventDefault()},g=e=>{let a=t();i()||s()||!a||e.target===a&&n().setFocusedKey(r())},_=F(()=>{if(!(i()||s()))return r()===n().focusedKey()?0:-1}),v=F(()=>z(e.virtualized)?void 0:r());return C(h([t,r,i,()=>n().focusedKey(),()=>n().isFocused()],([t,n,r,i,a])=>{t&&n===i&&a&&!r&&document.activeElement!==t&&(e.focus?e.focus():q(t))})),{isSelected:o,isDisabled:s,allowsSelection:c,tabIndex:_,dataKey:v,onPointerDown:u,onPointerUp:d,onClick:f,onKeyDown:p,onMouseDown:m,onFocus:g}}var dr=class{collection;state;constructor(e,t){this.collection=e,this.state=t}selectionMode(){return this.state.selectionMode()}disallowEmptySelection(){return this.state.disallowEmptySelection()}selectionBehavior(){return this.state.selectionBehavior()}setSelectionBehavior(e){this.state.setSelectionBehavior(e)}isFocused(){return this.state.isFocused()}setFocused(e){this.state.setFocused(e)}focusedKey(){return this.state.focusedKey()}setFocusedKey(e){(e==null||this.collection().getItem(e))&&this.state.setFocusedKey(e)}selectedKeys(){return this.state.selectedKeys()}isSelected(e){if(this.state.selectionMode()===`none`)return!1;let t=this.getKey(e);return t!=null&&this.state.selectedKeys().has(t)}isEmpty(){return this.state.selectedKeys().size===0}isSelectAll(){if(this.isEmpty())return!1;let e=this.state.selectedKeys();return this.getAllSelectableKeys().every(t=>e.has(t))}firstSelectedKey(){let e;for(let t of this.state.selectedKeys()){let n=this.collection().getItem(t),r=n?.index!=null&&e?.index!=null&&n.index<e.index;(!e||r)&&(e=n)}return e?.key}lastSelectedKey(){let e;for(let t of this.state.selectedKeys()){let n=this.collection().getItem(t),r=n?.index!=null&&e?.index!=null&&n.index>e.index;(!e||r)&&(e=n)}return e?.key}extendSelection(e){if(this.selectionMode()===`none`)return;if(this.selectionMode()===`single`){this.replaceSelection(e);return}let t=this.getKey(e);if(t==null)return;let n=this.state.selectedKeys(),r=n.anchorKey||t,i=new $n(n,r,t);for(let e of this.getKeyRange(r,n.currentKey||t))i.delete(e);for(let e of this.getKeyRange(t,r))this.canSelectItem(e)&&i.add(e);this.state.setSelectedKeys(i)}getKeyRange(e,t){let n=this.collection().getItem(e),r=this.collection().getItem(t);return n&&r?n.index!=null&&r.index!=null&&n.index<=r.index?this.getKeyRangeInternal(e,t):this.getKeyRangeInternal(t,e):[]}getKeyRangeInternal(e,t){let n=[],r=e;for(;r!=null;){let e=this.collection().getItem(r);if(e&&e.type===`item`&&n.push(r),r===t)return n;r=this.collection().getKeyAfter(r)}return[]}getKey(e){let t=this.collection().getItem(e);return t?!t||t.type!==`item`?null:t.key:e}toggleSelection(e){if(this.selectionMode()===`none`)return;if(this.selectionMode()===`single`&&!this.isSelected(e)){this.replaceSelection(e);return}let t=this.getKey(e);if(t==null)return;let n=new $n(this.state.selectedKeys());n.has(t)?n.delete(t):this.canSelectItem(t)&&(n.add(t),n.anchorKey=t,n.currentKey=t),!(this.disallowEmptySelection()&&n.size===0)&&this.state.setSelectedKeys(n)}replaceSelection(e){if(this.selectionMode()===`none`)return;let t=this.getKey(e);if(t==null)return;let n=this.canSelectItem(t)?new $n([t],t,t):new $n;this.state.setSelectedKeys(n)}setSelectedKeys(e){if(this.selectionMode()===`none`)return;let t=new $n;for(let n of e){let e=this.getKey(n);if(e!=null&&(t.add(e),this.selectionMode()===`single`))break}this.state.setSelectedKeys(t)}selectAll(){this.selectionMode()===`multiple`&&this.state.setSelectedKeys(new Set(this.getAllSelectableKeys()))}clearSelection(){let e=this.state.selectedKeys();!this.disallowEmptySelection()&&e.size>0&&this.state.setSelectedKeys(new $n)}toggleSelectAll(){this.isSelectAll()?this.clearSelection():this.selectAll()}select(e,t){this.selectionMode()!==`none`&&(this.selectionMode()===`single`?this.isSelected(e)&&!this.disallowEmptySelection()?this.toggleSelection(e):this.replaceSelection(e):this.selectionBehavior()===`toggle`||t&&t.pointerType===`touch`?this.toggleSelection(e):this.replaceSelection(e))}isSelectionEqual(e){if(e===this.state.selectedKeys())return!0;let t=this.selectedKeys();if(e.size!==t.size)return!1;for(let n of e)if(!t.has(n))return!1;for(let n of t)if(!e.has(n))return!1;return!0}canSelectItem(e){if(this.state.selectionMode()===`none`)return!1;let t=this.collection().getItem(e);return t!=null&&!t.disabled}isDisabled(e){let t=this.collection().getItem(e);return!t||t.disabled}getAllSelectableKeys(){let e=[];return(t=>{for(;t!=null;){if(this.canSelectItem(t)){let n=this.collection().getItem(t);if(!n)continue;n.type===`item`&&e.push(t)}t=this.collection().getKeyAfter(t)}})(this.collection().getFirstKey()),e}},fr=class{keyMap=new Map;iterable;firstKey;lastKey;constructor(e){this.iterable=e;for(let t of e)this.keyMap.set(t.key,t);if(this.keyMap.size===0)return;let t,n=0;for(let[e,r]of this.keyMap)t?(t.nextKey=e,r.prevKey=t.key):(this.firstKey=e,r.prevKey=void 0),r.type===`item`&&(r.index=n++),t=r,t.nextKey=void 0;this.lastKey=t.key}*[Symbol.iterator](){yield*this.iterable}getSize(){return this.keyMap.size}getKeys(){return this.keyMap.keys()}getKeyBefore(e){return this.keyMap.get(e)?.prevKey}getKeyAfter(e){return this.keyMap.get(e)?.nextKey}getFirstKey(){return this.firstKey}getLastKey(){return this.lastKey}getItem(e){return this.keyMap.get(e)}at(e){let t=[...this.getKeys()];return this.getItem(t[e])}};function pr(e){let t=ar(e),n=zn({dataSource:()=>z(e.dataSource),getKey:()=>z(e.getKey),getTextValue:()=>z(e.getTextValue),getDisabled:()=>z(e.getDisabled),getSectionChildren:()=>z(e.getSectionChildren),factory:t=>e.filter?new fr(e.filter(t)):new fr(t)},[()=>e.filter]),r=new dr(n,t);return te(()=>{let e=t.focusedKey();e!=null&&!n().getItem(e)&&t.setFocusedKey(void 0)}),{collection:n,selectionManager:()=>r}}var mr=k();function hr(){return O(mr)}function gr(){let e=hr();if(e===void 0)throw Error("[kobalte]: `useDomCollectionContext` must be used within a `DomCollectionProvider` component");return e}function _r(e,t){return!!(t.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_PRECEDING)}function vr(e,t){let n=t.ref();if(!n)return-1;let r=e.length;if(!r)return-1;for(;r--;){let t=e[r]?.ref();if(t&&_r(t,n))return r+1}return 0}function yr(e){let t=e.map((e,t)=>[t,e]),n=!1;return t.sort(([e,t],[r,i])=>{let a=t.ref(),o=i.ref();return a===o||!a||!o?0:_r(a,o)?(e>r&&(n=!0),-1):(e<r&&(n=!0),1)}),n?t.map(([e,t])=>t):e}function br(e,t){let n=yr(e);e!==n&&t(n)}function xr(e){let t=e[0],n=e[e.length-1]?.ref(),r=t?.ref()?.parentElement;for(;r;){if(n&&r.contains(n))return r;r=r.parentElement}return Ht(r).body}function Sr(e,t){C(()=>{let n=setTimeout(()=>{br(e(),t)});R(()=>clearTimeout(n))})}function Cr(e,t){if(typeof IntersectionObserver!=`function`){Sr(e,t);return}let n=[];C(()=>{let r=()=>{let r=!!n.length;n=e(),r&&br(e(),t)},i=xr(e()),a=new IntersectionObserver(r,{root:i});for(let t of e()){let e=t.ref();e&&a.observe(e)}R(()=>a.disconnect())})}function wr(e={}){let[t,n]=In({value:()=>z(e.items),onChange:t=>e.onItemsChange?.(t)});Cr(t,n);let r=e=>(n(t=>Nt(t,e,vr(t,e))),()=>{n(t=>{let n=t.filter(t=>t.ref()!==e.ref());return t.length===n.length?t:n})});return{DomCollectionProvider:e=>j(mr.Provider,{value:{registerItem:r},get children(){return e.children}})}}function Tr(e){let t=gr(),n=J({shouldRegisterItem:!0},e);C(()=>{n.shouldRegisterItem&&R(t.registerItem(n.getItem()))})}var Er=[`top`,`right`,`bottom`,`left`],Dr=Math.min,Or=Math.max,kr=Math.round,Ar=Math.floor,jr=e=>({x:e,y:e}),Mr={left:`right`,right:`left`,bottom:`top`,top:`bottom`};function Nr(e,t,n){return Or(e,Dr(t,n))}function Pr(e,t){return typeof e==`function`?e(t):e}function Fr(e){return e.split(`-`)[0]}function Ir(e){return e.split(`-`)[1]}function Lr(e){return e===`x`?`y`:`x`}function Rr(e){return e===`y`?`height`:`width`}function zr(e){let t=e[0];return t===`t`||t===`b`?`y`:`x`}function Br(e){return Lr(zr(e))}function Vr(e,t,n){n===void 0&&(n=!1);let r=Ir(e),i=Br(e),a=Rr(i),o=i===`x`?r===(n?`end`:`start`)?`right`:`left`:r===`start`?`bottom`:`top`;return t.reference[a]>t.floating[a]&&(o=Xr(o)),[o,Xr(o)]}function Hr(e){let t=Xr(e);return[Ur(e),t,Ur(t)]}function Ur(e){return e.includes(`start`)?e.replace(`start`,`end`):e.replace(`end`,`start`)}var Wr=[`left`,`right`],Gr=[`right`,`left`],Kr=[`top`,`bottom`],qr=[`bottom`,`top`];function Jr(e,t,n){switch(e){case`top`:case`bottom`:return n?t?Gr:Wr:t?Wr:Gr;case`left`:case`right`:return t?Kr:qr;default:return[]}}function Yr(e,t,n,r){let i=Ir(e),a=Jr(Fr(e),n===`start`,r);return i&&(a=a.map(e=>e+`-`+i),t&&(a=a.concat(a.map(Ur)))),a}function Xr(e){let t=Fr(e);return Mr[t]+e.slice(t.length)}function Zr(e){return{top:0,right:0,bottom:0,left:0,...e}}function Qr(e){return typeof e==`number`?{top:e,right:e,bottom:e,left:e}:Zr(e)}function $r(e){let{x:t,y:n,width:r,height:i}=e;return{width:r,height:i,top:n,left:t,right:t+r,bottom:n+i,x:t,y:n}}function ei(e,t,n){let{reference:r,floating:i}=e,a=zr(t),o=Br(t),s=Rr(o),c=Fr(t),l=a===`y`,u=r.x+r.width/2-i.width/2,d=r.y+r.height/2-i.height/2,f=r[s]/2-i[s]/2,p;switch(c){case`top`:p={x:u,y:r.y-i.height};break;case`bottom`:p={x:u,y:r.y+r.height};break;case`right`:p={x:r.x+r.width,y:d};break;case`left`:p={x:r.x-i.width,y:d};break;default:p={x:r.x,y:r.y}}switch(Ir(t)){case`start`:p[o]-=f*(n&&l?-1:1);break;case`end`:p[o]+=f*(n&&l?-1:1);break}return p}async function ti(e,t){t===void 0&&(t={});let{x:n,y:r,platform:i,rects:a,elements:o,strategy:s}=e,{boundary:c=`clippingAncestors`,rootBoundary:l=`viewport`,elementContext:u=`floating`,altBoundary:d=!1,padding:f=0}=Pr(t,e),p=Qr(f),m=o[d?u===`floating`?`reference`:`floating`:u],h=$r(await i.getClippingRect({element:await(i.isElement==null?void 0:i.isElement(m))??!0?m:m.contextElement||await(i.getDocumentElement==null?void 0:i.getDocumentElement(o.floating)),boundary:c,rootBoundary:l,strategy:s})),g=u===`floating`?{x:n,y:r,width:a.floating.width,height:a.floating.height}:a.reference,_=await(i.getOffsetParent==null?void 0:i.getOffsetParent(o.floating)),v=await(i.isElement==null?void 0:i.isElement(_))&&await(i.getScale==null?void 0:i.getScale(_))||{x:1,y:1},y=$r(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({elements:o,rect:g,offsetParent:_,strategy:s}):g);return{top:(h.top-y.top+p.top)/v.y,bottom:(y.bottom-h.bottom+p.bottom)/v.y,left:(h.left-y.left+p.left)/v.x,right:(y.right-h.right+p.right)/v.x}}var ni=50,ri=async(e,t,n)=>{let{placement:r=`bottom`,strategy:i=`absolute`,middleware:a=[],platform:o}=n,s=o.detectOverflow?o:{...o,detectOverflow:ti},c=await(o.isRTL==null?void 0:o.isRTL(t)),l=await o.getElementRects({reference:e,floating:t,strategy:i}),{x:u,y:d}=ei(l,r,c),f=r,p=0,m={};for(let n=0;n<a.length;n++){let h=a[n];if(!h)continue;let{name:g,fn:_}=h,{x:v,y,data:b,reset:x}=await _({x:u,y:d,initialPlacement:r,placement:f,strategy:i,middlewareData:m,rects:l,platform:s,elements:{reference:e,floating:t}});u=v??u,d=y??d,m[g]={...m[g],...b},x&&p<ni&&(p++,typeof x==`object`&&(x.placement&&(f=x.placement),x.rects&&(l=x.rects===!0?await o.getElementRects({reference:e,floating:t,strategy:i}):x.rects),{x:u,y:d}=ei(l,f,c)),n=-1)}return{x:u,y:d,placement:f,strategy:i,middlewareData:m}},ii=e=>({name:`arrow`,options:e,async fn(t){let{x:n,y:r,placement:i,rects:a,platform:o,elements:s,middlewareData:c}=t,{element:l,padding:u=0}=Pr(e,t)||{};if(l==null)return{};let d=Qr(u),f={x:n,y:r},p=Br(i),m=Rr(p),h=await o.getDimensions(l),g=p===`y`,_=g?`top`:`left`,v=g?`bottom`:`right`,y=g?`clientHeight`:`clientWidth`,b=a.reference[m]+a.reference[p]-f[p]-a.floating[m],x=f[p]-a.reference[p],S=await(o.getOffsetParent==null?void 0:o.getOffsetParent(l)),C=S?S[y]:0;(!C||!await(o.isElement==null?void 0:o.isElement(S)))&&(C=s.floating[y]||a.floating[m]);let w=b/2-x/2,T=C/2-h[m]/2-1,E=Dr(d[_],T),D=Dr(d[v],T),O=E,ee=C-h[m]-D,k=C/2-h[m]/2+w,te=Nr(O,k,ee),ne=!c.arrow&&Ir(i)!=null&&k!==te&&a.reference[m]/2-(k<O?E:D)-h[m]/2<0,A=ne?k<O?k-O:k-ee:0;return{[p]:f[p]+A,data:{[p]:te,centerOffset:k-te-A,...ne&&{alignmentOffset:A}},reset:ne}}}),ai=function(e){return e===void 0&&(e={}),{name:`flip`,options:e,async fn(t){var n;let{placement:r,middlewareData:i,rects:a,initialPlacement:o,platform:s,elements:c}=t,{mainAxis:l=!0,crossAxis:u=!0,fallbackPlacements:d,fallbackStrategy:f=`bestFit`,fallbackAxisSideDirection:p=`none`,flipAlignment:m=!0,...h}=Pr(e,t);if((n=i.arrow)!=null&&n.alignmentOffset)return{};let g=Fr(r),_=zr(o),v=Fr(o)===o,y=await(s.isRTL==null?void 0:s.isRTL(c.floating)),b=d||(v||!m?[Xr(o)]:Hr(o)),x=p!==`none`;!d&&x&&b.push(...Yr(o,m,p,y));let S=[o,...b],C=await s.detectOverflow(t,h),w=[],T=i.flip?.overflows||[];if(l&&w.push(C[g]),u){let e=Vr(r,a,y);w.push(C[e[0]],C[e[1]])}if(T=[...T,{placement:r,overflows:w}],!w.every(e=>e<=0)){let e=(i.flip?.index||0)+1,t=S[e];if(t&&(!(u===`alignment`&&_!==zr(t))||T.every(e=>zr(e.placement)!==_||e.overflows[0]>0)))return{data:{index:e,overflows:T},reset:{placement:t}};let n=T.filter(e=>e.overflows[0]<=0).sort((e,t)=>e.overflows[1]-t.overflows[1])[0]?.placement;if(!n)switch(f){case`bestFit`:{let e=T.filter(e=>{if(x){let t=zr(e.placement);return t===_||t===`y`}return!0}).map(e=>[e.placement,e.overflows.filter(e=>e>0).reduce((e,t)=>e+t,0)]).sort((e,t)=>e[1]-t[1])[0]?.[0];e&&(n=e);break}case`initialPlacement`:n=o;break}if(r!==n)return{reset:{placement:n}}}return{}}}};function oi(e,t){return{top:e.top-t.height,right:e.right-t.width,bottom:e.bottom-t.height,left:e.left-t.width}}function si(e){return Er.some(t=>e[t]>=0)}var ci=function(e){return e===void 0&&(e={}),{name:`hide`,options:e,async fn(t){let{rects:n,platform:r}=t,{strategy:i=`referenceHidden`,...a}=Pr(e,t);switch(i){case`referenceHidden`:{let e=oi(await r.detectOverflow(t,{...a,elementContext:`reference`}),n.reference);return{data:{referenceHiddenOffsets:e,referenceHidden:si(e)}}}case`escaped`:{let e=oi(await r.detectOverflow(t,{...a,altBoundary:!0}),n.floating);return{data:{escapedOffsets:e,escaped:si(e)}}}default:return{}}}}},li=new Set([`left`,`top`]);async function ui(e,t){let{placement:n,platform:r,elements:i}=e,a=await(r.isRTL==null?void 0:r.isRTL(i.floating)),o=Fr(n),s=Ir(n),c=zr(n)===`y`,l=li.has(o)?-1:1,u=a&&c?-1:1,d=Pr(t,e),{mainAxis:f,crossAxis:p,alignmentAxis:m}=typeof d==`number`?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return s&&typeof m==`number`&&(p=s===`end`?m*-1:m),c?{x:p*u,y:f*l}:{x:f*l,y:p*u}}var di=function(e){return e===void 0&&(e=0),{name:`offset`,options:e,async fn(t){var n;let{x:r,y:i,placement:a,middlewareData:o}=t,s=await ui(t,e);return a===o.offset?.placement&&(n=o.arrow)!=null&&n.alignmentOffset?{}:{x:r+s.x,y:i+s.y,data:{...s,placement:a}}}}},fi=function(e){return e===void 0&&(e={}),{name:`shift`,options:e,async fn(t){let{x:n,y:r,placement:i,platform:a}=t,{mainAxis:o=!0,crossAxis:s=!1,limiter:c={fn:e=>{let{x:t,y:n}=e;return{x:t,y:n}}},...l}=Pr(e,t),u={x:n,y:r},d=await a.detectOverflow(t,l),f=zr(Fr(i)),p=Lr(f),m=u[p],h=u[f];if(o){let e=p===`y`?`top`:`left`,t=p===`y`?`bottom`:`right`,n=m+d[e],r=m-d[t];m=Nr(n,m,r)}if(s){let e=f===`y`?`top`:`left`,t=f===`y`?`bottom`:`right`,n=h+d[e],r=h-d[t];h=Nr(n,h,r)}let g=c.fn({...t,[p]:m,[f]:h});return{...g,data:{x:g.x-n,y:g.y-r,enabled:{[p]:o,[f]:s}}}}}},pi=function(e){return e===void 0&&(e={}),{name:`size`,options:e,async fn(t){var n,r;let{placement:i,rects:a,platform:o,elements:s}=t,{apply:c=()=>{},...l}=Pr(e,t),u=await o.detectOverflow(t,l),d=Fr(i),f=Ir(i),p=zr(i)===`y`,{width:m,height:h}=a.floating,g,_;d===`top`||d===`bottom`?(g=d,_=f===(await(o.isRTL==null?void 0:o.isRTL(s.floating))?`start`:`end`)?`left`:`right`):(_=d,g=f===`end`?`top`:`bottom`);let v=h-u.top-u.bottom,y=m-u.left-u.right,b=Dr(h-u[g],v),x=Dr(m-u[_],y),S=!t.middlewareData.shift,C=b,w=x;if((n=t.middlewareData.shift)!=null&&n.enabled.x&&(w=y),(r=t.middlewareData.shift)!=null&&r.enabled.y&&(C=v),S&&!f){let e=Or(u.left,0),t=Or(u.right,0),n=Or(u.top,0),r=Or(u.bottom,0);p?w=m-2*(e!==0||t!==0?e+t:Or(u.left,u.right)):C=h-2*(n!==0||r!==0?n+r:Or(u.top,u.bottom))}await c({...t,availableWidth:w,availableHeight:C});let T=await o.getDimensions(s.floating);return m!==T.width||h!==T.height?{reset:{rects:!0}}:{}}}};function mi(){return typeof window<`u`}function hi(e){return vi(e)?(e.nodeName||``).toLowerCase():`#document`}function gi(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function _i(e){return((vi(e)?e.ownerDocument:e.document)||window.document)?.documentElement}function vi(e){return mi()?e instanceof Node||e instanceof gi(e).Node:!1}function yi(e){return mi()?e instanceof Element||e instanceof gi(e).Element:!1}function bi(e){return mi()?e instanceof HTMLElement||e instanceof gi(e).HTMLElement:!1}function xi(e){return!mi()||typeof ShadowRoot>`u`?!1:e instanceof ShadowRoot||e instanceof gi(e).ShadowRoot}function Si(e){let{overflow:t,overflowX:n,overflowY:r,display:i}=Ni(e);return/auto|scroll|overlay|hidden|clip/.test(t+r+n)&&i!==`inline`&&i!==`contents`}function Ci(e){return/^(table|td|th)$/.test(hi(e))}function wi(e){try{if(e.matches(`:popover-open`))return!0}catch{}try{return e.matches(`:modal`)}catch{return!1}}var Ti=/transform|translate|scale|rotate|perspective|filter/,Ei=/paint|layout|strict|content/,Di=e=>!!e&&e!==`none`,Oi;function ki(e){let t=yi(e)?Ni(e):e;return Di(t.transform)||Di(t.translate)||Di(t.scale)||Di(t.rotate)||Di(t.perspective)||!ji()&&(Di(t.backdropFilter)||Di(t.filter))||Ti.test(t.willChange||``)||Ei.test(t.contain||``)}function Ai(e){let t=Fi(e);for(;bi(t)&&!Mi(t);){if(ki(t))return t;if(wi(t))return null;t=Fi(t)}return null}function ji(){return Oi??=typeof CSS<`u`&&CSS.supports&&CSS.supports(`-webkit-backdrop-filter`,`none`),Oi}function Mi(e){return/^(html|body|#document)$/.test(hi(e))}function Ni(e){return gi(e).getComputedStyle(e)}function Pi(e){return yi(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function Fi(e){if(hi(e)===`html`)return e;let t=e.assignedSlot||e.parentNode||xi(e)&&e.host||_i(e);return xi(t)?t.host:t}function Ii(e){let t=Fi(e);return Mi(t)?e.ownerDocument?e.ownerDocument.body:e.body:bi(t)&&Si(t)?t:Ii(t)}function Li(e,t,n){t===void 0&&(t=[]),n===void 0&&(n=!0);let r=Ii(e),i=r===e.ownerDocument?.body,a=gi(r);if(i){let e=Ri(a);return t.concat(a,a.visualViewport||[],Si(r)?r:[],e&&n?Li(e):[])}else return t.concat(r,Li(r,[],n))}function Ri(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function zi(e){let t=Ni(e),n=parseFloat(t.width)||0,r=parseFloat(t.height)||0,i=bi(e),a=i?e.offsetWidth:n,o=i?e.offsetHeight:r,s=kr(n)!==a||kr(r)!==o;return s&&(n=a,r=o),{width:n,height:r,$:s}}function Bi(e){return yi(e)?e:e.contextElement}function Vi(e){let t=Bi(e);if(!bi(t))return jr(1);let n=t.getBoundingClientRect(),{width:r,height:i,$:a}=zi(t),o=(a?kr(n.width):n.width)/r,s=(a?kr(n.height):n.height)/i;return(!o||!Number.isFinite(o))&&(o=1),(!s||!Number.isFinite(s))&&(s=1),{x:o,y:s}}var Hi=jr(0);function Ui(e){let t=gi(e);return!ji()||!t.visualViewport?Hi:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function Wi(e,t,n){return t===void 0&&(t=!1),!n||t&&n!==gi(e)?!1:t}function Gi(e,t,n,r){t===void 0&&(t=!1),n===void 0&&(n=!1);let i=e.getBoundingClientRect(),a=Bi(e),o=jr(1);t&&(r?yi(r)&&(o=Vi(r)):o=Vi(e));let s=Wi(a,n,r)?Ui(a):jr(0),c=(i.left+s.x)/o.x,l=(i.top+s.y)/o.y,u=i.width/o.x,d=i.height/o.y;if(a){let e=gi(a),t=r&&yi(r)?gi(r):r,n=e,i=Ri(n);for(;i&&r&&t!==n;){let e=Vi(i),t=i.getBoundingClientRect(),r=Ni(i),a=t.left+(i.clientLeft+parseFloat(r.paddingLeft))*e.x,o=t.top+(i.clientTop+parseFloat(r.paddingTop))*e.y;c*=e.x,l*=e.y,u*=e.x,d*=e.y,c+=a,l+=o,n=gi(i),i=Ri(n)}}return $r({width:u,height:d,x:c,y:l})}function Ki(e,t){let n=Pi(e).scrollLeft;return t?t.left+n:Gi(_i(e)).left+n}function qi(e,t){let n=e.getBoundingClientRect();return{x:n.left+t.scrollLeft-Ki(e,n),y:n.top+t.scrollTop}}function Ji(e){let{elements:t,rect:n,offsetParent:r,strategy:i}=e,a=i===`fixed`,o=_i(r),s=t?wi(t.floating):!1;if(r===o||s&&a)return n;let c={scrollLeft:0,scrollTop:0},l=jr(1),u=jr(0),d=bi(r);if((d||!d&&!a)&&((hi(r)!==`body`||Si(o))&&(c=Pi(r)),d)){let e=Gi(r);l=Vi(r),u.x=e.x+r.clientLeft,u.y=e.y+r.clientTop}let f=o&&!d&&!a?qi(o,c):jr(0);return{width:n.width*l.x,height:n.height*l.y,x:n.x*l.x-c.scrollLeft*l.x+u.x+f.x,y:n.y*l.y-c.scrollTop*l.y+u.y+f.y}}function Yi(e){return Array.from(e.getClientRects())}function Xi(e){let t=_i(e),n=Pi(e),r=e.ownerDocument.body,i=Or(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),a=Or(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight),o=-n.scrollLeft+Ki(e),s=-n.scrollTop;return Ni(r).direction===`rtl`&&(o+=Or(t.clientWidth,r.clientWidth)-i),{width:i,height:a,x:o,y:s}}var Zi=25;function Qi(e,t){let n=gi(e),r=_i(e),i=n.visualViewport,a=r.clientWidth,o=r.clientHeight,s=0,c=0;if(i){a=i.width,o=i.height;let e=ji();(!e||e&&t===`fixed`)&&(s=i.offsetLeft,c=i.offsetTop)}let l=Ki(r);if(l<=0){let e=r.ownerDocument,t=e.body,n=getComputedStyle(t),i=e.compatMode===`CSS1Compat`&&parseFloat(n.marginLeft)+parseFloat(n.marginRight)||0,o=Math.abs(r.clientWidth-t.clientWidth-i);o<=Zi&&(a-=o)}else l<=Zi&&(a+=l);return{width:a,height:o,x:s,y:c}}function $i(e,t){let n=Gi(e,!0,t===`fixed`),r=n.top+e.clientTop,i=n.left+e.clientLeft,a=bi(e)?Vi(e):jr(1);return{width:e.clientWidth*a.x,height:e.clientHeight*a.y,x:i*a.x,y:r*a.y}}function ea(e,t,n){let r;if(t===`viewport`)r=Qi(e,n);else if(t===`document`)r=Xi(_i(e));else if(yi(t))r=$i(t,n);else{let n=Ui(e);r={x:t.x-n.x,y:t.y-n.y,width:t.width,height:t.height}}return $r(r)}function ta(e,t){let n=Fi(e);return n===t||!yi(n)||Mi(n)?!1:Ni(n).position===`fixed`||ta(n,t)}function na(e,t){let n=t.get(e);if(n)return n;let r=Li(e,[],!1).filter(e=>yi(e)&&hi(e)!==`body`),i=null,a=Ni(e).position===`fixed`,o=a?Fi(e):e;for(;yi(o)&&!Mi(o);){let t=Ni(o),n=ki(o);!n&&t.position===`fixed`&&(i=null),(a?!n&&!i:!n&&t.position===`static`&&i&&(i.position===`absolute`||i.position===`fixed`)||Si(o)&&!n&&ta(e,o))?r=r.filter(e=>e!==o):i=t,o=Fi(o)}return t.set(e,r),r}function ra(e){let{element:t,boundary:n,rootBoundary:r,strategy:i}=e,a=[...n===`clippingAncestors`?wi(t)?[]:na(t,this._c):[].concat(n),r],o=ea(t,a[0],i),s=o.top,c=o.right,l=o.bottom,u=o.left;for(let e=1;e<a.length;e++){let n=ea(t,a[e],i);s=Or(n.top,s),c=Dr(n.right,c),l=Dr(n.bottom,l),u=Or(n.left,u)}return{width:c-u,height:l-s,x:u,y:s}}function ia(e){let{width:t,height:n}=zi(e);return{width:t,height:n}}function aa(e,t,n){let r=bi(t),i=_i(t),a=n===`fixed`,o=Gi(e,!0,a,t),s={scrollLeft:0,scrollTop:0},c=jr(0);function l(){c.x=Ki(i)}if(r||!r&&!a)if((hi(t)!==`body`||Si(i))&&(s=Pi(t)),r){let e=Gi(t,!0,a,t);c.x=e.x+t.clientLeft,c.y=e.y+t.clientTop}else i&&l();a&&!r&&i&&l();let u=i&&!r&&!a?qi(i,s):jr(0);return{x:o.left+s.scrollLeft-c.x-u.x,y:o.top+s.scrollTop-c.y-u.y,width:o.width,height:o.height}}function oa(e){return Ni(e).position===`static`}function sa(e,t){if(!bi(e)||Ni(e).position===`fixed`)return null;if(t)return t(e);let n=e.offsetParent;return _i(e)===n&&(n=n.ownerDocument.body),n}function ca(e,t){let n=gi(e);if(wi(e))return n;if(!bi(e)){let t=Fi(e);for(;t&&!Mi(t);){if(yi(t)&&!oa(t))return t;t=Fi(t)}return n}let r=sa(e,t);for(;r&&Ci(r)&&oa(r);)r=sa(r,t);return r&&Mi(r)&&oa(r)&&!ki(r)?n:r||Ai(e)||n}var la=async function(e){let t=this.getOffsetParent||ca,n=this.getDimensions,r=await n(e.floating);return{reference:aa(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}};function ua(e){return Ni(e).direction===`rtl`}var da={convertOffsetParentRelativeRectToViewportRelativeRect:Ji,getDocumentElement:_i,getClippingRect:ra,getOffsetParent:ca,getElementRects:la,getClientRects:Yi,getDimensions:ia,getScale:Vi,isElement:yi,isRTL:ua};function fa(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function pa(e,t){let n=null,r,i=_i(e);function a(){var e;clearTimeout(r),(e=n)==null||e.disconnect(),n=null}function o(s,c){s===void 0&&(s=!1),c===void 0&&(c=1),a();let l=e.getBoundingClientRect(),{left:u,top:d,width:f,height:p}=l;if(s||t(),!f||!p)return;let m=Ar(d),h=Ar(i.clientWidth-(u+f)),g=Ar(i.clientHeight-(d+p)),_=Ar(u),v={rootMargin:-m+`px `+-h+`px `+-g+`px `+-_+`px`,threshold:Or(0,Dr(1,c))||1},y=!0;function b(t){let n=t[0].intersectionRatio;if(n!==c){if(!y)return o();n?o(!1,n):r=setTimeout(()=>{o(!1,1e-7)},1e3)}n===1&&!fa(l,e.getBoundingClientRect())&&o(),y=!1}try{n=new IntersectionObserver(b,{...v,root:i.ownerDocument})}catch{n=new IntersectionObserver(b,v)}n.observe(e)}return o(!0),a}function ma(e,t,n,r){r===void 0&&(r={});let{ancestorScroll:i=!0,ancestorResize:a=!0,elementResize:o=typeof ResizeObserver==`function`,layoutShift:s=typeof IntersectionObserver==`function`,animationFrame:c=!1}=r,l=Bi(e),u=i||a?[...l?Li(l):[],...t?Li(t):[]]:[];u.forEach(e=>{i&&e.addEventListener(`scroll`,n,{passive:!0}),a&&e.addEventListener(`resize`,n)});let d=l&&s?pa(l,n):null,f=-1,p=null;o&&(p=new ResizeObserver(e=>{let[r]=e;r&&r.target===l&&p&&t&&(p.unobserve(t),cancelAnimationFrame(f),f=requestAnimationFrame(()=>{var e;(e=p)==null||e.observe(t)})),n()}),l&&!c&&p.observe(l),t&&p.observe(t));let m,h=c?Gi(e):null;c&&g();function g(){let t=Gi(e);h&&!fa(h,t)&&n(),h=t,m=requestAnimationFrame(g)}return n(),()=>{var e;u.forEach(e=>{i&&e.removeEventListener(`scroll`,n),a&&e.removeEventListener(`resize`,n)}),d?.(),(e=p)==null||e.disconnect(),p=null,c&&cancelAnimationFrame(m)}}var ha=di,ga=fi,_a=ai,va=pi,ya=ci,ba=ii,xa=(e,t,n)=>{let r=new Map,i={platform:da,...n},a={...i.platform,_c:r};return ri(e,t,{...i,platform:a})},Sa=k();function Ca(){let e=O(Sa);if(e===void 0)throw Error("[kobalte]: `usePopperContext` must be used within a `Popper` component");return e}var wa=b(`<svg display="block" viewBox="0 0 30 30" style="transform:scale(1.02)"><g><path fill="none" d="M23,27.8c1.1,1.2,3.4,2.2,5,2.2h2H0h2c1.7,0,3.9-1,5-2.2l6.6-7.2c0.7-0.8,2-0.8,2.7,0L23,27.8L23,27.8z"></path><path stroke="none" d="M23,27.8c1.1,1.2,3.4,2.2,5,2.2h2H0h2c1.7,0,3.9-1,5-2.2l6.6-7.2c0.7-0.8,2-0.8,2.7,0L23,27.8L23,27.8z">`),Ta=30,Ea=Ta/2,Da={top:180,right:-90,bottom:0,left:90};function Oa(e){let t=Ca(),[n,r]=N(J({size:Ta},e),[`ref`,`style`,`size`]),i=()=>t.currentPlacement().split(`-`)[0],a=ka(t.contentRef),o=()=>a()?.getPropertyValue(`background-color`)||`none`,c=()=>a()?.getPropertyValue(`border-${i()}-color`)||`none`,l=()=>a()?.getPropertyValue(`border-${i()}-width`)||`0px`,u=()=>Number.parseInt(l())*2*(Ta/n.size),d=()=>`rotate(${Da[i()]} ${Ea} ${Ea}) translate(0 2)`;return j(Y,s({as:`div`,ref(e){let r=pt(t.setArrowRef,n.ref);typeof r==`function`&&r(e)},"aria-hidden":`true`,get style(){return Mt({position:`absolute`,"font-size":`${n.size}px`,width:`1em`,height:`1em`,"pointer-events":`none`,fill:o(),stroke:c(),"stroke-width":u()},n.style)}},r,{get children(){let e=wa(),t=e.firstChild;return L(()=>v(t,`transform`,d())),e}}))}function ka(e){let[t,n]=I();return C(()=>{let t=e();t&&n(Vt(t).getComputedStyle(t))}),t}function Aa(e){let t=Ca(),[n,r]=N(e,[`ref`,`style`]);return j(Y,s({as:`div`,ref(e){let r=pt(t.setPositionerRef,n.ref);typeof r==`function`&&r(e)},"data-popper-positioner":``,get style(){return Mt({position:`absolute`,top:0,left:0,"min-width":`max-content`},n.style)}},r))}function ja(e){let{x:t=0,y:n=0,width:r=0,height:i=0}=e??{};if(typeof DOMRect==`function`)return new DOMRect(t,n,r,i);let a={x:t,y:n,width:r,height:i,top:n,right:t+r,bottom:n+i,left:t};return{...a,toJSON:()=>a}}function Ma(e,t){return{contextElement:e,getBoundingClientRect:()=>{let n=t(e);return n?ja(n):e?e.getBoundingClientRect():ja()}}}function Na(e){return/^(?:top|bottom|left|right)(?:-(?:start|end))?$/.test(e)}var Pa={top:`bottom`,right:`left`,bottom:`top`,left:`right`};function Fa(e,t){let[n,r]=e.split(`-`),i=Pa[n];return r?n===`left`||n===`right`?`${i} ${r===`start`?`top`:`bottom`}`:r===`start`?`${i} ${t===`rtl`?`right`:`left`}`:`${i} ${t===`rtl`?`left`:`right`}`:`${i} center`}function Ia(e){let t=J({getAnchorRect:e=>e?.getBoundingClientRect(),placement:`bottom`,gutter:0,shift:0,flip:!0,slide:!0,overlap:!1,sameWidth:!1,fitViewport:!1,hideWhenDetached:!1,detachedPadding:0,arrowPadding:4,overflowPadding:8},e),[n,r]=I(),[i,a]=I(),[o,s]=I(t.placement),c=()=>Ma(t.anchorRef?.(),t.getAnchorRect),{direction:l}=Xn();async function u(){let e=c(),r=n(),a=i();if(!e||!r)return;let o=(a?.clientHeight||0)/2,u=typeof t.gutter==`number`?t.gutter+o:t.gutter??o;r.style.setProperty(`--kb-popper-content-overflow-padding`,`${t.overflowPadding}px`),e.getBoundingClientRect();let d=[ha(({placement:e})=>{let n=!!e.split(`-`)[1];return{mainAxis:u,crossAxis:n?void 0:t.shift,alignmentAxis:t.shift}})];if(t.flip!==!1){let e=typeof t.flip==`string`?t.flip.split(` `):void 0;if(e!==void 0&&!e.every(Na))throw Error("`flip` expects a spaced-delimited list of placements");d.push(_a({padding:t.overflowPadding,fallbackPlacements:e}))}(t.slide||t.overlap)&&d.push(ga({mainAxis:t.slide,crossAxis:t.overlap,padding:t.overflowPadding})),d.push(va({padding:t.overflowPadding,apply({availableWidth:e,availableHeight:n,rects:i}){let a=Math.round(i.reference.width);e=Math.floor(e),n=Math.floor(n),r.style.setProperty(`--kb-popper-anchor-width`,`${a}px`),r.style.setProperty(`--kb-popper-content-available-width`,`${e}px`),r.style.setProperty(`--kb-popper-content-available-height`,`${n}px`),t.sameWidth&&(r.style.width=`${a}px`),t.fitViewport&&(r.style.maxWidth=`${e}px`,r.style.maxHeight=`${n}px`)}})),t.hideWhenDetached&&d.push(ya({padding:t.detachedPadding})),a&&d.push(ba({element:a,padding:t.arrowPadding}));let f=await xa(e,r,{placement:t.placement,strategy:`absolute`,middleware:d,platform:{...da,isRTL:()=>l()===`rtl`}});if(s(f.placement),t.onCurrentPlacementChange?.(f.placement),!r)return;r.style.setProperty(`--kb-popper-content-transform-origin`,Fa(f.placement,l()));let p=Math.round(f.x),m=Math.round(f.y),h;if(t.hideWhenDetached&&(h=f.middlewareData.hide?.referenceHidden?`hidden`:`visible`),Object.assign(r.style,{top:`0`,left:`0`,transform:`translate3d(${p}px, ${m}px, 0)`,visibility:h}),a&&f.middlewareData.arrow){let{x:e,y:t}=f.middlewareData.arrow,n=f.placement.split(`-`)[0];Object.assign(a.style,{left:e==null?``:`${e}px`,top:t==null?``:`${t}px`,[n]:`100%`})}}C(()=>{let e=c(),t=n();!e||!t||R(ma(e,t,u,{elementResize:typeof ResizeObserver==`function`}))}),C(()=>{let e=n(),r=t.contentRef?.();!e||!r||queueMicrotask(()=>{e.style.zIndex=getComputedStyle(r).zIndex})});let d={currentPlacement:o,contentRef:()=>t.contentRef?.(),setPositionerRef:r,setArrowRef:a};return j(Sa.Provider,{value:d,get children(){return t.children}})}var La=Object.assign(Ia,{Arrow:Oa,Context:Sa,usePopperContext:Ca,Positioner:Aa}),Ra=`data-kb-top-layer`,za,Ba=!1,Va=[];function Ha(e){return Va.findIndex(t=>t.node===e)}function Ua(e){return Va[Ha(e)]}function Wa(e){return Va[Va.length-1].node===e}function Ga(){return Va.filter(e=>e.isPointerBlocking)}function Ka(){return[...Ga()].slice(-1)[0]}function qa(){return Ga().length>0}function Ja(e){let t=Ha(Ka()?.node);return Ha(e)<t}function Ya(e){Va.push(e)}function Xa(e){let t=Ha(e);t<0||Va.splice(t,1)}function Za(){for(let{node:e}of Va)e.style.pointerEvents=Ja(e)?`none`:`auto`}function Qa(e){if(qa()&&!Ba){let t=Ht(e);za=document.body.style.pointerEvents,t.body.style.pointerEvents=`none`,Ba=!0}}function $a(e){if(qa())return;let t=Ht(e);t.body.style.pointerEvents=za,t.body.style.length===0&&t.body.removeAttribute(`style`),Ba=!1}var eo={layers:Va,isTopMostLayer:Wa,hasPointerBlockingLayer:qa,isBelowPointerBlockingLayer:Ja,addLayer:Ya,removeLayer:Xa,indexOf:Ha,find:Ua,assignPointerEventToLayers:Za,disableBodyPointerEvents:Qa,restoreBodyPointerEvents:$a},to=`interactOutside.pointerDownOutside`,no=`interactOutside.focusOutside`;function ro(e,t){let n,r=_n,i=()=>Ht(t()),a=t=>e.onPointerDownOutside?.(t),o=t=>e.onFocusOutside?.(t),s=t=>e.onInteractOutside?.(t),c=n=>{let r=n.target;return!(r instanceof Element)||r.closest(`[${Ra}]`)||!zt(i(),r)||zt(t(),r)?!1:!e.shouldExcludeElement?.(r)},l=e=>{function n(){let n=t(),r=e.target;if(!n||!r||!c(e))return;let i=K([a,s]);r.addEventListener(to,i,{once:!0});let o=new CustomEvent(to,{bubbles:!1,cancelable:!0,detail:{originalEvent:e,isContextMenu:e.button===2||Zt(e)&&e.button===0}});r.dispatchEvent(o)}e.pointerType===`touch`?(i().removeEventListener(`click`,n),r=n,i().addEventListener(`click`,n,{once:!0})):n()},u=e=>{let n=t(),r=e.target;if(!n||!r||!c(e))return;let i=K([o,s]);r.addEventListener(no,i,{once:!0});let a=new CustomEvent(no,{bubbles:!1,cancelable:!0,detail:{originalEvent:e,isContextMenu:!1}});r.dispatchEvent(a)};C(()=>{z(e.isDisabled)||(n=window.setTimeout(()=>{i().addEventListener(`pointerdown`,l,!0)},0),i().addEventListener(`focusin`,u,!0),R(()=>{window.clearTimeout(n),i().removeEventListener(`click`,r),i().removeEventListener(`pointerdown`,l,!0),i().removeEventListener(`focusin`,u,!0)}))})}function io(e){let t=t=>{t.key===Wt.Escape&&e.onEscapeKeyDown?.(t)};C(()=>{if(z(e.isDisabled))return;let n=e.ownerDocument?.()??Ht();n.addEventListener(`keydown`,t),R(()=>{n.removeEventListener(`keydown`,t)})})}var ao=k();function oo(){return O(ao)}function so(e){let t,r=oo(),[i,a]=N(e,[`ref`,`disableOutsidePointerEvents`,`excludedElements`,`onEscapeKeyDown`,`onPointerDownOutside`,`onFocusOutside`,`onInteractOutside`,`onDismiss`,`bypassTopMostLayerCheck`]),o=new Set([]),c=e=>{o.add(e);let t=r?.registerNestedLayer(e);return()=>{o.delete(e),t?.()}};ro({shouldExcludeElement:e=>t?i.excludedElements?.some(t=>zt(t(),e))||[...o].some(t=>zt(t,e)):!1,onPointerDownOutside:e=>{!t||eo.isBelowPointerBlockingLayer(t)||!i.bypassTopMostLayerCheck&&!eo.isTopMostLayer(t)||(i.onPointerDownOutside?.(e),i.onInteractOutside?.(e),e.defaultPrevented||i.onDismiss?.())},onFocusOutside:e=>{i.onFocusOutside?.(e),i.onInteractOutside?.(e),e.defaultPrevented||i.onDismiss?.()}},()=>t),io({ownerDocument:()=>Ht(t),onEscapeKeyDown:e=>{!t||!eo.isTopMostLayer(t)||(i.onEscapeKeyDown?.(e),!e.defaultPrevented&&i.onDismiss&&(e.preventDefault(),i.onDismiss()))}}),n(()=>{if(!t)return;eo.addLayer({node:t,isPointerBlocking:i.disableOutsidePointerEvents,dismiss:i.onDismiss});let e=r?.registerNestedLayer(t);eo.assignPointerEventToLayers(),eo.disableBodyPointerEvents(t),R(()=>{t&&(eo.removeLayer(t),e?.(),eo.assignPointerEventToLayers(),eo.restoreBodyPointerEvents(t))})}),C(h([()=>t,()=>i.disableOutsidePointerEvents],([e,t])=>{if(!e)return;let n=eo.find(e);n&&n.isPointerBlocking!==t&&(n.isPointerBlocking=t,eo.assignPointerEventToLayers()),t&&eo.disableBodyPointerEvents(e),R(()=>{eo.restoreBodyPointerEvents(e)})},{defer:!0}));let l={registerNestedLayer:c};return j(ao.Provider,{value:l,get children(){return j(Y,s({as:`div`,ref(e){let n=pt(e=>t=e,i.ref);typeof n==`function`&&n(e)}},a))}})}function co(e={}){let[t,n]=Fn({value:()=>z(e.open),defaultValue:()=>!!z(e.defaultOpen),onChange:t=>e.onOpenChange?.(t)}),r=()=>{n(!0)},i=()=>{n(!1)};return{isOpen:t,setIsOpen:n,open:r,close:i,toggle:()=>{t()?i():r()}}}function lo(e){return t=>(e(t),()=>e(void 0))}var X=e=>typeof e==`function`?e():e,uo=e=>{let t=F(()=>{let t=X(e.element);if(t)return getComputedStyle(t)}),n=()=>t()?.animationName??`none`,[r,i]=I(X(e.show)?`present`:`hidden`),a=`none`;return C(r=>{let o=X(e.show);return S(()=>{if(r===o)return o;let e=a,s=n();o?i(`present`):s===`none`||t()?.display===`none`?i(`hidden`):i(r===!0&&e!==s?`hiding`:`hidden`)}),o}),C(()=>{let t=X(e.element);if(!t)return;let o=e=>{e.target===t&&(a=n())},s=e=>{let a=n().includes(e.animationName);e.target===t&&a&&r()===`hiding`&&i(`hidden`)};t.addEventListener(`animationstart`,o),t.addEventListener(`animationcancel`,s),t.addEventListener(`animationend`,s),R(()=>{t.removeEventListener(`animationstart`,o),t.removeEventListener(`animationcancel`,s),t.removeEventListener(`animationend`,s)})}),{present:()=>r()===`present`||r()===`hiding`,state:r,setState:i}},fo=[`id`,`name`,`validationState`,`required`,`disabled`,`readOnly`];function po(e){let t=J({id:`form-control-${g()}`},e),[n,r]=I(),[i,a]=I(),[o,s]=I(),[c,l]=I();return{formControlContext:{name:()=>z(t.name)??z(t.id),dataset:F(()=>({"data-valid":z(t.validationState)===`valid`?``:void 0,"data-invalid":z(t.validationState)===`invalid`?``:void 0,"data-required":z(t.required)?``:void 0,"data-disabled":z(t.disabled)?``:void 0,"data-readonly":z(t.readOnly)?``:void 0})),validationState:()=>z(t.validationState),isRequired:()=>z(t.required),isDisabled:()=>z(t.disabled),isReadOnly:()=>z(t.readOnly),labelId:n,fieldId:i,descriptionId:o,errorMessageId:c,getAriaLabelledBy:(e,t,r)=>{let i=r!=null||n()!=null;return[r,n(),i&&t!=null?e:void 0].filter(Boolean).join(` `)||void 0},getAriaDescribedBy:e=>[o(),c(),e].filter(Boolean).join(` `)||void 0,generateId:Rt(()=>z(t.id)),registerLabel:lo(r),registerField:lo(a),registerDescription:lo(s),registerErrorMessage:lo(l)}}}var mo=k();function ho(){let e=O(mo);if(e===void 0)throw Error("[kobalte]: `useFormControlContext` must be used within a `FormControlContext.Provider` component");return e}function go(e){let t=ho(),n=J({id:t.generateId(`description`)},e);return C(()=>R(t.registerDescription(n.id))),j(Y,s({as:`div`},()=>t.dataset(),n))}function _o(e){let t,n=ho(),[r,i]=N(J({id:n.generateId(`label`)},e),[`ref`]),o=En(()=>t,()=>`label`);return C(()=>R(n.registerLabel(i.id))),j(Y,s({as:`label`,ref(e){let n=pt(e=>t=e,r.ref);typeof n==`function`&&n(e)},get for(){return a(()=>o()===`label`)()?n.fieldId():void 0}},()=>n.dataset(),i))}function vo(e,t){C(h(e,e=>{if(e==null)return;let n=yo(e);n!=null&&(n.addEventListener(`reset`,t,{passive:!0}),R(()=>{n.removeEventListener(`reset`,t)}))}))}function yo(e){return bo(e)?e.form:e.closest(`form`)}function bo(e){return e.matches(`textarea, input, select, button`)}function xo(e){let t=ho(),[n,r]=N(J({id:t.generateId(`error-message`)},e),[`forceMount`]),i=()=>t.validationState()===`invalid`;return C(()=>{i()&&R(t.registerErrorMessage(r.id))}),j(P,{get when(){return n.forceMount||i()},get children(){return j(Y,s({as:`div`},()=>t.dataset(),r))}})}var So=`focusScope.autoFocusOnMount`,Co=`focusScope.autoFocusOnUnmount`,wo={bubbles:!1,cancelable:!0},To={stack:[],active(){return this.stack[0]},add(e){e!==this.active()&&this.active()?.pause(),this.stack=Pt(this.stack,e),this.stack.unshift(e)},remove(e){this.stack=Pt(this.stack,e),this.active()?.resume()}};function Eo(e,t){let[n,r]=I(!1),i={pause(){r(!0)},resume(){r(!1)}},a=null,o=t=>e.onMountAutoFocus?.(t),s=t=>e.onUnmountAutoFocus?.(t),c=()=>Ht(t()),l=()=>{let e=c().createElement(`span`);return e.setAttribute(`data-focus-trap`,``),e.tabIndex=0,Object.assign(e.style,Tn),e},u=()=>{let e=t();return e?sn(e,!0).filter(e=>!e.hasAttribute(`data-focus-trap`)):[]},d=()=>{let e=u();return e.length>0?e[0]:null},f=()=>{let e=u();return e.length>0?e[e.length-1]:null},p=()=>{let e=t();if(!e)return!1;let n=Bt(e);return!n||zt(e,n)?!1:ln(n)};C(()=>{let e=t();if(!e)return;To.add(i);let n=Bt(e);if(!zt(e,n)){let t=new CustomEvent(So,wo);e.addEventListener(So,o),e.dispatchEvent(t),t.defaultPrevented||setTimeout(()=>{q(d()),Bt(e)===n&&q(e)},0)}R(()=>{e.removeEventListener(So,o),setTimeout(()=>{let t=new CustomEvent(Co,wo);p()&&t.preventDefault(),e.addEventListener(Co,s),e.dispatchEvent(t),t.defaultPrevented||q(n??c().body),e.removeEventListener(Co,s),To.remove(i)},0)})}),C(()=>{let r=t();if(!r||!z(e.trapFocus)||n())return;let i=e=>{let t=e.target;t?.closest(`[${Ra}]`)||(zt(r,t)?a=t:q(a))},o=e=>{let t=e.relatedTarget??Bt(r);t?.closest(`[${Ra}]`)||zt(r,t)||q(a)};c().addEventListener(`focusin`,i),c().addEventListener(`focusout`,o),R(()=>{c().removeEventListener(`focusin`,i),c().removeEventListener(`focusout`,o)})}),C(()=>{let r=t();if(!r||!z(e.trapFocus)||n())return;let i=l();r.insertAdjacentElement(`afterbegin`,i);let a=l();r.insertAdjacentElement(`beforeend`,a);function o(e){let t=d(),n=f();e.relatedTarget===t?q(n):q(t)}i.addEventListener(`focusin`,o),a.addEventListener(`focusin`,o);let s=new MutationObserver(e=>{for(let t of e)t.previousSibling===a&&(a.remove(),r.insertAdjacentElement(`beforeend`,a)),t.nextSibling===i&&(i.remove(),r.insertAdjacentElement(`afterbegin`,i))});s.observe(r,{childList:!0,subtree:!1}),R(()=>{i.removeEventListener(`focusin`,o),a.removeEventListener(`focusin`,o),i.remove(),a.remove(),s.disconnect()})})}var Do=`data-live-announcer`;function Oo(e){C(()=>{z(e.isDisabled)||R(jo(z(e.targets),z(e.root)))})}var ko=new WeakMap,Ao=[];function jo(e,t=document.body){let n=new Set(e),r=new Set,i=e=>{for(let t of e.querySelectorAll(`[${Do}], [${Ra}]`))n.add(t);let t=e=>{if(n.has(e)||e.parentElement&&r.has(e.parentElement)&&e.parentElement.getAttribute(`role`)!==`row`)return NodeFilter.FILTER_REJECT;for(let t of n)if(e.contains(t))return NodeFilter.FILTER_SKIP;return NodeFilter.FILTER_ACCEPT},i=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode:t}),o=t(e);if(o===NodeFilter.FILTER_ACCEPT&&a(e),o!==NodeFilter.FILTER_REJECT){let e=i.nextNode();for(;e!=null;)a(e),e=i.nextNode()}},a=e=>{let t=ko.get(e)??0;e.getAttribute(`aria-hidden`)===`true`&&t===0||(t===0&&e.setAttribute(`aria-hidden`,`true`),r.add(e),ko.set(e,t+1))};Ao.length&&Ao[Ao.length-1].disconnect(),i(t);let o=new MutationObserver(e=>{for(let t of e)if(!(t.type!==`childList`||t.addedNodes.length===0)&&![...n,...r].some(e=>e.contains(t.target))){for(let e of t.removedNodes)e instanceof Element&&(n.delete(e),r.delete(e));for(let e of t.addedNodes)(e instanceof HTMLElement||e instanceof SVGElement)&&(e.dataset.liveAnnouncer===`true`||e.dataset.reactAriaTopLayer===`true`)?n.add(e):e instanceof Element&&i(e)}});o.observe(t,{childList:!0,subtree:!0});let s={observe(){o.observe(t,{childList:!0,subtree:!0})},disconnect(){o.disconnect()}};return Ao.push(s),()=>{o.disconnect();for(let e of r){let t=ko.get(e);if(t==null)return;t===1?(e.removeAttribute(`aria-hidden`),ko.delete(e)):ko.set(e,t-1)}s===Ao[Ao.length-1]?(Ao.pop(),Ao.length&&Ao[Ao.length-1].observe()):Ao.splice(Ao.indexOf(s),1)}}var Mo=(e,t)=>{if(e.contains(t))return!0;let n=t;for(;n;){if(n===e)return!0;n=n._$host??n.parentElement}return!1},No=new Map,Po=e=>{C(()=>{let t=X(e.style)??{},n=X(e.properties)??[],r={};for(let n in t)r[n]=e.element.style[n];let i=No.get(e.key);i?i.activeCount++:No.set(e.key,{activeCount:1,originalStyles:r,properties:n.map(e=>e.key)}),Object.assign(e.element.style,e.style);for(let t of n)e.element.style.setProperty(t.key,t.value);R(()=>{let t=No.get(e.key);if(t){if(t.activeCount!==1){t.activeCount--;return}No.delete(e.key);for(let[n,r]of Object.entries(t.originalStyles))e.element.style[n]=r;for(let n of t.properties)e.element.style.removeProperty(n);e.element.style.length===0&&e.element.removeAttribute(`style`),e.cleanup?.()}})})},Fo=(e,t)=>{switch(t){case`x`:return[e.clientWidth,e.scrollLeft,e.scrollWidth];case`y`:return[e.clientHeight,e.scrollTop,e.scrollHeight]}},Io=(e,t)=>{let n=getComputedStyle(e),r=t===`x`?n.overflowX:n.overflowY;return r===`auto`||r===`scroll`||e.tagName===`HTML`&&r===`visible`},Lo=(e,t,n)=>{let r=t===`x`&&window.getComputedStyle(e).direction===`rtl`?-1:1,i=e,a=0,o=0,s=!1;do{let[e,c,l]=Fo(i,t),u=l-e-r*c;(c!==0||u!==0)&&Io(i,t)&&(a+=u,o+=c),i===(n??document.documentElement)?s=!0:i=i._$host??i.parentElement}while(i&&!s);return[a,o]},[Ro,zo]=I([]),Bo=e=>Ro().indexOf(e)===Ro().length-1,Vo=e=>{let t=s({element:null,enabled:!0,hideScrollbar:!0,preventScrollbarShift:!0,preventScrollbarShiftMode:`padding`,restoreScrollPosition:!0,allowPinchZoom:!1},e),n=g(),r=[0,0],i=null,a=null;C(()=>{X(t.enabled)&&(zo(e=>[...e,n]),R(()=>{zo(e=>e.filter(e=>e!==n))}))}),C(()=>{if(!X(t.enabled)||!X(t.hideScrollbar))return;let{body:e}=document,n=window.innerWidth-e.offsetWidth;if(X(t.preventScrollbarShift)){let r={overflow:`hidden`},i=[];n>0&&(X(t.preventScrollbarShiftMode)===`padding`?r.paddingRight=`calc(${window.getComputedStyle(e).paddingRight} + ${n}px)`:r.marginRight=`calc(${window.getComputedStyle(e).marginRight} + ${n}px)`,i.push({key:`--scrollbar-width`,value:`${n}px`}));let a=window.scrollY,o=window.scrollX;Po({key:`prevent-scroll`,element:e,style:r,properties:i,cleanup:()=>{X(t.restoreScrollPosition)&&n>0&&window.scrollTo(o,a)}})}else Po({key:`prevent-scroll`,element:e,style:{overflow:`hidden`}})}),C(()=>{!Bo(n)||!X(t.enabled)||(document.addEventListener(`wheel`,c,{passive:!1}),document.addEventListener(`touchstart`,o,{passive:!1}),document.addEventListener(`touchmove`,l,{passive:!1}),R(()=>{document.removeEventListener(`wheel`,c),document.removeEventListener(`touchstart`,o),document.removeEventListener(`touchmove`,l)}))});let o=e=>{r=Uo(e),i=null,a=null},c=e=>{let n=e.target,r=X(t.element),i=Ho(e),a=Math.abs(i[0])>Math.abs(i[1])?`x`:`y`,o=Wo(n,a,a===`x`?i[0]:i[1],r),s;s=r&&Mo(r,n)?!o:!0,s&&e.cancelable&&e.preventDefault()},l=e=>{let n=X(t.element),o=e.target,s;if(e.touches.length===2)s=!X(t.allowPinchZoom);else{if(i==null||a===null){let t=Uo(e).map((e,t)=>r[t]-e),n=Math.abs(t[0])>Math.abs(t[1])?`x`:`y`;i=n,a=n===`x`?t[0]:t[1]}if(o.type===`range`)s=!1;else{let e=Wo(o,i,a,n);s=n&&Mo(n,o)?!e:!0}}s&&e.cancelable&&e.preventDefault()}},Ho=e=>[e.deltaX,e.deltaY],Uo=e=>e.changedTouches[0]?[e.changedTouches[0].clientX,e.changedTouches[0].clientY]:[0,0],Wo=(e,t,n,r)=>{let[i,a]=Lo(e,t,r!==null&&Mo(r,e)?r:void 0);return!(n>0&&Math.abs(i)<=1||n<0&&Math.abs(a)<1)},Go=Vo,Ko={};kn(Ko,{Description:()=>go,ErrorMessage:()=>xo,Item:()=>Zo,ItemControl:()=>Qo,ItemDescription:()=>$o,ItemIndicator:()=>es,ItemInput:()=>ts,ItemLabel:()=>ns,Label:()=>rs,RadioGroup:()=>as,Root:()=>is,useRadioGroupContext:()=>Jo});var qo=k();function Jo(){let e=O(qo);if(e===void 0)throw Error("[kobalte]: `useRadioGroupContext` must be used within a `RadioGroup` component");return e}var Yo=k();function Xo(){let e=O(Yo);if(e===void 0)throw Error("[kobalte]: `useRadioGroupItemContext` must be used within a `RadioGroup.Item` component");return e}function Zo(e){let t=ho(),n=Jo(),[r,i]=N(J({id:`${t.generateId(`item`)}-${g()}`},e),[`value`,`disabled`,`onPointerDown`]),[a,o]=I(),[c,l]=I(),[u,d]=I(),[f,p]=I(),[m,h]=I(!1),_=F(()=>n.isDefaultValue(r.value)),v=F(()=>n.isSelectedValue(r.value)),y=F(()=>r.disabled||t.isDisabled()||!1),b=e=>{G(e,r.onPointerDown),m()&&e.preventDefault()},x=F(()=>({...t.dataset(),"data-disabled":y()?``:void 0,"data-checked":v()?``:void 0})),S={value:()=>r.value,dataset:x,isDefault:_,isSelected:v,isDisabled:y,inputId:a,labelId:c,descriptionId:u,inputRef:f,select:()=>n.setSelectedValue(r.value),generateId:Rt(()=>i.id),registerInput:lo(o),registerLabel:lo(l),registerDescription:lo(d),setIsFocused:h,setInputRef:p};return j(Yo.Provider,{value:S,get children(){return j(Y,s({as:`div`,role:`group`,onPointerDown:b},x,i))}})}function Qo(e){let t=Xo(),[n,r]=N(J({id:t.generateId(`control`)},e),[`onClick`,`onKeyDown`]);return j(Y,s({as:`div`,onClick:e=>{G(e,n.onClick),t.select(),t.inputRef()?.focus()},onKeyDown:e=>{G(e,n.onKeyDown),e.key===Wt.Space&&(t.select(),t.inputRef()?.focus())}},()=>t.dataset(),r))}function $o(e){let t=Xo(),n=J({id:t.generateId(`description`)},e);return C(()=>R(t.registerDescription(n.id))),j(Y,s({as:`div`},()=>t.dataset(),n))}function es(e){let t=Xo(),[n,r]=N(J({id:t.generateId(`indicator`)},e),[`ref`,`forceMount`]),[i,a]=I(),{present:o}=uo({show:()=>n.forceMount||t.isSelected(),element:()=>i()??null});return j(P,{get when(){return o()},get children(){return j(Y,s({as:`div`,ref(e){let t=pt(a,n.ref);typeof t==`function`&&t(e)}},()=>t.dataset(),r))}})}function ts(e){let t=ho(),n=Jo(),r=Xo(),[i,a]=N(J({id:r.generateId(`input`)},e),[`ref`,`style`,`aria-labelledby`,`aria-describedby`,`onChange`,`onFocus`,`onBlur`]),o=()=>[i[`aria-labelledby`],r.labelId(),i[`aria-labelledby`]!=null&&a[`aria-label`]!=null?a.id:void 0].filter(Boolean).join(` `)||void 0,c=()=>[i[`aria-describedby`],r.descriptionId(),n.ariaDescribedBy()].filter(Boolean).join(` `)||void 0,[l,u]=I(!1);return C(h([()=>r.isSelected(),()=>r.value()],e=>{if(!e[0]&&e[1]===r.value())return;u(!0);let t=r.inputRef();t?.dispatchEvent(new Event(`input`,{bubbles:!0,cancelable:!0})),t?.dispatchEvent(new Event(`change`,{bubbles:!0,cancelable:!0}))},{defer:!0})),C(()=>R(r.registerInput(a.id))),j(Y,s({as:`input`,ref(e){let t=pt(r.setInputRef,i.ref);typeof t==`function`&&t(e)},type:`radio`,get name(){return t.name()},get value(){return r.value()},get checked(){return r.isSelected()},get required(){return t.isRequired()},get disabled(){return r.isDisabled()},get readonly(){return t.isReadOnly()},get style(){return Mt({...Tn},i.style)},get"aria-labelledby"(){return o()},get"aria-describedby"(){return c()},onChange:e=>{if(G(e,i.onChange),e.stopPropagation(),!l()){n.setSelectedValue(r.value());let t=e.target;t.checked=r.isSelected()}u(!1)},onFocus:e=>{G(e,i.onFocus),r.setIsFocused(!0)},onBlur:e=>{G(e,i.onBlur),r.setIsFocused(!1)}},()=>r.dataset(),a))}function ns(e){let t=Xo(),n=J({id:t.generateId(`label`)},e);return C(()=>R(t.registerLabel(n.id))),j(Y,s({as:`label`,get for(){return t.inputId()}},()=>t.dataset(),n))}function rs(e){return j(_o,s({as:`span`},e))}function is(e){let t,[n,r,i]=N(J({id:`radiogroup-${g()}`,orientation:`vertical`},e),[`ref`,`value`,`defaultValue`,`onChange`,`orientation`,`aria-labelledby`,`aria-describedby`],fo),[a,o]=Pn({value:()=>n.value,defaultValue:()=>n.defaultValue,onChange:e=>n.onChange?.(e)}),{formControlContext:c}=po(r);vo(()=>t,()=>o(n.defaultValue??``));let l=()=>c.getAriaLabelledBy(z(r.id),i[`aria-label`],n[`aria-labelledby`]),u=()=>c.getAriaDescribedBy(n[`aria-describedby`]),d=t=>t===e.defaultValue,f=e=>e===a(),p={ariaDescribedBy:u,isDefaultValue:d,isSelectedValue:f,setSelectedValue:e=>{if(!(c.isReadOnly()||c.isDisabled())&&(o(e),t))for(let e of t.querySelectorAll(`[type='radio']`)){let t=e;t.checked=f(t.value)}}};return j(mo.Provider,{value:c,get children(){return j(qo.Provider,{value:p,get children(){return j(Y,s({as:`div`,ref(e){let r=pt(e=>t=e,n.ref);typeof r==`function`&&r(e)},role:`radiogroup`,get id(){return z(r.id)},get"aria-invalid"(){return c.validationState()===`invalid`||void 0},get"aria-required"(){return c.isRequired()||void 0},get"aria-disabled"(){return c.isDisabled()||void 0},get"aria-readonly"(){return c.isReadOnly()||void 0},get"aria-orientation"(){return n.orientation},get"aria-labelledby"(){return l()},get"aria-describedby"(){return u()}},()=>c.dataset(),i))}})}})}var as=Object.assign(is,{Description:go,ErrorMessage:xo,Item:Zo,ItemControl:Qo,ItemDescription:$o,ItemIndicator:es,ItemInput:ts,ItemLabel:ns,Label:rs}),os=class{collection;ref;collator;constructor(e,t,n){this.collection=e,this.ref=t,this.collator=n}getKeyBelow(e){let t=this.collection().getKeyAfter(e);for(;t!=null;){let e=this.collection().getItem(t);if(e&&e.type===`item`&&!e.disabled)return t;t=this.collection().getKeyAfter(t)}}getKeyAbove(e){let t=this.collection().getKeyBefore(e);for(;t!=null;){let e=this.collection().getItem(t);if(e&&e.type===`item`&&!e.disabled)return t;t=this.collection().getKeyBefore(t)}}getFirstKey(){let e=this.collection().getFirstKey();for(;e!=null;){let t=this.collection().getItem(e);if(t&&t.type===`item`&&!t.disabled)return e;e=this.collection().getKeyAfter(e)}}getLastKey(){let e=this.collection().getLastKey();for(;e!=null;){let t=this.collection().getItem(e);if(t&&t.type===`item`&&!t.disabled)return e;e=this.collection().getKeyBefore(e)}}getItem(e){return this.ref?.()?.querySelector(`[data-key="${e}"]`)??null}getKeyPageAbove(e){let t=this.ref?.(),n=this.getItem(e);if(!t||!n)return;let r=Math.max(0,n.offsetTop+n.offsetHeight-t.offsetHeight),i=e;for(;i&&n&&n.offsetTop>r;)i=this.getKeyAbove(i),n=i==null?null:this.getItem(i);return i}getKeyPageBelow(e){let t=this.ref?.(),n=this.getItem(e);if(!t||!n)return;let r=Math.min(t.scrollHeight,n.offsetTop-n.offsetHeight+t.offsetHeight),i=e;for(;i&&n&&n.offsetTop<r;)i=this.getKeyBelow(i),n=i==null?null:this.getItem(i);return i}getKeyForSearch(e,t){let n=this.collator?.();if(!n)return;let r=t==null?this.getFirstKey():this.getKeyBelow(t);for(;r!=null;){let t=this.collection().getItem(r);if(t){let i=t.textValue.slice(0,e.length);if(t.textValue&&n.compare(i,e)===0)return r}r=this.getKeyBelow(r)}}};function ss(e,t,n){let r=Qn({usage:`search`,sensitivity:`base`});return lr({selectionManager:()=>z(e.selectionManager),keyboardDelegate:F(()=>z(e.keyboardDelegate)||new os(e.collection,t,r)),autoFocus:()=>z(e.autoFocus),deferAutoFocus:()=>z(e.deferAutoFocus),shouldFocusWrap:()=>z(e.shouldFocusWrap),disallowEmptySelection:()=>z(e.disallowEmptySelection),selectOnFocus:()=>z(e.selectOnFocus),disallowTypeAhead:()=>z(e.disallowTypeAhead),shouldUseVirtualFocus:()=>z(e.shouldUseVirtualFocus),allowsTabNavigation:()=>z(e.allowsTabNavigation),isVirtualized:()=>z(e.isVirtualized),scrollToKey:t=>z(e.scrollToKey)?.(t),orientation:()=>z(e.orientation)},t)}var cs=k();function ls(){return O(cs)}var us=k();function ds(){return O(us)}var fs=k();function ps(){return O(fs)}function ms(){let e=ps();if(e===void 0)throw Error("[kobalte]: `useMenuContext` must be used within a `Menu` component");return e}var hs=k();function gs(){let e=O(hs);if(e===void 0)throw Error("[kobalte]: `useMenuItemContext` must be used within a `Menu.Item` component");return e}var _s=k();function vs(){let e=O(_s);if(e===void 0)throw Error("[kobalte]: `useMenuRootContext` must be used within a `MenuRoot` component");return e}function ys(e){let t,n=vs(),r=ms(),[i,a]=N(J({id:n.generateId(`item-${g()}`)},e),[`ref`,`textValue`,`disabled`,`closeOnSelect`,`checked`,`indeterminate`,`onSelect`,`onPointerMove`,`onPointerLeave`,`onPointerDown`,`onPointerUp`,`onClick`,`onKeyDown`,`onMouseDown`,`onFocus`]),[o,c]=I(),[l,u]=I(),[d,f]=I(),p=()=>r.listState().selectionManager(),m=()=>a.id,h=()=>p().focusedKey()===m(),_=()=>{i.onSelect?.(),i.closeOnSelect&&setTimeout(()=>{r.close(!0)})};Tr({getItem:()=>({ref:()=>t,type:`item`,key:m(),textValue:i.textValue??d()?.textContent??t?.textContent??``,disabled:i.disabled??!1})});let v=ur({key:m,selectionManager:p,shouldSelectOnPressUp:!0,allowsDifferentPressOrigin:!0,disabled:()=>i.disabled},()=>t),y=e=>{G(e,i.onPointerMove),e.pointerType===`mouse`&&(i.disabled?r.onItemLeave(e):(r.onItemEnter(e),e.defaultPrevented||(q(e.currentTarget),r.listState().selectionManager().setFocused(!0),r.listState().selectionManager().setFocusedKey(m()))))},b=e=>{G(e,i.onPointerLeave),e.pointerType===`mouse`&&r.onItemLeave(e)},x=e=>{G(e,i.onPointerUp),!i.disabled&&e.button===0&&_()},S=e=>{if(G(e,i.onKeyDown),!e.repeat&&!i.disabled)switch(e.key){case`Enter`:case` `:_();break}},C=F(()=>{if(i.indeterminate)return`mixed`;if(i.checked!=null)return i.checked}),w=F(()=>({"data-indeterminate":i.indeterminate?``:void 0,"data-checked":i.checked&&!i.indeterminate?``:void 0,"data-disabled":i.disabled?``:void 0,"data-highlighted":h()?``:void 0})),T={isChecked:()=>i.checked,dataset:w,setLabelRef:f,generateId:Rt(()=>a.id),registerLabel:lo(c),registerDescription:lo(u)};return j(hs.Provider,{value:T,get children(){return j(Y,s({as:`div`,ref(e){let n=pt(e=>t=e,i.ref);typeof n==`function`&&n(e)},get tabIndex(){return v.tabIndex()},get"aria-checked"(){return C()},get"aria-disabled"(){return i.disabled},get"aria-labelledby"(){return o()},get"aria-describedby"(){return l()},get"data-key"(){return v.dataKey()},get onPointerDown(){return K([i.onPointerDown,v.onPointerDown])},get onPointerUp(){return K([x,v.onPointerUp])},get onClick(){return K([i.onClick,v.onClick])},get onKeyDown(){return K([S,v.onKeyDown])},get onMouseDown(){return K([i.onMouseDown,v.onMouseDown])},get onFocus(){return K([i.onFocus,v.onFocus])},onPointerMove:y,onPointerLeave:b},w,a))}})}function bs(e){let[t,n]=N(J({closeOnSelect:!1},e),[`checked`,`defaultChecked`,`onChange`,`onSelect`]),r=Ln({isSelected:()=>t.checked,defaultIsSelected:()=>t.defaultChecked,onSelectedChange:e=>t.onChange?.(e),isDisabled:()=>n.disabled});return j(ys,s({role:`menuitemcheckbox`,get checked(){return r.isSelected()},onSelect:()=>{t.onSelect?.(),r.toggle()}},n))}var xs={next:(e,t)=>e===`ltr`?t===`horizontal`?`ArrowRight`:`ArrowDown`:t===`horizontal`?`ArrowLeft`:`ArrowUp`,previous:(e,t)=>xs.next(e===`ltr`?`rtl`:`ltr`,t)},Ss={first:e=>e===`horizontal`?`ArrowDown`:`ArrowRight`,last:e=>e===`horizontal`?`ArrowUp`:`ArrowLeft`};function Cs(e){let t=vs(),n=ms(),r=ls(),{direction:i}=Xn(),[o,c]=N(J({id:t.generateId(`trigger`)},e),[`ref`,`id`,`disabled`,`onPointerDown`,`onClick`,`onKeyDown`,`onMouseOver`,`onFocus`]),l=()=>t.value();r!==void 0&&(l=()=>t.value()??o.id,r.lastValue()===void 0&&r.setLastValue(l));let u=En(()=>n.triggerRef(),()=>`button`),d=F(()=>u()===`a`&&n.triggerRef()?.getAttribute(`href`)!=null);C(h(()=>r?.value(),e=>{d()&&e===l()&&n.triggerRef()?.focus()}));let f=()=>{r===void 0?n.toggle(!0):n.isOpen()?r.value()===l()&&r.closeMenu():(r.autoFocusMenu()||r.setAutoFocusMenu(!0),n.open(!1))};return C(()=>R(n.registerTriggerId(o.id))),j(Mn,s({ref(e){let t=pt(n.setTriggerRef,o.ref);typeof t==`function`&&t(e)},get"data-kb-menu-value-trigger"(){return t.value()},get id(){return o.id},get disabled(){return o.disabled},"aria-haspopup":`true`,get"aria-expanded"(){return n.isOpen()},get"aria-controls"(){return a(()=>!!n.isOpen())()?n.contentId():void 0},get"data-highlighted"(){return l()!==void 0&&r?.value()===l()||void 0},get tabIndex(){return r===void 0?void 0:r.value()===l()||r.lastValue()===l()?0:-1},onPointerDown:e=>{G(e,o.onPointerDown),e.currentTarget.dataset.pointerType=e.pointerType,!o.disabled&&e.pointerType!==`touch`&&e.button===0&&f()},onMouseOver:e=>{G(e,o.onMouseOver),n.triggerRef()?.dataset.pointerType!==`touch`&&!o.disabled&&r!==void 0&&r.value()!==void 0&&r.setValue(l)},onClick:e=>{G(e,o.onClick),o.disabled||e.currentTarget.dataset.pointerType===`touch`&&f()},onKeyDown:e=>{if(G(e,o.onKeyDown),!o.disabled){if(d())switch(e.key){case`Enter`:case` `:return}switch(e.key){case`Enter`:case` `:case Ss.first(t.orientation()):e.stopPropagation(),e.preventDefault(),wn(e.currentTarget),n.open(`first`),r?.setAutoFocusMenu(!0),r?.setValue(l);break;case Ss.last(t.orientation()):e.stopPropagation(),e.preventDefault(),n.open(`last`);break;case xs.next(i(),t.orientation()):if(r===void 0)break;e.stopPropagation(),e.preventDefault(),r.nextMenu();break;case xs.previous(i(),t.orientation()):if(r===void 0)break;e.stopPropagation(),e.preventDefault(),r.previousMenu();break}}},onFocus:e=>{G(e,o.onFocus),r!==void 0&&e.currentTarget.dataset.pointerType!==`touch`&&r.setValue(l)},role:r===void 0?void 0:`menuitem`},()=>n.dataset(),c))}function ws(e){let t,n=vs(),r=ms(),i=ls(),o=ds(),{direction:c}=Xn(),[l,u]=N(J({id:n.generateId(`content-${g()}`)},e),[`ref`,`id`,`style`,`onOpenAutoFocus`,`onCloseAutoFocus`,`onEscapeKeyDown`,`onFocusOutside`,`onPointerEnter`,`onPointerMove`,`onKeyDown`,`onMouseDown`,`onFocusIn`,`onFocusOut`]),d=0,f=()=>r.parentMenuContext()==null&&i===void 0&&n.isModal(),p=ss({selectionManager:r.listState().selectionManager,collection:r.listState().collection,autoFocus:r.autoFocus,deferAutoFocus:!0,shouldFocusWrap:!0,disallowTypeAhead:()=>!r.listState().selectionManager().isFocused(),orientation:()=>n.orientation()===`horizontal`?`vertical`:`horizontal`},()=>t);Eo({trapFocus:()=>f()&&r.isOpen(),onMountAutoFocus:e=>{i===void 0&&l.onOpenAutoFocus?.(e)},onUnmountAutoFocus:l.onCloseAutoFocus},()=>t);let m=e=>{if(zt(e.currentTarget,e.target)&&(e.key===`Tab`&&r.isOpen()&&e.preventDefault(),i!==void 0&&e.currentTarget.getAttribute(`aria-haspopup`)!==`true`))switch(e.key){case xs.next(c(),n.orientation()):e.stopPropagation(),e.preventDefault(),r.close(!0),i.setAutoFocusMenu(!0),i.nextMenu();break;case xs.previous(c(),n.orientation()):if(e.currentTarget.hasAttribute(`data-closed`))break;e.stopPropagation(),e.preventDefault(),r.close(!0),i.setAutoFocusMenu(!0),i.previousMenu();break}},h=e=>{l.onEscapeKeyDown?.(e),i?.setAutoFocusMenu(!1),r.close(!0)},_=e=>{l.onFocusOutside?.(e),n.isModal()&&e.preventDefault()},v=e=>{G(e,l.onPointerEnter),r.isOpen()&&(r.parentMenuContext()?.listState().selectionManager().setFocused(!1),r.parentMenuContext()?.listState().selectionManager().setFocusedKey(void 0))},y=e=>{if(G(e,l.onPointerMove),e.pointerType!==`mouse`)return;let t=e.target,n=d!==e.clientX;zt(e.currentTarget,t)&&n&&(r.setPointerDir(e.clientX>d?`right`:`left`),d=e.clientX)};C(()=>R(r.registerContentId(l.id))),R(()=>r.setContentRef(void 0));let b={ref:pt(e=>{r.setContentRef(e),t=e},l.ref),role:`menu`,get id(){return l.id},get tabIndex(){return p.tabIndex()},get"aria-labelledby"(){return r.triggerId()},onKeyDown:K([l.onKeyDown,p.onKeyDown,m]),onMouseDown:K([l.onMouseDown,p.onMouseDown]),onFocusIn:K([l.onFocusIn,p.onFocusIn]),onFocusOut:K([l.onFocusOut,p.onFocusOut]),onPointerEnter:v,onPointerMove:y,get"data-orientation"(){return n.orientation()}};return j(P,{get when(){return r.contentPresent()},get children(){return j(P,{get when(){return o===void 0||r.parentMenuContext()!=null},get fallback(){return j(Y,s({as:`div`},()=>r.dataset(),b,u))},get children(){return j(La.Positioner,{get children(){return j(so,s({get disableOutsidePointerEvents(){return a(()=>!!f())()&&r.isOpen()},get excludedElements(){return[r.triggerRef]},bypassTopMostLayerCheck:!0,get style(){return Mt({"--kb-menu-content-transform-origin":`var(--kb-popper-content-transform-origin)`,position:`relative`},l.style)},onEscapeKeyDown:h,onFocusOutside:_,get onDismiss(){return r.close}},()=>r.dataset(),b,u))}})}})}})}function Ts(e){let t,n=vs(),r=ms(),[i,a]=N(e,[`ref`]);return Go({element:()=>t??null,enabled:()=>r.contentPresent()&&n.preventScroll()}),j(ws,s({ref(e){let n=pt(e=>{t=e},i.ref);typeof n==`function`&&n(e)}},a))}var Es=k();function Ds(){let e=O(Es);if(e===void 0)throw Error("[kobalte]: `useMenuGroupContext` must be used within a `Menu.Group` component");return e}function Os(e){let t=J({id:vs().generateId(`group-${g()}`)},e),[n,r]=I(),i={generateId:Rt(()=>t.id),registerLabelId:lo(r)};return j(Es.Provider,{value:i,get children(){return j(Y,s({as:`div`,role:`group`,get"aria-labelledby"(){return n()}},t))}})}function ks(e){let t=Ds(),[n,r]=N(J({id:t.generateId(`label`)},e),[`id`]);return C(()=>R(t.registerLabelId(n.id))),j(Y,s({as:`span`,get id(){return n.id},"aria-hidden":`true`},r))}function As(e){let t=ms();return j(Y,s({as:`span`,"aria-hidden":`true`},()=>t.dataset(),J({children:`▼`},e)))}function js(e){return j(ys,s({role:`menuitem`,closeOnSelect:!0},e))}function Ms(e){let t=gs(),[n,r]=N(J({id:t.generateId(`description`)},e),[`id`]);return C(()=>R(t.registerDescription(n.id))),j(Y,s({as:`div`,get id(){return n.id}},()=>t.dataset(),r))}function Ns(e){let t=gs(),[n,r]=N(J({id:t.generateId(`indicator`)},e),[`forceMount`]);return j(P,{get when(){return n.forceMount||t.isChecked()},get children(){return j(Y,s({as:`div`},()=>t.dataset(),r))}})}function Ps(e){let t=gs(),[n,r]=N(J({id:t.generateId(`label`)},e),[`ref`,`id`]);return C(()=>R(t.registerLabel(n.id))),j(Y,s({as:`div`,ref(e){let r=pt(t.setLabelRef,n.ref);typeof r==`function`&&r(e)},get id(){return n.id}},()=>t.dataset(),r))}function Fs(e){let t=ms();return j(P,{get when(){return t.contentPresent()},get children(){return j(oe,e)}})}var Is=k();function Ls(){let e=O(Is);if(e===void 0)throw Error("[kobalte]: `useMenuRadioGroupContext` must be used within a `Menu.RadioGroup` component");return e}function Rs(e){let[t,n]=N(J({id:vs().generateId(`radiogroup-${g()}`)},e),[`value`,`defaultValue`,`onChange`,`disabled`]),[r,i]=Pn({value:()=>t.value,defaultValue:()=>t.defaultValue,onChange:e=>t.onChange?.(e)});return j(Is.Provider,{value:{isDisabled:()=>t.disabled,isSelectedValue:e=>e===r(),setSelectedValue:e=>i(e)},get children(){return j(Os,n)}})}function zs(e){let t=Ls(),[n,r]=N(J({closeOnSelect:!1},e),[`value`,`onSelect`]);return j(ys,s({role:`menuitemradio`,get checked(){return t.isSelectedValue(n.value)},onSelect:()=>{n.onSelect?.(),t.setSelectedValue(n.value)}},r))}function Bs(e,t,n){let r=e.split(`-`)[0],i=n.getBoundingClientRect(),a=[],o=t.clientX,s=t.clientY;switch(r){case`top`:a.push([o,s+5]),a.push([i.left,i.bottom]),a.push([i.left,i.top]),a.push([i.right,i.top]),a.push([i.right,i.bottom]);break;case`right`:a.push([o-5,s]),a.push([i.left,i.top]),a.push([i.right,i.top]),a.push([i.right,i.bottom]),a.push([i.left,i.bottom]);break;case`bottom`:a.push([o,s-5]),a.push([i.right,i.top]),a.push([i.right,i.bottom]),a.push([i.left,i.bottom]),a.push([i.left,i.top]);break;case`left`:a.push([o+5,s]),a.push([i.right,i.bottom]),a.push([i.left,i.bottom]),a.push([i.left,i.top]),a.push([i.right,i.top]);break}return a}function Vs(e,t){return t?vn([e.clientX,e.clientY],t):!1}function Hs(e){let t=vs(),n=hr(),r=ps(),i=ls(),a=ds(),[o,c]=N(J({placement:t.orientation()===`horizontal`?`bottom-start`:`right-start`},e),[`open`,`defaultOpen`,`onOpenChange`]),l=0,u=null,d=`right`,[f,p]=I(),[m,h]=I(),[g,_]=I(),[v,y]=I(),[b,x]=I(!0),[S,w]=I(c.placement),[T,E]=I([]),[D,O]=I([]),{DomCollectionProvider:ee}=wr({items:D,onItemsChange:O}),k=co({open:()=>o.open,defaultOpen:()=>o.defaultOpen,onOpenChange:e=>o.onOpenChange?.(e)}),{present:te}=uo({show:()=>t.forceMount()||k.isOpen(),element:()=>v()??null}),ne=pr({selectionMode:`none`,dataSource:D}),A=e=>{x(e),k.open()},re=(e=!1)=>{k.close(),e&&r&&r.close(!0)},ie=e=>{x(e),k.toggle()},ae=()=>{let e=v();e&&(q(e),ne.selectionManager().setFocused(!0),ne.selectionManager().setFocusedKey(void 0))},oe=()=>{a==null?ae():setTimeout(()=>ae())},M=e=>{E(t=>[...t,e]);let t=r?.registerNestedMenu(e);return()=>{E(t=>Pt(t,e)),t?.()}},se=e=>d===u?.side&&Vs(e,u?.area),ce=e=>{se(e)&&e.preventDefault()},le=e=>{se(e)||oe()},ue=e=>{se(e)&&e.preventDefault()};Oo({isDisabled:()=>!(r==null&&k.isOpen()&&t.isModal()),targets:()=>[v(),...T()].filter(Boolean)}),C(()=>{let e=v();if(!e||!r)return;let t=r.registerNestedMenu(e);R(()=>{t()})}),C(()=>{r===void 0&&i?.registerMenu(t.value(),[v(),...T()])}),C(()=>{r!==void 0||i===void 0||(i.value()===t.value()?(g()?.focus(),i.autoFocusMenu()&&A(!0)):re())}),C(()=>{r!==void 0||i===void 0||k.isOpen()&&i.setValue(t.value())}),R(()=>{r===void 0&&i?.unregisterMenu(t.value())});let de={dataset:F(()=>({"data-expanded":k.isOpen()?``:void 0,"data-closed":k.isOpen()?void 0:``})),isOpen:k.isOpen,contentPresent:te,nestedMenus:T,currentPlacement:S,pointerGraceTimeoutId:()=>l,autoFocus:b,listState:()=>ne,parentMenuContext:()=>r,triggerRef:g,contentRef:v,triggerId:f,contentId:m,setTriggerRef:_,setContentRef:y,open:A,close:re,toggle:ie,focusContent:oe,onItemEnter:ce,onItemLeave:le,onTriggerLeave:ue,setPointerDir:e=>d=e,setPointerGraceTimeoutId:e=>l=e,setPointerGraceIntent:e=>u=e,registerNestedMenu:M,registerItemToParentDomCollection:n?.registerItem,registerTriggerId:lo(p),registerContentId:lo(h)};return j(ee,{get children(){return j(fs.Provider,{value:de,get children(){return j(P,{when:a===void 0,get fallback(){return c.children},get children(){return j(La,s({anchorRef:g,contentRef:v,onCurrentPlacementChange:w},c))}})}})}})}function Us(e){let{direction:t}=Xn();return j(Hs,s({get placement(){return t()===`rtl`?`left-start`:`right-start`},flip:!0},e))}var Ws={close:(e,t)=>e===`ltr`?[t===`horizontal`?`ArrowLeft`:`ArrowUp`]:[t===`horizontal`?`ArrowRight`:`ArrowDown`]};function Gs(e){let t=ms(),n=vs(),[r,i]=N(e,[`onFocusOutside`,`onKeyDown`]),{direction:a}=Xn();return j(ws,s({onOpenAutoFocus:e=>{e.preventDefault()},onCloseAutoFocus:e=>{e.preventDefault()},onFocusOutside:e=>{r.onFocusOutside?.(e);let n=e.target;zt(t.triggerRef(),n)||t.close()},onKeyDown:e=>{G(e,r.onKeyDown);let i=zt(e.currentTarget,e.target),o=Ws.close(a(),n.orientation()).includes(e.key),s=t.parentMenuContext()!=null;i&&o&&s&&(t.close(),q(t.triggerRef()))}},i))}var Ks=[`Enter`,` `],qs={open:(e,t)=>e===`ltr`?[...Ks,t===`horizontal`?`ArrowRight`:`ArrowDown`]:[...Ks,t===`horizontal`?`ArrowLeft`:`ArrowUp`]};function Js(e){let t,n=vs(),r=ms(),[i,o]=N(J({id:n.generateId(`sub-trigger-${g()}`)},e),[`ref`,`id`,`textValue`,`disabled`,`onPointerMove`,`onPointerLeave`,`onPointerDown`,`onPointerUp`,`onClick`,`onKeyDown`,`onMouseDown`,`onFocus`]),c=null,l=()=>{c&&window.clearTimeout(c),c=null},{direction:u}=Xn(),d=()=>i.id,f=()=>{let e=r.parentMenuContext();if(e==null)throw Error("[kobalte]: `Menu.SubTrigger` must be used within a `Menu.Sub` component");return e.listState().selectionManager()},p=()=>r.listState().collection(),m=()=>f().focusedKey()===d(),_=ur({key:d,selectionManager:f,shouldSelectOnPressUp:!0,allowsDifferentPressOrigin:!0,disabled:()=>i.disabled},()=>t),v=e=>{G(e,i.onClick),!r.isOpen()&&!i.disabled&&r.open(!0)},y=e=>{if(G(e,i.onPointerMove),e.pointerType!==`mouse`)return;let t=r.parentMenuContext();if(t?.onItemEnter(e),!e.defaultPrevented){if(i.disabled){t?.onItemLeave(e);return}!r.isOpen()&&!c&&(r.parentMenuContext()?.setPointerGraceIntent(null),c=window.setTimeout(()=>{r.open(!1),l()},100)),t?.onItemEnter(e),e.defaultPrevented||(r.listState().selectionManager().isFocused()&&(r.listState().selectionManager().setFocused(!1),r.listState().selectionManager().setFocusedKey(void 0)),q(e.currentTarget),t?.listState().selectionManager().setFocused(!0),t?.listState().selectionManager().setFocusedKey(d()))}},b=e=>{if(G(e,i.onPointerLeave),e.pointerType!==`mouse`)return;l();let t=r.parentMenuContext(),n=r.contentRef();if(n){t?.setPointerGraceIntent({area:Bs(r.currentPlacement(),e,n),side:r.currentPlacement().split(`-`)[0]}),window.clearTimeout(t?.pointerGraceTimeoutId());let i=window.setTimeout(()=>{t?.setPointerGraceIntent(null)},300);t?.setPointerGraceTimeoutId(i)}else{if(t?.onTriggerLeave(e),e.defaultPrevented)return;t?.setPointerGraceIntent(null)}t?.onItemLeave(e)},x=e=>{G(e,i.onKeyDown),!e.repeat&&(i.disabled||qs.open(u(),n.orientation()).includes(e.key)&&(e.stopPropagation(),e.preventDefault(),f().setFocused(!1),f().setFocusedKey(void 0),r.isOpen()||r.open(`first`),r.focusContent(),r.listState().selectionManager().setFocused(!0),r.listState().selectionManager().setFocusedKey(p().getFirstKey())))};return C(()=>{if(r.registerItemToParentDomCollection==null)throw Error("[kobalte]: `Menu.SubTrigger` must be used within a `Menu.Sub` component");R(r.registerItemToParentDomCollection({ref:()=>t,type:`item`,key:d(),textValue:i.textValue??t?.textContent??``,disabled:i.disabled??!1}))}),C(h(()=>r.parentMenuContext()?.pointerGraceTimeoutId(),e=>{R(()=>{window.clearTimeout(e),r.parentMenuContext()?.setPointerGraceIntent(null)})})),C(()=>R(r.registerTriggerId(i.id))),R(()=>{l()}),j(Y,s({as:`div`,ref(e){let n=pt(e=>{r.setTriggerRef(e),t=e},i.ref);typeof n==`function`&&n(e)},get id(){return i.id},role:`menuitem`,get tabIndex(){return _.tabIndex()},"aria-haspopup":`true`,get"aria-expanded"(){return r.isOpen()},get"aria-controls"(){return a(()=>!!r.isOpen())()?r.contentId():void 0},get"aria-disabled"(){return i.disabled},get"data-key"(){return _.dataKey()},get"data-highlighted"(){return m()?``:void 0},get"data-disabled"(){return i.disabled?``:void 0},get onPointerDown(){return K([i.onPointerDown,_.onPointerDown])},get onPointerUp(){return K([i.onPointerUp,_.onPointerUp])},get onClick(){return K([v,_.onClick])},get onKeyDown(){return K([x,_.onKeyDown])},get onMouseDown(){return K([i.onMouseDown,_.onMouseDown])},get onFocus(){return K([i.onFocus,_.onFocus])},onPointerMove:y,onPointerLeave:b},()=>r.dataset(),o))}function Ys(e){let t=ls(),[n,r]=N(J({id:`menu-${g()}`,modal:!0},e),[`id`,`modal`,`preventScroll`,`forceMount`,`open`,`defaultOpen`,`onOpenChange`,`value`,`orientation`]),i=co({open:()=>n.open,defaultOpen:()=>n.defaultOpen,onOpenChange:e=>n.onOpenChange?.(e)}),a={isModal:()=>n.modal??!0,preventScroll:()=>n.preventScroll??a.isModal(),forceMount:()=>n.forceMount??!1,generateId:Rt(()=>n.id),value:()=>n.value,orientation:()=>n.orientation??t?.orientation()??`horizontal`};return j(_s.Provider,{value:a,get children(){return j(Hs,s({get open(){return i.isOpen()},get onOpenChange(){return i.setIsOpen}},r))}})}kn({},{Root:()=>Xs,Separator:()=>Zs});function Xs(e){let t,[n,r]=N(J({orientation:`horizontal`},e),[`ref`,`orientation`]),i=En(()=>t,()=>`hr`);return j(Y,s({as:`hr`,ref(e){let r=pt(e=>t=e,n.ref);typeof r==`function`&&r(e)},get role(){return i()===`hr`?void 0:`separator`},get"aria-orientation"(){return n.orientation===`vertical`?`vertical`:void 0},get"data-orientation"(){return n.orientation}},r))}var Zs=Xs,Z={};kn(Z,{Arrow:()=>Oa,CheckboxItem:()=>bs,Content:()=>Qs,DropdownMenu:()=>ec,Group:()=>Os,GroupLabel:()=>ks,Icon:()=>As,Item:()=>js,ItemDescription:()=>Ms,ItemIndicator:()=>Ns,ItemLabel:()=>Ps,Portal:()=>Fs,RadioGroup:()=>Rs,RadioItem:()=>zs,Root:()=>$s,Separator:()=>Xs,Sub:()=>Us,SubContent:()=>Gs,SubTrigger:()=>Js,Trigger:()=>Cs});function Qs(e){let t=vs(),n=ms(),[r,i]=N(e,[`onCloseAutoFocus`,`onInteractOutside`]),a=!1;return j(Ts,s({onCloseAutoFocus:e=>{r.onCloseAutoFocus?.(e),a||q(n.triggerRef()),a=!1,e.preventDefault()},onInteractOutside:e=>{r.onInteractOutside?.(e),(!t.isModal()||e.detail.isContextMenu)&&(a=!0)}},i))}function $s(e){return j(Ys,J({id:`dropdownmenu-${g()}`},e))}var ec=Object.assign($s,{Arrow:Oa,CheckboxItem:bs,Content:Qs,Group:Os,GroupLabel:ks,Icon:As,Item:js,ItemDescription:Ms,ItemIndicator:Ns,ItemLabel:Ps,Portal:Fs,RadioGroup:Rs,RadioItem:zs,Separator:Xs,Sub:Us,SubContent:Gs,SubTrigger:Js,Trigger:Cs}),Q={colors:{inherit:`inherit`,current:`currentColor`,transparent:`transparent`,black:`#000000`,white:`#ffffff`,neutral:{50:`#f9fafb`,100:`#f2f4f7`,200:`#eaecf0`,300:`#d0d5dd`,400:`#98a2b3`,500:`#667085`,600:`#475467`,700:`#344054`,800:`#1d2939`,900:`#101828`},darkGray:{50:`#525c7a`,100:`#49536e`,200:`#414962`,300:`#394056`,400:`#313749`,500:`#292e3d`,600:`#212530`,700:`#191c24`,800:`#111318`,900:`#0b0d10`},gray:{50:`#f9fafb`,100:`#f2f4f7`,200:`#eaecf0`,300:`#d0d5dd`,400:`#98a2b3`,500:`#667085`,600:`#475467`,700:`#344054`,800:`#1d2939`,900:`#101828`},blue:{25:`#F5FAFF`,50:`#EFF8FF`,100:`#D1E9FF`,200:`#B2DDFF`,300:`#84CAFF`,400:`#53B1FD`,500:`#2E90FA`,600:`#1570EF`,700:`#175CD3`,800:`#1849A9`,900:`#194185`},green:{25:`#F6FEF9`,50:`#ECFDF3`,100:`#D1FADF`,200:`#A6F4C5`,300:`#6CE9A6`,400:`#32D583`,500:`#12B76A`,600:`#039855`,700:`#027A48`,800:`#05603A`,900:`#054F31`},red:{50:`#fef2f2`,100:`#fee2e2`,200:`#fecaca`,300:`#fca5a5`,400:`#f87171`,500:`#ef4444`,600:`#dc2626`,700:`#b91c1c`,800:`#991b1b`,900:`#7f1d1d`,950:`#450a0a`},yellow:{25:`#FFFCF5`,50:`#FFFAEB`,100:`#FEF0C7`,200:`#FEDF89`,300:`#FEC84B`,400:`#FDB022`,500:`#F79009`,600:`#DC6803`,700:`#B54708`,800:`#93370D`,900:`#7A2E0E`},purple:{25:`#FAFAFF`,50:`#F4F3FF`,100:`#EBE9FE`,200:`#D9D6FE`,300:`#BDB4FE`,400:`#9B8AFB`,500:`#7A5AF8`,600:`#6938EF`,700:`#5925DC`,800:`#4A1FB8`,900:`#3E1C96`},teal:{25:`#F6FEFC`,50:`#F0FDF9`,100:`#CCFBEF`,200:`#99F6E0`,300:`#5FE9D0`,400:`#2ED3B7`,500:`#15B79E`,600:`#0E9384`,700:`#107569`,800:`#125D56`,900:`#134E48`},pink:{25:`#fdf2f8`,50:`#fce7f3`,100:`#fbcfe8`,200:`#f9a8d4`,300:`#f472b6`,400:`#ec4899`,500:`#db2777`,600:`#be185d`,700:`#9d174d`,800:`#831843`,900:`#500724`},cyan:{25:`#ecfeff`,50:`#cffafe`,100:`#a5f3fc`,200:`#67e8f9`,300:`#22d3ee`,400:`#06b6d4`,500:`#0891b2`,600:`#0e7490`,700:`#155e75`,800:`#164e63`,900:`#083344`}},alpha:{100:`ff`,90:`e5`,80:`cc`,70:`b3`,60:`99`,50:`80`,40:`66`,30:`4d`,20:`33`,10:`1a`,0:`00`},font:{size:{"2xs":`calc(var(--tsqd-font-size) * 0.625)`,xs:`calc(var(--tsqd-font-size) * 0.75)`,sm:`calc(var(--tsqd-font-size) * 0.875)`,md:`var(--tsqd-font-size)`,lg:`calc(var(--tsqd-font-size) * 1.125)`,xl:`calc(var(--tsqd-font-size) * 1.25)`,"2xl":`calc(var(--tsqd-font-size) * 1.5)`,"3xl":`calc(var(--tsqd-font-size) * 1.875)`,"4xl":`calc(var(--tsqd-font-size) * 2.25)`,"5xl":`calc(var(--tsqd-font-size) * 3)`,"6xl":`calc(var(--tsqd-font-size) * 3.75)`,"7xl":`calc(var(--tsqd-font-size) * 4.5)`,"8xl":`calc(var(--tsqd-font-size) * 6)`,"9xl":`calc(var(--tsqd-font-size) * 8)`},lineHeight:{xs:`calc(var(--tsqd-font-size) * 1)`,sm:`calc(var(--tsqd-font-size) * 1.25)`,md:`calc(var(--tsqd-font-size) * 1.5)`,lg:`calc(var(--tsqd-font-size) * 1.75)`,xl:`calc(var(--tsqd-font-size) * 2)`,"2xl":`calc(var(--tsqd-font-size) * 2.25)`,"3xl":`calc(var(--tsqd-font-size) * 2.5)`,"4xl":`calc(var(--tsqd-font-size) * 2.75)`,"5xl":`calc(var(--tsqd-font-size) * 3)`,"6xl":`calc(var(--tsqd-font-size) * 3.25)`,"7xl":`calc(var(--tsqd-font-size) * 3.5)`,"8xl":`calc(var(--tsqd-font-size) * 3.75)`,"9xl":`calc(var(--tsqd-font-size) * 4)`},weight:{thin:`100`,extralight:`200`,light:`300`,normal:`400`,medium:`500`,semibold:`600`,bold:`700`,extrabold:`800`,black:`900`}},breakpoints:{xs:`320px`,sm:`640px`,md:`768px`,lg:`1024px`,xl:`1280px`,"2xl":`1536px`},border:{radius:{none:`0px`,xs:`calc(var(--tsqd-font-size) * 0.125)`,sm:`calc(var(--tsqd-font-size) * 0.25)`,md:`calc(var(--tsqd-font-size) * 0.375)`,lg:`calc(var(--tsqd-font-size) * 0.5)`,xl:`calc(var(--tsqd-font-size) * 0.75)`,"2xl":`calc(var(--tsqd-font-size) * 1)`,"3xl":`calc(var(--tsqd-font-size) * 1.5)`,full:`9999px`}},size:{0:`0px`,.25:`calc(var(--tsqd-font-size) * 0.0625)`,.5:`calc(var(--tsqd-font-size) * 0.125)`,1:`calc(var(--tsqd-font-size) * 0.25)`,1.5:`calc(var(--tsqd-font-size) * 0.375)`,2:`calc(var(--tsqd-font-size) * 0.5)`,2.5:`calc(var(--tsqd-font-size) * 0.625)`,3:`calc(var(--tsqd-font-size) * 0.75)`,3.5:`calc(var(--tsqd-font-size) * 0.875)`,4:`calc(var(--tsqd-font-size) * 1)`,4.5:`calc(var(--tsqd-font-size) * 1.125)`,5:`calc(var(--tsqd-font-size) * 1.25)`,5.5:`calc(var(--tsqd-font-size) * 1.375)`,6:`calc(var(--tsqd-font-size) * 1.5)`,6.5:`calc(var(--tsqd-font-size) * 1.625)`,7:`calc(var(--tsqd-font-size) * 1.75)`,8:`calc(var(--tsqd-font-size) * 2)`,9:`calc(var(--tsqd-font-size) * 2.25)`,10:`calc(var(--tsqd-font-size) * 2.5)`,11:`calc(var(--tsqd-font-size) * 2.75)`,12:`calc(var(--tsqd-font-size) * 3)`,14:`calc(var(--tsqd-font-size) * 3.5)`,16:`calc(var(--tsqd-font-size) * 4)`,20:`calc(var(--tsqd-font-size) * 5)`,24:`calc(var(--tsqd-font-size) * 6)`,28:`calc(var(--tsqd-font-size) * 7)`,32:`calc(var(--tsqd-font-size) * 8)`,36:`calc(var(--tsqd-font-size) * 9)`,40:`calc(var(--tsqd-font-size) * 10)`,44:`calc(var(--tsqd-font-size) * 11)`,48:`calc(var(--tsqd-font-size) * 12)`,52:`calc(var(--tsqd-font-size) * 13)`,56:`calc(var(--tsqd-font-size) * 14)`,60:`calc(var(--tsqd-font-size) * 15)`,64:`calc(var(--tsqd-font-size) * 16)`,72:`calc(var(--tsqd-font-size) * 18)`,80:`calc(var(--tsqd-font-size) * 20)`,96:`calc(var(--tsqd-font-size) * 24)`},shadow:{xs:(e=`rgb(0 0 0 / 0.1)`)=>`0 1px 2px 0 rgb(0 0 0 / 0.05)`,sm:(e=`rgb(0 0 0 / 0.1)`)=>`0 1px 3px 0 ${e}, 0 1px 2px -1px ${e}`,md:(e=`rgb(0 0 0 / 0.1)`)=>`0 4px 6px -1px ${e}, 0 2px 4px -2px ${e}`,lg:(e=`rgb(0 0 0 / 0.1)`)=>`0 10px 15px -3px ${e}, 0 4px 6px -4px ${e}`,xl:(e=`rgb(0 0 0 / 0.1)`)=>`0 20px 25px -5px ${e}, 0 8px 10px -6px ${e}`,"2xl":(e=`rgb(0 0 0 / 0.25)`)=>`0 25px 50px -12px ${e}`,inner:(e=`rgb(0 0 0 / 0.05)`)=>`inset 0 2px 4px 0 ${e}`,none:()=>`none`},zIndices:{hide:-1,auto:`auto`,base:0,docked:10,dropdown:1e3,sticky:1100,banner:1200,overlay:1300,modal:1400,popover:1500,skipLink:1600,toast:1700,tooltip:1800}},tc=b(`<svg width=14 height=14 viewBox="0 0 14 14"fill=none xmlns=http://www.w3.org/2000/svg><path d="M13 13L9.00007 9M10.3333 5.66667C10.3333 8.244 8.244 10.3333 5.66667 10.3333C3.08934 10.3333 1 8.244 1 5.66667C1 3.08934 3.08934 1 5.66667 1C8.244 1 10.3333 3.08934 10.3333 5.66667Z"stroke=currentColor stroke-width=1.66667 stroke-linecap=round stroke-linejoin=round>`),nc=b(`<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M9 3H15M3 6H21M19 6L18.2987 16.5193C18.1935 18.0975 18.1409 18.8867 17.8 19.485C17.4999 20.0118 17.0472 20.4353 16.5017 20.6997C15.882 21 15.0911 21 13.5093 21H10.4907C8.90891 21 8.11803 21 7.49834 20.6997C6.95276 20.4353 6.50009 20.0118 6.19998 19.485C5.85911 18.8867 5.8065 18.0975 5.70129 16.5193L5 6M10 10.5V15.5M14 10.5V15.5"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),rc=b(`<svg width=10 height=6 viewBox="0 0 10 6"fill=none xmlns=http://www.w3.org/2000/svg><path d="M1 1L5 5L9 1"stroke=currentColor stroke-width=1.66667 stroke-linecap=round stroke-linejoin=round>`),ic=b(`<svg width=12 height=12 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg><path d="M8 13.3333V2.66667M8 2.66667L4 6.66667M8 2.66667L12 6.66667"stroke=currentColor stroke-width=1.66667 stroke-linecap=round stroke-linejoin=round>`),ac=b(`<svg width=12 height=12 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg><path d="M8 2.66667V13.3333M8 13.3333L4 9.33333M8 13.3333L12 9.33333"stroke=currentColor stroke-width=1.66667 stroke-linecap=round stroke-linejoin=round>`),oc=b(`<svg width=12 height=12 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg style=transform:rotate(90deg)><path d="M8 2.66667V13.3333M8 13.3333L4 9.33333M8 13.3333L12 9.33333"stroke=currentColor stroke-width=1.66667 stroke-linecap=round stroke-linejoin=round>`),sc=b(`<svg width=12 height=12 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg style=transform:rotate(-90deg)><path d="M8 2.66667V13.3333M8 13.3333L4 9.33333M8 13.3333L12 9.33333"stroke=currentColor stroke-width=1.66667 stroke-linecap=round stroke-linejoin=round>`),cc=b(`<svg viewBox="0 0 24 24"height=12 width=12 fill=none xmlns=http://www.w3.org/2000/svg><path d="M12 2v2m0 16v2M4 12H2m4.314-5.686L4.9 4.9m12.786 1.414L19.1 4.9M6.314 17.69 4.9 19.104m12.786-1.414 1.414 1.414M22 12h-2m-3 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),lc=b(`<svg viewBox="0 0 24 24"height=12 width=12 fill=none xmlns=http://www.w3.org/2000/svg><path d="M22 15.844a10.424 10.424 0 0 1-4.306.925c-5.779 0-10.463-4.684-10.463-10.462 0-1.536.33-2.994.925-4.307A10.464 10.464 0 0 0 2 11.538C2 17.316 6.684 22 12.462 22c4.243 0 7.896-2.526 9.538-6.156Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),uc=b(`<svg viewBox="0 0 24 24"height=12 width=12 fill=none xmlns=http://www.w3.org/2000/svg><path d="M8 21h8m-4-4v4m-5.2-4h10.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C22 14.72 22 13.88 22 12.2V7.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C19.72 3 18.88 3 17.2 3H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C2 5.28 2 6.12 2 7.8v4.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C4.28 17 5.12 17 6.8 17Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),dc=b(`<svg stroke=currentColor fill=currentColor stroke-width=0 viewBox="0 0 24 24"height=1em width=1em xmlns=http://www.w3.org/2000/svg><path fill=none d="M0 0h24v24H0z"></path><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z">`),fc=b(`<svg stroke-width=0 viewBox="0 0 24 24"height=1em width=1em xmlns=http://www.w3.org/2000/svg><path fill=none d="M24 .01c0-.01 0-.01 0 0L0 0v24h24V.01zM0 0h24v24H0V0zm0 0h24v24H0V0z"></path><path d="M22.99 9C19.15 5.16 13.8 3.76 8.84 4.78l2.52 2.52c3.47-.17 6.99 1.05 9.63 3.7l2-2zm-4 4a9.793 9.793 0 00-4.49-2.56l3.53 3.53.96-.97zM2 3.05L5.07 6.1C3.6 6.82 2.22 7.78 1 9l1.99 2c1.24-1.24 2.67-2.16 4.2-2.77l2.24 2.24A9.684 9.684 0 005 13v.01L6.99 15a7.042 7.042 0 014.92-2.06L18.98 20l1.27-1.26L3.29 1.79 2 3.05zM9 17l3 3 3-3a4.237 4.237 0 00-6 0z">`),pc=b(`<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M9.3951 19.3711L9.97955 20.6856C10.1533 21.0768 10.4368 21.4093 10.7958 21.6426C11.1547 21.8759 11.5737 22.0001 12.0018 22C12.4299 22.0001 12.8488 21.8759 13.2078 21.6426C13.5667 21.4093 13.8503 21.0768 14.024 20.6856L14.6084 19.3711C14.8165 18.9047 15.1664 18.5159 15.6084 18.26C16.0532 18.0034 16.5678 17.8941 17.0784 17.9478L18.5084 18.1C18.9341 18.145 19.3637 18.0656 19.7451 17.8713C20.1265 17.6771 20.4434 17.3763 20.6573 17.0056C20.8715 16.635 20.9735 16.2103 20.9511 15.7829C20.9286 15.3555 20.7825 14.9438 20.5307 14.5978L19.684 13.4344C19.3825 13.0171 19.2214 12.5148 19.224 12C19.2239 11.4866 19.3865 10.9864 19.6884 10.5711L20.5351 9.40778C20.787 9.06175 20.933 8.65007 20.9555 8.22267C20.978 7.79528 20.8759 7.37054 20.6618 7C20.4479 6.62923 20.131 6.32849 19.7496 6.13423C19.3681 5.93997 18.9386 5.86053 18.5129 5.90556L17.0829 6.05778C16.5722 6.11141 16.0577 6.00212 15.6129 5.74556C15.17 5.48825 14.82 5.09736 14.6129 4.62889L14.024 3.31444C13.8503 2.92317 13.5667 2.59072 13.2078 2.3574C12.8488 2.12408 12.4299 1.99993 12.0018 2C11.5737 1.99993 11.1547 2.12408 10.7958 2.3574C10.4368 2.59072 10.1533 2.92317 9.97955 3.31444L9.3951 4.62889C9.18803 5.09736 8.83798 5.48825 8.3951 5.74556C7.95032 6.00212 7.43577 6.11141 6.9251 6.05778L5.49066 5.90556C5.06499 5.86053 4.6354 5.93997 4.25397 6.13423C3.87255 6.32849 3.55567 6.62923 3.34177 7C3.12759 7.37054 3.02555 7.79528 3.04804 8.22267C3.07052 8.65007 3.21656 9.06175 3.46844 9.40778L4.3151 10.5711C4.61704 10.9864 4.77964 11.4866 4.77955 12C4.77964 12.5134 4.61704 13.0137 4.3151 13.4289L3.46844 14.5922C3.21656 14.9382 3.07052 15.3499 3.04804 15.7773C3.02555 16.2047 3.12759 16.6295 3.34177 17C3.55589 17.3706 3.8728 17.6712 4.25417 17.8654C4.63554 18.0596 5.06502 18.1392 5.49066 18.0944L6.92066 17.9422C7.43133 17.8886 7.94587 17.9979 8.39066 18.2544C8.83519 18.511 9.18687 18.902 9.3951 19.3711Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round></path><path d="M12 15C13.6568 15 15 13.6569 15 12C15 10.3431 13.6568 9 12 9C10.3431 9 8.99998 10.3431 8.99998 12C8.99998 13.6569 10.3431 15 12 15Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),mc=b(`<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M16 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V8M11.5 12.5L17 7M17 7H12M17 7V12M6.2 21H8.8C9.9201 21 10.4802 21 10.908 20.782C11.2843 20.5903 11.5903 20.2843 11.782 19.908C12 19.4802 12 18.9201 12 17.8V15.2C12 14.0799 12 13.5198 11.782 13.092C11.5903 12.7157 11.2843 12.4097 10.908 12.218C10.4802 12 9.92011 12 8.8 12H6.2C5.0799 12 4.51984 12 4.09202 12.218C3.71569 12.4097 3.40973 12.7157 3.21799 13.092C3 13.5198 3 14.0799 3 15.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),hc=b(`<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path class=copier d="M8 8V5.2C8 4.0799 8 3.51984 8.21799 3.09202C8.40973 2.71569 8.71569 2.40973 9.09202 2.21799C9.51984 2 10.0799 2 11.2 2H18.8C19.9201 2 20.4802 2 20.908 2.21799C21.2843 2.40973 21.5903 2.71569 21.782 3.09202C22 3.51984 22 4.0799 22 5.2V12.8C22 13.9201 22 14.4802 21.782 14.908C21.5903 15.2843 21.2843 15.5903 20.908 15.782C20.4802 16 19.9201 16 18.8 16H16M5.2 22H12.8C13.9201 22 14.4802 22 14.908 21.782C15.2843 21.5903 15.5903 21.2843 15.782 20.908C16 20.4802 16 19.9201 16 18.8V11.2C16 10.0799 16 9.51984 15.782 9.09202C15.5903 8.71569 15.2843 8.40973 14.908 8.21799C14.4802 8 13.9201 8 12.8 8H5.2C4.0799 8 3.51984 8 3.09202 8.21799C2.71569 8.40973 2.40973 8.71569 2.21799 9.09202C2 9.51984 2 10.0799 2 11.2V18.8C2 19.9201 2 20.4802 2.21799 20.908C2.40973 21.2843 2.71569 21.5903 3.09202 21.782C3.51984 22 4.07989 22 5.2 22Z"stroke-width=2 stroke-linecap=round stroke-linejoin=round stroke=currentColor>`),gc=b(`<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M2.5 21.4998L8.04927 19.3655C8.40421 19.229 8.58168 19.1607 8.74772 19.0716C8.8952 18.9924 9.0358 18.901 9.16804 18.7984C9.31692 18.6829 9.45137 18.5484 9.72028 18.2795L21 6.99982C22.1046 5.89525 22.1046 4.10438 21 2.99981C19.8955 1.89525 18.1046 1.89524 17 2.99981L5.72028 14.2795C5.45138 14.5484 5.31692 14.6829 5.20139 14.8318C5.09877 14.964 5.0074 15.1046 4.92823 15.2521C4.83911 15.4181 4.77085 15.5956 4.63433 15.9506L2.5 21.4998ZM2.5 21.4998L4.55812 16.1488C4.7054 15.7659 4.77903 15.5744 4.90534 15.4867C5.01572 15.4101 5.1523 15.3811 5.2843 15.4063C5.43533 15.4351 5.58038 15.5802 5.87048 15.8703L8.12957 18.1294C8.41967 18.4195 8.56472 18.5645 8.59356 18.7155C8.61877 18.8475 8.58979 18.9841 8.51314 19.0945C8.42545 19.2208 8.23399 19.2944 7.85107 19.4417L2.5 21.4998Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),_c=b(`<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M7.5 12L10.5 15L16.5 9M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),vc=b(`<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M9 9L15 15M15 9L9 15M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"stroke=#F04438 stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),yc=b(`<svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 xmlns=http://www.w3.org/2000/svg><rect class=list width=20 height=20 y=2 x=2 rx=2></rect><line class=list-item y1=7 y2=7 x1=6 x2=18></line><line class=list-item y2=12 y1=12 x1=6 x2=18></line><line class=list-item y1=17 y2=17 x1=6 x2=18>`),bc=b(`<svg viewBox="0 0 24 24"height=20 width=20 fill=none xmlns=http://www.w3.org/2000/svg><path d="M3 7.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C5.28 3 6.12 3 7.8 3h8.4c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C21 5.28 21 6.12 21 7.8v8.4c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C18.72 21 17.88 21 16.2 21H7.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C3 18.72 3 17.88 3 16.2V7.8Z"stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),xc=b(`<svg width=14 height=14 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),Sc=b(`<svg width=14 height=14 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.0784 19.0784L16.25 16.25M19.0784 4.99994L16.25 7.82837M4.92157 19.0784L7.75 16.25M4.92157 4.99994L7.75 7.82837"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round></path><animateTransform attributeName=transform attributeType=XML type=rotate from=0 to=360 dur=2s repeatCount=indefinite>`),Cc=b(`<svg width=14 height=14 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M15 9L9 15M9 9L15 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),wc=b(`<svg width=14 height=14 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M9.5 15V9M14.5 15V9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),Tc=b(`<svg version=1.0 viewBox="0 0 633 633"><linearGradient x1=-666.45 x2=-666.45 y1=163.28 y2=163.99 gradientTransform="matrix(633 0 0 633 422177 -103358)"gradientUnits=userSpaceOnUse><stop stop-color=#6BDAFF offset=0></stop><stop stop-color=#F9FFB5 offset=.32></stop><stop stop-color=#FFA770 offset=.71></stop><stop stop-color=#FF7373 offset=1></stop></linearGradient><circle cx=316.5 cy=316.5 r=316.5></circle><defs><filter x=-137.5 y=412 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=-137.5 y=412 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=89.5 cy=610.5 rx=214.5 ry=186 fill=#015064 stroke=#00CFE2 stroke-width=25></ellipse></g><defs><filter x=316.5 y=412 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=316.5 y=412 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=543.5 cy=610.5 rx=214.5 ry=186 fill=#015064 stroke=#00CFE2 stroke-width=25></ellipse></g><defs><filter x=-137.5 y=450 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=-137.5 y=450 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=89.5 cy=648.5 rx=214.5 ry=186 fill=#015064 stroke=#00A8B8 stroke-width=25></ellipse></g><defs><filter x=316.5 y=450 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=316.5 y=450 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=543.5 cy=648.5 rx=214.5 ry=186 fill=#015064 stroke=#00A8B8 stroke-width=25></ellipse></g><defs><filter x=-137.5 y=486 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=-137.5 y=486 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=89.5 cy=684.5 rx=214.5 ry=186 fill=#015064 stroke=#007782 stroke-width=25></ellipse></g><defs><filter x=316.5 y=486 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=316.5 y=486 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=543.5 cy=684.5 rx=214.5 ry=186 fill=#015064 stroke=#007782 stroke-width=25></ellipse></g><defs><filter x=272.2 y=308 width=176.9 height=129.3 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=272.2 y=308 width=176.9 height=129.3 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><line x1=436 x2=431 y1=403.2 y2=431.8 fill=none stroke=#000 stroke-linecap=round stroke-linejoin=bevel stroke-width=11></line><line x1=291 x2=280 y1=341.5 y2=403.5 fill=none stroke=#000 stroke-linecap=round stroke-linejoin=bevel stroke-width=11></line><line x1=332.9 x2=328.6 y1=384.1 y2=411.2 fill=none stroke=#000 stroke-linecap=round stroke-linejoin=bevel stroke-width=11></line><linearGradient x1=-670.75 x2=-671.59 y1=164.4 y2=164.49 gradientTransform="matrix(-184.16 -32.472 -11.461 64.997 -121359 -32126)"gradientUnits=userSpaceOnUse><stop stop-color=#EE2700 offset=0></stop><stop stop-color=#FF008E offset=1></stop></linearGradient><path d="m344.1 363 97.7 17.2c5.8 2.1 8.2 6.1 7.1 12.1s-4.7 9.2-11 9.9l-106-18.7-57.5-59.2c-3.2-4.8-2.9-9.1 0.8-12.8s8.3-4.4 13.7-2.1l55.2 53.6z"clip-rule=evenodd fill-rule=evenodd></path><line x1=428.2 x2=429.1 y1=384.5 y2=378 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line><line x1=395.2 x2=396.1 y1=379.5 y2=373 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line><line x1=362.2 x2=363.1 y1=373.5 y2=367.4 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line><line x1=324.2 x2=328.4 y1=351.3 y2=347.4 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line><line x1=303.2 x2=307.4 y1=331.3 y2=327.4 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line></g><defs><filter x=73.2 y=113.8 width=280.6 height=317.4 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=73.2 y=113.8 width=280.6 height=317.4 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><linearGradient x1=-672.16 x2=-672.16 y1=165.03 y2=166.03 gradientTransform="matrix(-100.18 48.861 97.976 200.88 -83342 -93.059)"gradientUnits=userSpaceOnUse><stop stop-color=#A17500 offset=0></stop><stop stop-color=#5D2100 offset=1></stop></linearGradient><path d="m192.3 203c8.1 37.3 14 73.6 17.8 109.1 3.8 35.4 2.8 75.1-3 119.2l61.2-16.7c-15.6-59-25.2-97.9-28.6-116.6s-10.8-51.9-22.1-99.6l-25.3 4.6"clip-rule=evenodd fill-rule=evenodd></path><g stroke=#2F8A00><linearGradient x1=-660.23 x2=-660.23 y1=166.72 y2=167.72 gradientTransform="matrix(92.683 4.8573 -2.0259 38.657 61680 -3088.6)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m195 183.9s-12.6-22.1-36.5-29.9c-15.9-5.2-34.4-1.5-55.5 11.1 15.9 14.3 29.5 22.6 40.7 24.9 16.8 3.6 51.3-6.1 51.3-6.1z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-661.36 x2=-661.36 y1=164.18 y2=165.18 gradientTransform="matrix(110 5.7648 -6.3599 121.35 73933 -15933)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m194.9 184.5s-47.5-8.5-83.2 15.7c-23.8 16.2-34.3 49.3-31.6 99.4 30.3-27.8 52.1-48.5 65.2-61.9 19.8-20.2 49.6-53.2 49.6-53.2z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-656.79 x2=-656.79 y1=165.15 y2=166.15 gradientTransform="matrix(62.954 3.2993 -3.5023 66.828 42156 -8754.1)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m195 183.9c-0.8-21.9 6-38 20.6-48.2s29.8-15.4 45.5-15.3c-6.1 21.4-14.5 35.8-25.2 43.4s-24.4 14.2-40.9 20.1z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-663.07 x2=-663.07 y1=165.44 y2=166.44 gradientTransform="matrix(152.47 7.9907 -3.0936 59.029 101884 -4318.7)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m194.9 184.5c31.9-30 64.1-39.7 96.7-29s50.8 30.4 54.6 59.1c-35.2-5.5-60.4-9.6-75.8-12.1-15.3-2.6-40.5-8.6-75.5-18z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-662.57 x2=-662.57 y1=164.44 y2=165.44 gradientTransform="matrix(136.46 7.1517 -5.2163 99.533 91536 -11442)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m194.9 184.5c35.8-7.6 65.6-0.2 89.2 22s37.7 49 42.3 80.3c-39.8-9.7-68.3-23.8-85.5-42.4s-32.5-38.5-46-59.9z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-656.43 x2=-656.43 y1=163.86 y2=164.86 gradientTransform="matrix(60.866 3.1899 -8.7773 167.48 41560 -25168)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m194.9 184.5c-33.6 13.8-53.6 35.7-60.1 65.6s-3.6 63.1 8.7 99.6c27.4-40.3 43.2-69.6 47.4-88s5.6-44.1 4-77.2z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><path d="m196.5 182.3c-14.8 21.6-25.1 41.4-30.8 59.4s-9.5 33-11.1 45.1"fill=none stroke-linecap=round stroke-width=8></path><path d="m194.9 185.7c-24.4 1.7-43.8 9-58.1 21.8s-24.7 25.4-31.3 37.8"fill=none stroke-linecap=round stroke-width=8></path><path d="m204.5 176.4c29.7-6.7 52-8.4 67-5.1s26.9 8.6 35.8 15.9"fill=none stroke-linecap=round stroke-width=8></path><path d="m196.5 181.4c20.3 9.9 38.2 20.5 53.9 31.9s27.4 22.1 35.1 32"fill=none stroke-linecap=round stroke-width=8></path></g></g><defs><filter x=50.5 y=399 width=532 height=633 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=50.5 y=399 width=532 height=633 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><linearGradient x1=-666.06 x2=-666.23 y1=163.36 y2=163.75 gradientTransform="matrix(532 0 0 633 354760 -102959)"gradientUnits=userSpaceOnUse><stop stop-color=#FFF400 offset=0></stop><stop stop-color=#3C8700 offset=1></stop></linearGradient><ellipse cx=316.5 cy=715.5 rx=266 ry=316.5></ellipse></g><defs><filter x=391 y=-24 width=288 height=283 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=391 y=-24 width=288 height=283 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><linearGradient x1=-664.56 x2=-664.56 y1=163.79 y2=164.79 gradientTransform="matrix(227 0 0 227 151421 -37204)"gradientUnits=userSpaceOnUse><stop stop-color=#FFDF00 offset=0></stop><stop stop-color=#FF9D00 offset=1></stop></linearGradient><circle cx=565.5 cy=89.5 r=113.5></circle><linearGradient x1=-644.5 x2=-645.77 y1=342 y2=342 gradientTransform="matrix(30 0 0 1 19770 -253)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=427 x2=397 y1=89 y2=89 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-641.56 x2=-642.83 y1=196.02 y2=196.07 gradientTransform="matrix(26.5 0 0 5.5 17439 -1025.5)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=430.5 x2=404 y1=55.5 y2=50 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-643.73 x2=-645 y1=185.83 y2=185.9 gradientTransform="matrix(29 0 0 8 19107 -1361)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=431 x2=402 y1=122 y2=130 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-638.94 x2=-640.22 y1=177.09 y2=177.39 gradientTransform="matrix(24 0 0 13 15783 -2145)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=442 x2=418 y1=153 y2=166 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-633.42 x2=-634.7 y1=172.41 y2=173.31 gradientTransform="matrix(20 0 0 19 13137 -3096)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=464 x2=444 y1=180 y2=199 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-619.05 x2=-619.52 y1=170.82 y2=171.82 gradientTransform="matrix(13.83 0 0 22.85 9050 -3703.4)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=491.4 x2=477.5 y1=203 y2=225.9 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-578.5 x2=-578.63 y1=170.31 y2=171.31 gradientTransform="matrix(7.5 0 0 24.5 4860 -3953)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=524.5 x2=517 y1=219.5 y2=244 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=666.5 x2=666.5 y1=170.31 y2=171.31 gradientTransform="matrix(.5 0 0 24.5 231.5 -3944)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=564.5 x2=565 y1=228.5 y2=253 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12>`);function Ec(){return tc()}function Dc(){return nc()}function Oc(){return rc()}function kc(){return ic()}function Ac(){return ac()}function jc(){return oc()}function Mc(){return sc()}function Nc(){return cc()}function Pc(){return lc()}function Fc(){return uc()}function Ic(){return dc()}function Lc(){return fc()}function Rc(){return pc()}function zc(){return mc()}function Bc(){return hc()}function Vc(){return gc()}function Hc(e){return(()=>{var t=_c(),n=t.firstChild;return L(()=>v(n,`stroke`,e.theme===`dark`?`#12B76A`:`#027A48`)),t})()}function Uc(){return vc()}function Wc(){return yc()}function Gc(e){return[j(P,{get when(){return e.checked},get children(){var t=_c(),n=t.firstChild;return L(()=>v(n,`stroke`,e.theme===`dark`?`#9B8AFB`:`#6938EF`)),t}}),j(P,{get when(){return!e.checked},get children(){var t=bc(),n=t.firstChild;return L(()=>v(n,`stroke`,e.theme===`dark`?`#9B8AFB`:`#6938EF`)),t}})]}function Kc(){return xc()}function qc(){return Sc()}function Jc(){return Cc()}function Yc(){return wc()}function Xc(){let e=g();return(()=>{var t=Tc(),n=t.firstChild,r=n.nextSibling,i=r.nextSibling,a=i.firstChild,o=i.nextSibling,s=o.firstChild,c=o.nextSibling,l=c.nextSibling,u=l.firstChild,d=l.nextSibling,f=d.firstChild,p=d.nextSibling,m=p.nextSibling,h=m.firstChild,g=m.nextSibling,_=g.firstChild,y=g.nextSibling,b=y.nextSibling,x=b.firstChild,S=b.nextSibling,C=S.firstChild,w=S.nextSibling,T=w.nextSibling,E=T.firstChild,D=T.nextSibling,O=D.firstChild,ee=D.nextSibling,k=ee.nextSibling,te=k.firstChild,ne=k.nextSibling,A=ne.firstChild,re=ne.nextSibling,ie=re.nextSibling,j=ie.firstChild,ae=ie.nextSibling,oe=ae.firstChild,M=ae.nextSibling,N=M.firstChild.nextSibling.nextSibling.nextSibling,se=N.nextSibling,P=M.nextSibling,ce=P.firstChild,le=P.nextSibling,ue=le.firstChild,F=le.nextSibling,de=F.firstChild,I=de.nextSibling,L=I.nextSibling.firstChild,R=L.nextSibling,fe=R.nextSibling,pe=fe.nextSibling,me=pe.nextSibling,z=me.nextSibling,he=z.nextSibling,ge=he.nextSibling,_e=ge.nextSibling,ve=_e.nextSibling,ye=ve.nextSibling,be=ye.nextSibling,xe=F.nextSibling,Se=xe.firstChild,Ce=xe.nextSibling,we=Ce.firstChild,Te=Ce.nextSibling,Ee=Te.firstChild,De=Ee.nextSibling,Oe=Te.nextSibling,ke=Oe.firstChild,Ae=Oe.nextSibling,je=Ae.firstChild,Me=Ae.nextSibling,Ne=Me.firstChild,Pe=Ne.nextSibling,Fe=Pe.nextSibling,Ie=Fe.nextSibling,B=Ie.nextSibling,Le=B.nextSibling,Re=Le.nextSibling,ze=Re.nextSibling,Be=ze.nextSibling,Ve=Be.nextSibling,V=Ve.nextSibling,He=V.nextSibling,Ue=He.nextSibling,We=Ue.nextSibling,Ge=We.nextSibling,H=Ge.nextSibling,Ke=H.nextSibling,qe=Ke.nextSibling;return v(n,`id`,`a-${e}`),v(r,`fill`,`url(#a-${e})`),v(a,`id`,`am-${e}`),v(o,`id`,`b-${e}`),v(s,`filter`,`url(#am-${e})`),v(c,`mask`,`url(#b-${e})`),v(u,`id`,`ah-${e}`),v(d,`id`,`k-${e}`),v(f,`filter`,`url(#ah-${e})`),v(p,`mask`,`url(#k-${e})`),v(h,`id`,`ae-${e}`),v(g,`id`,`j-${e}`),v(_,`filter`,`url(#ae-${e})`),v(y,`mask`,`url(#j-${e})`),v(x,`id`,`ai-${e}`),v(S,`id`,`i-${e}`),v(C,`filter`,`url(#ai-${e})`),v(w,`mask`,`url(#i-${e})`),v(E,`id`,`aj-${e}`),v(D,`id`,`h-${e}`),v(O,`filter`,`url(#aj-${e})`),v(ee,`mask`,`url(#h-${e})`),v(te,`id`,`ag-${e}`),v(ne,`id`,`g-${e}`),v(A,`filter`,`url(#ag-${e})`),v(re,`mask`,`url(#g-${e})`),v(j,`id`,`af-${e}`),v(ae,`id`,`f-${e}`),v(oe,`filter`,`url(#af-${e})`),v(M,`mask`,`url(#f-${e})`),v(N,`id`,`m-${e}`),v(se,`fill`,`url(#m-${e})`),v(ce,`id`,`ak-${e}`),v(le,`id`,`e-${e}`),v(ue,`filter`,`url(#ak-${e})`),v(F,`mask`,`url(#e-${e})`),v(de,`id`,`n-${e}`),v(I,`fill`,`url(#n-${e})`),v(L,`id`,`r-${e}`),v(R,`fill`,`url(#r-${e})`),v(fe,`id`,`s-${e}`),v(pe,`fill`,`url(#s-${e})`),v(me,`id`,`q-${e}`),v(z,`fill`,`url(#q-${e})`),v(he,`id`,`p-${e}`),v(ge,`fill`,`url(#p-${e})`),v(_e,`id`,`o-${e}`),v(ve,`fill`,`url(#o-${e})`),v(ye,`id`,`l-${e}`),v(be,`fill`,`url(#l-${e})`),v(Se,`id`,`al-${e}`),v(Ce,`id`,`d-${e}`),v(we,`filter`,`url(#al-${e})`),v(Te,`mask`,`url(#d-${e})`),v(Ee,`id`,`u-${e}`),v(De,`fill`,`url(#u-${e})`),v(ke,`id`,`ad-${e}`),v(Ae,`id`,`c-${e}`),v(je,`filter`,`url(#ad-${e})`),v(Me,`mask`,`url(#c-${e})`),v(Ne,`id`,`t-${e}`),v(Pe,`fill`,`url(#t-${e})`),v(Fe,`id`,`v-${e}`),v(Ie,`stroke`,`url(#v-${e})`),v(B,`id`,`aa-${e}`),v(Le,`stroke`,`url(#aa-${e})`),v(Re,`id`,`w-${e}`),v(ze,`stroke`,`url(#w-${e})`),v(Be,`id`,`ac-${e}`),v(Ve,`stroke`,`url(#ac-${e})`),v(V,`id`,`ab-${e}`),v(He,`stroke`,`url(#ab-${e})`),v(Ue,`id`,`y-${e}`),v(We,`stroke`,`url(#y-${e})`),v(Ge,`id`,`x-${e}`),v(H,`stroke`,`url(#x-${e})`),v(Ke,`id`,`z-${e}`),v(qe,`stroke`,`url(#z-${e})`),t})()}var Zc=b(`<span><svg width=16 height=16 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg><path d="M6 12L10 8L6 4"stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),Qc=b(`<button title="Copy object to clipboard">`),$c=b(`<button title="Remove all items"aria-label="Remove all items">`),el=b(`<button title="Delete item"aria-label="Delete item">`),tl=b(`<button title="Toggle value"aria-label="Toggle value">`),nl=b(`<button title="Bulk Edit Data"aria-label="Bulk Edit Data">`),rl=b(`<div>`),il=b(`<div><button> <span></span> <span> `),al=b(`<input>`),ol=b(`<span>`),sl=b(`<div><label>:`),cl=b(`<div><div><button> [<!>...<!>]`);function ll(e,t){let n=0,r=[];for(;n<e.length;)r.push(e.slice(n,n+t)),n+=t;return r}var ul=e=>{let t=V(),n=B().shadowDOMTarget?U.bind({target:B().shadowDOMTarget}):U,r=F(()=>t()===`dark`?yl(n):vl(n));return(()=>{var t=Zc();return L(()=>D(t,W(r().expander,n`
          transform: rotate(${e.expanded?90:0}deg);
        `,e.expanded&&n`
            & svg {
              top: -1px;
            }
          `))),t})()},dl=e=>{let t=V(),n=B().shadowDOMTarget?U.bind({target:B().shadowDOMTarget}):U,r=F(()=>t()===`dark`?yl(n):vl(n)),[i,a]=I(`NoCopy`);return(()=>{var n=Qc();return ie(n,`click`,i()===`NoCopy`?()=>{navigator.clipboard.writeText(x(e.value)).then(()=>{a(`SuccessCopy`),setTimeout(()=>{a(`NoCopy`)},1500)},e=>{a(`ErrorCopy`),setTimeout(()=>{a(`NoCopy`)},1500)})}:void 0,!0),f(n,j(E,{get children(){return[j(w,{get when(){return i()===`NoCopy`},get children(){return j(Bc,{})}}),j(w,{get when(){return i()===`SuccessCopy`},get children(){return j(Hc,{get theme(){return t()}})}}),j(w,{get when(){return i()===`ErrorCopy`},get children(){return j(Uc,{})}})]}})),L(e=>{var t=r().actionButton,a=`${i()===`NoCopy`?`Copy object to clipboard`:i()===`SuccessCopy`?`Object copied to clipboard`:`Error copying object to clipboard`}`;return t!==e.e&&D(n,e.e=t),a!==e.t&&v(n,`aria-label`,e.t=a),e},{e:void 0,t:void 0}),n})()},fl=e=>{let t=V(),n=B().shadowDOMTarget?U.bind({target:B().shadowDOMTarget}):U,r=F(()=>t()===`dark`?yl(n):vl(n)),i=B().client;return(()=>{var t=$c();return t.$$click=()=>{let t=e.activeQuery.state.data,n=m(t,e.dataPath,[]);i.setQueryData(e.activeQuery.queryKey,n)},f(t,j(Wc,{})),L(()=>D(t,r().actionButton)),t})()},pl=e=>{let t=V(),n=B().shadowDOMTarget?U.bind({target:B().shadowDOMTarget}):U,r=F(()=>t()===`dark`?yl(n):vl(n)),i=B().client;return(()=>{var t=el();return t.$$click=()=>{let t=e.activeQuery.state.data,n=de(t,e.dataPath);i.setQueryData(e.activeQuery.queryKey,n)},f(t,j(Dc,{})),L(()=>D(t,W(r().actionButton))),t})()},ml=e=>{let t=V(),n=B().shadowDOMTarget?U.bind({target:B().shadowDOMTarget}):U,r=F(()=>t()===`dark`?yl(n):vl(n)),i=B().client;return(()=>{var a=tl();return a.$$click=()=>{let t=e.activeQuery.state.data,n=m(t,e.dataPath,!e.value);i.setQueryData(e.activeQuery.queryKey,n)},f(a,j(Gc,{get theme(){return t()},get checked(){return e.value}})),L(()=>D(a,W(r().actionButton,n`
          width: ${Q.size[3.5]};
          height: ${Q.size[3.5]};
        `))),a})()};function hl(e){return Symbol.iterator in e}function gl(e){let t=V(),n=B().shadowDOMTarget?U.bind({target:B().shadowDOMTarget}):U,r=F(()=>t()===`dark`?yl(n):vl(n)),i=B().client,[s,c]=I((e.defaultExpanded||[]).includes(e.label)),l=()=>c(e=>!e),[u,d]=I([]),p=F(()=>Array.isArray(e.value)?e.value.map((e,t)=>({label:t.toString(),value:e})):e.value!==null&&typeof e.value==`object`&&hl(e.value)&&typeof e.value[Symbol.iterator]==`function`?e.value instanceof Map?Array.from(e.value,([e,t])=>({label:e,value:t})):Array.from(e.value,(e,t)=>({label:t.toString(),value:e})):typeof e.value==`object`&&e.value!==null?Object.entries(e.value).map(([e,t])=>({label:e,value:t})):[]),h=F(()=>Array.isArray(e.value)?`array`:e.value!==null&&typeof e.value==`object`&&hl(e.value)&&typeof e.value[Symbol.iterator]==`function`?`Iterable`:typeof e.value==`object`&&e.value!==null?`object`:typeof e.value),y=F(()=>ll(p(),100)),b=e.dataPath??[],x=g();return(()=>{var t=rl();return f(t,j(P,{get when(){return y().length},get children(){return[(()=>{var t=il(),n=t.firstChild,i=n.firstChild,c=i.nextSibling,u=c.nextSibling.nextSibling,d=u.firstChild;return n.$$click=()=>l(),f(n,j(ul,{get expanded(){return s()}}),i),f(c,()=>e.label),f(u,()=>String(h()).toLowerCase()===`iterable`?`(Iterable) `:``,d),f(u,()=>p().length,d),f(u,()=>p().length>1?`items`:`item`,null),f(t,j(P,{get when(){return e.editable},get children(){var t=rl();return f(t,j(dl,{get value(){return e.value}}),null),f(t,j(P,{get when(){return a(()=>!!e.itemsDeletable)()&&e.activeQuery!==void 0},get children(){return j(pl,{get activeQuery(){return e.activeQuery},dataPath:b})}}),null),f(t,j(P,{get when(){return a(()=>h()===`array`)()&&e.activeQuery!==void 0},get children(){return j(fl,{get activeQuery(){return e.activeQuery},dataPath:b})}}),null),f(t,j(P,{get when(){return a(()=>!!e.onEdit)()&&!o(e.value).meta},get children(){var t=nl();return t.$$click=()=>{e.onEdit?.()},f(t,j(Vc,{})),L(()=>D(t,r().actionButton)),t}}),null),L(()=>D(t,r().actions)),t}}),null),L(e=>{var i=r().expanderButtonContainer,a=r().expanderButton,o=s()?`true`:`false`,c=r().info;return i!==e.e&&D(t,e.e=i),a!==e.t&&D(n,e.t=a),o!==e.a&&v(n,`aria-expanded`,e.a=o),c!==e.o&&D(u,e.o=c),e},{e:void 0,t:void 0,a:void 0,o:void 0}),t})(),j(P,{get when(){return s()},get children(){return[j(P,{get when(){return y().length===1},get children(){var t=rl();return f(t,j(Tt,{get each(){return p()},by:e=>e.label,children:t=>j(gl,{get defaultExpanded(){return e.defaultExpanded},get label(){return t().label},get value(){return t().value},get editable(){return e.editable},get dataPath(){return[...b,t().label]},get activeQuery(){return e.activeQuery},get itemsDeletable(){return h()===`array`||h()===`Iterable`||h()===`object`}})})),L(()=>D(t,r().subEntry)),t}}),j(P,{get when(){return y().length>1},get children(){var t=rl();return f(t,j(ne,{get each(){return y()},children:(t,n)=>(()=>{var i=cl(),a=i.firstChild,o=a.firstChild,s=o.firstChild,c=s.nextSibling,l=c.nextSibling.nextSibling;return l.nextSibling,o.$$click=()=>d(e=>e.includes(n)?e.filter(e=>e!==n):[...e,n]),f(o,j(ul,{get expanded(){return u().includes(n)}}),s),f(o,n*100,c),f(o,n*100+100-1,l),f(a,j(P,{get when(){return u().includes(n)},get children(){var n=rl();return f(n,j(Tt,{get each(){return t()},by:e=>e.label,children:t=>j(gl,{get defaultExpanded(){return e.defaultExpanded},get label(){return t().label},get value(){return t().value},get editable(){return e.editable},get dataPath(){return[...b,t().label]},get activeQuery(){return e.activeQuery}})})),L(()=>D(n,r().subEntry)),n}}),null),L(e=>{var t=r().entry,n=r().expanderButton;return t!==e.e&&D(a,e.e=t),n!==e.t&&D(o,e.t=n),e},{e:void 0,t:void 0}),i})()})),L(()=>D(t,r().subEntry)),t}})]}})]}}),null),f(t,j(P,{get when(){return y().length===0},get children(){var t=sl(),n=t.firstChild,o=n.firstChild;return v(n,`for`,x),f(n,()=>e.label,o),f(t,j(P,{get when(){return a(()=>!!(e.editable&&e.activeQuery!==void 0))()&&(h()===`string`||h()===`number`||h()===`boolean`)},get fallback(){return(()=>{var t=ol();return f(t,()=>_(e.value)),L(()=>D(t,r().value)),t})()},get children(){return[j(P,{get when(){return a(()=>!!(e.editable&&e.activeQuery!==void 0))()&&(h()===`string`||h()===`number`)},get children(){var t=al();return t.addEventListener(`change`,t=>{let n=e.activeQuery.state.data,r=m(n,b,h()===`number`?t.target.valueAsNumber:t.target.value);i.setQueryData(e.activeQuery.queryKey,r)}),v(t,`id`,x),L(e=>{var n=h()===`number`?`number`:`text`,i=W(r().value,r().editableInput);return n!==e.e&&v(t,`type`,e.e=n),i!==e.t&&D(t,e.t=i),e},{e:void 0,t:void 0}),L(()=>t.value=e.value),t}}),j(P,{get when(){return h()===`boolean`},get children(){var t=ol();return f(t,j(ml,{get activeQuery(){return e.activeQuery},dataPath:b,get value(){return e.value}}),null),f(t,()=>_(e.value),null),L(()=>D(t,W(r().value,r().actions,r().editableInput))),t}})]}}),null),f(t,j(P,{get when(){return a(()=>!!(e.editable&&e.itemsDeletable))()&&e.activeQuery!==void 0},get children(){return j(pl,{get activeQuery(){return e.activeQuery},dataPath:b})}}),null),L(e=>{var i=r().row,a=r().label;return i!==e.e&&D(t,e.e=i),a!==e.t&&D(n,e.t=a),e},{e:void 0,t:void 0}),t}}),null),L(()=>D(t,r().entry)),t})()}var _l=(e,t)=>{let{colors:n,font:r,size:i,border:a}=Q,o=(t,n)=>e===`light`?t:n;return{entry:t`
      & * {
        font-size: ${r.size.xs};
        font-family:
          ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
      }
      position: relative;
      outline: none;
      word-break: break-word;
    `,subEntry:t`
      margin: 0 0 0 0.5em;
      padding-left: 0.75em;
      border-left: 2px solid ${o(n.gray[300],n.darkGray[400])};
      /* outline: 1px solid ${n.teal[400]}; */
    `,expander:t`
      & path {
        stroke: ${n.gray[400]};
      }
      & svg {
        width: ${i[3]};
        height: ${i[3]};
      }
      display: inline-flex;
      align-items: center;
      transition: all 0.1s ease;
      /* outline: 1px solid ${n.blue[400]}; */
    `,expanderButtonContainer:t`
      display: flex;
      align-items: center;
      line-height: ${i[4]};
      min-height: ${i[4]};
      gap: ${i[2]};
    `,expanderButton:t`
      cursor: pointer;
      color: inherit;
      font: inherit;
      outline: inherit;
      height: ${i[5]};
      background: transparent;
      border: none;
      padding: 0;
      display: inline-flex;
      align-items: center;
      gap: ${i[1]};
      position: relative;
      /* outline: 1px solid ${n.green[400]}; */

      &:focus-visible {
        border-radius: ${a.radius.xs};
        outline: 2px solid ${n.blue[800]};
      }

      & svg {
        position: relative;
        left: 1px;
      }
    `,info:t`
      color: ${o(n.gray[500],n.gray[500])};
      font-size: ${r.size.xs};
      margin-left: ${i[1]};
      /* outline: 1px solid ${n.yellow[400]}; */
    `,label:t`
      color: ${o(n.gray[700],n.gray[300])};
      white-space: nowrap;
    `,value:t`
      color: ${o(n.purple[600],n.purple[400])};
      flex-grow: 1;
    `,actions:t`
      display: inline-flex;
      gap: ${i[2]};
      align-items: center;
    `,row:t`
      display: inline-flex;
      gap: ${i[2]};
      width: 100%;
      margin: ${i[.25]} 0px;
      line-height: ${i[4.5]};
      align-items: center;
    `,editableInput:t`
      border: none;
      padding: ${i[.5]} ${i[1]} ${i[.5]} ${i[1.5]};
      flex-grow: 1;
      border-radius: ${a.radius.xs};
      background-color: ${o(n.gray[200],n.darkGray[500])};

      &:hover {
        background-color: ${o(n.gray[300],n.darkGray[600])};
      }
    `,actionButton:t`
      background-color: transparent;
      color: ${o(n.gray[500],n.gray[500])};
      border: none;
      display: inline-flex;
      padding: 0px;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: ${i[3]};
      height: ${i[3]};
      position: relative;
      z-index: 1;

      &:hover svg {
        color: ${o(n.gray[600],n.gray[400])};
      }

      &:focus-visible {
        border-radius: ${a.radius.xs};
        outline: 2px solid ${n.blue[800]};
        outline-offset: 2px;
      }
    `}},vl=e=>_l(`light`,e),yl=e=>_l(`dark`,e);r([`click`]);var bl=b(`<div><div aria-hidden=true></div><button type=button aria-label="Open Tanstack query devtools"class=tsqd-open-btn>`),xl=b(`<div>`),Sl=b(`<div style=--tsqd-font-size:16px;max-height:100vh;height:100vh;width:100vw>`),Cl=b(`<aside aria-label="Tanstack query devtools"><div role=separator aria-label="Resize devtools panel"tabindex=0></div><button aria-label="Close tanstack query devtools">`),wl=b(`<select name=tsqd-queries-filter-sort aria-label="Sort queries by">`),Tl=b(`<select name=tsqd-mutations-filter-sort aria-label="Sort mutations by">`),El=b(`<span>Asc`),Dl=b(`<span>Desc`),Ol=b(`<button aria-label="Open in picture-in-picture mode"title="Open in picture-in-picture mode">`),kl=b(`<div>Settings`),Al=b(`<span>Position`),jl=b(`<span>Top`),Ml=b(`<span>Bottom`),Nl=b(`<span>Left`),Pl=b(`<span>Right`),Fl=b(`<span>Theme`),Il=b(`<span>Light`),Ll=b(`<span>Dark`),Rl=b(`<span>System`),zl=b(`<span>Disabled Queries`),Bl=b(`<span>Show`),Vl=b(`<span>Hide`),Hl=b(`<div><div class=tsqd-queries-container>`),Ul=b(`<div><div class=tsqd-mutations-container>`),Wl=b(`<div><div><div><button aria-label="Close Tanstack query devtools"><span>TANSTACK</span><span> v</span></button></div></div><div><div><div><input aria-label="Filter queries by query key"type=text placeholder=Filter name=tsqd-query-filter-input></div><div></div><button class=tsqd-query-filter-sort-order-btn></button></div><div><button aria-label="Clear query cache"></button><button>`),Gl=b(`<option>Sort by `),Kl=b(`<div class=tsqd-query-disabled-indicator aria-hidden=true>disabled`),ql=b(`<div class=tsqd-query-static-indicator aria-hidden=true>static`),Jl=b(`<button><div></div><code class=tsqd-query-hash>`),Yl=b(`<div role=tooltip id=tsqd-status-tooltip>`),Xl=b(`<span>`),Zl=b(`<button><span aria-hidden=true></span><span>`),Ql=b(`<button><span aria-hidden=true></span> Error`),$l=b(`<div><span aria-hidden=true></span>Trigger Error<select aria-label="Select error type to trigger"><option value disabled selected>`),eu=b(`<div class="tsqd-query-details-explorer-container tsqd-query-details-data-explorer">`),tu=b(`<form><textarea name=data aria-label="Edit query data as JSON"></textarea><div><span></span><div><button type=button>Cancel</button><button>Save`),nu=b(`<div><div role=heading aria-level=2>Query Details</div><div><div class=tsqd-query-details-summary><pre><code></code></pre><span role=status aria-live=polite></span></div><div class=tsqd-query-details-observers-count><span>Observers:</span><span></span></div><div class=tsqd-query-details-last-updated><span>Last Updated:</span><span></span></div></div><div role=heading aria-level=2>Actions</div><div><button><span aria-hidden=true></span>Refetch</button><button><span aria-hidden=true></span>Invalidate</button><button><span aria-hidden=true></span>Reset</button><button><span aria-hidden=true></span>Remove</button><button><span aria-hidden=true></span> Loading</button></div><div role=heading aria-level=2>Data </div><div role=heading aria-level=2>Query Explorer</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer">`),ru=b(`<option>`),iu=b(`<div><div role=heading aria-level=2>Mutation Details</div><div><div class=tsqd-query-details-summary><pre><code></code></pre><span role=status aria-live=polite></span></div><div class=tsqd-query-details-last-updated><span>Submitted At:</span><span></span></div></div><div role=heading aria-level=2>Variables Details</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer"></div><div role=heading aria-level=2>Context Details</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer"></div><div role=heading aria-level=2>Data Explorer</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer"></div><div role=heading aria-level=2>Mutations Explorer</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer">`),[au,ou]=I(null),[su,cu]=I(null),[lu,uu]=I(0),[du,fu]=I(!1),pu=t=>{let r=V(),i=B().shadowDOMTarget?U.bind({target:B().shadowDOMTarget}):U,o=F(()=>r()===`dark`?Nu(i):Mu(i)),s=F(()=>B().onlineManager);n(()=>{let e=s().subscribe(e=>{fu(!e)});R(()=>{e()})});let c=Be(),l=F(()=>B().buttonPosition||De),u=F(()=>t.localStore.open===`true`?!0:t.localStore.open===`false`?!1:B().initialIsOpen||ke),d=F(()=>t.localStore.position||B().position||Oe),p;C(()=>{let e=p.parentElement,n=t.localStore.height||Ae,r=t.localStore.width||Me,i=d();e.style.setProperty(`--tsqd-panel-height`,`${i===`top`?`-`:``}${n}px`),e.style.setProperty(`--tsqd-panel-width`,`${i===`left`?`-`:``}${r}px`)}),n(()=>{let e=()=>{let e=p.parentElement,t=getComputedStyle(e).fontSize;e.style.setProperty(`--tsqd-font-size`,t)};e(),window.addEventListener(`focus`,e),R(()=>{window.removeEventListener(`focus`,e)})});let m=F(()=>t.localStore.pip_open??`false`);return[j(P,{get when(){return a(()=>!!c().pipWindow)()&&m()==`true`},get children(){return j(oe,{get mount(){return c().pipWindow?.document.body},get children(){return j(mu,{get children(){return j(gu,t)}})}})}}),(()=>{var n=xl(),r=p;return typeof r==`function`?e(r,n):p=n,f(n,j(xt,{name:`tsqd-panel-transition`,get children(){return j(P,{get when(){return a(()=>!!(u()&&!c().pipWindow))()&&m()==`false`},get children(){return j(hu,{get localStore(){return t.localStore},get setLocalStore(){return t.setLocalStore}})}})}}),null),f(n,j(xt,{name:`tsqd-button-transition`,get children(){return j(P,{get when(){return!u()},get children(){var e=bl(),n=e.firstChild,r=n.nextSibling;return f(n,j(Xc,{})),r.$$click=()=>t.setLocalStore(`open`,`true`),f(r,j(Xc,{})),L(()=>D(e,W(o().devtoolsBtn,o()[`devtoolsBtn-position-${l()}`],`tsqd-open-btn-container`))),e}})}}),null),L(()=>D(n,W(i`
            & .tsqd-panel-transition-exit-active,
            & .tsqd-panel-transition-enter-active {
              transition:
                opacity 0.3s,
                transform 0.3s;
            }

            & .tsqd-panel-transition-exit-to,
            & .tsqd-panel-transition-enter {
              ${d()===`top`||d()===`bottom`?`transform: translateY(var(--tsqd-panel-height));`:`transform: translateX(var(--tsqd-panel-width));`}
            }

            & .tsqd-button-transition-exit-active,
            & .tsqd-button-transition-enter-active {
              transition:
                opacity 0.3s,
                transform 0.3s;
              opacity: 1;
            }

            & .tsqd-button-transition-exit-to,
            & .tsqd-button-transition-enter {
              transform: ${l()===`relative`?`none;`:l()===`top-left`?`translateX(-72px);`:l()===`top-right`?`translateX(72px);`:`translateY(72px);`};
              opacity: 0;
            }
          `,`tsqd-transitions-container`))),n})()]},mu=e=>{let t=Be(),n=V(),r=B().shadowDOMTarget?U.bind({target:B().shadowDOMTarget}):U,i=F(()=>n()===`dark`?Nu(r):Mu(r)),a=()=>{let{colors:e}=Q,t=(e,t)=>n()===`dark`?t:e;return lu()<Te?r`
        flex-direction: column;
        background-color: ${t(e.gray[300],e.gray[600])};
      `:r`
      flex-direction: row;
      background-color: ${t(e.gray[200],e.darkGray[900])};
    `};return C(()=>{let e=t().pipWindow,n=()=>{e&&uu(e.innerWidth)};e&&(e.addEventListener(`resize`,n),n()),R(()=>{e&&e.removeEventListener(`resize`,n)})}),(()=>{var t=Sl();return f(t,()=>e.children),L(()=>D(t,W(i().panel,a(),{[r`
            min-width: min-content;
          `]:lu()<Ee},`tsqd-main-panel`))),t})()},hu=t=>{let r=V(),i=B().shadowDOMTarget?U.bind({target:B().shadowDOMTarget}):U,a=F(()=>r()===`dark`?Nu(i):Mu(i)),o;n(()=>{o.focus()});let[s,c]=I(!1),l=F(()=>t.localStore.position||B().position||Oe),u=e=>{let n=e.currentTarget.parentElement;if(!n)return;c(!0);let{height:r,width:i}=n.getBoundingClientRect(),a=e.clientX,o=e.clientY,u=0,d=M(3.5),f=M(12),p=e=>{if(e.preventDefault(),l()===`left`||l()===`right`){let r=l()===`right`?a-e.clientX:e.clientX-a;u=Math.round(i+r),u<f&&(u=f),t.setLocalStore(`width`,String(Math.round(u)));let o=n.getBoundingClientRect().width;Number(t.localStore.width)<o&&t.setLocalStore(`width`,String(o))}else{let n=l()===`bottom`?o-e.clientY:e.clientY-o;u=Math.round(r+n),u<d&&(u=d,ou(null)),t.setLocalStore(`height`,String(Math.round(u)))}},m=()=>{s()&&c(!1),document.removeEventListener(`mousemove`,p,!1),document.removeEventListener(`mouseup`,m,!1)};document.addEventListener(`mousemove`,p,!1),document.addEventListener(`mouseup`,m,!1)},p;n(()=>{kt(p,({width:e},t)=>{t===p&&uu(e)})}),C(()=>{let e=p.parentElement?.parentElement?.parentElement;if(!e)return;let n=d(`padding`,t.localStore.position||Oe),r=t.localStore.position===`left`||t.localStore.position===`right`,i=(({padding:e,paddingTop:t,paddingBottom:n,paddingLeft:r,paddingRight:i})=>({padding:e,paddingTop:t,paddingBottom:n,paddingLeft:r,paddingRight:i}))(e.style);e.style[n]=`${r?t.localStore.width:t.localStore.height}px`,R(()=>{Object.entries(i).forEach(([t,n])=>{e.style[t]=n})})});let m=()=>{let{colors:e}=Q,t=(e,t)=>r()===`dark`?t:e;return lu()<Te?i`
        flex-direction: column;
        background-color: ${t(e.gray[300],e.gray[600])};
      `:i`
      flex-direction: row;
      background-color: ${t(e.gray[200],e.darkGray[900])};
    `};return(()=>{var n=Cl(),r=n.firstChild,s=r.nextSibling,c=p;typeof c==`function`?e(c,n):p=n,r.$$keydown=e=>{let n=M(3.5),r=M(12);if(l()===`top`||l()===`bottom`){if(e.key===`ArrowUp`||e.key===`ArrowDown`){e.preventDefault();let r=Number(t.localStore.height||Ae),i=l()===`bottom`?e.key===`ArrowUp`?10:-10:e.key===`ArrowDown`?10:-10,a=Math.max(n,r+i);t.setLocalStore(`height`,String(a))}}else if(e.key===`ArrowLeft`||e.key===`ArrowRight`){e.preventDefault();let n=Number(t.localStore.width||Me),i=l()===`right`?e.key===`ArrowLeft`?10:-10:e.key===`ArrowRight`?10:-10,a=Math.max(r,n+i);t.setLocalStore(`width`,String(a))}},r.$$mousedown=u,s.$$click=()=>t.setLocalStore(`open`,`false`);var d=o;return typeof d==`function`?e(d,s):o=s,f(s,j(Oc,{})),f(n,j(gu,t),null),L(e=>{var o=W(a().panel,a()[`panel-position-${l()}`],m(),{[i`
            min-width: min-content;
          `]:lu()<Ee&&(l()===`right`||l()===`left`)},`tsqd-main-panel`),c=l()===`bottom`||l()===`top`?`${t.localStore.height||Ae}px`:`auto`,u=l()===`right`||l()===`left`?`${t.localStore.width||Me}px`:`auto`,d=l()===`top`||l()===`bottom`?`horizontal`:`vertical`,f=l()===`top`||l()===`bottom`?M(3.5):M(12),p=l()===`top`||l()===`bottom`?Number(t.localStore.height||Ae):Number(t.localStore.width||Me),h=W(a().dragHandle,a()[`dragHandle-position-${l()}`],`tsqd-drag-handle`),g=W(a().closeBtn,a()[`closeBtn-position-${l()}`],`tsqd-minimize-btn`);return o!==e.e&&D(n,e.e=o),c!==e.t&&y(n,`height`,e.t=c),u!==e.a&&y(n,`width`,e.a=u),d!==e.o&&v(r,`aria-orientation`,e.o=d),f!==e.i&&v(r,`aria-valuemin`,e.i=f),p!==e.n&&v(r,`aria-valuenow`,e.n=p),h!==e.s&&D(r,e.s=h),g!==e.h&&D(s,e.h=g),e},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0}),n})()},gu=t=>{Tu(),Du();let n,r=V(),i=B().shadowDOMTarget?U.bind({target:B().shadowDOMTarget}):U,o=F(()=>r()===`dark`?Nu(i):Mu(i)),s=Be(),[c,d]=I(`queries`),p=F(()=>t.localStore.sort||Ne),m=F(()=>Number(t.localStore.sortOrder)||Pe),g=F(()=>t.localStore.mutationSort||Fe),_=F(()=>Number(t.localStore.mutationSortOrder)||Pe),y=F(()=>l[p()]),b=F(()=>u[g()]),x=F(()=>B().onlineManager),S=F(()=>B().client.getQueryCache()),C=F(()=>B().client.getMutationCache()),w=$(e=>e().getAll().length,!1),T=F(h(()=>[w(),t.localStore.filter,p(),m(),t.localStore.hideDisabledQueries],()=>{let e=S().getAll(),n=t.localStore.filter?e.filter(e=>Ke(e.queryHash,t.localStore.filter||``).passed):[...e];return t.localStore.hideDisabledQueries===`true`&&(n=n.filter(e=>!e.isDisabled())),y()?n.sort((e,t)=>y()(e,t)*m()):n})),E=Ou(e=>e().getAll().length,!1),O=F(h(()=>[E(),t.localStore.mutationFilter,g(),_()],()=>{let e=C().getAll(),n=t.localStore.mutationFilter?e.filter(e=>Ke(`${e.options.mutationKey?JSON.stringify(e.options.mutationKey)+` - `:``}${new Date(e.state.submittedAt).toLocaleString()}`,t.localStore.mutationFilter||``).passed):[...e];return b()?n.sort((e,t)=>b()(e,t)*_()):n})),ee=e=>{t.setLocalStore(`position`,e)},k=e=>{let t=getComputedStyle(n).getPropertyValue(`--tsqd-font-size`);e.style.setProperty(`--tsqd-font-size`,t)};return[(()=>{var r=Wl(),h=r.firstChild,y=h.firstChild,b=y.firstChild,w=b.firstChild,E=w.nextSibling,te=E.firstChild,ne=h.nextSibling,A=ne.firstChild,re=A.firstChild,ie=re.firstChild,ae=re.nextSibling,oe=ae.nextSibling,M=A.nextSibling,N=M.firstChild,se=N.nextSibling,ce=n;return typeof ce==`function`?e(ce,r):n=r,b.$$click=()=>{if(!s().pipWindow&&!t.showPanelViewOnly){t.setLocalStore(`open`,`false`);return}t.onClose&&t.onClose()},f(E,()=>B().queryFlavor,te),f(E,()=>B().version,null),f(y,j(Ko.Root,{get class(){return W(o().viewToggle)},get value(){return c()},"aria-label":`Toggle between queries and mutations view`,onChange:e=>{d(e),ou(null),cu(null)},get children(){return[j(Ko.Item,{value:`queries`,class:`tsqd-radio-toggle`,get children(){return[j(Ko.ItemInput,{}),j(Ko.ItemControl,{get children(){return j(Ko.ItemIndicator,{})}}),j(Ko.ItemLabel,{title:`Toggle Queries View`,children:`Queries`})]}}),j(Ko.Item,{value:`mutations`,class:`tsqd-radio-toggle`,get children(){return[j(Ko.ItemInput,{}),j(Ko.ItemControl,{get children(){return j(Ko.ItemIndicator,{})}}),j(Ko.ItemLabel,{title:`Toggle Mutations View`,children:`Mutations`})]}})]}}),null),f(h,j(P,{get when(){return c()===`queries`},get children(){return j(yu,{})}}),null),f(h,j(P,{get when(){return c()===`mutations`},get children(){return j(bu,{})}}),null),f(re,j(Ec,{}),ie),ie.$$input=e=>{c()===`queries`?t.setLocalStore(`filter`,e.currentTarget.value):t.setLocalStore(`mutationFilter`,e.currentTarget.value)},f(ae,j(P,{get when(){return c()===`queries`},get children(){var e=wl();return e.addEventListener(`change`,e=>{t.setLocalStore(`sort`,e.currentTarget.value)}),f(e,()=>Object.keys(l).map(e=>(()=>{var t=Gl();return t.firstChild,t.value=e,f(t,e,null),t})())),L(()=>e.value=p()),e}}),null),f(ae,j(P,{get when(){return c()===`mutations`},get children(){var e=Tl();return e.addEventListener(`change`,e=>{t.setLocalStore(`mutationSort`,e.currentTarget.value)}),f(e,()=>Object.keys(u).map(e=>(()=>{var t=Gl();return t.firstChild,t.value=e,f(t,e,null),t})())),L(()=>e.value=g()),e}}),null),f(ae,j(Oc,{}),null),oe.$$click=()=>{c()===`queries`?t.setLocalStore(`sortOrder`,String(m()*-1)):t.setLocalStore(`mutationSortOrder`,String(_()*-1))},f(oe,j(P,{get when(){return(c()===`queries`?m():_())===1},get children(){return[El(),j(kc,{})]}}),null),f(oe,j(P,{get when(){return(c()===`queries`?m():_())===-1},get children(){return[Dl(),j(Ac,{})]}}),null),N.$$click=()=>{c()===`queries`?(Au({type:`CLEAR_QUERY_CACHE`}),S().clear()):(Au({type:`CLEAR_MUTATION_CACHE`}),C().clear())},f(N,j(Dc,{})),se.$$click=()=>{x().setOnline(!x().isOnline())},f(se,(()=>{var e=a(()=>!!du());return()=>e()?j(Lc,{}):j(Ic,{})})()),f(M,j(P,{get when(){return a(()=>!s().pipWindow)()&&!s().disabled},get children(){var e=Ol();return e.$$click=()=>{s().requestPipWindow(Number(window.innerWidth),Number(t.localStore.height??500))},f(e,j(zc,{})),L(()=>D(e,W(o().actionsBtn,`tsqd-actions-btn`,`tsqd-action-open-pip`))),e}}),null),f(M,j(Z.Root,{gutter:4,get children(){return[j(Z.Trigger,{get class(){return W(o().actionsBtn,`tsqd-actions-btn`,`tsqd-action-settings`)},"aria-label":`Open settings menu`,title:`Open settings menu`,get children(){return j(Rc,{})}}),j(Z.Portal,{ref:e=>k(e),get mount(){return a(()=>!!s().pipWindow)()?s().pipWindow.document.body:document.body},get children(){return j(Z.Content,{get class(){return W(o().settingsMenu,`tsqd-settings-menu`)},get children(){return[(()=>{var e=kl();return L(()=>D(e,W(o().settingsMenuHeader,`tsqd-settings-menu-header`))),e})(),j(P,{get when(){return!t.showPanelViewOnly},get children(){return j(Z.Sub,{overlap:!0,gutter:8,shift:-4,get children(){return[j(Z.SubTrigger,{get class(){return W(o().settingsSubTrigger,`tsqd-settings-menu-sub-trigger`,`tsqd-settings-menu-sub-trigger-position`)},get children(){return[Al(),j(Oc,{})]}}),j(Z.Portal,{ref:e=>k(e),get mount(){return a(()=>!!s().pipWindow)()?s().pipWindow.document.body:document.body},get children(){return j(Z.SubContent,{get class(){return W(o().settingsMenu,`tsqd-settings-submenu`)},get children(){return j(Z.RadioGroup,{"aria-label":`Position settings`,get value(){return t.localStore.position},onChange:e=>ee(e),get children(){return[j(Z.RadioItem,{value:`top`,get class(){return W(o().settingsSubButton,`tsqd-settings-menu-position-btn`,`tsqd-settings-menu-position-btn-top`)},get children(){return[jl(),j(kc,{})]}}),j(Z.RadioItem,{value:`bottom`,get class(){return W(o().settingsSubButton,`tsqd-settings-menu-position-btn`,`tsqd-settings-menu-position-btn-bottom`)},get children(){return[Ml(),j(Ac,{})]}}),j(Z.RadioItem,{value:`left`,get class(){return W(o().settingsSubButton,`tsqd-settings-menu-position-btn`,`tsqd-settings-menu-position-btn-left`)},get children(){return[Nl(),j(jc,{})]}}),j(Z.RadioItem,{value:`right`,get class(){return W(o().settingsSubButton,`tsqd-settings-menu-position-btn`,`tsqd-settings-menu-position-btn-right`)},get children(){return[Pl(),j(Mc,{})]}})]}})}})}})]}})}}),j(Z.Sub,{overlap:!0,gutter:8,shift:-4,get children(){return[j(Z.SubTrigger,{get class(){return W(o().settingsSubTrigger,`tsqd-settings-menu-sub-trigger`,`tsqd-settings-menu-sub-trigger-theme`)},get children(){return[Fl(),j(Oc,{})]}}),j(Z.Portal,{ref:e=>k(e),get mount(){return a(()=>!!s().pipWindow)()?s().pipWindow.document.body:document.body},get children(){return j(Z.SubContent,{get class(){return W(o().settingsMenu,`tsqd-settings-submenu`)},get children(){return j(Z.RadioGroup,{get value(){return t.localStore.theme_preference},onChange:e=>{t.setLocalStore(`theme_preference`,e)},"aria-label":`Theme preference`,get children(){return[j(Z.RadioItem,{value:`light`,get class(){return W(o().settingsSubButton,`tsqd-settings-menu-position-btn`,`tsqd-settings-menu-position-btn-top`)},get children(){return[Il(),j(Nc,{})]}}),j(Z.RadioItem,{value:`dark`,get class(){return W(o().settingsSubButton,`tsqd-settings-menu-position-btn`,`tsqd-settings-menu-position-btn-bottom`)},get children(){return[Ll(),j(Pc,{})]}}),j(Z.RadioItem,{value:`system`,get class(){return W(o().settingsSubButton,`tsqd-settings-menu-position-btn`,`tsqd-settings-menu-position-btn-left`)},get children(){return[Rl(),j(Fc,{})]}})]}})}})}})]}}),j(Z.Sub,{overlap:!0,gutter:8,shift:-4,get children(){return[j(Z.SubTrigger,{get class(){return W(o().settingsSubTrigger,`tsqd-settings-menu-sub-trigger`,`tsqd-settings-menu-sub-trigger-disabled-queries`)},get children(){return[zl(),j(Oc,{})]}}),j(Z.Portal,{ref:e=>k(e),get mount(){return a(()=>!!s().pipWindow)()?s().pipWindow.document.body:document.body},get children(){return j(Z.SubContent,{get class(){return W(o().settingsMenu,`tsqd-settings-submenu`)},get children(){return j(Z.RadioGroup,{get value(){return t.localStore.hideDisabledQueries},"aria-label":`Hide disabled queries setting`,onChange:e=>t.setLocalStore(`hideDisabledQueries`,e),get children(){return[j(Z.RadioItem,{value:`false`,get class(){return W(o().settingsSubButton,`tsqd-settings-menu-position-btn`,`tsqd-settings-menu-position-btn-show`)},get children(){return[Bl(),j(P,{get when(){return t.localStore.hideDisabledQueries!==`true`},get children(){return j(Kc,{})}})]}}),j(Z.RadioItem,{value:`true`,get class(){return W(o().settingsSubButton,`tsqd-settings-menu-position-btn`,`tsqd-settings-menu-position-btn-hide`)},get children(){return[Vl(),j(P,{get when(){return t.localStore.hideDisabledQueries===`true`},get children(){return j(Kc,{})}})]}})]}})}})}})]}})]}})}})]}}),null),f(r,j(P,{get when(){return c()===`queries`},get children(){var e=Hl(),t=e.firstChild;return f(t,j(Tt,{by:e=>e.queryHash,get each(){return T()},children:e=>j(_u,{get query(){return e()}})})),L(()=>D(e,W(o().overflowQueryContainer,`tsqd-queries-overflow-container`))),e}}),null),f(r,j(P,{get when(){return c()===`mutations`},get children(){var e=Ul(),t=e.firstChild;return f(t,j(Tt,{by:e=>e.mutationId,get each(){return O()},children:e=>j(vu,{get mutation(){return e()}})})),L(()=>D(e,W(o().overflowQueryContainer,`tsqd-mutations-overflow-container`))),e}}),null),L(e=>{var t=W(o().queriesContainer,lu()<Te&&(au()||su())&&i`
              height: 50%;
              max-height: 50%;
            `,lu()<Te&&!(au()||su())&&i`
              height: 100%;
              max-height: 100%;
            `,`tsqd-queries-container`),n=W(o().row,`tsqd-header`),a=o().logoAndToggleContainer,s=W(o().logo,`tsqd-text-logo-container`),l=W(o().tanstackLogo,`tsqd-text-logo-tanstack`),u=W(o().queryFlavorLogo,`tsqd-text-logo-query-flavor`),d=W(o().row,`tsqd-filters-actions-container`),f=W(o().filtersContainer,`tsqd-filters-container`),p=W(o().filterInput,`tsqd-query-filter-textfield-container`),g=W(`tsqd-query-filter-textfield`),x=W(o().filterSelect,`tsqd-query-filter-sort-container`),S=`Sort order ${(c()===`queries`?m():_())===-1?`descending`:`ascending`}`,C=(c()===`queries`?m():_())===-1,T=W(o().actionsContainer,`tsqd-actions-container`),O=W(o().actionsBtn,`tsqd-actions-btn`,`tsqd-action-clear-cache`),ee=`Clear ${c()} cache`,k=W(o().actionsBtn,du()&&o().actionsBtnOffline,`tsqd-actions-btn`,`tsqd-action-mock-offline-behavior`),te=`${du()?`Unset offline mocking behavior`:`Mock offline behavior`}`,j=du(),P=`${du()?`Unset offline mocking behavior`:`Mock offline behavior`}`;return t!==e.e&&D(r,e.e=t),n!==e.t&&D(h,e.t=n),a!==e.a&&D(y,e.a=a),s!==e.o&&D(b,e.o=s),l!==e.i&&D(w,e.i=l),u!==e.n&&D(E,e.n=u),d!==e.s&&D(ne,e.s=d),f!==e.h&&D(A,e.h=f),p!==e.r&&D(re,e.r=p),g!==e.d&&D(ie,e.d=g),x!==e.l&&D(ae,e.l=x),S!==e.u&&v(oe,`aria-label`,e.u=S),C!==e.c&&v(oe,`aria-pressed`,e.c=C),T!==e.w&&D(M,e.w=T),O!==e.m&&D(N,e.m=O),ee!==e.f&&v(N,`title`,e.f=ee),k!==e.y&&D(se,e.y=k),te!==e.g&&v(se,`aria-label`,e.g=te),j!==e.p&&v(se,`aria-pressed`,e.p=j),P!==e.b&&v(se,`title`,e.b=P),e},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0,l:void 0,u:void 0,c:void 0,w:void 0,m:void 0,f:void 0,y:void 0,g:void 0,p:void 0,b:void 0}),L(()=>ie.value=c()===`queries`?t.localStore.filter||``:t.localStore.mutationFilter||``),r})(),j(P,{get when(){return a(()=>c()===`queries`)()&&au()},get children(){return j(Su,{})}}),j(P,{get when(){return a(()=>c()===`mutations`)()&&su()},get children(){return j(Cu,{})}})]},_u=e=>{let t=V(),n=B().shadowDOMTarget?U.bind({target:B().shadowDOMTarget}):U,r=F(()=>t()===`dark`?Nu(n):Mu(n)),{colors:i,alpha:a}=Q,o=(e,n)=>t()===`dark`?n:e,s=$(t=>t().get(e.query.queryHash)?.state,!0,t=>t.query.queryHash===e.query.queryHash),c=$(t=>t().get(e.query.queryHash)?.isDisabled()??!1,!0,t=>t.query.queryHash===e.query.queryHash),l=$(t=>t().get(e.query.queryHash)?.isStatic()??!1,!0,t=>t.query.queryHash===e.query.queryHash),u=$(t=>t().get(e.query.queryHash)?.isStale()??!1,!0,t=>t.query.queryHash===e.query.queryHash),d=$(t=>t().get(e.query.queryHash)?.getObserversCount()??0,!0,t=>t.query.queryHash===e.query.queryHash),p=F(()=>re({queryState:s(),observerCount:d(),isStale:u()})),m=()=>p()===`gray`?n`
        background-color: ${o(i[p()][200],i[p()][700])};
        color: ${o(i[p()][700],i[p()][300])};
      `:n`
      background-color: ${o(i[p()][200]+a[80],i[p()][900])};
      color: ${o(i[p()][800],i[p()][300])};
    `;return j(P,{get when(){return s()},get children(){var t=Jl(),n=t.firstChild,i=n.nextSibling;return t.$$click=()=>ou(e.query.queryHash===au()?null:e.query.queryHash),f(n,d),f(i,()=>e.query.queryHash),f(t,j(P,{get when(){return c()},get children(){return Kl()}}),null),f(t,j(P,{get when(){return l()},get children(){return ql()}}),null),L(i=>{var a=W(r().queryRow,au()===e.query.queryHash&&r().selectedQueryRow,`tsqd-query-row`),o=`Query key ${e.query.queryHash}${c()?`, disabled`:``}${l()?`, static`:``}`,s=W(m(),`tsqd-query-observer-count`);return a!==i.e&&D(t,i.e=a),o!==i.t&&v(t,`aria-label`,i.t=o),s!==i.a&&D(n,i.a=s),i},{e:void 0,t:void 0,a:void 0}),t}})},vu=e=>{let t=V(),n=B().shadowDOMTarget?U.bind({target:B().shadowDOMTarget}):U,r=F(()=>t()===`dark`?Nu(n):Mu(n)),{colors:o,alpha:s}=Q,c=(e,n)=>t()===`dark`?n:e,l=Ou(t=>t().getAll().find(t=>t.mutationId===e.mutation.mutationId)?.state),u=Ou(t=>{let n=t().getAll().find(t=>t.mutationId===e.mutation.mutationId);return n?n.state.isPaused:!1}),d=Ou(t=>{let n=t().getAll().find(t=>t.mutationId===e.mutation.mutationId);return n?n.state.status:`idle`}),p=F(()=>i({isPaused:u(),status:d()})),m=()=>p()===`gray`?n`
        background-color: ${c(o[p()][200],o[p()][700])};
        color: ${c(o[p()][700],o[p()][300])};
      `:n`
      background-color: ${c(o[p()][200]+s[80],o[p()][900])};
      color: ${c(o[p()][800],o[p()][300])};
    `;return j(P,{get when(){return l()},get children(){var t=Jl(),n=t.firstChild,i=n.nextSibling;return t.$$click=()=>{cu(e.mutation.mutationId===su()?null:e.mutation.mutationId)},f(n,j(P,{get when(){return p()===`purple`},get children(){return j(Yc,{})}}),null),f(n,j(P,{get when(){return p()===`green`},get children(){return j(Kc,{})}}),null),f(n,j(P,{get when(){return p()===`red`},get children(){return j(Jc,{})}}),null),f(n,j(P,{get when(){return p()===`yellow`},get children(){return j(qc,{})}}),null),f(i,j(P,{get when(){return e.mutation.options.mutationKey},get children(){return[a(()=>JSON.stringify(e.mutation.options.mutationKey)),` -`,` `]}}),null),f(i,()=>new Date(e.mutation.state.submittedAt).toLocaleString(),null),L(i=>{var a=W(r().queryRow,su()===e.mutation.mutationId&&r().selectedQueryRow,`tsqd-query-row`),o=`Mutation submitted at ${new Date(e.mutation.state.submittedAt).toLocaleString()}`,s=W(m(),`tsqd-query-observer-count`);return a!==i.e&&D(t,i.e=a),o!==i.t&&v(t,`aria-label`,i.t=o),s!==i.a&&D(n,i.a=s),i},{e:void 0,t:void 0,a:void 0}),t}})},yu=()=>{let e=$(e=>e().getAll().filter(e=>A(e)===`stale`).length),t=$(e=>e().getAll().filter(e=>A(e)===`fresh`).length),n=$(e=>e().getAll().filter(e=>A(e)===`fetching`).length),r=$(e=>e().getAll().filter(e=>A(e)===`paused`).length),i=$(e=>e().getAll().filter(e=>A(e)===`inactive`).length),a=V(),o=B().shadowDOMTarget?U.bind({target:B().shadowDOMTarget}):U,s=F(()=>a()===`dark`?Nu(o):Mu(o));return(()=>{var a=xl();return f(a,j(xu,{label:`Fresh`,color:`green`,get count(){return t()}}),null),f(a,j(xu,{label:`Fetching`,color:`blue`,get count(){return n()}}),null),f(a,j(xu,{label:`Paused`,color:`purple`,get count(){return r()}}),null),f(a,j(xu,{label:`Stale`,color:`yellow`,get count(){return e()}}),null),f(a,j(xu,{label:`Inactive`,color:`gray`,get count(){return i()}}),null),L(()=>D(a,W(s().queryStatusContainer,`tsqd-query-status-container`))),a})()},bu=()=>{let e=Ou(e=>e().getAll().filter(e=>i({isPaused:e.state.isPaused,status:e.state.status})===`green`).length),t=Ou(e=>e().getAll().filter(e=>i({isPaused:e.state.isPaused,status:e.state.status})===`yellow`).length),n=Ou(e=>e().getAll().filter(e=>i({isPaused:e.state.isPaused,status:e.state.status})===`purple`).length),r=Ou(e=>e().getAll().filter(e=>i({isPaused:e.state.isPaused,status:e.state.status})===`red`).length),a=V(),o=B().shadowDOMTarget?U.bind({target:B().shadowDOMTarget}):U,s=F(()=>a()===`dark`?Nu(o):Mu(o));return(()=>{var i=xl();return f(i,j(xu,{label:`Paused`,color:`purple`,get count(){return n()}}),null),f(i,j(xu,{label:`Pending`,color:`yellow`,get count(){return t()}}),null),f(i,j(xu,{label:`Success`,color:`green`,get count(){return e()}}),null),f(i,j(xu,{label:`Error`,color:`red`,get count(){return r()}}),null),L(()=>D(i,W(s().queryStatusContainer,`tsqd-query-status-container`))),i})()},xu=t=>{let n=V(),r=B().shadowDOMTarget?U.bind({target:B().shadowDOMTarget}):U,i=F(()=>n()===`dark`?Nu(r):Mu(r)),{colors:o,alpha:l}=Q,u=(e,t)=>n()===`dark`?t:e,d,[p,m]=I(!1),[h,g]=I(!1),_=F(()=>!(au()&&lu()<we&&lu()>Te||lu()<Te));return(()=>{var n=Zl(),v=n.firstChild,y=v.nextSibling,b=d;return typeof b==`function`?e(b,n):d=n,n.addEventListener(`mouseleave`,()=>{m(!1),g(!1)}),n.addEventListener(`mouseenter`,()=>m(!0)),n.addEventListener(`blur`,()=>g(!1)),n.addEventListener(`focus`,()=>g(!0)),c(n,s({get disabled(){return _()},get"aria-label"(){return`${t.label}: ${t.count}`},get class(){return W(i().queryStatusTag,!_()&&r`
            cursor: pointer;
            &:hover {
              background: ${u(o.gray[200],o.darkGray[400])}${l[80]};
            }
          `,`tsqd-query-status-tag`,`tsqd-query-status-tag-${t.label.toLowerCase()}`)}},()=>p()||h()?{"aria-describedby":`tsqd-status-tooltip`}:{}),!1,!0),f(n,j(P,{get when(){return a(()=>!_())()&&(p()||h())},get children(){var e=Yl();return f(e,()=>t.label),L(()=>D(e,W(i().statusTooltip,`tsqd-query-status-tooltip`))),e}}),v),f(n,j(P,{get when(){return _()},get children(){var e=Xl();return f(e,()=>t.label),L(()=>D(e,W(i().queryStatusTagLabel,`tsqd-query-status-tag-label`))),e}}),y),f(y,()=>t.count),L(e=>{var n=W(r`
            width: ${Q.size[1.5]};
            height: ${Q.size[1.5]};
            border-radius: ${Q.border.radius.full};
            background-color: ${Q.colors[t.color][500]};
          `,`tsqd-query-status-tag-dot`),a=W(i().queryStatusCount,t.count>0&&t.color!==`gray`&&r`
              background-color: ${u(o[t.color][100],o[t.color][900])};
              color: ${u(o[t.color][700],o[t.color][300])};
            `,`tsqd-query-status-tag-count`);return n!==e.e&&D(v,e.e=n),a!==e.t&&D(y,e.t=a),e},{e:void 0,t:void 0}),n})()},Su=()=>{let e=V(),n=B().shadowDOMTarget?U.bind({target:B().shadowDOMTarget}):U,r=F(()=>e()===`dark`?Nu(n):Mu(n)),{colors:i}=Q,o=(t,n)=>e()===`dark`?n:t,s=B().client,[c,l]=I(!1),[u,d]=I(`view`),[p,m]=I(!1),h=F(()=>B().errorTypes||[]),g=$(e=>e().getAll().find(e=>e.queryHash===au()),!1),b=$(e=>e().getAll().find(e=>e.queryHash===au()),!1),x=$(e=>e().getAll().find(e=>e.queryHash===au())?.state,!1),S=$(e=>e().getAll().find(e=>e.queryHash===au())?.state.data,!1),w=$(e=>{let t=e().getAll().find(e=>e.queryHash===au());return t?A(t):`inactive`}),T=$(e=>{let t=e().getAll().find(e=>e.queryHash===au());return t?t.state.status:`pending`}),E=$(e=>e().getAll().find(e=>e.queryHash===au())?.getObserversCount()??0),O=F(()=>t(w())),ee=()=>{Au({type:`REFETCH`,queryHash:g()?.queryHash}),(g()?.fetch())?.catch(()=>{})},k=e=>{let t=g();if(!t)return;Au({type:`TRIGGER_ERROR`,queryHash:t.queryHash,metadata:{error:e?.name}});let n=e?.initializer(t)??Error(`Unknown error from devtools`),r=t.options;t.setState({data:void 0,status:`error`,error:n,fetchMeta:{...t.state.fetchMeta,__previousQueryOptions:r}})},te=()=>{let e=g();if(!e)return;Au({type:`RESTORE_LOADING`,queryHash:e.queryHash});let t=e.state,n=e.state.fetchMeta?e.state.fetchMeta.__previousQueryOptions:null;e.cancel({silent:!0}),e.setState({...t,fetchStatus:`idle`,fetchMeta:null}),n&&e.fetch(n)};C(()=>{w()!==`fetching`&&l(!1)});let ne=()=>O()===`gray`?n`
        background-color: ${o(i[O()][200],i[O()][700])};
        color: ${o(i[O()][700],i[O()][300])};
        border-color: ${o(i[O()][400],i[O()][600])};
      `:n`
      background-color: ${o(i[O()][100],i[O()][900])};
      color: ${o(i[O()][700],i[O()][300])};
      border-color: ${o(i[O()][400],i[O()][600])};
    `;return j(P,{get when(){return a(()=>!!g())()&&x()},get children(){var e=nu(),t=e.firstChild,a=t.nextSibling,C=a.firstChild,O=C.firstChild,A=O.firstChild,re=O.nextSibling,ie=C.nextSibling,ae=ie.firstChild.nextSibling,oe=ie.nextSibling.firstChild.nextSibling,M=a.nextSibling,N=M.nextSibling,ce=N.firstChild,le=ce.firstChild,ue=ce.nextSibling,F=ue.firstChild,de=ue.nextSibling,I=de.firstChild,R=de.nextSibling,fe=R.firstChild,pe=R.nextSibling,me=pe.firstChild,z=me.nextSibling,he=N.nextSibling;he.firstChild;var ge=he.nextSibling,_e=ge.nextSibling;return f(A,()=>_(g().queryKey,!0)),f(re,w),f(ae,E),f(oe,()=>new Date(x().dataUpdatedAt).toLocaleTimeString()),ce.$$click=ee,ue.$$click=()=>{Au({type:`INVALIDATE`,queryHash:g()?.queryHash}),s.invalidateQueries({queryKey:g()?.queryKey,exact:!0})},de.$$click=()=>{Au({type:`RESET`,queryHash:g()?.queryHash}),s.resetQueries({queryKey:g()?.queryKey,exact:!0})},R.$$click=()=>{Au({type:`REMOVE`,queryHash:g()?.queryHash}),s.removeQueries({queryKey:g()?.queryKey,exact:!0}),ou(null)},pe.$$click=()=>{if(g()?.state.data===void 0)l(!0),te();else{let e=g();if(!e)return;Au({type:`TRIGGER_LOADING`,queryHash:e.queryHash});let t=e.options;e.fetch({...t,queryFn:()=>new Promise(()=>{}),gcTime:-1}),e.setState({data:void 0,status:`pending`,fetchMeta:{...e.state.fetchMeta,__previousQueryOptions:t}})}},f(pe,()=>T()===`pending`?`Restore`:`Trigger`,z),f(N,j(P,{get when(){return h().length===0||T()===`error`},get children(){var e=Ql(),t=e.firstChild,r=t.nextSibling;return e.$$click=()=>{g().state.error?(Au({type:`RESTORE_ERROR`,queryHash:g()?.queryHash}),s.resetQueries({queryKey:g()?.queryKey})):k()},f(e,()=>T()===`error`?`Restore`:`Trigger`,r),L(r=>{var a=W(n`
                  color: ${o(i.red[500],i.red[400])};
                `,`tsqd-query-details-actions-btn`,`tsqd-query-details-action-error`),s=T()===`pending`,c=n`
                  background-color: ${o(i.red[500],i.red[400])};
                `;return a!==r.e&&D(e,r.e=a),s!==r.t&&(e.disabled=r.t=s),c!==r.a&&D(t,r.a=c),r},{e:void 0,t:void 0,a:void 0}),e}}),null),f(N,j(P,{get when(){return!(h().length===0||T()===`error`)},get children(){var e=$l(),t=e.firstChild,i=t.nextSibling.nextSibling;return i.firstChild,i.addEventListener(`change`,e=>{let t=h().find(t=>t.name===e.currentTarget.value);k(t)}),f(i,j(se,{get each(){return h()},children:e=>(()=>{var t=ru();return f(t,()=>e.name),L(()=>t.value=e.name),t})()}),null),f(e,j(Oc,{}),null),L(a=>{var o=W(r().actionsSelect,`tsqd-query-details-actions-btn`,`tsqd-query-details-action-error-multiple`),s=n`
                  background-color: ${Q.colors.red[400]};
                `,c=T()===`pending`;return o!==a.e&&D(e,a.e=o),s!==a.t&&D(t,a.t=s),c!==a.a&&(i.disabled=a.a=c),a},{e:void 0,t:void 0,a:void 0}),e}}),null),f(he,()=>u()===`view`?`Explorer`:`Editor`,null),f(e,j(P,{get when(){return u()===`view`},get children(){var e=eu();return f(e,j(gl,{label:`Data`,defaultExpanded:[`Data`],get value(){return S()},editable:!0,onEdit:()=>d(`edit`),get activeQuery(){return g()}})),L(t=>y(e,`padding`,Q.size[2])),e}}),ge),f(e,j(P,{get when(){return u()===`edit`},get children(){var e=tu(),t=e.firstChild,a=t.nextSibling,s=a.firstChild,c=s.nextSibling,l=c.firstChild,u=l.nextSibling;return e.addEventListener(`submit`,e=>{e.preventDefault();let t=new FormData(e.currentTarget).get(`data`);try{let e=JSON.parse(t);g().setState({...g().state,data:e}),d(`view`)}catch{m(!0)}}),t.addEventListener(`focus`,()=>m(!1)),f(s,()=>p()?`Invalid Value`:``),l.$$click=()=>d(`view`),L(d=>{var f=W(r().devtoolsEditForm,`tsqd-query-details-data-editor`),m=r().devtoolsEditTextarea,h=p(),g=r().devtoolsEditFormActions,_=r().devtoolsEditFormError,y=r().devtoolsEditFormActionContainer,b=W(r().devtoolsEditFormAction,n`
                      color: ${o(i.gray[600],i.gray[300])};
                    `),x=W(r().devtoolsEditFormAction,n`
                      color: ${o(i.blue[600],i.blue[400])};
                    `);return f!==d.e&&D(e,d.e=f),m!==d.t&&D(t,d.t=m),h!==d.a&&v(t,`data-error`,d.a=h),g!==d.o&&D(a,d.o=g),_!==d.i&&D(s,d.i=_),y!==d.n&&D(c,d.n=y),b!==d.s&&D(l,d.s=b),x!==d.h&&D(u,d.h=x),d},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0}),L(()=>t.value=JSON.stringify(S(),null,2)),e}}),ge),f(_e,j(gl,{label:`Query`,defaultExpanded:[`Query`,`queryKey`],get value(){return b()}})),L(s=>{var l=W(r().detailsContainer,`tsqd-query-details-container`),u=W(r().detailsHeader,`tsqd-query-details-header`),d=W(r().detailsBody,`tsqd-query-details-summary-container`),f=W(r().queryDetailsStatus,ne()),p=W(r().detailsHeader,`tsqd-query-details-header`),m=W(r().actionsBody,`tsqd-query-details-actions-container`),h=W(n`
                color: ${o(i.blue[600],i.blue[400])};
              `,`tsqd-query-details-actions-btn`,`tsqd-query-details-action-refetch`),g=w()===`fetching`,_=n`
                background-color: ${o(i.blue[600],i.blue[400])};
              `,v=W(n`
                color: ${o(i.yellow[600],i.yellow[400])};
              `,`tsqd-query-details-actions-btn`,`tsqd-query-details-action-invalidate`),b=T()===`pending`,x=n`
                background-color: ${o(i.yellow[600],i.yellow[400])};
              `,S=W(n`
                color: ${o(i.gray[600],i.gray[300])};
              `,`tsqd-query-details-actions-btn`,`tsqd-query-details-action-reset`),C=T()===`pending`,E=n`
                background-color: ${o(i.gray[600],i.gray[400])};
              `,O=W(n`
                color: ${o(i.pink[500],i.pink[400])};
              `,`tsqd-query-details-actions-btn`,`tsqd-query-details-action-remove`),ee=w()===`fetching`,k=n`
                background-color: ${o(i.pink[500],i.pink[400])};
              `,te=W(n`
                color: ${o(i.cyan[500],i.cyan[400])};
              `,`tsqd-query-details-actions-btn`,`tsqd-query-details-action-loading`),A=c(),ie=n`
                background-color: ${o(i.cyan[500],i.cyan[400])};
              `,j=W(r().detailsHeader,`tsqd-query-details-header`),ae=W(r().detailsHeader,`tsqd-query-details-header`),oe=Q.size[2];return l!==s.e&&D(e,s.e=l),u!==s.t&&D(t,s.t=u),d!==s.a&&D(a,s.a=d),f!==s.o&&D(re,s.o=f),p!==s.i&&D(M,s.i=p),m!==s.n&&D(N,s.n=m),h!==s.s&&D(ce,s.s=h),g!==s.h&&(ce.disabled=s.h=g),_!==s.r&&D(le,s.r=_),v!==s.d&&D(ue,s.d=v),b!==s.l&&(ue.disabled=s.l=b),x!==s.u&&D(F,s.u=x),S!==s.c&&D(de,s.c=S),C!==s.w&&(de.disabled=s.w=C),E!==s.m&&D(I,s.m=E),O!==s.f&&D(R,s.f=O),ee!==s.y&&(R.disabled=s.y=ee),k!==s.g&&D(fe,s.g=k),te!==s.p&&D(pe,s.p=te),A!==s.b&&(pe.disabled=s.b=A),ie!==s.T&&D(me,s.T=ie),j!==s.A&&D(he,s.A=j),ae!==s.O&&D(ge,s.O=ae),oe!==s.I&&y(_e,`padding`,s.I=oe),s},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0,l:void 0,u:void 0,c:void 0,w:void 0,m:void 0,f:void 0,y:void 0,g:void 0,p:void 0,b:void 0,T:void 0,A:void 0,O:void 0,I:void 0}),e}})},Cu=()=>{let e=V(),t=B().shadowDOMTarget?U.bind({target:B().shadowDOMTarget}):U,n=F(()=>e()===`dark`?Nu(t):Mu(t)),{colors:r}=Q,a=(t,n)=>e()===`dark`?n:t,o=Ou(e=>{let t=e().getAll().find(e=>e.mutationId===su());return t?t.state.isPaused:!1}),s=Ou(e=>{let t=e().getAll().find(e=>e.mutationId===su());return t?t.state.status:`idle`}),c=F(()=>i({isPaused:o(),status:s()})),l=Ou(e=>e().getAll().find(e=>e.mutationId===su()),!1),u=()=>c()===`gray`?t`
        background-color: ${a(r[c()][200],r[c()][700])};
        color: ${a(r[c()][700],r[c()][300])};
        border-color: ${a(r[c()][400],r[c()][600])};
      `:t`
      background-color: ${a(r[c()][100],r[c()][900])};
      color: ${a(r[c()][700],r[c()][300])};
      border-color: ${a(r[c()][400],r[c()][600])};
    `;return j(P,{get when(){return l()},get children(){var e=iu(),t=e.firstChild,r=t.nextSibling,i=r.firstChild,a=i.firstChild,o=a.firstChild,d=a.nextSibling,p=i.nextSibling.firstChild.nextSibling,m=r.nextSibling,h=m.nextSibling,g=h.nextSibling,v=g.nextSibling,b=v.nextSibling,x=b.nextSibling,S=x.nextSibling,C=S.nextSibling;return f(o,j(P,{get when(){return l().options.mutationKey},fallback:`No mutationKey found`,get children(){return _(l().options.mutationKey,!0)}})),f(d,j(P,{get when(){return c()===`purple`},children:`pending`}),null),f(d,j(P,{get when(){return c()!==`purple`},get children(){return s()}}),null),f(p,()=>new Date(l().state.submittedAt).toLocaleTimeString()),f(h,j(gl,{label:`Variables`,defaultExpanded:[`Variables`],get value(){return l().state.variables}})),f(v,j(gl,{label:`Context`,defaultExpanded:[`Context`],get value(){return l().state.context}})),f(x,j(gl,{label:`Data`,defaultExpanded:[`Data`],get value(){return l().state.data}})),f(C,j(gl,{label:`Mutation`,defaultExpanded:[`Mutation`],get value(){return l()}})),L(i=>{var a=W(n().detailsContainer,`tsqd-query-details-container`),o=W(n().detailsHeader,`tsqd-query-details-header`),s=W(n().detailsBody,`tsqd-query-details-summary-container`),c=W(n().queryDetailsStatus,u()),l=W(n().detailsHeader,`tsqd-query-details-header`),f=Q.size[2],p=W(n().detailsHeader,`tsqd-query-details-header`),_=Q.size[2],w=W(n().detailsHeader,`tsqd-query-details-header`),T=Q.size[2],E=W(n().detailsHeader,`tsqd-query-details-header`),O=Q.size[2];return a!==i.e&&D(e,i.e=a),o!==i.t&&D(t,i.t=o),s!==i.a&&D(r,i.a=s),c!==i.o&&D(d,i.o=c),l!==i.i&&D(m,i.i=l),f!==i.n&&y(h,`padding`,i.n=f),p!==i.s&&D(g,i.s=p),_!==i.h&&y(v,`padding`,i.h=_),w!==i.r&&D(b,i.r=w),T!==i.d&&y(x,`padding`,i.d=T),E!==i.l&&D(S,i.l=E),O!==i.u&&y(C,`padding`,i.u=O),i},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0,l:void 0,u:void 0}),e}})},wu=new Map,Tu=()=>{let e=F(()=>B().client.getQueryCache()),t=e().subscribe(t=>{ue(()=>{for(let[n,r]of wu.entries())r.shouldUpdate(t)&&r.setter(n(e))})});return R(()=>{wu.clear(),t()}),t},$=(e,t=!0,n=()=>!0)=>{let r=F(()=>B().client.getQueryCache()),[i,a]=I(e(r),t?void 0:{equals:!1});return C(()=>{a(e(r))}),wu.set(e,{setter:a,shouldUpdate:n}),R(()=>{wu.delete(e)}),i},Eu=new Map,Du=()=>{let e=F(()=>B().client.getMutationCache()),t=e().subscribe(()=>{for(let[t,n]of Eu.entries())queueMicrotask(()=>{n(t(e))})});return R(()=>{Eu.clear(),t()}),t},Ou=(e,t=!0)=>{let n=F(()=>B().client.getMutationCache()),[r,i]=I(e(n),t?void 0:{equals:!1});return C(()=>{i(e(n))}),Eu.set(e,i),R(()=>{Eu.delete(e)}),r},ku=`@tanstack/query-devtools-event`,Au=({type:e,queryHash:t,metadata:n})=>{let r=new CustomEvent(ku,{detail:{type:e,queryHash:t,metadata:n},bubbles:!0,cancelable:!0});window.dispatchEvent(r)},ju=(e,t)=>{let{colors:n,font:r,size:i,alpha:a,shadow:o,border:s}=Q,c=(t,n)=>e===`light`?t:n;return{devtoolsBtn:t`
      z-index: 100000;
      position: fixed;
      padding: 4px;
      text-align: left;

      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 9999px;
      box-shadow: ${o.md()};
      overflow: hidden;

      & div {
        position: absolute;
        top: -8px;
        left: -8px;
        right: -8px;
        bottom: -8px;
        border-radius: 9999px;
        -webkit-transform: translateZ(0);
        transform: translateZ(0);

        & svg {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        filter: blur(6px) saturate(1.2) contrast(1.1);
      }

      &:focus-within {
        outline-offset: 2px;
        outline: 3px solid ${n.green[600]};
      }

      & button {
        position: relative;
        z-index: 1;
        padding: 0;
        border-radius: 9999px;
        background-color: transparent;
        border: none;
        height: 40px;
        display: flex;
        width: 40px;
        overflow: hidden;
        cursor: pointer;
        outline: none;
        & svg {
          position: absolute;
          width: 100%;
          height: 100%;
        }
      }
    `,panel:t`
      position: fixed;
      z-index: 9999;
      display: flex;
      gap: ${Q.size[.5]};
      & * {
        box-sizing: border-box;
        text-transform: none;
      }

      & *::-webkit-scrollbar {
        width: 7px;
      }

      & *::-webkit-scrollbar-track {
        background: transparent;
      }

      & *::-webkit-scrollbar-thumb {
        background: ${c(n.gray[300],n.darkGray[200])};
      }

      & *::-webkit-scrollbar-thumb:hover {
        background: ${c(n.gray[400],n.darkGray[300])};
      }
    `,parentPanel:t`
      z-index: 9999;
      display: flex;
      height: 100%;
      gap: ${Q.size[.5]};
      & * {
        box-sizing: border-box;
        text-transform: none;
      }

      & *::-webkit-scrollbar {
        width: 7px;
      }

      & *::-webkit-scrollbar-track {
        background: transparent;
      }

      & *::-webkit-scrollbar-thumb {
        background: ${c(n.gray[300],n.darkGray[200])};
      }

      & *::-webkit-scrollbar-thumb:hover {
        background: ${c(n.gray[400],n.darkGray[300])};
      }
    `,"devtoolsBtn-position-bottom-right":t`
      bottom: 12px;
      right: 12px;
    `,"devtoolsBtn-position-bottom-left":t`
      bottom: 12px;
      left: 12px;
    `,"devtoolsBtn-position-top-left":t`
      top: 12px;
      left: 12px;
    `,"devtoolsBtn-position-top-right":t`
      top: 12px;
      right: 12px;
    `,"devtoolsBtn-position-relative":t`
      position: relative;
    `,"panel-position-top":t`
      top: 0;
      right: 0;
      left: 0;
      max-height: 90%;
      min-height: ${i[14]};
      border-bottom: ${c(n.gray[400],n.darkGray[300])} 1px solid;
    `,"panel-position-bottom":t`
      bottom: 0;
      right: 0;
      left: 0;
      max-height: 90%;
      min-height: ${i[14]};
      border-top: ${c(n.gray[400],n.darkGray[300])} 1px solid;
    `,"panel-position-right":t`
      bottom: 0;
      right: 0;
      top: 0;
      border-left: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      max-width: 90%;
    `,"panel-position-left":t`
      bottom: 0;
      left: 0;
      top: 0;
      border-right: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      max-width: 90%;
    `,closeBtn:t`
      position: absolute;
      cursor: pointer;
      z-index: 5;
      display: flex;
      align-items: center;
      justify-content: center;
      outline: none;
      background-color: ${c(n.gray[50],n.darkGray[700])};
      &:hover {
        background-color: ${c(n.gray[200],n.darkGray[500])};
      }
      &:focus-visible {
        outline: 2px solid ${n.blue[600]};
      }
      & svg {
        color: ${c(n.gray[600],n.gray[400])};
        width: ${i[2]};
        height: ${i[2]};
      }
    `,"closeBtn-position-top":t`
      bottom: 0;
      right: ${i[2]};
      transform: translate(0, 100%);
      border-right: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      border-left: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      border-top: none;
      border-bottom: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      border-radius: 0px 0px ${s.radius.sm} ${s.radius.sm};
      padding: ${i[.5]} ${i[1.5]} ${i[1]} ${i[1.5]};

      &::after {
        content: ' ';
        position: absolute;
        bottom: 100%;
        left: -${i[2.5]};
        height: ${i[1.5]};
        width: calc(100% + ${i[5]});
      }

      & svg {
        transform: rotate(180deg);
      }
    `,"closeBtn-position-bottom":t`
      top: 0;
      right: ${i[2]};
      transform: translate(0, -100%);
      border-right: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      border-left: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      border-top: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      border-bottom: none;
      border-radius: ${s.radius.sm} ${s.radius.sm} 0px 0px;
      padding: ${i[1]} ${i[1.5]} ${i[.5]} ${i[1.5]};

      &::after {
        content: ' ';
        position: absolute;
        top: 100%;
        left: -${i[2.5]};
        height: ${i[1.5]};
        width: calc(100% + ${i[5]});
      }
    `,"closeBtn-position-right":t`
      bottom: ${i[2]};
      left: 0;
      transform: translate(-100%, 0);
      border-right: none;
      border-left: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      border-top: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      border-bottom: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      border-radius: ${s.radius.sm} 0px 0px ${s.radius.sm};
      padding: ${i[1.5]} ${i[.5]} ${i[1.5]} ${i[1]};

      &::after {
        content: ' ';
        position: absolute;
        left: 100%;
        height: calc(100% + ${i[5]});
        width: ${i[1.5]};
      }

      & svg {
        transform: rotate(-90deg);
      }
    `,"closeBtn-position-left":t`
      bottom: ${i[2]};
      right: 0;
      transform: translate(100%, 0);
      border-left: none;
      border-right: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      border-top: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      border-bottom: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      border-radius: 0px ${s.radius.sm} ${s.radius.sm} 0px;
      padding: ${i[1.5]} ${i[1]} ${i[1.5]} ${i[.5]};

      &::after {
        content: ' ';
        position: absolute;
        right: 100%;
        height: calc(100% + ${i[5]});
        width: ${i[1.5]};
      }

      & svg {
        transform: rotate(90deg);
      }
    `,queriesContainer:t`
      flex: 1 1 700px;
      background-color: ${c(n.gray[50],n.darkGray[700])};
      display: flex;
      flex-direction: column;
      & * {
        font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      }
    `,dragHandle:t`
      position: absolute;
      transition: background-color 0.125s ease;
      &:hover {
        background-color: ${n.purple[400]}${c(``,a[90])};
      }
      &:focus {
        outline: none;
        background-color: ${n.purple[400]}${c(``,a[90])};
      }
      &:focus-visible {
        outline: 2px solid ${n.blue[800]};
        outline-offset: -2px;
        background-color: ${n.purple[400]}${c(``,a[90])};
      }
      z-index: 4;
    `,"dragHandle-position-top":t`
      bottom: 0;
      width: 100%;
      height: 3px;
      cursor: ns-resize;
    `,"dragHandle-position-bottom":t`
      top: 0;
      width: 100%;
      height: 3px;
      cursor: ns-resize;
    `,"dragHandle-position-right":t`
      left: 0;
      width: 3px;
      height: 100%;
      cursor: ew-resize;
    `,"dragHandle-position-left":t`
      right: 0;
      width: 3px;
      height: 100%;
      cursor: ew-resize;
    `,row:t`
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: ${Q.size[2]} ${Q.size[2.5]};
      gap: ${Q.size[2.5]};
      border-bottom: ${c(n.gray[300],n.darkGray[500])} 1px solid;
      align-items: center;
      & > button {
        padding: 0;
        background: transparent;
        border: none;
        display: flex;
        gap: ${i[.5]};
        flex-direction: column;
      }
    `,logoAndToggleContainer:t`
      display: flex;
      gap: ${Q.size[3]};
      align-items: center;
    `,logo:t`
      cursor: pointer;
      display: flex;
      flex-direction: column;
      background-color: transparent;
      border: none;
      gap: ${Q.size[.5]};
      padding: 0px;
      &:hover {
        opacity: 0.7;
      }
      &:focus-visible {
        outline-offset: 4px;
        border-radius: ${s.radius.xs};
        outline: 2px solid ${n.blue[800]};
      }
    `,tanstackLogo:t`
      font-size: ${r.size.md};
      font-weight: ${r.weight.bold};
      line-height: ${r.lineHeight.xs};
      white-space: nowrap;
      color: ${c(n.gray[600],n.gray[300])};
    `,queryFlavorLogo:t`
      font-weight: ${r.weight.semibold};
      font-size: ${r.size.xs};
      background: linear-gradient(
        to right,
        ${c(`#ea4037, #ff9b11`,`#dd524b, #e9a03b`)}
      );
      background-clip: text;
      -webkit-background-clip: text;
      line-height: 1;
      -webkit-text-fill-color: transparent;
      white-space: nowrap;
    `,queryStatusContainer:t`
      display: flex;
      gap: ${Q.size[2]};
      height: min-content;
    `,queryStatusTag:t`
      display: flex;
      gap: ${Q.size[1.5]};
      box-sizing: border-box;
      height: ${Q.size[6.5]};
      background: ${c(n.gray[50],n.darkGray[500])};
      color: ${c(n.gray[700],n.gray[300])};
      border-radius: ${Q.border.radius.sm};
      font-size: ${r.size.sm};
      padding: ${Q.size[1]};
      padding-left: ${Q.size[1.5]};
      align-items: center;
      font-weight: ${r.weight.medium};
      border: ${c(`1px solid `+n.gray[300],`1px solid transparent`)};
      user-select: none;
      position: relative;
      &:focus-visible {
        outline-offset: 2px;
        outline: 2px solid ${n.blue[800]};
      }
    `,queryStatusTagLabel:t`
      font-size: ${r.size.xs};
    `,queryStatusCount:t`
      font-size: ${r.size.xs};
      padding: 0 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${c(n.gray[500],n.gray[400])};
      background-color: ${c(n.gray[200],n.darkGray[300])};
      border-radius: 2px;
      font-variant-numeric: tabular-nums;
      height: ${Q.size[4.5]};
    `,statusTooltip:t`
      position: absolute;
      z-index: 1;
      background-color: ${c(n.gray[50],n.darkGray[500])};
      top: 100%;
      left: 50%;
      transform: translate(-50%, calc(${Q.size[2]}));
      padding: ${Q.size[.5]} ${Q.size[2]};
      border-radius: ${Q.border.radius.sm};
      font-size: ${r.size.xs};
      border: 1px solid ${c(n.gray[400],n.gray[600])};
      color: ${c(n.gray[600],n.gray[300])};

      &::before {
        top: 0px;
        content: ' ';
        display: block;
        left: 50%;
        transform: translate(-50%, -100%);
        position: absolute;
        border-color: transparent transparent
          ${c(n.gray[400],n.gray[600])} transparent;
        border-style: solid;
        border-width: 7px;
        /* transform: rotate(180deg); */
      }

      &::after {
        top: 0px;
        content: ' ';
        display: block;
        left: 50%;
        transform: translate(-50%, calc(-100% + 2px));
        position: absolute;
        border-color: transparent transparent
          ${c(n.gray[100],n.darkGray[500])} transparent;
        border-style: solid;
        border-width: 7px;
      }
    `,filtersContainer:t`
      display: flex;
      gap: ${Q.size[2]};
      & > button {
        cursor: pointer;
        padding: ${Q.size[.5]} ${Q.size[1.5]} ${Q.size[.5]}
          ${Q.size[2]};
        border-radius: ${Q.border.radius.sm};
        background-color: ${c(n.gray[100],n.darkGray[400])};
        border: 1px solid ${c(n.gray[300],n.darkGray[200])};
        color: ${c(n.gray[700],n.gray[300])};
        font-size: ${r.size.xs};
        display: flex;
        align-items: center;
        line-height: ${r.lineHeight.sm};
        gap: ${Q.size[1.5]};
        max-width: 160px;
        &:focus-visible {
          outline-offset: 2px;
          border-radius: ${s.radius.xs};
          outline: 2px solid ${n.blue[800]};
        }
        & svg {
          width: ${Q.size[3]};
          height: ${Q.size[3]};
          color: ${c(n.gray[500],n.gray[400])};
        }
      }
    `,filterInput:t`
      padding: ${i[.5]} ${i[2]};
      border-radius: ${Q.border.radius.sm};
      background-color: ${c(n.gray[100],n.darkGray[400])};
      display: flex;
      box-sizing: content-box;
      align-items: center;
      gap: ${Q.size[1.5]};
      max-width: 160px;
      min-width: 100px;
      border: 1px solid ${c(n.gray[300],n.darkGray[200])};
      height: min-content;
      color: ${c(n.gray[600],n.gray[400])};
      & > svg {
        width: ${i[3]};
        height: ${i[3]};
      }
      & input {
        font-size: ${r.size.xs};
        width: 100%;
        background-color: ${c(n.gray[100],n.darkGray[400])};
        border: none;
        padding: 0;
        line-height: ${r.lineHeight.sm};
        color: ${c(n.gray[700],n.gray[300])};
        &::placeholder {
          color: ${c(n.gray[700],n.gray[300])};
        }
        &:focus {
          outline: none;
        }
      }

      &:focus-within {
        outline-offset: 2px;
        border-radius: ${s.radius.xs};
        outline: 2px solid ${n.blue[800]};
      }
    `,filterSelect:t`
      padding: ${Q.size[.5]} ${Q.size[2]};
      border-radius: ${Q.border.radius.sm};
      background-color: ${c(n.gray[100],n.darkGray[400])};
      display: flex;
      align-items: center;
      gap: ${Q.size[1.5]};
      box-sizing: content-box;
      max-width: 160px;
      border: 1px solid ${c(n.gray[300],n.darkGray[200])};
      height: min-content;
      & > svg {
        color: ${c(n.gray[600],n.gray[400])};
        width: ${Q.size[2]};
        height: ${Q.size[2]};
      }
      & > select {
        appearance: none;
        color: ${c(n.gray[700],n.gray[300])};
        min-width: 100px;
        line-height: ${r.lineHeight.sm};
        font-size: ${r.size.xs};
        background-color: ${c(n.gray[100],n.darkGray[400])};
        border: none;
        &:focus {
          outline: none;
        }
      }
      &:focus-within {
        outline-offset: 2px;
        border-radius: ${s.radius.xs};
        outline: 2px solid ${n.blue[800]};
      }
    `,actionsContainer:t`
      display: flex;
      gap: ${Q.size[2]};
    `,actionsBtn:t`
      border-radius: ${Q.border.radius.sm};
      background-color: ${c(n.gray[100],n.darkGray[400])};
      border: 1px solid ${c(n.gray[300],n.darkGray[200])};
      width: ${Q.size[6.5]};
      height: ${Q.size[6.5]};
      justify-content: center;
      display: flex;
      align-items: center;
      gap: ${Q.size[1.5]};
      max-width: 160px;
      cursor: pointer;
      padding: 0;
      &:hover {
        background-color: ${c(n.gray[200],n.darkGray[500])};
      }
      & svg {
        color: ${c(n.gray[700],n.gray[300])};
        width: ${Q.size[3]};
        height: ${Q.size[3]};
      }
      &:focus-visible {
        outline-offset: 2px;
        border-radius: ${s.radius.xs};
        outline: 2px solid ${n.blue[800]};
      }
    `,actionsBtnOffline:t`
      & svg {
        stroke: ${c(n.yellow[700],n.yellow[500])};
        fill: ${c(n.yellow[700],n.yellow[500])};
      }
    `,overflowQueryContainer:t`
      flex: 1;
      overflow-y: auto;
      & > div {
        display: flex;
        flex-direction: column;
      }
    `,queryRow:t`
      display: flex;
      align-items: center;
      padding: 0;
      border: none;
      cursor: pointer;
      color: ${c(n.gray[700],n.gray[300])};
      background-color: ${c(n.gray[50],n.darkGray[700])};
      line-height: 1;
      &:focus {
        outline: none;
      }
      &:focus-visible {
        outline-offset: -2px;
        border-radius: ${s.radius.xs};
        outline: 2px solid ${n.blue[800]};
      }
      &:hover .tsqd-query-hash {
        background-color: ${c(n.gray[200],n.darkGray[600])};
      }

      & .tsqd-query-observer-count {
        padding: 0 ${Q.size[1]};
        user-select: none;
        min-width: ${Q.size[6.5]};
        align-self: stretch;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${r.size.xs};
        font-weight: ${r.weight.medium};
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom: 1px solid ${c(n.gray[300],n.darkGray[700])};
      }
      & .tsqd-query-hash {
        user-select: text;
        font-size: ${r.size.xs};
        display: flex;
        align-items: center;
        min-height: ${Q.size[6]};
        flex: 1;
        padding: ${Q.size[1]} ${Q.size[2]};
        font-family:
          ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
        border-bottom: 1px solid ${c(n.gray[300],n.darkGray[400])};
        text-align: left;
        text-overflow: clip;
        word-break: break-word;
      }

      & .tsqd-query-disabled-indicator {
        align-self: stretch;
        display: flex;
        align-items: center;
        padding: 0 ${Q.size[2]};
        color: ${c(n.gray[800],n.gray[300])};
        background-color: ${c(n.gray[300],n.darkGray[600])};
        border-bottom: 1px solid ${c(n.gray[300],n.darkGray[400])};
        font-size: ${r.size.xs};
      }

      & .tsqd-query-static-indicator {
        align-self: stretch;
        display: flex;
        align-items: center;
        padding: 0 ${Q.size[2]};
        color: ${c(n.teal[800],n.teal[300])};
        background-color: ${c(n.teal[100],n.teal[900])};
        border-bottom: 1px solid ${c(n.teal[300],n.teal[700])};
        font-size: ${r.size.xs};
      }
    `,selectedQueryRow:t`
      background-color: ${c(n.gray[200],n.darkGray[500])};
    `,detailsContainer:t`
      flex: 1 1 700px;
      background-color: ${c(n.gray[50],n.darkGray[700])};
      color: ${c(n.gray[700],n.gray[300])};
      font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      display: flex;
      text-align: left;
    `,detailsHeader:t`
      font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      position: sticky;
      top: 0;
      z-index: 2;
      background-color: ${c(n.gray[200],n.darkGray[600])};
      padding: ${Q.size[1.5]} ${Q.size[2]};
      font-weight: ${r.weight.medium};
      font-size: ${r.size.xs};
      line-height: ${r.lineHeight.xs};
      text-align: left;
    `,detailsBody:t`
      margin: ${Q.size[1.5]} 0px ${Q.size[2]} 0px;
      & > div {
        display: flex;
        align-items: stretch;
        padding: 0 ${Q.size[2]};
        line-height: ${r.lineHeight.sm};
        justify-content: space-between;
        & > span {
          font-size: ${r.size.xs};
        }
        & > span:nth-child(2) {
          font-variant-numeric: tabular-nums;
        }
      }

      & > div:first-child {
        margin-bottom: ${Q.size[1.5]};
      }

      & code {
        font-family:
          ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
        margin: 0;
        font-size: ${r.size.xs};
        line-height: ${r.lineHeight.xs};
        max-width: 100%;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        word-break: break-word;
      }

      & pre {
        margin: 0;
        display: flex;
        align-items: center;
      }
    `,queryDetailsStatus:t`
      border: 1px solid ${n.darkGray[200]};
      border-radius: ${Q.border.radius.sm};
      font-weight: ${r.weight.medium};
      padding: ${Q.size[1]} ${Q.size[2.5]};
    `,actionsBody:t`
      flex-wrap: wrap;
      margin: ${Q.size[2]} 0px ${Q.size[2]} 0px;
      display: flex;
      gap: ${Q.size[2]};
      padding: 0px ${Q.size[2]};
      & > button {
        font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
        font-size: ${r.size.xs};
        padding: ${Q.size[1]} ${Q.size[2]};
        display: flex;
        border-radius: ${Q.border.radius.sm};
        background-color: ${c(n.gray[100],n.darkGray[600])};
        border: 1px solid ${c(n.gray[300],n.darkGray[400])};
        align-items: center;
        gap: ${Q.size[2]};
        font-weight: ${r.weight.medium};
        line-height: ${r.lineHeight.xs};
        cursor: pointer;
        &:focus-visible {
          outline-offset: 2px;
          border-radius: ${s.radius.xs};
          outline: 2px solid ${n.blue[800]};
        }
        &:hover {
          background-color: ${c(n.gray[200],n.darkGray[500])};
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        & > span {
          width: ${i[1.5]};
          height: ${i[1.5]};
          border-radius: ${Q.border.radius.full};
        }
      }
    `,actionsSelect:t`
      font-size: ${r.size.xs};
      padding: ${Q.size[.5]} ${Q.size[2]};
      display: flex;
      border-radius: ${Q.border.radius.sm};
      overflow: hidden;
      background-color: ${c(n.gray[100],n.darkGray[600])};
      border: 1px solid ${c(n.gray[300],n.darkGray[400])};
      align-items: center;
      gap: ${Q.size[2]};
      font-weight: ${r.weight.medium};
      line-height: ${r.lineHeight.sm};
      color: ${c(n.red[500],n.red[400])};
      cursor: pointer;
      position: relative;
      &:hover {
        background-color: ${c(n.gray[200],n.darkGray[500])};
      }
      & > span {
        width: ${i[1.5]};
        height: ${i[1.5]};
        border-radius: ${Q.border.radius.full};
      }
      &:focus-within {
        outline-offset: 2px;
        border-radius: ${s.radius.xs};
        outline: 2px solid ${n.blue[800]};
      }
      & select {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        appearance: none;
        background-color: transparent;
        border: none;
        color: transparent;
        outline: none;
      }

      & svg path {
        stroke: ${Q.colors.red[400]};
      }
      & svg {
        width: ${Q.size[2]};
        height: ${Q.size[2]};
      }
    `,settingsMenu:t`
      display: flex;
      & * {
        font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      }
      flex-direction: column;
      gap: ${i[.5]};
      border-radius: ${Q.border.radius.sm};
      border: 1px solid ${c(n.gray[300],n.gray[700])};
      background-color: ${c(n.gray[50],n.darkGray[600])};
      font-size: ${r.size.xs};
      color: ${c(n.gray[700],n.gray[300])};
      z-index: 99999;
      min-width: 120px;
      padding: ${i[.5]};
    `,settingsSubTrigger:t`
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: ${Q.border.radius.xs};
      padding: ${Q.size[1]} ${Q.size[1]};
      cursor: pointer;
      background-color: transparent;
      border: none;
      color: ${c(n.gray[700],n.gray[300])};
      & svg {
        color: ${c(n.gray[600],n.gray[400])};
        transform: rotate(-90deg);
        width: ${Q.size[2]};
        height: ${Q.size[2]};
      }
      &:hover {
        background-color: ${c(n.gray[200],n.darkGray[500])};
      }
      &:focus-visible {
        outline-offset: 2px;
        outline: 2px solid ${n.blue[800]};
      }
      &.data-disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `,settingsMenuHeader:t`
      padding: ${Q.size[1]} ${Q.size[1]};
      font-weight: ${r.weight.medium};
      border-bottom: 1px solid ${c(n.gray[300],n.darkGray[400])};
      color: ${c(n.gray[500],n.gray[400])};
      font-size: ${r.size.xs};
    `,settingsSubButton:t`
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: ${c(n.gray[700],n.gray[300])};
      font-size: ${r.size.xs};
      border-radius: ${Q.border.radius.xs};
      padding: ${Q.size[1]} ${Q.size[1]};
      cursor: pointer;
      background-color: transparent;
      border: none;
      & svg {
        color: ${c(n.gray[600],n.gray[400])};
      }
      &:hover {
        background-color: ${c(n.gray[200],n.darkGray[500])};
      }
      &:focus-visible {
        outline-offset: 2px;
        outline: 2px solid ${n.blue[800]};
      }
      &[data-checked] {
        background-color: ${c(n.purple[100],n.purple[900])};
        color: ${c(n.purple[700],n.purple[300])};
        & svg {
          color: ${c(n.purple[700],n.purple[300])};
        }
        &:hover {
          background-color: ${c(n.purple[100],n.purple[900])};
        }
      }
    `,viewToggle:t`
      border-radius: ${Q.border.radius.sm};
      background-color: ${c(n.gray[200],n.darkGray[600])};
      border: 1px solid ${c(n.gray[300],n.darkGray[200])};
      display: flex;
      padding: 0;
      font-size: ${r.size.xs};
      color: ${c(n.gray[700],n.gray[300])};
      overflow: hidden;

      &:has(:focus-visible) {
        outline: 2px solid ${n.blue[800]};
      }

      & .tsqd-radio-toggle {
        opacity: 0.5;
        display: flex;
        & label {
          display: flex;
          align-items: center;
          cursor: pointer;
          line-height: ${r.lineHeight.md};
        }

        & label:hover {
          background-color: ${c(n.gray[100],n.darkGray[500])};
        }
      }

      & > [data-checked] {
        opacity: 1;
        background-color: ${c(n.gray[100],n.darkGray[400])};
        & label:hover {
          background-color: ${c(n.gray[100],n.darkGray[400])};
        }
      }

      & .tsqd-radio-toggle:first-child {
        & label {
          padding: 0 ${Q.size[1.5]} 0 ${Q.size[2]};
        }
        border-right: 1px solid ${c(n.gray[300],n.darkGray[200])};
      }

      & .tsqd-radio-toggle:nth-child(2) {
        & label {
          padding: 0 ${Q.size[2]} 0 ${Q.size[1.5]};
        }
      }
    `,devtoolsEditForm:t`
      padding: ${i[2]};
      & > [data-error='true'] {
        outline: 2px solid ${c(n.red[200],n.red[800])};
        outline-offset: 2px;
        border-radius: ${s.radius.xs};
      }
    `,devtoolsEditTextarea:t`
      width: 100%;
      max-height: 500px;
      font-family: 'Fira Code', monospace;
      font-size: ${r.size.xs};
      border-radius: ${s.radius.sm};
      field-sizing: content;
      padding: ${i[2]};
      background-color: ${c(n.gray[100],n.darkGray[800])};
      color: ${c(n.gray[900],n.gray[100])};
      border: 1px solid ${c(n.gray[200],n.gray[700])};
      resize: none;
      &:focus {
        outline-offset: 2px;
        border-radius: ${s.radius.xs};
        outline: 2px solid ${c(n.blue[200],n.blue[800])};
      }
    `,devtoolsEditFormActions:t`
      display: flex;
      justify-content: space-between;
      gap: ${i[2]};
      align-items: center;
      padding-top: ${i[1]};
      font-size: ${r.size.xs};
    `,devtoolsEditFormError:t`
      color: ${c(n.red[700],n.red[500])};
    `,devtoolsEditFormActionContainer:t`
      display: flex;
      gap: ${i[2]};
    `,devtoolsEditFormAction:t`
      font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      font-size: ${r.size.xs};
      padding: ${i[1]} ${Q.size[2]};
      display: flex;
      border-radius: ${s.radius.sm};
      background-color: ${c(n.gray[100],n.darkGray[600])};
      border: 1px solid ${c(n.gray[300],n.darkGray[400])};
      align-items: center;
      gap: ${i[2]};
      font-weight: ${r.weight.medium};
      line-height: ${r.lineHeight.xs};
      cursor: pointer;
      &:focus-visible {
        outline-offset: 2px;
        border-radius: ${s.radius.xs};
        outline: 2px solid ${n.blue[800]};
      }
      &:hover {
        background-color: ${c(n.gray[200],n.darkGray[500])};
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `}},Mu=e=>ju(`light`,e),Nu=e=>ju(`dark`,e);r([`click`,`mousedown`,`keydown`,`input`]);var Pu=e=>{let[t,n]=be({prefix:`TanstackQueryDevtools`}),r=p(),i=F(()=>{let n=e.theme||t.theme_preference||`system`;return n===`system`?r():n});return j(Ie.Provider,{value:e,get children(){return j(ze,{localStore:t,setLocalStore:n,get children(){return j(Ve.Provider,{value:i,get children(){return j(pu,{localStore:t,setLocalStore:n})}})}})}})};export{Pu as default};