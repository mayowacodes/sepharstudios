import { I as m$1, v as b, D as i$2, L as resetStyles, F as i$3, T, A, E, w as colorStyles, B as elementStyles } from './core-CNP2T1Uv.js';

const UiHelperUtil = {
    getSpacingStyles(spacing, index) {
        if (Array.isArray(spacing)) {
            return spacing[index] ? `var(--wui-spacing-${spacing[index]})` : undefined;
        }
        else if (typeof spacing === 'string') {
            return `var(--wui-spacing-${spacing})`;
        }
        return undefined;
    },
    getFormattedDate(date) {
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
    },
    getHostName(url) {
        try {
            const newUrl = new URL(url);
            return newUrl.hostname;
        }
        catch (error) {
            return '';
        }
    },
    getTruncateString({ string, charsStart, charsEnd, truncate }) {
        if (string.length <= charsStart + charsEnd) {
            return string;
        }
        if (truncate === 'end') {
            return `${string.substring(0, charsStart)}...`;
        }
        else if (truncate === 'start') {
            return `...${string.substring(string.length - charsEnd)}`;
        }
        return `${string.substring(0, Math.floor(charsStart))}...${string.substring(string.length - Math.floor(charsEnd))}`;
    },
    generateAvatarColors(address) {
        const hash = address
            .toLowerCase()
            .replace(/^0x/iu, '')
            .replace(/[^a-f0-9]/gu, '');
        const baseColor = hash.substring(0, 6).padEnd(6, '0');
        const rgbColor = this.hexToRgb(baseColor);
        const masterBorderRadius = getComputedStyle(document.documentElement).getPropertyValue('--w3m-border-radius-master');
        const radius = Number(masterBorderRadius?.replace('px', ''));
        const edge = 100 - 3 * radius;
        const gradientCircle = `${edge}% ${edge}% at 65% 40%`;
        const colors = [];
        for (let i = 0; i < 5; i += 1) {
            const tintedColor = this.tintColor(rgbColor, 0.15 * i);
            colors.push(`rgb(${tintedColor[0]}, ${tintedColor[1]}, ${tintedColor[2]})`);
        }
        return `
    --local-color-1: ${colors[0]};
    --local-color-2: ${colors[1]};
    --local-color-3: ${colors[2]};
    --local-color-4: ${colors[3]};
    --local-color-5: ${colors[4]};
    --local-radial-circle: ${gradientCircle}
   `;
    },
    hexToRgb(hex) {
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return [r, g, b];
    },
    tintColor(rgb, tint) {
        const [r, g, b] = rgb;
        const tintedR = Math.round(r + (255 - r) * tint);
        const tintedG = Math.round(g + (255 - g) * tint);
        const tintedB = Math.round(b + (255 - b) * tint);
        return [tintedR, tintedG, tintedB];
    },
    isNumber(character) {
        const regex = {
            number: /^[0-9]+$/u
        };
        return regex.number.test(character);
    },
    getColorTheme(theme) {
        if (theme) {
            return theme;
        }
        else if (typeof window !== 'undefined' && window.matchMedia) {
            if (window.matchMedia('(prefers-color-scheme: dark)')?.matches) {
                return 'dark';
            }
            return 'light';
        }
        return 'dark';
    },
    splitBalance(input) {
        const parts = input.split('.');
        if (parts.length === 2) {
            return [parts[0], parts[1]];
        }
        return ['0', '00'];
    },
    roundNumber(number, threshold, fixed) {
        const roundedNumber = number.toString().length >= threshold ? Number(number).toFixed(fixed) : number;
        return roundedNumber;
    },
    formatNumberToLocalString(value, decimals = 2) {
        if (value === undefined) {
            return '0.00';
        }
        if (typeof value === 'number') {
            return value.toLocaleString('en-US', {
                maximumFractionDigits: decimals,
                minimumFractionDigits: decimals
            });
        }
        return parseFloat(value).toLocaleString('en-US', {
            maximumFractionDigits: decimals,
            minimumFractionDigits: decimals
        });
    }
};

function standardCustomElement(tagName, descriptor) {
    const { kind, elements } = descriptor;
    return {
        kind,
        elements,
        finisher(clazz) {
            if (!customElements.get(tagName)) {
                customElements.define(tagName, clazz);
            }
        }
    };
}
function legacyCustomElement(tagName, clazz) {
    if (!customElements.get(tagName)) {
        customElements.define(tagName, clazz);
    }
    return clazz;
}
function customElement(tagName) {
    return function create(classOrDescriptor) {
        return typeof classOrDescriptor === 'function'
            ? legacyCustomElement(tagName, classOrDescriptor)
            : standardCustomElement(tagName, classOrDescriptor);
    };
}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o$2={attribute:true,type:String,converter:b,reflect:false,hasChanged:m$1},r$3=(t=o$2,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,true,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,true,r);}}throw Error("Unsupported decorator location: "+n)};function n$3(t){return (e,o)=>"object"==typeof o?r$3(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r$2(r){return n$3({...r,state:true,attribute:false})}

var styles$6 = i$2 `
  :host {
    display: flex;
    width: inherit;
    height: inherit;
  }
`;

var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let WuiFlex = class WuiFlex extends i$3 {
    render() {
        this.style.cssText = `
      flex-direction: ${this.flexDirection};
      flex-wrap: ${this.flexWrap};
      flex-basis: ${this.flexBasis};
      flex-grow: ${this.flexGrow};
      flex-shrink: ${this.flexShrink};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      column-gap: ${this.columnGap && `var(--wui-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap && `var(--wui-spacing-${this.rowGap})`};
      gap: ${this.gap && `var(--wui-spacing-${this.gap})`};
      padding-top: ${this.padding && UiHelperUtil.getSpacingStyles(this.padding, 0)};
      padding-right: ${this.padding && UiHelperUtil.getSpacingStyles(this.padding, 1)};
      padding-bottom: ${this.padding && UiHelperUtil.getSpacingStyles(this.padding, 2)};
      padding-left: ${this.padding && UiHelperUtil.getSpacingStyles(this.padding, 3)};
      margin-top: ${this.margin && UiHelperUtil.getSpacingStyles(this.margin, 0)};
      margin-right: ${this.margin && UiHelperUtil.getSpacingStyles(this.margin, 1)};
      margin-bottom: ${this.margin && UiHelperUtil.getSpacingStyles(this.margin, 2)};
      margin-left: ${this.margin && UiHelperUtil.getSpacingStyles(this.margin, 3)};
    `;
        return T `<slot></slot>`;
    }
};
WuiFlex.styles = [resetStyles, styles$6];
__decorate$6([
    n$3()
], WuiFlex.prototype, "flexDirection", void 0);
__decorate$6([
    n$3()
], WuiFlex.prototype, "flexWrap", void 0);
__decorate$6([
    n$3()
], WuiFlex.prototype, "flexBasis", void 0);
__decorate$6([
    n$3()
], WuiFlex.prototype, "flexGrow", void 0);
__decorate$6([
    n$3()
], WuiFlex.prototype, "flexShrink", void 0);
__decorate$6([
    n$3()
], WuiFlex.prototype, "alignItems", void 0);
__decorate$6([
    n$3()
], WuiFlex.prototype, "justifyContent", void 0);
__decorate$6([
    n$3()
], WuiFlex.prototype, "columnGap", void 0);
__decorate$6([
    n$3()
], WuiFlex.prototype, "rowGap", void 0);
__decorate$6([
    n$3()
], WuiFlex.prototype, "gap", void 0);
__decorate$6([
    n$3()
], WuiFlex.prototype, "padding", void 0);
__decorate$6([
    n$3()
], WuiFlex.prototype, "margin", void 0);
WuiFlex = __decorate$6([
    customElement('wui-flex')
], WuiFlex);

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o$1=o=>o??A;

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const n$2=o=>null===o||"object"!=typeof o&&"function"!=typeof o,r$1=o=>void 0===o.strings;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={ATTRIBUTE:1,CHILD:2},e$1=t=>(...e)=>({_$litDirective$:t,values:e});let i$1 = class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i;}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s$1=(i,t)=>{const e=i._$AN;if(void 0===e)return  false;for(const i of e)i._$AO?.(t,false),s$1(i,t);return  true},o=i=>{let t,e;do{if(void 0===(t=i._$AM))break;e=t._$AN,e.delete(i),i=t;}while(0===e?.size)},r=i=>{for(let t;t=i._$AM;i=t){let e=t._$AN;if(void 0===e)t._$AN=e=new Set;else if(e.has(i))break;e.add(i),c$1(t);}};function h$1(i){ void 0!==this._$AN?(o(this),this._$AM=i,r(this)):this._$AM=i;}function n$1(i,t=false,e=0){const r=this._$AH,h=this._$AN;if(void 0!==h&&0!==h.size)if(t)if(Array.isArray(r))for(let i=e;i<r.length;i++)s$1(r[i],false),o(r[i]);else null!=r&&(s$1(r,false),o(r));else s$1(this,i);}const c$1=i=>{i.type==t.CHILD&&(i._$AP??=n$1,i._$AQ??=h$1);};class f extends i$1{constructor(){super(...arguments),this._$AN=void 0;}_$AT(i,t,e){super._$AT(i,t,e),r(this),this.isConnected=i._$AU;}_$AO(i,t=true){i!==this.isConnected&&(this.isConnected=i,i?this.reconnected?.():this.disconnected?.()),t&&(s$1(this,i),o(this));}setValue(t){if(r$1(this._$Ct))this._$Ct._$AI(t,this);else {const i=[...this._$Ct._$AH];i[this._$Ci]=t,this._$Ct._$AI(i,this,0);}}disconnected(){}reconnected(){}}

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class s{constructor(t){this.G=t;}disconnect(){this.G=void 0;}reconnect(t){this.G=t;}deref(){return this.G}}class i{constructor(){this.Y=void 0,this.Z=void 0;}get(){return this.Y}pause(){this.Y??=new Promise(t=>this.Z=t);}resume(){this.Z?.(),this.Y=this.Z=void 0;}}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const n=t=>!n$2(t)&&"function"==typeof t.then,h=1073741823;class c extends f{constructor(){super(...arguments),this._$Cwt=h,this._$Cbt=[],this._$CK=new s(this),this._$CX=new i;}render(...s){return s.find(t=>!n(t))??E}update(s,i){const e=this._$Cbt;let r=e.length;this._$Cbt=i;const o=this._$CK,c=this._$CX;this.isConnected||this.disconnected();for(let t=0;t<i.length&&!(t>this._$Cwt);t++){const s=i[t];if(!n(s))return this._$Cwt=t,s;t<r&&s===e[t]||(this._$Cwt=h,r=0,Promise.resolve(s).then(async t=>{for(;c.get();)await c.get();const i=o.deref();if(void 0!==i){const e=i._$Cbt.indexOf(s);e>-1&&e<i._$Cwt&&(i._$Cwt=e,i.setValue(t));}}));}return E}disconnected(){this._$CK.disconnect(),this._$CX.pause();}reconnected(){this._$CK.reconnect(this),this._$CX.resume();}}const m=e$1(c);

class CacheUtil {
    constructor() {
        this.cache = new Map();
    }
    set(key, value) {
        this.cache.set(key, value);
    }
    get(key) {
        return this.cache.get(key);
    }
    has(key) {
        return this.cache.has(key);
    }
    delete(key) {
        this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
}
const globalSvgCache = new CacheUtil();

var styles$5 = i$2 `
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
`;

var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const ICONS = {
    add: async () => (await import('./add-Bha7EC2Z.js')).addSvg,
    allWallets: async () => (await import('./all-wallets-BdYrdOIz.js')).allWalletsSvg,
    arrowBottomCircle: async () => (await import('./arrow-bottom-circle-Be-kqW9Y.js')).arrowBottomCircleSvg,
    appStore: async () => (await import('./app-store-BNWkU1yS.js')).appStoreSvg,
    apple: async () => (await import('./apple-CHyrGD3s.js')).appleSvg,
    arrowBottom: async () => (await import('./arrow-bottom-CIZa1qKM.js')).arrowBottomSvg,
    arrowLeft: async () => (await import('./arrow-left-BNxJTCkI.js')).arrowLeftSvg,
    arrowRight: async () => (await import('./arrow-right-Bifp-ofD.js')).arrowRightSvg,
    arrowTop: async () => (await import('./arrow-top-D-ds45Nc.js')).arrowTopSvg,
    bank: async () => (await import('./bank-C5R1YnAE.js')).bankSvg,
    browser: async () => (await import('./browser-Da9Rk13G.js')).browserSvg,
    card: async () => (await import('./card-51bXjJai.js')).cardSvg,
    checkmark: async () => (await import('./checkmark-CaBEih3h.js')).checkmarkSvg,
    checkmarkBold: async () => (await import('./checkmark-bold-DYnfzzIR.js')).checkmarkBoldSvg,
    chevronBottom: async () => (await import('./chevron-bottom-BEgZRmYh.js')).chevronBottomSvg,
    chevronLeft: async () => (await import('./chevron-left-BKZM3jud.js')).chevronLeftSvg,
    chevronRight: async () => (await import('./chevron-right-CLyU-BJG.js')).chevronRightSvg,
    chevronTop: async () => (await import('./chevron-top-DY5kXCSL.js')).chevronTopSvg,
    chromeStore: async () => (await import('./chrome-store-B9iIBzXF.js')).chromeStoreSvg,
    clock: async () => (await import('./clock-p0lGnul8.js')).clockSvg,
    close: async () => (await import('./close-IDUoiiSn.js')).closeSvg,
    compass: async () => (await import('./compass-CgC5ooMx.js')).compassSvg,
    coinPlaceholder: async () => (await import('./coinPlaceholder-BoXdd6EC.js')).coinPlaceholderSvg,
    copy: async () => (await import('./copy-DsvrHRDp.js')).copySvg,
    cursor: async () => (await import('./cursor-CdnhARcX.js')).cursorSvg,
    cursorTransparent: async () => (await import('./cursor-transparent-BaO89XYO.js')).cursorTransparentSvg,
    desktop: async () => (await import('./desktop-Bg0yO0Jq.js')).desktopSvg,
    disconnect: async () => (await import('./disconnect-zXNv_9zF.js')).disconnectSvg,
    discord: async () => (await import('./discord-Bbljn8UD.js')).discordSvg,
    etherscan: async () => (await import('./etherscan-C_Yng69I.js')).etherscanSvg,
    extension: async () => (await import('./extension-DEXcWFzq.js')).extensionSvg,
    externalLink: async () => (await import('./external-link-DkM0fH7X.js')).externalLinkSvg,
    facebook: async () => (await import('./facebook-B7E-ULQF.js')).facebookSvg,
    farcaster: async () => (await import('./farcaster-0Z-sxHjl.js')).farcasterSvg,
    filters: async () => (await import('./filters-bgRIx2IP.js')).filtersSvg,
    github: async () => (await import('./github-CLeErdSH.js')).githubSvg,
    google: async () => (await import('./google-Bflov1H7.js')).googleSvg,
    helpCircle: async () => (await import('./help-circle-DErLZt1P.js')).helpCircleSvg,
    image: async () => (await import('./image-Z48bDWm-.js')).imageSvg,
    id: async () => (await import('./id-BI6TI3Tv.js')).idSvg,
    infoCircle: async () => (await import('./info-circle-rBLNByIQ.js')).infoCircleSvg,
    lightbulb: async () => (await import('./lightbulb-D8ay8UXw.js')).lightbulbSvg,
    mail: async () => (await import('./mail-gb9jTcQZ.js')).mailSvg,
    mobile: async () => (await import('./mobile-B5Rf0Pb2.js')).mobileSvg,
    more: async () => (await import('./more-Dl3I4RrP.js')).moreSvg,
    networkPlaceholder: async () => (await import('./network-placeholder-DBmhn0IT.js')).networkPlaceholderSvg,
    nftPlaceholder: async () => (await import('./nftPlaceholder-BmolUpR5.js')).nftPlaceholderSvg,
    off: async () => (await import('./off-SW7DMtIa.js')).offSvg,
    playStore: async () => (await import('./play-store-DuchtHWV.js')).playStoreSvg,
    plus: async () => (await import('./plus-DBYcMTd-.js')).plusSvg,
    qrCode: async () => (await import('./qr-code-3s-oq0lW.js')).qrCodeIcon,
    recycleHorizontal: async () => (await import('./recycle-horizontal-C5S2sz6f.js')).recycleHorizontalSvg,
    refresh: async () => (await import('./refresh-Cc1A0yG_.js')).refreshSvg,
    search: async () => (await import('./search-Bv8nJuOT.js')).searchSvg,
    send: async () => (await import('./send-DDMFzWWU.js')).sendSvg,
    swapHorizontal: async () => (await import('./swapHorizontal-HZN7Nu63.js')).swapHorizontalSvg,
    swapHorizontalMedium: async () => (await import('./swapHorizontalMedium-CvtPGpip.js')).swapHorizontalMediumSvg,
    swapHorizontalBold: async () => (await import('./swapHorizontalBold-DkhgGq4s.js')).swapHorizontalBoldSvg,
    swapHorizontalRoundedBold: async () => (await import('./swapHorizontalRoundedBold-hAKe8gg-.js')).swapHorizontalRoundedBoldSvg,
    swapVertical: async () => (await import('./swapVertical-DoH-l1fI.js')).swapVerticalSvg,
    telegram: async () => (await import('./telegram-B6vPP2PK.js')).telegramSvg,
    threeDots: async () => (await import('./three-dots-CykGS8ND.js')).threeDotsSvg,
    twitch: async () => (await import('./twitch-B_Uc--rP.js')).twitchSvg,
    twitter: async () => (await import('./x-DJVZWTUO.js')).xSvg,
    twitterIcon: async () => (await import('./twitterIcon-Cnu892RR.js')).twitterIconSvg,
    verify: async () => (await import('./verify-CgS8IW2f.js')).verifySvg,
    verifyFilled: async () => (await import('./verify-filled-wJflolpP.js')).verifyFilledSvg,
    wallet: async () => (await import('./wallet-CNlfO_Hv.js')).walletSvg,
    walletConnect: async () => (await import('./walletconnect-CrIepYwy.js')).walletConnectSvg,
    walletConnectLightBrown: async () => (await import('./walletconnect-CrIepYwy.js')).walletConnectLightBrownSvg,
    walletConnectBrown: async () => (await import('./walletconnect-CrIepYwy.js')).walletConnectBrownSvg,
    walletPlaceholder: async () => (await import('./wallet-placeholder-CkRUpOAE.js')).walletPlaceholderSvg,
    warningCircle: async () => (await import('./warning-circle-BohgY_Vs.js')).warningCircleSvg,
    x: async () => (await import('./x-DJVZWTUO.js')).xSvg,
    info: async () => (await import('./info-CjuU4vp-.js')).infoSvg,
    exclamationTriangle: async () => (await import('./exclamation-triangle-Cxw_LnwK.js')).exclamationTriangleSvg,
    reown: async () => (await import('./reown-logo-jYd9hYyG.js')).reownSvg
};
async function getSvg(name) {
    if (globalSvgCache.has(name)) {
        return globalSvgCache.get(name);
    }
    const importFn = ICONS[name] ?? ICONS.copy;
    const svgPromise = importFn();
    globalSvgCache.set(name, svgPromise);
    return svgPromise;
}
let WuiIcon = class WuiIcon extends i$3 {
    constructor() {
        super(...arguments);
        this.size = 'md';
        this.name = 'copy';
        this.color = 'fg-300';
        this.aspectRatio = '1 / 1';
    }
    render() {
        this.style.cssText = `
      --local-color: ${`var(--wui-color-${this.color});`}
      --local-width: ${`var(--wui-icon-size-${this.size});`}
      --local-aspect-ratio: ${this.aspectRatio}
    `;
        return T `${m(getSvg(this.name), T `<div class="fallback"></div>`)}`;
    }
};
WuiIcon.styles = [resetStyles, colorStyles, styles$5];
__decorate$5([
    n$3()
], WuiIcon.prototype, "size", void 0);
__decorate$5([
    n$3()
], WuiIcon.prototype, "name", void 0);
__decorate$5([
    n$3()
], WuiIcon.prototype, "color", void 0);
__decorate$5([
    n$3()
], WuiIcon.prototype, "aspectRatio", void 0);
WuiIcon = __decorate$5([
    customElement('wui-icon')
], WuiIcon);

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const e=e$1(class extends i$1{constructor(t$1){if(super(t$1),t$1.type!==t.ATTRIBUTE||"class"!==t$1.name||t$1.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return " "+Object.keys(t).filter(s=>t[s]).join(" ")+" "}update(s,[i]){if(void 0===this.st){this.st=new Set,void 0!==s.strings&&(this.nt=new Set(s.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in i)i[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(i)}const r=s.element.classList;for(const t of this.st)t in i||(r.remove(t),this.st.delete(t));for(const t in i){const s=!!i[t];s===this.st.has(t)||this.nt?.has(t)||(s?(r.add(t),this.st.add(t)):(r.remove(t),this.st.delete(t)));}return E}});

var styles$4 = i$2 `
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
`;

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let WuiText = class WuiText extends i$3 {
    constructor() {
        super(...arguments);
        this.variant = 'paragraph-500';
        this.color = 'fg-300';
        this.align = 'left';
        this.lineClamp = undefined;
    }
    render() {
        const classes = {
            [`wui-font-${this.variant}`]: true,
            [`wui-color-${this.color}`]: true,
            [`wui-line-clamp-${this.lineClamp}`]: this.lineClamp ? true : false
        };
        this.style.cssText = `
      --local-align: ${this.align};
      --local-color: var(--wui-color-${this.color});
    `;
        return T `<slot class=${e(classes)}></slot>`;
    }
};
WuiText.styles = [resetStyles, styles$4];
__decorate$4([
    n$3()
], WuiText.prototype, "variant", void 0);
__decorate$4([
    n$3()
], WuiText.prototype, "color", void 0);
__decorate$4([
    n$3()
], WuiText.prototype, "align", void 0);
__decorate$4([
    n$3()
], WuiText.prototype, "lineClamp", void 0);
WuiText = __decorate$4([
    customElement('wui-text')
], WuiText);

var styles$3 = i$2 `
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
`;

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let WuiIconBox = class WuiIconBox extends i$3 {
    constructor() {
        super(...arguments);
        this.size = 'md';
        this.backgroundColor = 'accent-100';
        this.iconColor = 'accent-100';
        this.background = 'transparent';
        this.border = false;
        this.borderColor = 'wui-color-bg-125';
        this.icon = 'copy';
    }
    render() {
        const iconSize = this.iconSize || this.size;
        const isLg = this.size === 'lg';
        const isXl = this.size === 'xl';
        const bgMix = isLg ? '12%' : '16%';
        const borderRadius = isLg ? 'xxs' : isXl ? 's' : '3xl';
        const isGray = this.background === 'gray';
        const isOpaque = this.background === 'opaque';
        const isColorChange = (this.backgroundColor === 'accent-100' && isOpaque) ||
            (this.backgroundColor === 'success-100' && isOpaque) ||
            (this.backgroundColor === 'error-100' && isOpaque) ||
            (this.backgroundColor === 'inverse-100' && isOpaque);
        let bgValueVariable = `var(--wui-color-${this.backgroundColor})`;
        if (isColorChange) {
            bgValueVariable = `var(--wui-icon-box-bg-${this.backgroundColor})`;
        }
        else if (isGray) {
            bgValueVariable = `var(--wui-color-gray-${this.backgroundColor})`;
        }
        this.style.cssText = `
       --local-bg-value: ${bgValueVariable};
       --local-bg-mix: ${isColorChange || isGray ? `100%` : bgMix};
       --local-border-radius: var(--wui-border-radius-${borderRadius});
       --local-size: var(--wui-icon-box-size-${this.size});
       --local-border: ${this.borderColor === 'wui-color-bg-125' ? `2px` : `1px`} solid ${this.border ? `var(--${this.borderColor})` : `transparent`}
   `;
        return T ` <wui-icon color=${this.iconColor} size=${iconSize} name=${this.icon}></wui-icon> `;
    }
};
WuiIconBox.styles = [resetStyles, elementStyles, styles$3];
__decorate$3([
    n$3()
], WuiIconBox.prototype, "size", void 0);
__decorate$3([
    n$3()
], WuiIconBox.prototype, "backgroundColor", void 0);
__decorate$3([
    n$3()
], WuiIconBox.prototype, "iconColor", void 0);
__decorate$3([
    n$3()
], WuiIconBox.prototype, "iconSize", void 0);
__decorate$3([
    n$3()
], WuiIconBox.prototype, "background", void 0);
__decorate$3([
    n$3({ type: Boolean })
], WuiIconBox.prototype, "border", void 0);
__decorate$3([
    n$3()
], WuiIconBox.prototype, "borderColor", void 0);
__decorate$3([
    n$3()
], WuiIconBox.prototype, "icon", void 0);
WuiIconBox = __decorate$3([
    customElement('wui-icon-box')
], WuiIconBox);

var styles$2 = i$2 `
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
`;

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let WuiImage = class WuiImage extends i$3 {
    constructor() {
        super(...arguments);
        this.src = './path/to/image.jpg';
        this.alt = 'Image';
        this.size = undefined;
    }
    render() {
        this.style.cssText = `
      --local-width: ${this.size ? `var(--wui-icon-size-${this.size});` : '100%'};
      --local-height: ${this.size ? `var(--wui-icon-size-${this.size});` : '100%'};
      `;
        return T `<img src=${this.src} alt=${this.alt} @error=${this.handleImageError} />`;
    }
    handleImageError() {
        this.dispatchEvent(new CustomEvent('onLoadError', { bubbles: true, composed: true }));
    }
};
WuiImage.styles = [resetStyles, colorStyles, styles$2];
__decorate$2([
    n$3()
], WuiImage.prototype, "src", void 0);
__decorate$2([
    n$3()
], WuiImage.prototype, "alt", void 0);
__decorate$2([
    n$3()
], WuiImage.prototype, "size", void 0);
WuiImage = __decorate$2([
    customElement('wui-image')
], WuiImage);

var styles$1 = i$2 `
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
`;

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let WuiTag = class WuiTag extends i$3 {
    constructor() {
        super(...arguments);
        this.variant = 'main';
        this.size = 'lg';
    }
    render() {
        this.dataset['variant'] = this.variant;
        this.dataset['size'] = this.size;
        const textVariant = this.size === 'md' ? 'mini-700' : 'micro-700';
        return T `
      <wui-text data-variant=${this.variant} variant=${textVariant} color="inherit">
        <slot></slot>
      </wui-text>
    `;
    }
};
WuiTag.styles = [resetStyles, styles$1];
__decorate$1([
    n$3()
], WuiTag.prototype, "variant", void 0);
__decorate$1([
    n$3()
], WuiTag.prototype, "size", void 0);
WuiTag = __decorate$1([
    customElement('wui-tag')
], WuiTag);

var styles = i$2 `
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
`;

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let WuiLoadingSpinner = class WuiLoadingSpinner extends i$3 {
    constructor() {
        super(...arguments);
        this.color = 'accent-100';
        this.size = 'lg';
    }
    render() {
        this.style.cssText = `--local-color: ${this.color === 'inherit' ? 'inherit' : `var(--wui-color-${this.color})`}`;
        this.dataset['size'] = this.size;
        return T `<svg viewBox="25 25 50 50">
      <circle r="20" cy="50" cx="50"></circle>
    </svg>`;
    }
};
WuiLoadingSpinner.styles = [resetStyles, styles];
__decorate([
    n$3()
], WuiLoadingSpinner.prototype, "color", void 0);
__decorate([
    n$3()
], WuiLoadingSpinner.prototype, "size", void 0);
WuiLoadingSpinner = __decorate([
    customElement('wui-loading-spinner')
], WuiLoadingSpinner);

export { UiHelperUtil as U, e as a, customElement as c, e$1 as e, f, n$3 as n, o$1 as o, r$2 as r };
//# sourceMappingURL=index-CSG18HjE.js.map
