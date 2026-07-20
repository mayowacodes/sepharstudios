const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./CLfM9NHu.js","./Czpkz5lw2.js","./DCfTpCPr.js","./CYO4IdWv.js","./OnMVWaqi.js","./BvQvcmzz.js","./DDvn7lHV.js","./C4H0fNaf.js","./CS85G_5q.js","./C3VMe19G.js","./C8tS9TMY.js","./DnexPU9D.js","./C-cHV7nX.js","./Bua2XuIx.js","./fL2kAwOX.js","./tf0b0EfO.js","./lRgzv_ua.js","./CKsmGpOm.js","./CFl23Pnk.js","./Cla0CLw8.js","./Oh-ZYOTZ.js","./DK2gIavE.js","./GPkHIas0.js","./Bqrx4OEj.js","./BkMTGWlA.js","./Bv_7ycYU.js","./BGOkBRSD.js","./e9_OmYS2.js","./Tk8wEkQ9.js","./YUmfd5v0.js","./DWRTXrQo.js","./Dp7vnXHs.js","./DxrtVKW-.js","./G0HRP6tg2.js","./C56mV37i2.js","./DET_eyYg2.js","./5aocUBvt2.js","./CS1s62eC2.js","./B85JCBGv2.js","./nRylcgsJ2.js","./Cg7Dcyoc2.js","./BJIS6riG2.js","./BcV7mu7T2.js","./Bno12fNy2.js","./-Xba6HZp2.js","./FE3zjIaV2.js","./BIGXpMHt2.js","./tM5zVAPs2.js","./DpD3nODk2.js","./4PEvhwbL2.js","./kftRrrho2.js","./DVQZ-RIb2.js","./BvCsTV3y2.js","./Dfno4_uZ2.js","./B3fak0gY2.js","./Bhryuzwk2.js","./NelWvq9-2.js","./lZoGX8Lh.js","./Crzi4gjF.js","./BE5JBJXj.js","./BFCz7vh0.js","./DZjGGw0F.js","./BEm-YUAf.js","./BtxiGulk.js","./Dag1yBXh.js","./hAcfICk6.js","./PIf4Le3T.js","./DZ-kqc9Q.js","./Taw17eeM.js","./Do8u0knb.js","./DokWOYoO.js","./AGMxq1KQ.js","./CIUPWDpt2.js","./BfWrPERt.js","./BjgB73022.js"])))=>i.map(i=>d[i]);
import{t as e}from"./kNaey6uv.js";import{a as t,i as n,n as r,r as i,s as a}from"./BGqhKV5m2.js";import{a as o,c as s,i as c,l,n as ee,r as u,s as te,t as d}from"./Czpkz5lw2.js";var f={attribute:!0,type:String,converter:s,reflect:!1,hasChanged:te},p=(e=f,t,n)=>{let{kind:r,metadata:i}=n,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),r===`setter`&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e,!0,n)},init(t){return t!==void 0&&this.C(r,void 0,e,t),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e,!0,n)}}throw Error(`Unsupported decorator location: `+r)};function m(e){return(t,n)=>typeof n==`object`?p(e,t,n):((e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}function h(e){return m({...e,state:!0,attribute:!1})}var g=l`
  :host {
    display: flex;
    width: inherit;
    height: inherit;
  }
`,_=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},v=class extends d{render(){return this.style.cssText=`
      flex-direction: ${this.flexDirection};
      flex-wrap: ${this.flexWrap};
      flex-basis: ${this.flexBasis};
      flex-grow: ${this.flexGrow};
      flex-shrink: ${this.flexShrink};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      column-gap: ${this.columnGap&&`var(--wui-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap&&`var(--wui-spacing-${this.rowGap})`};
      gap: ${this.gap&&`var(--wui-spacing-${this.gap})`};
      padding-top: ${this.padding&&i.getSpacingStyles(this.padding,0)};
      padding-right: ${this.padding&&i.getSpacingStyles(this.padding,1)};
      padding-bottom: ${this.padding&&i.getSpacingStyles(this.padding,2)};
      padding-left: ${this.padding&&i.getSpacingStyles(this.padding,3)};
      margin-top: ${this.margin&&i.getSpacingStyles(this.margin,0)};
      margin-right: ${this.margin&&i.getSpacingStyles(this.margin,1)};
      margin-bottom: ${this.margin&&i.getSpacingStyles(this.margin,2)};
      margin-left: ${this.margin&&i.getSpacingStyles(this.margin,3)};
    `,c`<slot></slot>`}};v.styles=[a,g],_([m()],v.prototype,`flexDirection`,void 0),_([m()],v.prototype,`flexWrap`,void 0),_([m()],v.prototype,`flexBasis`,void 0),_([m()],v.prototype,`flexGrow`,void 0),_([m()],v.prototype,`flexShrink`,void 0),_([m()],v.prototype,`alignItems`,void 0),_([m()],v.prototype,`justifyContent`,void 0),_([m()],v.prototype,`columnGap`,void 0),_([m()],v.prototype,`rowGap`,void 0),_([m()],v.prototype,`gap`,void 0),_([m()],v.prototype,`padding`,void 0),_([m()],v.prototype,`margin`,void 0),v=_([r(`wui-flex`)],v);var ne=e=>e??ee,{I:re}=o,y=e=>e===null||typeof e!=`object`&&typeof e!=`function`,b=e=>e.strings===void 0,x={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},S=e=>(...t)=>({_$litDirective$:e,values:t}),C=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},w=(e,t)=>{let n=e._$AN;if(n===void 0)return!1;for(let e of n)e._$AO?.(t,!1),w(e,t);return!0},T=e=>{let t,n;do{if((t=e._$AM)===void 0)break;n=t._$AN,n.delete(e),e=t}while(n?.size===0)},E=e=>{for(let t;t=e._$AM;e=t){let n=t._$AN;if(n===void 0)t._$AN=n=new Set;else if(n.has(e))break;n.add(e),k(t)}};function D(e){this._$AN===void 0?this._$AM=e:(T(this),this._$AM=e,E(this))}function O(e,t=!1,n=0){let r=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(t)if(Array.isArray(r))for(let e=n;e<r.length;e++)w(r[e],!1),T(r[e]);else r!=null&&(w(r,!1),T(r));else w(this,e)}var k=e=>{e.type==x.CHILD&&(e._$AP??=O,e._$AQ??=D)},A=class extends C{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,n){super._$AT(e,t,n),E(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(w(this,e),T(this))}setValue(e){if(b(this._$Ct))this._$Ct._$AI(e,this);else{let t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}},ie=class{constructor(e){this.G=e}disconnect(){this.G=void 0}reconnect(e){this.G=e}deref(){return this.G}},j=class{constructor(){this.Y=void 0,this.Z=void 0}get(){return this.Y}pause(){this.Y??=new Promise(e=>this.Z=e)}resume(){this.Z?.(),this.Y=this.Z=void 0}},M=e=>!y(e)&&typeof e.then==`function`,N=1073741823,ae=S(class extends A{constructor(){super(...arguments),this._$Cwt=N,this._$Cbt=[],this._$CK=new ie(this),this._$CX=new j}render(...e){return e.find(e=>!M(e))??u}update(e,t){let n=this._$Cbt,r=n.length;this._$Cbt=t;let i=this._$CK,a=this._$CX;this.isConnected||this.disconnected();for(let e=0;e<t.length&&!(e>this._$Cwt);e++){let o=t[e];if(!M(o))return this._$Cwt=e,o;e<r&&o===n[e]||(this._$Cwt=N,r=0,Promise.resolve(o).then(async e=>{for(;a.get();)await a.get();let t=i.deref();if(t!==void 0){let n=t._$Cbt.indexOf(o);n>-1&&n<t._$Cwt&&(t._$Cwt=n,t.setValue(e))}}))}return u}disconnected(){this._$CK.disconnect(),this._$CX.pause()}reconnected(){this._$CK.reconnect(this),this._$CX.resume()}}),P=new class{constructor(){this.cache=new Map}set(e,t){this.cache.set(e,t)}get(e){return this.cache.get(e)}has(e){return this.cache.has(e)}delete(e){this.cache.delete(e)}clear(){this.cache.clear()}},F=l`
  :host {
    display: flex;
    aspect-ratio: var(--local-aspect-ratio);
    color: var(--local-color);
    width: var(--local-width);
  }

  svg {
    width: inherit;
    height: inherit;
    object-fit: contain;
    object-position: center;
  }

  .fallback {
    width: var(--local-width);
    height: var(--local-height);
  }
`,I=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},L={add:async()=>(await e(async()=>{let{addSvg:e}=await import(`./CLfM9NHu.js`);return{addSvg:e}},__vite__mapDeps([0,1]),import.meta.url)).addSvg,allWallets:async()=>(await e(async()=>{let{allWalletsSvg:e}=await import(`./DCfTpCPr.js`);return{allWalletsSvg:e}},__vite__mapDeps([2,1]),import.meta.url)).allWalletsSvg,arrowBottomCircle:async()=>(await e(async()=>{let{arrowBottomCircleSvg:e}=await import(`./CYO4IdWv.js`);return{arrowBottomCircleSvg:e}},__vite__mapDeps([3,1]),import.meta.url)).arrowBottomCircleSvg,appStore:async()=>(await e(async()=>{let{appStoreSvg:e}=await import(`./OnMVWaqi.js`);return{appStoreSvg:e}},__vite__mapDeps([4,1]),import.meta.url)).appStoreSvg,apple:async()=>(await e(async()=>{let{appleSvg:e}=await import(`./BvQvcmzz.js`);return{appleSvg:e}},__vite__mapDeps([5,1]),import.meta.url)).appleSvg,arrowBottom:async()=>(await e(async()=>{let{arrowBottomSvg:e}=await import(`./DDvn7lHV.js`);return{arrowBottomSvg:e}},__vite__mapDeps([6,1]),import.meta.url)).arrowBottomSvg,arrowLeft:async()=>(await e(async()=>{let{arrowLeftSvg:e}=await import(`./C4H0fNaf.js`);return{arrowLeftSvg:e}},__vite__mapDeps([7,1]),import.meta.url)).arrowLeftSvg,arrowRight:async()=>(await e(async()=>{let{arrowRightSvg:e}=await import(`./CS85G_5q.js`);return{arrowRightSvg:e}},__vite__mapDeps([8,1]),import.meta.url)).arrowRightSvg,arrowTop:async()=>(await e(async()=>{let{arrowTopSvg:e}=await import(`./C3VMe19G.js`);return{arrowTopSvg:e}},__vite__mapDeps([9,1]),import.meta.url)).arrowTopSvg,bank:async()=>(await e(async()=>{let{bankSvg:e}=await import(`./C8tS9TMY.js`);return{bankSvg:e}},__vite__mapDeps([10,1]),import.meta.url)).bankSvg,browser:async()=>(await e(async()=>{let{browserSvg:e}=await import(`./DnexPU9D.js`);return{browserSvg:e}},__vite__mapDeps([11,1]),import.meta.url)).browserSvg,card:async()=>(await e(async()=>{let{cardSvg:e}=await import(`./C-cHV7nX.js`);return{cardSvg:e}},__vite__mapDeps([12,1]),import.meta.url)).cardSvg,checkmark:async()=>(await e(async()=>{let{checkmarkSvg:e}=await import(`./Bua2XuIx.js`);return{checkmarkSvg:e}},__vite__mapDeps([13,1]),import.meta.url)).checkmarkSvg,checkmarkBold:async()=>(await e(async()=>{let{checkmarkBoldSvg:e}=await import(`./fL2kAwOX.js`);return{checkmarkBoldSvg:e}},__vite__mapDeps([14,1]),import.meta.url)).checkmarkBoldSvg,chevronBottom:async()=>(await e(async()=>{let{chevronBottomSvg:e}=await import(`./tf0b0EfO.js`);return{chevronBottomSvg:e}},__vite__mapDeps([15,1]),import.meta.url)).chevronBottomSvg,chevronLeft:async()=>(await e(async()=>{let{chevronLeftSvg:e}=await import(`./lRgzv_ua.js`);return{chevronLeftSvg:e}},__vite__mapDeps([16,1]),import.meta.url)).chevronLeftSvg,chevronRight:async()=>(await e(async()=>{let{chevronRightSvg:e}=await import(`./CKsmGpOm.js`);return{chevronRightSvg:e}},__vite__mapDeps([17,1]),import.meta.url)).chevronRightSvg,chevronTop:async()=>(await e(async()=>{let{chevronTopSvg:e}=await import(`./CFl23Pnk.js`);return{chevronTopSvg:e}},__vite__mapDeps([18,1]),import.meta.url)).chevronTopSvg,chromeStore:async()=>(await e(async()=>{let{chromeStoreSvg:e}=await import(`./Cla0CLw8.js`);return{chromeStoreSvg:e}},__vite__mapDeps([19,1]),import.meta.url)).chromeStoreSvg,clock:async()=>(await e(async()=>{let{clockSvg:e}=await import(`./Oh-ZYOTZ.js`);return{clockSvg:e}},__vite__mapDeps([20,1]),import.meta.url)).clockSvg,close:async()=>(await e(async()=>{let{closeSvg:e}=await import(`./DK2gIavE.js`);return{closeSvg:e}},__vite__mapDeps([21,1]),import.meta.url)).closeSvg,compass:async()=>(await e(async()=>{let{compassSvg:e}=await import(`./GPkHIas0.js`);return{compassSvg:e}},__vite__mapDeps([22,1]),import.meta.url)).compassSvg,coinPlaceholder:async()=>(await e(async()=>{let{coinPlaceholderSvg:e}=await import(`./Bqrx4OEj.js`);return{coinPlaceholderSvg:e}},__vite__mapDeps([23,1]),import.meta.url)).coinPlaceholderSvg,copy:async()=>(await e(async()=>{let{copySvg:e}=await import(`./BkMTGWlA.js`);return{copySvg:e}},__vite__mapDeps([24,1]),import.meta.url)).copySvg,cursor:async()=>(await e(async()=>{let{cursorSvg:e}=await import(`./Bv_7ycYU.js`);return{cursorSvg:e}},__vite__mapDeps([25,1]),import.meta.url)).cursorSvg,cursorTransparent:async()=>(await e(async()=>{let{cursorTransparentSvg:e}=await import(`./BGOkBRSD.js`);return{cursorTransparentSvg:e}},__vite__mapDeps([26,1]),import.meta.url)).cursorTransparentSvg,desktop:async()=>(await e(async()=>{let{desktopSvg:e}=await import(`./e9_OmYS2.js`);return{desktopSvg:e}},__vite__mapDeps([27,1]),import.meta.url)).desktopSvg,disconnect:async()=>(await e(async()=>{let{disconnectSvg:e}=await import(`./Tk8wEkQ9.js`);return{disconnectSvg:e}},__vite__mapDeps([28,1]),import.meta.url)).disconnectSvg,discord:async()=>(await e(async()=>{let{discordSvg:e}=await import(`./YUmfd5v0.js`);return{discordSvg:e}},__vite__mapDeps([29,1]),import.meta.url)).discordSvg,etherscan:async()=>(await e(async()=>{let{etherscanSvg:e}=await import(`./DWRTXrQo.js`);return{etherscanSvg:e}},__vite__mapDeps([30,1]),import.meta.url)).etherscanSvg,extension:async()=>(await e(async()=>{let{extensionSvg:e}=await import(`./Dp7vnXHs.js`);return{extensionSvg:e}},__vite__mapDeps([31,1]),import.meta.url)).extensionSvg,externalLink:async()=>(await e(async()=>{let{externalLinkSvg:e}=await import(`./DxrtVKW-.js`);return{externalLinkSvg:e}},__vite__mapDeps([32,1]),import.meta.url)).externalLinkSvg,facebook:async()=>(await e(async()=>{let{facebookSvg:e}=await import(`./G0HRP6tg2.js`);return{facebookSvg:e}},__vite__mapDeps([33,1]),import.meta.url)).facebookSvg,farcaster:async()=>(await e(async()=>{let{farcasterSvg:e}=await import(`./C56mV37i2.js`);return{farcasterSvg:e}},__vite__mapDeps([34,1]),import.meta.url)).farcasterSvg,filters:async()=>(await e(async()=>{let{filtersSvg:e}=await import(`./DET_eyYg2.js`);return{filtersSvg:e}},__vite__mapDeps([35,1]),import.meta.url)).filtersSvg,github:async()=>(await e(async()=>{let{githubSvg:e}=await import(`./5aocUBvt2.js`);return{githubSvg:e}},__vite__mapDeps([36,1]),import.meta.url)).githubSvg,google:async()=>(await e(async()=>{let{googleSvg:e}=await import(`./CS1s62eC2.js`);return{googleSvg:e}},__vite__mapDeps([37,1]),import.meta.url)).googleSvg,helpCircle:async()=>(await e(async()=>{let{helpCircleSvg:e}=await import(`./B85JCBGv2.js`);return{helpCircleSvg:e}},__vite__mapDeps([38,1]),import.meta.url)).helpCircleSvg,image:async()=>(await e(async()=>{let{imageSvg:e}=await import(`./nRylcgsJ2.js`);return{imageSvg:e}},__vite__mapDeps([39,1]),import.meta.url)).imageSvg,id:async()=>(await e(async()=>{let{idSvg:e}=await import(`./Cg7Dcyoc2.js`);return{idSvg:e}},__vite__mapDeps([40,1]),import.meta.url)).idSvg,infoCircle:async()=>(await e(async()=>{let{infoCircleSvg:e}=await import(`./BJIS6riG2.js`);return{infoCircleSvg:e}},__vite__mapDeps([41,1]),import.meta.url)).infoCircleSvg,lightbulb:async()=>(await e(async()=>{let{lightbulbSvg:e}=await import(`./BcV7mu7T2.js`);return{lightbulbSvg:e}},__vite__mapDeps([42,1]),import.meta.url)).lightbulbSvg,mail:async()=>(await e(async()=>{let{mailSvg:e}=await import(`./Bno12fNy2.js`);return{mailSvg:e}},__vite__mapDeps([43,1]),import.meta.url)).mailSvg,mobile:async()=>(await e(async()=>{let{mobileSvg:e}=await import(`./-Xba6HZp2.js`);return{mobileSvg:e}},__vite__mapDeps([44,1]),import.meta.url)).mobileSvg,more:async()=>(await e(async()=>{let{moreSvg:e}=await import(`./FE3zjIaV2.js`);return{moreSvg:e}},__vite__mapDeps([45,1]),import.meta.url)).moreSvg,networkPlaceholder:async()=>(await e(async()=>{let{networkPlaceholderSvg:e}=await import(`./BIGXpMHt2.js`);return{networkPlaceholderSvg:e}},__vite__mapDeps([46,1]),import.meta.url)).networkPlaceholderSvg,nftPlaceholder:async()=>(await e(async()=>{let{nftPlaceholderSvg:e}=await import(`./tM5zVAPs2.js`);return{nftPlaceholderSvg:e}},__vite__mapDeps([47,1]),import.meta.url)).nftPlaceholderSvg,off:async()=>(await e(async()=>{let{offSvg:e}=await import(`./DpD3nODk2.js`);return{offSvg:e}},__vite__mapDeps([48,1]),import.meta.url)).offSvg,playStore:async()=>(await e(async()=>{let{playStoreSvg:e}=await import(`./4PEvhwbL2.js`);return{playStoreSvg:e}},__vite__mapDeps([49,1]),import.meta.url)).playStoreSvg,plus:async()=>(await e(async()=>{let{plusSvg:e}=await import(`./kftRrrho2.js`);return{plusSvg:e}},__vite__mapDeps([50,1]),import.meta.url)).plusSvg,qrCode:async()=>(await e(async()=>{let{qrCodeIcon:e}=await import(`./DVQZ-RIb2.js`);return{qrCodeIcon:e}},__vite__mapDeps([51,1]),import.meta.url)).qrCodeIcon,recycleHorizontal:async()=>(await e(async()=>{let{recycleHorizontalSvg:e}=await import(`./BvCsTV3y2.js`);return{recycleHorizontalSvg:e}},__vite__mapDeps([52,1]),import.meta.url)).recycleHorizontalSvg,refresh:async()=>(await e(async()=>{let{refreshSvg:e}=await import(`./Dfno4_uZ2.js`);return{refreshSvg:e}},__vite__mapDeps([53,1]),import.meta.url)).refreshSvg,search:async()=>(await e(async()=>{let{searchSvg:e}=await import(`./B3fak0gY2.js`);return{searchSvg:e}},__vite__mapDeps([54,1]),import.meta.url)).searchSvg,send:async()=>(await e(async()=>{let{sendSvg:e}=await import(`./Bhryuzwk2.js`);return{sendSvg:e}},__vite__mapDeps([55,1]),import.meta.url)).sendSvg,swapHorizontal:async()=>(await e(async()=>{let{swapHorizontalSvg:e}=await import(`./NelWvq9-2.js`);return{swapHorizontalSvg:e}},__vite__mapDeps([56,1]),import.meta.url)).swapHorizontalSvg,swapHorizontalMedium:async()=>(await e(async()=>{let{swapHorizontalMediumSvg:e}=await import(`./lZoGX8Lh.js`);return{swapHorizontalMediumSvg:e}},__vite__mapDeps([57,1]),import.meta.url)).swapHorizontalMediumSvg,swapHorizontalBold:async()=>(await e(async()=>{let{swapHorizontalBoldSvg:e}=await import(`./Crzi4gjF.js`);return{swapHorizontalBoldSvg:e}},__vite__mapDeps([58,1]),import.meta.url)).swapHorizontalBoldSvg,swapHorizontalRoundedBold:async()=>(await e(async()=>{let{swapHorizontalRoundedBoldSvg:e}=await import(`./BE5JBJXj.js`);return{swapHorizontalRoundedBoldSvg:e}},__vite__mapDeps([59,1]),import.meta.url)).swapHorizontalRoundedBoldSvg,swapVertical:async()=>(await e(async()=>{let{swapVerticalSvg:e}=await import(`./BFCz7vh0.js`);return{swapVerticalSvg:e}},__vite__mapDeps([60,1]),import.meta.url)).swapVerticalSvg,telegram:async()=>(await e(async()=>{let{telegramSvg:e}=await import(`./DZjGGw0F.js`);return{telegramSvg:e}},__vite__mapDeps([61,1]),import.meta.url)).telegramSvg,threeDots:async()=>(await e(async()=>{let{threeDotsSvg:e}=await import(`./BEm-YUAf.js`);return{threeDotsSvg:e}},__vite__mapDeps([62,1]),import.meta.url)).threeDotsSvg,twitch:async()=>(await e(async()=>{let{twitchSvg:e}=await import(`./BtxiGulk.js`);return{twitchSvg:e}},__vite__mapDeps([63,1]),import.meta.url)).twitchSvg,twitter:async()=>(await e(async()=>{let{xSvg:e}=await import(`./Dag1yBXh.js`);return{xSvg:e}},__vite__mapDeps([64,1]),import.meta.url)).xSvg,twitterIcon:async()=>(await e(async()=>{let{twitterIconSvg:e}=await import(`./hAcfICk6.js`);return{twitterIconSvg:e}},__vite__mapDeps([65,1]),import.meta.url)).twitterIconSvg,verify:async()=>(await e(async()=>{let{verifySvg:e}=await import(`./PIf4Le3T.js`);return{verifySvg:e}},__vite__mapDeps([66,1]),import.meta.url)).verifySvg,verifyFilled:async()=>(await e(async()=>{let{verifyFilledSvg:e}=await import(`./DZ-kqc9Q.js`);return{verifyFilledSvg:e}},__vite__mapDeps([67,1]),import.meta.url)).verifyFilledSvg,wallet:async()=>(await e(async()=>{let{walletSvg:e}=await import(`./Taw17eeM.js`);return{walletSvg:e}},__vite__mapDeps([68,1]),import.meta.url)).walletSvg,walletConnect:async()=>(await e(async()=>{let{walletConnectSvg:e}=await import(`./Do8u0knb.js`);return{walletConnectSvg:e}},__vite__mapDeps([69,1]),import.meta.url)).walletConnectSvg,walletConnectLightBrown:async()=>(await e(async()=>{let{walletConnectLightBrownSvg:e}=await import(`./Do8u0knb.js`);return{walletConnectLightBrownSvg:e}},__vite__mapDeps([69,1]),import.meta.url)).walletConnectLightBrownSvg,walletConnectBrown:async()=>(await e(async()=>{let{walletConnectBrownSvg:e}=await import(`./Do8u0knb.js`);return{walletConnectBrownSvg:e}},__vite__mapDeps([69,1]),import.meta.url)).walletConnectBrownSvg,walletPlaceholder:async()=>(await e(async()=>{let{walletPlaceholderSvg:e}=await import(`./DokWOYoO.js`);return{walletPlaceholderSvg:e}},__vite__mapDeps([70,1]),import.meta.url)).walletPlaceholderSvg,warningCircle:async()=>(await e(async()=>{let{warningCircleSvg:e}=await import(`./AGMxq1KQ.js`);return{warningCircleSvg:e}},__vite__mapDeps([71,1]),import.meta.url)).warningCircleSvg,x:async()=>(await e(async()=>{let{xSvg:e}=await import(`./Dag1yBXh.js`);return{xSvg:e}},__vite__mapDeps([64,1]),import.meta.url)).xSvg,info:async()=>(await e(async()=>{let{infoSvg:e}=await import(`./CIUPWDpt2.js`);return{infoSvg:e}},__vite__mapDeps([72,1]),import.meta.url)).infoSvg,exclamationTriangle:async()=>(await e(async()=>{let{exclamationTriangleSvg:e}=await import(`./BfWrPERt.js`);return{exclamationTriangleSvg:e}},__vite__mapDeps([73,1]),import.meta.url)).exclamationTriangleSvg,reown:async()=>(await e(async()=>{let{reownSvg:e}=await import(`./BjgB73022.js`);return{reownSvg:e}},__vite__mapDeps([74,1]),import.meta.url)).reownSvg};async function R(e){if(P.has(e))return P.get(e);let t=(L[e]??L.copy)();return P.set(e,t),t}var z=class extends d{constructor(){super(...arguments),this.size=`md`,this.name=`copy`,this.color=`fg-300`,this.aspectRatio=`1 / 1`}render(){return this.style.cssText=`
      --local-color: ${`var(--wui-color-${this.color});`}
      --local-width: ${`var(--wui-icon-size-${this.size});`}
      --local-aspect-ratio: ${this.aspectRatio}
    `,c`${ae(R(this.name),c`<div class="fallback"></div>`)}`}};z.styles=[a,n,F],I([m()],z.prototype,`size`,void 0),I([m()],z.prototype,`name`,void 0),I([m()],z.prototype,`color`,void 0),I([m()],z.prototype,`aspectRatio`,void 0),z=I([r(`wui-icon`)],z);var B=S(class extends C{constructor(e){if(super(e),e.type!==x.ATTRIBUTE||e.name!==`class`||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return` `+Object.keys(e).filter(t=>e[t]).join(` `)+` `}update(e,[t]){if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(` `).split(/\s/).filter(e=>e!==``)));for(let e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}let n=e.element.classList;for(let e of this.st)e in t||(n.remove(e),this.st.delete(e));for(let e in t){let r=!!t[e];r===this.st.has(e)||this.nt?.has(e)||(r?(n.add(e),this.st.add(e)):(n.remove(e),this.st.delete(e)))}return u}}),V=l`
  :host {
    display: inline-flex !important;
  }

  slot {
    width: 100%;
    display: inline-block;
    font-style: normal;
    font-family: var(--wui-font-family);
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'case' on;
    line-height: 130%;
    font-weight: var(--wui-font-weight-regular);
    overflow: inherit;
    text-overflow: inherit;
    text-align: var(--local-align);
    color: var(--local-color);
  }

  .wui-line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .wui-line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .wui-font-medium-400 {
    font-size: var(--wui-font-size-medium);
    font-weight: var(--wui-font-weight-light);
    letter-spacing: var(--wui-letter-spacing-medium);
  }

  .wui-font-medium-600 {
    font-size: var(--wui-font-size-medium);
    letter-spacing: var(--wui-letter-spacing-medium);
  }

  .wui-font-title-600 {
    font-size: var(--wui-font-size-title);
    letter-spacing: var(--wui-letter-spacing-title);
  }

  .wui-font-title-6-600 {
    font-size: var(--wui-font-size-title-6);
    letter-spacing: var(--wui-letter-spacing-title-6);
  }

  .wui-font-mini-700 {
    font-size: var(--wui-font-size-mini);
    letter-spacing: var(--wui-letter-spacing-mini);
    text-transform: uppercase;
  }

  .wui-font-large-500,
  .wui-font-large-600,
  .wui-font-large-700 {
    font-size: var(--wui-font-size-large);
    letter-spacing: var(--wui-letter-spacing-large);
  }

  .wui-font-2xl-500,
  .wui-font-2xl-600,
  .wui-font-2xl-700 {
    font-size: var(--wui-font-size-2xl);
    letter-spacing: var(--wui-letter-spacing-2xl);
  }

  .wui-font-paragraph-400,
  .wui-font-paragraph-500,
  .wui-font-paragraph-600,
  .wui-font-paragraph-700 {
    font-size: var(--wui-font-size-paragraph);
    letter-spacing: var(--wui-letter-spacing-paragraph);
  }

  .wui-font-small-400,
  .wui-font-small-500,
  .wui-font-small-600 {
    font-size: var(--wui-font-size-small);
    letter-spacing: var(--wui-letter-spacing-small);
  }

  .wui-font-tiny-400,
  .wui-font-tiny-500,
  .wui-font-tiny-600 {
    font-size: var(--wui-font-size-tiny);
    letter-spacing: var(--wui-letter-spacing-tiny);
  }

  .wui-font-micro-700,
  .wui-font-micro-600 {
    font-size: var(--wui-font-size-micro);
    letter-spacing: var(--wui-letter-spacing-micro);
    text-transform: uppercase;
  }

  .wui-font-tiny-400,
  .wui-font-small-400,
  .wui-font-medium-400,
  .wui-font-paragraph-400 {
    font-weight: var(--wui-font-weight-light);
  }

  .wui-font-large-700,
  .wui-font-paragraph-700,
  .wui-font-micro-700,
  .wui-font-mini-700 {
    font-weight: var(--wui-font-weight-bold);
  }

  .wui-font-medium-600,
  .wui-font-medium-title-600,
  .wui-font-title-6-600,
  .wui-font-large-600,
  .wui-font-paragraph-600,
  .wui-font-small-600,
  .wui-font-tiny-600,
  .wui-font-micro-600 {
    font-weight: var(--wui-font-weight-medium);
  }

  :host([disabled]) {
    opacity: 0.4;
  }
`,H=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},U=class extends d{constructor(){super(...arguments),this.variant=`paragraph-500`,this.color=`fg-300`,this.align=`left`,this.lineClamp=void 0}render(){let e={[`wui-font-${this.variant}`]:!0,[`wui-color-${this.color}`]:!0,[`wui-line-clamp-${this.lineClamp}`]:!!this.lineClamp};return this.style.cssText=`
      --local-align: ${this.align};
      --local-color: var(--wui-color-${this.color});
    `,c`<slot class=${B(e)}></slot>`}};U.styles=[a,V],H([m()],U.prototype,`variant`,void 0),H([m()],U.prototype,`color`,void 0),H([m()],U.prototype,`align`,void 0),H([m()],U.prototype,`lineClamp`,void 0),U=H([r(`wui-text`)],U);var W=l`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    background-color: var(--wui-color-gray-glass-020);
    border-radius: var(--local-border-radius);
    border: var(--local-border);
    box-sizing: content-box;
    width: var(--local-size);
    height: var(--local-size);
    min-height: var(--local-size);
    min-width: var(--local-size);
  }

  @supports (background: color-mix(in srgb, white 50%, black)) {
    :host {
      background-color: color-mix(in srgb, var(--local-bg-value) var(--local-bg-mix), transparent);
    }
  }
`,G=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},K=class extends d{constructor(){super(...arguments),this.size=`md`,this.backgroundColor=`accent-100`,this.iconColor=`accent-100`,this.background=`transparent`,this.border=!1,this.borderColor=`wui-color-bg-125`,this.icon=`copy`}render(){let e=this.iconSize||this.size,t=this.size===`lg`,n=this.size===`xl`,r=t?`12%`:`16%`,i=t?`xxs`:n?`s`:`3xl`,a=this.background===`gray`,o=this.background===`opaque`,s=this.backgroundColor===`accent-100`&&o||this.backgroundColor===`success-100`&&o||this.backgroundColor===`error-100`&&o||this.backgroundColor===`inverse-100`&&o,l=`var(--wui-color-${this.backgroundColor})`;return s?l=`var(--wui-icon-box-bg-${this.backgroundColor})`:a&&(l=`var(--wui-color-gray-${this.backgroundColor})`),this.style.cssText=`
       --local-bg-value: ${l};
       --local-bg-mix: ${s||a?`100%`:r};
       --local-border-radius: var(--wui-border-radius-${i});
       --local-size: var(--wui-icon-box-size-${this.size});
       --local-border: ${this.borderColor===`wui-color-bg-125`?`2px`:`1px`} solid ${this.border?`var(--${this.borderColor})`:`transparent`}
   `,c` <wui-icon color=${this.iconColor} size=${e} name=${this.icon}></wui-icon> `}};K.styles=[a,t,W],G([m()],K.prototype,`size`,void 0),G([m()],K.prototype,`backgroundColor`,void 0),G([m()],K.prototype,`iconColor`,void 0),G([m()],K.prototype,`iconSize`,void 0),G([m()],K.prototype,`background`,void 0),G([m({type:Boolean})],K.prototype,`border`,void 0),G([m()],K.prototype,`borderColor`,void 0),G([m()],K.prototype,`icon`,void 0),K=G([r(`wui-icon-box`)],K);var q=l`
  :host {
    display: block;
    width: var(--local-width);
    height: var(--local-height);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: inherit;
  }
`,J=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Y=class extends d{constructor(){super(...arguments),this.src=`./path/to/image.jpg`,this.alt=`Image`,this.size=void 0}render(){return this.style.cssText=`
      --local-width: ${this.size?`var(--wui-icon-size-${this.size});`:`100%`};
      --local-height: ${this.size?`var(--wui-icon-size-${this.size});`:`100%`};
      `,c`<img src=${this.src} alt=${this.alt} @error=${this.handleImageError} />`}handleImageError(){this.dispatchEvent(new CustomEvent(`onLoadError`,{bubbles:!0,composed:!0}))}};Y.styles=[a,n,q],J([m()],Y.prototype,`src`,void 0),J([m()],Y.prototype,`alt`,void 0),J([m()],Y.prototype,`size`,void 0),Y=J([r(`wui-image`)],Y);var oe=l`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--wui-spacing-m);
    padding: 0 var(--wui-spacing-3xs) !important;
    border-radius: var(--wui-border-radius-5xs);
    transition:
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius, background-color;
  }

  :host > wui-text {
    transform: translateY(5%);
  }

  :host([data-variant='main']) {
    background-color: var(--wui-color-accent-glass-015);
    color: var(--wui-color-accent-100);
  }

  :host([data-variant='shade']) {
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-200);
  }

  :host([data-variant='success']) {
    background-color: var(--wui-icon-box-bg-success-100);
    color: var(--wui-color-success-100);
  }

  :host([data-variant='error']) {
    background-color: var(--wui-icon-box-bg-error-100);
    color: var(--wui-color-error-100);
  }

  :host([data-size='lg']) {
    padding: 11px 5px !important;
  }

  :host([data-size='lg']) > wui-text {
    transform: translateY(2%);
  }
`,X=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Z=class extends d{constructor(){super(...arguments),this.variant=`main`,this.size=`lg`}render(){this.dataset.variant=this.variant,this.dataset.size=this.size;let e=this.size===`md`?`mini-700`:`micro-700`;return c`
      <wui-text data-variant=${this.variant} variant=${e} color="inherit">
        <slot></slot>
      </wui-text>
    `}};Z.styles=[a,oe],X([m()],Z.prototype,`variant`,void 0),X([m()],Z.prototype,`size`,void 0),Z=X([r(`wui-tag`)],Z);var se=l`
  :host {
    display: flex;
  }

  :host([data-size='sm']) > svg {
    width: 12px;
    height: 12px;
  }

  :host([data-size='md']) > svg {
    width: 16px;
    height: 16px;
  }

  :host([data-size='lg']) > svg {
    width: 24px;
    height: 24px;
  }

  :host([data-size='xl']) > svg {
    width: 32px;
    height: 32px;
  }

  svg {
    animation: rotate 2s linear infinite;
  }

  circle {
    fill: none;
    stroke: var(--local-color);
    stroke-width: 4px;
    stroke-dasharray: 1, 124;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  :host([data-size='md']) > svg > circle {
    stroke-width: 6px;
  }

  :host([data-size='sm']) > svg > circle {
    stroke-width: 8px;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 124;
      stroke-dashoffset: 0;
    }

    50% {
      stroke-dasharray: 90, 124;
      stroke-dashoffset: -35;
    }

    100% {
      stroke-dashoffset: -125;
    }
  }
`,Q=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},$=class extends d{constructor(){super(...arguments),this.color=`accent-100`,this.size=`lg`}render(){return this.style.cssText=`--local-color: ${this.color===`inherit`?`inherit`:`var(--wui-color-${this.color})`}`,this.dataset.size=this.size,c`<svg viewBox="25 25 50 50">
      <circle r="20" cy="50" cx="50"></circle>
    </svg>`}};$.styles=[a,se],Q([m()],$.prototype,`color`,void 0),Q([m()],$.prototype,`size`,void 0),$=Q([r(`wui-loading-spinner`)],$);export{h as a,ne as i,A as n,m as o,S as r,B as t};