import require$$0, { EventEmitter } from 'events';
import { I as IEvents, g as cjsExports, s as fromString, T as toString, h as cjsExports$1, i as cjsExports$2, C as C$3, m as detect, j as concat, R as sn$2, f as bs58, D as k$4, A as A$3, E as E$4, v as i$4, u as h$5, V as y$6, q as formatJsonRpcRequest, J as r$3, O as Ot$2, F as o$4, n as f$4, y as isJsonRpcRequest, z as isJsonRpcResponse, r as formatJsonRpcResult, P as Po$1, Q as Qe$3, a as Qo, N as safeJsonStringify, M as safeJsonParse, t as getBigIntRpcId, p as formatJsonRpcError, B as isJsonRpcResult, x as isJsonRpcError, G as payloadId, o as f$5 } from './index.es-KhyYp4mt.js';
import * as nc$1 from 'node:crypto';
import 'crypto';

const ConstantsUtil$3 = {
    WC_NAME_SUFFIX: '.reown.id',
    WC_NAME_SUFFIX_LEGACY: '.wcn.id',
    BLOCKCHAIN_API_RPC_URL: 'https://rpc.walletconnect.org',
    PULSE_API_URL: 'https://pulse.walletconnect.org',
    W3M_API_URL: 'https://api.web3modal.org',
    CONNECTOR_ID: {
        WALLET_CONNECT: 'walletConnect',
        INJECTED: 'injected',
        WALLET_STANDARD: 'announced',
        COINBASE: 'coinbaseWallet',
        COINBASE_SDK: 'coinbaseWalletSDK',
        SAFE: 'safe',
        LEDGER: 'ledger',
        OKX: 'okx',
        EIP6963: 'eip6963',
        AUTH: 'ID_AUTH'
    },
    CONNECTOR_NAMES: {
        AUTH: 'Auth'
    },
    AUTH_CONNECTOR_SUPPORTED_CHAINS: ['eip155', 'solana'],
    LIMITS: {
        PENDING_TRANSACTIONS: 99
    },
    CHAIN: {
        EVM: 'eip155',
        SOLANA: 'solana',
        POLKADOT: 'polkadot',
        BITCOIN: 'bip122'
    },
    CHAIN_NAME_MAP: {
        eip155: 'EVM Networks',
        solana: 'Solana',
        polkadot: 'Polkadot',
        bip122: 'Bitcoin',
        cosmos: 'Cosmos'
    },
    ADAPTER_TYPES: {
        BITCOIN: 'bitcoin',
        SOLANA: 'solana',
        WAGMI: 'wagmi',
        ETHERS: 'ethers',
        ETHERS5: 'ethers5'
    },
    USDT_CONTRACT_ADDRESSES: [
        '0xdac17f958d2ee523a2206206994597c13d831ec7',
        '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7',
        '0x919C1c267BC06a7039e03fcc2eF738525769109c',
        '0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e',
        '0x55d398326f99059fF775485246999027B3197955',
        '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9'
    ],
    HTTP_STATUS_CODES: {
        SERVICE_UNAVAILABLE: 503,
        FORBIDDEN: 403
    },
    UNSUPPORTED_NETWORK_NAME: 'Unknown Network',
    SECURE_SITE_SDK_ORIGIN: (typeof process !== 'undefined' && typeof process.env !== 'undefined'
        ? process.env['NEXT_PUBLIC_SECURE_SITE_ORIGIN']
        : undefined) || 'https://secure.walletconnect.org'
};

const NetworkUtil$1 = {
    caipNetworkIdToNumber(caipnetworkId) {
        return caipnetworkId ? Number(caipnetworkId.split(':')[1]) : undefined;
    },
    parseEvmChainId(chainId) {
        return typeof chainId === 'string'
            ? this.caipNetworkIdToNumber(chainId)
            : chainId;
    },
    getNetworksByNamespace(networks, namespace) {
        return networks?.filter(network => network.chainNamespace === namespace) || [];
    },
    getFirstNetworkByNamespace(networks, namespace) {
        return this.getNetworksByNamespace(networks, namespace)[0];
    },
    getNetworkNameByCaipNetworkId(caipNetworks, caipNetworkId) {
        if (!caipNetworkId) {
            return undefined;
        }
        const caipNetwork = caipNetworks.find(network => network.caipNetworkId === caipNetworkId);
        if (caipNetwork) {
            return caipNetwork.name;
        }
        const [namespace] = caipNetworkId.split(':');
        return ConstantsUtil$3.CHAIN_NAME_MAP?.[namespace] || undefined;
    }
};

/*
 *  big.js v6.2.2
 *  A small, fast, easy-to-use library for arbitrary-precision decimal arithmetic.
 *  Copyright (c) 2024 Michael Mclaughlin
 *  https://github.com/MikeMcl/big.js/LICENCE.md
 */


/************************************** EDITABLE DEFAULTS *****************************************/


  // The default values below must be integers within the stated ranges.

  /*
   * The maximum number of decimal places (DP) of the results of operations involving division:
   * div and sqrt, and pow with negative exponents.
   */
var DP = 20,          // 0 to MAX_DP

  /*
   * The rounding mode (RM) used when rounding to the above decimal places.
   *
   *  0  Towards zero (i.e. truncate, no rounding).       (ROUND_DOWN)
   *  1  To nearest neighbour. If equidistant, round up.  (ROUND_HALF_UP)
   *  2  To nearest neighbour. If equidistant, to even.   (ROUND_HALF_EVEN)
   *  3  Away from zero.                                  (ROUND_UP)
   */
  RM = 1,             // 0, 1, 2 or 3

  // The maximum value of DP and Big.DP.
  MAX_DP = 1E6,       // 0 to 1000000

  // The maximum magnitude of the exponent argument to the pow method.
  MAX_POWER = 1E6,    // 1 to 1000000

  /*
   * The negative exponent (NE) at and beneath which toString returns exponential notation.
   * (JavaScript numbers: -7)
   * -1000000 is the minimum recommended exponent value of a Big.
   */
  NE = -7,            // 0 to -1000000

  /*
   * The positive exponent (PE) at and above which toString returns exponential notation.
   * (JavaScript numbers: 21)
   * 1000000 is the maximum recommended exponent value of a Big, but this limit is not enforced.
   */
  PE = 21,            // 0 to 1000000

  /*
   * When true, an error will be thrown if a primitive number is passed to the Big constructor,
   * or if valueOf is called, or if toNumber is called on a Big which cannot be converted to a
   * primitive number without a loss of precision.
   */
  STRICT = false,     // true or false


/**************************************************************************************************/


  // Error messages.
  NAME = '[big.js] ',
  INVALID = NAME + 'Invalid ',
  INVALID_DP = INVALID + 'decimal places',
  INVALID_RM = INVALID + 'rounding mode',
  DIV_BY_ZERO = NAME + 'Division by zero',

  // The shared prototype object.
  P$3 = {},
  UNDEFINED = void 0,
  NUMERIC = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;


/*
 * Create and return a Big constructor.
 */
function _Big_() {

  /*
   * The Big constructor and exported function.
   * Create and return a new instance of a Big number object.
   *
   * n {number|string|Big} A numeric value.
   */
  function Big(n) {
    var x = this;

    // Enable constructor usage without new.
    if (!(x instanceof Big)) return n === UNDEFINED ? _Big_() : new Big(n);

    // Duplicate.
    if (n instanceof Big) {
      x.s = n.s;
      x.e = n.e;
      x.c = n.c.slice();
    } else {
      if (typeof n !== 'string') {
        if (Big.strict === true && typeof n !== 'bigint') {
          throw TypeError(INVALID + 'value');
        }

        // Minus zero?
        n = n === 0 && 1 / n < 0 ? '-0' : String(n);
      }

      parse(x, n);
    }

    // Retain a reference to this Big constructor.
    // Shadow Big.prototype.constructor which points to Object.
    x.constructor = Big;
  }

  Big.prototype = P$3;
  Big.DP = DP;
  Big.RM = RM;
  Big.NE = NE;
  Big.PE = PE;
  Big.strict = STRICT;
  Big.roundDown = 0;
  Big.roundHalfUp = 1;
  Big.roundHalfEven = 2;
  Big.roundUp = 3;

  return Big;
}


/*
 * Parse the number or string value passed to a Big constructor.
 *
 * x {Big} A Big number instance.
 * n {number|string} A numeric value.
 */
function parse(x, n) {
  var e, i, nl;

  if (!NUMERIC.test(n)) {
    throw Error(INVALID + 'number');
  }

  // Determine sign.
  x.s = n.charAt(0) == '-' ? (n = n.slice(1), -1) : 1;

  // Decimal point?
  if ((e = n.indexOf('.')) > -1) n = n.replace('.', '');

  // Exponential form?
  if ((i = n.search(/e/i)) > 0) {

    // Determine exponent.
    if (e < 0) e = i;
    e += +n.slice(i + 1);
    n = n.substring(0, i);
  } else if (e < 0) {

    // Integer.
    e = n.length;
  }

  nl = n.length;

  // Determine leading zeros.
  for (i = 0; i < nl && n.charAt(i) == '0';) ++i;

  if (i == nl) {

    // Zero.
    x.c = [x.e = 0];
  } else {

    // Determine trailing zeros.
    for (; nl > 0 && n.charAt(--nl) == '0';);
    x.e = e - i - 1;
    x.c = [];

    // Convert string to array of digits without leading/trailing zeros.
    for (e = 0; i <= nl;) x.c[e++] = +n.charAt(i++);
  }

  return x;
}


/*
 * Round Big x to a maximum of sd significant digits using rounding mode rm.
 *
 * x {Big} The Big to round.
 * sd {number} Significant digits: integer, 0 to MAX_DP inclusive.
 * rm {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
 * [more] {boolean} Whether the result of division was truncated.
 */
function round(x, sd, rm, more) {
  var xc = x.c;

  if (rm === UNDEFINED) rm = x.constructor.RM;
  if (rm !== 0 && rm !== 1 && rm !== 2 && rm !== 3) {
    throw Error(INVALID_RM);
  }

  if (sd < 1) {
    more =
      rm === 3 && (more || !!xc[0]) || sd === 0 && (
      rm === 1 && xc[0] >= 5 ||
      rm === 2 && (xc[0] > 5 || xc[0] === 5 && (more || xc[1] !== UNDEFINED))
    );

    xc.length = 1;

    if (more) {

      // 1, 0.1, 0.01, 0.001, 0.0001 etc.
      x.e = x.e - sd + 1;
      xc[0] = 1;
    } else {

      // Zero.
      xc[0] = x.e = 0;
    }
  } else if (sd < xc.length) {

    // xc[sd] is the digit after the digit that may be rounded up.
    more =
      rm === 1 && xc[sd] >= 5 ||
      rm === 2 && (xc[sd] > 5 || xc[sd] === 5 &&
        (more || xc[sd + 1] !== UNDEFINED || xc[sd - 1] & 1)) ||
      rm === 3 && (more || !!xc[0]);

    // Remove any digits after the required precision.
    xc.length = sd;

    // Round up?
    if (more) {

      // Rounding up may mean the previous digit has to be rounded up.
      for (; ++xc[--sd] > 9;) {
        xc[sd] = 0;
        if (sd === 0) {
          ++x.e;
          xc.unshift(1);
          break;
        }
      }
    }

    // Remove trailing zeros.
    for (sd = xc.length; !xc[--sd];) xc.pop();
  }

  return x;
}


/*
 * Return a string representing the value of Big x in normal or exponential notation.
 * Handles P.toExponential, P.toFixed, P.toJSON, P.toPrecision, P.toString and P.valueOf.
 */
function stringify$1(x, doExponential, isNonzero) {
  var e = x.e,
    s = x.c.join(''),
    n = s.length;

  // Exponential notation?
  if (doExponential) {
    s = s.charAt(0) + (n > 1 ? '.' + s.slice(1) : '') + (e < 0 ? 'e' : 'e+') + e;

  // Normal notation.
  } else if (e < 0) {
    for (; ++e;) s = '0' + s;
    s = '0.' + s;
  } else if (e > 0) {
    if (++e > n) {
      for (e -= n; e--;) s += '0';
    } else if (e < n) {
      s = s.slice(0, e) + '.' + s.slice(e);
    }
  } else if (n > 1) {
    s = s.charAt(0) + '.' + s.slice(1);
  }

  return x.s < 0 && isNonzero ? '-' + s : s;
}


// Prototype/instance methods


/*
 * Return a new Big whose value is the absolute value of this Big.
 */
P$3.abs = function () {
  var x = new this.constructor(this);
  x.s = 1;
  return x;
};


/*
 * Return 1 if the value of this Big is greater than the value of Big y,
 *       -1 if the value of this Big is less than the value of Big y, or
 *        0 if they have the same value.
 */
P$3.cmp = function (y) {
  var isneg,
    x = this,
    xc = x.c,
    yc = (y = new x.constructor(y)).c,
    i = x.s,
    j = y.s,
    k = x.e,
    l = y.e;

  // Either zero?
  if (!xc[0] || !yc[0]) return !xc[0] ? !yc[0] ? 0 : -j : i;

  // Signs differ?
  if (i != j) return i;

  isneg = i < 0;

  // Compare exponents.
  if (k != l) return k > l ^ isneg ? 1 : -1;

  j = (k = xc.length) < (l = yc.length) ? k : l;

  // Compare digit by digit.
  for (i = -1; ++i < j;) {
    if (xc[i] != yc[i]) return xc[i] > yc[i] ^ isneg ? 1 : -1;
  }

  // Compare lengths.
  return k == l ? 0 : k > l ^ isneg ? 1 : -1;
};


/*
 * Return a new Big whose value is the value of this Big divided by the value of Big y, rounded,
 * if necessary, to a maximum of Big.DP decimal places using rounding mode Big.RM.
 */
P$3.div = function (y) {
  var x = this,
    Big = x.constructor,
    a = x.c,                  // dividend
    b = (y = new Big(y)).c,   // divisor
    k = x.s == y.s ? 1 : -1,
    dp = Big.DP;

  if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
    throw Error(INVALID_DP);
  }

  // Divisor is zero?
  if (!b[0]) {
    throw Error(DIV_BY_ZERO);
  }

  // Dividend is 0? Return +-0.
  if (!a[0]) {
    y.s = k;
    y.c = [y.e = 0];
    return y;
  }

  var bl, bt, n, cmp, ri,
    bz = b.slice(),
    ai = bl = b.length,
    al = a.length,
    r = a.slice(0, bl),   // remainder
    rl = r.length,
    q = y,                // quotient
    qc = q.c = [],
    qi = 0,
    p = dp + (q.e = x.e - y.e) + 1;    // precision of the result

  q.s = k;
  k = p < 0 ? 0 : p;

  // Create version of divisor with leading zero.
  bz.unshift(0);

  // Add zeros to make remainder as long as divisor.
  for (; rl++ < bl;) r.push(0);

  do {

    // n is how many times the divisor goes into current remainder.
    for (n = 0; n < 10; n++) {

      // Compare divisor and remainder.
      if (bl != (rl = r.length)) {
        cmp = bl > rl ? 1 : -1;
      } else {
        for (ri = -1, cmp = 0; ++ri < bl;) {
          if (b[ri] != r[ri]) {
            cmp = b[ri] > r[ri] ? 1 : -1;
            break;
          }
        }
      }

      // If divisor < remainder, subtract divisor from remainder.
      if (cmp < 0) {

        // Remainder can't be more than 1 digit longer than divisor.
        // Equalise lengths using divisor with extra leading zero?
        for (bt = rl == bl ? b : bz; rl;) {
          if (r[--rl] < bt[rl]) {
            ri = rl;
            for (; ri && !r[--ri];) r[ri] = 9;
            --r[ri];
            r[rl] += 10;
          }
          r[rl] -= bt[rl];
        }

        for (; !r[0];) r.shift();
      } else {
        break;
      }
    }

    // Add the digit n to the result array.
    qc[qi++] = cmp ? n : ++n;

    // Update the remainder.
    if (r[0] && cmp) r[rl] = a[ai] || 0;
    else r = [a[ai]];

  } while ((ai++ < al || r[0] !== UNDEFINED) && k--);

  // Leading zero? Do not remove if result is simply zero (qi == 1).
  if (!qc[0] && qi != 1) {

    // There can't be more than one zero.
    qc.shift();
    q.e--;
    p--;
  }

  // Round?
  if (qi > p) round(q, p, Big.RM, r[0] !== UNDEFINED);

  return q;
};


/*
 * Return true if the value of this Big is equal to the value of Big y, otherwise return false.
 */
P$3.eq = function (y) {
  return this.cmp(y) === 0;
};


/*
 * Return true if the value of this Big is greater than the value of Big y, otherwise return
 * false.
 */
P$3.gt = function (y) {
  return this.cmp(y) > 0;
};


/*
 * Return true if the value of this Big is greater than or equal to the value of Big y, otherwise
 * return false.
 */
P$3.gte = function (y) {
  return this.cmp(y) > -1;
};


/*
 * Return true if the value of this Big is less than the value of Big y, otherwise return false.
 */
P$3.lt = function (y) {
  return this.cmp(y) < 0;
};


/*
 * Return true if the value of this Big is less than or equal to the value of Big y, otherwise
 * return false.
 */
P$3.lte = function (y) {
  return this.cmp(y) < 1;
};


/*
 * Return a new Big whose value is the value of this Big minus the value of Big y.
 */
P$3.minus = P$3.sub = function (y) {
  var i, j, t, xlty,
    x = this,
    Big = x.constructor,
    a = x.s,
    b = (y = new Big(y)).s;

  // Signs differ?
  if (a != b) {
    y.s = -b;
    return x.plus(y);
  }

  var xc = x.c.slice(),
    xe = x.e,
    yc = y.c,
    ye = y.e;

  // Either zero?
  if (!xc[0] || !yc[0]) {
    if (yc[0]) {
      y.s = -b;
    } else if (xc[0]) {
      y = new Big(x);
    } else {
      y.s = 1;
    }
    return y;
  }

  // Determine which is the bigger number. Prepend zeros to equalise exponents.
  if (a = xe - ye) {

    if (xlty = a < 0) {
      a = -a;
      t = xc;
    } else {
      ye = xe;
      t = yc;
    }

    t.reverse();
    for (b = a; b--;) t.push(0);
    t.reverse();
  } else {

    // Exponents equal. Check digit by digit.
    j = ((xlty = xc.length < yc.length) ? xc : yc).length;

    for (a = b = 0; b < j; b++) {
      if (xc[b] != yc[b]) {
        xlty = xc[b] < yc[b];
        break;
      }
    }
  }

  // x < y? Point xc to the array of the bigger number.
  if (xlty) {
    t = xc;
    xc = yc;
    yc = t;
    y.s = -y.s;
  }

  /*
   * Append zeros to xc if shorter. No need to add zeros to yc if shorter as subtraction only
   * needs to start at yc.length.
   */
  if ((b = (j = yc.length) - (i = xc.length)) > 0) for (; b--;) xc[i++] = 0;

  // Subtract yc from xc.
  for (b = i; j > a;) {
    if (xc[--j] < yc[j]) {
      for (i = j; i && !xc[--i];) xc[i] = 9;
      --xc[i];
      xc[j] += 10;
    }

    xc[j] -= yc[j];
  }

  // Remove trailing zeros.
  for (; xc[--b] === 0;) xc.pop();

  // Remove leading zeros and adjust exponent accordingly.
  for (; xc[0] === 0;) {
    xc.shift();
    --ye;
  }

  if (!xc[0]) {

    // n - n = +0
    y.s = 1;

    // Result must be zero.
    xc = [ye = 0];
  }

  y.c = xc;
  y.e = ye;

  return y;
};


/*
 * Return a new Big whose value is the value of this Big modulo the value of Big y.
 */
P$3.mod = function (y) {
  var ygtx,
    x = this,
    Big = x.constructor,
    a = x.s,
    b = (y = new Big(y)).s;

  if (!y.c[0]) {
    throw Error(DIV_BY_ZERO);
  }

  x.s = y.s = 1;
  ygtx = y.cmp(x) == 1;
  x.s = a;
  y.s = b;

  if (ygtx) return new Big(x);

  a = Big.DP;
  b = Big.RM;
  Big.DP = Big.RM = 0;
  x = x.div(y);
  Big.DP = a;
  Big.RM = b;

  return this.minus(x.times(y));
};


/*
 * Return a new Big whose value is the value of this Big negated.
 */
P$3.neg = function () {
  var x = new this.constructor(this);
  x.s = -x.s;
  return x;
};


/*
 * Return a new Big whose value is the value of this Big plus the value of Big y.
 */
P$3.plus = P$3.add = function (y) {
  var e, k, t,
    x = this,
    Big = x.constructor;

  y = new Big(y);

  // Signs differ?
  if (x.s != y.s) {
    y.s = -y.s;
    return x.minus(y);
  }

  var xe = x.e,
    xc = x.c,
    ye = y.e,
    yc = y.c;

  // Either zero?
  if (!xc[0] || !yc[0]) {
    if (!yc[0]) {
      if (xc[0]) {
        y = new Big(x);
      } else {
        y.s = x.s;
      }
    }
    return y;
  }

  xc = xc.slice();

  // Prepend zeros to equalise exponents.
  // Note: reverse faster than unshifts.
  if (e = xe - ye) {
    if (e > 0) {
      ye = xe;
      t = yc;
    } else {
      e = -e;
      t = xc;
    }

    t.reverse();
    for (; e--;) t.push(0);
    t.reverse();
  }

  // Point xc to the longer array.
  if (xc.length - yc.length < 0) {
    t = yc;
    yc = xc;
    xc = t;
  }

  e = yc.length;

  // Only start adding at yc.length - 1 as the further digits of xc can be left as they are.
  for (k = 0; e; xc[e] %= 10) k = (xc[--e] = xc[e] + yc[e] + k) / 10 | 0;

  // No need to check for zero, as +x + +y != 0 && -x + -y != 0

  if (k) {
    xc.unshift(k);
    ++ye;
  }

  // Remove trailing zeros.
  for (e = xc.length; xc[--e] === 0;) xc.pop();

  y.c = xc;
  y.e = ye;

  return y;
};


/*
 * Return a Big whose value is the value of this Big raised to the power n.
 * If n is negative, round to a maximum of Big.DP decimal places using rounding
 * mode Big.RM.
 *
 * n {number} Integer, -MAX_POWER to MAX_POWER inclusive.
 */
P$3.pow = function (n) {
  var x = this,
    one = new x.constructor('1'),
    y = one,
    isneg = n < 0;

  if (n !== ~~n || n < -MAX_POWER || n > MAX_POWER) {
    throw Error(INVALID + 'exponent');
  }

  if (isneg) n = -n;

  for (;;) {
    if (n & 1) y = y.times(x);
    n >>= 1;
    if (!n) break;
    x = x.times(x);
  }

  return isneg ? one.div(y) : y;
};


/*
 * Return a new Big whose value is the value of this Big rounded to a maximum precision of sd
 * significant digits using rounding mode rm, or Big.RM if rm is not specified.
 *
 * sd {number} Significant digits: integer, 1 to MAX_DP inclusive.
 * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
 */
P$3.prec = function (sd, rm) {
  if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
    throw Error(INVALID + 'precision');
  }
  return round(new this.constructor(this), sd, rm);
};


/*
 * Return a new Big whose value is the value of this Big rounded to a maximum of dp decimal places
 * using rounding mode rm, or Big.RM if rm is not specified.
 * If dp is negative, round to an integer which is a multiple of 10**-dp.
 * If dp is not specified, round to 0 decimal places.
 *
 * dp? {number} Integer, -MAX_DP to MAX_DP inclusive.
 * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
 */
P$3.round = function (dp, rm) {
  if (dp === UNDEFINED) dp = 0;
  else if (dp !== ~~dp || dp < -MAX_DP || dp > MAX_DP) {
    throw Error(INVALID_DP);
  }
  return round(new this.constructor(this), dp + this.e + 1, rm);
};


/*
 * Return a new Big whose value is the square root of the value of this Big, rounded, if
 * necessary, to a maximum of Big.DP decimal places using rounding mode Big.RM.
 */
P$3.sqrt = function () {
  var r, c, t,
    x = this,
    Big = x.constructor,
    s = x.s,
    e = x.e,
    half = new Big('0.5');

  // Zero?
  if (!x.c[0]) return new Big(x);

  // Negative?
  if (s < 0) {
    throw Error(NAME + 'No square root');
  }

  // Estimate.
  s = Math.sqrt(+stringify$1(x, true, true));

  // Math.sqrt underflow/overflow?
  // Re-estimate: pass x coefficient to Math.sqrt as integer, then adjust the result exponent.
  if (s === 0 || s === 1 / 0) {
    c = x.c.join('');
    if (!(c.length + e & 1)) c += '0';
    s = Math.sqrt(c);
    e = ((e + 1) / 2 | 0) - (e < 0 || e & 1);
    r = new Big((s == 1 / 0 ? '5e' : (s = s.toExponential()).slice(0, s.indexOf('e') + 1)) + e);
  } else {
    r = new Big(s + '');
  }

  e = r.e + (Big.DP += 4);

  // Newton-Raphson iteration.
  do {
    t = r;
    r = half.times(t.plus(x.div(t)));
  } while (t.c.slice(0, e).join('') !== r.c.slice(0, e).join(''));

  return round(r, (Big.DP -= 4) + r.e + 1, Big.RM);
};


/*
 * Return a new Big whose value is the value of this Big times the value of Big y.
 */
P$3.times = P$3.mul = function (y) {
  var c,
    x = this,
    Big = x.constructor,
    xc = x.c,
    yc = (y = new Big(y)).c,
    a = xc.length,
    b = yc.length,
    i = x.e,
    j = y.e;

  // Determine sign of result.
  y.s = x.s == y.s ? 1 : -1;

  // Return signed 0 if either 0.
  if (!xc[0] || !yc[0]) {
    y.c = [y.e = 0];
    return y;
  }

  // Initialise exponent of result as x.e + y.e.
  y.e = i + j;

  // If array xc has fewer digits than yc, swap xc and yc, and lengths.
  if (a < b) {
    c = xc;
    xc = yc;
    yc = c;
    j = a;
    a = b;
    b = j;
  }

  // Initialise coefficient array of result with zeros.
  for (c = new Array(j = a + b); j--;) c[j] = 0;

  // Multiply.

  // i is initially xc.length.
  for (i = b; i--;) {
    b = 0;

    // a is yc.length.
    for (j = a + i; j > i;) {

      // Current sum of products at this digit position, plus carry.
      b = c[j] + yc[i] * xc[j - i - 1] + b;
      c[j--] = b % 10;

      // carry
      b = b / 10 | 0;
    }

    c[j] = b;
  }

  // Increment result exponent if there is a final carry, otherwise remove leading zero.
  if (b) ++y.e;
  else c.shift();

  // Remove trailing zeros.
  for (i = c.length; !c[--i];) c.pop();
  y.c = c;

  return y;
};


/*
 * Return a string representing the value of this Big in exponential notation rounded to dp fixed
 * decimal places using rounding mode rm, or Big.RM if rm is not specified.
 *
 * dp? {number} Decimal places: integer, 0 to MAX_DP inclusive.
 * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
 */
P$3.toExponential = function (dp, rm) {
  var x = this,
    n = x.c[0];

  if (dp !== UNDEFINED) {
    if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
      throw Error(INVALID_DP);
    }
    x = round(new x.constructor(x), ++dp, rm);
    for (; x.c.length < dp;) x.c.push(0);
  }

  return stringify$1(x, true, !!n);
};


/*
 * Return a string representing the value of this Big in normal notation rounded to dp fixed
 * decimal places using rounding mode rm, or Big.RM if rm is not specified.
 *
 * dp? {number} Decimal places: integer, 0 to MAX_DP inclusive.
 * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
 *
 * (-0).toFixed(0) is '0', but (-0.1).toFixed(0) is '-0'.
 * (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
 */
P$3.toFixed = function (dp, rm) {
  var x = this,
    n = x.c[0];

  if (dp !== UNDEFINED) {
    if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
      throw Error(INVALID_DP);
    }
    x = round(new x.constructor(x), dp + x.e + 1, rm);

    // x.e may have changed if the value is rounded up.
    for (dp = dp + x.e + 1; x.c.length < dp;) x.c.push(0);
  }

  return stringify$1(x, false, !!n);
};


/*
 * Return a string representing the value of this Big.
 * Return exponential notation if this Big has a positive exponent equal to or greater than
 * Big.PE, or a negative exponent equal to or less than Big.NE.
 * Omit the sign for negative zero.
 */
P$3[Symbol.for('nodejs.util.inspect.custom')] = P$3.toJSON = P$3.toString = function () {
  var x = this,
    Big = x.constructor;
  return stringify$1(x, x.e <= Big.NE || x.e >= Big.PE, !!x.c[0]);
};


/*
 * Return the value of this Big as a primitve number.
 */
P$3.toNumber = function () {
  var n = +stringify$1(this, true, true);
  if (this.constructor.strict === true && !this.eq(n.toString())) {
    throw Error(NAME + 'Imprecise conversion');
  }
  return n;
};


/*
 * Return a string representing the value of this Big rounded to sd significant digits using
 * rounding mode rm, or Big.RM if rm is not specified.
 * Use exponential notation if sd is less than the number of digits necessary to represent
 * the integer part of the value in normal notation.
 *
 * sd {number} Significant digits: integer, 1 to MAX_DP inclusive.
 * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
 */
P$3.toPrecision = function (sd, rm) {
  var x = this,
    Big = x.constructor,
    n = x.c[0];

  if (sd !== UNDEFINED) {
    if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
      throw Error(INVALID + 'precision');
    }
    x = round(new Big(x), sd, rm);
    for (; x.c.length < sd;) x.c.push(0);
  }

  return stringify$1(x, sd <= x.e || x.e <= Big.NE || x.e >= Big.PE, !!n);
};


/*
 * Return a string representing the value of this Big.
 * Return exponential notation if this Big has a positive exponent equal to or greater than
 * Big.PE, or a negative exponent equal to or less than Big.NE.
 * Include the sign for negative zero.
 */
P$3.valueOf = function () {
  var x = this,
    Big = x.constructor;
  if (Big.strict === true) {
    throw Error(NAME + 'valueOf disallowed');
  }
  return stringify$1(x, x.e <= Big.NE || x.e >= Big.PE, true);
};


// Export


var Big = _Big_();

const NumberUtil = {
    bigNumber(value) {
        if (!value) {
            return new Big(0);
        }
        return new Big(value);
    },
    multiply(a, b) {
        if (a === undefined || b === undefined) {
            return new Big(0);
        }
        const aBigNumber = new Big(a);
        const bBigNumber = new Big(b);
        return aBigNumber.times(bBigNumber);
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
    },
    parseLocalStringToNumber(value) {
        if (value === undefined) {
            return 0;
        }
        return parseFloat(value.replace(/,/gu, ''));
    }
};

const erc20ABI = [
    {
        type: 'function',
        name: 'transfer',
        stateMutability: 'nonpayable',
        inputs: [
            {
                name: '_to',
                type: 'address'
            },
            {
                name: '_value',
                type: 'uint256'
            }
        ],
        outputs: [
            {
                name: '',
                type: 'bool'
            }
        ]
    },
    {
        type: 'function',
        name: 'transferFrom',
        stateMutability: 'nonpayable',
        inputs: [
            {
                name: '_from',
                type: 'address'
            },
            {
                name: '_to',
                type: 'address'
            },
            {
                name: '_value',
                type: 'uint256'
            }
        ],
        outputs: [
            {
                name: '',
                type: 'bool'
            }
        ]
    }
];

const swapABI = [
    {
        type: 'function',
        name: 'approve',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' }
        ],
        outputs: [{ type: 'bool' }]
    }
];

const usdtABI = [
    {
        type: 'function',
        name: 'transfer',
        stateMutability: 'nonpayable',
        inputs: [
            {
                name: 'recipient',
                type: 'address'
            },
            {
                name: 'amount',
                type: 'uint256'
            }
        ],
        outputs: []
    },
    {
        type: 'function',
        name: 'transferFrom',
        stateMutability: 'nonpayable',
        inputs: [
            {
                name: 'sender',
                type: 'address'
            },
            {
                name: 'recipient',
                type: 'address'
            },
            {
                name: 'amount',
                type: 'uint256'
            }
        ],
        outputs: [
            {
                name: '',
                type: 'bool'
            }
        ]
    }
];

const ContractUtil = {
    getERC20Abi: (tokenAddress) => {
        if (ConstantsUtil$3.USDT_CONTRACT_ADDRESSES.includes(tokenAddress)) {
            return usdtABI;
        }
        return erc20ABI;
    },
    getSwapAbi: () => swapABI
};

const ParseUtil = {
    validateCaipAddress(address) {
        if (address.split(':')?.length !== 3) {
            throw new Error('Invalid CAIP Address');
        }
        return address;
    },
    parseCaipAddress(caipAddress) {
        const parts = caipAddress.split(':');
        if (parts.length !== 3) {
            throw new Error(`Invalid CAIP-10 address: ${caipAddress}`);
        }
        const [chainNamespace, chainId, address] = parts;
        if (!chainNamespace || !chainId || !address) {
            throw new Error(`Invalid CAIP-10 address: ${caipAddress}`);
        }
        return {
            chainNamespace: chainNamespace,
            chainId: chainId,
            address
        };
    },
    parseCaipNetworkId(caipNetworkId) {
        const parts = caipNetworkId.split(':');
        if (parts.length !== 2) {
            throw new Error(`Invalid CAIP-2 network id: ${caipNetworkId}`);
        }
        const [chainNamespace, chainId] = parts;
        if (!chainNamespace || !chainId) {
            throw new Error(`Invalid CAIP-2 network id: ${caipNetworkId}`);
        }
        return {
            chainNamespace: chainNamespace,
            chainId: chainId
        };
    }
};

const SafeLocalStorageKeys = {
    WALLET_ID: '@appkit/wallet_id',
    WALLET_NAME: '@appkit/wallet_name',
    SOLANA_WALLET: '@appkit/solana_wallet',
    SOLANA_CAIP_CHAIN: '@appkit/solana_caip_chain',
    ACTIVE_CAIP_NETWORK_ID: '@appkit/active_caip_network_id',
    CONNECTED_SOCIAL: '@appkit/connected_social',
    CONNECTED_SOCIAL_USERNAME: '@appkit-wallet/SOCIAL_USERNAME',
    RECENT_WALLETS: '@appkit/recent_wallets',
    DEEPLINK_CHOICE: 'WALLETCONNECT_DEEPLINK_CHOICE',
    ACTIVE_NAMESPACE: '@appkit/active_namespace',
    CONNECTED_NAMESPACES: '@appkit/connected_namespaces',
    CONNECTION_STATUS: '@appkit/connection_status',
    SIWX_AUTH_TOKEN: '@appkit/siwx-auth-token',
    SIWX_NONCE_TOKEN: '@appkit/siwx-nonce-token',
    TELEGRAM_SOCIAL_PROVIDER: '@appkit/social_provider',
    NATIVE_BALANCE_CACHE: '@appkit/native_balance_cache',
    PORTFOLIO_CACHE: '@appkit/portfolio_cache',
    ENS_CACHE: '@appkit/ens_cache',
    IDENTITY_CACHE: '@appkit/identity_cache',
    PREFERRED_ACCOUNT_TYPES: '@appkit/preferred_account_types',
    CONNECTIONS: '@appkit/connections'
};
function getSafeConnectorIdKey(namespace) {
    if (!namespace) {
        throw new Error('Namespace is required for CONNECTED_CONNECTOR_ID');
    }
    return `@appkit/${namespace}:connected_connector_id`;
}
const SafeLocalStorage = {
    setItem(key, value) {
        if (isSafe$1() && value !== undefined) {
            localStorage.setItem(key, value);
        }
    },
    getItem(key) {
        if (isSafe$1()) {
            return localStorage.getItem(key) || undefined;
        }
        return undefined;
    },
    removeItem(key) {
        if (isSafe$1()) {
            localStorage.removeItem(key);
        }
    },
    clear() {
        if (isSafe$1()) {
            localStorage.clear();
        }
    }
};
function isSafe$1() {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function getW3mThemeVariables(themeVariables, themeType) {
    if (themeType === 'light') {
        return {
            '--w3m-accent': themeVariables?.['--w3m-accent'] || 'hsla(231, 100%, 70%, 1)',
            '--w3m-background': '#fff'
        };
    }
    return {
        '--w3m-accent': themeVariables?.['--w3m-accent'] || 'hsla(230, 100%, 67%, 1)',
        '--w3m-background': '#121313'
    };
}

const t$2=Symbol();const s$3=Object.getPrototypeOf,c$5=new WeakMap,l$3=e=>e&&(c$5.has(e)?c$5.get(e):s$3(e)===Object.prototype||s$3(e)===Array.prototype),y$5=e=>l$3(e)&&e[t$2]||null,h$4=(e,t=true)=>{c$5.set(e,t);};

const isObject = (x) => typeof x === "object" && x !== null;
const proxyStateMap = /* @__PURE__ */ new WeakMap();
const refSet = /* @__PURE__ */ new WeakSet();
const buildProxyFunction = (objectIs = Object.is, newProxy = (target, handler) => new Proxy(target, handler), canProxy = (x) => isObject(x) && !refSet.has(x) && (Array.isArray(x) || !(Symbol.iterator in x)) && !(x instanceof WeakMap) && !(x instanceof WeakSet) && !(x instanceof Error) && !(x instanceof Number) && !(x instanceof Date) && !(x instanceof String) && !(x instanceof RegExp) && !(x instanceof ArrayBuffer), defaultHandlePromise = (promise) => {
  switch (promise.status) {
    case "fulfilled":
      return promise.value;
    case "rejected":
      throw promise.reason;
    default:
      throw promise;
  }
}, snapCache = /* @__PURE__ */ new WeakMap(), createSnapshot = (target, version, handlePromise = defaultHandlePromise) => {
  const cache = snapCache.get(target);
  if ((cache == null ? void 0 : cache[0]) === version) {
    return cache[1];
  }
  const snap = Array.isArray(target) ? [] : Object.create(Object.getPrototypeOf(target));
  h$4(snap, true);
  snapCache.set(target, [version, snap]);
  Reflect.ownKeys(target).forEach((key) => {
    if (Object.getOwnPropertyDescriptor(snap, key)) {
      return;
    }
    const value = Reflect.get(target, key);
    const { enumerable } = Reflect.getOwnPropertyDescriptor(
      target,
      key
    );
    const desc = {
      value,
      enumerable,
      // This is intentional to avoid copying with proxy-compare.
      // It's still non-writable, so it avoids assigning a value.
      configurable: true
    };
    if (refSet.has(value)) {
      h$4(value, false);
    } else if (value instanceof Promise) {
      delete desc.value;
      desc.get = () => handlePromise(value);
    } else if (proxyStateMap.has(value)) {
      const [target2, ensureVersion] = proxyStateMap.get(
        value
      );
      desc.value = createSnapshot(
        target2,
        ensureVersion(),
        handlePromise
      );
    }
    Object.defineProperty(snap, key, desc);
  });
  return Object.preventExtensions(snap);
}, proxyCache = /* @__PURE__ */ new WeakMap(), versionHolder = [1, 1], proxyFunction = (initialObject) => {
  if (!isObject(initialObject)) {
    throw new Error("object required");
  }
  const found = proxyCache.get(initialObject);
  if (found) {
    return found;
  }
  let version = versionHolder[0];
  const listeners = /* @__PURE__ */ new Set();
  const notifyUpdate = (op, nextVersion = ++versionHolder[0]) => {
    if (version !== nextVersion) {
      version = nextVersion;
      listeners.forEach((listener) => listener(op, nextVersion));
    }
  };
  let checkVersion = versionHolder[1];
  const ensureVersion = (nextCheckVersion = ++versionHolder[1]) => {
    if (checkVersion !== nextCheckVersion && !listeners.size) {
      checkVersion = nextCheckVersion;
      propProxyStates.forEach(([propProxyState]) => {
        const propVersion = propProxyState[1](nextCheckVersion);
        if (propVersion > version) {
          version = propVersion;
        }
      });
    }
    return version;
  };
  const createPropListener = (prop) => (op, nextVersion) => {
    const newOp = [...op];
    newOp[1] = [prop, ...newOp[1]];
    notifyUpdate(newOp, nextVersion);
  };
  const propProxyStates = /* @__PURE__ */ new Map();
  const addPropListener = (prop, propProxyState) => {
    if ((import.meta.env ? import.meta.env.MODE : void 0) !== "production" && propProxyStates.has(prop)) {
      throw new Error("prop listener already exists");
    }
    if (listeners.size) {
      const remove = propProxyState[3](createPropListener(prop));
      propProxyStates.set(prop, [propProxyState, remove]);
    } else {
      propProxyStates.set(prop, [propProxyState]);
    }
  };
  const removePropListener = (prop) => {
    var _a;
    const entry = propProxyStates.get(prop);
    if (entry) {
      propProxyStates.delete(prop);
      (_a = entry[1]) == null ? void 0 : _a.call(entry);
    }
  };
  const addListener = (listener) => {
    listeners.add(listener);
    if (listeners.size === 1) {
      propProxyStates.forEach(([propProxyState, prevRemove], prop) => {
        if ((import.meta.env ? import.meta.env.MODE : void 0) !== "production" && prevRemove) {
          throw new Error("remove already exists");
        }
        const remove = propProxyState[3](createPropListener(prop));
        propProxyStates.set(prop, [propProxyState, remove]);
      });
    }
    const removeListener = () => {
      listeners.delete(listener);
      if (listeners.size === 0) {
        propProxyStates.forEach(([propProxyState, remove], prop) => {
          if (remove) {
            remove();
            propProxyStates.set(prop, [propProxyState]);
          }
        });
      }
    };
    return removeListener;
  };
  const baseObject = Array.isArray(initialObject) ? [] : Object.create(Object.getPrototypeOf(initialObject));
  const handler = {
    deleteProperty(target, prop) {
      const prevValue = Reflect.get(target, prop);
      removePropListener(prop);
      const deleted = Reflect.deleteProperty(target, prop);
      if (deleted) {
        notifyUpdate(["delete", [prop], prevValue]);
      }
      return deleted;
    },
    set(target, prop, value, receiver) {
      const hasPrevValue = Reflect.has(target, prop);
      const prevValue = Reflect.get(target, prop, receiver);
      if (hasPrevValue && (objectIs(prevValue, value) || proxyCache.has(value) && objectIs(prevValue, proxyCache.get(value)))) {
        return true;
      }
      removePropListener(prop);
      if (isObject(value)) {
        value = y$5(value) || value;
      }
      let nextValue = value;
      if (value instanceof Promise) {
        value.then((v) => {
          value.status = "fulfilled";
          value.value = v;
          notifyUpdate(["resolve", [prop], v]);
        }).catch((e) => {
          value.status = "rejected";
          value.reason = e;
          notifyUpdate(["reject", [prop], e]);
        });
      } else {
        if (!proxyStateMap.has(value) && canProxy(value)) {
          nextValue = proxyFunction(value);
        }
        const childProxyState = !refSet.has(nextValue) && proxyStateMap.get(nextValue);
        if (childProxyState) {
          addPropListener(prop, childProxyState);
        }
      }
      Reflect.set(target, prop, nextValue, receiver);
      notifyUpdate(["set", [prop], value, prevValue]);
      return true;
    }
  };
  const proxyObject = newProxy(baseObject, handler);
  proxyCache.set(initialObject, proxyObject);
  const proxyState = [
    baseObject,
    ensureVersion,
    createSnapshot,
    addListener
  ];
  proxyStateMap.set(proxyObject, proxyState);
  Reflect.ownKeys(initialObject).forEach((key) => {
    const desc = Object.getOwnPropertyDescriptor(
      initialObject,
      key
    );
    if ("value" in desc) {
      proxyObject[key] = initialObject[key];
      delete desc.value;
      delete desc.writable;
    }
    Object.defineProperty(baseObject, key, desc);
  });
  return proxyObject;
}) => [
  // public functions
  proxyFunction,
  // shared state
  proxyStateMap,
  refSet,
  // internal things
  objectIs,
  newProxy,
  canProxy,
  defaultHandlePromise,
  snapCache,
  createSnapshot,
  proxyCache,
  versionHolder
];
const [defaultProxyFunction] = buildProxyFunction();
function proxy(initialObject = {}) {
  return defaultProxyFunction(initialObject);
}
function subscribe(proxyObject, callback, notifyInSync) {
  const proxyState = proxyStateMap.get(proxyObject);
  if ((import.meta.env ? import.meta.env.MODE : void 0) !== "production" && !proxyState) {
    console.warn("Please use proxy object");
  }
  let promise;
  const ops = [];
  const addListener = proxyState[3];
  let isListenerActive = false;
  const listener = (op) => {
    ops.push(op);
    if (!promise) {
      promise = Promise.resolve().then(() => {
        promise = void 0;
        if (isListenerActive) {
          callback(ops.splice(0));
        }
      });
    }
  };
  const removeListener = addListener(listener);
  isListenerActive = true;
  return () => {
    isListenerActive = false;
    removeListener();
  };
}
function snapshot(proxyObject, handlePromise) {
  const proxyState = proxyStateMap.get(proxyObject);
  if ((import.meta.env ? import.meta.env.MODE : void 0) !== "production" && !proxyState) {
    console.warn("Please use proxy object");
  }
  const [target, ensureVersion, createSnapshot] = proxyState;
  return createSnapshot(target, ensureVersion(), handlePromise);
}
function ref(obj) {
  refSet.add(obj);
  return obj;
}

function subscribeKey(proxyObject, key, callback, notifyInSync) {
  let prevValue = proxyObject[key];
  return subscribe(
    proxyObject,
    () => {
      const nextValue = proxyObject[key];
      if (!Object.is(prevValue, nextValue)) {
        callback(prevValue = nextValue);
      }
    });
}

function proxyMap(entries) {
  const map = proxy({
    data: Array.from([]),
    has(key) {
      return this.data.some((p) => p[0] === key);
    },
    set(key, value) {
      const record = this.data.find((p) => p[0] === key);
      if (record) {
        record[1] = value;
      } else {
        this.data.push([key, value]);
      }
      return this;
    },
    get(key) {
      var _a;
      return (_a = this.data.find((p) => p[0] === key)) == null ? void 0 : _a[1];
    },
    delete(key) {
      const index = this.data.findIndex((p) => p[0] === key);
      if (index === -1) {
        return false;
      }
      this.data.splice(index, 1);
      return true;
    },
    clear() {
      this.data.splice(0);
    },
    get size() {
      return this.data.length;
    },
    toJSON() {
      return new Map(this.data);
    },
    forEach(cb) {
      this.data.forEach((p) => {
        cb(p[1], p[0], this);
      });
    },
    keys() {
      return this.data.map((p) => p[0]).values();
    },
    values() {
      return this.data.map((p) => p[1]).values();
    },
    entries() {
      return new Map(this.data).entries();
    },
    get [Symbol.toStringTag]() {
      return "Map";
    },
    [Symbol.iterator]() {
      return this.entries();
    }
  });
  Object.defineProperties(map, {
    data: {
      enumerable: false
    },
    size: {
      enumerable: false
    },
    toJSON: {
      enumerable: false
    }
  });
  Object.seal(map);
  return map;
}

// eslint-disable-next-line @typescript-eslint/prefer-optional-chain
(typeof process !== 'undefined' && typeof process.env !== 'undefined'
    ? process.env['NEXT_PUBLIC_SECURE_SITE_ORIGIN']
    : undefined) || 'https://secure.walletconnect.org';
const ONRAMP_PROVIDERS = [
    {
        label: 'Coinbase',
        name: 'coinbase',
        feeRange: '1-2%',
        url: '',
        supportedChains: ['eip155']
    },
    {
        label: 'Meld.io',
        name: 'meld',
        feeRange: '1-2%',
        url: 'https://meldcrypto.com',
        supportedChains: ['eip155', 'solana']
    }
];
const MELD_PUBLIC_KEY = 'WXETMuFUQmqqybHuRkSgxv:25B8LJHSfpG6LVjR2ytU5Cwh7Z4Sch2ocoU';
const ConstantsUtil$2 = {
    FOUR_MINUTES_MS: 240_000,
    TEN_SEC_MS: 10_000,
    ONE_SEC_MS: 1_000,
    BALANCE_SUPPORTED_CHAINS: ['eip155', 'solana'],
    NAMES_SUPPORTED_CHAIN_NAMESPACES: ['eip155'],
    NATIVE_TOKEN_ADDRESS: {
        eip155: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        solana: 'So11111111111111111111111111111111111111111',
        polkadot: '0x',
        bip122: '0x',
        cosmos: '0x'
    },
    CONVERT_SLIPPAGE_TOLERANCE: 1,
    CONNECT_LABELS: {
        MOBILE: 'Open and continue in the wallet app'},
    SEND_SUPPORTED_NAMESPACES: ['eip155', 'solana'],
    DEFAULT_REMOTE_FEATURES: {
        swaps: ['1inch'],
        onramp: ['coinbase', 'meld'],
        email: true,
        socials: [
            'google',
            'x',
            'discord',
            'farcaster',
            'github',
            'apple',
            'facebook'
        ],
        activity: true,
        reownBranding: true
    },
    DEFAULT_REMOTE_FEATURES_DISABLED: {
        email: false,
        socials: false,
        swaps: false,
        onramp: false,
        activity: false,
        reownBranding: false
    },
    DEFAULT_FEATURES: {
        receive: true,
        send: true,
        emailShowWallets: true,
        connectorTypeOrder: [
            'walletConnect',
            'recent',
            'injected',
            'featured',
            'custom',
            'external',
            'recommended'
        ],
        analytics: true,
        allWallets: true,
        legalCheckbox: false,
        smartSessions: false,
        collapseWallets: false,
        walletFeaturesOrder: ['onramp', 'swaps', 'receive', 'send'],
        connectMethodsOrder: undefined,
        pay: false
    },
    DEFAULT_ACCOUNT_TYPES: {
        bip122: 'payment',
        eip155: 'smartAccount',
        polkadot: 'eoa',
        solana: 'eoa'
    },
    ADAPTER_TYPES: {
        UNIVERSAL: 'universal'}
};

/* eslint-disable no-console */
// -- Utility -----------------------------------------------------------------
const StorageUtil = {
    // Cache expiry in milliseconds
    cacheExpiry: {
        portfolio: 30000,
        nativeBalance: 30000,
        ens: 300000,
        identity: 300000
    },
    isCacheExpired(timestamp, cacheExpiry) {
        return Date.now() - timestamp > cacheExpiry;
    },
    getActiveNetworkProps() {
        const namespace = StorageUtil.getActiveNamespace();
        const caipNetworkId = StorageUtil.getActiveCaipNetworkId();
        const stringChainId = caipNetworkId ? caipNetworkId.split(':')[1] : undefined;
        // eslint-disable-next-line no-nested-ternary
        const chainId = stringChainId
            ? isNaN(Number(stringChainId))
                ? stringChainId
                : Number(stringChainId)
            : undefined;
        return {
            namespace,
            caipNetworkId,
            chainId
        };
    },
    setWalletConnectDeepLink({ name, href }) {
        try {
            SafeLocalStorage.setItem(SafeLocalStorageKeys.DEEPLINK_CHOICE, JSON.stringify({ href, name }));
        }
        catch {
            console.info('Unable to set WalletConnect deep link');
        }
    },
    getWalletConnectDeepLink() {
        try {
            const deepLink = SafeLocalStorage.getItem(SafeLocalStorageKeys.DEEPLINK_CHOICE);
            if (deepLink) {
                return JSON.parse(deepLink);
            }
        }
        catch {
            console.info('Unable to get WalletConnect deep link');
        }
        return undefined;
    },
    deleteWalletConnectDeepLink() {
        try {
            SafeLocalStorage.removeItem(SafeLocalStorageKeys.DEEPLINK_CHOICE);
        }
        catch {
            console.info('Unable to delete WalletConnect deep link');
        }
    },
    setActiveNamespace(namespace) {
        try {
            SafeLocalStorage.setItem(SafeLocalStorageKeys.ACTIVE_NAMESPACE, namespace);
        }
        catch {
            console.info('Unable to set active namespace');
        }
    },
    setActiveCaipNetworkId(caipNetworkId) {
        try {
            SafeLocalStorage.setItem(SafeLocalStorageKeys.ACTIVE_CAIP_NETWORK_ID, caipNetworkId);
            StorageUtil.setActiveNamespace(caipNetworkId.split(':')[0]);
        }
        catch {
            console.info('Unable to set active caip network id');
        }
    },
    getActiveCaipNetworkId() {
        try {
            return SafeLocalStorage.getItem(SafeLocalStorageKeys.ACTIVE_CAIP_NETWORK_ID);
        }
        catch {
            console.info('Unable to get active caip network id');
            return undefined;
        }
    },
    deleteActiveCaipNetworkId() {
        try {
            SafeLocalStorage.removeItem(SafeLocalStorageKeys.ACTIVE_CAIP_NETWORK_ID);
        }
        catch {
            console.info('Unable to delete active caip network id');
        }
    },
    deleteConnectedConnectorId(namespace) {
        try {
            const key = getSafeConnectorIdKey(namespace);
            SafeLocalStorage.removeItem(key);
        }
        catch {
            console.info('Unable to delete connected connector id');
        }
    },
    setAppKitRecent(wallet) {
        try {
            const recentWallets = StorageUtil.getRecentWallets();
            const exists = recentWallets.find(w => w.id === wallet.id);
            if (!exists) {
                recentWallets.unshift(wallet);
                if (recentWallets.length > 2) {
                    recentWallets.pop();
                }
                SafeLocalStorage.setItem(SafeLocalStorageKeys.RECENT_WALLETS, JSON.stringify(recentWallets));
            }
        }
        catch {
            console.info('Unable to set AppKit recent');
        }
    },
    getRecentWallets() {
        try {
            const recent = SafeLocalStorage.getItem(SafeLocalStorageKeys.RECENT_WALLETS);
            return recent ? JSON.parse(recent) : [];
        }
        catch {
            console.info('Unable to get AppKit recent');
        }
        return [];
    },
    setConnectedConnectorId(namespace, connectorId) {
        try {
            const key = getSafeConnectorIdKey(namespace);
            SafeLocalStorage.setItem(key, connectorId);
        }
        catch {
            console.info('Unable to set Connected Connector Id');
        }
    },
    getActiveNamespace() {
        try {
            const activeNamespace = SafeLocalStorage.getItem(SafeLocalStorageKeys.ACTIVE_NAMESPACE);
            return activeNamespace;
        }
        catch {
            console.info('Unable to get active namespace');
        }
        return undefined;
    },
    getConnectedConnectorId(namespace) {
        if (!namespace) {
            return undefined;
        }
        try {
            const key = getSafeConnectorIdKey(namespace);
            return SafeLocalStorage.getItem(key);
        }
        catch (e) {
            console.info('Unable to get connected connector id in namespace ', namespace);
        }
        return undefined;
    },
    setConnectedSocialProvider(socialProvider) {
        try {
            SafeLocalStorage.setItem(SafeLocalStorageKeys.CONNECTED_SOCIAL, socialProvider);
        }
        catch {
            console.info('Unable to set connected social provider');
        }
    },
    getConnectedSocialProvider() {
        try {
            return SafeLocalStorage.getItem(SafeLocalStorageKeys.CONNECTED_SOCIAL);
        }
        catch {
            console.info('Unable to get connected social provider');
        }
        return undefined;
    },
    deleteConnectedSocialProvider() {
        try {
            SafeLocalStorage.removeItem(SafeLocalStorageKeys.CONNECTED_SOCIAL);
        }
        catch {
            console.info('Unable to delete connected social provider');
        }
    },
    getConnectedSocialUsername() {
        try {
            return SafeLocalStorage.getItem(SafeLocalStorageKeys.CONNECTED_SOCIAL_USERNAME);
        }
        catch {
            console.info('Unable to get connected social username');
        }
        return undefined;
    },
    getStoredActiveCaipNetworkId() {
        const storedCaipNetworkId = SafeLocalStorage.getItem(SafeLocalStorageKeys.ACTIVE_CAIP_NETWORK_ID);
        const networkId = storedCaipNetworkId?.split(':')?.[1];
        return networkId;
    },
    setConnectionStatus(status) {
        try {
            SafeLocalStorage.setItem(SafeLocalStorageKeys.CONNECTION_STATUS, status);
        }
        catch {
            console.info('Unable to set connection status');
        }
    },
    getConnectionStatus() {
        try {
            return SafeLocalStorage.getItem(SafeLocalStorageKeys.CONNECTION_STATUS);
        }
        catch {
            return undefined;
        }
    },
    getConnectedNamespaces() {
        try {
            const namespaces = SafeLocalStorage.getItem(SafeLocalStorageKeys.CONNECTED_NAMESPACES);
            if (!namespaces?.length) {
                return [];
            }
            return namespaces.split(',');
        }
        catch {
            return [];
        }
    },
    setConnectedNamespaces(namespaces) {
        try {
            const uniqueNamespaces = Array.from(new Set(namespaces));
            SafeLocalStorage.setItem(SafeLocalStorageKeys.CONNECTED_NAMESPACES, uniqueNamespaces.join(','));
        }
        catch {
            console.info('Unable to set namespaces in storage');
        }
    },
    addConnectedNamespace(namespace) {
        try {
            const namespaces = StorageUtil.getConnectedNamespaces();
            if (!namespaces.includes(namespace)) {
                namespaces.push(namespace);
                StorageUtil.setConnectedNamespaces(namespaces);
            }
        }
        catch {
            console.info('Unable to add connected namespace');
        }
    },
    removeConnectedNamespace(namespace) {
        try {
            const namespaces = StorageUtil.getConnectedNamespaces();
            const index = namespaces.indexOf(namespace);
            if (index > -1) {
                namespaces.splice(index, 1);
                StorageUtil.setConnectedNamespaces(namespaces);
            }
        }
        catch {
            console.info('Unable to remove connected namespace');
        }
    },
    getTelegramSocialProvider() {
        try {
            return SafeLocalStorage.getItem(SafeLocalStorageKeys.TELEGRAM_SOCIAL_PROVIDER);
        }
        catch {
            console.info('Unable to get telegram social provider');
            return null;
        }
    },
    setTelegramSocialProvider(socialProvider) {
        try {
            SafeLocalStorage.setItem(SafeLocalStorageKeys.TELEGRAM_SOCIAL_PROVIDER, socialProvider);
        }
        catch {
            console.info('Unable to set telegram social provider');
        }
    },
    removeTelegramSocialProvider() {
        try {
            SafeLocalStorage.removeItem(SafeLocalStorageKeys.TELEGRAM_SOCIAL_PROVIDER);
        }
        catch {
            console.info('Unable to remove telegram social provider');
        }
    },
    getBalanceCache() {
        let cache = {};
        try {
            const result = SafeLocalStorage.getItem(SafeLocalStorageKeys.PORTFOLIO_CACHE);
            cache = result ? JSON.parse(result) : {};
        }
        catch {
            console.info('Unable to get balance cache');
        }
        return cache;
    },
    removeAddressFromBalanceCache(caipAddress) {
        try {
            const cache = StorageUtil.getBalanceCache();
            SafeLocalStorage.setItem(SafeLocalStorageKeys.PORTFOLIO_CACHE, JSON.stringify({ ...cache, [caipAddress]: undefined }));
        }
        catch {
            console.info('Unable to remove address from balance cache', caipAddress);
        }
    },
    getBalanceCacheForCaipAddress(caipAddress) {
        try {
            const cache = StorageUtil.getBalanceCache();
            const balanceCache = cache[caipAddress];
            // We want to discard cache if it's older than the cache expiry
            if (balanceCache &&
                !this.isCacheExpired(balanceCache.timestamp, this.cacheExpiry.portfolio)) {
                return balanceCache.balance;
            }
            StorageUtil.removeAddressFromBalanceCache(caipAddress);
        }
        catch {
            console.info('Unable to get balance cache for address', caipAddress);
        }
        return undefined;
    },
    updateBalanceCache(params) {
        try {
            const cache = StorageUtil.getBalanceCache();
            cache[params.caipAddress] = params;
            SafeLocalStorage.setItem(SafeLocalStorageKeys.PORTFOLIO_CACHE, JSON.stringify(cache));
        }
        catch {
            console.info('Unable to update balance cache', params);
        }
    },
    getNativeBalanceCache() {
        let cache = {};
        try {
            const result = SafeLocalStorage.getItem(SafeLocalStorageKeys.NATIVE_BALANCE_CACHE);
            cache = result ? JSON.parse(result) : {};
        }
        catch {
            console.info('Unable to get balance cache');
        }
        return cache;
    },
    removeAddressFromNativeBalanceCache(caipAddress) {
        try {
            const cache = StorageUtil.getBalanceCache();
            SafeLocalStorage.setItem(SafeLocalStorageKeys.NATIVE_BALANCE_CACHE, JSON.stringify({ ...cache, [caipAddress]: undefined }));
        }
        catch {
            console.info('Unable to remove address from balance cache', caipAddress);
        }
    },
    getNativeBalanceCacheForCaipAddress(caipAddress) {
        try {
            const cache = StorageUtil.getNativeBalanceCache();
            const nativeBalanceCache = cache[caipAddress];
            // We want to discard cache if it's older than the cache expiry
            if (nativeBalanceCache &&
                !this.isCacheExpired(nativeBalanceCache.timestamp, this.cacheExpiry.nativeBalance)) {
                return nativeBalanceCache;
            }
            console.info('Discarding cache for address', caipAddress);
            StorageUtil.removeAddressFromBalanceCache(caipAddress);
        }
        catch {
            console.info('Unable to get balance cache for address', caipAddress);
        }
        return undefined;
    },
    updateNativeBalanceCache(params) {
        try {
            const cache = StorageUtil.getNativeBalanceCache();
            cache[params.caipAddress] = params;
            SafeLocalStorage.setItem(SafeLocalStorageKeys.NATIVE_BALANCE_CACHE, JSON.stringify(cache));
        }
        catch {
            console.info('Unable to update balance cache', params);
        }
    },
    getEnsCache() {
        let cache = {};
        try {
            const result = SafeLocalStorage.getItem(SafeLocalStorageKeys.ENS_CACHE);
            cache = result ? JSON.parse(result) : {};
        }
        catch {
            console.info('Unable to get ens name cache');
        }
        return cache;
    },
    getEnsFromCacheForAddress(address) {
        try {
            const cache = StorageUtil.getEnsCache();
            const ensCache = cache[address];
            // We want to discard cache if it's older than the cache expiry
            if (ensCache && !this.isCacheExpired(ensCache.timestamp, this.cacheExpiry.ens)) {
                return ensCache.ens;
            }
            StorageUtil.removeEnsFromCache(address);
        }
        catch {
            console.info('Unable to get ens name from cache', address);
        }
        return undefined;
    },
    updateEnsCache(params) {
        try {
            const cache = StorageUtil.getEnsCache();
            cache[params.address] = params;
            SafeLocalStorage.setItem(SafeLocalStorageKeys.ENS_CACHE, JSON.stringify(cache));
        }
        catch {
            console.info('Unable to update ens name cache', params);
        }
    },
    removeEnsFromCache(address) {
        try {
            const cache = StorageUtil.getEnsCache();
            SafeLocalStorage.setItem(SafeLocalStorageKeys.ENS_CACHE, JSON.stringify({ ...cache, [address]: undefined }));
        }
        catch {
            console.info('Unable to remove ens name from cache', address);
        }
    },
    getIdentityCache() {
        let cache = {};
        try {
            const result = SafeLocalStorage.getItem(SafeLocalStorageKeys.IDENTITY_CACHE);
            cache = result ? JSON.parse(result) : {};
        }
        catch {
            console.info('Unable to get identity cache');
        }
        return cache;
    },
    getIdentityFromCacheForAddress(address) {
        try {
            const cache = StorageUtil.getIdentityCache();
            const identityCache = cache[address];
            // We want to discard cache if it's older than the cache expiry
            if (identityCache &&
                !this.isCacheExpired(identityCache.timestamp, this.cacheExpiry.identity)) {
                return identityCache.identity;
            }
            StorageUtil.removeIdentityFromCache(address);
        }
        catch {
            console.info('Unable to get identity from cache', address);
        }
        return undefined;
    },
    updateIdentityCache(params) {
        try {
            const cache = StorageUtil.getIdentityCache();
            cache[params.address] = {
                identity: params.identity,
                timestamp: params.timestamp
            };
            SafeLocalStorage.setItem(SafeLocalStorageKeys.IDENTITY_CACHE, JSON.stringify(cache));
        }
        catch {
            console.info('Unable to update identity cache', params);
        }
    },
    removeIdentityFromCache(address) {
        try {
            const cache = StorageUtil.getIdentityCache();
            SafeLocalStorage.setItem(SafeLocalStorageKeys.IDENTITY_CACHE, JSON.stringify({ ...cache, [address]: undefined }));
        }
        catch {
            console.info('Unable to remove identity from cache', address);
        }
    },
    clearAddressCache() {
        try {
            SafeLocalStorage.removeItem(SafeLocalStorageKeys.PORTFOLIO_CACHE);
            SafeLocalStorage.removeItem(SafeLocalStorageKeys.NATIVE_BALANCE_CACHE);
            SafeLocalStorage.removeItem(SafeLocalStorageKeys.ENS_CACHE);
            SafeLocalStorage.removeItem(SafeLocalStorageKeys.IDENTITY_CACHE);
        }
        catch {
            console.info('Unable to clear address cache');
        }
    },
    setPreferredAccountTypes(accountTypes) {
        try {
            SafeLocalStorage.setItem(SafeLocalStorageKeys.PREFERRED_ACCOUNT_TYPES, JSON.stringify(accountTypes));
        }
        catch {
            console.info('Unable to set preferred account types', accountTypes);
        }
    },
    getPreferredAccountTypes() {
        try {
            const result = SafeLocalStorage.getItem(SafeLocalStorageKeys.PREFERRED_ACCOUNT_TYPES);
            if (!result) {
                return {};
            }
            return JSON.parse(result);
        }
        catch {
            console.info('Unable to get preferred account types');
        }
        return {};
    },
    setConnections(connections, chainNamespace) {
        try {
            const newConnections = {
                ...StorageUtil.getConnections(),
                [chainNamespace]: connections
            };
            SafeLocalStorage.setItem(SafeLocalStorageKeys.CONNECTIONS, JSON.stringify(newConnections));
        }
        catch (error) {
            console.error('Unable to sync connections to storage', error);
        }
    },
    getConnections() {
        try {
            const connectionsStorage = SafeLocalStorage.getItem(SafeLocalStorageKeys.CONNECTIONS);
            if (!connectionsStorage) {
                return {};
            }
            return JSON.parse(connectionsStorage);
        }
        catch (error) {
            console.error('Unable to get connections from storage', error);
            return {};
        }
    }
};

const CoreHelperUtil = {
    isMobile() {
        if (this.isClient()) {
            return Boolean((typeof window?.matchMedia === 'function' &&
                window?.matchMedia('(pointer:coarse)')?.matches) ||
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent));
        }
        return false;
    },
    checkCaipNetwork(network, networkName = '') {
        return network?.caipNetworkId.toLocaleLowerCase().includes(networkName.toLowerCase());
    },
    isAndroid() {
        if (!this.isMobile()) {
            return false;
        }
        const ua = window?.navigator.userAgent.toLowerCase();
        return CoreHelperUtil.isMobile() && ua.includes('android');
    },
    isIos() {
        if (!this.isMobile()) {
            return false;
        }
        const ua = window?.navigator.userAgent.toLowerCase();
        return ua.includes('iphone') || ua.includes('ipad');
    },
    isSafari() {
        if (!this.isClient()) {
            return false;
        }
        const ua = window?.navigator.userAgent.toLowerCase();
        return ua.includes('safari');
    },
    isClient() {
        return typeof window !== 'undefined';
    },
    isPairingExpired(expiry) {
        return expiry ? expiry - Date.now() <= ConstantsUtil$2.TEN_SEC_MS : true;
    },
    isAllowedRetry(lastRetry, differenceMs = ConstantsUtil$2.ONE_SEC_MS) {
        return Date.now() - lastRetry >= differenceMs;
    },
    copyToClopboard(text) {
        navigator.clipboard.writeText(text);
    },
    isIframe() {
        try {
            return window?.self !== window?.top;
        }
        catch (e) {
            return false;
        }
    },
    isSafeApp() {
        if (CoreHelperUtil.isClient() && window.self !== window.top) {
            try {
                const ancestor = window?.location?.ancestorOrigins?.[0];
                const safeAppUrl = 'https://app.safe.global';
                if (ancestor) {
                    const ancestorUrl = new URL(ancestor);
                    const safeUrl = new URL(safeAppUrl);
                    return ancestorUrl.hostname === safeUrl.hostname;
                }
            }
            catch {
                return false;
            }
        }
        return false;
    },
    getPairingExpiry() {
        return Date.now() + ConstantsUtil$2.FOUR_MINUTES_MS;
    },
    getNetworkId(caipAddress) {
        return caipAddress?.split(':')[1];
    },
    getPlainAddress(caipAddress) {
        return caipAddress?.split(':')[2];
    },
    async wait(milliseconds) {
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debounce(func, timeout = 500) {
        let timer = undefined;
        return (...args) => {
            function next() {
                func(...args);
            }
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(next, timeout);
        };
    },
    isHttpUrl(url) {
        return url.startsWith('http://') || url.startsWith('https://');
    },
    formatNativeUrl(appUrl, wcUri, universalLink = null) {
        if (CoreHelperUtil.isHttpUrl(appUrl)) {
            return this.formatUniversalUrl(appUrl, wcUri);
        }
        let safeAppUrl = appUrl;
        let safeUniversalLink = universalLink;
        if (!safeAppUrl.includes('://')) {
            safeAppUrl = appUrl.replaceAll('/', '').replaceAll(':', '');
            safeAppUrl = `${safeAppUrl}://`;
        }
        if (!safeAppUrl.endsWith('/')) {
            safeAppUrl = `${safeAppUrl}/`;
        }
        if (safeUniversalLink && !safeUniversalLink?.endsWith('/')) {
            safeUniversalLink = `${safeUniversalLink}/`;
        }
        // Android deeplinks in tg context require the uri to be encoded twice
        if (this.isTelegram() && this.isAndroid()) {
            // eslint-disable-next-line no-param-reassign
            wcUri = encodeURIComponent(wcUri);
        }
        const encodedWcUrl = encodeURIComponent(wcUri);
        return {
            redirect: `${safeAppUrl}wc?uri=${encodedWcUrl}`,
            redirectUniversalLink: safeUniversalLink
                ? `${safeUniversalLink}wc?uri=${encodedWcUrl}`
                : undefined,
            href: safeAppUrl
        };
    },
    formatUniversalUrl(appUrl, wcUri) {
        if (!CoreHelperUtil.isHttpUrl(appUrl)) {
            return this.formatNativeUrl(appUrl, wcUri);
        }
        let safeAppUrl = appUrl;
        if (!safeAppUrl.endsWith('/')) {
            safeAppUrl = `${safeAppUrl}/`;
        }
        const encodedWcUrl = encodeURIComponent(wcUri);
        return {
            redirect: `${safeAppUrl}wc?uri=${encodedWcUrl}`,
            href: safeAppUrl
        };
    },
    getOpenTargetForPlatform(target) {
        if (target === 'popupWindow') {
            return target;
        }
        // Only '_blank' deeplinks work in Telegram context
        if (this.isTelegram()) {
            // But for social login, we need to load the page in the same context
            if (StorageUtil.getTelegramSocialProvider()) {
                return '_top';
            }
            return '_blank';
        }
        return target;
    },
    openHref(href, target, features) {
        window?.open(href, this.getOpenTargetForPlatform(target), features || 'noreferrer noopener');
    },
    returnOpenHref(href, target, features) {
        return window?.open(href, this.getOpenTargetForPlatform(target), features || 'noreferrer noopener');
    },
    isTelegram() {
        return (typeof window !== 'undefined' &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (Boolean(window.TelegramWebviewProxy) ||
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                Boolean(window.Telegram) ||
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                Boolean(window.TelegramWebviewProxyProto)));
    },
    isPWA() {
        if (typeof window === 'undefined') {
            return false;
        }
        const isStandaloneDisplayMode = window.matchMedia?.('(display-mode: standalone)')?.matches;
        const isIOSStandalone = window?.navigator?.standalone;
        return Boolean(isStandaloneDisplayMode || isIOSStandalone);
    },
    async preloadImage(src) {
        const imagePromise = new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = resolve;
            image.onerror = reject;
            image.crossOrigin = 'anonymous';
            image.src = src;
        });
        return Promise.race([imagePromise, CoreHelperUtil.wait(2000)]);
    },
    formatBalance(balance, symbol) {
        let formattedBalance = '0.000';
        if (typeof balance === 'string') {
            const number = Number(balance);
            if (number) {
                const formattedValue = Math.floor(number * 1000) / 1000;
                if (formattedValue) {
                    formattedBalance = formattedValue.toString();
                }
            }
        }
        return `${formattedBalance}${symbol ? ` ${symbol}` : ''}`;
    },
    formatBalance2(balance, symbol) {
        let formattedBalance = undefined;
        if (balance === '0') {
            formattedBalance = '0';
        }
        else if (typeof balance === 'string') {
            const number = Number(balance);
            if (number) {
                formattedBalance = number.toString().match(/^-?\d+(?:\.\d{0,3})?/u)?.[0];
            }
        }
        return {
            value: formattedBalance ?? '0',
            rest: formattedBalance === '0' ? '000' : '',
            symbol
        };
    },
    getApiUrl() {
        return ConstantsUtil$3.W3M_API_URL;
    },
    getBlockchainApiUrl() {
        return ConstantsUtil$3.BLOCKCHAIN_API_RPC_URL;
    },
    getAnalyticsUrl() {
        return ConstantsUtil$3.PULSE_API_URL;
    },
    getUUID() {
        if (crypto?.randomUUID) {
            return crypto.randomUUID();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/gu, c => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parseError(error) {
        if (typeof error === 'string') {
            return error;
        }
        else if (typeof error?.issues?.[0]?.message === 'string') {
            return error.issues[0].message;
        }
        else if (error instanceof Error) {
            return error.message;
        }
        return 'Unknown error';
    },
    sortRequestedNetworks(approvedIds, requestedNetworks = []) {
        const approvedIndexMap = {};
        if (requestedNetworks && approvedIds) {
            approvedIds.forEach((id, index) => {
                approvedIndexMap[id] = index;
            });
            requestedNetworks.sort((a, b) => {
                const indexA = approvedIndexMap[a.id];
                const indexB = approvedIndexMap[b.id];
                if (indexA !== undefined && indexB !== undefined) {
                    return indexA - indexB;
                }
                else if (indexA !== undefined) {
                    return -1;
                }
                else if (indexB !== undefined) {
                    return 1;
                }
                return 0;
            });
        }
        return requestedNetworks;
    },
    calculateBalance(array) {
        let sum = 0;
        for (const item of array) {
            sum += item.value ?? 0;
        }
        return sum;
    },
    formatTokenBalance(number) {
        const roundedNumber = number.toFixed(2);
        const [dollars, pennies] = roundedNumber.split('.');
        return { dollars, pennies };
    },
    isAddress(address, chain = 'eip155') {
        switch (chain) {
            case 'eip155':
                if (!/^(?:0x)?[0-9a-f]{40}$/iu.test(address)) {
                    return false;
                }
                else if (/^(?:0x)?[0-9a-f]{40}$/iu.test(address) ||
                    /^(?:0x)?[0-9A-F]{40}$/iu.test(address)) {
                    return true;
                }
                return false;
            case 'solana':
                return /[1-9A-HJ-NP-Za-km-z]{32,44}$/iu.test(address);
            default:
                return false;
        }
    },
    uniqueBy(arr, key) {
        const set = new Set();
        return arr.filter(item => {
            const keyValue = item[key];
            if (set.has(keyValue)) {
                return false;
            }
            set.add(keyValue);
            return true;
        });
    },
    generateSdkVersion(adapters, platform, version) {
        const hasNoAdapters = adapters.length === 0;
        const adapterNames = (hasNoAdapters
            ? ConstantsUtil$2.ADAPTER_TYPES.UNIVERSAL
            : adapters.map(adapter => adapter.adapterType).join(','));
        return `${platform}-${adapterNames}-${version}`;
    },
    // eslint-disable-next-line max-params
    createAccount(namespace, address, type, publicKey, path) {
        return {
            namespace,
            address,
            type,
            publicKey,
            path
        };
    },
    isCaipAddress(address) {
        if (typeof address !== 'string') {
            return false;
        }
        const sections = address.split(':');
        const namespace = sections[0];
        return (sections.filter(Boolean).length === 3 &&
            namespace in ConstantsUtil$3.CHAIN_NAME_MAP);
    },
    isMac() {
        const ua = window?.navigator.userAgent.toLowerCase();
        return ua.includes('macintosh') && !ua.includes('safari');
    },
    formatTelegramSocialLoginUrl(url) {
        const valueToInject = `--${encodeURIComponent(window?.location.href)}`;
        const paramToInject = 'state=';
        const parsedUrl = new URL(url);
        if (parsedUrl.host === 'auth.magic.link') {
            const providerParam = 'provider_authorization_url=';
            const providerUrl = url.substring(url.indexOf(providerParam) + providerParam.length);
            const resultUrl = this.injectIntoUrl(decodeURIComponent(providerUrl), paramToInject, valueToInject);
            return url.replace(providerUrl, encodeURIComponent(resultUrl));
        }
        return this.injectIntoUrl(url, paramToInject, valueToInject);
    },
    injectIntoUrl(url, key, appendString) {
        // Find the position of "key" e.g. "state=" in the URL
        const keyIndex = url.indexOf(key);
        if (keyIndex === -1) {
            throw new Error(`${key} parameter not found in the URL: ${url}`);
        }
        // Find the position of the next "&" after "key"
        const keyEndIndex = url.indexOf('&', keyIndex);
        const keyLength = key.length;
        // If there is no "&" after key, it means "key" is the last parameter
        // eslint-disable-next-line no-negated-condition
        const keyParamEnd = keyEndIndex !== -1 ? keyEndIndex : url.length;
        // Extract the part of the URL before the key value
        const beforeKeyValue = url.substring(0, keyIndex + keyLength);
        // Extract the current key value
        const currentKeyValue = url.substring(keyIndex + keyLength, keyParamEnd);
        // Extract the part of the URL after the key value
        const afterKeyValue = url.substring(keyEndIndex);
        // Append the new string to the key value
        const newKeyValue = currentKeyValue + appendString;
        // Reconstruct the URL with the appended key value
        const newUrl = beforeKeyValue + newKeyValue + afterKeyValue;
        return newUrl;
    }
};

async function fetchData(...args) {
    const response = await fetch(...args);
    if (!response.ok) {
        // Create error object and reject if not a 2xx response code
        const err = new Error(`HTTP status code: ${response.status}`, {
            cause: response
        });
        throw err;
    }
    return response;
}
// -- Utility --------------------------------------------------------------------
class FetchUtil {
    constructor({ baseUrl, clientId }) {
        this.baseUrl = baseUrl;
        this.clientId = clientId;
    }
    async get({ headers, signal, cache, ...args }) {
        const url = this.createUrl(args);
        const response = await fetchData(url, { method: 'GET', headers, signal, cache });
        return response.json();
    }
    async getBlob({ headers, signal, ...args }) {
        const url = this.createUrl(args);
        const response = await fetchData(url, { method: 'GET', headers, signal });
        return response.blob();
    }
    async post({ body, headers, signal, ...args }) {
        const url = this.createUrl(args);
        const response = await fetchData(url, {
            method: 'POST',
            headers,
            body: body ? JSON.stringify(body) : undefined,
            signal
        });
        return response.json();
    }
    async put({ body, headers, signal, ...args }) {
        const url = this.createUrl(args);
        const response = await fetchData(url, {
            method: 'PUT',
            headers,
            body: body ? JSON.stringify(body) : undefined,
            signal
        });
        return response.json();
    }
    async delete({ body, headers, signal, ...args }) {
        const url = this.createUrl(args);
        const response = await fetchData(url, {
            method: 'DELETE',
            headers,
            body: body ? JSON.stringify(body) : undefined,
            signal
        });
        return response.json();
    }
    createUrl({ path, params }) {
        const url = new URL(path, this.baseUrl);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value) {
                    url.searchParams.append(key, value);
                }
            });
        }
        if (this.clientId) {
            url.searchParams.append('clientId', this.clientId);
        }
        return url;
    }
}

const OptionsUtil = {
    getFeatureValue(key, features) {
        const optionValue = features?.[key];
        if (optionValue === undefined) {
            return ConstantsUtil$2.DEFAULT_FEATURES[key];
        }
        return optionValue;
    },
    filterSocialsByPlatform(socials) {
        if (!socials || !socials.length) {
            return socials;
        }
        if (CoreHelperUtil.isTelegram()) {
            if (CoreHelperUtil.isIos()) {
                return socials.filter(s => s !== 'google');
            }
            if (CoreHelperUtil.isMac()) {
                return socials.filter(s => s !== 'x');
            }
            if (CoreHelperUtil.isAndroid()) {
                return socials.filter(s => !['facebook', 'x'].includes(s));
            }
        }
        return socials;
    }
};

// -- State --------------------------------------------- //
const state$l = proxy({
    features: ConstantsUtil$2.DEFAULT_FEATURES,
    projectId: '',
    sdkType: 'appkit',
    sdkVersion: 'html-wagmi-undefined',
    defaultAccountTypes: ConstantsUtil$2.DEFAULT_ACCOUNT_TYPES,
    enableNetworkSwitch: true,
    experimental_preferUniversalLinks: false,
    remoteFeatures: {}
});
// -- Controller ---------------------------------------- //
const OptionsController = {
    state: state$l,
    subscribeKey(key, callback) {
        return subscribeKey(state$l, key, callback);
    },
    setOptions(options) {
        Object.assign(state$l, options);
    },
    setRemoteFeatures(remoteFeatures) {
        if (!remoteFeatures) {
            return;
        }
        const newRemoteFeatures = { ...state$l.remoteFeatures, ...remoteFeatures };
        state$l.remoteFeatures = newRemoteFeatures;
        if (state$l.remoteFeatures?.socials) {
            state$l.remoteFeatures.socials = OptionsUtil.filterSocialsByPlatform(state$l.remoteFeatures.socials);
        }
    },
    setFeatures(features) {
        if (!features) {
            return;
        }
        if (!state$l.features) {
            state$l.features = ConstantsUtil$2.DEFAULT_FEATURES;
        }
        const newFeatures = { ...state$l.features, ...features };
        state$l.features = newFeatures;
    },
    setProjectId(projectId) {
        state$l.projectId = projectId;
    },
    setCustomRpcUrls(customRpcUrls) {
        state$l.customRpcUrls = customRpcUrls;
    },
    setAllWallets(allWallets) {
        state$l.allWallets = allWallets;
    },
    setIncludeWalletIds(includeWalletIds) {
        state$l.includeWalletIds = includeWalletIds;
    },
    setExcludeWalletIds(excludeWalletIds) {
        state$l.excludeWalletIds = excludeWalletIds;
    },
    setFeaturedWalletIds(featuredWalletIds) {
        state$l.featuredWalletIds = featuredWalletIds;
    },
    setTokens(tokens) {
        state$l.tokens = tokens;
    },
    setTermsConditionsUrl(termsConditionsUrl) {
        state$l.termsConditionsUrl = termsConditionsUrl;
    },
    setPrivacyPolicyUrl(privacyPolicyUrl) {
        state$l.privacyPolicyUrl = privacyPolicyUrl;
    },
    setCustomWallets(customWallets) {
        state$l.customWallets = customWallets;
    },
    setIsSiweEnabled(isSiweEnabled) {
        state$l.isSiweEnabled = isSiweEnabled;
    },
    setIsUniversalProvider(isUniversalProvider) {
        state$l.isUniversalProvider = isUniversalProvider;
    },
    setSdkVersion(sdkVersion) {
        state$l.sdkVersion = sdkVersion;
    },
    setMetadata(metadata) {
        state$l.metadata = metadata;
    },
    setDisableAppend(disableAppend) {
        state$l.disableAppend = disableAppend;
    },
    setEIP6963Enabled(enableEIP6963) {
        state$l.enableEIP6963 = enableEIP6963;
    },
    setDebug(debug) {
        state$l.debug = debug;
    },
    setEnableWalletConnect(enableWalletConnect) {
        state$l.enableWalletConnect = enableWalletConnect;
    },
    setEnableWalletGuide(enableWalletGuide) {
        state$l.enableWalletGuide = enableWalletGuide;
    },
    setEnableAuthLogger(enableAuthLogger) {
        state$l.enableAuthLogger = enableAuthLogger;
    },
    setEnableWallets(enableWallets) {
        state$l.enableWallets = enableWallets;
    },
    setPreferUniversalLinks(preferUniversalLinks) {
        state$l.experimental_preferUniversalLinks = preferUniversalLinks;
    },
    setHasMultipleAddresses(hasMultipleAddresses) {
        state$l.hasMultipleAddresses = hasMultipleAddresses;
    },
    setSIWX(siwx) {
        state$l.siwx = siwx;
    },
    setConnectMethodsOrder(connectMethodsOrder) {
        state$l.features = {
            ...state$l.features,
            connectMethodsOrder
        };
    },
    setWalletFeaturesOrder(walletFeaturesOrder) {
        state$l.features = {
            ...state$l.features,
            walletFeaturesOrder
        };
    },
    setSocialsOrder(socialsOrder) {
        state$l.remoteFeatures = {
            ...state$l.remoteFeatures,
            socials: socialsOrder
        };
    },
    setCollapseWallets(collapseWallets) {
        state$l.features = {
            ...state$l.features,
            collapseWallets
        };
    },
    setEnableEmbedded(enableEmbedded) {
        state$l.enableEmbedded = enableEmbedded;
    },
    setAllowUnsupportedChain(allowUnsupportedChain) {
        state$l.allowUnsupportedChain = allowUnsupportedChain;
    },
    setManualWCControl(manualWCControl) {
        state$l.manualWCControl = manualWCControl;
    },
    setEnableNetworkSwitch(enableNetworkSwitch) {
        state$l.enableNetworkSwitch = enableNetworkSwitch;
    },
    setDefaultAccountTypes(defaultAccountType = {}) {
        Object.entries(defaultAccountType).forEach(([namespace, accountType]) => {
            if (accountType) {
                // @ts-expect-error - Keys are validated by the param type
                state$l.defaultAccountTypes[namespace] = accountType;
            }
        });
    },
    setUniversalProviderConfigOverride(universalProviderConfigOverride) {
        state$l.universalProviderConfigOverride = universalProviderConfigOverride;
    },
    getUniversalProviderConfigOverride() {
        return state$l.universalProviderConfigOverride;
    },
    getSnapshot() {
        return snapshot(state$l);
    }
};

// -- Constants ----------------------------------------- //
const DEFAULT_STATE$1 = Object.freeze({
    enabled: true,
    events: []
});
const api$2 = new FetchUtil({ baseUrl: CoreHelperUtil.getAnalyticsUrl(), clientId: null });
// Rate limiting constants
const MAX_ERRORS_PER_MINUTE = 5;
const ONE_MINUTE_MS = 60 * 1000;
// -- State --------------------------------------------- //
const state$k = proxy({
    ...DEFAULT_STATE$1
});
// -- Controller ---------------------------------------- //
const TelemetryController = {
    state: state$k,
    subscribeKey(key, callback) {
        return subscribeKey(state$k, key, callback);
    },
    async sendError(error, category) {
        if (!state$k.enabled) {
            return;
        }
        // Check rate limiting using events array
        const now = Date.now();
        const recentErrors = state$k.events.filter(event => {
            const eventTime = new Date(event.properties.timestamp || '').getTime();
            return now - eventTime < ONE_MINUTE_MS;
        });
        if (recentErrors.length >= MAX_ERRORS_PER_MINUTE) {
            // Exit silently
            return;
        }
        const errorEvent = {
            type: 'error',
            event: category,
            properties: {
                errorType: error.name,
                errorMessage: error.message,
                stackTrace: error.stack,
                timestamp: new Date().toISOString()
            }
        };
        state$k.events.push(errorEvent);
        try {
            if (typeof window === 'undefined') {
                return;
            }
            const { projectId, sdkType, sdkVersion } = OptionsController.state;
            await api$2.post({
                path: '/e',
                params: {
                    projectId,
                    st: sdkType,
                    sv: sdkVersion || 'html-wagmi-4.2.2'
                },
                body: {
                    eventId: CoreHelperUtil.getUUID(),
                    url: window.location.href,
                    domain: window.location.hostname,
                    timestamp: new Date().toISOString(),
                    props: {
                        type: 'error',
                        event: category,
                        errorType: error.name,
                        errorMessage: error.message,
                        stackTrace: error.stack
                    }
                }
            });
        }
        catch {
            // Do nothing
        }
    },
    enable() {
        state$k.enabled = true;
    },
    disable() {
        state$k.enabled = false;
    },
    clearEvents() {
        state$k.events = [];
    }
};

class AppKitError extends Error {
    constructor(message, category, originalError) {
        super(message);
        this.name = 'AppKitError';
        this.category = category;
        this.originalError = originalError;
        // Ensure `this instanceof AppKitError` is true, important for custom errors.
        Object.setPrototypeOf(this, AppKitError.prototype);
        let isStackConstructedFromOriginal = false;
        if (originalError instanceof Error &&
            typeof originalError.stack === 'string' &&
            originalError.stack) {
            const originalErrorStack = originalError.stack;
            /**
             * Most error stacks start with "ErrorName: ErrorMessage\n...frames..."
             * We want to take the "...frames..." part.
             */
            const firstNewlineIndex = originalErrorStack.indexOf('\n');
            if (firstNewlineIndex > -1) {
                const originalFrames = originalErrorStack.substring(firstNewlineIndex + 1);
                this.stack = `${this.name}: ${this.message}\n${originalFrames}`;
                isStackConstructedFromOriginal = true;
            }
        }
        if (!isStackConstructedFromOriginal) {
            /**
             * If stack was not (or could not be) constructed from originalError,
             * generate a standard stack trace for this AppKitError instance.
             * This will point to where `new AppKitError()` was called.
             */
            if (Error.captureStackTrace) {
                Error.captureStackTrace(this, AppKitError);
            }
            else if (!this.stack) {
                /**
                 * Fallback for environments without Error.captureStackTrace.
                 * `super(message)` might have set a stack.
                 * If `this.stack` is still undefined/empty, provide a minimal one.
                 * Node.js and modern browsers typically set `this.stack` from `super(message)`.
                 */
                this.stack = `${this.name}: ${this.message}`;
            }
        }
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function errorHandler(err, defaultCategory) {
    const error = err instanceof AppKitError
        ? err
        : new AppKitError(err instanceof Error ? err.message : String(err), defaultCategory, err);
    TelemetryController.sendError(error, error.category);
    throw error;
}
function withErrorBoundary(controller, defaultCategory = 'INTERNAL_SDK_ERROR') {
    const newController = {};
    Object.keys(controller).forEach(key => {
        const original = controller[key];
        if (typeof original === 'function') {
            let wrapped = original;
            if (original.constructor.name === 'AsyncFunction') {
                wrapped = async (...args) => {
                    try {
                        return await original(...args);
                    }
                    catch (err) {
                        return errorHandler(err, defaultCategory);
                    }
                };
            }
            else {
                wrapped = (...args) => {
                    try {
                        return original(...args);
                    }
                    catch (err) {
                        return errorHandler(err, defaultCategory);
                    }
                };
            }
            newController[key] = wrapped;
        }
        else {
            newController[key] = original;
        }
    });
    return newController;
}

/*
 * Exclude wallets that do not support relay connections but have custom deeplink mechanisms
 * Excludes:
 * - Phantom
 * - Coinbase
 */
const CUSTOM_DEEPLINK_WALLETS = {
    PHANTOM: {
        id: 'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393',
        url: 'https://phantom.app'
    },
    SOLFLARE: {
        id: '1ca0bdd4747578705b1939af023d120677c64fe6ca76add81fda36e350605e79',
        url: 'https://solflare.com'
    },
    COINBASE: {
        id: 'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
        url: 'https://go.cb-w.com'
    }
};
const MobileWalletUtil = {
    /**
     * Handles mobile wallet redirection for wallets that have Universal Links and doesn't support WalletConnect Deep Links.
     *
     * @param {string} id - The id of the wallet.
     * @param {ChainNamespace} namespace - The namespace of the chain.
     */
    handleMobileDeeplinkRedirect(id, namespace) {
        /**
         * Universal Links requires explicit user interaction to open the wallet app.
         * Previously we've been calling this with the life-cycle methods in the Solana clients by listening the SELECT_WALLET event of EventController.
         * But this breaks the UL functionality for some wallets like Phantom.
         */
        const href = window.location.href;
        const encodedHref = encodeURIComponent(href);
        if (id === CUSTOM_DEEPLINK_WALLETS.PHANTOM.id && !('phantom' in window)) {
            const protocol = href.startsWith('https') ? 'https' : 'http';
            const host = href.split('/')[2];
            const encodedRef = encodeURIComponent(`${protocol}://${host}`);
            window.location.href = `${CUSTOM_DEEPLINK_WALLETS.PHANTOM.url}/ul/browse/${encodedHref}?ref=${encodedRef}`;
        }
        if (id === CUSTOM_DEEPLINK_WALLETS.SOLFLARE.id && !('solflare' in window)) {
            window.location.href = `${CUSTOM_DEEPLINK_WALLETS.SOLFLARE.url}/ul/v1/browse/${encodedHref}?ref=${encodedHref}`;
        }
        if (namespace === ConstantsUtil$3.CHAIN.SOLANA) {
            if (id === CUSTOM_DEEPLINK_WALLETS.COINBASE.id && !('coinbaseSolana' in window)) {
                window.location.href = `${CUSTOM_DEEPLINK_WALLETS.COINBASE.url}/dapp?cb_url=${encodedHref}`;
            }
        }
    }
};

// -- State --------------------------------------------- //
const state$j = proxy({
    walletImages: {},
    networkImages: {},
    chainImages: {},
    connectorImages: {},
    tokenImages: {},
    currencyImages: {}
});
// -- Controller ---------------------------------------- //
const controller$d = {
    state: state$j,
    subscribeNetworkImages(callback) {
        return subscribe(state$j.networkImages, () => callback(state$j.networkImages));
    },
    subscribeKey(key, callback) {
        return subscribeKey(state$j, key, callback);
    },
    subscribe(callback) {
        return subscribe(state$j, () => callback(state$j));
    },
    setWalletImage(key, value) {
        state$j.walletImages[key] = value;
    },
    setNetworkImage(key, value) {
        state$j.networkImages[key] = value;
    },
    setChainImage(key, value) {
        state$j.chainImages[key] = value;
    },
    setConnectorImage(key, value) {
        state$j.connectorImages = { ...state$j.connectorImages, [key]: value };
    },
    setTokenImage(key, value) {
        state$j.tokenImages[key] = value;
    },
    setCurrencyImage(key, value) {
        state$j.currencyImages[key] = value;
    }
};
// Export the controller wrapped with our error boundary
const AssetController = withErrorBoundary(controller$d);

const namespaceImageIds = {
    // Ethereum
    eip155: 'ba0ba0cd-17c6-4806-ad93-f9d174f17900',
    // Solana
    solana: 'a1b58899-f671-4276-6a5e-56ca5bd59700',
    // Polkadot
    polkadot: '',
    // Bitcoin
    bip122: '0b4838db-0161-4ffe-022d-532bf03dba00',
    // Cosmos
    cosmos: ''
};
// -- State --------------------------------------------- //
const state$i = proxy({
    networkImagePromises: {}
});
// -- Util ---------------------------------------- //
const AssetUtil = {
    async fetchWalletImage(imageId) {
        if (!imageId) {
            return undefined;
        }
        await ApiController._fetchWalletImage(imageId);
        return this.getWalletImageById(imageId);
    },
    async fetchNetworkImage(imageId) {
        if (!imageId) {
            return undefined;
        }
        const existingImage = this.getNetworkImageById(imageId);
        // Check if the image already exists
        if (existingImage) {
            return existingImage;
        }
        // Check if the promise is already created
        if (!state$i.networkImagePromises[imageId]) {
            state$i.networkImagePromises[imageId] = ApiController._fetchNetworkImage(imageId);
        }
        await state$i.networkImagePromises[imageId];
        return this.getNetworkImageById(imageId);
    },
    getWalletImageById(imageId) {
        if (!imageId) {
            return undefined;
        }
        return AssetController.state.walletImages[imageId];
    },
    getWalletImage(wallet) {
        if (wallet?.image_url) {
            return wallet?.image_url;
        }
        if (wallet?.image_id) {
            return AssetController.state.walletImages[wallet.image_id];
        }
        return undefined;
    },
    getNetworkImage(network) {
        if (network?.assets?.imageUrl) {
            return network?.assets?.imageUrl;
        }
        if (network?.assets?.imageId) {
            return AssetController.state.networkImages[network.assets.imageId];
        }
        return undefined;
    },
    getNetworkImageById(imageId) {
        if (!imageId) {
            return undefined;
        }
        return AssetController.state.networkImages[imageId];
    },
    getConnectorImage(connector) {
        if (connector?.imageUrl) {
            return connector.imageUrl;
        }
        if (connector?.imageId) {
            return AssetController.state.connectorImages[connector.imageId];
        }
        return undefined;
    },
    getChainImage(chain) {
        return AssetController.state.networkImages[namespaceImageIds[chain]];
    }
};

// -- State --------------------------------------------- //
const state$h = proxy({
    message: '',
    variant: 'info',
    open: false
});
// -- Controller ---------------------------------------- //
const controller$c = {
    state: state$h,
    subscribeKey(key, callback) {
        return subscribeKey(state$h, key, callback);
    },
    open(message, variant) {
        const { debug } = OptionsController.state;
        const { shortMessage, longMessage } = message;
        if (debug) {
            state$h.message = shortMessage;
            state$h.variant = variant;
            state$h.open = true;
        }
        if (longMessage) {
            // eslint-disable-next-line no-console
            console.error(typeof longMessage === 'function' ? longMessage() : longMessage);
        }
    },
    close() {
        state$h.open = false;
        state$h.message = '';
        state$h.variant = 'info';
    }
};
// Export the controller wrapped with our error boundary
const AlertController = withErrorBoundary(controller$c);

// -- Helpers ------------------------------------------- //
const baseUrl$2 = CoreHelperUtil.getAnalyticsUrl();
const api$1 = new FetchUtil({ baseUrl: baseUrl$2, clientId: null });
const excluded = ['MODAL_CREATED'];
// -- State --------------------------------------------- //
const state$g = proxy({
    timestamp: Date.now(),
    reportedErrors: {},
    data: {
        type: 'track',
        event: 'MODAL_CREATED'
    }
});
// -- Controller ---------------------------------------- //
const EventsController = {
    state: state$g,
    subscribe(callback) {
        return subscribe(state$g, () => callback(state$g));
    },
    getSdkProperties() {
        const { projectId, sdkType, sdkVersion } = OptionsController.state;
        return {
            projectId,
            st: sdkType,
            sv: sdkVersion || 'html-wagmi-4.2.2'
        };
    },
    async _sendAnalyticsEvent(payload) {
        try {
            const address = AccountController.state.address;
            if (excluded.includes(payload.data.event) || typeof window === 'undefined') {
                return;
            }
            await api$1.post({
                path: '/e',
                params: EventsController.getSdkProperties(),
                body: {
                    eventId: CoreHelperUtil.getUUID(),
                    url: window.location.href,
                    domain: window.location.hostname,
                    timestamp: payload.timestamp,
                    props: { ...payload.data, address }
                }
            });
            state$g.reportedErrors['FORBIDDEN'] = false;
        }
        catch (err) {
            const isForbiddenError = err instanceof Error &&
                err.cause instanceof Response &&
                err.cause.status === ConstantsUtil$3.HTTP_STATUS_CODES.FORBIDDEN &&
                !state$g.reportedErrors['FORBIDDEN'];
            if (isForbiddenError) {
                AlertController.open({
                    shortMessage: 'Invalid App Configuration',
                    longMessage: `Origin ${isSafe$1() ? window.origin : 'uknown'} not found on Allowlist - update configuration on cloud.reown.com`
                }, 'error');
                state$g.reportedErrors['FORBIDDEN'] = true;
            }
        }
    },
    sendEvent(data) {
        state$g.timestamp = Date.now();
        state$g.data = data;
        if (OptionsController.state.features?.analytics) {
            EventsController._sendAnalyticsEvent(state$g);
        }
    }
};

// -- Helpers ------------------------------------------- //
const baseUrl$1 = CoreHelperUtil.getApiUrl();
const api = new FetchUtil({
    baseUrl: baseUrl$1,
    clientId: null
});
const entries = 40;
const recommendedEntries = 4;
const imageCountToFetch = 20;
// -- State --------------------------------------------- //
const state$f = proxy({
    promises: {},
    page: 1,
    count: 0,
    featured: [],
    allFeatured: [],
    recommended: [],
    allRecommended: [],
    wallets: [],
    filteredWallets: [],
    search: [],
    isAnalyticsEnabled: false,
    excludedWallets: [],
    isFetchingRecommendedWallets: false
});
// -- Controller ---------------------------------------- //
const ApiController = {
    state: state$f,
    subscribeKey(key, callback) {
        return subscribeKey(state$f, key, callback);
    },
    _getSdkProperties() {
        const { projectId, sdkType, sdkVersion } = OptionsController.state;
        return {
            projectId,
            st: sdkType || 'appkit',
            sv: sdkVersion || 'html-wagmi-4.2.2'
        };
    },
    _filterOutExtensions(wallets) {
        if (OptionsController.state.isUniversalProvider) {
            return wallets.filter(w => Boolean(w.mobile_link || w.desktop_link || w.webapp_link));
        }
        return wallets;
    },
    async _fetchWalletImage(imageId) {
        const imageUrl = `${api.baseUrl}/getWalletImage/${imageId}`;
        const blob = await api.getBlob({ path: imageUrl, params: ApiController._getSdkProperties() });
        AssetController.setWalletImage(imageId, URL.createObjectURL(blob));
    },
    async _fetchNetworkImage(imageId) {
        const imageUrl = `${api.baseUrl}/public/getAssetImage/${imageId}`;
        const blob = await api.getBlob({ path: imageUrl, params: ApiController._getSdkProperties() });
        AssetController.setNetworkImage(imageId, URL.createObjectURL(blob));
    },
    async _fetchConnectorImage(imageId) {
        const imageUrl = `${api.baseUrl}/public/getAssetImage/${imageId}`;
        const blob = await api.getBlob({ path: imageUrl, params: ApiController._getSdkProperties() });
        AssetController.setConnectorImage(imageId, URL.createObjectURL(blob));
    },
    async _fetchCurrencyImage(countryCode) {
        const imageUrl = `${api.baseUrl}/public/getCurrencyImage/${countryCode}`;
        const blob = await api.getBlob({ path: imageUrl, params: ApiController._getSdkProperties() });
        AssetController.setCurrencyImage(countryCode, URL.createObjectURL(blob));
    },
    async _fetchTokenImage(symbol) {
        const imageUrl = `${api.baseUrl}/public/getTokenImage/${symbol}`;
        const blob = await api.getBlob({ path: imageUrl, params: ApiController._getSdkProperties() });
        AssetController.setTokenImage(symbol, URL.createObjectURL(blob));
    },
    _filterWalletsByPlatform(wallets) {
        const filteredWallets = CoreHelperUtil.isMobile()
            ? wallets?.filter(w => {
                if (w.mobile_link) {
                    return true;
                }
                if (w.id === CUSTOM_DEEPLINK_WALLETS.COINBASE.id) {
                    return true;
                }
                const isSolana = ChainController.state.activeChain === 'solana';
                return (isSolana &&
                    (w.id === CUSTOM_DEEPLINK_WALLETS.SOLFLARE.id ||
                        w.id === CUSTOM_DEEPLINK_WALLETS.PHANTOM.id));
            })
            : wallets;
        return filteredWallets;
    },
    async fetchProjectConfig() {
        const response = await api.get({
            path: '/appkit/v1/config',
            params: ApiController._getSdkProperties()
        });
        return response.features;
    },
    async fetchAllowedOrigins() {
        try {
            const { allowedOrigins } = await api.get({
                path: '/projects/v1/origins',
                params: ApiController._getSdkProperties()
            });
            return allowedOrigins;
        }
        catch (error) {
            return [];
        }
    },
    async fetchNetworkImages() {
        const requestedCaipNetworks = ChainController.getAllRequestedCaipNetworks();
        const ids = requestedCaipNetworks
            ?.map(({ assets }) => assets?.imageId)
            .filter(Boolean)
            .filter(imageId => !AssetUtil.getNetworkImageById(imageId));
        if (ids) {
            await Promise.allSettled(ids.map(id => ApiController._fetchNetworkImage(id)));
        }
    },
    async fetchConnectorImages() {
        const { connectors } = ConnectorController.state;
        const ids = connectors.map(({ imageId }) => imageId).filter(Boolean);
        await Promise.allSettled(ids.map(id => ApiController._fetchConnectorImage(id)));
    },
    async fetchCurrencyImages(currencies = []) {
        await Promise.allSettled(currencies.map(currency => ApiController._fetchCurrencyImage(currency)));
    },
    async fetchTokenImages(tokens = []) {
        await Promise.allSettled(tokens.map(token => ApiController._fetchTokenImage(token)));
    },
    async fetchWallets(params) {
        const exclude = params.exclude ?? [];
        const sdkProperties = ApiController._getSdkProperties();
        if (sdkProperties.sv.startsWith('html-core-')) {
            exclude.push(...Object.values(CUSTOM_DEEPLINK_WALLETS).map(w => w.id));
        }
        const wallets = await api.get({
            path: '/getWallets',
            params: {
                ...ApiController._getSdkProperties(),
                ...params,
                page: String(params.page),
                entries: String(params.entries),
                include: params.include?.join(','),
                exclude: exclude.join(',')
            }
        });
        const filteredWallets = ApiController._filterWalletsByPlatform(wallets?.data);
        return {
            data: filteredWallets || [],
            // Keep original count for display on main page
            count: wallets?.count
        };
    },
    async fetchFeaturedWallets() {
        const { featuredWalletIds } = OptionsController.state;
        if (featuredWalletIds?.length) {
            const params = {
                ...ApiController._getSdkProperties(),
                page: 1,
                entries: featuredWalletIds?.length ?? recommendedEntries,
                include: featuredWalletIds
            };
            const { data } = await ApiController.fetchWallets(params);
            const sortedData = [...data].sort((a, b) => featuredWalletIds.indexOf(a.id) - featuredWalletIds.indexOf(b.id));
            const images = sortedData.map(d => d.image_id).filter(Boolean);
            await Promise.allSettled(images.map(id => ApiController._fetchWalletImage(id)));
            state$f.featured = sortedData;
            state$f.allFeatured = sortedData;
        }
    },
    async fetchRecommendedWallets() {
        try {
            state$f.isFetchingRecommendedWallets = true;
            const { includeWalletIds, excludeWalletIds, featuredWalletIds } = OptionsController.state;
            const exclude = [...(excludeWalletIds ?? []), ...(featuredWalletIds ?? [])].filter(Boolean);
            const chains = ChainController.getRequestedCaipNetworkIds().join(',');
            const params = {
                page: 1,
                entries: recommendedEntries,
                include: includeWalletIds,
                exclude,
                chains
            };
            const { data, count } = await ApiController.fetchWallets(params);
            const recent = StorageUtil.getRecentWallets();
            const recommendedImages = data.map(d => d.image_id).filter(Boolean);
            const recentImages = recent.map(r => r.image_id).filter(Boolean);
            await Promise.allSettled([...recommendedImages, ...recentImages].map(id => ApiController._fetchWalletImage(id)));
            state$f.recommended = data;
            state$f.allRecommended = data;
            state$f.count = count ?? 0;
        }
        catch {
            // Catch silently
        }
        finally {
            state$f.isFetchingRecommendedWallets = false;
        }
    },
    async fetchWalletsByPage({ page }) {
        const { includeWalletIds, excludeWalletIds, featuredWalletIds } = OptionsController.state;
        const chains = ChainController.getRequestedCaipNetworkIds().join(',');
        const exclude = [
            ...state$f.recommended.map(({ id }) => id),
            ...(excludeWalletIds ?? []),
            ...(featuredWalletIds ?? [])
        ].filter(Boolean);
        const params = {
            page,
            entries,
            include: includeWalletIds,
            exclude,
            chains
        };
        const { data, count } = await ApiController.fetchWallets(params);
        const images = data
            .slice(0, imageCountToFetch)
            .map(w => w.image_id)
            .filter(Boolean);
        await Promise.allSettled(images.map(id => ApiController._fetchWalletImage(id)));
        state$f.wallets = CoreHelperUtil.uniqueBy([...state$f.wallets, ...ApiController._filterOutExtensions(data)], 'id').filter(w => w.chains?.some(chain => chains.includes(chain)));
        state$f.count = count > state$f.count ? count : state$f.count;
        state$f.page = page;
    },
    async initializeExcludedWallets({ ids }) {
        const params = {
            page: 1,
            entries: ids.length,
            include: ids
        };
        const { data } = await ApiController.fetchWallets(params);
        if (data) {
            data.forEach(wallet => {
                state$f.excludedWallets.push({ rdns: wallet.rdns, name: wallet.name });
            });
        }
    },
    async searchWallet({ search, badge }) {
        const { includeWalletIds, excludeWalletIds } = OptionsController.state;
        const chains = ChainController.getRequestedCaipNetworkIds().join(',');
        state$f.search = [];
        const params = {
            page: 1,
            entries: 100,
            search: search?.trim(),
            badge_type: badge,
            include: includeWalletIds,
            exclude: excludeWalletIds,
            chains
        };
        const { data } = await ApiController.fetchWallets(params);
        EventsController.sendEvent({
            type: 'track',
            event: 'SEARCH_WALLET',
            properties: { badge: badge ?? '', search: search ?? '' }
        });
        const images = data.map(w => w.image_id).filter(Boolean);
        await Promise.allSettled([
            ...images.map(id => ApiController._fetchWalletImage(id)),
            CoreHelperUtil.wait(300)
        ]);
        state$f.search = ApiController._filterOutExtensions(data);
    },
    initPromise(key, fetchFn) {
        const existingPromise = state$f.promises[key];
        if (existingPromise) {
            return existingPromise;
        }
        return (state$f.promises[key] = fetchFn());
    },
    prefetch({ fetchConnectorImages = true, fetchFeaturedWallets = true, fetchRecommendedWallets = true, fetchNetworkImages = true } = {}) {
        const promises = [
            fetchConnectorImages &&
                ApiController.initPromise('connectorImages', ApiController.fetchConnectorImages),
            fetchFeaturedWallets &&
                ApiController.initPromise('featuredWallets', ApiController.fetchFeaturedWallets),
            fetchRecommendedWallets &&
                ApiController.initPromise('recommendedWallets', ApiController.fetchRecommendedWallets),
            fetchNetworkImages &&
                ApiController.initPromise('networkImages', ApiController.fetchNetworkImages)
        ].filter(Boolean);
        return Promise.allSettled(promises);
    },
    prefetchAnalyticsConfig() {
        if (OptionsController.state.features?.analytics) {
            ApiController.fetchAnalyticsConfig();
        }
    },
    async fetchAnalyticsConfig() {
        try {
            const { isAnalyticsEnabled } = await api.get({
                path: '/getAnalyticsConfig',
                params: ApiController._getSdkProperties()
            });
            OptionsController.setFeatures({ analytics: isAnalyticsEnabled });
        }
        catch (error) {
            OptionsController.setFeatures({ analytics: false });
        }
    },
    filterByNamespaces(namespaces) {
        if (!namespaces?.length) {
            state$f.featured = state$f.allFeatured;
            state$f.recommended = state$f.allRecommended;
            return;
        }
        const caipNetworkIds = ChainController.getRequestedCaipNetworkIds().join(',');
        state$f.featured = state$f.allFeatured.filter(wallet => wallet.chains?.some(chain => caipNetworkIds.includes(chain)));
        state$f.recommended = state$f.allRecommended.filter(wallet => wallet.chains?.some(chain => caipNetworkIds.includes(chain)));
        state$f.filteredWallets = state$f.wallets.filter(wallet => wallet.chains?.some(chain => caipNetworkIds.includes(chain)));
    },
    clearFilterByNamespaces() {
        state$f.filteredWallets = [];
    },
    setFilterByNamespace(namespace) {
        if (!namespace) {
            state$f.featured = state$f.allFeatured;
            state$f.recommended = state$f.allRecommended;
            return;
        }
        const caipNetworkIds = ChainController.getRequestedCaipNetworkIds().join(',');
        state$f.featured = state$f.allFeatured.filter(wallet => wallet.chains?.some(chain => caipNetworkIds.includes(chain)));
        state$f.recommended = state$f.allRecommended.filter(wallet => wallet.chains?.some(chain => caipNetworkIds.includes(chain)));
        state$f.filteredWallets = state$f.wallets.filter(wallet => wallet.chains?.some(chain => caipNetworkIds.includes(chain)));
    }
};

// -- State --------------------------------------------- //
const state$e = proxy({
    view: 'Connect',
    history: ['Connect'],
    transactionStack: []
});
// -- Controller ---------------------------------------- //
const controller$b = {
    state: state$e,
    subscribeKey(key, callback) {
        return subscribeKey(state$e, key, callback);
    },
    pushTransactionStack(action) {
        state$e.transactionStack.push(action);
    },
    popTransactionStack(status) {
        const action = state$e.transactionStack.pop();
        if (!action) {
            return;
        }
        const { onSuccess, onError, onCancel } = action;
        switch (status) {
            case 'success':
                onSuccess?.();
                break;
            case 'error':
                onError?.();
                RouterController.goBack();
                break;
            case 'cancel':
                onCancel?.();
                RouterController.goBack();
                break;
        }
    },
    push(view, data) {
        if (view !== state$e.view) {
            state$e.view = view;
            state$e.history.push(view);
            state$e.data = data;
        }
    },
    reset(view, data) {
        state$e.view = view;
        state$e.history = [view];
        state$e.data = data;
    },
    replace(view, data) {
        const lastView = state$e.history.at(-1);
        const isSameView = lastView === view;
        if (!isSameView) {
            state$e.view = view;
            state$e.history[state$e.history.length - 1] = view;
            state$e.data = data;
        }
    },
    goBack() {
        const isConnected = ChainController.state.activeCaipAddress;
        const isFarcasterView = RouterController.state.view === 'ConnectingFarcaster';
        const shouldReload = !isConnected && isFarcasterView;
        if (state$e.history.length > 1) {
            state$e.history.pop();
            const [last] = state$e.history.slice(-1);
            if (last) {
                const isConnectView = last === 'Connect';
                if (isConnected && isConnectView) {
                    state$e.view = 'Account';
                }
                else {
                    state$e.view = last;
                }
            }
        }
        else {
            ModalController.close();
        }
        if (state$e.data?.wallet) {
            state$e.data.wallet = undefined;
        }
        // Reloading the iframe contentwindow and doing the view animation in the modal causes a small freeze in the transition. Doing these separately fixes that.
        setTimeout(() => {
            if (shouldReload) {
                AccountController.setFarcasterUrl(undefined, ChainController.state.activeChain);
                const authConnector = ConnectorController.getAuthConnector();
                authConnector?.provider?.reload();
                const optionsState = snapshot(OptionsController.state);
                authConnector?.provider?.syncDappData?.({
                    metadata: optionsState.metadata,
                    sdkVersion: optionsState.sdkVersion,
                    projectId: optionsState.projectId,
                    sdkType: optionsState.sdkType
                });
            }
        }, 100);
    },
    goBackToIndex(historyIndex) {
        if (state$e.history.length > 1) {
            state$e.history = state$e.history.slice(0, historyIndex + 1);
            const [last] = state$e.history.slice(-1);
            if (last) {
                state$e.view = last;
            }
        }
    },
    goBackOrCloseModal() {
        if (RouterController.state.history.length > 1) {
            RouterController.goBack();
        }
        else {
            ModalController.close();
        }
    }
};
// Export the controller wrapped with our error boundary
const RouterController = withErrorBoundary(controller$b);

// -- State --------------------------------------------- //
const state$d = proxy({
    themeMode: 'dark',
    themeVariables: {},
    w3mThemeVariables: undefined
});
// -- Controller ---------------------------------------- //
const controller$a = {
    state: state$d,
    subscribe(callback) {
        return subscribe(state$d, () => callback(state$d));
    },
    setThemeMode(themeMode) {
        state$d.themeMode = themeMode;
        try {
            const authConnector = ConnectorController.getAuthConnector();
            if (authConnector) {
                const themeVariables = controller$a.getSnapshot().themeVariables;
                authConnector.provider.syncTheme({
                    themeMode,
                    themeVariables,
                    w3mThemeVariables: getW3mThemeVariables(themeVariables, themeMode)
                });
            }
        }
        catch {
            // eslint-disable-next-line no-console
            console.info('Unable to sync theme to auth connector');
        }
    },
    setThemeVariables(themeVariables) {
        state$d.themeVariables = { ...state$d.themeVariables, ...themeVariables };
        try {
            const authConnector = ConnectorController.getAuthConnector();
            if (authConnector) {
                const themeVariablesSnapshot = controller$a.getSnapshot().themeVariables;
                authConnector.provider.syncTheme({
                    themeVariables: themeVariablesSnapshot,
                    w3mThemeVariables: getW3mThemeVariables(state$d.themeVariables, state$d.themeMode)
                });
            }
        }
        catch {
            // eslint-disable-next-line no-console
            console.info('Unable to sync theme to auth connector');
        }
    },
    getSnapshot() {
        return snapshot(state$d);
    }
};
// Export the controller wrapped with our error boundary
const ThemeController = withErrorBoundary(controller$a);

const defaultActiveConnectors = {
    eip155: undefined,
    solana: undefined,
    polkadot: undefined,
    bip122: undefined,
    cosmos: undefined
};
// -- State --------------------------------------------- //
const state$c = proxy({
    allConnectors: [],
    connectors: [],
    activeConnector: undefined,
    filterByNamespace: undefined,
    activeConnectorIds: { ...defaultActiveConnectors },
    filterByNamespaceMap: {
        eip155: true,
        solana: true,
        polkadot: true,
        bip122: true,
        cosmos: true
    }
});
// -- Controller ---------------------------------------- //
const controller$9 = {
    state: state$c,
    subscribe(callback) {
        return subscribe(state$c, () => {
            callback(state$c);
        });
    },
    subscribeKey(key, callback) {
        return subscribeKey(state$c, key, callback);
    },
    initialize(namespaces) {
        namespaces.forEach(namespace => {
            const connectorId = StorageUtil.getConnectedConnectorId(namespace);
            if (connectorId) {
                ConnectorController.setConnectorId(connectorId, namespace);
            }
        });
    },
    setActiveConnector(connector) {
        if (connector) {
            state$c.activeConnector = ref(connector);
        }
    },
    setConnectors(connectors) {
        const newConnectors = connectors.filter(newConnector => !state$c.allConnectors.some(existingConnector => existingConnector.id === newConnector.id &&
            ConnectorController.getConnectorName(existingConnector.name) ===
                ConnectorController.getConnectorName(newConnector.name) &&
            existingConnector.chain === newConnector.chain));
        /**
         * We are reassigning the state of the proxy to a new array of new objects, ConnectorController can cause issues. So it is better to use ref in ConnectorController case.
         * Check more about proxy on https://valtio.dev/docs/api/basic/proxy#Gotchas
         * Check more about ref on https://valtio.dev/docs/api/basic/ref
         */
        newConnectors.forEach(connector => {
            if (connector.type !== 'MULTI_CHAIN') {
                state$c.allConnectors.push(ref(connector));
            }
        });
        const enabledNamespaces = ConnectorController.getEnabledNamespaces();
        const connectorsFilteredByNamespaces = ConnectorController.getEnabledConnectors(enabledNamespaces);
        state$c.connectors = ConnectorController.mergeMultiChainConnectors(connectorsFilteredByNamespaces);
    },
    filterByNamespaces(enabledNamespaces) {
        Object.keys(state$c.filterByNamespaceMap).forEach(namespace => {
            state$c.filterByNamespaceMap[namespace] = false;
        });
        enabledNamespaces.forEach(namespace => {
            state$c.filterByNamespaceMap[namespace] = true;
        });
        ConnectorController.updateConnectorsForEnabledNamespaces();
    },
    filterByNamespace(namespace, enabled) {
        state$c.filterByNamespaceMap[namespace] = enabled;
        ConnectorController.updateConnectorsForEnabledNamespaces();
    },
    updateConnectorsForEnabledNamespaces() {
        const enabledNamespaces = ConnectorController.getEnabledNamespaces();
        const enabledConnectors = ConnectorController.getEnabledConnectors(enabledNamespaces);
        const areAllNamespacesEnabled = ConnectorController.areAllNamespacesEnabled();
        state$c.connectors = ConnectorController.mergeMultiChainConnectors(enabledConnectors);
        if (areAllNamespacesEnabled) {
            ApiController.clearFilterByNamespaces();
        }
        else {
            ApiController.filterByNamespaces(enabledNamespaces);
        }
    },
    getEnabledNamespaces() {
        return Object.entries(state$c.filterByNamespaceMap)
            .filter(([_, enabled]) => enabled)
            .map(([namespace]) => namespace);
    },
    getEnabledConnectors(enabledNamespaces) {
        return state$c.allConnectors.filter(connector => enabledNamespaces.includes(connector.chain));
    },
    areAllNamespacesEnabled() {
        return Object.values(state$c.filterByNamespaceMap).every(enabled => enabled);
    },
    mergeMultiChainConnectors(connectors) {
        const connectorsByNameMap = ConnectorController.generateConnectorMapByName(connectors);
        const mergedConnectors = [];
        connectorsByNameMap.forEach(keyConnectors => {
            const firstItem = keyConnectors[0];
            const isAuthConnector = firstItem?.id === ConstantsUtil$3.CONNECTOR_ID.AUTH;
            if (keyConnectors.length > 1 && firstItem) {
                mergedConnectors.push({
                    name: firstItem.name,
                    imageUrl: firstItem.imageUrl,
                    imageId: firstItem.imageId,
                    connectors: [...keyConnectors],
                    type: isAuthConnector ? 'AUTH' : 'MULTI_CHAIN',
                    // These values are just placeholders, we don't use them in multi-chain connector select screen
                    chain: 'eip155',
                    id: firstItem?.id || ''
                });
            }
            else if (firstItem) {
                mergedConnectors.push(firstItem);
            }
        });
        return mergedConnectors;
    },
    generateConnectorMapByName(connectors) {
        const connectorsByNameMap = new Map();
        connectors.forEach(connector => {
            const { name } = connector;
            const connectorName = ConnectorController.getConnectorName(name);
            if (!connectorName) {
                return;
            }
            const connectorsByName = connectorsByNameMap.get(connectorName) || [];
            const haveSameConnector = connectorsByName.find(c => c.chain === connector.chain);
            if (!haveSameConnector) {
                connectorsByName.push(connector);
            }
            connectorsByNameMap.set(connectorName, connectorsByName);
        });
        return connectorsByNameMap;
    },
    getConnectorName(name) {
        if (!name) {
            return name;
        }
        const nameOverrideMap = {
            'Trust Wallet': 'Trust'
        };
        return nameOverrideMap[name] || name;
    },
    getUniqueConnectorsByName(connectors) {
        const uniqueConnectors = [];
        connectors.forEach(c => {
            if (!uniqueConnectors.find(uc => uc.chain === c.chain)) {
                uniqueConnectors.push(c);
            }
        });
        return uniqueConnectors;
    },
    addConnector(connector) {
        if (connector.id === ConstantsUtil$3.CONNECTOR_ID.AUTH) {
            const authConnector = connector;
            const optionsState = snapshot(OptionsController.state);
            const themeMode = ThemeController.getSnapshot().themeMode;
            const themeVariables = ThemeController.getSnapshot().themeVariables;
            authConnector?.provider?.syncDappData?.({
                metadata: optionsState.metadata,
                sdkVersion: optionsState.sdkVersion,
                projectId: optionsState.projectId,
                sdkType: optionsState.sdkType
            });
            authConnector?.provider?.syncTheme({
                themeMode,
                themeVariables,
                w3mThemeVariables: getW3mThemeVariables(themeVariables, themeMode)
            });
            ConnectorController.setConnectors([connector]);
        }
        else {
            ConnectorController.setConnectors([connector]);
        }
    },
    getAuthConnector(chainNamespace) {
        const activeNamespace = chainNamespace || ChainController.state.activeChain;
        const authConnector = state$c.connectors.find(c => c.id === ConstantsUtil$3.CONNECTOR_ID.AUTH);
        if (!authConnector) {
            return undefined;
        }
        if (authConnector?.connectors?.length) {
            const connector = authConnector.connectors.find(c => c.chain === activeNamespace);
            return connector;
        }
        return authConnector;
    },
    getAnnouncedConnectorRdns() {
        return state$c.connectors.filter(c => c.type === 'ANNOUNCED').map(c => c.info?.rdns);
    },
    getConnectorById(id) {
        return state$c.allConnectors.find(c => c.id === id);
    },
    getConnector(id, rdns) {
        const connectorsByNamespace = state$c.allConnectors.filter(c => c.chain === ChainController.state.activeChain);
        return connectorsByNamespace.find(c => c.explorerId === id || c.info?.rdns === rdns);
    },
    syncIfAuthConnector(connector) {
        if (connector.id !== 'ID_AUTH') {
            return;
        }
        const authConnector = connector;
        const optionsState = snapshot(OptionsController.state);
        const themeMode = ThemeController.getSnapshot().themeMode;
        const themeVariables = ThemeController.getSnapshot().themeVariables;
        authConnector?.provider?.syncDappData?.({
            metadata: optionsState.metadata,
            sdkVersion: optionsState.sdkVersion,
            sdkType: optionsState.sdkType,
            projectId: optionsState.projectId
        });
        authConnector.provider.syncTheme({
            themeMode,
            themeVariables,
            w3mThemeVariables: getW3mThemeVariables(themeVariables, themeMode)
        });
    },
    /**
     * Returns the connectors filtered by namespace.
     * @param namespace - The namespace to filter the connectors by.
     * @returns ConnectorWithProviders[].
     */
    getConnectorsByNamespace(namespace) {
        const namespaceConnectors = state$c.allConnectors.filter(connector => connector.chain === namespace);
        return ConnectorController.mergeMultiChainConnectors(namespaceConnectors);
    },
    selectWalletConnector(wallet) {
        const connector = ConnectorController.getConnector(wallet.id, wallet.rdns);
        const namespace = ChainController.state.activeChain;
        MobileWalletUtil.handleMobileDeeplinkRedirect(connector?.explorerId || wallet.id, namespace);
        if (connector) {
            RouterController.push('ConnectingExternal', { connector });
        }
        else {
            RouterController.push('ConnectingWalletConnect', { wallet });
        }
    },
    /**
     * Returns the connectors. If a namespace is provided, the connectors are filtered by namespace.
     * @param namespace - The namespace to filter the connectors by. If not provided, all connectors are returned.
     * @returns ConnectorWithProviders[].
     */
    getConnectors(namespace) {
        if (namespace) {
            return ConnectorController.getConnectorsByNamespace(namespace);
        }
        return ConnectorController.mergeMultiChainConnectors(state$c.allConnectors);
    },
    /**
     * Sets the filter by namespace and updates the connectors.
     * @param namespace - The namespace to filter the connectors by.
     */
    setFilterByNamespace(namespace) {
        state$c.filterByNamespace = namespace;
        state$c.connectors = ConnectorController.getConnectors(namespace);
        ApiController.setFilterByNamespace(namespace);
    },
    setConnectorId(connectorId, namespace) {
        if (connectorId) {
            state$c.activeConnectorIds = {
                ...state$c.activeConnectorIds,
                [namespace]: connectorId
            };
            StorageUtil.setConnectedConnectorId(namespace, connectorId);
        }
    },
    removeConnectorId(namespace) {
        state$c.activeConnectorIds = {
            ...state$c.activeConnectorIds,
            [namespace]: undefined
        };
        StorageUtil.deleteConnectedConnectorId(namespace);
    },
    getConnectorId(namespace) {
        if (!namespace) {
            return undefined;
        }
        return state$c.activeConnectorIds[namespace];
    },
    isConnected(namespace) {
        if (!namespace) {
            return Object.values(state$c.activeConnectorIds).some(id => Boolean(id));
        }
        return Boolean(state$c.activeConnectorIds[namespace]);
    },
    resetConnectorIds() {
        state$c.activeConnectorIds = { ...defaultActiveConnectors };
    }
};
// Export the controller wrapped with our error boundary
const ConnectorController = withErrorBoundary(controller$9);

const DEFAULT_SDK_URL = 'https://secure.walletconnect.org/sdk';
(typeof process !== 'undefined' && typeof process.env !== 'undefined'
    ? process.env['NEXT_PUBLIC_SECURE_SITE_SDK_URL']
    : undefined) || DEFAULT_SDK_URL;
(typeof process !== 'undefined' && typeof process.env !== 'undefined'
    ? process.env['NEXT_PUBLIC_DEFAULT_LOG_LEVEL']
    : undefined) || 'error';
(typeof process !== 'undefined' && typeof process.env !== 'undefined'
    ? process.env['NEXT_PUBLIC_SECURE_SITE_SDK_VERSION']
    : undefined) || '4';
const W3mFrameRpcConstants = {
    ACCOUNT_TYPES: {
        SMART_ACCOUNT: 'smartAccount'
    }
};

// -- Constants ----------------------------------------- //
const DEFAULT_STATE = Object.freeze({
    message: '',
    variant: 'success',
    svg: undefined,
    open: false,
    autoClose: true
});
// -- State --------------------------------------------- //
const state$b = proxy({
    ...DEFAULT_STATE
});
// -- Controller ---------------------------------------- //
const controller$8 = {
    state: state$b,
    subscribeKey(key, callback) {
        return subscribeKey(state$b, key, callback);
    },
    showLoading(message, options = {}) {
        this._showMessage({ message, variant: 'loading', ...options });
    },
    showSuccess(message) {
        this._showMessage({ message, variant: 'success' });
    },
    showSvg(message, svg) {
        this._showMessage({ message, svg });
    },
    showError(message) {
        const errorMessage = CoreHelperUtil.parseError(message);
        this._showMessage({ message: errorMessage, variant: 'error' });
    },
    hide() {
        state$b.message = DEFAULT_STATE.message;
        state$b.variant = DEFAULT_STATE.variant;
        state$b.svg = DEFAULT_STATE.svg;
        state$b.open = DEFAULT_STATE.open;
        state$b.autoClose = DEFAULT_STATE.autoClose;
    },
    _showMessage({ message, svg, variant = 'success', autoClose = DEFAULT_STATE.autoClose }) {
        if (state$b.open) {
            state$b.open = false;
            setTimeout(() => {
                state$b.message = message;
                state$b.variant = variant;
                state$b.svg = svg;
                state$b.open = true;
                state$b.autoClose = autoClose;
            }, 150);
        }
        else {
            state$b.message = message;
            state$b.variant = variant;
            state$b.svg = svg;
            state$b.open = true;
            state$b.autoClose = autoClose;
        }
    }
};
const SnackController = controller$8;

// -- State --------------------------------------------- //
const state$a = proxy({
    transactions: [],
    coinbaseTransactions: {},
    transactionsByYear: {},
    lastNetworkInView: undefined,
    loading: false,
    empty: false,
    next: undefined
});
// -- Controller ---------------------------------------- //
const controller$7 = {
    state: state$a,
    subscribe(callback) {
        return subscribe(state$a, () => callback(state$a));
    },
    setLastNetworkInView(lastNetworkInView) {
        state$a.lastNetworkInView = lastNetworkInView;
    },
    async fetchTransactions(accountAddress, onramp) {
        if (!accountAddress) {
            throw new Error("Transactions can't be fetched without an accountAddress");
        }
        state$a.loading = true;
        try {
            const response = await BlockchainApiController.fetchTransactions({
                account: accountAddress,
                cursor: state$a.next,
                onramp,
                // Coinbase transaction history state updates require the latest data
                cache: onramp === 'coinbase' ? 'no-cache' : undefined,
                chainId: ChainController.state.activeCaipNetwork?.caipNetworkId
            });
            const nonSpamTransactions = TransactionsController.filterSpamTransactions(response.data);
            const sameChainTransactions = TransactionsController.filterByConnectedChain(nonSpamTransactions);
            const filteredTransactions = [...state$a.transactions, ...sameChainTransactions];
            state$a.loading = false;
            if (onramp === 'coinbase') {
                state$a.coinbaseTransactions = TransactionsController.groupTransactionsByYearAndMonth(state$a.coinbaseTransactions, response.data);
            }
            else {
                state$a.transactions = filteredTransactions;
                state$a.transactionsByYear = TransactionsController.groupTransactionsByYearAndMonth(state$a.transactionsByYear, sameChainTransactions);
            }
            state$a.empty = filteredTransactions.length === 0;
            state$a.next = response.next ? response.next : undefined;
        }
        catch (error) {
            const activeChainNamespace = ChainController.state.activeChain;
            EventsController.sendEvent({
                type: 'track',
                event: 'ERROR_FETCH_TRANSACTIONS',
                properties: {
                    address: accountAddress,
                    projectId: OptionsController.state.projectId,
                    cursor: state$a.next,
                    isSmartAccount: AccountController.state.preferredAccountTypes?.[activeChainNamespace] ===
                        W3mFrameRpcConstants.ACCOUNT_TYPES.SMART_ACCOUNT
                }
            });
            SnackController.showError('Failed to fetch transactions');
            state$a.loading = false;
            state$a.empty = true;
            state$a.next = undefined;
        }
    },
    groupTransactionsByYearAndMonth(transactionsMap = {}, transactions = []) {
        const grouped = transactionsMap;
        transactions.forEach(transaction => {
            const year = new Date(transaction.metadata.minedAt).getFullYear();
            const month = new Date(transaction.metadata.minedAt).getMonth();
            const yearTransactions = grouped[year] ?? {};
            const monthTransactions = yearTransactions[month] ?? [];
            // If there's a transaction with the same id, remove the old one
            const newMonthTransactions = monthTransactions.filter(tx => tx.id !== transaction.id);
            grouped[year] = {
                ...yearTransactions,
                [month]: [...newMonthTransactions, transaction].sort((a, b) => new Date(b.metadata.minedAt).getTime() - new Date(a.metadata.minedAt).getTime())
            };
        });
        return grouped;
    },
    filterSpamTransactions(transactions) {
        return transactions.filter(transaction => {
            const isAllSpam = transaction.transfers.every(transfer => transfer.nft_info?.flags.is_spam === true);
            return !isAllSpam;
        });
    },
    filterByConnectedChain(transactions) {
        const chainId = ChainController.state.activeCaipNetwork?.caipNetworkId;
        const filteredTransactions = transactions.filter(transaction => transaction.metadata.chain === chainId);
        return filteredTransactions;
    },
    clearCursor() {
        state$a.next = undefined;
    },
    resetTransactions() {
        state$a.transactions = [];
        state$a.transactionsByYear = {};
        state$a.lastNetworkInView = undefined;
        state$a.loading = false;
        state$a.empty = false;
        state$a.next = undefined;
    }
};
// Export the controller wrapped with our error boundary
const TransactionsController = withErrorBoundary(controller$7, 'API_ERROR');

/* eslint-disable no-console */
// -- State --------------------------------------------- //
const state$9 = proxy({
    connections: new Map(),
    wcError: false,
    buffering: false,
    status: 'disconnected'
});
// eslint-disable-next-line init-declarations
let wcConnectionPromise;
// -- Controller ---------------------------------------- //
const controller$6 = {
    state: state$9,
    subscribeKey(key, callback) {
        return subscribeKey(state$9, key, callback);
    },
    _getClient() {
        return state$9._client;
    },
    setClient(client) {
        state$9._client = ref(client);
    },
    async connectWalletConnect() {
        if (CoreHelperUtil.isTelegram() || (CoreHelperUtil.isSafari() && CoreHelperUtil.isIos())) {
            if (wcConnectionPromise) {
                await wcConnectionPromise;
                wcConnectionPromise = undefined;
                return;
            }
            if (!CoreHelperUtil.isPairingExpired(state$9?.wcPairingExpiry)) {
                const link = state$9.wcUri;
                state$9.wcUri = link;
                return;
            }
            wcConnectionPromise = ConnectionController._getClient()
                ?.connectWalletConnect?.()
                .catch(() => undefined);
            ConnectionController.state.status = 'connecting';
            await wcConnectionPromise;
            wcConnectionPromise = undefined;
            state$9.wcPairingExpiry = undefined;
            ConnectionController.state.status = 'connected';
        }
        else {
            await ConnectionController._getClient()?.connectWalletConnect?.();
        }
    },
    async connectExternal(options, chain, setChain = true) {
        await ConnectionController._getClient()?.connectExternal?.(options);
        if (setChain) {
            ChainController.setActiveNamespace(chain);
        }
    },
    async reconnectExternal(options) {
        await ConnectionController._getClient()?.reconnectExternal?.(options);
        const namespace = options.chain || ChainController.state.activeChain;
        if (namespace) {
            ConnectorController.setConnectorId(options.id, namespace);
        }
    },
    async setPreferredAccountType(accountType, namespace) {
        ModalController.setLoading(true, ChainController.state.activeChain);
        const authConnector = ConnectorController.getAuthConnector();
        if (!authConnector) {
            return;
        }
        AccountController.setPreferredAccountType(accountType, namespace);
        await authConnector.provider.setPreferredAccount(accountType);
        StorageUtil.setPreferredAccountTypes(AccountController.state.preferredAccountTypes ?? { [namespace]: accountType });
        await ConnectionController.reconnectExternal(authConnector);
        ModalController.setLoading(false, ChainController.state.activeChain);
        EventsController.sendEvent({
            type: 'track',
            event: 'SET_PREFERRED_ACCOUNT_TYPE',
            properties: {
                accountType,
                network: ChainController.state.activeCaipNetwork?.caipNetworkId || ''
            }
        });
    },
    async signMessage(message) {
        return ConnectionController._getClient()?.signMessage(message);
    },
    parseUnits(value, decimals) {
        return ConnectionController._getClient()?.parseUnits(value, decimals);
    },
    formatUnits(value, decimals) {
        return ConnectionController._getClient()?.formatUnits(value, decimals);
    },
    async sendTransaction(args) {
        return ConnectionController._getClient()?.sendTransaction(args);
    },
    async getCapabilities(params) {
        return ConnectionController._getClient()?.getCapabilities(params);
    },
    async grantPermissions(params) {
        return ConnectionController._getClient()?.grantPermissions(params);
    },
    async walletGetAssets(params) {
        return ConnectionController._getClient()?.walletGetAssets(params) ?? {};
    },
    async estimateGas(args) {
        return ConnectionController._getClient()?.estimateGas(args);
    },
    async writeContract(args) {
        return ConnectionController._getClient()?.writeContract(args);
    },
    async getEnsAddress(value) {
        return ConnectionController._getClient()?.getEnsAddress(value);
    },
    async getEnsAvatar(value) {
        return ConnectionController._getClient()?.getEnsAvatar(value);
    },
    checkInstalled(ids) {
        return ConnectionController._getClient()?.checkInstalled?.(ids) || false;
    },
    resetWcConnection() {
        state$9.wcUri = undefined;
        state$9.wcPairingExpiry = undefined;
        state$9.wcLinking = undefined;
        state$9.recentWallet = undefined;
        state$9.status = 'disconnected';
        TransactionsController.resetTransactions();
        StorageUtil.deleteWalletConnectDeepLink();
    },
    resetUri() {
        state$9.wcUri = undefined;
        state$9.wcPairingExpiry = undefined;
        wcConnectionPromise = undefined;
    },
    finalizeWcConnection() {
        const { wcLinking, recentWallet } = ConnectionController.state;
        if (wcLinking) {
            StorageUtil.setWalletConnectDeepLink(wcLinking);
        }
        if (recentWallet) {
            StorageUtil.setAppKitRecent(recentWallet);
        }
        EventsController.sendEvent({
            type: 'track',
            event: 'CONNECT_SUCCESS',
            properties: {
                method: wcLinking ? 'mobile' : 'qrcode',
                name: RouterController.state.data?.wallet?.name || 'Unknown'
            }
        });
    },
    setWcBasic(wcBasic) {
        state$9.wcBasic = wcBasic;
    },
    setUri(uri) {
        state$9.wcUri = uri;
        state$9.wcPairingExpiry = CoreHelperUtil.getPairingExpiry();
    },
    setWcLinking(wcLinking) {
        state$9.wcLinking = wcLinking;
    },
    setWcError(wcError) {
        state$9.wcError = wcError;
        state$9.buffering = false;
    },
    setRecentWallet(wallet) {
        state$9.recentWallet = wallet;
    },
    setBuffering(buffering) {
        state$9.buffering = buffering;
    },
    setStatus(status) {
        state$9.status = status;
    },
    async disconnect(namespace) {
        try {
            await ConnectionController._getClient()?.disconnect(namespace);
        }
        catch (error) {
            throw new AppKitError('Failed to disconnect', 'INTERNAL_SDK_ERROR', error);
        }
    },
    setConnections(connections, chainNamespace) {
        state$9.connections.set(chainNamespace, connections);
    },
    switchAccount({ connection, address, namespace }) {
        const connectedConnectorId = ConnectorController.state.activeConnectorIds[namespace];
        const isConnectorConnected = connectedConnectorId === connection.connectorId;
        if (isConnectorConnected) {
            const currentNetwork = ChainController.state.activeCaipNetwork;
            if (currentNetwork) {
                const caipAddress = `${namespace}:${currentNetwork.id}:${address}`;
                AccountController.setCaipAddress(caipAddress, namespace);
            }
            else {
                console.warn(`No current network found for namespace "${namespace}"`);
            }
        }
        else {
            const connector = ConnectorController.getConnector(connection.connectorId);
            if (connector) {
                ConnectionController.connectExternal(connector, namespace);
            }
            else {
                console.warn(`No connector found for namespace "${namespace}"`);
            }
        }
    }
};
// Export the controller wrapped with our error boundary
const ConnectionController = withErrorBoundary(controller$6);

// -- State --------------------------------------------- //
const state$8 = proxy({
    loading: false,
    open: false,
    selectedNetworkId: undefined,
    activeChain: undefined,
    initialized: false
});
// -- Controller ---------------------------------------- //
const PublicStateController = {
    state: state$8,
    subscribe(callback) {
        return subscribe(state$8, () => callback(state$8));
    },
    subscribeOpen(callback) {
        return subscribeKey(state$8, 'open', callback);
    },
    set(newState) {
        Object.assign(state$8, { ...state$8, ...newState });
    }
};

/**
 *  Divides a number by a given exponent of base 10 (10exponent), and formats it into a string representation of the number..
 *
 * - Docs: https://viem.sh/docs/utilities/formatUnits
 *
 * @example
 * import { formatUnits } from 'viem'
 *
 * formatUnits(420000000000n, 9)
 * // '420'
 */
function formatUnits(value, decimals) {
    let display = value.toString();
    const negative = display.startsWith('-');
    if (negative)
        display = display.slice(1);
    display = display.padStart(decimals, '0');
    let [integer, fraction] = [
        display.slice(0, display.length - decimals),
        display.slice(display.length - decimals),
    ];
    fraction = fraction.replace(/(0+)$/, '');
    return `${negative ? '-' : ''}${integer || '0'}${fraction ? `.${fraction}` : ''}`;
}

const ERC7811Utils = {
    /**
     * Creates a Balance object from an ERC7811 Asset object
     * @param asset - Asset object to convert
     * @param chainId - Chain ID in CAIP-2 format
     * @returns Balance object
     */
    createBalance(asset, chainId) {
        const metadata = {
            name: (asset.metadata['name'] || ''),
            symbol: (asset.metadata['symbol'] || ''),
            decimals: (asset.metadata['decimals'] || 0),
            value: (asset.metadata['value'] || 0),
            price: (asset.metadata['price'] || 0),
            iconUrl: (asset.metadata['iconUrl'] || '')
        };
        return {
            name: metadata.name,
            symbol: metadata.symbol,
            chainId,
            address: asset.address === 'native'
                ? undefined
                : this.convertAddressToCAIP10Address(asset.address, chainId),
            value: metadata.value,
            price: metadata.price,
            quantity: {
                decimals: metadata.decimals.toString(),
                numeric: this.convertHexToBalance({
                    hex: asset.balance,
                    decimals: metadata.decimals
                })
            },
            iconUrl: metadata.iconUrl
        };
    },
    /**
     * Converts a hex string to a Balance object
     * @param hex - Hex string to convert
     * @param decimals - Number of decimals to use
     * @returns Balance object
     */
    convertHexToBalance({ hex, decimals }) {
        return formatUnits(BigInt(hex), decimals);
    },
    /**
     * Converts an address to a CAIP-10 address
     * @param address - Address to convert
     * @param chainId - Chain ID in CAIP-2 format
     * @returns CAIP-10 address
     */
    convertAddressToCAIP10Address(address, chainId) {
        return `${chainId}:${address}`;
    },
    /**
     *  Creates a CAIP-2 Chain ID from a chain ID and namespace
     * @param chainId  - Chain ID in hex format
     * @param namespace  - Chain namespace
     * @returns
     */
    createCAIP2ChainId(chainId, namespace) {
        return `${namespace}:${parseInt(chainId, 16)}`;
    },
    /**
     * Gets the chain ID in hex format from a CAIP-2 Chain ID
     * @param caip2ChainId - CAIP-2 Chain ID
     * @returns Chain ID in hex format
     */
    getChainIdHexFromCAIP2ChainId(caip2ChainId) {
        const parts = caip2ChainId.split(':');
        if (parts.length < 2 || !parts[1]) {
            return '0x0';
        }
        const chainPart = parts[1];
        const parsed = parseInt(chainPart, 10);
        return isNaN(parsed) ? '0x0' : `0x${parsed.toString(16)}`;
    },
    /**
     * Checks if a response is a valid WalletGetAssetsResponse
     * @param response - The response to check
     * @returns True if the response is a valid WalletGetAssetsResponse, false otherwise
     */
    isWalletGetAssetsResponse(response) {
        // Check if response is an object and has the expected structure
        if (typeof response !== 'object' || response === null) {
            return false;
        }
        // Check if all values are arrays and conform to the expected asset structure
        return Object.values(response).every(value => Array.isArray(value) && value.every(asset => this.isValidAsset(asset)));
    },
    /**
     * Checks if an asset object is valid.
     * @param asset - The asset object to check.
     * @returns True if the asset is valid, false otherwise.
     */
    isValidAsset(asset) {
        return (typeof asset === 'object' &&
            asset !== null &&
            typeof asset.address === 'string' &&
            typeof asset.balance === 'string' &&
            (asset.type === 'ERC20' || asset.type === 'NATIVE') &&
            typeof asset.metadata === 'object' &&
            asset.metadata !== null &&
            typeof asset.metadata['name'] === 'string' &&
            typeof asset.metadata['symbol'] === 'string' &&
            typeof asset.metadata['decimals'] === 'number' &&
            typeof asset.metadata['price'] === 'number' &&
            typeof asset.metadata['iconUrl'] === 'string');
    }
};

// -- Controller ---------------------------------------- //
const SendApiUtil = {
    async getMyTokensWithBalance(forceUpdate) {
        const address = AccountController.state.address;
        const caipNetwork = ChainController.state.activeCaipNetwork;
        if (!address || !caipNetwork) {
            return [];
        }
        // Extract EIP-155 specific logic
        if (caipNetwork.chainNamespace === 'eip155') {
            const eip155Balances = await this.getEIP155Balances(address, caipNetwork);
            if (eip155Balances) {
                return this.filterLowQualityTokens(eip155Balances);
            }
        }
        // Fallback to 1Inch API
        const response = await BlockchainApiController.getBalance(address, caipNetwork.caipNetworkId, forceUpdate);
        return this.filterLowQualityTokens(response.balances);
    },
    async getEIP155Balances(address, caipNetwork) {
        try {
            const chainIdHex = ERC7811Utils.getChainIdHexFromCAIP2ChainId(caipNetwork.caipNetworkId);
            const walletCapabilities = (await ConnectionController.getCapabilities(address));
            if (!walletCapabilities?.[chainIdHex]?.['assetDiscovery']?.supported) {
                return null;
            }
            const walletGetAssetsResponse = await ConnectionController.walletGetAssets({
                account: address,
                chainFilter: [chainIdHex]
            });
            if (!ERC7811Utils.isWalletGetAssetsResponse(walletGetAssetsResponse)) {
                return null;
            }
            const assets = walletGetAssetsResponse[chainIdHex] || [];
            return assets.map(asset => ERC7811Utils.createBalance(asset, caipNetwork.caipNetworkId));
        }
        catch (error) {
            return null;
        }
    },
    /**
     * The 1Inch API includes many low-quality tokens in the balance response,
     * which appear inconsistently. This filter prevents them from being displayed.
     */
    filterLowQualityTokens(balances) {
        return balances.filter(balance => balance.quantity.decimals !== '0');
    },
    mapBalancesToSwapTokens(balances) {
        return (balances?.map(token => ({
            ...token,
            address: token?.address
                ? token.address
                : ChainController.getActiveNetworkTokenAddress(),
            decimals: parseInt(token.quantity.decimals, 10),
            logoUri: token.iconUrl,
            eip2612: false
        })) || []);
    }
};

// -- State --------------------------------------------- //
const state$7 = proxy({
    tokenBalances: [],
    loading: false
});
// -- Controller ---------------------------------------- //
const controller$5 = {
    state: state$7,
    subscribe(callback) {
        return subscribe(state$7, () => callback(state$7));
    },
    subscribeKey(key, callback) {
        return subscribeKey(state$7, key, callback);
    },
    setToken(token) {
        if (token) {
            state$7.token = ref(token);
        }
    },
    setTokenAmount(sendTokenAmount) {
        state$7.sendTokenAmount = sendTokenAmount;
    },
    setReceiverAddress(receiverAddress) {
        state$7.receiverAddress = receiverAddress;
    },
    setReceiverProfileImageUrl(receiverProfileImageUrl) {
        state$7.receiverProfileImageUrl = receiverProfileImageUrl;
    },
    setReceiverProfileName(receiverProfileName) {
        state$7.receiverProfileName = receiverProfileName;
    },
    setNetworkBalanceInUsd(networkBalanceInUSD) {
        state$7.networkBalanceInUSD = networkBalanceInUSD;
    },
    setLoading(loading) {
        state$7.loading = loading;
    },
    async sendToken() {
        try {
            SendController.setLoading(true);
            switch (ChainController.state.activeCaipNetwork?.chainNamespace) {
                case 'eip155':
                    await SendController.sendEvmToken();
                    return;
                case 'solana':
                    await SendController.sendSolanaToken();
                    return;
                default:
                    throw new Error('Unsupported chain');
            }
        }
        finally {
            SendController.setLoading(false);
        }
    },
    async sendEvmToken() {
        const activeChainNamespace = ChainController.state.activeChain;
        const activeAccountType = AccountController.state.preferredAccountTypes?.[activeChainNamespace];
        if (!SendController.state.sendTokenAmount || !SendController.state.receiverAddress) {
            throw new Error('An amount and receiver address are required');
        }
        if (!SendController.state.token) {
            throw new Error('A token is required');
        }
        if (SendController.state.token?.address) {
            EventsController.sendEvent({
                type: 'track',
                event: 'SEND_INITIATED',
                properties: {
                    isSmartAccount: activeAccountType === W3mFrameRpcConstants.ACCOUNT_TYPES.SMART_ACCOUNT,
                    token: SendController.state.token.address,
                    amount: SendController.state.sendTokenAmount,
                    network: ChainController.state.activeCaipNetwork?.caipNetworkId || ''
                }
            });
            await SendController.sendERC20Token({
                receiverAddress: SendController.state.receiverAddress,
                tokenAddress: SendController.state.token.address,
                sendTokenAmount: SendController.state.sendTokenAmount,
                decimals: SendController.state.token.quantity.decimals
            });
        }
        else {
            EventsController.sendEvent({
                type: 'track',
                event: 'SEND_INITIATED',
                properties: {
                    isSmartAccount: activeAccountType === W3mFrameRpcConstants.ACCOUNT_TYPES.SMART_ACCOUNT,
                    token: SendController.state.token.symbol || '',
                    amount: SendController.state.sendTokenAmount,
                    network: ChainController.state.activeCaipNetwork?.caipNetworkId || ''
                }
            });
            await SendController.sendNativeToken({
                receiverAddress: SendController.state.receiverAddress,
                sendTokenAmount: SendController.state.sendTokenAmount,
                decimals: SendController.state.token.quantity.decimals
            });
        }
    },
    async fetchTokenBalance(onError) {
        state$7.loading = true;
        const chainId = ChainController.state.activeCaipNetwork?.caipNetworkId;
        const chain = ChainController.state.activeCaipNetwork?.chainNamespace;
        const caipAddress = ChainController.state.activeCaipAddress;
        const address = caipAddress ? CoreHelperUtil.getPlainAddress(caipAddress) : undefined;
        if (state$7.lastRetry &&
            !CoreHelperUtil.isAllowedRetry(state$7.lastRetry, 30 * ConstantsUtil$2.ONE_SEC_MS)) {
            state$7.loading = false;
            return [];
        }
        try {
            if (address && chainId && chain) {
                const balances = await SendApiUtil.getMyTokensWithBalance();
                state$7.tokenBalances = balances;
                state$7.lastRetry = undefined;
                return balances;
            }
        }
        catch (error) {
            state$7.lastRetry = Date.now();
            onError?.(error);
            SnackController.showError('Token Balance Unavailable');
        }
        finally {
            state$7.loading = false;
        }
        return [];
    },
    fetchNetworkBalance() {
        if (state$7.tokenBalances.length === 0) {
            return;
        }
        const networkTokenBalances = SendApiUtil.mapBalancesToSwapTokens(state$7.tokenBalances);
        if (!networkTokenBalances) {
            return;
        }
        const networkToken = networkTokenBalances.find(token => token.address === ChainController.getActiveNetworkTokenAddress());
        if (!networkToken) {
            return;
        }
        state$7.networkBalanceInUSD = networkToken
            ? NumberUtil.multiply(networkToken.quantity.numeric, networkToken.price).toString()
            : '0';
    },
    async sendNativeToken(params) {
        RouterController.pushTransactionStack({});
        const to = params.receiverAddress;
        const address = AccountController.state.address;
        const value = ConnectionController.parseUnits(params.sendTokenAmount.toString(), Number(params.decimals));
        const data = '0x';
        await ConnectionController.sendTransaction({
            chainNamespace: 'eip155',
            to,
            address,
            data,
            value: value ?? BigInt(0)
        });
        EventsController.sendEvent({
            type: 'track',
            event: 'SEND_SUCCESS',
            properties: {
                isSmartAccount: AccountController.state.preferredAccountTypes?.['eip155'] ===
                    W3mFrameRpcConstants.ACCOUNT_TYPES.SMART_ACCOUNT,
                token: SendController.state.token?.symbol || '',
                amount: params.sendTokenAmount,
                network: ChainController.state.activeCaipNetwork?.caipNetworkId || ''
            }
        });
        ConnectionController._getClient()?.updateBalance('eip155');
        SendController.resetSend();
    },
    async sendERC20Token(params) {
        RouterController.pushTransactionStack({
            onSuccess() {
                RouterController.replace('Account');
            }
        });
        const amount = ConnectionController.parseUnits(params.sendTokenAmount.toString(), Number(params.decimals));
        if (AccountController.state.address &&
            params.sendTokenAmount &&
            params.receiverAddress &&
            params.tokenAddress) {
            const tokenAddress = CoreHelperUtil.getPlainAddress(params.tokenAddress);
            await ConnectionController.writeContract({
                fromAddress: AccountController.state.address,
                tokenAddress,
                args: [params.receiverAddress, amount ?? BigInt(0)],
                method: 'transfer',
                abi: ContractUtil.getERC20Abi(tokenAddress),
                chainNamespace: 'eip155'
            });
            SendController.resetSend();
        }
    },
    async sendSolanaToken() {
        if (!SendController.state.sendTokenAmount || !SendController.state.receiverAddress) {
            throw new Error('An amount and receiver address are required');
        }
        RouterController.pushTransactionStack({
            onSuccess() {
                RouterController.replace('Account');
            }
        });
        await ConnectionController.sendTransaction({
            chainNamespace: 'solana',
            to: SendController.state.receiverAddress,
            value: SendController.state.sendTokenAmount
        });
        ConnectionController._getClient()?.updateBalance('solana');
        SendController.resetSend();
    },
    resetSend() {
        state$7.token = undefined;
        state$7.sendTokenAmount = undefined;
        state$7.receiverAddress = undefined;
        state$7.receiverProfileImageUrl = undefined;
        state$7.receiverProfileName = undefined;
        state$7.loading = false;
        state$7.tokenBalances = [];
    }
};
// Export the controller wrapped with our error boundary
const SendController = withErrorBoundary(controller$5);

// -- Constants ----------------------------------------- //
const accountState = {
    currentTab: 0,
    tokenBalance: [],
    smartAccountDeployed: false,
    addressLabels: new Map(),
    allAccounts: [],
    user: undefined
};
const networkState = {
    caipNetwork: undefined,
    supportsAllNetworks: true,
    smartAccountEnabledNetworks: []
};
// -- State --------------------------------------------- //
const state$6 = proxy({
    chains: proxyMap(),
    activeCaipAddress: undefined,
    activeChain: undefined,
    activeCaipNetwork: undefined,
    noAdapters: false,
    universalAdapter: {
        networkControllerClient: undefined,
        connectionControllerClient: undefined
    },
    isSwitchingNamespace: false
});
// -- Controller ---------------------------------------- //
const controller$4 = {
    state: state$6,
    subscribe(callback) {
        return subscribe(state$6, () => {
            callback(state$6);
        });
    },
    subscribeKey(key, callback) {
        return subscribeKey(state$6, key, callback);
    },
    subscribeChainProp(property, callback, chain) {
        let prev = undefined;
        return subscribe(state$6.chains, () => {
            const activeChain = chain || state$6.activeChain;
            if (activeChain) {
                const nextValue = state$6.chains.get(activeChain)?.[property];
                if (prev !== nextValue) {
                    prev = nextValue;
                    callback(nextValue);
                }
            }
        });
    },
    initialize(adapters, caipNetworks, clients) {
        const { chainId: activeChainId, namespace: activeNamespace } = StorageUtil.getActiveNetworkProps();
        const activeCaipNetwork = caipNetworks?.find(network => network.id.toString() === activeChainId?.toString());
        const defaultAdapter = adapters.find(adapter => adapter?.namespace === activeNamespace);
        const adapterToActivate = defaultAdapter || adapters?.[0];
        const namespacesFromAdapters = adapters.map(a => a.namespace).filter(n => n !== undefined);
        /**
         * If the AppKit is in embedded mode (for Demo app), we should get the available namespaces from the adapters.
         */
        const namespaces = OptionsController.state.enableEmbedded
            ? new Set([...namespacesFromAdapters])
            : new Set([...(caipNetworks?.map(network => network.chainNamespace) ?? [])]);
        if (adapters?.length === 0 || !adapterToActivate) {
            state$6.noAdapters = true;
        }
        if (!state$6.noAdapters) {
            state$6.activeChain = adapterToActivate?.namespace;
            state$6.activeCaipNetwork = activeCaipNetwork;
            ChainController.setChainNetworkData(adapterToActivate?.namespace, {
                caipNetwork: activeCaipNetwork
            });
            if (state$6.activeChain) {
                PublicStateController.set({ activeChain: adapterToActivate?.namespace });
            }
        }
        namespaces.forEach(namespace => {
            const namespaceNetworks = caipNetworks?.filter(network => network.chainNamespace === namespace);
            ChainController.state.chains.set(namespace, {
                namespace,
                networkState: proxy({
                    ...networkState,
                    caipNetwork: namespaceNetworks?.[0]
                }),
                accountState: proxy(accountState),
                caipNetworks: namespaceNetworks ?? [],
                ...clients
            });
            ChainController.setRequestedCaipNetworks(namespaceNetworks ?? [], namespace);
        });
    },
    removeAdapter(namespace) {
        if (state$6.activeChain === namespace) {
            const nextAdapter = Array.from(state$6.chains.entries()).find(([chainNamespace]) => chainNamespace !== namespace);
            if (nextAdapter) {
                const caipNetwork = nextAdapter[1]?.caipNetworks?.[0];
                if (caipNetwork) {
                    ChainController.setActiveCaipNetwork(caipNetwork);
                }
            }
        }
        state$6.chains.delete(namespace);
    },
    addAdapter(adapter, { networkControllerClient, connectionControllerClient }, caipNetworks) {
        state$6.chains.set(adapter.namespace, {
            namespace: adapter.namespace,
            networkState: {
                ...networkState,
                caipNetwork: caipNetworks[0]
            },
            accountState,
            caipNetworks,
            connectionControllerClient,
            networkControllerClient
        });
        ChainController.setRequestedCaipNetworks(caipNetworks?.filter(caipNetwork => caipNetwork.chainNamespace === adapter.namespace) ?? [], adapter.namespace);
    },
    addNetwork(network) {
        const chainAdapter = state$6.chains.get(network.chainNamespace);
        if (chainAdapter) {
            const newNetworks = [...(chainAdapter.caipNetworks || [])];
            if (!chainAdapter.caipNetworks?.find(caipNetwork => caipNetwork.id === network.id)) {
                newNetworks.push(network);
            }
            state$6.chains.set(network.chainNamespace, { ...chainAdapter, caipNetworks: newNetworks });
            ChainController.setRequestedCaipNetworks(newNetworks, network.chainNamespace);
            ConnectorController.filterByNamespace(network.chainNamespace, true);
        }
    },
    removeNetwork(namespace, networkId) {
        const chainAdapter = state$6.chains.get(namespace);
        if (chainAdapter) {
            // Check if network being removed is active network
            const isActiveNetwork = state$6.activeCaipNetwork?.id === networkId;
            // Filter out the network being removed
            const newCaipNetworksOfAdapter = [
                ...(chainAdapter.caipNetworks?.filter(network => network.id !== networkId) || [])
            ];
            // If active network was removed and there are other networks available, switch to first one
            if (isActiveNetwork && chainAdapter?.caipNetworks?.[0]) {
                ChainController.setActiveCaipNetwork(chainAdapter.caipNetworks[0]);
            }
            state$6.chains.set(namespace, { ...chainAdapter, caipNetworks: newCaipNetworksOfAdapter });
            ChainController.setRequestedCaipNetworks(newCaipNetworksOfAdapter || [], namespace);
            if (newCaipNetworksOfAdapter.length === 0) {
                ConnectorController.filterByNamespace(namespace, false);
            }
        }
    },
    setAdapterNetworkState(chain, props) {
        const chainAdapter = state$6.chains.get(chain);
        if (chainAdapter) {
            chainAdapter.networkState = {
                ...(chainAdapter.networkState || networkState),
                ...props
            };
            state$6.chains.set(chain, chainAdapter);
        }
    },
    setChainAccountData(chain, accountProps, _unknown = true) {
        if (!chain) {
            throw new Error('Chain is required to update chain account data');
        }
        const chainAdapter = state$6.chains.get(chain);
        if (chainAdapter) {
            const newAccountState = { ...(chainAdapter.accountState || accountState), ...accountProps };
            state$6.chains.set(chain, { ...chainAdapter, accountState: newAccountState });
            if (state$6.chains.size === 1 || state$6.activeChain === chain) {
                if (accountProps.caipAddress) {
                    state$6.activeCaipAddress = accountProps.caipAddress;
                }
                AccountController.replaceState(newAccountState);
            }
        }
    },
    setChainNetworkData(chain, networkProps) {
        if (!chain) {
            return;
        }
        const chainAdapter = state$6.chains.get(chain);
        if (chainAdapter) {
            const newNetworkState = { ...(chainAdapter.networkState || networkState), ...networkProps };
            state$6.chains.set(chain, { ...chainAdapter, networkState: newNetworkState });
        }
    },
    // eslint-disable-next-line max-params
    setAccountProp(prop, value, chain, replaceState = true) {
        ChainController.setChainAccountData(chain, { [prop]: value }, replaceState);
        if (prop === 'status' && value === 'disconnected' && chain) {
            ConnectorController.removeConnectorId(chain);
        }
    },
    setActiveNamespace(chain) {
        state$6.activeChain = chain;
        const newAdapter = chain ? state$6.chains.get(chain) : undefined;
        const caipNetwork = newAdapter?.networkState?.caipNetwork;
        if (caipNetwork?.id && chain) {
            state$6.activeCaipAddress = newAdapter?.accountState?.caipAddress;
            state$6.activeCaipNetwork = caipNetwork;
            ChainController.setChainNetworkData(chain, { caipNetwork });
            StorageUtil.setActiveCaipNetworkId(caipNetwork?.caipNetworkId);
            PublicStateController.set({
                activeChain: chain,
                selectedNetworkId: caipNetwork?.caipNetworkId
            });
        }
    },
    setActiveCaipNetwork(caipNetwork) {
        if (!caipNetwork) {
            return;
        }
        if (state$6.activeChain !== caipNetwork.chainNamespace) {
            ChainController.setIsSwitchingNamespace(true);
        }
        const newAdapter = state$6.chains.get(caipNetwork.chainNamespace);
        state$6.activeChain = caipNetwork.chainNamespace;
        state$6.activeCaipNetwork = caipNetwork;
        ChainController.setChainNetworkData(caipNetwork.chainNamespace, { caipNetwork });
        if (newAdapter?.accountState?.address) {
            state$6.activeCaipAddress = `${caipNetwork.chainNamespace}:${caipNetwork.id}:${newAdapter?.accountState?.address}`;
        }
        else {
            state$6.activeCaipAddress = undefined;
        }
        // Update the chain's account state with the new caip address value
        ChainController.setAccountProp('caipAddress', state$6.activeCaipAddress, caipNetwork.chainNamespace);
        if (newAdapter) {
            AccountController.replaceState(newAdapter.accountState);
        }
        // Reset send state when switching networks
        SendController.resetSend();
        PublicStateController.set({
            activeChain: state$6.activeChain,
            selectedNetworkId: state$6.activeCaipNetwork?.caipNetworkId
        });
        StorageUtil.setActiveCaipNetworkId(caipNetwork.caipNetworkId);
        const isSupported = ChainController.checkIfSupportedNetwork(caipNetwork.chainNamespace);
        if (!isSupported &&
            OptionsController.state.enableNetworkSwitch &&
            !OptionsController.state.allowUnsupportedChain &&
            !ConnectionController.state.wcBasic) {
            ChainController.showUnsupportedChainUI();
        }
    },
    addCaipNetwork(caipNetwork) {
        if (!caipNetwork) {
            return;
        }
        const chain = state$6.chains.get(caipNetwork.chainNamespace);
        if (chain) {
            chain?.caipNetworks?.push(caipNetwork);
        }
    },
    async switchActiveNamespace(namespace) {
        if (!namespace) {
            return;
        }
        const isDifferentChain = namespace !== ChainController.state.activeChain;
        const caipNetworkOfNamespace = ChainController.getNetworkData(namespace)?.caipNetwork;
        const firstNetworkWithChain = ChainController.getCaipNetworkByNamespace(namespace, caipNetworkOfNamespace?.id);
        if (isDifferentChain && firstNetworkWithChain) {
            await ChainController.switchActiveNetwork(firstNetworkWithChain);
        }
    },
    async switchActiveNetwork(network) {
        const activeAdapter = ChainController.state.chains.get(ChainController.state.activeChain);
        const unsupportedNetwork = !activeAdapter?.caipNetworks?.some(caipNetwork => caipNetwork.id === state$6.activeCaipNetwork?.id);
        const networkControllerClient = ChainController.getNetworkControllerClient(network.chainNamespace);
        if (networkControllerClient) {
            try {
                await networkControllerClient.switchCaipNetwork(network);
                if (unsupportedNetwork) {
                    ModalController.close();
                }
            }
            catch (error) {
                RouterController.goBack();
            }
            EventsController.sendEvent({
                type: 'track',
                event: 'SWITCH_NETWORK',
                properties: { network: network.caipNetworkId }
            });
        }
    },
    getNetworkControllerClient(chainNamespace) {
        const chain = chainNamespace || state$6.activeChain;
        const chainAdapter = state$6.chains.get(chain);
        if (!chainAdapter) {
            throw new Error('Chain adapter not found');
        }
        if (!chainAdapter.networkControllerClient) {
            throw new Error('NetworkController client not set');
        }
        return chainAdapter.networkControllerClient;
    },
    getConnectionControllerClient(_chain) {
        const chain = _chain || state$6.activeChain;
        if (!chain) {
            throw new Error('Chain is required to get connection controller client');
        }
        const chainAdapter = state$6.chains.get(chain);
        if (!chainAdapter?.connectionControllerClient) {
            throw new Error('ConnectionController client not set');
        }
        return chainAdapter.connectionControllerClient;
    },
    getAccountProp(key, _chain) {
        let chain = state$6.activeChain;
        if (_chain) {
            chain = _chain;
        }
        if (!chain) {
            return undefined;
        }
        const chainAccountState = state$6.chains.get(chain)?.accountState;
        if (!chainAccountState) {
            return undefined;
        }
        return chainAccountState[key];
    },
    getNetworkProp(key, namespace) {
        const chainNetworkState = state$6.chains.get(namespace)?.networkState;
        if (!chainNetworkState) {
            return undefined;
        }
        return chainNetworkState[key];
    },
    getRequestedCaipNetworks(chainToFilter) {
        const adapter = state$6.chains.get(chainToFilter);
        const { approvedCaipNetworkIds = [], requestedCaipNetworks = [] } = adapter?.networkState || {};
        const sortedNetworks = CoreHelperUtil.sortRequestedNetworks(approvedCaipNetworkIds, requestedCaipNetworks);
        return sortedNetworks;
    },
    getAllRequestedCaipNetworks() {
        const requestedCaipNetworks = [];
        state$6.chains.forEach(chainAdapter => {
            const caipNetworks = ChainController.getRequestedCaipNetworks(chainAdapter.namespace);
            requestedCaipNetworks.push(...caipNetworks);
        });
        return requestedCaipNetworks;
    },
    setRequestedCaipNetworks(caipNetworks, chain) {
        ChainController.setAdapterNetworkState(chain, { requestedCaipNetworks: caipNetworks });
        const allRequestedCaipNetworks = ChainController.getAllRequestedCaipNetworks();
        const namespaces = allRequestedCaipNetworks.map(network => network.chainNamespace);
        const uniqueNamespaces = Array.from(new Set(namespaces));
        ConnectorController.filterByNamespaces(uniqueNamespaces);
    },
    getAllApprovedCaipNetworkIds() {
        const approvedCaipNetworkIds = [];
        state$6.chains.forEach(chainAdapter => {
            const approvedIds = ChainController.getApprovedCaipNetworkIds(chainAdapter.namespace);
            approvedCaipNetworkIds.push(...approvedIds);
        });
        return approvedCaipNetworkIds;
    },
    getActiveCaipNetwork() {
        return state$6.activeCaipNetwork;
    },
    getActiveCaipAddress() {
        return state$6.activeCaipAddress;
    },
    getApprovedCaipNetworkIds(namespace) {
        const adapter = state$6.chains.get(namespace);
        const approvedCaipNetworkIds = adapter?.networkState?.approvedCaipNetworkIds || [];
        return approvedCaipNetworkIds;
    },
    async setApprovedCaipNetworksData(namespace) {
        const networkControllerClient = ChainController.getNetworkControllerClient();
        const data = await networkControllerClient?.getApprovedCaipNetworksData();
        ChainController.setAdapterNetworkState(namespace, {
            approvedCaipNetworkIds: data?.approvedCaipNetworkIds,
            supportsAllNetworks: data?.supportsAllNetworks
        });
    },
    checkIfSupportedNetwork(namespace, caipNetwork) {
        const activeCaipNetwork = caipNetwork || state$6.activeCaipNetwork;
        const requestedCaipNetworks = ChainController.getRequestedCaipNetworks(namespace);
        if (!requestedCaipNetworks.length) {
            return true;
        }
        return requestedCaipNetworks?.some(network => network.id === activeCaipNetwork?.id);
    },
    checkIfSupportedChainId(chainId) {
        if (!state$6.activeChain) {
            return true;
        }
        const requestedCaipNetworks = ChainController.getRequestedCaipNetworks(state$6.activeChain);
        return requestedCaipNetworks?.some(network => network.id === chainId);
    },
    // Smart Account Network Handlers
    setSmartAccountEnabledNetworks(smartAccountEnabledNetworks, chain) {
        ChainController.setAdapterNetworkState(chain, { smartAccountEnabledNetworks });
    },
    checkIfSmartAccountEnabled() {
        const networkId = NetworkUtil$1.caipNetworkIdToNumber(state$6.activeCaipNetwork?.caipNetworkId);
        const activeChain = state$6.activeChain;
        if (!activeChain || !networkId) {
            return false;
        }
        const smartAccountEnabledNetworks = ChainController.getNetworkProp('smartAccountEnabledNetworks', activeChain);
        return Boolean(smartAccountEnabledNetworks?.includes(Number(networkId)));
    },
    getActiveNetworkTokenAddress() {
        const namespace = state$6.activeCaipNetwork?.chainNamespace || 'eip155';
        const chainId = state$6.activeCaipNetwork?.id || 1;
        const address = ConstantsUtil$2.NATIVE_TOKEN_ADDRESS[namespace];
        return `${namespace}:${chainId}:${address}`;
    },
    showUnsupportedChainUI() {
        ModalController.open({ view: 'UnsupportedChain' });
    },
    checkIfNamesSupported() {
        const activeCaipNetwork = state$6.activeCaipNetwork;
        return Boolean(activeCaipNetwork?.chainNamespace &&
            ConstantsUtil$2.NAMES_SUPPORTED_CHAIN_NAMESPACES.includes(activeCaipNetwork.chainNamespace));
    },
    resetNetwork(namespace) {
        ChainController.setAdapterNetworkState(namespace, {
            approvedCaipNetworkIds: undefined,
            supportsAllNetworks: true,
            smartAccountEnabledNetworks: []
        });
    },
    resetAccount(chain) {
        const chainToWrite = chain;
        if (!chainToWrite) {
            throw new Error('Chain is required to set account prop');
        }
        state$6.activeCaipAddress = undefined;
        ChainController.setChainAccountData(chainToWrite, {
            smartAccountDeployed: false,
            currentTab: 0,
            caipAddress: undefined,
            address: undefined,
            balance: undefined,
            balanceSymbol: undefined,
            profileName: undefined,
            profileImage: undefined,
            addressExplorerUrl: undefined,
            tokenBalance: [],
            connectedWalletInfo: undefined,
            preferredAccountTypes: undefined,
            socialProvider: undefined,
            socialWindow: undefined,
            farcasterUrl: undefined,
            allAccounts: [],
            user: undefined,
            status: 'disconnected'
        });
        ConnectorController.removeConnectorId(chainToWrite);
    },
    setIsSwitchingNamespace(isSwitchingNamespace) {
        state$6.isSwitchingNamespace = isSwitchingNamespace;
    },
    getFirstCaipNetworkSupportsAuthConnector() {
        const availableChains = [];
        let firstCaipNetwork = undefined;
        state$6.chains.forEach(chain => {
            if (ConstantsUtil$3.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(ns => ns === chain.namespace)) {
                if (chain.namespace) {
                    availableChains.push(chain.namespace);
                }
            }
        });
        if (availableChains.length > 0) {
            const firstAvailableChain = availableChains[0];
            firstCaipNetwork = firstAvailableChain
                ? state$6.chains.get(firstAvailableChain)?.caipNetworks?.[0]
                : undefined;
            return firstCaipNetwork;
        }
        return undefined;
    },
    getAccountData(chainNamespace) {
        if (!chainNamespace) {
            return AccountController.state;
        }
        return ChainController.state.chains.get(chainNamespace)?.accountState;
    },
    getNetworkData(chainNamespace) {
        const namespace = chainNamespace || state$6.activeChain;
        if (!namespace) {
            return undefined;
        }
        return ChainController.state.chains.get(namespace)?.networkState;
    },
    getCaipNetworkByNamespace(chainNamespace, chainId) {
        if (!chainNamespace) {
            return undefined;
        }
        const chain = ChainController.state.chains.get(chainNamespace);
        const byChainId = chain?.caipNetworks?.find(network => network.id === chainId);
        if (byChainId) {
            return byChainId;
        }
        return chain?.networkState?.caipNetwork || chain?.caipNetworks?.[0];
    },
    /**
     * Get the requested CaipNetwork IDs for a given namespace. If namespace is not provided, all requested CaipNetwork IDs will be returned
     * @param namespace - The namespace to get the requested CaipNetwork IDs for
     * @returns The requested CaipNetwork IDs
     */
    getRequestedCaipNetworkIds() {
        const namespace = ConnectorController.state.filterByNamespace;
        const chains = namespace ? [state$6.chains.get(namespace)] : Array.from(state$6.chains.values());
        return chains
            .flatMap(chain => chain?.caipNetworks || [])
            .map(caipNetwork => caipNetwork.caipNetworkId);
    },
    getCaipNetworks(namespace) {
        if (namespace) {
            return ChainController.getRequestedCaipNetworks(namespace);
        }
        return ChainController.getAllRequestedCaipNetworks();
    }
};
// Export the controller wrapped with our error boundary
const ChainController = withErrorBoundary(controller$4);

const DEFAULT_OPTIONS = {
    purchaseCurrencies: [
        {
            id: '2b92315d-eab7-5bef-84fa-089a131333f5',
            name: 'USD Coin',
            symbol: 'USDC',
            networks: [
                {
                    name: 'ethereum-mainnet',
                    display_name: 'Ethereum',
                    chain_id: '1',
                    contract_address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
                },
                {
                    name: 'polygon-mainnet',
                    display_name: 'Polygon',
                    chain_id: '137',
                    contract_address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
                }
            ]
        },
        {
            id: '2b92315d-eab7-5bef-84fa-089a131333f5',
            name: 'Ether',
            symbol: 'ETH',
            networks: [
                {
                    name: 'ethereum-mainnet',
                    display_name: 'Ethereum',
                    chain_id: '1',
                    contract_address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
                },
                {
                    name: 'polygon-mainnet',
                    display_name: 'Polygon',
                    chain_id: '137',
                    contract_address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
                }
            ]
        }
    ],
    paymentCurrencies: [
        {
            id: 'USD',
            payment_method_limits: [
                {
                    id: 'card',
                    min: '10.00',
                    max: '7500.00'
                },
                {
                    id: 'ach_bank_account',
                    min: '10.00',
                    max: '25000.00'
                }
            ]
        },
        {
            id: 'EUR',
            payment_method_limits: [
                {
                    id: 'card',
                    min: '10.00',
                    max: '7500.00'
                },
                {
                    id: 'ach_bank_account',
                    min: '10.00',
                    max: '25000.00'
                }
            ]
        }
    ]
};
// -- Helpers ------------------------------------------- //
const baseUrl = CoreHelperUtil.getBlockchainApiUrl();
// -- State --------------------------------------------- //
const state$5 = proxy({
    clientId: null,
    api: new FetchUtil({ baseUrl, clientId: null }),
    supportedChains: { http: [], ws: [] }
});
// -- Controller ---------------------------------------- //
const BlockchainApiController = {
    state: state$5,
    async get(request) {
        const { st, sv } = BlockchainApiController.getSdkProperties();
        const projectId = OptionsController.state.projectId;
        const params = {
            ...(request.params || {}),
            st,
            sv,
            projectId
        };
        return state$5.api.get({
            ...request,
            params
        });
    },
    getSdkProperties() {
        const { sdkType, sdkVersion } = OptionsController.state;
        return {
            st: sdkType || 'unknown',
            sv: sdkVersion || 'unknown'
        };
    },
    async isNetworkSupported(networkId) {
        if (!networkId) {
            return false;
        }
        try {
            if (!state$5.supportedChains.http.length) {
                await BlockchainApiController.getSupportedNetworks();
            }
        }
        catch (e) {
            return false;
        }
        return state$5.supportedChains.http.includes(networkId);
    },
    async getSupportedNetworks() {
        try {
            const supportedChains = await BlockchainApiController.get({
                path: 'v1/supported-chains'
            });
            state$5.supportedChains = supportedChains;
            return supportedChains;
        }
        catch {
            return state$5.supportedChains;
        }
    },
    async fetchIdentity({ address, caipNetworkId }) {
        const isSupported = await BlockchainApiController.isNetworkSupported(caipNetworkId);
        if (!isSupported) {
            return { avatar: '', name: '' };
        }
        const identityCache = StorageUtil.getIdentityFromCacheForAddress(address);
        if (identityCache) {
            return identityCache;
        }
        const result = await BlockchainApiController.get({
            path: `/v1/identity/${address}`,
            params: {
                sender: ChainController.state.activeCaipAddress
                    ? CoreHelperUtil.getPlainAddress(ChainController.state.activeCaipAddress)
                    : undefined
            }
        });
        StorageUtil.updateIdentityCache({
            address,
            identity: result,
            timestamp: Date.now()
        });
        return result;
    },
    async fetchTransactions({ account, cursor, onramp, signal, cache, chainId }) {
        const isSupported = await BlockchainApiController.isNetworkSupported(ChainController.state.activeCaipNetwork?.caipNetworkId);
        if (!isSupported) {
            return { data: [], next: undefined };
        }
        return BlockchainApiController.get({
            path: `/v1/account/${account}/history`,
            params: {
                cursor,
                onramp,
                chainId
            },
            signal,
            cache
        });
    },
    async fetchSwapQuote({ amount, userAddress, from, to, gasPrice }) {
        const isSupported = await BlockchainApiController.isNetworkSupported(ChainController.state.activeCaipNetwork?.caipNetworkId);
        if (!isSupported) {
            return { quotes: [] };
        }
        return BlockchainApiController.get({
            path: `/v1/convert/quotes`,
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                amount,
                userAddress,
                from,
                to,
                gasPrice
            }
        });
    },
    async fetchSwapTokens({ chainId }) {
        const isSupported = await BlockchainApiController.isNetworkSupported(ChainController.state.activeCaipNetwork?.caipNetworkId);
        if (!isSupported) {
            return { tokens: [] };
        }
        return BlockchainApiController.get({
            path: `/v1/convert/tokens`,
            params: { chainId }
        });
    },
    async fetchTokenPrice({ addresses }) {
        const isSupported = await BlockchainApiController.isNetworkSupported(ChainController.state.activeCaipNetwork?.caipNetworkId);
        if (!isSupported) {
            return { fungibles: [] };
        }
        return state$5.api.post({
            path: '/v1/fungible/price',
            body: {
                currency: 'usd',
                addresses,
                projectId: OptionsController.state.projectId
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
    async fetchSwapAllowance({ tokenAddress, userAddress }) {
        const isSupported = await BlockchainApiController.isNetworkSupported(ChainController.state.activeCaipNetwork?.caipNetworkId);
        if (!isSupported) {
            return { allowance: '0' };
        }
        return BlockchainApiController.get({
            path: `/v1/convert/allowance`,
            params: {
                tokenAddress,
                userAddress
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
    async fetchGasPrice({ chainId }) {
        const { st, sv } = BlockchainApiController.getSdkProperties();
        const isSupported = await BlockchainApiController.isNetworkSupported(ChainController.state.activeCaipNetwork?.caipNetworkId);
        if (!isSupported) {
            throw new Error('Network not supported for Gas Price');
        }
        return BlockchainApiController.get({
            path: `/v1/convert/gas-price`,
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                chainId,
                st,
                sv
            }
        });
    },
    async generateSwapCalldata({ amount, from, to, userAddress, disableEstimate }) {
        const isSupported = await BlockchainApiController.isNetworkSupported(ChainController.state.activeCaipNetwork?.caipNetworkId);
        if (!isSupported) {
            throw new Error('Network not supported for Swaps');
        }
        return state$5.api.post({
            path: '/v1/convert/build-transaction',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                amount,
                eip155: {
                    slippage: ConstantsUtil$2.CONVERT_SLIPPAGE_TOLERANCE
                },
                projectId: OptionsController.state.projectId,
                from,
                to,
                userAddress,
                disableEstimate
            }
        });
    },
    async generateApproveCalldata({ from, to, userAddress }) {
        const { st, sv } = BlockchainApiController.getSdkProperties();
        const isSupported = await BlockchainApiController.isNetworkSupported(ChainController.state.activeCaipNetwork?.caipNetworkId);
        if (!isSupported) {
            throw new Error('Network not supported for Swaps');
        }
        return BlockchainApiController.get({
            path: `/v1/convert/build-approve`,
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                userAddress,
                from,
                to,
                st,
                sv
            }
        });
    },
    async getBalance(address, chainId, forceUpdate) {
        const { st, sv } = BlockchainApiController.getSdkProperties();
        const isSupported = await BlockchainApiController.isNetworkSupported(ChainController.state.activeCaipNetwork?.caipNetworkId);
        if (!isSupported) {
            SnackController.showError('Token Balance Unavailable');
            return { balances: [] };
        }
        const caipAddress = `${chainId}:${address}`;
        const cachedBalance = StorageUtil.getBalanceCacheForCaipAddress(caipAddress);
        if (cachedBalance) {
            return cachedBalance;
        }
        const balance = await BlockchainApiController.get({
            path: `/v1/account/${address}/balance`,
            params: {
                currency: 'usd',
                chainId,
                forceUpdate,
                st,
                sv
            }
        });
        StorageUtil.updateBalanceCache({
            caipAddress,
            balance,
            timestamp: Date.now()
        });
        return balance;
    },
    async lookupEnsName(name) {
        const isSupported = await BlockchainApiController.isNetworkSupported(ChainController.state.activeCaipNetwork?.caipNetworkId);
        if (!isSupported) {
            return { addresses: {}, attributes: [] };
        }
        return BlockchainApiController.get({
            path: `/v1/profile/account/${name}`,
            params: { apiVersion: '2' }
        });
    },
    async reverseLookupEnsName({ address }) {
        const isSupported = await BlockchainApiController.isNetworkSupported(ChainController.state.activeCaipNetwork?.caipNetworkId);
        if (!isSupported) {
            return [];
        }
        return BlockchainApiController.get({
            path: `/v1/profile/reverse/${address}`,
            params: {
                sender: AccountController.state.address,
                apiVersion: '2'
            }
        });
    },
    async getEnsNameSuggestions(name) {
        const isSupported = await BlockchainApiController.isNetworkSupported(ChainController.state.activeCaipNetwork?.caipNetworkId);
        if (!isSupported) {
            return { suggestions: [] };
        }
        return BlockchainApiController.get({
            path: `/v1/profile/suggestions/${name}`,
            params: { zone: 'reown.id' }
        });
    },
    async registerEnsName({ coinType, address, message, signature }) {
        const isSupported = await BlockchainApiController.isNetworkSupported(ChainController.state.activeCaipNetwork?.caipNetworkId);
        if (!isSupported) {
            return { success: false };
        }
        return state$5.api.post({
            path: `/v1/profile/account`,
            body: { coin_type: coinType, address, message, signature },
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
    async generateOnRampURL({ destinationWallets, partnerUserId, defaultNetwork, purchaseAmount, paymentAmount }) {
        const isSupported = await BlockchainApiController.isNetworkSupported(ChainController.state.activeCaipNetwork?.caipNetworkId);
        if (!isSupported) {
            return '';
        }
        const response = await state$5.api.post({
            path: `/v1/generators/onrampurl`,
            params: {
                projectId: OptionsController.state.projectId
            },
            body: {
                destinationWallets,
                defaultNetwork,
                partnerUserId,
                defaultExperience: 'buy',
                presetCryptoAmount: purchaseAmount,
                presetFiatAmount: paymentAmount
            }
        });
        return response.url;
    },
    async getOnrampOptions() {
        const isSupported = await BlockchainApiController.isNetworkSupported(ChainController.state.activeCaipNetwork?.caipNetworkId);
        if (!isSupported) {
            return { paymentCurrencies: [], purchaseCurrencies: [] };
        }
        try {
            const response = await BlockchainApiController.get({
                path: `/v1/onramp/options`
            });
            return response;
        }
        catch (e) {
            return DEFAULT_OPTIONS;
        }
    },
    async getOnrampQuote({ purchaseCurrency, paymentCurrency, amount, network }) {
        try {
            const isSupported = await BlockchainApiController.isNetworkSupported(ChainController.state.activeCaipNetwork?.caipNetworkId);
            if (!isSupported) {
                return null;
            }
            const response = await state$5.api.post({
                path: `/v1/onramp/quote`,
                params: {
                    projectId: OptionsController.state.projectId
                },
                body: {
                    purchaseCurrency,
                    paymentCurrency,
                    amount,
                    network
                }
            });
            return response;
        }
        catch (e) {
            // Mocking response as 1:1 until endpoint is ready
            return {
                coinbaseFee: { amount, currency: paymentCurrency.id },
                networkFee: { amount, currency: paymentCurrency.id },
                paymentSubtotal: { amount, currency: paymentCurrency.id },
                paymentTotal: { amount, currency: paymentCurrency.id },
                purchaseAmount: { amount, currency: paymentCurrency.id },
                quoteId: 'mocked-quote-id'
            };
        }
    },
    async getSmartSessions(caipAddress) {
        const isSupported = await BlockchainApiController.isNetworkSupported(ChainController.state.activeCaipNetwork?.caipNetworkId);
        if (!isSupported) {
            return [];
        }
        return BlockchainApiController.get({
            path: `/v1/sessions/${caipAddress}`
        });
    },
    async revokeSmartSession(address, pci, signature) {
        const isSupported = await BlockchainApiController.isNetworkSupported(ChainController.state.activeCaipNetwork?.caipNetworkId);
        if (!isSupported) {
            return { success: false };
        }
        return state$5.api.post({
            path: `/v1/sessions/${address}/revoke`,
            params: {
                projectId: OptionsController.state.projectId
            },
            body: {
                pci,
                signature
            }
        });
    },
    setClientId(clientId) {
        state$5.clientId = clientId;
        state$5.api = new FetchUtil({ baseUrl, clientId });
    }
};

// -- State --------------------------------------------- //
const state$4 = proxy({
    currentTab: 0,
    tokenBalance: [],
    smartAccountDeployed: false,
    addressLabels: new Map(),
    allAccounts: []
});
// -- Controller ---------------------------------------- //
const controller$3 = {
    state: state$4,
    replaceState(newState) {
        if (!newState) {
            return;
        }
        Object.assign(state$4, ref(newState));
    },
    subscribe(callback) {
        return ChainController.subscribeChainProp('accountState', accountState => {
            if (accountState) {
                return callback(accountState);
            }
            return undefined;
        });
    },
    subscribeKey(property, callback, chain) {
        let prev = undefined;
        return ChainController.subscribeChainProp('accountState', accountState => {
            if (accountState) {
                const nextValue = accountState[property];
                if (prev !== nextValue) {
                    prev = nextValue;
                    callback(nextValue);
                }
            }
        }, chain);
    },
    setStatus(status, chain) {
        ChainController.setAccountProp('status', status, chain);
    },
    getCaipAddress(chain) {
        return ChainController.getAccountProp('caipAddress', chain);
    },
    setCaipAddress(caipAddress, chain) {
        const newAddress = caipAddress ? CoreHelperUtil.getPlainAddress(caipAddress) : undefined;
        if (chain === ChainController.state.activeChain) {
            ChainController.state.activeCaipAddress = caipAddress;
        }
        ChainController.setAccountProp('caipAddress', caipAddress, chain);
        ChainController.setAccountProp('address', newAddress, chain);
    },
    setBalance(balance, balanceSymbol, chain) {
        ChainController.setAccountProp('balance', balance, chain);
        ChainController.setAccountProp('balanceSymbol', balanceSymbol, chain);
    },
    setProfileName(profileName, chain) {
        ChainController.setAccountProp('profileName', profileName, chain);
    },
    setProfileImage(profileImage, chain) {
        ChainController.setAccountProp('profileImage', profileImage, chain);
    },
    setUser(user, chain) {
        ChainController.setAccountProp('user', user, chain);
    },
    setAddressExplorerUrl(explorerUrl, chain) {
        ChainController.setAccountProp('addressExplorerUrl', explorerUrl, chain);
    },
    setSmartAccountDeployed(isDeployed, chain) {
        ChainController.setAccountProp('smartAccountDeployed', isDeployed, chain);
    },
    setCurrentTab(currentTab) {
        ChainController.setAccountProp('currentTab', currentTab, ChainController.state.activeChain);
    },
    setTokenBalance(tokenBalance, chain) {
        if (tokenBalance) {
            ChainController.setAccountProp('tokenBalance', tokenBalance, chain);
        }
    },
    setShouldUpdateToAddress(address, chain) {
        ChainController.setAccountProp('shouldUpdateToAddress', address, chain);
    },
    setAllAccounts(accounts, namespace) {
        ChainController.setAccountProp('allAccounts', accounts, namespace);
    },
    addAddressLabel(address, label, chain) {
        const map = ChainController.getAccountProp('addressLabels', chain) || new Map();
        map.set(address, label);
        ChainController.setAccountProp('addressLabels', map, chain);
    },
    removeAddressLabel(address, chain) {
        const map = ChainController.getAccountProp('addressLabels', chain) || new Map();
        map.delete(address);
        ChainController.setAccountProp('addressLabels', map, chain);
    },
    setConnectedWalletInfo(connectedWalletInfo, chain) {
        ChainController.setAccountProp('connectedWalletInfo', connectedWalletInfo, chain, false);
    },
    setPreferredAccountType(preferredAccountType, chain) {
        ChainController.setAccountProp('preferredAccountTypes', {
            ...state$4.preferredAccountTypes,
            [chain]: preferredAccountType
        }, chain);
    },
    setPreferredAccountTypes(preferredAccountTypes) {
        state$4.preferredAccountTypes = preferredAccountTypes;
    },
    setSocialProvider(socialProvider, chain) {
        if (socialProvider) {
            ChainController.setAccountProp('socialProvider', socialProvider, chain);
        }
    },
    setSocialWindow(socialWindow, chain) {
        ChainController.setAccountProp('socialWindow', socialWindow ? ref(socialWindow) : undefined, chain);
    },
    setFarcasterUrl(farcasterUrl, chain) {
        ChainController.setAccountProp('farcasterUrl', farcasterUrl, chain);
    },
    async fetchTokenBalance(onError) {
        state$4.balanceLoading = true;
        const chainId = ChainController.state.activeCaipNetwork?.caipNetworkId;
        const chain = ChainController.state.activeCaipNetwork?.chainNamespace;
        const caipAddress = ChainController.state.activeCaipAddress;
        const address = caipAddress ? CoreHelperUtil.getPlainAddress(caipAddress) : undefined;
        if (state$4.lastRetry &&
            !CoreHelperUtil.isAllowedRetry(state$4.lastRetry, 30 * ConstantsUtil$2.ONE_SEC_MS)) {
            state$4.balanceLoading = false;
            return [];
        }
        try {
            if (address && chainId && chain) {
                const response = await BlockchainApiController.getBalance(address, chainId);
                /*
                 * The 1Inch API includes many low-quality tokens in the balance response,
                 * which appear inconsistently. This filter prevents them from being displayed.
                 */
                const filteredBalances = response.balances.filter(balance => balance.quantity.decimals !== '0');
                AccountController.setTokenBalance(filteredBalances, chain);
                state$4.lastRetry = undefined;
                state$4.balanceLoading = false;
                return filteredBalances;
            }
        }
        catch (error) {
            state$4.lastRetry = Date.now();
            onError?.(error);
            SnackController.showError('Token Balance Unavailable');
        }
        finally {
            state$4.balanceLoading = false;
        }
        return [];
    },
    resetAccount(chain) {
        ChainController.resetAccount(chain);
    }
};
const AccountController = withErrorBoundary(controller$3);

const NetworkUtil = {
    /**
     * Function to handle the network switch.
     * This function has variety of conditions to handle the network switch depending on the connectors or namespace's connection states.
     * @param args.network - The network to switch to.
     * @param args.shouldConfirmSwitch - Whether to confirm the switch. If true, the user will be asked to confirm the switch if necessary.
     * @returns void
     */
    onSwitchNetwork({ network, ignoreSwitchConfirmation = false }) {
        const currentNetwork = ChainController.state.activeCaipNetwork;
        const routerData = RouterController.state.data;
        const isSameNetwork = network.id === currentNetwork?.id;
        if (isSameNetwork) {
            return;
        }
        const isCurrentNamespaceConnected = AccountController.getCaipAddress(ChainController.state.activeChain);
        const isDifferentNamespace = network.chainNamespace !== ChainController.state.activeChain;
        const isNextNamespaceConnected = AccountController.getCaipAddress(network.chainNamespace);
        const connectorId = ConnectorController.getConnectorId(ChainController.state.activeChain);
        /**
         * If the network is supported by the auth connector, we don't need to show switch active chain view.
         * But there are some cases like switching from Ethereum to Bitcoin where Bitcoin is not supported by the auth connector and users should connect with another connector.
         */
        const isConnectedWithAuth = connectorId === ConstantsUtil$3.CONNECTOR_ID.AUTH;
        const isSupportedForAuthConnector = ConstantsUtil$3.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(c => c === network.chainNamespace);
        /**
         * 1. If the ignoreSwitchConfirmation is set to true, we should switch to the network,
         * 2. If user connected with auth connector and the next network is supported by the auth connector,
         * we should switch to the network without confirmation screen.
         */
        if (ignoreSwitchConfirmation || (isConnectedWithAuth && isSupportedForAuthConnector)) {
            RouterController.push('SwitchNetwork', { ...routerData, network });
        }
        else if (
        /**
         * If user switching to a different namespace and next namespace is not connected, we need to show switch active chain view for confirmation first.
         */
        isCurrentNamespaceConnected &&
            isDifferentNamespace &&
            !isNextNamespaceConnected) {
            RouterController.push('SwitchActiveChain', {
                switchToChain: network.chainNamespace,
                navigateTo: 'Connect',
                navigateWithReplace: true,
                network
            });
        }
        else {
            RouterController.push('SwitchNetwork', { ...routerData, network });
        }
    }
};

// -- State --------------------------------------------- //
const state$3 = proxy({
    loading: false,
    loadingNamespaceMap: new Map(),
    open: false,
    shake: false,
    namespace: undefined
});
// -- Controller ---------------------------------------- //
const controller$2 = {
    state: state$3,
    subscribe(callback) {
        return subscribe(state$3, () => callback(state$3));
    },
    subscribeKey(key, callback) {
        return subscribeKey(state$3, key, callback);
    },
    async open(options) {
        const isConnected = AccountController.state.status === 'connected';
        const namespace = options?.namespace;
        const currentNamespace = ChainController.state.activeChain;
        const isSwitchingNamespace = namespace && namespace !== currentNamespace;
        const caipAddress = ChainController.getAccountData(options?.namespace)?.caipAddress;
        if (ConnectionController.state.wcBasic) {
            // No need to add an await here if we are use basic
            ApiController.prefetch({ fetchNetworkImages: false, fetchConnectorImages: false });
        }
        else {
            await ApiController.prefetch({
                fetchConnectorImages: !isConnected,
                fetchFeaturedWallets: !isConnected,
                fetchRecommendedWallets: !isConnected
            });
        }
        ConnectorController.setFilterByNamespace(options?.namespace);
        ModalController.setLoading(true, namespace);
        if (namespace && isSwitchingNamespace) {
            const namespaceNetwork = ChainController.getNetworkData(namespace)?.caipNetwork ||
                ChainController.getRequestedCaipNetworks(namespace)[0];
            if (namespaceNetwork) {
                NetworkUtil.onSwitchNetwork({ network: namespaceNetwork, ignoreSwitchConfirmation: true });
            }
        }
        else {
            const hasNoAdapters = ChainController.state.noAdapters;
            if (OptionsController.state.manualWCControl || (hasNoAdapters && !caipAddress)) {
                if (CoreHelperUtil.isMobile()) {
                    RouterController.reset('AllWallets');
                }
                else {
                    RouterController.reset('ConnectingWalletConnectBasic');
                }
            }
            else if (options?.view) {
                RouterController.reset(options.view, options.data);
            }
            else if (caipAddress) {
                RouterController.reset('Account');
            }
            else {
                RouterController.reset('Connect');
            }
        }
        state$3.open = true;
        PublicStateController.set({ open: true });
        EventsController.sendEvent({
            type: 'track',
            event: 'MODAL_OPEN',
            properties: { connected: Boolean(caipAddress) }
        });
    },
    close() {
        const isEmbeddedEnabled = OptionsController.state.enableEmbedded;
        const isConnected = Boolean(ChainController.state.activeCaipAddress);
        // Only send the event if the modal is open and is about to be closed
        if (state$3.open) {
            EventsController.sendEvent({
                type: 'track',
                event: 'MODAL_CLOSE',
                properties: { connected: isConnected }
            });
        }
        state$3.open = false;
        RouterController.reset('Connect');
        ModalController.clearLoading();
        if (isEmbeddedEnabled) {
            if (isConnected) {
                RouterController.replace('Account');
            }
            else {
                RouterController.push('Connect');
            }
        }
        else {
            PublicStateController.set({ open: false });
        }
        ConnectionController.resetUri();
    },
    setLoading(loading, namespace) {
        if (namespace) {
            state$3.loadingNamespaceMap.set(namespace, loading);
        }
        state$3.loading = loading;
        PublicStateController.set({ loading });
    },
    clearLoading() {
        state$3.loadingNamespaceMap.clear();
        state$3.loading = false;
    },
    shake() {
        if (state$3.shake) {
            return;
        }
        state$3.shake = true;
        setTimeout(() => {
            state$3.shake = false;
        }, 500);
    }
};
// Export the controller wrapped with our error boundary
const ModalController = withErrorBoundary(controller$2);

const USDC_CURRENCY_DEFAULT = {
    id: '2b92315d-eab7-5bef-84fa-089a131333f5',
    name: 'USD Coin',
    symbol: 'USDC',
    networks: [
        {
            name: 'ethereum-mainnet',
            display_name: 'Ethereum',
            chain_id: '1',
            contract_address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
        },
        {
            name: 'polygon-mainnet',
            display_name: 'Polygon',
            chain_id: '137',
            contract_address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
        }
    ]
};
const USD_CURRENCY_DEFAULT = {
    id: 'USD',
    payment_method_limits: [
        {
            id: 'card',
            min: '10.00',
            max: '7500.00'
        },
        {
            id: 'ach_bank_account',
            min: '10.00',
            max: '25000.00'
        }
    ]
};
const defaultState = {
    providers: ONRAMP_PROVIDERS,
    selectedProvider: null,
    error: null,
    purchaseCurrency: USDC_CURRENCY_DEFAULT,
    paymentCurrency: USD_CURRENCY_DEFAULT,
    purchaseCurrencies: [USDC_CURRENCY_DEFAULT],
    paymentCurrencies: [],
    quotesLoading: false
};
// -- State --------------------------------------------- //
const state$2 = proxy(defaultState);
// -- Controller ---------------------------------------- //
const controller$1 = {
    state: state$2,
    subscribe(callback) {
        return subscribe(state$2, () => callback(state$2));
    },
    subscribeKey(key, callback) {
        return subscribeKey(state$2, key, callback);
    },
    setSelectedProvider(provider) {
        if (provider && provider.name === 'meld') {
            const currency = ChainController.state.activeChain === ConstantsUtil$3.CHAIN.SOLANA ? 'SOL' : 'USDC';
            const address = AccountController.state.address ?? '';
            const url = new URL(provider.url);
            url.searchParams.append('publicKey', MELD_PUBLIC_KEY);
            url.searchParams.append('destinationCurrencyCode', currency);
            url.searchParams.append('walletAddress', address);
            url.searchParams.append('externalCustomerId', OptionsController.state.projectId);
            state$2.selectedProvider = { ...provider, url: url.toString() };
        }
        else {
            state$2.selectedProvider = provider;
        }
    },
    setOnrampProviders(providers) {
        if (Array.isArray(providers) && providers.every(item => typeof item === 'string')) {
            const validOnramp = providers;
            const newProviders = ONRAMP_PROVIDERS.filter(provider => validOnramp.includes(provider.name));
            state$2.providers = newProviders;
        }
        else {
            state$2.providers = [];
        }
    },
    setPurchaseCurrency(currency) {
        state$2.purchaseCurrency = currency;
    },
    setPaymentCurrency(currency) {
        state$2.paymentCurrency = currency;
    },
    setPurchaseAmount(amount) {
        OnRampController.state.purchaseAmount = amount;
    },
    setPaymentAmount(amount) {
        OnRampController.state.paymentAmount = amount;
    },
    async getAvailableCurrencies() {
        const options = await BlockchainApiController.getOnrampOptions();
        state$2.purchaseCurrencies = options.purchaseCurrencies;
        state$2.paymentCurrencies = options.paymentCurrencies;
        state$2.paymentCurrency = options.paymentCurrencies[0] || USD_CURRENCY_DEFAULT;
        state$2.purchaseCurrency = options.purchaseCurrencies[0] || USDC_CURRENCY_DEFAULT;
        await ApiController.fetchCurrencyImages(options.paymentCurrencies.map(currency => currency.id));
        await ApiController.fetchTokenImages(options.purchaseCurrencies.map(currency => currency.symbol));
    },
    async getQuote() {
        state$2.quotesLoading = true;
        try {
            const quote = await BlockchainApiController.getOnrampQuote({
                purchaseCurrency: state$2.purchaseCurrency,
                paymentCurrency: state$2.paymentCurrency,
                amount: state$2.paymentAmount?.toString() || '0',
                network: state$2.purchaseCurrency?.symbol
            });
            state$2.quotesLoading = false;
            state$2.purchaseAmount = Number(quote?.purchaseAmount.amount);
            return quote;
        }
        catch (error) {
            state$2.error = error.message;
            state$2.quotesLoading = false;
            return null;
        }
        finally {
            state$2.quotesLoading = false;
        }
    },
    resetState() {
        state$2.selectedProvider = null;
        state$2.error = null;
        state$2.purchaseCurrency = USDC_CURRENCY_DEFAULT;
        state$2.paymentCurrency = USD_CURRENCY_DEFAULT;
        state$2.purchaseCurrencies = [USDC_CURRENCY_DEFAULT];
        state$2.paymentCurrencies = [];
        state$2.paymentAmount = undefined;
        state$2.purchaseAmount = undefined;
        state$2.quotesLoading = false;
    }
};
// Export the controller wrapped with our error boundary
const OnRampController = withErrorBoundary(controller$1);

const SLIP44_MSB = 0x80000000;
const EnsUtil = {
    convertEVMChainIdToCoinType(chainId) {
        if (chainId >= SLIP44_MSB) {
            throw new Error('Invalid chainId');
        }
        return (SLIP44_MSB | chainId) >>> 0;
    }
};

// -- State --------------------------------------------- //
const state$1 = proxy({
    suggestions: [],
    loading: false
});
// -- Controller ---------------------------------------- //
const controller = {
    state: state$1,
    subscribe(callback) {
        return subscribe(state$1, () => callback(state$1));
    },
    subscribeKey(key, callback) {
        return subscribeKey(state$1, key, callback);
    },
    async resolveName(name) {
        try {
            return await BlockchainApiController.lookupEnsName(name);
        }
        catch (e) {
            const error = e;
            throw new Error(error?.reasons?.[0]?.description || 'Error resolving name');
        }
    },
    async isNameRegistered(name) {
        try {
            await BlockchainApiController.lookupEnsName(name);
            return true;
        }
        catch {
            return false;
        }
    },
    async getSuggestions(value) {
        try {
            state$1.loading = true;
            state$1.suggestions = [];
            const response = await BlockchainApiController.getEnsNameSuggestions(value);
            state$1.suggestions =
                response.suggestions.map(suggestion => ({
                    ...suggestion,
                    name: suggestion.name
                })) || [];
            return state$1.suggestions;
        }
        catch (e) {
            const errorMessage = EnsController.parseEnsApiError(e, 'Error fetching name suggestions');
            throw new Error(errorMessage);
        }
        finally {
            state$1.loading = false;
        }
    },
    async getNamesForAddress(address) {
        try {
            const network = ChainController.state.activeCaipNetwork;
            if (!network) {
                return [];
            }
            const cachedEns = StorageUtil.getEnsFromCacheForAddress(address);
            if (cachedEns) {
                return cachedEns;
            }
            const response = await BlockchainApiController.reverseLookupEnsName({ address });
            StorageUtil.updateEnsCache({
                address,
                ens: response,
                timestamp: Date.now()
            });
            return response;
        }
        catch (e) {
            const errorMessage = EnsController.parseEnsApiError(e, 'Error fetching names for address');
            throw new Error(errorMessage);
        }
    },
    async registerName(name) {
        const network = ChainController.state.activeCaipNetwork;
        if (!network) {
            throw new Error('Network not found');
        }
        const address = AccountController.state.address;
        const emailConnector = ConnectorController.getAuthConnector();
        if (!address || !emailConnector) {
            throw new Error('Address or auth connector not found');
        }
        state$1.loading = true;
        try {
            const message = JSON.stringify({
                name,
                attributes: {},
                // Unix timestamp
                timestamp: Math.floor(Date.now() / 1000)
            });
            RouterController.pushTransactionStack({
                onCancel() {
                    RouterController.replace('RegisterAccountName');
                }
            });
            const signature = await ConnectionController.signMessage(message);
            state$1.loading = false;
            const networkId = network.id;
            if (!networkId) {
                throw new Error('Network not found');
            }
            const coinType = EnsUtil.convertEVMChainIdToCoinType(Number(networkId));
            await BlockchainApiController.registerEnsName({
                coinType,
                address: address,
                signature: signature,
                message
            });
            AccountController.setProfileName(name, network.chainNamespace);
            RouterController.replace('RegisterAccountNameSuccess');
        }
        catch (e) {
            const errorMessage = EnsController.parseEnsApiError(e, `Error registering name ${name}`);
            RouterController.replace('RegisterAccountName');
            throw new Error(errorMessage);
        }
        finally {
            state$1.loading = false;
        }
    },
    validateName(name) {
        return /^[a-zA-Z0-9-]{4,}$/u.test(name);
    },
    parseEnsApiError(error, defaultError) {
        const ensError = error;
        return ensError?.reasons?.[0]?.description || defaultError;
    }
};
// Export the controller wrapped with our error boundary
const EnsController = withErrorBoundary(controller);

/**
 * SIWXUtil holds the methods to interact with the SIWX plugin and must be called internally on AppKit.
 */
const SIWXUtil = {
    getSIWX() {
        return OptionsController.state.siwx;
    },
    async initializeIfEnabled() {
        const siwx = OptionsController.state.siwx;
        const caipAddress = ChainController.getActiveCaipAddress();
        if (!(siwx && caipAddress)) {
            return;
        }
        const [namespace, chainId, address] = caipAddress.split(':');
        if (!ChainController.checkIfSupportedNetwork(namespace)) {
            return;
        }
        try {
            const sessions = await siwx.getSessions(`${namespace}:${chainId}`, address);
            if (sessions.length) {
                return;
            }
            await ModalController.open({
                view: 'SIWXSignMessage'
            });
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.error('SIWXUtil:initializeIfEnabled', error);
            EventsController.sendEvent({
                type: 'track',
                event: 'SIWX_AUTH_ERROR',
                properties: this.getSIWXEventProperties()
            });
            // eslint-disable-next-line no-console
            await ConnectionController._getClient()?.disconnect().catch(console.error);
            RouterController.reset('Connect');
            SnackController.showError('A problem occurred while trying initialize authentication');
        }
    },
    async requestSignMessage() {
        const siwx = OptionsController.state.siwx;
        const address = CoreHelperUtil.getPlainAddress(ChainController.getActiveCaipAddress());
        const network = ChainController.getActiveCaipNetwork();
        const client = ConnectionController._getClient();
        if (!siwx) {
            throw new Error('SIWX is not enabled');
        }
        if (!address) {
            throw new Error('No ActiveCaipAddress found');
        }
        if (!network) {
            throw new Error('No ActiveCaipNetwork or client found');
        }
        if (!client) {
            throw new Error('No ConnectionController client found');
        }
        try {
            const siwxMessage = await siwx.createMessage({
                chainId: network.caipNetworkId,
                accountAddress: address
            });
            const message = siwxMessage.toString();
            const connectorId = ConnectorController.getConnectorId(network.chainNamespace);
            if (connectorId === ConstantsUtil$3.CONNECTOR_ID.AUTH) {
                RouterController.pushTransactionStack({});
            }
            const signature = await client.signMessage(message);
            await siwx.addSession({
                data: siwxMessage,
                message,
                signature: signature
            });
            ModalController.close();
            EventsController.sendEvent({
                type: 'track',
                event: 'SIWX_AUTH_SUCCESS',
                properties: this.getSIWXEventProperties()
            });
        }
        catch (error) {
            const properties = this.getSIWXEventProperties();
            if (!ModalController.state.open || RouterController.state.view === 'ApproveTransaction') {
                await ModalController.open({
                    view: 'SIWXSignMessage'
                });
            }
            if (properties.isSmartAccount) {
                SnackController.showError('This application might not support Smart Accounts');
            }
            else {
                SnackController.showError('Signature declined');
            }
            EventsController.sendEvent({
                type: 'track',
                event: 'SIWX_AUTH_ERROR',
                properties
            });
            // eslint-disable-next-line no-console
            console.error('SWIXUtil:requestSignMessage', error);
        }
    },
    async cancelSignMessage() {
        try {
            const siwx = this.getSIWX();
            const isRequired = siwx?.getRequired?.();
            if (isRequired) {
                await ConnectionController.disconnect();
            }
            else {
                ModalController.close();
            }
            RouterController.reset('Connect');
            EventsController.sendEvent({
                event: 'CLICK_CANCEL_SIWX',
                type: 'track',
                properties: this.getSIWXEventProperties()
            });
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.error('SIWXUtil:cancelSignMessage', error);
        }
    },
    async getSessions() {
        const siwx = OptionsController.state.siwx;
        const address = CoreHelperUtil.getPlainAddress(ChainController.getActiveCaipAddress());
        const network = ChainController.getActiveCaipNetwork();
        if (!(siwx && address && network)) {
            return [];
        }
        return siwx.getSessions(network.caipNetworkId, address);
    },
    async isSIWXCloseDisabled() {
        const siwx = this.getSIWX();
        if (siwx) {
            const isApproveSignScreen = RouterController.state.view === 'ApproveTransaction';
            const isSiwxSignMessage = RouterController.state.view === 'SIWXSignMessage';
            if (isApproveSignScreen || isSiwxSignMessage) {
                return siwx.getRequired?.() && (await this.getSessions()).length === 0;
            }
        }
        return false;
    },
    async universalProviderAuthenticate({ universalProvider, chains, methods }) {
        const siwx = SIWXUtil.getSIWX();
        const namespaces = new Set(chains.map(chain => chain.split(':')[0]));
        if (!siwx || namespaces.size !== 1 || !namespaces.has('eip155')) {
            return false;
        }
        // Ignores chainId and account address to get other message data
        const siwxMessage = await siwx.createMessage({
            chainId: ChainController.getActiveCaipNetwork()?.caipNetworkId || '',
            accountAddress: ''
        });
        const result = await universalProvider.authenticate({
            nonce: siwxMessage.nonce,
            domain: siwxMessage.domain,
            uri: siwxMessage.uri,
            exp: siwxMessage.expirationTime,
            iat: siwxMessage.issuedAt,
            nbf: siwxMessage.notBefore,
            requestId: siwxMessage.requestId,
            version: siwxMessage.version,
            resources: siwxMessage.resources,
            statement: siwxMessage.statement,
            chainId: siwxMessage.chainId,
            methods,
            // The first chainId is what is used for universal provider to build the message
            chains: [siwxMessage.chainId, ...chains.filter(chain => chain !== siwxMessage.chainId)]
        });
        SnackController.showLoading('Authenticating...', { autoClose: false });
        AccountController.setConnectedWalletInfo({
            ...result.session.peer.metadata,
            name: result.session.peer.metadata.name,
            icon: result.session.peer.metadata.icons?.[0],
            type: 'WALLET_CONNECT'
        }, Array.from(namespaces)[0]);
        if (result?.auths?.length) {
            const sessions = result.auths.map(cacao => {
                const message = universalProvider.client.formatAuthMessage({
                    request: cacao.p,
                    iss: cacao.p.iss
                });
                return {
                    data: {
                        ...cacao.p,
                        accountAddress: cacao.p.iss.split(':').slice(-1).join(''),
                        chainId: cacao.p.iss.split(':').slice(2, 4).join(':'),
                        uri: cacao.p.aud,
                        version: cacao.p.version || siwxMessage.version,
                        expirationTime: cacao.p.exp,
                        issuedAt: cacao.p.iat,
                        notBefore: cacao.p.nbf
                    },
                    message,
                    signature: cacao.s.s,
                    cacao
                };
            });
            try {
                await siwx.setSessions(sessions);
                EventsController.sendEvent({
                    type: 'track',
                    event: 'SIWX_AUTH_SUCCESS',
                    properties: SIWXUtil.getSIWXEventProperties()
                });
            }
            catch (error) {
                // eslint-disable-next-line no-console
                console.error('SIWX:universalProviderAuth - failed to set sessions', error);
                EventsController.sendEvent({
                    type: 'track',
                    event: 'SIWX_AUTH_ERROR',
                    properties: SIWXUtil.getSIWXEventProperties()
                });
                // eslint-disable-next-line no-console
                await universalProvider.disconnect().catch(console.error);
                throw error;
            }
            finally {
                SnackController.hide();
            }
        }
        return true;
    },
    getSIWXEventProperties() {
        const activeChainNamespace = ChainController.state.activeChain;
        return {
            network: ChainController.state.activeCaipNetwork?.caipNetworkId || '',
            isSmartAccount: AccountController.state.preferredAccountTypes?.[activeChainNamespace] ===
                W3mFrameRpcConstants.ACCOUNT_TYPES.SMART_ACCOUNT
        };
    },
    async clearSessions() {
        const siwx = this.getSIWX();
        if (siwx) {
            await siwx.setSessions([]);
        }
    }
};

var a$2=Object.defineProperty,u$3=(e,s,r)=>s in e?a$2(e,s,{enumerable:true,configurable:true,writable:true,value:r}):e[s]=r,c$4=(e,s,r)=>u$3(e,typeof s!="symbol"?s+"":s,r);let h$3 = class h extends IEvents{constructor(s){super(),this.opts=s,c$4(this,"protocol","wc"),c$4(this,"version",2);}};var p$3=Object.defineProperty,b$4=(e,s,r)=>s in e?p$3(e,s,{enumerable:true,configurable:true,writable:true,value:r}):e[s]=r,v$3=(e,s,r)=>b$4(e,s+"",r);let I$2 = class I extends IEvents{constructor(s,r){super(),this.core=s,this.logger=r,v$3(this,"records",new Map);}};let y$4 = class y{constructor(s,r){this.logger=s,this.core=r;}};let m$2 = class m extends IEvents{constructor(s,r){super(),this.relayer=s,this.logger=r;}};let d$3 = class d extends IEvents{constructor(s){super();}};let f$3 = class f{constructor(s,r,t,q){this.core=s,this.logger=r,this.name=t;}};let P$2 = class P extends IEvents{constructor(s,r){super(),this.relayer=s,this.logger=r;}};let S$4 = class S extends IEvents{constructor(s,r){super(),this.core=s,this.logger=r;}};let M$3 = class M{constructor(s,r,t){this.core=s,this.logger=r,this.store=t;}};let O$2 = class O{constructor(s,r){this.projectId=s,this.logger=r;}};let R$2 = class R{constructor(s,r,t){this.core=s,this.logger=r,this.telemetryEnabled=t;}};var T$1=Object.defineProperty,k$3=(e,s,r)=>s in e?T$1(e,s,{enumerable:true,configurable:true,writable:true,value:r}):e[s]=r,i$3=(e,s,r)=>k$3(e,typeof s!="symbol"?s+"":s,r);let J$1 = class J{constructor(s){this.opts=s,i$3(this,"protocol","wc"),i$3(this,"version",2);}};let V$4 = class V{constructor(s){this.client=s;}};

function isHex$2(value, { strict = true } = {}) {
    if (!value)
        return false;
    if (typeof value !== 'string')
        return false;
    return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith('0x');
}

/**
 * @description Retrieves the size of the value (in bytes).
 *
 * @param value The value (hex or byte array) to retrieve the size of.
 * @returns The size of the value (in bytes).
 */
function size$3(value) {
    if (isHex$2(value, { strict: false }))
        return Math.ceil((value.length - 2) / 2);
    return value.length;
}

const version$2 = '2.23.2';

let errorConfig$2 = {
    getDocsUrl: ({ docsBaseUrl, docsPath = '', docsSlug, }) => docsPath
        ? `${docsBaseUrl ?? 'https://viem.sh'}${docsPath}${docsSlug ? `#${docsSlug}` : ''}`
        : undefined,
    version: `viem@${version$2}`,
};
let BaseError$2 = class BaseError extends Error {
    constructor(shortMessage, args = {}) {
        const details = (() => {
            if (args.cause instanceof BaseError)
                return args.cause.details;
            if (args.cause?.message)
                return args.cause.message;
            return args.details;
        })();
        const docsPath = (() => {
            if (args.cause instanceof BaseError)
                return args.cause.docsPath || args.docsPath;
            return args.docsPath;
        })();
        const docsUrl = errorConfig$2.getDocsUrl?.({ ...args, docsPath });
        const message = [
            shortMessage || 'An error occurred.',
            '',
            ...(args.metaMessages ? [...args.metaMessages, ''] : []),
            ...(docsUrl ? [`Docs: ${docsUrl}`] : []),
            ...(details ? [`Details: ${details}`] : []),
            ...(errorConfig$2.version ? [`Version: ${errorConfig$2.version}`] : []),
        ].join('\n');
        super(message, args.cause ? { cause: args.cause } : undefined);
        Object.defineProperty(this, "details", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "docsPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "metaMessages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "version", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'BaseError'
        });
        this.details = details;
        this.docsPath = docsPath;
        this.metaMessages = args.metaMessages;
        this.name = args.name ?? this.name;
        this.shortMessage = shortMessage;
        this.version = version$2;
    }
    walk(fn) {
        return walk$2(this, fn);
    }
};
function walk$2(err, fn) {
    if (fn?.(err))
        return err;
    if (err &&
        typeof err === 'object' &&
        'cause' in err &&
        err.cause !== undefined)
        return walk$2(err.cause, fn);
    return fn ? null : err;
}

let SizeExceedsPaddingSizeError$2 = class SizeExceedsPaddingSizeError extends BaseError$2 {
    constructor({ size, targetSize, type, }) {
        super(`${type.charAt(0).toUpperCase()}${type
            .slice(1)
            .toLowerCase()} size (${size}) exceeds padding size (${targetSize}).`, { name: 'SizeExceedsPaddingSizeError' });
    }
};

function pad$2(hexOrBytes, { dir, size = 32 } = {}) {
    if (typeof hexOrBytes === 'string')
        return padHex$2(hexOrBytes, { dir, size });
    return padBytes$2(hexOrBytes, { dir, size });
}
function padHex$2(hex_, { dir, size = 32 } = {}) {
    if (size === null)
        return hex_;
    const hex = hex_.replace('0x', '');
    if (hex.length > size * 2)
        throw new SizeExceedsPaddingSizeError$2({
            size: Math.ceil(hex.length / 2),
            targetSize: size,
            type: 'hex',
        });
    return `0x${hex[dir === 'right' ? 'padEnd' : 'padStart'](size * 2, '0')}`;
}
function padBytes$2(bytes, { dir, size = 32 } = {}) {
    if (size === null)
        return bytes;
    if (bytes.length > size)
        throw new SizeExceedsPaddingSizeError$2({
            size: bytes.length,
            targetSize: size,
            type: 'bytes',
        });
    const paddedBytes = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
        const padEnd = dir === 'right';
        paddedBytes[padEnd ? i : size - i - 1] =
            bytes[padEnd ? i : bytes.length - i - 1];
    }
    return paddedBytes;
}

let IntegerOutOfRangeError$1 = class IntegerOutOfRangeError extends BaseError$2 {
    constructor({ max, min, signed, size, value, }) {
        super(`Number "${value}" is not in safe ${size ? `${size * 8}-bit ${signed ? 'signed' : 'unsigned'} ` : ''}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`, { name: 'IntegerOutOfRangeError' });
    }
};
let SizeOverflowError$2 = class SizeOverflowError extends BaseError$2 {
    constructor({ givenSize, maxSize }) {
        super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, { name: 'SizeOverflowError' });
    }
};

function assertSize$2(hexOrBytes, { size }) {
    if (size$3(hexOrBytes) > size)
        throw new SizeOverflowError$2({
            givenSize: size$3(hexOrBytes),
            maxSize: size,
        });
}
/**
 * Decodes a hex value into a bigint.
 *
 * - Docs: https://viem.sh/docs/utilities/fromHex#hextobigint
 *
 * @param hex Hex value to decode.
 * @param opts Options.
 * @returns BigInt value.
 *
 * @example
 * import { hexToBigInt } from 'viem'
 * const data = hexToBigInt('0x1a4', { signed: true })
 * // 420n
 *
 * @example
 * import { hexToBigInt } from 'viem'
 * const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
 * // 420n
 */
function hexToBigInt(hex, opts = {}) {
    const { signed } = opts;
    if (opts.size)
        assertSize$2(hex, { size: opts.size });
    const value = BigInt(hex);
    if (!signed)
        return value;
    const size = (hex.length - 2) / 2;
    const max = (1n << (BigInt(size) * 8n - 1n)) - 1n;
    if (value <= max)
        return value;
    return value - BigInt(`0x${'f'.padStart(size * 2, 'f')}`) - 1n;
}
/**
 * Decodes a hex string into a number.
 *
 * - Docs: https://viem.sh/docs/utilities/fromHex#hextonumber
 *
 * @param hex Hex value to decode.
 * @param opts Options.
 * @returns Number value.
 *
 * @example
 * import { hexToNumber } from 'viem'
 * const data = hexToNumber('0x1a4')
 * // 420
 *
 * @example
 * import { hexToNumber } from 'viem'
 * const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
 * // 420
 */
function hexToNumber(hex, opts = {}) {
    return Number(hexToBigInt(hex, opts));
}

const hexes$2 = /*#__PURE__*/ Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, '0'));
/**
 * Encodes a string, number, bigint, or ByteArray into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex
 * - Example: https://viem.sh/docs/utilities/toHex#usage
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { toHex } from 'viem'
 * const data = toHex('Hello world')
 * // '0x48656c6c6f20776f726c6421'
 *
 * @example
 * import { toHex } from 'viem'
 * const data = toHex(420)
 * // '0x1a4'
 *
 * @example
 * import { toHex } from 'viem'
 * const data = toHex('Hello world', { size: 32 })
 * // '0x48656c6c6f20776f726c64210000000000000000000000000000000000000000'
 */
function toHex$1(value, opts = {}) {
    if (typeof value === 'number' || typeof value === 'bigint')
        return numberToHex$1(value, opts);
    if (typeof value === 'string') {
        return stringToHex$2(value, opts);
    }
    if (typeof value === 'boolean')
        return boolToHex$1(value, opts);
    return bytesToHex$2(value, opts);
}
/**
 * Encodes a boolean into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#booltohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { boolToHex } from 'viem'
 * const data = boolToHex(true)
 * // '0x1'
 *
 * @example
 * import { boolToHex } from 'viem'
 * const data = boolToHex(false)
 * // '0x0'
 *
 * @example
 * import { boolToHex } from 'viem'
 * const data = boolToHex(true, { size: 32 })
 * // '0x0000000000000000000000000000000000000000000000000000000000000001'
 */
function boolToHex$1(value, opts = {}) {
    const hex = `0x${Number(value)}`;
    if (typeof opts.size === 'number') {
        assertSize$2(hex, { size: opts.size });
        return pad$2(hex, { size: opts.size });
    }
    return hex;
}
/**
 * Encodes a bytes array into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#bytestohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { bytesToHex } from 'viem'
 * const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
 * // '0x48656c6c6f20576f726c6421'
 *
 * @example
 * import { bytesToHex } from 'viem'
 * const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]), { size: 32 })
 * // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
 */
function bytesToHex$2(value, opts = {}) {
    let string = '';
    for (let i = 0; i < value.length; i++) {
        string += hexes$2[value[i]];
    }
    const hex = `0x${string}`;
    if (typeof opts.size === 'number') {
        assertSize$2(hex, { size: opts.size });
        return pad$2(hex, { dir: 'right', size: opts.size });
    }
    return hex;
}
/**
 * Encodes a number or bigint into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#numbertohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { numberToHex } from 'viem'
 * const data = numberToHex(420)
 * // '0x1a4'
 *
 * @example
 * import { numberToHex } from 'viem'
 * const data = numberToHex(420, { size: 32 })
 * // '0x00000000000000000000000000000000000000000000000000000000000001a4'
 */
function numberToHex$1(value_, opts = {}) {
    const { signed, size } = opts;
    const value = BigInt(value_);
    let maxValue;
    if (size) {
        if (signed)
            maxValue = (1n << (BigInt(size) * 8n - 1n)) - 1n;
        else
            maxValue = 2n ** (BigInt(size) * 8n) - 1n;
    }
    else if (typeof value_ === 'number') {
        maxValue = BigInt(Number.MAX_SAFE_INTEGER);
    }
    const minValue = typeof maxValue === 'bigint' && signed ? -maxValue - 1n : 0;
    if ((maxValue && value > maxValue) || value < minValue) {
        const suffix = typeof value_ === 'bigint' ? 'n' : '';
        throw new IntegerOutOfRangeError$1({
            max: maxValue ? `${maxValue}${suffix}` : undefined,
            min: `${minValue}${suffix}`,
            signed,
            size,
            value: `${value_}${suffix}`,
        });
    }
    const hex = `0x${(signed && value < 0 ? (1n << BigInt(size * 8)) + BigInt(value) : value).toString(16)}`;
    if (size)
        return pad$2(hex, { size });
    return hex;
}
const encoder$3 = /*#__PURE__*/ new TextEncoder();
/**
 * Encodes a UTF-8 string into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#stringtohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { stringToHex } from 'viem'
 * const data = stringToHex('Hello World!')
 * // '0x48656c6c6f20576f726c6421'
 *
 * @example
 * import { stringToHex } from 'viem'
 * const data = stringToHex('Hello World!', { size: 32 })
 * // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
 */
function stringToHex$2(value_, opts = {}) {
    const value = encoder$3.encode(value_);
    return bytesToHex$2(value, opts);
}

const encoder$2 = /*#__PURE__*/ new TextEncoder();
/**
 * Encodes a UTF-8 string, hex value, bigint, number or boolean to a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes
 * - Example: https://viem.sh/docs/utilities/toBytes#usage
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { toBytes } from 'viem'
 * const data = toBytes('Hello world')
 * // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
 *
 * @example
 * import { toBytes } from 'viem'
 * const data = toBytes(420)
 * // Uint8Array([1, 164])
 *
 * @example
 * import { toBytes } from 'viem'
 * const data = toBytes(420, { size: 4 })
 * // Uint8Array([0, 0, 1, 164])
 */
function toBytes$1(value, opts = {}) {
    if (typeof value === 'number' || typeof value === 'bigint')
        return numberToBytes(value, opts);
    if (typeof value === 'boolean')
        return boolToBytes(value, opts);
    if (isHex$2(value))
        return hexToBytes(value, opts);
    return stringToBytes(value, opts);
}
/**
 * Encodes a boolean into a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes#booltobytes
 *
 * @param value Boolean value to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { boolToBytes } from 'viem'
 * const data = boolToBytes(true)
 * // Uint8Array([1])
 *
 * @example
 * import { boolToBytes } from 'viem'
 * const data = boolToBytes(true, { size: 32 })
 * // Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])
 */
function boolToBytes(value, opts = {}) {
    const bytes = new Uint8Array(1);
    bytes[0] = Number(value);
    if (typeof opts.size === 'number') {
        assertSize$2(bytes, { size: opts.size });
        return pad$2(bytes, { size: opts.size });
    }
    return bytes;
}
// We use very optimized technique to convert hex string to byte array
const charCodeMap = {
    zero: 48,
    nine: 57,
    A: 65,
    F: 70,
    a: 97,
    f: 102,
};
function charCodeToBase16(char) {
    if (char >= charCodeMap.zero && char <= charCodeMap.nine)
        return char - charCodeMap.zero;
    if (char >= charCodeMap.A && char <= charCodeMap.F)
        return char - (charCodeMap.A - 10);
    if (char >= charCodeMap.a && char <= charCodeMap.f)
        return char - (charCodeMap.a - 10);
    return undefined;
}
/**
 * Encodes a hex string into a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes#hextobytes
 *
 * @param hex Hex string to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { hexToBytes } from 'viem'
 * const data = hexToBytes('0x48656c6c6f20776f726c6421')
 * // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
 *
 * @example
 * import { hexToBytes } from 'viem'
 * const data = hexToBytes('0x48656c6c6f20776f726c6421', { size: 32 })
 * // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
 */
function hexToBytes(hex_, opts = {}) {
    let hex = hex_;
    if (opts.size) {
        assertSize$2(hex, { size: opts.size });
        hex = pad$2(hex, { dir: 'right', size: opts.size });
    }
    let hexString = hex.slice(2);
    if (hexString.length % 2)
        hexString = `0${hexString}`;
    const length = hexString.length / 2;
    const bytes = new Uint8Array(length);
    for (let index = 0, j = 0; index < length; index++) {
        const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j++));
        const nibbleRight = charCodeToBase16(hexString.charCodeAt(j++));
        if (nibbleLeft === undefined || nibbleRight === undefined) {
            throw new BaseError$2(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
        }
        bytes[index] = nibbleLeft * 16 + nibbleRight;
    }
    return bytes;
}
/**
 * Encodes a number into a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes#numbertobytes
 *
 * @param value Number to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { numberToBytes } from 'viem'
 * const data = numberToBytes(420)
 * // Uint8Array([1, 164])
 *
 * @example
 * import { numberToBytes } from 'viem'
 * const data = numberToBytes(420, { size: 4 })
 * // Uint8Array([0, 0, 1, 164])
 */
function numberToBytes(value, opts) {
    const hex = numberToHex$1(value, opts);
    return hexToBytes(hex);
}
/**
 * Encodes a UTF-8 string into a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes#stringtobytes
 *
 * @param value String to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { stringToBytes } from 'viem'
 * const data = stringToBytes('Hello world!')
 * // Uint8Array([72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33])
 *
 * @example
 * import { stringToBytes } from 'viem'
 * const data = stringToBytes('Hello world!', { size: 32 })
 * // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
 */
function stringToBytes(value, opts = {}) {
    const bytes = encoder$2.encode(value);
    if (typeof opts.size === 'number') {
        assertSize$2(bytes, { size: opts.size });
        return pad$2(bytes, { dir: 'right', size: opts.size });
    }
    return bytes;
}

/**
 * Internal assertion helpers.
 * @module
 */
/** Asserts something is positive integer. */
function anumber(n) {
    if (!Number.isSafeInteger(n) || n < 0)
        throw new Error('positive integer expected, got ' + n);
}
/** Is number an Uint8Array? Copied from utils for perf. */
function isBytes(a) {
    return a instanceof Uint8Array || (ArrayBuffer.isView(a) && a.constructor.name === 'Uint8Array');
}
/** Asserts something is Uint8Array. */
function abytes(b, ...lengths) {
    if (!isBytes(b))
        throw new Error('Uint8Array expected');
    if (lengths.length > 0 && !lengths.includes(b.length))
        throw new Error('Uint8Array expected of length ' + lengths + ', got length=' + b.length);
}
/** Asserts something is hash */
function ahash(h) {
    if (typeof h !== 'function' || typeof h.create !== 'function')
        throw new Error('Hash should be wrapped by utils.wrapConstructor');
    anumber(h.outputLen);
    anumber(h.blockLen);
}
/** Asserts a hash instance has not been destroyed / finished */
function aexists(instance, checkFinished = true) {
    if (instance.destroyed)
        throw new Error('Hash instance has been destroyed');
    if (checkFinished && instance.finished)
        throw new Error('Hash#digest() has already been called');
}
/** Asserts output is properly-sized byte array */
function aoutput(out, instance) {
    abytes(out);
    const min = instance.outputLen;
    if (out.length < min) {
        throw new Error('digestInto() expects output buffer of length at least ' + min);
    }
}

/**
 * Internal helpers for u64. BigUint64Array is too slow as per 2025, so we implement it using Uint32Array.
 * @todo re-check https://issues.chromium.org/issues/42212588
 * @module
 */
const U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
const _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
    if (le)
        return { h: Number(n & U32_MASK64), l: Number((n >> _32n) & U32_MASK64) };
    return { h: Number((n >> _32n) & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
    let Ah = new Uint32Array(lst.length);
    let Al = new Uint32Array(lst.length);
    for (let i = 0; i < lst.length; i++) {
        const { h, l } = fromBig(lst[i], le);
        [Ah[i], Al[i]] = [h, l];
    }
    return [Ah, Al];
}
// Left rotate for Shift in [1, 32)
const rotlSH = (h, l, s) => (h << s) | (l >>> (32 - s));
const rotlSL = (h, l, s) => (l << s) | (h >>> (32 - s));
// Left rotate for Shift in (32, 64), NOTE: 32 is special case.
const rotlBH = (h, l, s) => (l << (s - 32)) | (h >>> (64 - s));
const rotlBL = (h, l, s) => (h << (s - 32)) | (l >>> (64 - s));

/**
 * Internal webcrypto alias.
 * We prefer WebCrypto aka globalThis.crypto, which exists in node.js 16+.
 * Falls back to Node.js built-in crypto for Node.js <=v14.
 * See utils.ts for details.
 * @module
 */
// @ts-ignore
const crypto$1 = nc$1 && typeof nc$1 === 'object' && 'webcrypto' in nc$1
    ? nc$1.webcrypto
    : nc$1 && typeof nc$1 === 'object' && 'randomBytes' in nc$1
        ? nc$1
        : undefined;

/**
 * Utilities for hex, bytes, CSPRNG.
 * @module
 */
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// We use WebCrypto aka globalThis.crypto, which exists in browsers and node.js 16+.
// node.js versions earlier than v19 don't declare it in global scope.
// For node.js, package.json#exports field mapping rewrites import
// from `crypto` to `cryptoNode`, which imports native module.
// Makes the utils un-importable in browsers without a bundler.
// Once node.js 18 is deprecated (2025-04-30), we can just drop the import.
function u32(arr) {
    return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
// Cast array to view
function createView(arr) {
    return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
/** The rotate right (circular right shift) operation for uint32 */
function rotr(word, shift) {
    return (word << (32 - shift)) | (word >>> shift);
}
/** Is current platform little-endian? Most are. Big-Endian platform: IBM */
const isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([0x11223344]).buffer)[0] === 0x44)();
// The byte swap operation for uint32
function byteSwap(word) {
    return (((word << 24) & 0xff000000) |
        ((word << 8) & 0xff0000) |
        ((word >>> 8) & 0xff00) |
        ((word >>> 24) & 0xff));
}
/** In place byte swap for Uint32Array */
function byteSwap32(arr) {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = byteSwap(arr[i]);
    }
}
/**
 * Convert JS string to byte array.
 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
 */
function utf8ToBytes(str) {
    if (typeof str !== 'string')
        throw new Error('utf8ToBytes expected string, got ' + typeof str);
    return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
/**
 * Normalizes (non-hex) string or Uint8Array to Uint8Array.
 * Warning: when Uint8Array is passed, it would NOT get copied.
 * Keep in mind for future mutable operations.
 */
function toBytes(data) {
    if (typeof data === 'string')
        data = utf8ToBytes(data);
    abytes(data);
    return data;
}
/**
 * Copies several Uint8Arrays into one.
 */
function concatBytes(...arrays) {
    let sum = 0;
    for (let i = 0; i < arrays.length; i++) {
        const a = arrays[i];
        abytes(a);
        sum += a.length;
    }
    const res = new Uint8Array(sum);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
        const a = arrays[i];
        res.set(a, pad);
        pad += a.length;
    }
    return res;
}
/** For runtime check if class implements interface */
class Hash {
    // Safe version that clones internal state
    clone() {
        return this._cloneInto();
    }
}
/** Wraps hash function, creating an interface on top of it */
function wrapConstructor(hashCons) {
    const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
}
/** Cryptographically secure PRNG. Uses internal OS-level `crypto.getRandomValues`. */
function randomBytes(bytesLength = 32) {
    if (crypto$1 && typeof crypto$1.getRandomValues === 'function') {
        return crypto$1.getRandomValues(new Uint8Array(bytesLength));
    }
    // Legacy Node.js compatibility
    if (crypto$1 && typeof crypto$1.randomBytes === 'function') {
        return crypto$1.randomBytes(bytesLength);
    }
    throw new Error('crypto.getRandomValues must be defined');
}

/**
 * SHA3 (keccak) hash function, based on a new "Sponge function" design.
 * Different from older hashes, the internal state is bigger than output size.
 *
 * Check out [FIPS-202](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.202.pdf),
 * [Website](https://keccak.team/keccak.html),
 * [the differences between SHA-3 and Keccak](https://crypto.stackexchange.com/questions/15727/what-are-the-key-differences-between-the-draft-sha-3-standard-and-the-keccak-sub).
 *
 * Check out `sha3-addons` module for cSHAKE, k12, and others.
 * @module
 */
// Various per round constants calculations
const SHA3_PI = [];
const SHA3_ROTL = [];
const _SHA3_IOTA = [];
const _0n = /* @__PURE__ */ BigInt(0);
const _1n = /* @__PURE__ */ BigInt(1);
const _2n = /* @__PURE__ */ BigInt(2);
const _7n = /* @__PURE__ */ BigInt(7);
const _256n = /* @__PURE__ */ BigInt(256);
const _0x71n = /* @__PURE__ */ BigInt(0x71);
for (let round = 0, R = _1n, x = 1, y = 0; round < 24; round++) {
    // Pi
    [x, y] = [y, (2 * x + 3 * y) % 5];
    SHA3_PI.push(2 * (5 * y + x));
    // Rotational
    SHA3_ROTL.push((((round + 1) * (round + 2)) / 2) % 64);
    // Iota
    let t = _0n;
    for (let j = 0; j < 7; j++) {
        R = ((R << _1n) ^ ((R >> _7n) * _0x71n)) % _256n;
        if (R & _2n)
            t ^= _1n << ((_1n << /* @__PURE__ */ BigInt(j)) - _1n);
    }
    _SHA3_IOTA.push(t);
}
const [SHA3_IOTA_H, SHA3_IOTA_L] = /* @__PURE__ */ split(_SHA3_IOTA, true);
// Left rotation (without 0, 32, 64)
const rotlH = (h, l, s) => (s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s));
const rotlL = (h, l, s) => (s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s));
/** `keccakf1600` internal function, additionally allows to adjust round count. */
function keccakP(s, rounds = 24) {
    const B = new Uint32Array(5 * 2);
    // NOTE: all indices are x2 since we store state as u32 instead of u64 (bigints to slow in js)
    for (let round = 24 - rounds; round < 24; round++) {
        // Theta θ
        for (let x = 0; x < 10; x++)
            B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
        for (let x = 0; x < 10; x += 2) {
            const idx1 = (x + 8) % 10;
            const idx0 = (x + 2) % 10;
            const B0 = B[idx0];
            const B1 = B[idx0 + 1];
            const Th = rotlH(B0, B1, 1) ^ B[idx1];
            const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
            for (let y = 0; y < 50; y += 10) {
                s[x + y] ^= Th;
                s[x + y + 1] ^= Tl;
            }
        }
        // Rho (ρ) and Pi (π)
        let curH = s[2];
        let curL = s[3];
        for (let t = 0; t < 24; t++) {
            const shift = SHA3_ROTL[t];
            const Th = rotlH(curH, curL, shift);
            const Tl = rotlL(curH, curL, shift);
            const PI = SHA3_PI[t];
            curH = s[PI];
            curL = s[PI + 1];
            s[PI] = Th;
            s[PI + 1] = Tl;
        }
        // Chi (χ)
        for (let y = 0; y < 50; y += 10) {
            for (let x = 0; x < 10; x++)
                B[x] = s[y + x];
            for (let x = 0; x < 10; x++)
                s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
        }
        // Iota (ι)
        s[0] ^= SHA3_IOTA_H[round];
        s[1] ^= SHA3_IOTA_L[round];
    }
    B.fill(0);
}
/** Keccak sponge function. */
class Keccak extends Hash {
    // NOTE: we accept arguments in bytes instead of bits here.
    constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
        super();
        this.blockLen = blockLen;
        this.suffix = suffix;
        this.outputLen = outputLen;
        this.enableXOF = enableXOF;
        this.rounds = rounds;
        this.pos = 0;
        this.posOut = 0;
        this.finished = false;
        this.destroyed = false;
        // Can be passed from user as dkLen
        anumber(outputLen);
        // 1600 = 5x5 matrix of 64bit.  1600 bits === 200 bytes
        // 0 < blockLen < 200
        if (0 >= this.blockLen || this.blockLen >= 200)
            throw new Error('Sha3 supports only keccak-f1600 function');
        this.state = new Uint8Array(200);
        this.state32 = u32(this.state);
    }
    keccak() {
        if (!isLE)
            byteSwap32(this.state32);
        keccakP(this.state32, this.rounds);
        if (!isLE)
            byteSwap32(this.state32);
        this.posOut = 0;
        this.pos = 0;
    }
    update(data) {
        aexists(this);
        const { blockLen, state } = this;
        data = toBytes(data);
        const len = data.length;
        for (let pos = 0; pos < len;) {
            const take = Math.min(blockLen - this.pos, len - pos);
            for (let i = 0; i < take; i++)
                state[this.pos++] ^= data[pos++];
            if (this.pos === blockLen)
                this.keccak();
        }
        return this;
    }
    finish() {
        if (this.finished)
            return;
        this.finished = true;
        const { state, suffix, pos, blockLen } = this;
        // Do the padding
        state[pos] ^= suffix;
        if ((suffix & 0x80) !== 0 && pos === blockLen - 1)
            this.keccak();
        state[blockLen - 1] ^= 0x80;
        this.keccak();
    }
    writeInto(out) {
        aexists(this, false);
        abytes(out);
        this.finish();
        const bufferOut = this.state;
        const { blockLen } = this;
        for (let pos = 0, len = out.length; pos < len;) {
            if (this.posOut >= blockLen)
                this.keccak();
            const take = Math.min(blockLen - this.posOut, len - pos);
            out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
            this.posOut += take;
            pos += take;
        }
        return out;
    }
    xofInto(out) {
        // Sha3/Keccak usage with XOF is probably mistake, only SHAKE instances can do XOF
        if (!this.enableXOF)
            throw new Error('XOF is not possible for this instance');
        return this.writeInto(out);
    }
    xof(bytes) {
        anumber(bytes);
        return this.xofInto(new Uint8Array(bytes));
    }
    digestInto(out) {
        aoutput(out, this);
        if (this.finished)
            throw new Error('digest() was already called');
        this.writeInto(out);
        this.destroy();
        return out;
    }
    digest() {
        return this.digestInto(new Uint8Array(this.outputLen));
    }
    destroy() {
        this.destroyed = true;
        this.state.fill(0);
    }
    _cloneInto(to) {
        const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
        to || (to = new Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
        to.state32.set(this.state32);
        to.pos = this.pos;
        to.posOut = this.posOut;
        to.finished = this.finished;
        to.rounds = rounds;
        // Suffix can change in cSHAKE
        to.suffix = suffix;
        to.outputLen = outputLen;
        to.enableXOF = enableXOF;
        to.destroyed = this.destroyed;
        return to;
    }
}
const gen = (suffix, blockLen, outputLen) => wrapConstructor(() => new Keccak(blockLen, suffix, outputLen));
/** keccak-256 hash function. Different from SHA3-256. */
const keccak_256 = /* @__PURE__ */ gen(0x01, 136, 256 / 8);

function keccak256(value, to_) {
    const to = to_ || 'hex';
    const bytes = keccak_256(isHex$2(value, { strict: false }) ? toBytes$1(value) : value);
    if (to === 'bytes')
        return bytes;
    return toHex$1(bytes);
}

/**
 * Map with a LRU (Least recently used) policy.
 *
 * @link https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU
 */
let LruMap$1 = class LruMap extends Map {
    constructor(size) {
        super();
        Object.defineProperty(this, "maxSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.maxSize = size;
    }
    get(key) {
        const value = super.get(key);
        if (super.has(key) && value !== undefined) {
            this.delete(key);
            super.set(key, value);
        }
        return value;
    }
    set(key, value) {
        super.set(key, value);
        if (this.maxSize && this.size > this.maxSize) {
            const firstKey = this.keys().next().value;
            if (firstKey)
                this.delete(firstKey);
        }
        return this;
    }
};

const checksumAddressCache = /*#__PURE__*/ new LruMap$1(8192);
function checksumAddress(address_, 
/**
 * Warning: EIP-1191 checksum addresses are generally not backwards compatible with the
 * wider Ethereum ecosystem, meaning it will break when validated against an application/tool
 * that relies on EIP-55 checksum encoding (checksum without chainId).
 *
 * It is highly recommended to not use this feature unless you
 * know what you are doing.
 *
 * See more: https://github.com/ethereum/EIPs/issues/1121
 */
chainId) {
    if (checksumAddressCache.has(`${address_}.${chainId}`))
        return checksumAddressCache.get(`${address_}.${chainId}`);
    const hexAddress = address_.substring(2).toLowerCase();
    const hash = keccak256(stringToBytes(hexAddress), 'bytes');
    const address = (hexAddress).split('');
    for (let i = 0; i < 40; i += 2) {
        if (hash[i >> 1] >> 4 >= 8 && address[i]) {
            address[i] = address[i].toUpperCase();
        }
        if ((hash[i >> 1] & 0x0f) >= 8 && address[i + 1]) {
            address[i + 1] = address[i + 1].toUpperCase();
        }
    }
    const result = `0x${address.join('')}`;
    checksumAddressCache.set(`${address_}.${chainId}`, result);
    return result;
}

/**
 * @description Converts an ECDSA public key to an address.
 *
 * @param publicKey The public key to convert.
 *
 * @returns The address.
 */
function publicKeyToAddress(publicKey) {
    const address = keccak256(`0x${publicKey.substring(4)}`).substring(26);
    return checksumAddress(`0x${address}`);
}

async function recoverPublicKey({ hash, signature, }) {
    const hashHex = isHex$2(hash) ? hash : toHex$1(hash);
    const { secp256k1 } = await import('./secp256k1-DP0W-VK-.js');
    const signature_ = (() => {
        // typeof signature: `Signature`
        if (typeof signature === 'object' && 'r' in signature && 's' in signature) {
            const { r, s, v, yParity } = signature;
            const yParityOrV = Number(yParity ?? v);
            const recoveryBit = toRecoveryBit(yParityOrV);
            return new secp256k1.Signature(hexToBigInt(r), hexToBigInt(s)).addRecoveryBit(recoveryBit);
        }
        // typeof signature: `Hex | ByteArray`
        const signatureHex = isHex$2(signature) ? signature : toHex$1(signature);
        const yParityOrV = hexToNumber(`0x${signatureHex.slice(130)}`);
        const recoveryBit = toRecoveryBit(yParityOrV);
        return secp256k1.Signature.fromCompact(signatureHex.substring(2, 130)).addRecoveryBit(recoveryBit);
    })();
    const publicKey = signature_
        .recoverPublicKey(hashHex.substring(2))
        .toHex(false);
    return `0x${publicKey}`;
}
function toRecoveryBit(yParityOrV) {
    if (yParityOrV === 0 || yParityOrV === 1)
        return yParityOrV;
    if (yParityOrV === 27)
        return 0;
    if (yParityOrV === 28)
        return 1;
    throw new Error('Invalid yParityOrV value');
}

async function recoverAddress({ hash, signature, }) {
    return publicKeyToAddress(await recoverPublicKey({ hash: hash, signature }));
}

const ae$2=":";function Ne$1(t){const[e,n]=t.split(ae$2);return {namespace:e,reference:n}}function ue$2(t,e){return t.includes(":")?[t]:e.chains||[]}var Zo=Object.defineProperty,Yo$1=Object.defineProperties,Go$1=Object.getOwnPropertyDescriptors,Tn$1=Object.getOwnPropertySymbols,Wo$1=Object.prototype.hasOwnProperty,Xo$1=Object.prototype.propertyIsEnumerable,Rn$1=(t,e,n)=>e in t?Zo(t,e,{enumerable:true,configurable:true,writable:true,value:n}):t[e]=n,_n$1=(t,e)=>{for(var n in e||(e={}))Wo$1.call(e,n)&&Rn$1(t,n,e[n]);if(Tn$1)for(var n of Tn$1(e))Xo$1.call(e,n)&&Rn$1(t,n,e[n]);return t},Jo$1=(t,e)=>Yo$1(t,Go$1(e));const $n$1="ReactNative",Y$2={reactNative:"react-native",node:"node",browser:"browser",unknown:"unknown"},jn$1="js";function _e$3(){return typeof process<"u"&&typeof process.versions<"u"&&typeof process.versions.node<"u"}function pt$2(){return !cjsExports$2.getDocument()&&!!cjsExports$2.getNavigator()&&navigator.product===$n$1}function ei$1(){return pt$2()&&typeof global<"u"&&typeof(global==null?void 0:global.Platform)<"u"&&(global==null?void 0:global.Platform.OS)==="android"}function ni$1(){return pt$2()&&typeof global<"u"&&typeof(global==null?void 0:global.Platform)<"u"&&(global==null?void 0:global.Platform.OS)==="ios"}function Tt$2(){return !_e$3()&&!!cjsExports$2.getNavigator()&&!!cjsExports$2.getDocument()}function xt$2(){return pt$2()?Y$2.reactNative:_e$3()?Y$2.node:Tt$2()?Y$2.browser:Y$2.unknown}function ri$1(){var t;try{return pt$2()&&typeof global<"u"&&typeof(global==null?void 0:global.Application)<"u"?(t=global.Application)==null?void 0:t.applicationId:void 0}catch{return}}function Cn$1(t,e){const n=new URLSearchParams(t);for(const r of Object.keys(e).sort())if(e.hasOwnProperty(r)){const o=e[r];o!==void 0&&n.set(r,o);}return n.toString()}function oi$1(t){var e,n;const r=Pn$1();try{return t!=null&&t.url&&r.url&&new URL(t.url).host!==new URL(r.url).host&&(console.warn(`The configured WalletConnect 'metadata.url':${t.url} differs from the actual page url:${r.url}. This is probably unintended and can lead to issues.`),t.url=r.url),(e=t?.icons)!=null&&e.length&&t.icons.length>0&&(t.icons=t.icons.filter(o=>o!=="")),Jo$1(_n$1(_n$1({},r),t),{url:t?.url||r.url,name:t?.name||r.name,description:t?.description||r.description,icons:(n=t?.icons)!=null&&n.length&&t.icons.length>0?t.icons:r.icons})}catch(o){return console.warn("Error populating app metadata",o),t||r}}function Pn$1(){return cjsExports.getWindowMetadata()||{name:"",description:"",url:"",icons:[""]}}function kn$1(){if(xt$2()===Y$2.reactNative&&typeof global<"u"&&typeof(global==null?void 0:global.Platform)<"u"){const{OS:n,Version:r}=global.Platform;return [n,r].join("-")}const t=detect();if(t===null)return "unknown";const e=t.os?t.os.replace(" ","").toLowerCase():"unknown";return t.type==="browser"?[e,t.name,t.version].join("-"):[e,t.version].join("-")}function Vn$1(){var t;const e=xt$2();return e===Y$2.browser?[e,((t=cjsExports$2.getLocation())==null?void 0:t.host)||"unknown"].join(":"):e}function Mn$1(t,e,n){const r=kn$1(),o=Vn$1();return [[t,e].join("-"),[jn$1,n].join("-"),r,o].join("/")}function si$1({protocol:t,version:e,relayUrl:n,sdkVersion:r,auth:o,projectId:i,useOnCloseEvent:s,bundleId:c,packageName:a}){const u=n.split("?"),l=Mn$1(t,e,r),f={auth:o,ua:l,projectId:i,useOnCloseEvent:s,packageName:a||void 0,bundleId:c||void 0},h=Cn$1(u[1]||"",f);return u[0]+"?"+h}function gt$2(t,e){return t.filter(n=>e.includes(n)).length===t.length}function fi$1(t){return Object.fromEntries(t.entries())}function li$1(t){return new Map(Object.entries(t))}function gi$1(t=cjsExports$1.FIVE_MINUTES,e){const n=cjsExports$1.toMiliseconds(t||cjsExports$1.FIVE_MINUTES);let r,o,i,s;return {resolve:c=>{i&&r&&(clearTimeout(i),r(c),s=Promise.resolve(c));},reject:c=>{i&&o&&(clearTimeout(i),o(c));},done:()=>new Promise((c,a)=>{if(s)return c(s);i=setTimeout(()=>{const u=new Error(e);s=Promise.reject(u),a(u);},n),r=c,o=a;})}}function yi$1(t,e,n){return new Promise(async(r,o)=>{const i=setTimeout(()=>o(new Error(n)),e);try{const s=await t;r(s);}catch(s){o(s);}clearTimeout(i);})}function $e$2(t,e){if(typeof e=="string"&&e.startsWith(`${t}:`))return e;if(t.toLowerCase()==="topic"){if(typeof e!="string")throw new Error('Value must be "string" for expirer target type: topic');return `topic:${e}`}else if(t.toLowerCase()==="id"){if(typeof e!="number")throw new Error('Value must be "number" for expirer target type: id');return `id:${e}`}throw new Error(`Unknown expirer target type: ${t}`)}function mi$1(t){return $e$2("topic",t)}function wi$1(t){return $e$2("id",t)}function bi$1(t){const[e,n]=t.split(":"),r={id:void 0,topic:void 0};if(e==="topic"&&typeof n=="string")r.topic=n;else if(e==="id"&&Number.isInteger(Number(n)))r.id=Number(n);else throw new Error(`Invalid target, expected id:number or topic:string, got ${e}:${n}`);return r}function Ei$1(t,e){return cjsExports$1.fromMiliseconds((Date.now())+cjsExports$1.toMiliseconds(t))}function vi$1(t){return Date.now()>=cjsExports$1.toMiliseconds(t)}function xi$1(t,e){return `${t}${e?`:${e}`:""}`}function ot$1(t=[],e=[]){return [...new Set([...t,...e])]}async function Si$1({id:t,topic:e,wcDeepLink:n}){var r;try{if(!n)return;const o=typeof n=="string"?JSON.parse(n):n,i=o?.href;if(typeof i!="string")return;const s=Kn$1(i,t,e),c=xt$2();if(c===Y$2.browser){if(!((r=cjsExports$2.getDocument())!=null&&r.hasFocus())){console.warn("Document does not have focus, skipping deeplink.");return}Fn$1(s);}else c===Y$2.reactNative&&typeof(global==null?void 0:global.Linking)<"u"&&await global.Linking.openURL(s);}catch(o){console.error(o);}}function Kn$1(t,e,n){const r=`requestId=${e}&sessionTopic=${n}`;t.endsWith("/")&&(t=t.slice(0,-1));let o=`${t}`;if(t.startsWith("https://t.me")){const i=t.includes("?")?"&startapp=":"?startapp=";o=`${o}${i}${Yn$1(r,true)}`;}else o=`${o}/wc?${r}`;return o}function Fn$1(t){let e="_self";Zn$1()?e="_top":(zn$1()||t.startsWith("https://")||t.startsWith("http://"))&&(e="_blank"),window.open(t,e,"noreferrer noopener");}async function Oi$1(t,e){let n="";try{if(Tt$2()&&(n=localStorage.getItem(e),n))return n;n=await t.getItem(e);}catch(r){console.error(r);}return n}function Ai$1(t,e){if(!t.includes(e))return null;const n=t.split(/([&,?,=])/),r=n.indexOf(e);return n[r+2]}function Bi$1(){return typeof crypto<"u"&&crypto!=null&&crypto.randomUUID?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/gu,t=>{const e=Math.random()*16|0;return (t==="x"?e:e&3|8).toString(16)})}function Ii$1(){return typeof process<"u"&&process.env.IS_VITEST==="true"}function zn$1(){return typeof window<"u"&&(!!window.TelegramWebviewProxy||!!window.Telegram||!!window.TelegramWebviewProxyProto)}function Zn$1(){try{return window.self!==window.top}catch{return  false}}function Yn$1(t,e=false){const n=Buffer.from(t).toString("base64");return e?n.replace(/[=]/g,""):n}function je$2(t){return Buffer.from(t,"base64").toString("utf-8")}function Ni$1(t){return new Promise(e=>setTimeout(e,t))}function Wt$2(t){if(!Number.isSafeInteger(t)||t<0)throw new Error("positive integer expected, got "+t)}function Ui$1(t){return t instanceof Uint8Array||ArrayBuffer.isView(t)&&t.constructor.name==="Uint8Array"}function Xt$2(t,...e){if(!Ui$1(t))throw new Error("Uint8Array expected");if(e.length>0&&!e.includes(t.length))throw new Error("Uint8Array expected of length "+e+", got length="+t.length)}function Ce$1(t){if(typeof t!="function"||typeof t.create!="function")throw new Error("Hash should be wrapped by utils.wrapConstructor");Wt$2(t.outputLen),Wt$2(t.blockLen);}function Rt$2(t,e=true){if(t.destroyed)throw new Error("Hash instance has been destroyed");if(e&&t.finished)throw new Error("Hash#digest() has already been called")}function Gn$1(t,e){Xt$2(t);const n=e.outputLen;if(t.length<n)throw new Error("digestInto() expects output buffer of length at least "+n)}const le$2=BigInt(2**32-1),Wn$1=BigInt(32);function Ti$1(t,e=false){return e?{h:Number(t&le$2),l:Number(t>>Wn$1&le$2)}:{h:Number(t>>Wn$1&le$2)|0,l:Number(t&le$2)|0}}function Ri$1(t,e=false){let n=new Uint32Array(t.length),r=new Uint32Array(t.length);for(let o=0;o<t.length;o++){const{h:i,l:s}=Ti$1(t[o],e);[n[o],r[o]]=[i,s];}return [n,r]}const _i$1=(t,e,n)=>t<<n|e>>>32-n,$i$1=(t,e,n)=>e<<n|t>>>32-n,Li$1=(t,e,n)=>e<<n-32|t>>>64-n,ji$1=(t,e,n)=>t<<n-32|e>>>64-n,_t$2=typeof globalThis=="object"&&"crypto"in globalThis?globalThis.crypto:void 0;function Ci$1(t){return new Uint32Array(t.buffer,t.byteOffset,Math.floor(t.byteLength/4))}function Pe$1(t){return new DataView(t.buffer,t.byteOffset,t.byteLength)}function ct$1(t,e){return t<<32-e|t>>>e}const Xn$1=new Uint8Array(new Uint32Array([287454020]).buffer)[0]===68;function Pi$1(t){return t<<24&4278190080|t<<8&16711680|t>>>8&65280|t>>>24&255}function Jn$1(t){for(let e=0;e<t.length;e++)t[e]=Pi$1(t[e]);}function ki$1(t){if(typeof t!="string")throw new Error("utf8ToBytes expected string, got "+typeof t);return new Uint8Array(new TextEncoder().encode(t))}function $t$1(t){return typeof t=="string"&&(t=ki$1(t)),Xt$2(t),t}function Vi$1(...t){let e=0;for(let r=0;r<t.length;r++){const o=t[r];Xt$2(o),e+=o.length;}const n=new Uint8Array(e);for(let r=0,o=0;r<t.length;r++){const i=t[r];n.set(i,o),o+=i.length;}return n}let ke$3 = class ke{clone(){return this._cloneInto()}};function Qn$1(t){const e=r=>t().update($t$1(r)).digest(),n=t();return e.outputLen=n.outputLen,e.blockLen=n.blockLen,e.create=()=>t(),e}function Lt$2(t=32){if(_t$2&&typeof _t$2.getRandomValues=="function")return _t$2.getRandomValues(new Uint8Array(t));if(_t$2&&typeof _t$2.randomBytes=="function")return _t$2.randomBytes(t);throw new Error("crypto.getRandomValues must be defined")}const tr$1=[],er$1=[],nr$1=[],Mi$1=BigInt(0),Jt$2=BigInt(1),Di$1=BigInt(2),Hi=BigInt(7),qi$1=BigInt(256),Ki$1=BigInt(113);for(let t=0,e=Jt$2,n=1,r=0;t<24;t++){[n,r]=[r,(2*n+3*r)%5],tr$1.push(2*(5*r+n)),er$1.push((t+1)*(t+2)/2%64);let o=Mi$1;for(let i=0;i<7;i++)e=(e<<Jt$2^(e>>Hi)*Ki$1)%qi$1,e&Di$1&&(o^=Jt$2<<(Jt$2<<BigInt(i))-Jt$2);nr$1.push(o);}const[Fi$1,zi$1]=Ri$1(nr$1,true),rr$1=(t,e,n)=>n>32?Li$1(t,e,n):_i$1(t,e,n),or$1=(t,e,n)=>n>32?ji$1(t,e,n):$i$1(t,e,n);function Zi(t,e=24){const n=new Uint32Array(10);for(let r=24-e;r<24;r++){for(let s=0;s<10;s++)n[s]=t[s]^t[s+10]^t[s+20]^t[s+30]^t[s+40];for(let s=0;s<10;s+=2){const c=(s+8)%10,a=(s+2)%10,u=n[a],l=n[a+1],f=rr$1(u,l,1)^n[c],h=or$1(u,l,1)^n[c+1];for(let y=0;y<50;y+=10)t[s+y]^=f,t[s+y+1]^=h;}let o=t[2],i=t[3];for(let s=0;s<24;s++){const c=er$1[s],a=rr$1(o,i,c),u=or$1(o,i,c),l=tr$1[s];o=t[l],i=t[l+1],t[l]=a,t[l+1]=u;}for(let s=0;s<50;s+=10){for(let c=0;c<10;c++)n[c]=t[s+c];for(let c=0;c<10;c++)t[s+c]^=~n[(c+2)%10]&n[(c+4)%10];}t[0]^=Fi$1[r],t[1]^=zi$1[r];}n.fill(0);}let En$1 = class En extends ke$3{constructor(e,n,r,o=false,i=24){if(super(),this.blockLen=e,this.suffix=n,this.outputLen=r,this.enableXOF=o,this.rounds=i,this.pos=0,this.posOut=0,this.finished=false,this.destroyed=false,Wt$2(r),0>=this.blockLen||this.blockLen>=200)throw new Error("Sha3 supports only keccak-f1600 function");this.state=new Uint8Array(200),this.state32=Ci$1(this.state);}keccak(){Xn$1||Jn$1(this.state32),Zi(this.state32,this.rounds),Xn$1||Jn$1(this.state32),this.posOut=0,this.pos=0;}update(e){Rt$2(this);const{blockLen:n,state:r}=this;e=$t$1(e);const o=e.length;for(let i=0;i<o;){const s=Math.min(n-this.pos,o-i);for(let c=0;c<s;c++)r[this.pos++]^=e[i++];this.pos===n&&this.keccak();}return this}finish(){if(this.finished)return;this.finished=true;const{state:e,suffix:n,pos:r,blockLen:o}=this;e[r]^=n,(n&128)!==0&&r===o-1&&this.keccak(),e[o-1]^=128,this.keccak();}writeInto(e){Rt$2(this,false),Xt$2(e),this.finish();const n=this.state,{blockLen:r}=this;for(let o=0,i=e.length;o<i;){this.posOut>=r&&this.keccak();const s=Math.min(r-this.posOut,i-o);e.set(n.subarray(this.posOut,this.posOut+s),o),this.posOut+=s,o+=s;}return e}xofInto(e){if(!this.enableXOF)throw new Error("XOF is not possible for this instance");return this.writeInto(e)}xof(e){return Wt$2(e),this.xofInto(new Uint8Array(e))}digestInto(e){if(Gn$1(e,this),this.finished)throw new Error("digest() was already called");return this.writeInto(e),this.destroy(),e}digest(){return this.digestInto(new Uint8Array(this.outputLen))}destroy(){this.destroyed=true,this.state.fill(0);}_cloneInto(e){const{blockLen:n,suffix:r,outputLen:o,rounds:i,enableXOF:s}=this;return e||(e=new En(n,r,o,s,i)),e.state32.set(this.state32),e.pos=this.pos,e.posOut=this.posOut,e.finished=this.finished,e.rounds=i,e.suffix=r,e.outputLen=o,e.enableXOF=s,e.destroyed=this.destroyed,e}};const Yi=(t,e,n)=>Qn$1(()=>new En$1(e,t,n)),Gi=Yi(1,136,256/8),Wi="https://rpc.walletconnect.org/v1";function Ve$2(t){const e=`Ethereum Signed Message:
${t.length}`,n=new TextEncoder().encode(e+t);return "0x"+Buffer.from(Gi(n)).toString("hex")}async function ir$1(t,e,n,r,o,i){switch(n.t){case "eip191":return await sr$1(t,e,n.s);case "eip1271":return await cr$1(t,e,n.s,r,o,i);default:throw new Error(`verifySignature failed: Attempted to verify CacaoSignature with unknown type: ${n.t}`)}}async function sr$1(t,e,n){return (await recoverAddress({hash:Ve$2(e),signature:n})).toLowerCase()===t.toLowerCase()}async function cr$1(t,e,n,r,o,i){const s=Ne$1(r);if(!s.namespace||!s.reference)throw new Error(`isValidEip1271Signature failed: chainId must be in CAIP-2 format, received: ${r}`);try{const c="0x1626ba7e",a="0000000000000000000000000000000000000000000000000000000000000040",u="0000000000000000000000000000000000000000000000000000000000000041",l=n.substring(2),f=Ve$2(e).substring(2),h=c+f+a+u+l,y=await fetch(`${i||Wi}/?chainId=${r}&projectId=${o}`,{method:"POST",body:JSON.stringify({id:Xi(),jsonrpc:"2.0",method:"eth_call",params:[{to:t,data:h},"latest"]})}),{result:E}=await y.json();return E?E.slice(0,c.length).toLowerCase()===c.toLowerCase():!1}catch(c){return console.error("isValidEip1271Signature: ",c),false}}function Xi(){return Date.now()+Math.floor(Math.random()*1e3)}function Ji(t){const e=atob(t),n=new Uint8Array(e.length);for(let s=0;s<e.length;s++)n[s]=e.charCodeAt(s);const r=n[0];if(r===0)throw new Error("No signatures found");const o=1+r*64;if(n.length<o)throw new Error("Transaction data too short for claimed signature count");if(n.length<100)throw new Error("Transaction too short");const i=Buffer.from(t,"base64").slice(1,65);return bs58.encode(i)}var Qi=Object.defineProperty,ts$1=Object.defineProperties,es=Object.getOwnPropertyDescriptors,ar$1=Object.getOwnPropertySymbols,ns=Object.prototype.hasOwnProperty,rs=Object.prototype.propertyIsEnumerable,ur$1=(t,e,n)=>e in t?Qi(t,e,{enumerable:true,configurable:true,writable:true,value:n}):t[e]=n,Me$3=(t,e)=>{for(var n in e||(e={}))ns.call(e,n)&&ur$1(t,n,e[n]);if(ar$1)for(var n of ar$1(e))rs.call(e,n)&&ur$1(t,n,e[n]);return t},fr$1=(t,e)=>ts$1(t,es(e));const os="did:pkh:",de$2=t=>t?.split(":"),lr$1=t=>{const e=t&&de$2(t);if(e)return t.includes(os)?e[3]:e[1]},dr$1=t=>{const e=t&&de$2(t);if(e)return e[2]+":"+e[3]},De$2=t=>{const e=t&&de$2(t);if(e)return e.pop()};async function is(t){const{cacao:e,projectId:n}=t,{s:r,p:o}=e,i=hr$1(o,o.iss),s=De$2(o.iss);return await ir$1(s,i,r,dr$1(o.iss),n)}const hr$1=(t,e)=>{const n=`${t.domain} wants you to sign in with your Ethereum account:`,r=De$2(e);if(!t.aud&&!t.uri)throw new Error("Either `aud` or `uri` is required to construct the message");let o=t.statement||void 0;const i=`URI: ${t.aud||t.uri}`,s=`Version: ${t.version}`,c=`Chain ID: ${lr$1(e)}`,a=`Nonce: ${t.nonce}`,u=`Issued At: ${t.iat}`,l=t.exp?`Expiration Time: ${t.exp}`:void 0,f=t.nbf?`Not Before: ${t.nbf}`:void 0,h=t.requestId?`Request ID: ${t.requestId}`:void 0,y=t.resources?`Resources:${t.resources.map(p=>`
- ${p}`).join("")}`:void 0,E=pe$2(t.resources);if(E){const p=yt$2(E);o=Ke$3(o,p);}return [n,r,"",o,"",i,s,c,a,u,l,f,h,y].filter(p=>p!=null).join(`
`)};function mr$1(t){return Buffer.from(JSON.stringify(t)).toString("base64")}function wr$1(t){return JSON.parse(Buffer.from(t,"base64").toString("utf-8"))}function at$1(t){if(!t)throw new Error("No recap provided, value is undefined");if(!t.att)throw new Error("No `att` property found");const e=Object.keys(t.att);if(!(e!=null&&e.length))throw new Error("No resources found in `att` property");e.forEach(n=>{const r=t.att[n];if(Array.isArray(r))throw new Error(`Resource must be an object: ${n}`);if(typeof r!="object")throw new Error(`Resource must be an object: ${n}`);if(!Object.keys(r).length)throw new Error(`Resource object is empty: ${n}`);Object.keys(r).forEach(o=>{const i=r[o];if(!Array.isArray(i))throw new Error(`Ability limits ${o} must be an array of objects, found: ${i}`);if(!i.length)throw new Error(`Value of ${o} is empty array, must be an array with objects`);i.forEach(s=>{if(typeof s!="object")throw new Error(`Ability limits (${o}) must be an array of objects, found: ${s}`)});});});}function br$1(t,e,n,r={}){return n?.sort((o,i)=>o.localeCompare(i)),{att:{[t]:He$2(e,n,r)}}}function He$2(t,e,n={}){e=e?.sort((o,i)=>o.localeCompare(i));const r=e.map(o=>({[`${t}/${o}`]:[n]}));return Object.assign({},...r)}function he$2(t){return at$1(t),`urn:recap:${mr$1(t).replace(/=/g,"")}`}function yt$2(t){const e=wr$1(t.replace("urn:recap:",""));return at$1(e),e}function fs(t,e,n){const r=br$1(t,e,n);return he$2(r)}function qe$2(t){return t&&t.includes("urn:recap:")}function ls(t,e){const n=yt$2(t),r=yt$2(e),o=vr$1(n,r);return he$2(o)}function vr$1(t,e){at$1(t),at$1(e);const n=Object.keys(t.att).concat(Object.keys(e.att)).sort((o,i)=>o.localeCompare(i)),r={att:{}};return n.forEach(o=>{var i,s;Object.keys(((i=t.att)==null?void 0:i[o])||{}).concat(Object.keys(((s=e.att)==null?void 0:s[o])||{})).sort((c,a)=>c.localeCompare(a)).forEach(c=>{var a,u;r.att[o]=fr$1(Me$3({},r.att[o]),{[c]:((a=t.att[o])==null?void 0:a[c])||((u=e.att[o])==null?void 0:u[c])});});}),r}function Ke$3(t="",e){at$1(e);const n="I further authorize the stated URI to perform the following actions on my behalf: ";if(t.includes(n))return t;const r=[];let o=0;Object.keys(e.att).forEach(c=>{const a=Object.keys(e.att[c]).map(f=>({ability:f.split("/")[0],action:f.split("/")[1]}));a.sort((f,h)=>f.action.localeCompare(h.action));const u={};a.forEach(f=>{u[f.ability]||(u[f.ability]=[]),u[f.ability].push(f.action);});const l=Object.keys(u).map(f=>(o++,`(${o}) '${f}': '${u[f].join("', '")}' for '${c}'.`));r.push(l.join(", ").replace(".,","."));});const i=r.join(" "),s=`${n}${i}`;return `${t?t+" ":""}${s}`}function ds(t){var e;const n=yt$2(t);at$1(n);const r=(e=n.att)==null?void 0:e.eip155;return r?Object.keys(r).map(o=>o.split("/")[1]):[]}function hs(t){const e=yt$2(t);at$1(e);const n=[];return Object.values(e.att).forEach(r=>{Object.values(r).forEach(o=>{var i;(i=o?.[0])!=null&&i.chains&&n.push(o[0].chains);});}),[...new Set(n.flat())]}function pe$2(t){if(!t)return;const e=t?.[t.length-1];return qe$2(e)?e:void 0}function Fe$2(t){if(!Number.isSafeInteger(t)||t<0)throw new Error("positive integer expected, got "+t)}function Sr$1(t){return t instanceof Uint8Array||ArrayBuffer.isView(t)&&t.constructor.name==="Uint8Array"}function tt(t,...e){if(!Sr$1(t))throw new Error("Uint8Array expected");if(e.length>0&&!e.includes(t.length))throw new Error("Uint8Array expected of length "+e+", got length="+t.length)}function Or$1(t,e=true){if(t.destroyed)throw new Error("Hash instance has been destroyed");if(e&&t.finished)throw new Error("Hash#digest() has already been called")}function ps(t,e){tt(t);const n=e.outputLen;if(t.length<n)throw new Error("digestInto() expects output buffer of length at least "+n)}function Ar$1(t){if(typeof t!="boolean")throw new Error(`boolean expected, not ${t}`)}const mt$2=t=>new Uint32Array(t.buffer,t.byteOffset,Math.floor(t.byteLength/4)),gs=t=>new DataView(t.buffer,t.byteOffset,t.byteLength),ys=new Uint8Array(new Uint32Array([287454020]).buffer)[0]===68;if(!ys)throw new Error("Non little-endian hardware is not supported");function ms(t){if(typeof t!="string")throw new Error("string expected");return new Uint8Array(new TextEncoder().encode(t))}function ze$2(t){if(typeof t=="string")t=ms(t);else if(Sr$1(t))t=Ze$2(t);else throw new Error("Uint8Array expected, got "+typeof t);return t}function ws(t,e){if(e==null||typeof e!="object")throw new Error("options must be defined");return Object.assign(t,e)}function bs$1(t,e){if(t.length!==e.length)return  false;let n=0;for(let r=0;r<t.length;r++)n|=t[r]^e[r];return n===0}const Es=(t,e)=>{function n(r,...o){if(tt(r),t.nonceLength!==void 0){const l=o[0];if(!l)throw new Error("nonce / iv required");t.varSizeNonce?tt(l):tt(l,t.nonceLength);}const i=t.tagLength;i&&o[1]!==void 0&&tt(o[1]);const s=e(r,...o),c=(l,f)=>{if(f!==void 0){if(l!==2)throw new Error("cipher output not supported");tt(f);}};let a=false;return {encrypt(l,f){if(a)throw new Error("cannot encrypt() twice with same key + nonce");return a=true,tt(l),c(s.encrypt.length,f),s.encrypt(l,f)},decrypt(l,f){if(tt(l),i&&l.length<i)throw new Error("invalid ciphertext length: smaller than tagLength="+i);return c(s.decrypt.length,f),s.decrypt(l,f)}}}return Object.assign(n,t),n};function Br$1(t,e,n=true){if(e===void 0)return new Uint8Array(t);if(e.length!==t)throw new Error("invalid output length, expected "+t+", got: "+e.length);if(n&&!vs$1(e))throw new Error("invalid output, must be aligned");return e}function Ir$1(t,e,n,r){if(typeof t.setBigUint64=="function")return t.setBigUint64(e,n,r);const o=BigInt(32),i=BigInt(4294967295),s=Number(n>>o&i),c=Number(n&i),a=4,u=0;t.setUint32(e+a,s,r),t.setUint32(e+u,c,r);}function vs$1(t){return t.byteOffset%4===0}function Ze$2(t){return Uint8Array.from(t)}function jt$2(...t){for(let e=0;e<t.length;e++)t[e].fill(0);}const Nr$1=t=>Uint8Array.from(t.split("").map(e=>e.charCodeAt(0))),xs$1=Nr$1("expand 16-byte k"),Ss=Nr$1("expand 32-byte k"),Os$1=mt$2(xs$1),As$1=mt$2(Ss);function V$3(t,e){return t<<e|t>>>32-e}function Ye$2(t){return t.byteOffset%4===0}const ge$2=64,Bs=16,Ur$1=2**32-1,Tr$1=new Uint32Array;function Is$1(t,e,n,r,o,i,s,c){const a=o.length,u=new Uint8Array(ge$2),l=mt$2(u),f=Ye$2(o)&&Ye$2(i),h=f?mt$2(o):Tr$1,y=f?mt$2(i):Tr$1;for(let E=0;E<a;s++){if(t(e,n,r,l,s,c),s>=Ur$1)throw new Error("arx: counter overflow");const p=Math.min(ge$2,a-E);if(f&&p===ge$2){const d=E/4;if(E%4!==0)throw new Error("arx: invalid block position");for(let v=0,m;v<Bs;v++)m=d+v,y[m]=h[m]^l[v];E+=ge$2;continue}for(let d=0,v;d<p;d++)v=E+d,i[v]=o[v]^u[d];E+=p;}}function Ns$1(t,e){const{allowShortKeys:n,extendNonceFn:r,counterLength:o,counterRight:i,rounds:s}=ws({allowShortKeys:false,counterLength:8,counterRight:false,rounds:20},e);if(typeof t!="function")throw new Error("core must be a function");return Fe$2(o),Fe$2(s),Ar$1(i),Ar$1(n),(c,a,u,l,f=0)=>{tt(c),tt(a),tt(u);const h=u.length;if(l===void 0&&(l=new Uint8Array(h)),tt(l),Fe$2(f),f<0||f>=Ur$1)throw new Error("arx: counter overflow");if(l.length<h)throw new Error(`arx: output (${l.length}) is shorter than data (${h})`);const y=[];let E=c.length,p,d;if(E===32)y.push(p=Ze$2(c)),d=As$1;else if(E===16&&n)p=new Uint8Array(32),p.set(c),p.set(c,16),d=Os$1,y.push(p);else throw new Error(`arx: invalid 32-byte key, got length=${E}`);Ye$2(a)||y.push(a=Ze$2(a));const v=mt$2(p);if(r){if(a.length!==24)throw new Error("arx: extended nonce must be 24 bytes");r(d,v,mt$2(a.subarray(0,16)),v),a=a.subarray(16);}const m=16-o;if(m!==a.length)throw new Error(`arx: nonce must be ${m} or 16 bytes`);if(m!==12){const N=new Uint8Array(12);N.set(a,i?0:12-a.length),a=N,y.push(a);}const O=mt$2(a);return Is$1(t,d,v,O,u,l,f,s),jt$2(...y),l}}const F$2=(t,e)=>t[e++]&255|(t[e++]&255)<<8;class Us{constructor(e){this.blockLen=16,this.outputLen=16,this.buffer=new Uint8Array(16),this.r=new Uint16Array(10),this.h=new Uint16Array(10),this.pad=new Uint16Array(8),this.pos=0,this.finished=false,e=ze$2(e),tt(e,32);const n=F$2(e,0),r=F$2(e,2),o=F$2(e,4),i=F$2(e,6),s=F$2(e,8),c=F$2(e,10),a=F$2(e,12),u=F$2(e,14);this.r[0]=n&8191,this.r[1]=(n>>>13|r<<3)&8191,this.r[2]=(r>>>10|o<<6)&7939,this.r[3]=(o>>>7|i<<9)&8191,this.r[4]=(i>>>4|s<<12)&255,this.r[5]=s>>>1&8190,this.r[6]=(s>>>14|c<<2)&8191,this.r[7]=(c>>>11|a<<5)&8065,this.r[8]=(a>>>8|u<<8)&8191,this.r[9]=u>>>5&127;for(let l=0;l<8;l++)this.pad[l]=F$2(e,16+2*l);}process(e,n,r=false){const o=r?0:2048,{h:i,r:s}=this,c=s[0],a=s[1],u=s[2],l=s[3],f=s[4],h=s[5],y=s[6],E=s[7],p=s[8],d=s[9],v=F$2(e,n+0),m=F$2(e,n+2),O=F$2(e,n+4),N=F$2(e,n+6),$=F$2(e,n+8),B=F$2(e,n+10),A=F$2(e,n+12),T=F$2(e,n+14);let S=i[0]+(v&8191),L=i[1]+((v>>>13|m<<3)&8191),U=i[2]+((m>>>10|O<<6)&8191),_=i[3]+((O>>>7|N<<9)&8191),j=i[4]+((N>>>4|$<<12)&8191),g=i[5]+($>>>1&8191),w=i[6]+(($>>>14|B<<2)&8191),b=i[7]+((B>>>11|A<<5)&8191),I=i[8]+((A>>>8|T<<8)&8191),R=i[9]+(T>>>5|o),x=0,C=x+S*c+L*(5*d)+U*(5*p)+_*(5*E)+j*(5*y);x=C>>>13,C&=8191,C+=g*(5*h)+w*(5*f)+b*(5*l)+I*(5*u)+R*(5*a),x+=C>>>13,C&=8191;let P=x+S*a+L*c+U*(5*d)+_*(5*p)+j*(5*E);x=P>>>13,P&=8191,P+=g*(5*y)+w*(5*h)+b*(5*f)+I*(5*l)+R*(5*u),x+=P>>>13,P&=8191;let k=x+S*u+L*a+U*c+_*(5*d)+j*(5*p);x=k>>>13,k&=8191,k+=g*(5*E)+w*(5*y)+b*(5*h)+I*(5*f)+R*(5*l),x+=k>>>13,k&=8191;let M=x+S*l+L*u+U*a+_*c+j*(5*d);x=M>>>13,M&=8191,M+=g*(5*p)+w*(5*E)+b*(5*y)+I*(5*h)+R*(5*f),x+=M>>>13,M&=8191;let D=x+S*f+L*l+U*u+_*a+j*c;x=D>>>13,D&=8191,D+=g*(5*d)+w*(5*p)+b*(5*E)+I*(5*y)+R*(5*h),x+=D>>>13,D&=8191;let z=x+S*h+L*f+U*l+_*u+j*a;x=z>>>13,z&=8191,z+=g*c+w*(5*d)+b*(5*p)+I*(5*E)+R*(5*y),x+=z>>>13,z&=8191;let Z=x+S*y+L*h+U*f+_*l+j*u;x=Z>>>13,Z&=8191,Z+=g*a+w*c+b*(5*d)+I*(5*p)+R*(5*E),x+=Z>>>13,Z&=8191;let st=x+S*E+L*y+U*h+_*f+j*l;x=st>>>13,st&=8191,st+=g*u+w*a+b*c+I*(5*d)+R*(5*p),x+=st>>>13,st&=8191;let W=x+S*p+L*E+U*y+_*h+j*f;x=W>>>13,W&=8191,W+=g*l+w*u+b*a+I*c+R*(5*d),x+=W>>>13,W&=8191;let J=x+S*d+L*p+U*E+_*y+j*h;x=J>>>13,J&=8191,J+=g*f+w*l+b*u+I*a+R*c,x+=J>>>13,J&=8191,x=(x<<2)+x|0,x=x+C|0,C=x&8191,x=x>>>13,P+=x,i[0]=C,i[1]=P,i[2]=k,i[3]=M,i[4]=D,i[5]=z,i[6]=Z,i[7]=st,i[8]=W,i[9]=J;}finalize(){const{h:e,pad:n}=this,r=new Uint16Array(10);let o=e[1]>>>13;e[1]&=8191;for(let c=2;c<10;c++)e[c]+=o,o=e[c]>>>13,e[c]&=8191;e[0]+=o*5,o=e[0]>>>13,e[0]&=8191,e[1]+=o,o=e[1]>>>13,e[1]&=8191,e[2]+=o,r[0]=e[0]+5,o=r[0]>>>13,r[0]&=8191;for(let c=1;c<10;c++)r[c]=e[c]+o,o=r[c]>>>13,r[c]&=8191;r[9]-=8192;let i=(o^1)-1;for(let c=0;c<10;c++)r[c]&=i;i=~i;for(let c=0;c<10;c++)e[c]=e[c]&i|r[c];e[0]=(e[0]|e[1]<<13)&65535,e[1]=(e[1]>>>3|e[2]<<10)&65535,e[2]=(e[2]>>>6|e[3]<<7)&65535,e[3]=(e[3]>>>9|e[4]<<4)&65535,e[4]=(e[4]>>>12|e[5]<<1|e[6]<<14)&65535,e[5]=(e[6]>>>2|e[7]<<11)&65535,e[6]=(e[7]>>>5|e[8]<<8)&65535,e[7]=(e[8]>>>8|e[9]<<5)&65535;let s=e[0]+n[0];e[0]=s&65535;for(let c=1;c<8;c++)s=(e[c]+n[c]|0)+(s>>>16)|0,e[c]=s&65535;jt$2(r);}update(e){Or$1(this);const{buffer:n,blockLen:r}=this;e=ze$2(e);const o=e.length;for(let i=0;i<o;){const s=Math.min(r-this.pos,o-i);if(s===r){for(;r<=o-i;i+=r)this.process(e,i);continue}n.set(e.subarray(i,i+s),this.pos),this.pos+=s,i+=s,this.pos===r&&(this.process(n,0,false),this.pos=0);}return this}destroy(){jt$2(this.h,this.r,this.buffer,this.pad);}digestInto(e){Or$1(this),ps(e,this),this.finished=true;const{buffer:n,h:r}=this;let{pos:o}=this;if(o){for(n[o++]=1;o<16;o++)n[o]=0;this.process(n,0,true);}this.finalize();let i=0;for(let s=0;s<8;s++)e[i++]=r[s]>>>0,e[i++]=r[s]>>>8;return e}digest(){const{buffer:e,outputLen:n}=this;this.digestInto(e);const r=e.slice(0,n);return this.destroy(),r}}function Ts$1(t){const e=(r,o)=>t(o).update(ze$2(r)).digest(),n=t(new Uint8Array(32));return e.outputLen=n.outputLen,e.blockLen=n.blockLen,e.create=r=>t(r),e}const Rs=Ts$1(t=>new Us(t));function _s(t,e,n,r,o,i=20){let s=t[0],c=t[1],a=t[2],u=t[3],l=e[0],f=e[1],h=e[2],y=e[3],E=e[4],p=e[5],d=e[6],v=e[7],m=o,O=n[0],N=n[1],$=n[2],B=s,A=c,T=a,S=u,L=l,U=f,_=h,j=y,g=E,w=p,b=d,I=v,R=m,x=O,C=N,P=$;for(let M=0;M<i;M+=2)B=B+L|0,R=V$3(R^B,16),g=g+R|0,L=V$3(L^g,12),B=B+L|0,R=V$3(R^B,8),g=g+R|0,L=V$3(L^g,7),A=A+U|0,x=V$3(x^A,16),w=w+x|0,U=V$3(U^w,12),A=A+U|0,x=V$3(x^A,8),w=w+x|0,U=V$3(U^w,7),T=T+_|0,C=V$3(C^T,16),b=b+C|0,_=V$3(_^b,12),T=T+_|0,C=V$3(C^T,8),b=b+C|0,_=V$3(_^b,7),S=S+j|0,P=V$3(P^S,16),I=I+P|0,j=V$3(j^I,12),S=S+j|0,P=V$3(P^S,8),I=I+P|0,j=V$3(j^I,7),B=B+U|0,P=V$3(P^B,16),b=b+P|0,U=V$3(U^b,12),B=B+U|0,P=V$3(P^B,8),b=b+P|0,U=V$3(U^b,7),A=A+_|0,R=V$3(R^A,16),I=I+R|0,_=V$3(_^I,12),A=A+_|0,R=V$3(R^A,8),I=I+R|0,_=V$3(_^I,7),T=T+j|0,x=V$3(x^T,16),g=g+x|0,j=V$3(j^g,12),T=T+j|0,x=V$3(x^T,8),g=g+x|0,j=V$3(j^g,7),S=S+L|0,C=V$3(C^S,16),w=w+C|0,L=V$3(L^w,12),S=S+L|0,C=V$3(C^S,8),w=w+C|0,L=V$3(L^w,7);let k=0;r[k++]=s+B|0,r[k++]=c+A|0,r[k++]=a+T|0,r[k++]=u+S|0,r[k++]=l+L|0,r[k++]=f+U|0,r[k++]=h+_|0,r[k++]=y+j|0,r[k++]=E+g|0,r[k++]=p+w|0,r[k++]=d+b|0,r[k++]=v+I|0,r[k++]=m+R|0,r[k++]=O+x|0,r[k++]=N+C|0,r[k++]=$+P|0;}const $s=Ns$1(_s,{counterRight:false,counterLength:4,allowShortKeys:false}),Ls$1=new Uint8Array(16),Rr$1=(t,e)=>{t.update(e);const n=e.length%16;n&&t.update(Ls$1.subarray(n));},js=new Uint8Array(32);function _r$1(t,e,n,r,o){const i=t(e,n,js),s=Rs.create(i);o&&Rr$1(s,o),Rr$1(s,r);const c=new Uint8Array(16),a=gs(c);Ir$1(a,0,BigInt(o?o.length:0),true),Ir$1(a,8,BigInt(r.length),true),s.update(c);const u=s.digest();return jt$2(i,c),u}const Cs$1=t=>(e,n,r)=>({encrypt(i,s){const c=i.length;s=Br$1(c+16,s,false),s.set(i);const a=s.subarray(0,-16);t(e,n,a,a,1);const u=_r$1(t,e,n,a,r);return s.set(u,c),jt$2(u),s},decrypt(i,s){s=Br$1(i.length-16,s,false);const c=i.subarray(0,-16),a=i.subarray(-16),u=_r$1(t,e,n,c,r);if(!bs$1(a,u))throw new Error("invalid tag");return s.set(i.subarray(0,-16)),t(e,n,s,s,1),jt$2(u),s}}),$r$1=Es({blockSize:64,nonceLength:12,tagLength:16},Cs$1($s));let Lr$1 = class Lr extends ke$3{constructor(e,n){super(),this.finished=false,this.destroyed=false,Ce$1(e);const r=$t$1(n);if(this.iHash=e.create(),typeof this.iHash.update!="function")throw new Error("Expected instance of class which extends utils.Hash");this.blockLen=this.iHash.blockLen,this.outputLen=this.iHash.outputLen;const o=this.blockLen,i=new Uint8Array(o);i.set(r.length>o?e.create().update(r).digest():r);for(let s=0;s<i.length;s++)i[s]^=54;this.iHash.update(i),this.oHash=e.create();for(let s=0;s<i.length;s++)i[s]^=106;this.oHash.update(i),i.fill(0);}update(e){return Rt$2(this),this.iHash.update(e),this}digestInto(e){Rt$2(this),Xt$2(e,this.outputLen),this.finished=true,this.iHash.digestInto(e),this.oHash.update(e),this.oHash.digestInto(e),this.destroy();}digest(){const e=new Uint8Array(this.oHash.outputLen);return this.digestInto(e),e}_cloneInto(e){e||(e=Object.create(Object.getPrototypeOf(this),{}));const{oHash:n,iHash:r,finished:o,destroyed:i,blockLen:s,outputLen:c}=this;return e=e,e.finished=o,e.destroyed=i,e.blockLen=s,e.outputLen=c,e.oHash=n._cloneInto(e.oHash),e.iHash=r._cloneInto(e.iHash),e}destroy(){this.destroyed=true,this.oHash.destroy(),this.iHash.destroy();}};const ye$2=(t,e,n)=>new Lr$1(t,e).update(n).digest();ye$2.create=(t,e)=>new Lr$1(t,e);function Ps$1(t,e,n){return Ce$1(t),n===void 0&&(n=new Uint8Array(t.outputLen)),ye$2(t,$t$1(n),$t$1(e))}const Ge$3=new Uint8Array([0]),jr$1=new Uint8Array;function ks$1(t,e,n,r=32){if(Ce$1(t),Wt$2(r),r>255*t.outputLen)throw new Error("Length should be <= 255*HashLen");const o=Math.ceil(r/t.outputLen);n===void 0&&(n=jr$1);const i=new Uint8Array(o*t.outputLen),s=ye$2.create(t,e),c=s._cloneInto(),a=new Uint8Array(s.outputLen);for(let u=0;u<o;u++)Ge$3[0]=u+1,c.update(u===0?jr$1:a).update(n).update(Ge$3).digestInto(a),i.set(a,t.outputLen*u),s._cloneInto(c);return s.destroy(),c.destroy(),a.fill(0),Ge$3.fill(0),i.slice(0,r)}const Vs$1=(t,e,n,r,o)=>ks$1(t,Ps$1(t,e,n),r,o);function Ms$1(t,e,n,r){if(typeof t.setBigUint64=="function")return t.setBigUint64(e,n,r);const o=BigInt(32),i=BigInt(4294967295),s=Number(n>>o&i),c=Number(n&i),a=r?4:0,u=r?0:4;t.setUint32(e+a,s,r),t.setUint32(e+u,c,r);}function Ds$1(t,e,n){return t&e^~t&n}function Hs(t,e,n){return t&e^t&n^e&n}let qs$1 = class qs extends ke$3{constructor(e,n,r,o){super(),this.blockLen=e,this.outputLen=n,this.padOffset=r,this.isLE=o,this.finished=false,this.length=0,this.pos=0,this.destroyed=false,this.buffer=new Uint8Array(e),this.view=Pe$1(this.buffer);}update(e){Rt$2(this);const{view:n,buffer:r,blockLen:o}=this;e=$t$1(e);const i=e.length;for(let s=0;s<i;){const c=Math.min(o-this.pos,i-s);if(c===o){const a=Pe$1(e);for(;o<=i-s;s+=o)this.process(a,s);continue}r.set(e.subarray(s,s+c),this.pos),this.pos+=c,s+=c,this.pos===o&&(this.process(n,0),this.pos=0);}return this.length+=e.length,this.roundClean(),this}digestInto(e){Rt$2(this),Gn$1(e,this),this.finished=true;const{buffer:n,view:r,blockLen:o,isLE:i}=this;let{pos:s}=this;n[s++]=128,this.buffer.subarray(s).fill(0),this.padOffset>o-s&&(this.process(r,0),s=0);for(let f=s;f<o;f++)n[f]=0;Ms$1(r,o-8,BigInt(this.length*8),i),this.process(r,0);const c=Pe$1(e),a=this.outputLen;if(a%4)throw new Error("_sha2: outputLen should be aligned to 32bit");const u=a/4,l=this.get();if(u>l.length)throw new Error("_sha2: outputLen bigger than state");for(let f=0;f<u;f++)c.setUint32(4*f,l[f],i);}digest(){const{buffer:e,outputLen:n}=this;this.digestInto(e);const r=e.slice(0,n);return this.destroy(),r}_cloneInto(e){e||(e=new this.constructor),e.set(...this.get());const{blockLen:n,buffer:r,length:o,finished:i,destroyed:s,pos:c}=this;return e.length=o,e.pos=c,e.finished=i,e.destroyed=s,o%n&&e.buffer.set(r),e}};const Ks=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),wt$2=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),bt$1=new Uint32Array(64);class Fs extends qs$1{constructor(){super(64,32,8,false),this.A=wt$2[0]|0,this.B=wt$2[1]|0,this.C=wt$2[2]|0,this.D=wt$2[3]|0,this.E=wt$2[4]|0,this.F=wt$2[5]|0,this.G=wt$2[6]|0,this.H=wt$2[7]|0;}get(){const{A:e,B:n,C:r,D:o,E:i,F:s,G:c,H:a}=this;return [e,n,r,o,i,s,c,a]}set(e,n,r,o,i,s,c,a){this.A=e|0,this.B=n|0,this.C=r|0,this.D=o|0,this.E=i|0,this.F=s|0,this.G=c|0,this.H=a|0;}process(e,n){for(let f=0;f<16;f++,n+=4)bt$1[f]=e.getUint32(n,false);for(let f=16;f<64;f++){const h=bt$1[f-15],y=bt$1[f-2],E=ct$1(h,7)^ct$1(h,18)^h>>>3,p=ct$1(y,17)^ct$1(y,19)^y>>>10;bt$1[f]=p+bt$1[f-7]+E+bt$1[f-16]|0;}let{A:r,B:o,C:i,D:s,E:c,F:a,G:u,H:l}=this;for(let f=0;f<64;f++){const h=ct$1(c,6)^ct$1(c,11)^ct$1(c,25),y=l+h+Ds$1(c,a,u)+Ks[f]+bt$1[f]|0,p=(ct$1(r,2)^ct$1(r,13)^ct$1(r,22))+Hs(r,o,i)|0;l=u,u=a,a=c,c=s+y|0,s=i,i=o,o=r,r=y+p|0;}r=r+this.A|0,o=o+this.B|0,i=i+this.C|0,s=s+this.D|0,c=c+this.E|0,a=a+this.F|0,u=u+this.G|0,l=l+this.H|0,this.set(r,o,i,s,c,a,u,l);}roundClean(){bt$1.fill(0);}destroy(){this.set(0,0,0,0,0,0,0,0),this.buffer.fill(0);}}const Qt$2=Qn$1(()=>new Fs);/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */const me$2=BigInt(0),we$2=BigInt(1),zs=BigInt(2);function St$3(t){return t instanceof Uint8Array||ArrayBuffer.isView(t)&&t.constructor.name==="Uint8Array"}function te$1(t){if(!St$3(t))throw new Error("Uint8Array expected")}function Ct$1(t,e){if(typeof e!="boolean")throw new Error(t+" boolean expected, got "+e)}const Zs$1=Array.from({length:256},(t,e)=>e.toString(16).padStart(2,"0"));function Pt$2(t){te$1(t);let e="";for(let n=0;n<t.length;n++)e+=Zs$1[t[n]];return e}function kt$2(t){const e=t.toString(16);return e.length&1?"0"+e:e}function We$2(t){if(typeof t!="string")throw new Error("hex string expected, got "+typeof t);return t===""?me$2:BigInt("0x"+t)}const ut$2={_0:48,_9:57,A:65,F:70,a:97,f:102};function Cr$1(t){if(t>=ut$2._0&&t<=ut$2._9)return t-ut$2._0;if(t>=ut$2.A&&t<=ut$2.F)return t-(ut$2.A-10);if(t>=ut$2.a&&t<=ut$2.f)return t-(ut$2.a-10)}function Vt$2(t){if(typeof t!="string")throw new Error("hex string expected, got "+typeof t);const e=t.length,n=e/2;if(e%2)throw new Error("hex string expected, got unpadded hex of length "+e);const r=new Uint8Array(n);for(let o=0,i=0;o<n;o++,i+=2){const s=Cr$1(t.charCodeAt(i)),c=Cr$1(t.charCodeAt(i+1));if(s===void 0||c===void 0){const a=t[i]+t[i+1];throw new Error('hex string expected, got non-hex character "'+a+'" at index '+i)}r[o]=s*16+c;}return r}function Ot$1(t){return We$2(Pt$2(t))}function ee$1(t){return te$1(t),We$2(Pt$2(Uint8Array.from(t).reverse()))}function Mt$2(t,e){return Vt$2(t.toString(16).padStart(e*2,"0"))}function be$2(t,e){return Mt$2(t,e).reverse()}function Ys(t){return Vt$2(kt$2(t))}function et$1(t,e,n){let r;if(typeof e=="string")try{r=Vt$2(e);}catch(i){throw new Error(t+" must be hex string or Uint8Array, cause: "+i)}else if(St$3(e))r=Uint8Array.from(e);else throw new Error(t+" must be hex string or Uint8Array");const o=r.length;if(typeof n=="number"&&o!==n)throw new Error(t+" of length "+n+" expected, got "+o);return r}function ne$2(...t){let e=0;for(let r=0;r<t.length;r++){const o=t[r];te$1(o),e+=o.length;}const n=new Uint8Array(e);for(let r=0,o=0;r<t.length;r++){const i=t[r];n.set(i,o),o+=i.length;}return n}function Gs(t,e){if(t.length!==e.length)return  false;let n=0;for(let r=0;r<t.length;r++)n|=t[r]^e[r];return n===0}function Ws(t){if(typeof t!="string")throw new Error("string expected");return new Uint8Array(new TextEncoder().encode(t))}const Xe$2=t=>typeof t=="bigint"&&me$2<=t;function Ee$3(t,e,n){return Xe$2(t)&&Xe$2(e)&&Xe$2(n)&&e<=t&&t<n}function ft$2(t,e,n,r){if(!Ee$3(e,n,r))throw new Error("expected valid "+t+": "+n+" <= n < "+r+", got "+e)}function Pr$1(t){let e;for(e=0;t>me$2;t>>=we$2,e+=1);return e}function Xs(t,e){return t>>BigInt(e)&we$2}function Js(t,e,n){return t|(n?we$2:me$2)<<BigInt(e)}const Je$2=t=>(zs<<BigInt(t-1))-we$2,Qe$2=t=>new Uint8Array(t),kr$1=t=>Uint8Array.from(t);function Vr$1(t,e,n){if(typeof t!="number"||t<2)throw new Error("hashLen must be a number");if(typeof e!="number"||e<2)throw new Error("qByteLen must be a number");if(typeof n!="function")throw new Error("hmacFn must be a function");let r=Qe$2(t),o=Qe$2(t),i=0;const s=()=>{r.fill(1),o.fill(0),i=0;},c=(...f)=>n(o,r,...f),a=(f=Qe$2())=>{o=c(kr$1([0]),f),r=c(),f.length!==0&&(o=c(kr$1([1]),f),r=c());},u=()=>{if(i++>=1e3)throw new Error("drbg: tried 1000 values");let f=0;const h=[];for(;f<e;){r=c();const y=r.slice();h.push(y),f+=r.length;}return ne$2(...h)};return (f,h)=>{s(),a(f);let y;for(;!(y=h(u()));)a();return s(),y}}const Qs={bigint:t=>typeof t=="bigint",function:t=>typeof t=="function",boolean:t=>typeof t=="boolean",string:t=>typeof t=="string",stringOrUint8Array:t=>typeof t=="string"||St$3(t),isSafeInteger:t=>Number.isSafeInteger(t),array:t=>Array.isArray(t),field:(t,e)=>e.Fp.isValid(t),hash:t=>typeof t=="function"&&Number.isSafeInteger(t.outputLen)};function Dt$1(t,e,n={}){const r=(o,i,s)=>{const c=Qs[i];if(typeof c!="function")throw new Error("invalid validator function");const a=t[o];if(!(s&&a===void 0)&&!c(a,t))throw new Error("param "+String(o)+" is invalid. Expected "+i+", got "+a)};for(const[o,i]of Object.entries(e))r(o,i,false);for(const[o,i]of Object.entries(n))r(o,i,true);return t}const tc=()=>{throw new Error("not implemented")};function tn$1(t){const e=new WeakMap;return (n,...r)=>{const o=e.get(n);if(o!==void 0)return o;const i=t(n,...r);return e.set(n,i),i}}var ec=Object.freeze({__proto__:null,isBytes:St$3,abytes:te$1,abool:Ct$1,bytesToHex:Pt$2,numberToHexUnpadded:kt$2,hexToNumber:We$2,hexToBytes:Vt$2,bytesToNumberBE:Ot$1,bytesToNumberLE:ee$1,numberToBytesBE:Mt$2,numberToBytesLE:be$2,numberToVarBytesBE:Ys,ensureBytes:et$1,concatBytes:ne$2,equalBytes:Gs,utf8ToBytes:Ws,inRange:Ee$3,aInRange:ft$2,bitLen:Pr$1,bitGet:Xs,bitSet:Js,bitMask:Je$2,createHmacDrbg:Vr$1,validateObject:Dt$1,notImplemented:tc,memoized:tn$1});const q$1=BigInt(0),H$2=BigInt(1),At$1=BigInt(2),nc=BigInt(3),en=BigInt(4),Mr$1=BigInt(5),Dr$1=BigInt(8);function X$1(t,e){const n=t%e;return n>=q$1?n:e+n}function Hr$1(t,e,n){if(e<q$1)throw new Error("invalid exponent, negatives unsupported");if(n<=q$1)throw new Error("invalid modulus");if(n===H$2)return q$1;let r=H$2;for(;e>q$1;)e&H$2&&(r=r*t%n),t=t*t%n,e>>=H$2;return r}function it$1(t,e,n){let r=t;for(;e-- >q$1;)r*=r,r%=n;return r}function nn$1(t,e){if(t===q$1)throw new Error("invert: expected non-zero number");if(e<=q$1)throw new Error("invert: expected positive modulus, got "+e);let n=X$1(t,e),r=e,o=q$1,i=H$2;for(;n!==q$1;){const c=r/n,a=r%n,u=o-i*c;r=n,n=a,o=i,i=u;}if(r!==H$2)throw new Error("invert: does not exist");return X$1(o,e)}function rc(t){const e=(t-H$2)/At$1;let n,r,o;for(n=t-H$2,r=0;n%At$1===q$1;n/=At$1,r++);for(o=At$1;o<t&&Hr$1(o,e,t)!==t-H$2;o++)if(o>1e3)throw new Error("Cannot find square root: likely non-prime P");if(r===1){const s=(t+H$2)/en;return function(a,u){const l=a.pow(u,s);if(!a.eql(a.sqr(l),u))throw new Error("Cannot find square root");return l}}const i=(n+H$2)/At$1;return function(c,a){if(c.pow(a,e)===c.neg(c.ONE))throw new Error("Cannot find square root");let u=r,l=c.pow(c.mul(c.ONE,o),n),f=c.pow(a,i),h=c.pow(a,n);for(;!c.eql(h,c.ONE);){if(c.eql(h,c.ZERO))return c.ZERO;let y=1;for(let p=c.sqr(h);y<u&&!c.eql(p,c.ONE);y++)p=c.sqr(p);const E=c.pow(l,H$2<<BigInt(u-y-1));l=c.sqr(E),f=c.mul(f,E),h=c.mul(h,l),u=y;}return f}}function oc(t){if(t%en===nc){const e=(t+H$2)/en;return function(r,o){const i=r.pow(o,e);if(!r.eql(r.sqr(i),o))throw new Error("Cannot find square root");return i}}if(t%Dr$1===Mr$1){const e=(t-Mr$1)/Dr$1;return function(r,o){const i=r.mul(o,At$1),s=r.pow(i,e),c=r.mul(o,s),a=r.mul(r.mul(c,At$1),s),u=r.mul(c,r.sub(a,r.ONE));if(!r.eql(r.sqr(u),o))throw new Error("Cannot find square root");return u}}return rc(t)}const ic=["create","isValid","is0","neg","inv","sqrt","sqr","eql","add","sub","mul","pow","div","addN","subN","mulN","sqrN"];function sc(t){const e={ORDER:"bigint",MASK:"bigint",BYTES:"isSafeInteger",BITS:"isSafeInteger"},n=ic.reduce((r,o)=>(r[o]="function",r),e);return Dt$1(t,n)}function cc(t,e,n){if(n<q$1)throw new Error("invalid exponent, negatives unsupported");if(n===q$1)return t.ONE;if(n===H$2)return e;let r=t.ONE,o=e;for(;n>q$1;)n&H$2&&(r=t.mul(r,o)),o=t.sqr(o),n>>=H$2;return r}function ac(t,e){const n=new Array(e.length),r=e.reduce((i,s,c)=>t.is0(s)?i:(n[c]=i,t.mul(i,s)),t.ONE),o=t.inv(r);return e.reduceRight((i,s,c)=>t.is0(s)?i:(n[c]=t.mul(i,n[c]),t.mul(i,s)),o),n}function qr$1(t,e){const n=e!==void 0?e:t.toString(2).length,r=Math.ceil(n/8);return {nBitLength:n,nByteLength:r}}function Kr$1(t,e,n=false,r={}){if(t<=q$1)throw new Error("invalid field: expected ORDER > 0, got "+t);const{nBitLength:o,nByteLength:i}=qr$1(t,e);if(i>2048)throw new Error("invalid field: expected ORDER of <= 2048 bytes");let s;const c=Object.freeze({ORDER:t,isLE:n,BITS:o,BYTES:i,MASK:Je$2(o),ZERO:q$1,ONE:H$2,create:a=>X$1(a,t),isValid:a=>{if(typeof a!="bigint")throw new Error("invalid field element: expected bigint, got "+typeof a);return q$1<=a&&a<t},is0:a=>a===q$1,isOdd:a=>(a&H$2)===H$2,neg:a=>X$1(-a,t),eql:(a,u)=>a===u,sqr:a=>X$1(a*a,t),add:(a,u)=>X$1(a+u,t),sub:(a,u)=>X$1(a-u,t),mul:(a,u)=>X$1(a*u,t),pow:(a,u)=>cc(c,a,u),div:(a,u)=>X$1(a*nn$1(u,t),t),sqrN:a=>a*a,addN:(a,u)=>a+u,subN:(a,u)=>a-u,mulN:(a,u)=>a*u,inv:a=>nn$1(a,t),sqrt:r.sqrt||(a=>(s||(s=oc(t)),s(c,a))),invertBatch:a=>ac(c,a),cmov:(a,u,l)=>l?u:a,toBytes:a=>n?be$2(a,i):Mt$2(a,i),fromBytes:a=>{if(a.length!==i)throw new Error("Field.fromBytes: expected "+i+" bytes, got "+a.length);return n?ee$1(a):Ot$1(a)}});return Object.freeze(c)}function Fr$1(t){if(typeof t!="bigint")throw new Error("field order must be bigint");const e=t.toString(2).length;return Math.ceil(e/8)}function zr$1(t){const e=Fr$1(t);return e+Math.ceil(e/2)}function uc(t,e,n=false){const r=t.length,o=Fr$1(e),i=zr$1(e);if(r<16||r<i||r>1024)throw new Error("expected "+i+"-1024 bytes of input, got "+r);const s=n?ee$1(t):Ot$1(t),c=X$1(s,e-H$2)+H$2;return n?be$2(c,o):Mt$2(c,o)}const Zr$1=BigInt(0),ve$1=BigInt(1);function rn$1(t,e){const n=e.negate();return t?n:e}function Yr$1(t,e){if(!Number.isSafeInteger(t)||t<=0||t>e)throw new Error("invalid window size, expected [1.."+e+"], got W="+t)}function on$1(t,e){Yr$1(t,e);const n=Math.ceil(e/t)+1,r=2**(t-1);return {windows:n,windowSize:r}}function fc(t,e){if(!Array.isArray(t))throw new Error("array expected");t.forEach((n,r)=>{if(!(n instanceof e))throw new Error("invalid point at index "+r)});}function lc(t,e){if(!Array.isArray(t))throw new Error("array of scalars expected");t.forEach((n,r)=>{if(!e.isValid(n))throw new Error("invalid scalar at index "+r)});}const sn$1=new WeakMap,Gr$1=new WeakMap;function cn$1(t){return Gr$1.get(t)||1}function dc(t,e){return {constTimeNegate:rn$1,hasPrecomputes(n){return cn$1(n)!==1},unsafeLadder(n,r,o=t.ZERO){let i=n;for(;r>Zr$1;)r&ve$1&&(o=o.add(i)),i=i.double(),r>>=ve$1;return o},precomputeWindow(n,r){const{windows:o,windowSize:i}=on$1(r,e),s=[];let c=n,a=c;for(let u=0;u<o;u++){a=c,s.push(a);for(let l=1;l<i;l++)a=a.add(c),s.push(a);c=a.double();}return s},wNAF(n,r,o){const{windows:i,windowSize:s}=on$1(n,e);let c=t.ZERO,a=t.BASE;const u=BigInt(2**n-1),l=2**n,f=BigInt(n);for(let h=0;h<i;h++){const y=h*s;let E=Number(o&u);o>>=f,E>s&&(E-=l,o+=ve$1);const p=y,d=y+Math.abs(E)-1,v=h%2!==0,m=E<0;E===0?a=a.add(rn$1(v,r[p])):c=c.add(rn$1(m,r[d]));}return {p:c,f:a}},wNAFUnsafe(n,r,o,i=t.ZERO){const{windows:s,windowSize:c}=on$1(n,e),a=BigInt(2**n-1),u=2**n,l=BigInt(n);for(let f=0;f<s;f++){const h=f*c;if(o===Zr$1)break;let y=Number(o&a);if(o>>=l,y>c&&(y-=u,o+=ve$1),y===0)continue;let E=r[h+Math.abs(y)-1];y<0&&(E=E.negate()),i=i.add(E);}return i},getPrecomputes(n,r,o){let i=sn$1.get(r);return i||(i=this.precomputeWindow(r,n),n!==1&&sn$1.set(r,o(i))),i},wNAFCached(n,r,o){const i=cn$1(n);return this.wNAF(i,this.getPrecomputes(i,n,o),r)},wNAFCachedUnsafe(n,r,o,i){const s=cn$1(n);return s===1?this.unsafeLadder(n,r,i):this.wNAFUnsafe(s,this.getPrecomputes(s,n,o),r,i)},setWindowSize(n,r){Yr$1(r,e),Gr$1.set(n,r),sn$1.delete(n);}}}function hc(t,e,n,r){if(fc(n,t),lc(r,e),n.length!==r.length)throw new Error("arrays of points and scalars must have equal length");const o=t.ZERO,i=Pr$1(BigInt(n.length)),s=i>12?i-3:i>4?i-2:i?2:1,c=(1<<s)-1,a=new Array(c+1).fill(o),u=Math.floor((e.BITS-1)/s)*s;let l=o;for(let f=u;f>=0;f-=s){a.fill(o);for(let y=0;y<r.length;y++){const E=r[y],p=Number(E>>BigInt(f)&BigInt(c));a[p]=a[p].add(n[y]);}let h=o;for(let y=a.length-1,E=o;y>0;y--)E=E.add(a[y]),h=h.add(E);if(l=l.add(h),f!==0)for(let y=0;y<s;y++)l=l.double();}return l}function Wr$1(t){return sc(t.Fp),Dt$1(t,{n:"bigint",h:"bigint",Gx:"field",Gy:"field"},{nBitLength:"isSafeInteger",nByteLength:"isSafeInteger"}),Object.freeze({...qr$1(t.n,t.nBitLength),...t,p:t.Fp.ORDER})}BigInt(0),BigInt(1),BigInt(2),BigInt(8);const Ht$1=BigInt(0),an$1=BigInt(1);function pc(t){return Dt$1(t,{a:"bigint"},{montgomeryBits:"isSafeInteger",nByteLength:"isSafeInteger",adjustScalarBytes:"function",domain:"function",powPminus2:"function",Gu:"bigint"}),Object.freeze({...t})}function gc(t){const e=pc(t),{P:n}=e,r=m=>X$1(m,n),o=e.montgomeryBits,i=Math.ceil(o/8),s=e.nByteLength,c=e.adjustScalarBytes||(m=>m),a=e.powPminus2||(m=>Hr$1(m,n-BigInt(2),n));function u(m,O,N){const $=r(m*(O-N));return O=r(O-$),N=r(N+$),[O,N]}const l=(e.a-BigInt(2))/BigInt(4);function f(m,O){ft$2("u",m,Ht$1,n),ft$2("scalar",O,Ht$1,n);const N=O,$=m;let B=an$1,A=Ht$1,T=m,S=an$1,L=Ht$1,U;for(let j=BigInt(o-1);j>=Ht$1;j--){const g=N>>j&an$1;L^=g,U=u(L,B,T),B=U[0],T=U[1],U=u(L,A,S),A=U[0],S=U[1],L=g;const w=B+A,b=r(w*w),I=B-A,R=r(I*I),x=b-R,C=T+S,P=T-S,k=r(P*w),M=r(C*I),D=k+M,z=k-M;T=r(D*D),S=r($*r(z*z)),B=r(b*R),A=r(x*(b+r(l*x)));}U=u(L,B,T),B=U[0],T=U[1],U=u(L,A,S),A=U[0],S=U[1];const _=a(A);return r(B*_)}function h(m){return be$2(r(m),i)}function y(m){const O=et$1("u coordinate",m,i);return s===32&&(O[31]&=127),ee$1(O)}function E(m){const O=et$1("scalar",m),N=O.length;if(N!==i&&N!==s){let $=""+i+" or "+s;throw new Error("invalid scalar, expected "+$+" bytes, got "+N)}return ee$1(c(O))}function p(m,O){const N=y(O),$=E(m),B=f(N,$);if(B===Ht$1)throw new Error("invalid private or public key received");return h(B)}const d=h(e.Gu);function v(m){return p(m,d)}return {scalarMult:p,scalarMultBase:v,getSharedSecret:(m,O)=>p(m,O),getPublicKey:m=>v(m),utils:{randomPrivateKey:()=>e.randomBytes(e.nByteLength)},GuBytes:d}}const un$1=BigInt("57896044618658097711785492504343953926634992332820282019728792003956564819949");BigInt(0);const yc=BigInt(1),Xr$1=BigInt(2),mc=BigInt(3),wc=BigInt(5);BigInt(8);function bc(t){const e=BigInt(10),n=BigInt(20),r=BigInt(40),o=BigInt(80),i=un$1,c=t*t%i*t%i,a=it$1(c,Xr$1,i)*c%i,u=it$1(a,yc,i)*t%i,l=it$1(u,wc,i)*u%i,f=it$1(l,e,i)*l%i,h=it$1(f,n,i)*f%i,y=it$1(h,r,i)*h%i,E=it$1(y,o,i)*y%i,p=it$1(E,o,i)*y%i,d=it$1(p,e,i)*l%i;return {pow_p_5_8:it$1(d,Xr$1,i)*t%i,b2:c}}function Ec(t){return t[0]&=248,t[31]&=127,t[31]|=64,t}const fn$1=gc({P:un$1,a:BigInt(486662),montgomeryBits:255,nByteLength:32,Gu:BigInt(9),powPminus2:t=>{const e=un$1,{pow_p_5_8:n,b2:r}=bc(t);return X$1(it$1(n,mc,e)*r,e)},adjustScalarBytes:Ec,randomBytes:Lt$2});function Jr$1(t){t.lowS!==void 0&&Ct$1("lowS",t.lowS),t.prehash!==void 0&&Ct$1("prehash",t.prehash);}function vc(t){const e=Wr$1(t);Dt$1(e,{a:"field",b:"field"},{allowedPrivateKeyLengths:"array",wrapPrivateKey:"boolean",isTorsionFree:"function",clearCofactor:"function",allowInfinityPoint:"boolean",fromBytes:"function",toBytes:"function"});const{endo:n,Fp:r,a:o}=e;if(n){if(!r.eql(o,r.ZERO))throw new Error("invalid endomorphism, can only be defined for Koblitz curves that have a=0");if(typeof n!="object"||typeof n.beta!="bigint"||typeof n.splitScalar!="function")throw new Error("invalid endomorphism, expected beta: bigint and splitScalar: function")}return Object.freeze({...e})}const{bytesToNumberBE:xc,hexToBytes:Sc}=ec;class Oc extends Error{constructor(e=""){super(e);}}const lt$1={Err:Oc,_tlv:{encode:(t,e)=>{const{Err:n}=lt$1;if(t<0||t>256)throw new n("tlv.encode: wrong tag");if(e.length&1)throw new n("tlv.encode: unpadded data");const r=e.length/2,o=kt$2(r);if(o.length/2&128)throw new n("tlv.encode: long form length too big");const i=r>127?kt$2(o.length/2|128):"";return kt$2(t)+i+o+e},decode(t,e){const{Err:n}=lt$1;let r=0;if(t<0||t>256)throw new n("tlv.encode: wrong tag");if(e.length<2||e[r++]!==t)throw new n("tlv.decode: wrong tlv");const o=e[r++],i=!!(o&128);let s=0;if(!i)s=o;else {const a=o&127;if(!a)throw new n("tlv.decode(long): indefinite length not supported");if(a>4)throw new n("tlv.decode(long): byte length is too big");const u=e.subarray(r,r+a);if(u.length!==a)throw new n("tlv.decode: length bytes not complete");if(u[0]===0)throw new n("tlv.decode(long): zero leftmost byte");for(const l of u)s=s<<8|l;if(r+=a,s<128)throw new n("tlv.decode(long): not minimal encoding")}const c=e.subarray(r,r+s);if(c.length!==s)throw new n("tlv.decode: wrong value length");return {v:c,l:e.subarray(r+s)}}},_int:{encode(t){const{Err:e}=lt$1;if(t<dt$2)throw new e("integer: negative integers are not allowed");let n=kt$2(t);if(Number.parseInt(n[0],16)&8&&(n="00"+n),n.length&1)throw new e("unexpected DER parsing assertion: unpadded hex");return n},decode(t){const{Err:e}=lt$1;if(t[0]&128)throw new e("invalid signature integer: negative");if(t[0]===0&&!(t[1]&128))throw new e("invalid signature integer: unnecessary leading zero");return xc(t)}},toSig(t){const{Err:e,_int:n,_tlv:r}=lt$1,o=typeof t=="string"?Sc(t):t;te$1(o);const{v:i,l:s}=r.decode(48,o);if(s.length)throw new e("invalid signature: left bytes after parsing");const{v:c,l:a}=r.decode(2,i),{v:u,l}=r.decode(2,a);if(l.length)throw new e("invalid signature: left bytes after parsing");return {r:n.decode(c),s:n.decode(u)}},hexFromSig(t){const{_tlv:e,_int:n}=lt$1,r=e.encode(2,n.encode(t.r)),o=e.encode(2,n.encode(t.s)),i=r+o;return e.encode(48,i)}},dt$2=BigInt(0),K$1=BigInt(1);BigInt(2);const Qr$1=BigInt(3);BigInt(4);function Ac(t){const e=vc(t),{Fp:n}=e,r=Kr$1(e.n,e.nBitLength),o=e.toBytes||((p,d,v)=>{const m=d.toAffine();return ne$2(Uint8Array.from([4]),n.toBytes(m.x),n.toBytes(m.y))}),i=e.fromBytes||(p=>{const d=p.subarray(1),v=n.fromBytes(d.subarray(0,n.BYTES)),m=n.fromBytes(d.subarray(n.BYTES,2*n.BYTES));return {x:v,y:m}});function s(p){const{a:d,b:v}=e,m=n.sqr(p),O=n.mul(m,p);return n.add(n.add(O,n.mul(p,d)),v)}if(!n.eql(n.sqr(e.Gy),s(e.Gx)))throw new Error("bad generator point: equation left != right");function c(p){return Ee$3(p,K$1,e.n)}function a(p){const{allowedPrivateKeyLengths:d,nByteLength:v,wrapPrivateKey:m,n:O}=e;if(d&&typeof p!="bigint"){if(St$3(p)&&(p=Pt$2(p)),typeof p!="string"||!d.includes(p.length))throw new Error("invalid private key");p=p.padStart(v*2,"0");}let N;try{N=typeof p=="bigint"?p:Ot$1(et$1("private key",p,v));}catch{throw new Error("invalid private key, expected hex or "+v+" bytes, got "+typeof p)}return m&&(N=X$1(N,O)),ft$2("private key",N,K$1,O),N}function u(p){if(!(p instanceof h))throw new Error("ProjectivePoint expected")}const l=tn$1((p,d)=>{const{px:v,py:m,pz:O}=p;if(n.eql(O,n.ONE))return {x:v,y:m};const N=p.is0();d==null&&(d=N?n.ONE:n.inv(O));const $=n.mul(v,d),B=n.mul(m,d),A=n.mul(O,d);if(N)return {x:n.ZERO,y:n.ZERO};if(!n.eql(A,n.ONE))throw new Error("invZ was invalid");return {x:$,y:B}}),f=tn$1(p=>{if(p.is0()){if(e.allowInfinityPoint&&!n.is0(p.py))return;throw new Error("bad point: ZERO")}const{x:d,y:v}=p.toAffine();if(!n.isValid(d)||!n.isValid(v))throw new Error("bad point: x or y not FE");const m=n.sqr(v),O=s(d);if(!n.eql(m,O))throw new Error("bad point: equation left != right");if(!p.isTorsionFree())throw new Error("bad point: not in prime-order subgroup");return  true});class h{constructor(d,v,m){if(this.px=d,this.py=v,this.pz=m,d==null||!n.isValid(d))throw new Error("x required");if(v==null||!n.isValid(v))throw new Error("y required");if(m==null||!n.isValid(m))throw new Error("z required");Object.freeze(this);}static fromAffine(d){const{x:v,y:m}=d||{};if(!d||!n.isValid(v)||!n.isValid(m))throw new Error("invalid affine point");if(d instanceof h)throw new Error("projective point not allowed");const O=N=>n.eql(N,n.ZERO);return O(v)&&O(m)?h.ZERO:new h(v,m,n.ONE)}get x(){return this.toAffine().x}get y(){return this.toAffine().y}static normalizeZ(d){const v=n.invertBatch(d.map(m=>m.pz));return d.map((m,O)=>m.toAffine(v[O])).map(h.fromAffine)}static fromHex(d){const v=h.fromAffine(i(et$1("pointHex",d)));return v.assertValidity(),v}static fromPrivateKey(d){return h.BASE.multiply(a(d))}static msm(d,v){return hc(h,r,d,v)}_setWindowSize(d){E.setWindowSize(this,d);}assertValidity(){f(this);}hasEvenY(){const{y:d}=this.toAffine();if(n.isOdd)return !n.isOdd(d);throw new Error("Field doesn't support isOdd")}equals(d){u(d);const{px:v,py:m,pz:O}=this,{px:N,py:$,pz:B}=d,A=n.eql(n.mul(v,B),n.mul(N,O)),T=n.eql(n.mul(m,B),n.mul($,O));return A&&T}negate(){return new h(this.px,n.neg(this.py),this.pz)}double(){const{a:d,b:v}=e,m=n.mul(v,Qr$1),{px:O,py:N,pz:$}=this;let B=n.ZERO,A=n.ZERO,T=n.ZERO,S=n.mul(O,O),L=n.mul(N,N),U=n.mul($,$),_=n.mul(O,N);return _=n.add(_,_),T=n.mul(O,$),T=n.add(T,T),B=n.mul(d,T),A=n.mul(m,U),A=n.add(B,A),B=n.sub(L,A),A=n.add(L,A),A=n.mul(B,A),B=n.mul(_,B),T=n.mul(m,T),U=n.mul(d,U),_=n.sub(S,U),_=n.mul(d,_),_=n.add(_,T),T=n.add(S,S),S=n.add(T,S),S=n.add(S,U),S=n.mul(S,_),A=n.add(A,S),U=n.mul(N,$),U=n.add(U,U),S=n.mul(U,_),B=n.sub(B,S),T=n.mul(U,L),T=n.add(T,T),T=n.add(T,T),new h(B,A,T)}add(d){u(d);const{px:v,py:m,pz:O}=this,{px:N,py:$,pz:B}=d;let A=n.ZERO,T=n.ZERO,S=n.ZERO;const L=e.a,U=n.mul(e.b,Qr$1);let _=n.mul(v,N),j=n.mul(m,$),g=n.mul(O,B),w=n.add(v,m),b=n.add(N,$);w=n.mul(w,b),b=n.add(_,j),w=n.sub(w,b),b=n.add(v,O);let I=n.add(N,B);return b=n.mul(b,I),I=n.add(_,g),b=n.sub(b,I),I=n.add(m,O),A=n.add($,B),I=n.mul(I,A),A=n.add(j,g),I=n.sub(I,A),S=n.mul(L,b),A=n.mul(U,g),S=n.add(A,S),A=n.sub(j,S),S=n.add(j,S),T=n.mul(A,S),j=n.add(_,_),j=n.add(j,_),g=n.mul(L,g),b=n.mul(U,b),j=n.add(j,g),g=n.sub(_,g),g=n.mul(L,g),b=n.add(b,g),_=n.mul(j,b),T=n.add(T,_),_=n.mul(I,b),A=n.mul(w,A),A=n.sub(A,_),_=n.mul(w,j),S=n.mul(I,S),S=n.add(S,_),new h(A,T,S)}subtract(d){return this.add(d.negate())}is0(){return this.equals(h.ZERO)}wNAF(d){return E.wNAFCached(this,d,h.normalizeZ)}multiplyUnsafe(d){const{endo:v,n:m}=e;ft$2("scalar",d,dt$2,m);const O=h.ZERO;if(d===dt$2)return O;if(this.is0()||d===K$1)return this;if(!v||E.hasPrecomputes(this))return E.wNAFCachedUnsafe(this,d,h.normalizeZ);let{k1neg:N,k1:$,k2neg:B,k2:A}=v.splitScalar(d),T=O,S=O,L=this;for(;$>dt$2||A>dt$2;)$&K$1&&(T=T.add(L)),A&K$1&&(S=S.add(L)),L=L.double(),$>>=K$1,A>>=K$1;return N&&(T=T.negate()),B&&(S=S.negate()),S=new h(n.mul(S.px,v.beta),S.py,S.pz),T.add(S)}multiply(d){const{endo:v,n:m}=e;ft$2("scalar",d,K$1,m);let O,N;if(v){const{k1neg:$,k1:B,k2neg:A,k2:T}=v.splitScalar(d);let{p:S,f:L}=this.wNAF(B),{p:U,f:_}=this.wNAF(T);S=E.constTimeNegate($,S),U=E.constTimeNegate(A,U),U=new h(n.mul(U.px,v.beta),U.py,U.pz),O=S.add(U),N=L.add(_);}else {const{p:$,f:B}=this.wNAF(d);O=$,N=B;}return h.normalizeZ([O,N])[0]}multiplyAndAddUnsafe(d,v,m){const O=h.BASE,N=(B,A)=>A===dt$2||A===K$1||!B.equals(O)?B.multiplyUnsafe(A):B.multiply(A),$=N(this,v).add(N(d,m));return $.is0()?void 0:$}toAffine(d){return l(this,d)}isTorsionFree(){const{h:d,isTorsionFree:v}=e;if(d===K$1)return  true;if(v)return v(h,this);throw new Error("isTorsionFree() has not been declared for the elliptic curve")}clearCofactor(){const{h:d,clearCofactor:v}=e;return d===K$1?this:v?v(h,this):this.multiplyUnsafe(e.h)}toRawBytes(d=true){return Ct$1("isCompressed",d),this.assertValidity(),o(h,this,d)}toHex(d=true){return Ct$1("isCompressed",d),Pt$2(this.toRawBytes(d))}}h.BASE=new h(e.Gx,e.Gy,n.ONE),h.ZERO=new h(n.ZERO,n.ONE,n.ZERO);const y=e.nBitLength,E=dc(h,e.endo?Math.ceil(y/2):y);return {CURVE:e,ProjectivePoint:h,normPrivateKeyToScalar:a,weierstrassEquation:s,isWithinCurveOrder:c}}function Bc(t){const e=Wr$1(t);return Dt$1(e,{hash:"hash",hmac:"function",randomBytes:"function"},{bits2int:"function",bits2int_modN:"function",lowS:"boolean"}),Object.freeze({lowS:true,...e})}function Ic(t){const e=Bc(t),{Fp:n,n:r}=e,o=n.BYTES+1,i=2*n.BYTES+1;function s(g){return X$1(g,r)}function c(g){return nn$1(g,r)}const{ProjectivePoint:a,normPrivateKeyToScalar:u,weierstrassEquation:l,isWithinCurveOrder:f}=Ac({...e,toBytes(g,w,b){const I=w.toAffine(),R=n.toBytes(I.x),x=ne$2;return Ct$1("isCompressed",b),b?x(Uint8Array.from([w.hasEvenY()?2:3]),R):x(Uint8Array.from([4]),R,n.toBytes(I.y))},fromBytes(g){const w=g.length,b=g[0],I=g.subarray(1);if(w===o&&(b===2||b===3)){const R=Ot$1(I);if(!Ee$3(R,K$1,n.ORDER))throw new Error("Point is not on curve");const x=l(R);let C;try{C=n.sqrt(x);}catch(M){const D=M instanceof Error?": "+M.message:"";throw new Error("Point is not on curve"+D)}const P=(C&K$1)===K$1;return (b&1)===1!==P&&(C=n.neg(C)),{x:R,y:C}}else if(w===i&&b===4){const R=n.fromBytes(I.subarray(0,n.BYTES)),x=n.fromBytes(I.subarray(n.BYTES,2*n.BYTES));return {x:R,y:x}}else {const R=o,x=i;throw new Error("invalid Point, expected length of "+R+", or uncompressed "+x+", got "+w)}}}),h=g=>Pt$2(Mt$2(g,e.nByteLength));function y(g){const w=r>>K$1;return g>w}function E(g){return y(g)?s(-g):g}const p=(g,w,b)=>Ot$1(g.slice(w,b));class d{constructor(w,b,I){this.r=w,this.s=b,this.recovery=I,this.assertValidity();}static fromCompact(w){const b=e.nByteLength;return w=et$1("compactSignature",w,b*2),new d(p(w,0,b),p(w,b,2*b))}static fromDER(w){const{r:b,s:I}=lt$1.toSig(et$1("DER",w));return new d(b,I)}assertValidity(){ft$2("r",this.r,K$1,r),ft$2("s",this.s,K$1,r);}addRecoveryBit(w){return new d(this.r,this.s,w)}recoverPublicKey(w){const{r:b,s:I,recovery:R}=this,x=B(et$1("msgHash",w));if(R==null||![0,1,2,3].includes(R))throw new Error("recovery id invalid");const C=R===2||R===3?b+e.n:b;if(C>=n.ORDER)throw new Error("recovery id 2 or 3 invalid");const P=(R&1)===0?"02":"03",k=a.fromHex(P+h(C)),M=c(C),D=s(-x*M),z=s(I*M),Z=a.BASE.multiplyAndAddUnsafe(k,D,z);if(!Z)throw new Error("point at infinify");return Z.assertValidity(),Z}hasHighS(){return y(this.s)}normalizeS(){return this.hasHighS()?new d(this.r,s(-this.s),this.recovery):this}toDERRawBytes(){return Vt$2(this.toDERHex())}toDERHex(){return lt$1.hexFromSig({r:this.r,s:this.s})}toCompactRawBytes(){return Vt$2(this.toCompactHex())}toCompactHex(){return h(this.r)+h(this.s)}}const v={isValidPrivateKey(g){try{return u(g),!0}catch{return  false}},normPrivateKeyToScalar:u,randomPrivateKey:()=>{const g=zr$1(e.n);return uc(e.randomBytes(g),e.n)},precompute(g=8,w=a.BASE){return w._setWindowSize(g),w.multiply(BigInt(3)),w}};function m(g,w=true){return a.fromPrivateKey(g).toRawBytes(w)}function O(g){const w=St$3(g),b=typeof g=="string",I=(w||b)&&g.length;return w?I===o||I===i:b?I===2*o||I===2*i:g instanceof a}function N(g,w,b=true){if(O(g))throw new Error("first arg must be private key");if(!O(w))throw new Error("second arg must be public key");return a.fromHex(w).multiply(u(g)).toRawBytes(b)}const $=e.bits2int||function(g){if(g.length>8192)throw new Error("input is too large");const w=Ot$1(g),b=g.length*8-e.nBitLength;return b>0?w>>BigInt(b):w},B=e.bits2int_modN||function(g){return s($(g))},A=Je$2(e.nBitLength);function T(g){return ft$2("num < 2^"+e.nBitLength,g,dt$2,A),Mt$2(g,e.nByteLength)}function S(g,w,b=L){if(["recovered","canonical"].some(W=>W in b))throw new Error("sign() legacy options not supported");const{hash:I,randomBytes:R}=e;let{lowS:x,prehash:C,extraEntropy:P}=b;x==null&&(x=true),g=et$1("msgHash",g),Jr$1(b),C&&(g=et$1("prehashed msgHash",I(g)));const k=B(g),M=u(w),D=[T(M),T(k)];if(P!=null&&P!==false){const W=P===true?R(n.BYTES):P;D.push(et$1("extraEntropy",W));}const z=ne$2(...D),Z=k;function st(W){const J=$(W);if(!f(J))return;const Be=c(J),zt=a.BASE.multiply(J).toAffine(),vt=s(zt.x);if(vt===dt$2)return;const Zt=s(Be*s(Z+vt*M));if(Zt===dt$2)return;let Ut=(zt.x===vt?0:2)|Number(zt.y&K$1),vn=Zt;return x&&y(Zt)&&(vn=E(Zt),Ut^=1),new d(vt,vn,Ut)}return {seed:z,k2sig:st}}const L={lowS:e.lowS,prehash:false},U={lowS:e.lowS,prehash:false};function _(g,w,b=L){const{seed:I,k2sig:R}=S(g,w,b),x=e;return Vr$1(x.hash.outputLen,x.nByteLength,x.hmac)(I,R)}a.BASE._setWindowSize(8);function j(g,w,b,I=U){const R=g;w=et$1("msgHash",w),b=et$1("publicKey",b);const{lowS:x,prehash:C,format:P}=I;if(Jr$1(I),"strict"in I)throw new Error("options.strict was renamed to lowS");if(P!==void 0&&P!=="compact"&&P!=="der")throw new Error("format must be compact or der");const k=typeof R=="string"||St$3(R),M=!k&&!P&&typeof R=="object"&&R!==null&&typeof R.r=="bigint"&&typeof R.s=="bigint";if(!k&&!M)throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");let D,z;try{if(M&&(D=new d(R.r,R.s)),k){try{P!=="compact"&&(D=d.fromDER(R));}catch(Ut){if(!(Ut instanceof lt$1.Err))throw Ut}!D&&P!=="der"&&(D=d.fromCompact(R));}z=a.fromHex(b);}catch{return  false}if(!D||x&&D.hasHighS())return  false;C&&(w=e.hash(w));const{r:Z,s:st}=D,W=B(w),J=c(st),Be=s(W*J),zt=s(Z*J),vt=a.BASE.multiplyAndAddUnsafe(z,Be,zt)?.toAffine();return vt?s(vt.x)===Z:false}return {CURVE:e,getPublicKey:m,getSharedSecret:N,sign:_,verify:j,ProjectivePoint:a,Signature:d,utils:v}}function Nc(t){return {hash:t,hmac:(e,...n)=>ye$2(t,e,Vi$1(...n)),randomBytes:Lt$2}}function Uc(t,e){const n=r=>Ic({...t,...Nc(r)});return {...n(e),create:n}}const to$1=Kr$1(BigInt("0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff")),Tc=to$1.create(BigInt("-3")),Rc=BigInt("0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b"),_c=Uc({a:Tc,b:Rc,Fp:to$1,n:BigInt("0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551"),Gx:BigInt("0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296"),Gy:BigInt("0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5"),h:BigInt(1),lowS:false},Qt$2),ln$1="base10",G$1="base16",qt$2="base64pad",xe$1="base64url",Kt$2="utf8",dn$1=0,Ft$2=1,re$2=2,$c=0,eo$1=1,oe$1=12,hn$1=32;function Lc(){const t=fn$1.utils.randomPrivateKey(),e=fn$1.getPublicKey(t);return {privateKey:toString(t,G$1),publicKey:toString(e,G$1)}}function jc(){const t=Lt$2(hn$1);return toString(t,G$1)}function Cc(t,e){const n=fn$1.getSharedSecret(fromString(t,G$1),fromString(e,G$1)),r=Vs$1(Qt$2,n,void 0,void 0,hn$1);return toString(r,G$1)}function Pc(t){const e=Qt$2(fromString(t,G$1));return toString(e,G$1)}function kc(t){const e=Qt$2(fromString(t,Kt$2));return toString(e,G$1)}function pn$1(t){return fromString(`${t}`,ln$1)}function Bt$2(t){return Number(toString(t,ln$1))}function no$1(t){return t.replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"")}function ro$1(t){const e=t.replace(/-/g,"+").replace(/_/g,"/"),n=(4-e.length%4)%4;return e+"=".repeat(n)}function Vc(t){const e=pn$1(typeof t.type<"u"?t.type:dn$1);if(Bt$2(e)===Ft$2&&typeof t.senderPublicKey>"u")throw new Error("Missing sender public key for type 1 envelope");const n=typeof t.senderPublicKey<"u"?fromString(t.senderPublicKey,G$1):void 0,r=typeof t.iv<"u"?fromString(t.iv,G$1):Lt$2(oe$1),o=fromString(t.symKey,G$1),i=$r$1(o,r).encrypt(fromString(t.message,Kt$2)),s=gn$1({type:e,sealed:i,iv:r,senderPublicKey:n});return t.encoding===xe$1?no$1(s):s}function Mc(t){const e=fromString(t.symKey,G$1),{sealed:n,iv:r}=Se$1({encoded:t.encoded,encoding:t.encoding}),o=$r$1(e,r).decrypt(n);if(o===null)throw new Error("Failed to decrypt");return toString(o,Kt$2)}function Dc(t,e){const n=pn$1(re$2),r=Lt$2(oe$1),o=fromString(t,Kt$2),i=gn$1({type:n,sealed:o,iv:r});return e===xe$1?no$1(i):i}function Hc(t,e){const{sealed:n}=Se$1({encoded:t,encoding:e});return toString(n,Kt$2)}function gn$1(t){if(Bt$2(t.type)===re$2)return toString(concat([t.type,t.sealed]),qt$2);if(Bt$2(t.type)===Ft$2){if(typeof t.senderPublicKey>"u")throw new Error("Missing sender public key for type 1 envelope");return toString(concat([t.type,t.senderPublicKey,t.iv,t.sealed]),qt$2)}return toString(concat([t.type,t.iv,t.sealed]),qt$2)}function Se$1(t){const e=(t.encoding||qt$2)===xe$1?ro$1(t.encoded):t.encoded,n=fromString(e,qt$2),r=n.slice($c,eo$1),o=eo$1;if(Bt$2(r)===Ft$2){const a=o+hn$1,u=a+oe$1,l=n.slice(o,a),f=n.slice(a,u),h=n.slice(u);return {type:r,sealed:h,iv:f,senderPublicKey:l}}if(Bt$2(r)===re$2){const a=n.slice(o),u=Lt$2(oe$1);return {type:r,sealed:a,iv:u}}const i=o+oe$1,s=n.slice(o,i),c=n.slice(i);return {type:r,sealed:c,iv:s}}function qc(t,e){const n=Se$1({encoded:t,encoding:e?.encoding});return oo$1({type:Bt$2(n.type),senderPublicKey:typeof n.senderPublicKey<"u"?toString(n.senderPublicKey,G$1):void 0,receiverPublicKey:e?.receiverPublicKey})}function oo$1(t){const e=t?.type||dn$1;if(e===Ft$2){if(typeof t?.senderPublicKey>"u")throw new Error("missing sender public key");if(typeof t?.receiverPublicKey>"u")throw new Error("missing receiver public key")}return {type:e,senderPublicKey:t?.senderPublicKey,receiverPublicKey:t?.receiverPublicKey}}function Kc(t){return t.type===Ft$2&&typeof t.senderPublicKey=="string"&&typeof t.receiverPublicKey=="string"}function Fc(t){return t.type===re$2}function io$1(t){const e=Buffer.from(t.x,"base64"),n=Buffer.from(t.y,"base64");return concat([new Uint8Array([4]),e,n])}function zc(t,e){const[n,r,o]=t.split("."),i=Buffer.from(ro$1(o),"base64");if(i.length!==64)throw new Error("Invalid signature length");const s=i.slice(0,32),c=i.slice(32,64),a=`${n}.${r}`,u=Qt$2(a),l=io$1(e);if(!_c.verify(concat([s,c]),u,l))throw new Error("Invalid signature");return sn$2(t).payload}const so$1="irn";function Zc(t){return t?.relay||{protocol:so$1}}function Yc(t){const e=C$3[t];if(typeof e>"u")throw new Error(`Relay Protocol not supported: ${t}`);return e}function co$1(t,e="-"){const n={},r="relay"+e;return Object.keys(t).forEach(o=>{if(o.startsWith(r)){const i=o.replace(r,""),s=t[o];n[i]=s;}}),n}function Gc(t){if(!t.includes("wc:")){const u=je$2(t);u!=null&&u.includes("wc:")&&(t=u);}t=t.includes("wc://")?t.replace("wc://",""):t,t=t.includes("wc:")?t.replace("wc:",""):t;const e=t.indexOf(":"),n=t.indexOf("?")!==-1?t.indexOf("?"):void 0,r=t.substring(0,e),o=t.substring(e+1,n).split("@"),i=typeof n<"u"?t.substring(n):"",s=new URLSearchParams(i),c={};s.forEach((u,l)=>{c[l]=u;});const a=typeof c.methods=="string"?c.methods.split(","):void 0;return {protocol:r,topic:ao$1(o[0]),version:parseInt(o[1],10),symKey:c.symKey,relay:co$1(c),methods:a,expiryTimestamp:c.expiryTimestamp?parseInt(c.expiryTimestamp,10):void 0}}function ao$1(t){return t.startsWith("//")?t.substring(2):t}function uo$1(t,e="-"){const n="relay",r={};return Object.keys(t).forEach(o=>{const i=o,s=n+e+i;t[i]&&(r[s]=t[i]);}),r}function Wc(t){const e=new URLSearchParams,n=uo$1(t.relay);Object.keys(n).sort().forEach(o=>{e.set(o,n[o]);}),e.set("symKey",t.symKey),t.expiryTimestamp&&e.set("expiryTimestamp",t.expiryTimestamp.toString()),t.methods&&e.set("methods",t.methods.join(","));const r=e.toString();return `${t.protocol}:${t.topic}@${t.version}?${r}`}function Xc(t,e,n){return `${t}?wc_ev=${n}&topic=${e}`}var Jc=Object.defineProperty,Qc=Object.defineProperties,ta=Object.getOwnPropertyDescriptors,fo$1=Object.getOwnPropertySymbols,ea=Object.prototype.hasOwnProperty,na=Object.prototype.propertyIsEnumerable,lo$1=(t,e,n)=>e in t?Jc(t,e,{enumerable:true,configurable:true,writable:true,value:n}):t[e]=n,ra=(t,e)=>{for(var n in e||(e={}))ea.call(e,n)&&lo$1(t,n,e[n]);if(fo$1)for(var n of fo$1(e))na.call(e,n)&&lo$1(t,n,e[n]);return t},oa=(t,e)=>Qc(t,ta(e));function It$2(t){const e=[];return t.forEach(n=>{const[r,o]=n.split(":");e.push(`${r}:${o}`);}),e}function ho$1(t){const e=[];return Object.values(t).forEach(n=>{e.push(...It$2(n.accounts));}),e}function po$1(t,e){const n=[];return Object.values(t).forEach(r=>{It$2(r.accounts).includes(e)&&n.push(...r.methods);}),n}function go$1(t,e){const n=[];return Object.values(t).forEach(r=>{It$2(r.accounts).includes(e)&&n.push(...r.events);}),n}function yn$1(t){return t.includes(":")}function yo$1(t){return yn$1(t)?t.split(":")[0]:t}function ie$1(t){var e,n,r;const o={};if(!Oe$1(t))return o;for(const[i,s]of Object.entries(t)){const c=yn$1(i)?[i]:s.chains,a=s.methods||[],u=s.events||[],l=yo$1(i);o[l]=oa(ra({},o[l]),{chains:ot$1(c,(e=o[l])==null?void 0:e.chains),methods:ot$1(a,(n=o[l])==null?void 0:n.methods),events:ot$1(u,(r=o[l])==null?void 0:r.events)});}return o}function mo$1(t){const e={};return t?.forEach(n=>{var r;const[o,i]=n.split(":");e[o]||(e[o]={accounts:[],chains:[],events:[],methods:[]}),e[o].accounts.push(n),(r=e[o].chains)==null||r.push(`${o}:${i}`);}),e}function ca(t,e){e=e.map(r=>r.replace("did:pkh:",""));const n=mo$1(e);for(const[r,o]of Object.entries(n))o.methods?o.methods=ot$1(o.methods,t):o.methods=t,o.events=["chainChanged","accountsChanged"];return n}function aa(t,e){var n,r,o,i,s,c;const a=ie$1(t),u=ie$1(e),l={},f=Object.keys(a).concat(Object.keys(u));for(const h of f)l[h]={chains:ot$1((n=a[h])==null?void 0:n.chains,(r=u[h])==null?void 0:r.chains),methods:ot$1((o=a[h])==null?void 0:o.methods,(i=u[h])==null?void 0:i.methods),events:ot$1((s=a[h])==null?void 0:s.events,(c=u[h])==null?void 0:c.events)};return l}const wo$1={INVALID_METHOD:{message:"Invalid method.",code:1001},INVALID_EVENT:{message:"Invalid event.",code:1002},INVALID_UPDATE_REQUEST:{message:"Invalid update request.",code:1003},INVALID_EXTEND_REQUEST:{message:"Invalid extend request.",code:1004},INVALID_SESSION_SETTLE_REQUEST:{message:"Invalid session settle request.",code:1005},UNAUTHORIZED_METHOD:{message:"Unauthorized method.",code:3001},UNAUTHORIZED_EVENT:{message:"Unauthorized event.",code:3002},UNAUTHORIZED_UPDATE_REQUEST:{message:"Unauthorized update request.",code:3003},UNAUTHORIZED_EXTEND_REQUEST:{message:"Unauthorized extend request.",code:3004},USER_REJECTED:{message:"User rejected.",code:5e3},USER_REJECTED_CHAINS:{message:"User rejected chains.",code:5001},USER_REJECTED_METHODS:{message:"User rejected methods.",code:5002},USER_REJECTED_EVENTS:{message:"User rejected events.",code:5003},UNSUPPORTED_CHAINS:{message:"Unsupported chains.",code:5100},UNSUPPORTED_METHODS:{message:"Unsupported methods.",code:5101},UNSUPPORTED_EVENTS:{message:"Unsupported events.",code:5102},UNSUPPORTED_ACCOUNTS:{message:"Unsupported accounts.",code:5103},UNSUPPORTED_NAMESPACE_KEY:{message:"Unsupported namespace key.",code:5104},USER_DISCONNECTED:{message:"User disconnected.",code:6e3},SESSION_SETTLEMENT_FAILED:{message:"Session settlement failed.",code:7e3},WC_METHOD_UNSUPPORTED:{message:"Unsupported wc_ method.",code:10001}},bo$1={NOT_INITIALIZED:{message:"Not initialized.",code:1},NO_MATCHING_KEY:{message:"No matching key.",code:2},RESTORE_WILL_OVERRIDE:{message:"Restore will override.",code:3},RESUBSCRIBED:{message:"Resubscribed.",code:4},MISSING_OR_INVALID:{message:"Missing or invalid.",code:5},EXPIRED:{message:"Expired.",code:6},UNKNOWN_TYPE:{message:"Unknown type.",code:7},MISMATCHED_TOPIC:{message:"Mismatched topic.",code:8},NON_CONFORMING_NAMESPACES:{message:"Non conforming namespaces.",code:9}};function ht$2(t,e){const{message:n,code:r}=bo$1[t];return {message:e?`${n} ${e}`:n,code:r}}function Nt$1(t,e){const{message:n,code:r}=wo$1[t];return {message:e?`${n} ${e}`:n,code:r}}function se$2(t,e){return Array.isArray(t)?true:false}function Oe$1(t){return Object.getPrototypeOf(t)===Object.prototype&&Object.keys(t).length}function Et$2(t){return typeof t>"u"}function nt$1(t,e){return e&&Et$2(t)?true:typeof t=="string"&&!!t.trim().length}function Ae$1(t,e){return e&&Et$2(t)?true:typeof t=="number"&&!isNaN(t)}function ua(t,e){const{requiredNamespaces:n}=e,r=Object.keys(t.namespaces),o=Object.keys(n);let i=true;return gt$2(o,r)?(r.forEach(s=>{const{accounts:c,methods:a,events:u}=t.namespaces[s],l=It$2(c),f=n[s];(!gt$2(ue$2(s,f),l)||!gt$2(f.methods,a)||!gt$2(f.events,u))&&(i=false);}),i):false}function ce$2(t){return nt$1(t,false)&&t.includes(":")?t.split(":").length===2:false}function Eo$1(t){if(nt$1(t,false)&&t.includes(":")){const e=t.split(":");if(e.length===3){const n=e[0]+":"+e[1];return !!e[2]&&ce$2(n)}}return  false}function fa(t){function e(n){try{return typeof new URL(n)<"u"}catch{return  false}}try{if(nt$1(t,!1)){if(e(t))return !0;const n=je$2(t);return e(n)}}catch{}return  false}function la(t){var e;return (e=t?.proposer)==null?void 0:e.publicKey}function da(t){return t?.topic}function ha(t,e){let n=null;return nt$1(t?.publicKey,false)||(n=ht$2("MISSING_OR_INVALID",`${e} controller public key should be a string`)),n}function mn$1(t){let e=true;return se$2(t)?t.length&&(e=t.every(n=>nt$1(n,false))):e=false,e}function vo$1(t,e,n){let r=null;return se$2(e)&&e.length?e.forEach(o=>{r||ce$2(o)||(r=Nt$1("UNSUPPORTED_CHAINS",`${n}, chain ${o} should be a string and conform to "namespace:chainId" format`));}):ce$2(t)||(r=Nt$1("UNSUPPORTED_CHAINS",`${n}, chains must be defined as "namespace:chainId" e.g. "eip155:1": {...} in the namespace key OR as an array of CAIP-2 chainIds e.g. eip155: { chains: ["eip155:1", "eip155:5"] }`)),r}function xo$1(t,e,n){let r=null;return Object.entries(t).forEach(([o,i])=>{if(r)return;const s=vo$1(o,ue$2(o,i),`${e} ${n}`);s&&(r=s);}),r}function So$1(t,e){let n=null;return se$2(t)?t.forEach(r=>{n||Eo$1(r)||(n=Nt$1("UNSUPPORTED_ACCOUNTS",`${e}, account ${r} should be a string and conform to "namespace:chainId:address" format`));}):n=Nt$1("UNSUPPORTED_ACCOUNTS",`${e}, accounts should be an array of strings conforming to "namespace:chainId:address" format`),n}function Oo$1(t,e){let n=null;return Object.values(t).forEach(r=>{if(n)return;const o=So$1(r?.accounts,`${e} namespace`);o&&(n=o);}),n}function Ao$1(t,e){let n=null;return mn$1(t?.methods)?mn$1(t?.events)||(n=Nt$1("UNSUPPORTED_EVENTS",`${e}, events should be an array of strings or empty array for no events`)):n=Nt$1("UNSUPPORTED_METHODS",`${e}, methods should be an array of strings or empty array for no methods`),n}function wn$1(t,e){let n=null;return Object.values(t).forEach(r=>{if(n)return;const o=Ao$1(r,`${e}, namespace`);o&&(n=o);}),n}function pa(t,e,n){let r=null;if(t&&Oe$1(t)){const o=wn$1(t,e);o&&(r=o);const i=xo$1(t,e,n);i&&(r=i);}else r=ht$2("MISSING_OR_INVALID",`${e}, ${n} should be an object with data`);return r}function Bo$1(t,e){let n=null;if(t&&Oe$1(t)){const r=wn$1(t,e);r&&(n=r);const o=Oo$1(t,e);o&&(n=o);}else n=ht$2("MISSING_OR_INVALID",`${e}, namespaces should be an object with data`);return n}function Io$1(t){return nt$1(t.protocol,true)}function ga(t,e){let n=false;return !t?n=true:t&&se$2(t)&&t.length&&t.forEach(r=>{n=Io$1(r);}),n}function ya(t){return typeof t=="number"}function ma(t){return typeof t<"u"&&typeof t!==null}function wa(t){return !(!t||typeof t!="object"||!t.code||!Ae$1(t.code,false)||!t.message||!nt$1(t.message,false))}function ba(t){return !(Et$2(t)||!nt$1(t.method,false))}function Ea(t){return !(Et$2(t)||Et$2(t.result)&&Et$2(t.error)||!Ae$1(t.id,false)||!nt$1(t.jsonrpc,false))}function va(t){return !(Et$2(t)||!nt$1(t.name,false))}function xa(t,e){return !(!ce$2(e)||!ho$1(t).includes(e))}function Sa(t,e,n){return nt$1(n,false)?po$1(t,e).includes(n):false}function Oa(t,e,n){return nt$1(n,false)?go$1(t,e).includes(n):false}function No$1(t,e,n){let r=null;const o=Aa(t),i=Ba(e),s=Object.keys(o),c=Object.keys(i),a=Uo$1(Object.keys(t)),u=Uo$1(Object.keys(e)),l=a.filter(f=>!u.includes(f));return l.length&&(r=ht$2("NON_CONFORMING_NAMESPACES",`${n} namespaces keys don't satisfy requiredNamespaces.
      Required: ${l.toString()}
      Received: ${Object.keys(e).toString()}`)),gt$2(s,c)||(r=ht$2("NON_CONFORMING_NAMESPACES",`${n} namespaces chains don't satisfy required namespaces.
      Required: ${s.toString()}
      Approved: ${c.toString()}`)),Object.keys(e).forEach(f=>{if(!f.includes(":")||r)return;const h=It$2(e[f].accounts);h.includes(f)||(r=ht$2("NON_CONFORMING_NAMESPACES",`${n} namespaces accounts don't satisfy namespace accounts for ${f}
        Required: ${f}
        Approved: ${h.toString()}`));}),s.forEach(f=>{r||(gt$2(o[f].methods,i[f].methods)?gt$2(o[f].events,i[f].events)||(r=ht$2("NON_CONFORMING_NAMESPACES",`${n} namespaces events don't satisfy namespace events for ${f}`)):r=ht$2("NON_CONFORMING_NAMESPACES",`${n} namespaces methods don't satisfy namespace methods for ${f}`));}),r}function Aa(t){const e={};return Object.keys(t).forEach(n=>{var r;n.includes(":")?e[n]=t[n]:(r=t[n].chains)==null||r.forEach(o=>{e[o]={methods:t[n].methods,events:t[n].events};});}),e}function Uo$1(t){return [...new Set(t.map(e=>e.includes(":")?e.split(":")[0]:e))]}function Ba(t){const e={};return Object.keys(t).forEach(n=>{if(n.includes(":"))e[n]=t[n];else {const r=It$2(t[n].accounts);r?.forEach(o=>{e[o]={accounts:t[n].accounts.filter(i=>i.includes(`${o}:`)),methods:t[n].methods,events:t[n].events};});}}),e}function Ia(t,e){return Ae$1(t,false)&&t<=e.max&&t>=e.min}function Na(){const t=xt$2();return new Promise(e=>{switch(t){case Y$2.browser:e(To$1());break;case Y$2.reactNative:e(Ro$1());break;case Y$2.node:e(_o$1());break;default:e(true);}})}function To$1(){return Tt$2()&&navigator?.onLine}async function Ro$1(){if(pt$2()&&typeof global<"u"&&global!=null&&global.NetInfo){const t=await(global==null?void 0:global.NetInfo.fetch());return t?.isConnected}return  true}function _o$1(){return  true}function Ua(t){switch(xt$2()){case Y$2.browser:$o$1(t);break;case Y$2.reactNative:Lo$1(t);break;}}function $o$1(t){!pt$2()&&Tt$2()&&(window.addEventListener("online",()=>t(true)),window.addEventListener("offline",()=>t(false)));}function Lo$1(t){pt$2()&&typeof global<"u"&&global!=null&&global.NetInfo&&global?.NetInfo.addEventListener(e=>t(e?.isConnected));}function Ta(){var t;return Tt$2()&&cjsExports$2.getDocument()?((t=cjsExports$2.getDocument())==null?void 0:t.visibilityState)==="visible":true}const bn$1={};class Ra{static get(e){return bn$1[e]}static set(e,n){bn$1[e]=n;}static delete(e){delete bn$1[e];}}

const ze$1="wc",Le$2=2,he$1="core",B$2=`${ze$1}@2:${he$1}:`,Et$1={logger:"error"},It$1={database:":memory:"},Tt$1="crypto",ke$2="client_ed25519_seed",Ct=cjsExports$1.ONE_DAY,Pt$1="keychain",St$2="0.3",Ot="messages",Rt$1="0.3",je$1=cjsExports$1.SIX_HOURS,At="publisher",xt$1="irn",Nt="error",Ue$2="wss://relay.walletconnect.org",$t="relayer",C$2={message:"relayer_message",message_ack:"relayer_message_ack",connect:"relayer_connect",disconnect:"relayer_disconnect",error:"relayer_error",connection_stalled:"relayer_connection_stalled",transport_closed:"relayer_transport_closed",publish:"relayer_publish"},zt$1="_subscription",L$2={payload:"payload",connect:"connect",disconnect:"disconnect",error:"error"},Lt$1=.1,_e$2="2.21.0",Q$1={link_mode:"link_mode",relay:"relay"},le$1={inbound:"inbound",outbound:"outbound"},kt$1="0.3",jt$1="WALLETCONNECT_CLIENT_ID",Fe$1="WALLETCONNECT_LINK_MODE_APPS",$$3={created:"subscription_created",deleted:"subscription_deleted",expired:"subscription_expired",disabled:"subscription_disabled",sync:"subscription_sync",resubscribed:"subscription_resubscribed"},Ut$1="subscription",Ft$1="0.3",Mt$1="pairing",Kt$1="0.3",se$1={wc_pairingDelete:{req:{ttl:cjsExports$1.ONE_DAY,prompt:false,tag:1e3},res:{ttl:cjsExports$1.ONE_DAY,prompt:false,tag:1001}},wc_pairingPing:{req:{ttl:cjsExports$1.THIRTY_SECONDS,prompt:false,tag:1002},res:{ttl:cjsExports$1.THIRTY_SECONDS,prompt:false,tag:1003}},unregistered_method:{req:{ttl:cjsExports$1.ONE_DAY,prompt:false,tag:0},res:{ttl:cjsExports$1.ONE_DAY,prompt:false,tag:0}}},re$1={create:"pairing_create",expire:"pairing_expire",delete:"pairing_delete",ping:"pairing_ping"},F$1={created:"history_created",updated:"history_updated",deleted:"history_deleted",sync:"history_sync"},Bt$1="history",Vt$1="0.3",qt$1="expirer",M$2={created:"expirer_created",deleted:"expirer_deleted",expired:"expirer_expired",sync:"expirer_sync"},Gt$1="0.3",Wt$1="verify-api",Zs="https://verify.walletconnect.com",Ht="https://verify.walletconnect.org",ue$1=Ht,Yt$1=`${ue$1}/v3`,Jt$1=[Zs,Ht],Xt$1="echo",Zt$1="https://echo.walletconnect.com",G={pairing_started:"pairing_started",pairing_uri_validation_success:"pairing_uri_validation_success",pairing_uri_not_expired:"pairing_uri_not_expired",store_new_pairing:"store_new_pairing",subscribing_pairing_topic:"subscribing_pairing_topic",subscribe_pairing_topic_success:"subscribe_pairing_topic_success",existing_pairing:"existing_pairing",pairing_not_expired:"pairing_not_expired",emit_inactive_pairing:"emit_inactive_pairing",emit_session_proposal:"emit_session_proposal",subscribing_to_pairing_topic:"subscribing_to_pairing_topic"},Y$1={no_wss_connection:"no_wss_connection",no_internet_connection:"no_internet_connection",malformed_pairing_uri:"malformed_pairing_uri",active_pairing_already_exists:"active_pairing_already_exists",subscribe_pairing_topic_failure:"subscribe_pairing_topic_failure",pairing_expired:"pairing_expired",proposal_expired:"proposal_expired",proposal_listener_not_found:"proposal_listener_not_found"},er={session_approve_started:"session_approve_started",proposal_not_expired:"proposal_not_expired",session_namespaces_validation_success:"session_namespaces_validation_success",create_session_topic:"create_session_topic",subscribing_session_topic:"subscribing_session_topic",subscribe_session_topic_success:"subscribe_session_topic_success",publishing_session_approve:"publishing_session_approve",session_approve_publish_success:"session_approve_publish_success",store_session:"store_session",publishing_session_settle:"publishing_session_settle",session_settle_publish_success:"session_settle_publish_success"},tr={no_internet_connection:"no_internet_connection",no_wss_connection:"no_wss_connection",proposal_expired:"proposal_expired",subscribe_session_topic_failure:"subscribe_session_topic_failure",session_approve_publish_failure:"session_approve_publish_failure",session_settle_publish_failure:"session_settle_publish_failure",session_approve_namespace_validation_failure:"session_approve_namespace_validation_failure",proposal_not_found:"proposal_not_found"},ir={authenticated_session_approve_started:"authenticated_session_approve_started",create_authenticated_session_topic:"create_authenticated_session_topic",cacaos_verified:"cacaos_verified",store_authenticated_session:"store_authenticated_session",subscribing_authenticated_session_topic:"subscribing_authenticated_session_topic",subscribe_authenticated_session_topic_success:"subscribe_authenticated_session_topic_success",publishing_authenticated_session_approve:"publishing_authenticated_session_approve"},sr={no_internet_connection:"no_internet_connection",invalid_cacao:"invalid_cacao",subscribe_authenticated_session_topic_failure:"subscribe_authenticated_session_topic_failure",authenticated_session_approve_publish_failure:"authenticated_session_approve_publish_failure",authenticated_session_pending_request_not_found:"authenticated_session_pending_request_not_found"},Qt$1=.1,ei="event-client",ti=86400,ii="https://pulse.walletconnect.org/batch";function rr(r,e){if(r.length>=255)throw new TypeError("Alphabet too long");for(var t=new Uint8Array(256),i=0;i<t.length;i++)t[i]=255;for(var s=0;s<r.length;s++){var n=r.charAt(s),o=n.charCodeAt(0);if(t[o]!==255)throw new TypeError(n+" is ambiguous");t[o]=s;}var a=r.length,c=r.charAt(0),h=Math.log(a)/Math.log(256),l=Math.log(256)/Math.log(a);function d(u){if(u instanceof Uint8Array||(ArrayBuffer.isView(u)?u=new Uint8Array(u.buffer,u.byteOffset,u.byteLength):Array.isArray(u)&&(u=Uint8Array.from(u))),!(u instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(u.length===0)return "";for(var b=0,x=0,I=0,D=u.length;I!==D&&u[I]===0;)I++,b++;for(var j=(D-I)*l+1>>>0,T=new Uint8Array(j);I!==D;){for(var q=u[I],J=0,K=j-1;(q!==0||J<x)&&K!==-1;K--,J++)q+=256*T[K]>>>0,T[K]=q%a>>>0,q=q/a>>>0;if(q!==0)throw new Error("Non-zero carry");x=J,I++;}for(var H=j-x;H!==j&&T[H]===0;)H++;for(var me=c.repeat(b);H<j;++H)me+=r.charAt(T[H]);return me}function g(u){if(typeof u!="string")throw new TypeError("Expected String");if(u.length===0)return new Uint8Array;var b=0;if(u[b]!==" "){for(var x=0,I=0;u[b]===c;)x++,b++;for(var D=(u.length-b)*h+1>>>0,j=new Uint8Array(D);u[b];){var T=t[u.charCodeAt(b)];if(T===255)return;for(var q=0,J=D-1;(T!==0||q<I)&&J!==-1;J--,q++)T+=a*j[J]>>>0,j[J]=T%256>>>0,T=T/256>>>0;if(T!==0)throw new Error("Non-zero carry");I=q,b++;}if(u[b]!==" "){for(var K=D-I;K!==D&&j[K]===0;)K++;for(var H=new Uint8Array(x+(D-K)),me=x;K!==D;)H[me++]=j[K++];return H}}}function _(u){var b=g(u);if(b)return b;throw new Error(`Non-${e} character`)}return {encode:d,decodeUnsafe:g,decode:_}}var nr=rr,or=nr;const si=r=>{if(r instanceof Uint8Array&&r.constructor.name==="Uint8Array")return r;if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.isView(r))return new Uint8Array(r.buffer,r.byteOffset,r.byteLength);throw new Error("Unknown type, must be binary type")},ar=r=>new TextEncoder().encode(r),cr=r=>new TextDecoder().decode(r);class hr{constructor(e,t,i){this.name=e,this.prefix=t,this.baseEncode=i;}encode(e){if(e instanceof Uint8Array)return `${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}}class lr{constructor(e,t,i){if(this.name=e,this.prefix=t,t.codePointAt(0)===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=t.codePointAt(0),this.baseDecode=i;}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return ri(this,e)}}class ur{constructor(e){this.decoders=e;}or(e){return ri(this,e)}decode(e){const t=e[0],i=this.decoders[t];if(i)return i.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}}const ri=(r,e)=>new ur({...r.decoders||{[r.prefix]:r},...e.decoders||{[e.prefix]:e}});class dr{constructor(e,t,i,s){this.name=e,this.prefix=t,this.baseEncode=i,this.baseDecode=s,this.encoder=new hr(e,t,i),this.decoder=new lr(e,t,s);}encode(e){return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}}const Ee$2=({name:r,prefix:e,encode:t,decode:i})=>new dr(r,e,t,i),de$1=({prefix:r,name:e,alphabet:t})=>{const{encode:i,decode:s}=or(t,e);return Ee$2({prefix:r,name:e,encode:i,decode:n=>si(s(n))})},gr=(r,e,t,i)=>{const s={};for(let l=0;l<e.length;++l)s[e[l]]=l;let n=r.length;for(;r[n-1]==="=";)--n;const o=new Uint8Array(n*t/8|0);let a=0,c=0,h=0;for(let l=0;l<n;++l){const d=s[r[l]];if(d===void 0)throw new SyntaxError(`Non-${i} character`);c=c<<t|d,a+=t,a>=8&&(a-=8,o[h++]=255&c>>a);}if(a>=t||255&c<<8-a)throw new SyntaxError("Unexpected end of data");return o},pr=(r,e,t)=>{const i=e[e.length-1]==="=",s=(1<<t)-1;let n="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=8;o>t;)o-=t,n+=e[s&a>>o];if(o&&(n+=e[s&a<<t-o]),i)for(;n.length*t&7;)n+="=";return n},P$1=({name:r,prefix:e,bitsPerChar:t,alphabet:i})=>Ee$2({prefix:e,name:r,encode(s){return pr(s,i,t)},decode(s){return gr(s,i,t,r)}}),yr=Ee$2({prefix:"\0",name:"identity",encode:r=>cr(r),decode:r=>ar(r)});var br=Object.freeze({__proto__:null,identity:yr});const mr=P$1({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1});var fr=Object.freeze({__proto__:null,base2:mr});const Dr=P$1({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3});var vr=Object.freeze({__proto__:null,base8:Dr});const wr=de$1({prefix:"9",name:"base10",alphabet:"0123456789"});var _r=Object.freeze({__proto__:null,base10:wr});const Er=P$1({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4}),Ir=P$1({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4});var Tr=Object.freeze({__proto__:null,base16:Er,base16upper:Ir});const Cr=P$1({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5}),Pr=P$1({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5}),Sr=P$1({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5}),Or=P$1({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5}),Rr=P$1({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5}),Ar=P$1({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5}),xr=P$1({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5}),Nr=P$1({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5}),$r=P$1({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});var zr=Object.freeze({__proto__:null,base32:Cr,base32upper:Pr,base32pad:Sr,base32padupper:Or,base32hex:Rr,base32hexupper:Ar,base32hexpad:xr,base32hexpadupper:Nr,base32z:$r});const Lr=de$1({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz"}),kr=de$1({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"});var jr=Object.freeze({__proto__:null,base36:Lr,base36upper:kr});const Ur=de$1({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),Fr=de$1({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var Mr=Object.freeze({__proto__:null,base58btc:Ur,base58flickr:Fr});const Kr=P$1({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),Br=P$1({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),Vr=P$1({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),qr=P$1({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6});var Gr=Object.freeze({__proto__:null,base64:Kr,base64pad:Br,base64url:Vr,base64urlpad:qr});const ni=Array.from("\u{1F680}\u{1FA90}\u2604\u{1F6F0}\u{1F30C}\u{1F311}\u{1F312}\u{1F313}\u{1F314}\u{1F315}\u{1F316}\u{1F317}\u{1F318}\u{1F30D}\u{1F30F}\u{1F30E}\u{1F409}\u2600\u{1F4BB}\u{1F5A5}\u{1F4BE}\u{1F4BF}\u{1F602}\u2764\u{1F60D}\u{1F923}\u{1F60A}\u{1F64F}\u{1F495}\u{1F62D}\u{1F618}\u{1F44D}\u{1F605}\u{1F44F}\u{1F601}\u{1F525}\u{1F970}\u{1F494}\u{1F496}\u{1F499}\u{1F622}\u{1F914}\u{1F606}\u{1F644}\u{1F4AA}\u{1F609}\u263A\u{1F44C}\u{1F917}\u{1F49C}\u{1F614}\u{1F60E}\u{1F607}\u{1F339}\u{1F926}\u{1F389}\u{1F49E}\u270C\u2728\u{1F937}\u{1F631}\u{1F60C}\u{1F338}\u{1F64C}\u{1F60B}\u{1F497}\u{1F49A}\u{1F60F}\u{1F49B}\u{1F642}\u{1F493}\u{1F929}\u{1F604}\u{1F600}\u{1F5A4}\u{1F603}\u{1F4AF}\u{1F648}\u{1F447}\u{1F3B6}\u{1F612}\u{1F92D}\u2763\u{1F61C}\u{1F48B}\u{1F440}\u{1F62A}\u{1F611}\u{1F4A5}\u{1F64B}\u{1F61E}\u{1F629}\u{1F621}\u{1F92A}\u{1F44A}\u{1F973}\u{1F625}\u{1F924}\u{1F449}\u{1F483}\u{1F633}\u270B\u{1F61A}\u{1F61D}\u{1F634}\u{1F31F}\u{1F62C}\u{1F643}\u{1F340}\u{1F337}\u{1F63B}\u{1F613}\u2B50\u2705\u{1F97A}\u{1F308}\u{1F608}\u{1F918}\u{1F4A6}\u2714\u{1F623}\u{1F3C3}\u{1F490}\u2639\u{1F38A}\u{1F498}\u{1F620}\u261D\u{1F615}\u{1F33A}\u{1F382}\u{1F33B}\u{1F610}\u{1F595}\u{1F49D}\u{1F64A}\u{1F639}\u{1F5E3}\u{1F4AB}\u{1F480}\u{1F451}\u{1F3B5}\u{1F91E}\u{1F61B}\u{1F534}\u{1F624}\u{1F33C}\u{1F62B}\u26BD\u{1F919}\u2615\u{1F3C6}\u{1F92B}\u{1F448}\u{1F62E}\u{1F646}\u{1F37B}\u{1F343}\u{1F436}\u{1F481}\u{1F632}\u{1F33F}\u{1F9E1}\u{1F381}\u26A1\u{1F31E}\u{1F388}\u274C\u270A\u{1F44B}\u{1F630}\u{1F928}\u{1F636}\u{1F91D}\u{1F6B6}\u{1F4B0}\u{1F353}\u{1F4A2}\u{1F91F}\u{1F641}\u{1F6A8}\u{1F4A8}\u{1F92C}\u2708\u{1F380}\u{1F37A}\u{1F913}\u{1F619}\u{1F49F}\u{1F331}\u{1F616}\u{1F476}\u{1F974}\u25B6\u27A1\u2753\u{1F48E}\u{1F4B8}\u2B07\u{1F628}\u{1F31A}\u{1F98B}\u{1F637}\u{1F57A}\u26A0\u{1F645}\u{1F61F}\u{1F635}\u{1F44E}\u{1F932}\u{1F920}\u{1F927}\u{1F4CC}\u{1F535}\u{1F485}\u{1F9D0}\u{1F43E}\u{1F352}\u{1F617}\u{1F911}\u{1F30A}\u{1F92F}\u{1F437}\u260E\u{1F4A7}\u{1F62F}\u{1F486}\u{1F446}\u{1F3A4}\u{1F647}\u{1F351}\u2744\u{1F334}\u{1F4A3}\u{1F438}\u{1F48C}\u{1F4CD}\u{1F940}\u{1F922}\u{1F445}\u{1F4A1}\u{1F4A9}\u{1F450}\u{1F4F8}\u{1F47B}\u{1F910}\u{1F92E}\u{1F3BC}\u{1F975}\u{1F6A9}\u{1F34E}\u{1F34A}\u{1F47C}\u{1F48D}\u{1F4E3}\u{1F942}"),Wr=ni.reduce((r,e,t)=>(r[t]=e,r),[]),Hr=ni.reduce((r,e,t)=>(r[e.codePointAt(0)]=t,r),[]);function Yr(r){return r.reduce((e,t)=>(e+=Wr[t],e),"")}function Jr(r){const e=[];for(const t of r){const i=Hr[t.codePointAt(0)];if(i===void 0)throw new Error(`Non-base256emoji character: ${t}`);e.push(i);}return new Uint8Array(e)}const Xr=Ee$2({prefix:"\u{1F680}",name:"base256emoji",encode:Yr,decode:Jr});var Zr=Object.freeze({__proto__:null,base256emoji:Xr}),Qr=ai,oi=128,tn=-128,sn=Math.pow(2,31);function ai(r,e,t){e=e||[],t=t||0;for(var i=t;r>=sn;)e[t++]=r&255|oi,r/=128;for(;r&tn;)e[t++]=r&255|oi,r>>>=7;return e[t]=r|0,ai.bytes=t-i+1,e}var rn=Me$2,nn=128,ci=127;function Me$2(r,i){var t=0,i=i||0,s=0,n=i,o,a=r.length;do{if(n>=a)throw Me$2.bytes=0,new RangeError("Could not decode varint");o=r[n++],t+=s<28?(o&ci)<<s:(o&ci)*Math.pow(2,s),s+=7;}while(o>=nn);return Me$2.bytes=n-i,t}var on=Math.pow(2,7),an=Math.pow(2,14),cn=Math.pow(2,21),hn=Math.pow(2,28),ln=Math.pow(2,35),un=Math.pow(2,42),dn=Math.pow(2,49),gn=Math.pow(2,56),pn=Math.pow(2,63),yn=function(r){return r<on?1:r<an?2:r<cn?3:r<hn?4:r<ln?5:r<un?6:r<dn?7:r<gn?8:r<pn?9:10},bn={encode:Qr,decode:rn,encodingLength:yn},hi=bn;const li=(r,e,t=0)=>(hi.encode(r,e,t),e),ui=r=>hi.encodingLength(r),Ke$2=(r,e)=>{const t=e.byteLength,i=ui(r),s=i+ui(t),n=new Uint8Array(s+t);return li(r,n,0),li(t,n,i),n.set(e,s),new mn(r,t,e,n)};class mn{constructor(e,t,i,s){this.code=e,this.size=t,this.digest=i,this.bytes=s;}}const di=({name:r,code:e,encode:t})=>new fn(r,e,t);class fn{constructor(e,t,i){this.name=e,this.code=t,this.encode=i;}digest(e){if(e instanceof Uint8Array){const t=this.encode(e);return t instanceof Uint8Array?Ke$2(this.code,t):t.then(i=>Ke$2(this.code,i))}else throw Error("Unknown type, must be binary type")}}const gi=r=>async e=>new Uint8Array(await crypto.subtle.digest(r,e)),Dn=di({name:"sha2-256",code:18,encode:gi("SHA-256")}),vn=di({name:"sha2-512",code:19,encode:gi("SHA-512")});var wn=Object.freeze({__proto__:null,sha256:Dn,sha512:vn});const pi=0,_n="identity",yi=si,En=r=>Ke$2(pi,yi(r)),In={code:pi,name:_n,encode:yi,digest:En};var Tn=Object.freeze({__proto__:null,identity:In});new TextEncoder,new TextDecoder;const bi={...br,...fr,...vr,..._r,...Tr,...zr,...jr,...Mr,...Gr,...Zr};({...wn,...Tn});function Cn(r=0){return globalThis.Buffer!=null&&globalThis.Buffer.allocUnsafe!=null?globalThis.Buffer.allocUnsafe(r):new Uint8Array(r)}function mi(r,e,t,i){return {name:r,prefix:e,encoder:{name:r,prefix:e,encode:t},decoder:{decode:i}}}const fi=mi("utf8","u",r=>"u"+new TextDecoder("utf8").decode(r),r=>new TextEncoder().encode(r.substring(1))),Be$1=mi("ascii","a",r=>{let e="a";for(let t=0;t<r.length;t++)e+=String.fromCharCode(r[t]);return e},r=>{r=r.substring(1);const e=Cn(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}),Pn={utf8:fi,"utf-8":fi,hex:bi.base16,latin1:Be$1,ascii:Be$1,binary:Be$1,...bi};function Sn(r,e="utf8"){const t=Pn[e];if(!t)throw new Error(`Unsupported encoding "${e}"`);return (e==="utf8"||e==="utf-8")&&globalThis.Buffer!=null&&globalThis.Buffer.from!=null?globalThis.Buffer.from(r,"utf8"):t.decoder.decode(`${t.prefix}${r}`)}var On=Object.defineProperty,Rn=(r,e,t)=>e in r?On(r,e,{enumerable:true,configurable:true,writable:true,value:t}):r[e]=t,W$2=(r,e,t)=>Rn(r,typeof e!="symbol"?e+"":e,t);class Di{constructor(e,t){this.core=e,this.logger=t,W$2(this,"keychain",new Map),W$2(this,"name",Pt$1),W$2(this,"version",St$2),W$2(this,"initialized",false),W$2(this,"storagePrefix",B$2),W$2(this,"init",async()=>{if(!this.initialized){const i=await this.getKeyChain();typeof i<"u"&&(this.keychain=i),this.initialized=true;}}),W$2(this,"has",i=>(this.isInitialized(),this.keychain.has(i))),W$2(this,"set",async(i,s)=>{this.isInitialized(),this.keychain.set(i,s),await this.persist();}),W$2(this,"get",i=>{this.isInitialized();const s=this.keychain.get(i);if(typeof s>"u"){const{message:n}=ht$2("NO_MATCHING_KEY",`${this.name}: ${i}`);throw new Error(n)}return s}),W$2(this,"del",async i=>{this.isInitialized(),this.keychain.delete(i),await this.persist();}),this.core=e,this.logger=E$4(t,this.name);}get context(){return y$6(this.logger)}get storageKey(){return this.storagePrefix+this.version+this.core.customStoragePrefix+"//"+this.name}async setKeyChain(e){await this.core.storage.setItem(this.storageKey,fi$1(e));}async getKeyChain(){const e=await this.core.storage.getItem(this.storageKey);return typeof e<"u"?li$1(e):void 0}async persist(){await this.setKeyChain(this.keychain);}isInitialized(){if(!this.initialized){const{message:e}=ht$2("NOT_INITIALIZED",this.name);throw new Error(e)}}}var An=Object.defineProperty,xn=(r,e,t)=>e in r?An(r,e,{enumerable:true,configurable:true,writable:true,value:t}):r[e]=t,S$3=(r,e,t)=>xn(r,typeof e!="symbol"?e+"":e,t);class vi{constructor(e,t,i){this.core=e,this.logger=t,S$3(this,"name",Tt$1),S$3(this,"keychain"),S$3(this,"randomSessionIdentifier",jc()),S$3(this,"initialized",false),S$3(this,"init",async()=>{this.initialized||(await this.keychain.init(),this.initialized=true);}),S$3(this,"hasKeys",s=>(this.isInitialized(),this.keychain.has(s))),S$3(this,"getClientId",async()=>{this.isInitialized();const s=await this.getClientSeed(),n=Po$1(s);return Qe$3(n.publicKey)}),S$3(this,"generateKeyPair",()=>{this.isInitialized();const s=Lc();return this.setPrivateKey(s.publicKey,s.privateKey)}),S$3(this,"signJWT",async s=>{this.isInitialized();const n=await this.getClientSeed(),o=Po$1(n),a=this.randomSessionIdentifier,c=Ct;return await Qo(a,s,c,o)}),S$3(this,"generateSharedKey",(s,n,o)=>{this.isInitialized();const a=this.getPrivateKey(s),c=Cc(a,n);return this.setSymKey(c,o)}),S$3(this,"setSymKey",async(s,n)=>{this.isInitialized();const o=n||Pc(s);return await this.keychain.set(o,s),o}),S$3(this,"deleteKeyPair",async s=>{this.isInitialized(),await this.keychain.del(s);}),S$3(this,"deleteSymKey",async s=>{this.isInitialized(),await this.keychain.del(s);}),S$3(this,"encode",async(s,n,o)=>{this.isInitialized();const a=oo$1(o),c=safeJsonStringify(n);if(Fc(a))return Dc(c,o?.encoding);if(Kc(a)){const g=a.senderPublicKey,_=a.receiverPublicKey;s=await this.generateSharedKey(g,_);}const h=this.getSymKey(s),{type:l,senderPublicKey:d}=a;return Vc({type:l,symKey:h,message:c,senderPublicKey:d,encoding:o?.encoding})}),S$3(this,"decode",async(s,n,o)=>{this.isInitialized();const a=qc(n,o);if(Fc(a)){const c=Hc(n,o?.encoding);return safeJsonParse(c)}if(Kc(a)){const c=a.receiverPublicKey,h=a.senderPublicKey;s=await this.generateSharedKey(c,h);}try{const c=this.getSymKey(s),h=Mc({symKey:c,encoded:n,encoding:o?.encoding});return safeJsonParse(h)}catch(c){this.logger.error(`Failed to decode message from topic: '${s}', clientId: '${await this.getClientId()}'`),this.logger.error(c);}}),S$3(this,"getPayloadType",(s,n=qt$2)=>{const o=Se$1({encoded:s,encoding:n});return Bt$2(o.type)}),S$3(this,"getPayloadSenderPublicKey",(s,n=qt$2)=>{const o=Se$1({encoded:s,encoding:n});return o.senderPublicKey?toString(o.senderPublicKey,G$1):void 0}),this.core=e,this.logger=E$4(t,this.name),this.keychain=i||new Di(this.core,this.logger);}get context(){return y$6(this.logger)}async setPrivateKey(e,t){return await this.keychain.set(e,t),e}getPrivateKey(e){return this.keychain.get(e)}async getClientSeed(){let e="";try{e=this.keychain.get(ke$2);}catch{e=jc(),await this.keychain.set(ke$2,e);}return Sn(e,"base16")}getSymKey(e){return this.keychain.get(e)}isInitialized(){if(!this.initialized){const{message:e}=ht$2("NOT_INITIALIZED",this.name);throw new Error(e)}}}var Nn=Object.defineProperty,$n=Object.defineProperties,zn=Object.getOwnPropertyDescriptors,wi=Object.getOwnPropertySymbols,Ln=Object.prototype.hasOwnProperty,kn=Object.prototype.propertyIsEnumerable,Ve$1=(r,e,t)=>e in r?Nn(r,e,{enumerable:true,configurable:true,writable:true,value:t}):r[e]=t,jn=(r,e)=>{for(var t in e||(e={}))Ln.call(e,t)&&Ve$1(r,t,e[t]);if(wi)for(var t of wi(e))kn.call(e,t)&&Ve$1(r,t,e[t]);return r},Un=(r,e)=>$n(r,zn(e)),k$2=(r,e,t)=>Ve$1(r,typeof e!="symbol"?e+"":e,t);class _i extends y$4{constructor(e,t){super(e,t),this.logger=e,this.core=t,k$2(this,"messages",new Map),k$2(this,"messagesWithoutClientAck",new Map),k$2(this,"name",Ot),k$2(this,"version",Rt$1),k$2(this,"initialized",false),k$2(this,"storagePrefix",B$2),k$2(this,"init",async()=>{if(!this.initialized){this.logger.trace("Initialized");try{const i=await this.getRelayerMessages();typeof i<"u"&&(this.messages=i);const s=await this.getRelayerMessagesWithoutClientAck();typeof s<"u"&&(this.messagesWithoutClientAck=s),this.logger.debug(`Successfully Restored records for ${this.name}`),this.logger.trace({type:"method",method:"restore",size:this.messages.size});}catch(i){this.logger.debug(`Failed to Restore records for ${this.name}`),this.logger.error(i);}finally{this.initialized=true;}}}),k$2(this,"set",async(i,s,n)=>{this.isInitialized();const o=kc(s);let a=this.messages.get(i);if(typeof a>"u"&&(a={}),typeof a[o]<"u")return o;if(a[o]=s,this.messages.set(i,a),n===le$1.inbound){const c=this.messagesWithoutClientAck.get(i)||{};this.messagesWithoutClientAck.set(i,Un(jn({},c),{[o]:s}));}return await this.persist(),o}),k$2(this,"get",i=>{this.isInitialized();let s=this.messages.get(i);return typeof s>"u"&&(s={}),s}),k$2(this,"getWithoutAck",i=>{this.isInitialized();const s={};for(const n of i){const o=this.messagesWithoutClientAck.get(n)||{};s[n]=Object.values(o);}return s}),k$2(this,"has",(i,s)=>{this.isInitialized();const n=this.get(i),o=kc(s);return typeof n[o]<"u"}),k$2(this,"ack",async(i,s)=>{this.isInitialized();const n=this.messagesWithoutClientAck.get(i);if(typeof n>"u")return;const o=kc(s);delete n[o],Object.keys(n).length===0?this.messagesWithoutClientAck.delete(i):this.messagesWithoutClientAck.set(i,n),await this.persist();}),k$2(this,"del",async i=>{this.isInitialized(),this.messages.delete(i),this.messagesWithoutClientAck.delete(i),await this.persist();}),this.logger=E$4(e,this.name),this.core=t;}get context(){return y$6(this.logger)}get storageKey(){return this.storagePrefix+this.version+this.core.customStoragePrefix+"//"+this.name}get storageKeyWithoutClientAck(){return this.storagePrefix+this.version+this.core.customStoragePrefix+"//"+this.name+"_withoutClientAck"}async setRelayerMessages(e){await this.core.storage.setItem(this.storageKey,fi$1(e));}async setRelayerMessagesWithoutClientAck(e){await this.core.storage.setItem(this.storageKeyWithoutClientAck,fi$1(e));}async getRelayerMessages(){const e=await this.core.storage.getItem(this.storageKey);return typeof e<"u"?li$1(e):void 0}async getRelayerMessagesWithoutClientAck(){const e=await this.core.storage.getItem(this.storageKeyWithoutClientAck);return typeof e<"u"?li$1(e):void 0}async persist(){await this.setRelayerMessages(this.messages),await this.setRelayerMessagesWithoutClientAck(this.messagesWithoutClientAck);}isInitialized(){if(!this.initialized){const{message:e}=ht$2("NOT_INITIALIZED",this.name);throw new Error(e)}}}var Fn=Object.defineProperty,Mn=Object.defineProperties,Kn=Object.getOwnPropertyDescriptors,Ei=Object.getOwnPropertySymbols,Bn=Object.prototype.hasOwnProperty,Vn=Object.prototype.propertyIsEnumerable,qe$1=(r,e,t)=>e in r?Fn(r,e,{enumerable:true,configurable:true,writable:true,value:t}):r[e]=t,Ie$1=(r,e)=>{for(var t in e||(e={}))Bn.call(e,t)&&qe$1(r,t,e[t]);if(Ei)for(var t of Ei(e))Vn.call(e,t)&&qe$1(r,t,e[t]);return r},Ge$2=(r,e)=>Mn(r,Kn(e)),V$2=(r,e,t)=>qe$1(r,typeof e!="symbol"?e+"":e,t);class qn extends m$2{constructor(e,t){super(e,t),this.relayer=e,this.logger=t,V$2(this,"events",new EventEmitter),V$2(this,"name",At),V$2(this,"queue",new Map),V$2(this,"publishTimeout",cjsExports$1.toMiliseconds(cjsExports$1.ONE_MINUTE)),V$2(this,"initialPublishTimeout",cjsExports$1.toMiliseconds(cjsExports$1.ONE_SECOND*15)),V$2(this,"needsTransportRestart",false),V$2(this,"publish",async(i,s,n)=>{var o;this.logger.debug("Publishing Payload"),this.logger.trace({type:"method",method:"publish",params:{topic:i,message:s,opts:n}});const a=n?.ttl||je$1,c=Zc(n),h=n?.prompt||false,l=n?.tag||0,d=n?.id||getBigIntRpcId().toString(),g={topic:i,message:s,opts:{ttl:a,relay:c,prompt:h,tag:l,id:d,attestation:n?.attestation,tvf:n?.tvf}},_=`Failed to publish payload, please try again. id:${d} tag:${l}`;try{const u=new Promise(async b=>{const x=({id:D})=>{g.opts.id===D&&(this.removeRequestFromQueue(D),this.relayer.events.removeListener(C$2.publish,x),b(g));};this.relayer.events.on(C$2.publish,x);const I=yi$1(new Promise((D,j)=>{this.rpcPublish({topic:i,message:s,ttl:a,prompt:h,tag:l,id:d,attestation:n?.attestation,tvf:n?.tvf}).then(D).catch(T=>{this.logger.warn(T,T?.message),j(T);});}),this.initialPublishTimeout,`Failed initial publish, retrying.... id:${d} tag:${l}`);try{await I,this.events.removeListener(C$2.publish,x);}catch(D){this.queue.set(d,Ge$2(Ie$1({},g),{attempt:1})),this.logger.warn(D,D?.message);}});this.logger.trace({type:"method",method:"publish",params:{id:d,topic:i,message:s,opts:n}}),await yi$1(u,this.publishTimeout,_);}catch(u){if(this.logger.debug("Failed to Publish Payload"),this.logger.error(u),(o=n?.internal)!=null&&o.throwOnFailedPublish)throw u}finally{this.queue.delete(d);}}),V$2(this,"on",(i,s)=>{this.events.on(i,s);}),V$2(this,"once",(i,s)=>{this.events.once(i,s);}),V$2(this,"off",(i,s)=>{this.events.off(i,s);}),V$2(this,"removeListener",(i,s)=>{this.events.removeListener(i,s);}),this.relayer=e,this.logger=E$4(t,this.name),this.registerEventListeners();}get context(){return y$6(this.logger)}async rpcPublish(e){var t,i,s,n;const{topic:o,message:a,ttl:c=je$1,prompt:h,tag:l,id:d,attestation:g,tvf:_}=e,u={method:Yc(Zc().protocol).publish,params:Ie$1({topic:o,message:a,ttl:c,prompt:h,tag:l,attestation:g},_),id:d};Et$2((t=u.params)==null?void 0:t.prompt)&&((i=u.params)==null||delete i.prompt),Et$2((s=u.params)==null?void 0:s.tag)&&((n=u.params)==null||delete n.tag),this.logger.debug("Outgoing Relay Payload"),this.logger.trace({type:"message",direction:"outgoing",request:u});const b=await this.relayer.request(u);return this.relayer.events.emit(C$2.publish,e),this.logger.debug("Successfully Published Payload"),b}removeRequestFromQueue(e){this.queue.delete(e);}checkQueue(){this.queue.forEach(async(e,t)=>{const i=e.attempt+1;this.queue.set(t,Ge$2(Ie$1({},e),{attempt:i}));const{topic:s,message:n,opts:o,attestation:a}=e;this.logger.warn({},`Publisher: queue->publishing: ${e.opts.id}, tag: ${e.opts.tag}, attempt: ${i}`),await this.rpcPublish(Ge$2(Ie$1({},e),{topic:s,message:n,ttl:o.ttl,prompt:o.prompt,tag:o.tag,id:o.id,attestation:a,tvf:o.tvf})),this.logger.warn({},`Publisher: queue->published: ${e.opts.id}`);});}registerEventListeners(){this.relayer.core.heartbeat.on(r$3.pulse,()=>{if(this.needsTransportRestart){this.needsTransportRestart=false,this.relayer.events.emit(C$2.connection_stalled);return}this.checkQueue();}),this.relayer.on(C$2.message_ack,e=>{this.removeRequestFromQueue(e.id.toString());});}}var Gn=Object.defineProperty,Wn=(r,e,t)=>e in r?Gn(r,e,{enumerable:true,configurable:true,writable:true,value:t}):r[e]=t,ne$1=(r,e,t)=>Wn(r,typeof e!="symbol"?e+"":e,t);class Hn{constructor(){ne$1(this,"map",new Map),ne$1(this,"set",(e,t)=>{const i=this.get(e);this.exists(e,t)||this.map.set(e,[...i,t]);}),ne$1(this,"get",e=>this.map.get(e)||[]),ne$1(this,"exists",(e,t)=>this.get(e).includes(t)),ne$1(this,"delete",(e,t)=>{if(typeof t>"u"){this.map.delete(e);return}if(!this.map.has(e))return;const i=this.get(e);if(!this.exists(e,t))return;const s=i.filter(n=>n!==t);if(!s.length){this.map.delete(e);return}this.map.set(e,s);}),ne$1(this,"clear",()=>{this.map.clear();});}get topics(){return Array.from(this.map.keys())}}var Yn=Object.defineProperty,Jn=Object.defineProperties,Xn=Object.getOwnPropertyDescriptors,Ii=Object.getOwnPropertySymbols,Zn=Object.prototype.hasOwnProperty,Qn=Object.prototype.propertyIsEnumerable,We$1=(r,e,t)=>e in r?Yn(r,e,{enumerable:true,configurable:true,writable:true,value:t}):r[e]=t,ge$1=(r,e)=>{for(var t in e||(e={}))Zn.call(e,t)&&We$1(r,t,e[t]);if(Ii)for(var t of Ii(e))Qn.call(e,t)&&We$1(r,t,e[t]);return r},He$1=(r,e)=>Jn(r,Xn(e)),f$2=(r,e,t)=>We$1(r,typeof e!="symbol"?e+"":e,t);class Ti extends P$2{constructor(e,t){super(e,t),this.relayer=e,this.logger=t,f$2(this,"subscriptions",new Map),f$2(this,"topicMap",new Hn),f$2(this,"events",new EventEmitter),f$2(this,"name",Ut$1),f$2(this,"version",Ft$1),f$2(this,"pending",new Map),f$2(this,"cached",[]),f$2(this,"initialized",false),f$2(this,"storagePrefix",B$2),f$2(this,"subscribeTimeout",cjsExports$1.toMiliseconds(cjsExports$1.ONE_MINUTE)),f$2(this,"initialSubscribeTimeout",cjsExports$1.toMiliseconds(cjsExports$1.ONE_SECOND*15)),f$2(this,"clientId"),f$2(this,"batchSubscribeTopicsLimit",500),f$2(this,"init",async()=>{this.initialized||(this.logger.trace("Initialized"),this.registerEventListeners(),await this.restore()),this.initialized=true;}),f$2(this,"subscribe",async(i,s)=>{this.isInitialized(),this.logger.debug("Subscribing Topic"),this.logger.trace({type:"method",method:"subscribe",params:{topic:i,opts:s}});try{const n=Zc(s),o={topic:i,relay:n,transportType:s?.transportType};this.pending.set(i,o);const a=await this.rpcSubscribe(i,n,s);return typeof a=="string"&&(this.onSubscribe(a,o),this.logger.debug("Successfully Subscribed Topic"),this.logger.trace({type:"method",method:"subscribe",params:{topic:i,opts:s}})),a}catch(n){throw this.logger.debug("Failed to Subscribe Topic"),this.logger.error(n),n}}),f$2(this,"unsubscribe",async(i,s)=>{this.isInitialized(),typeof s?.id<"u"?await this.unsubscribeById(i,s.id,s):await this.unsubscribeByTopic(i,s);}),f$2(this,"isSubscribed",i=>new Promise(s=>{s(this.topicMap.topics.includes(i));})),f$2(this,"isKnownTopic",i=>new Promise(s=>{s(this.topicMap.topics.includes(i)||this.pending.has(i)||this.cached.some(n=>n.topic===i));})),f$2(this,"on",(i,s)=>{this.events.on(i,s);}),f$2(this,"once",(i,s)=>{this.events.once(i,s);}),f$2(this,"off",(i,s)=>{this.events.off(i,s);}),f$2(this,"removeListener",(i,s)=>{this.events.removeListener(i,s);}),f$2(this,"start",async()=>{await this.onConnect();}),f$2(this,"stop",async()=>{await this.onDisconnect();}),f$2(this,"restart",async()=>{await this.restore(),await this.onRestart();}),f$2(this,"checkPending",async()=>{if(this.pending.size===0&&(!this.initialized||!this.relayer.connected))return;const i=[];this.pending.forEach(s=>{i.push(s);}),await this.batchSubscribe(i);}),f$2(this,"registerEventListeners",()=>{this.relayer.core.heartbeat.on(r$3.pulse,async()=>{await this.checkPending();}),this.events.on($$3.created,async i=>{const s=$$3.created;this.logger.info(`Emitting ${s}`),this.logger.debug({type:"event",event:s,data:i}),await this.persist();}),this.events.on($$3.deleted,async i=>{const s=$$3.deleted;this.logger.info(`Emitting ${s}`),this.logger.debug({type:"event",event:s,data:i}),await this.persist();});}),this.relayer=e,this.logger=E$4(t,this.name),this.clientId="";}get context(){return y$6(this.logger)}get storageKey(){return this.storagePrefix+this.version+this.relayer.core.customStoragePrefix+"//"+this.name}get length(){return this.subscriptions.size}get ids(){return Array.from(this.subscriptions.keys())}get values(){return Array.from(this.subscriptions.values())}get topics(){return this.topicMap.topics}get hasAnyTopics(){return this.topicMap.topics.length>0||this.pending.size>0||this.cached.length>0||this.subscriptions.size>0}hasSubscription(e,t){let i=false;try{i=this.getSubscription(e).topic===t;}catch{}return i}reset(){this.cached=[],this.initialized=true;}onDisable(){this.values.length>0&&(this.cached=this.values),this.subscriptions.clear(),this.topicMap.clear();}async unsubscribeByTopic(e,t){const i=this.topicMap.get(e);await Promise.all(i.map(async s=>await this.unsubscribeById(e,s,t)));}async unsubscribeById(e,t,i){this.logger.debug("Unsubscribing Topic"),this.logger.trace({type:"method",method:"unsubscribe",params:{topic:e,id:t,opts:i}});try{const s=Zc(i);await this.restartToComplete({topic:e,id:t,relay:s}),await this.rpcUnsubscribe(e,t,s);const n=Nt$1("USER_DISCONNECTED",`${this.name}, ${e}`);await this.onUnsubscribe(e,t,n),this.logger.debug("Successfully Unsubscribed Topic"),this.logger.trace({type:"method",method:"unsubscribe",params:{topic:e,id:t,opts:i}});}catch(s){throw this.logger.debug("Failed to Unsubscribe Topic"),this.logger.error(s),s}}async rpcSubscribe(e,t,i){var s;(!i||i?.transportType===Q$1.relay)&&await this.restartToComplete({topic:e,id:e,relay:t});const n={method:Yc(t.protocol).subscribe,params:{topic:e}};this.logger.debug("Outgoing Relay Payload"),this.logger.trace({type:"payload",direction:"outgoing",request:n});const o=(s=i?.internal)==null?void 0:s.throwOnFailedPublish;try{const a=await this.getSubscriptionId(e);if(i?.transportType===Q$1.link_mode)return setTimeout(()=>{(this.relayer.connected||this.relayer.connecting)&&this.relayer.request(n).catch(l=>this.logger.warn(l));},cjsExports$1.toMiliseconds(cjsExports$1.ONE_SECOND)),a;const c=new Promise(async l=>{const d=g=>{g.topic===e&&(this.events.removeListener($$3.created,d),l(g.id));};this.events.on($$3.created,d);try{const g=await yi$1(new Promise((_,u)=>{this.relayer.request(n).catch(b=>{this.logger.warn(b,b?.message),u(b);}).then(_);}),this.initialSubscribeTimeout,`Subscribing to ${e} failed, please try again`);this.events.removeListener($$3.created,d),l(g);}catch{}}),h=await yi$1(c,this.subscribeTimeout,`Subscribing to ${e} failed, please try again`);if(!h&&o)throw new Error(`Subscribing to ${e} failed, please try again`);return h?a:null}catch(a){if(this.logger.debug("Outgoing Relay Subscribe Payload stalled"),this.relayer.events.emit(C$2.connection_stalled),o)throw a}return null}async rpcBatchSubscribe(e){if(!e.length)return;const t=e[0].relay,i={method:Yc(t.protocol).batchSubscribe,params:{topics:e.map(s=>s.topic)}};this.logger.debug("Outgoing Relay Payload"),this.logger.trace({type:"payload",direction:"outgoing",request:i});try{await await yi$1(new Promise(s=>{this.relayer.request(i).catch(n=>this.logger.warn(n)).then(s);}),this.subscribeTimeout,"rpcBatchSubscribe failed, please try again");}catch{this.relayer.events.emit(C$2.connection_stalled);}}async rpcBatchFetchMessages(e){if(!e.length)return;const t=e[0].relay,i={method:Yc(t.protocol).batchFetchMessages,params:{topics:e.map(n=>n.topic)}};this.logger.debug("Outgoing Relay Payload"),this.logger.trace({type:"payload",direction:"outgoing",request:i});let s;try{s=await await yi$1(new Promise((n,o)=>{this.relayer.request(i).catch(a=>{this.logger.warn(a),o(a);}).then(n);}),this.subscribeTimeout,"rpcBatchFetchMessages failed, please try again");}catch{this.relayer.events.emit(C$2.connection_stalled);}return s}rpcUnsubscribe(e,t,i){const s={method:Yc(i.protocol).unsubscribe,params:{topic:e,id:t}};return this.logger.debug("Outgoing Relay Payload"),this.logger.trace({type:"payload",direction:"outgoing",request:s}),this.relayer.request(s)}onSubscribe(e,t){this.setSubscription(e,He$1(ge$1({},t),{id:e})),this.pending.delete(t.topic);}onBatchSubscribe(e){e.length&&e.forEach(t=>{this.setSubscription(t.id,ge$1({},t)),this.pending.delete(t.topic);});}async onUnsubscribe(e,t,i){this.events.removeAllListeners(t),this.hasSubscription(t,e)&&this.deleteSubscription(t,i),await this.relayer.messages.del(e);}async setRelayerSubscriptions(e){await this.relayer.core.storage.setItem(this.storageKey,e);}async getRelayerSubscriptions(){return await this.relayer.core.storage.getItem(this.storageKey)}setSubscription(e,t){this.logger.debug("Setting subscription"),this.logger.trace({type:"method",method:"setSubscription",id:e,subscription:t}),this.addSubscription(e,t);}addSubscription(e,t){this.subscriptions.set(e,ge$1({},t)),this.topicMap.set(t.topic,e),this.events.emit($$3.created,t);}getSubscription(e){this.logger.debug("Getting subscription"),this.logger.trace({type:"method",method:"getSubscription",id:e});const t=this.subscriptions.get(e);if(!t){const{message:i}=ht$2("NO_MATCHING_KEY",`${this.name}: ${e}`);throw new Error(i)}return t}deleteSubscription(e,t){this.logger.debug("Deleting subscription"),this.logger.trace({type:"method",method:"deleteSubscription",id:e,reason:t});const i=this.getSubscription(e);this.subscriptions.delete(e),this.topicMap.delete(i.topic,e),this.events.emit($$3.deleted,He$1(ge$1({},i),{reason:t}));}async persist(){await this.setRelayerSubscriptions(this.values),this.events.emit($$3.sync);}async onRestart(){if(this.cached.length){const e=[...this.cached],t=Math.ceil(this.cached.length/this.batchSubscribeTopicsLimit);for(let i=0;i<t;i++){const s=e.splice(0,this.batchSubscribeTopicsLimit);await this.batchSubscribe(s);}}this.events.emit($$3.resubscribed);}async restore(){try{const e=await this.getRelayerSubscriptions();if(typeof e>"u"||!e.length)return;if(this.subscriptions.size){const{message:t}=ht$2("RESTORE_WILL_OVERRIDE",this.name);throw this.logger.error(t),this.logger.error(`${this.name}: ${JSON.stringify(this.values)}`),new Error(t)}this.cached=e,this.logger.debug(`Successfully Restored subscriptions for ${this.name}`),this.logger.trace({type:"method",method:"restore",subscriptions:this.values});}catch(e){this.logger.debug(`Failed to Restore subscriptions for ${this.name}`),this.logger.error(e);}}async batchSubscribe(e){e.length&&(await this.rpcBatchSubscribe(e),this.onBatchSubscribe(await Promise.all(e.map(async t=>He$1(ge$1({},t),{id:await this.getSubscriptionId(t.topic)})))));}async batchFetchMessages(e){if(!e.length)return;this.logger.trace(`Fetching batch messages for ${e.length} subscriptions`);const t=await this.rpcBatchFetchMessages(e);t&&t.messages&&(await Ni$1(cjsExports$1.toMiliseconds(cjsExports$1.ONE_SECOND)),await this.relayer.handleBatchMessageEvents(t.messages));}async onConnect(){await this.restart(),this.reset();}onDisconnect(){this.onDisable();}isInitialized(){if(!this.initialized){const{message:e}=ht$2("NOT_INITIALIZED",this.name);throw new Error(e)}}async restartToComplete(e){!this.relayer.connected&&!this.relayer.connecting&&(this.cached.push(e),await this.relayer.transportOpen());}async getClientId(){return this.clientId||(this.clientId=await this.relayer.core.crypto.getClientId()),this.clientId}async getSubscriptionId(e){return kc(e+await this.getClientId())}}var eo=Object.defineProperty,Ci=Object.getOwnPropertySymbols,to=Object.prototype.hasOwnProperty,io=Object.prototype.propertyIsEnumerable,Ye$1=(r,e,t)=>e in r?eo(r,e,{enumerable:true,configurable:true,writable:true,value:t}):r[e]=t,Pi=(r,e)=>{for(var t in e||(e={}))to.call(e,t)&&Ye$1(r,t,e[t]);if(Ci)for(var t of Ci(e))io.call(e,t)&&Ye$1(r,t,e[t]);return r},y$3=(r,e,t)=>Ye$1(r,typeof e!="symbol"?e+"":e,t);class Si extends d$3{constructor(e){super(e),y$3(this,"protocol","wc"),y$3(this,"version",2),y$3(this,"core"),y$3(this,"logger"),y$3(this,"events",new EventEmitter),y$3(this,"provider"),y$3(this,"messages"),y$3(this,"subscriber"),y$3(this,"publisher"),y$3(this,"name",$t),y$3(this,"transportExplicitlyClosed",false),y$3(this,"initialized",false),y$3(this,"connectionAttemptInProgress",false),y$3(this,"relayUrl"),y$3(this,"projectId"),y$3(this,"packageName"),y$3(this,"bundleId"),y$3(this,"hasExperiencedNetworkDisruption",false),y$3(this,"pingTimeout"),y$3(this,"heartBeatTimeout",cjsExports$1.toMiliseconds(cjsExports$1.THIRTY_SECONDS+cjsExports$1.FIVE_SECONDS)),y$3(this,"reconnectTimeout"),y$3(this,"connectPromise"),y$3(this,"reconnectInProgress",false),y$3(this,"requestsInFlight",[]),y$3(this,"connectTimeout",cjsExports$1.toMiliseconds(cjsExports$1.ONE_SECOND*15)),y$3(this,"request",async t=>{var i,s;this.logger.debug("Publishing Request Payload");const n=t.id||getBigIntRpcId().toString();await this.toEstablishConnection();try{this.logger.trace({id:n,method:t.method,topic:(i=t.params)==null?void 0:i.topic},"relayer.request - publishing...");const o=`${n}:${((s=t.params)==null?void 0:s.tag)||""}`;this.requestsInFlight.push(o);const a=await this.provider.request(t);return this.requestsInFlight=this.requestsInFlight.filter(c=>c!==o),a}catch(o){throw this.logger.debug(`Failed to Publish Request: ${n}`),o}}),y$3(this,"resetPingTimeout",()=>{_e$3()&&(clearTimeout(this.pingTimeout),this.pingTimeout=setTimeout(()=>{var t,i,s,n;try{this.logger.debug({},"pingTimeout: Connection stalled, terminating..."),(n=(s=(i=(t=this.provider)==null?void 0:t.connection)==null?void 0:i.socket)==null?void 0:s.terminate)==null||n.call(s);}catch(o){this.logger.warn(o,o?.message);}},this.heartBeatTimeout));}),y$3(this,"onPayloadHandler",t=>{this.onProviderPayload(t),this.resetPingTimeout();}),y$3(this,"onConnectHandler",()=>{this.logger.warn({},"Relayer connected \u{1F6DC}"),this.startPingTimeout(),this.events.emit(C$2.connect);}),y$3(this,"onDisconnectHandler",()=>{this.logger.warn({},"Relayer disconnected \u{1F6D1}"),this.requestsInFlight=[],this.onProviderDisconnect();}),y$3(this,"onProviderErrorHandler",t=>{this.logger.fatal(`Fatal socket error: ${t.message}`),this.events.emit(C$2.error,t),this.logger.fatal("Fatal socket error received, closing transport"),this.transportClose();}),y$3(this,"registerProviderListeners",()=>{this.provider.on(L$2.payload,this.onPayloadHandler),this.provider.on(L$2.connect,this.onConnectHandler),this.provider.on(L$2.disconnect,this.onDisconnectHandler),this.provider.on(L$2.error,this.onProviderErrorHandler);}),this.core=e.core,this.logger=typeof e.logger<"u"&&typeof e.logger!="string"?E$4(e.logger,this.name):Ot$2(k$4({level:e.logger||Nt})),this.messages=new _i(this.logger,e.core),this.subscriber=new Ti(this,this.logger),this.publisher=new qn(this,this.logger),this.relayUrl=e?.relayUrl||Ue$2,this.projectId=e.projectId,ei$1()?this.packageName=ri$1():ni$1()&&(this.bundleId=ri$1()),this.provider={};}async init(){if(this.logger.trace("Initialized"),this.registerEventListeners(),await Promise.all([this.messages.init(),this.subscriber.init()]),this.initialized=true,this.subscriber.hasAnyTopics)try{await this.transportOpen();}catch(e){this.logger.warn(e,e?.message);}}get context(){return y$6(this.logger)}get connected(){var e,t,i;return ((i=(t=(e=this.provider)==null?void 0:e.connection)==null?void 0:t.socket)==null?void 0:i.readyState)===1||false}get connecting(){var e,t,i;return ((i=(t=(e=this.provider)==null?void 0:e.connection)==null?void 0:t.socket)==null?void 0:i.readyState)===0||this.connectPromise!==void 0||false}async publish(e,t,i){this.isInitialized(),await this.publisher.publish(e,t,i),await this.recordMessageEvent({topic:e,message:t,publishedAt:Date.now(),transportType:Q$1.relay},le$1.outbound);}async subscribe(e,t){var i,s,n;this.isInitialized(),(!(t!=null&&t.transportType)||t?.transportType==="relay")&&await this.toEstablishConnection();const o=typeof((i=t?.internal)==null?void 0:i.throwOnFailedPublish)>"u"?true:(s=t?.internal)==null?void 0:s.throwOnFailedPublish;let a=((n=this.subscriber.topicMap.get(e))==null?void 0:n[0])||"",c;const h=l=>{l.topic===e&&(this.subscriber.off($$3.created,h),c());};return await Promise.all([new Promise(l=>{c=l,this.subscriber.on($$3.created,h);}),new Promise(async(l,d)=>{a=await this.subscriber.subscribe(e,Pi({internal:{throwOnFailedPublish:o}},t)).catch(g=>{o&&d(g);})||a,l();})]),a}async unsubscribe(e,t){this.isInitialized(),await this.subscriber.unsubscribe(e,t);}on(e,t){this.events.on(e,t);}once(e,t){this.events.once(e,t);}off(e,t){this.events.off(e,t);}removeListener(e,t){this.events.removeListener(e,t);}async transportDisconnect(){this.provider.disconnect&&(this.hasExperiencedNetworkDisruption||this.connected)?await yi$1(this.provider.disconnect(),2e3,"provider.disconnect()").catch(()=>this.onProviderDisconnect()):this.onProviderDisconnect();}async transportClose(){this.transportExplicitlyClosed=true,await this.transportDisconnect();}async transportOpen(e){if(!this.subscriber.hasAnyTopics){this.logger.warn("Starting WS connection skipped because the client has no topics to work with.");return}if(this.connectPromise?(this.logger.debug({},"Waiting for existing connection attempt to resolve..."),await this.connectPromise,this.logger.debug({},"Existing connection attempt resolved")):(this.connectPromise=new Promise(async(t,i)=>{await this.connect(e).then(t).catch(i).finally(()=>{this.connectPromise=void 0;});}),await this.connectPromise),!this.connected)throw new Error(`Couldn't establish socket connection to the relay server: ${this.relayUrl}`)}async restartTransport(e){this.logger.debug({},"Restarting transport..."),!this.connectionAttemptInProgress&&(this.relayUrl=e||this.relayUrl,await this.confirmOnlineStateOrThrow(),await this.transportClose(),await this.transportOpen());}async confirmOnlineStateOrThrow(){if(!await Na())throw new Error("No internet connection detected. Please restart your network and try again.")}async handleBatchMessageEvents(e){if(e?.length===0){this.logger.trace("Batch message events is empty. Ignoring...");return}const t=e.sort((i,s)=>i.publishedAt-s.publishedAt);this.logger.debug(`Batch of ${t.length} message events sorted`);for(const i of t)try{await this.onMessageEvent(i);}catch(s){this.logger.warn(s,"Error while processing batch message event: "+s?.message);}this.logger.trace(`Batch of ${t.length} message events processed`);}async onLinkMessageEvent(e,t){const{topic:i}=e;if(!t.sessionExists){const s=Ei$1(cjsExports$1.FIVE_MINUTES),n={topic:i,expiry:s,relay:{protocol:"irn"},active:false};await this.core.pairing.pairings.set(i,n);}this.events.emit(C$2.message,e),await this.recordMessageEvent(e,le$1.inbound);}async connect(e){await this.confirmOnlineStateOrThrow(),e&&e!==this.relayUrl&&(this.relayUrl=e,await this.transportDisconnect()),this.connectionAttemptInProgress=true,this.transportExplicitlyClosed=false;let t=1;for(;t<6;){try{if(this.transportExplicitlyClosed)break;this.logger.debug({},`Connecting to ${this.relayUrl}, attempt: ${t}...`),await this.createProvider(),await new Promise(async(i,s)=>{const n=()=>{s(new Error("Connection interrupted while trying to subscribe"));};this.provider.once(L$2.disconnect,n),await yi$1(new Promise((o,a)=>{this.provider.connect().then(o).catch(a);}),this.connectTimeout,`Socket stalled when trying to connect to ${this.relayUrl}`).catch(o=>{s(o);}).finally(()=>{this.provider.off(L$2.disconnect,n),clearTimeout(this.reconnectTimeout);}),await new Promise(async(o,a)=>{const c=()=>{a(new Error("Connection interrupted while trying to subscribe"));};this.provider.once(L$2.disconnect,c),await this.subscriber.start().then(o).catch(a).finally(()=>{this.provider.off(L$2.disconnect,c);});}),this.hasExperiencedNetworkDisruption=!1,i();});}catch(i){await this.subscriber.stop();const s=i;this.logger.warn({},s.message),this.hasExperiencedNetworkDisruption=true;}finally{this.connectionAttemptInProgress=false;}if(this.connected){this.logger.debug({},`Connected to ${this.relayUrl} successfully on attempt: ${t}`);break}await new Promise(i=>setTimeout(i,cjsExports$1.toMiliseconds(t*1))),t++;}}startPingTimeout(){var e,t,i,s,n;if(_e$3())try{(t=(e=this.provider)==null?void 0:e.connection)!=null&&t.socket&&((n=(s=(i=this.provider)==null?void 0:i.connection)==null?void 0:s.socket)==null||n.on("ping",()=>{this.resetPingTimeout();})),this.resetPingTimeout();}catch(o){this.logger.warn(o,o?.message);}}async createProvider(){this.provider.connection&&this.unregisterProviderListeners();const e=await this.core.crypto.signJWT(this.relayUrl);this.provider=new o$4(new f$4(si$1({sdkVersion:_e$2,protocol:this.protocol,version:this.version,relayUrl:this.relayUrl,projectId:this.projectId,auth:e,useOnCloseEvent:true,bundleId:this.bundleId,packageName:this.packageName}))),this.registerProviderListeners();}async recordMessageEvent(e,t){const{topic:i,message:s}=e;await this.messages.set(i,s,t);}async shouldIgnoreMessageEvent(e){const{topic:t,message:i}=e;if(!i||i.length===0)return this.logger.warn(`Ignoring invalid/empty message: ${i}`),true;if(!await this.subscriber.isKnownTopic(t))return this.logger.warn(`Ignoring message for unknown topic ${t}`),true;const s=this.messages.has(t,i);return s&&this.logger.warn(`Ignoring duplicate message: ${i}`),s}async onProviderPayload(e){if(this.logger.debug("Incoming Relay Payload"),this.logger.trace({type:"payload",direction:"incoming",payload:e}),isJsonRpcRequest(e)){if(!e.method.endsWith(zt$1))return;const t=e.params,{topic:i,message:s,publishedAt:n,attestation:o}=t.data,a={topic:i,message:s,publishedAt:n,transportType:Q$1.relay,attestation:o};this.logger.debug("Emitting Relayer Payload"),this.logger.trace(Pi({type:"event",event:t.id},a)),this.events.emit(t.id,a),await this.acknowledgePayload(e),await this.onMessageEvent(a);}else isJsonRpcResponse(e)&&this.events.emit(C$2.message_ack,e);}async onMessageEvent(e){await this.shouldIgnoreMessageEvent(e)||(await this.recordMessageEvent(e,le$1.inbound),this.events.emit(C$2.message,e));}async acknowledgePayload(e){const t=formatJsonRpcResult(e.id,true);await this.provider.connection.send(t);}unregisterProviderListeners(){this.provider.off(L$2.payload,this.onPayloadHandler),this.provider.off(L$2.connect,this.onConnectHandler),this.provider.off(L$2.disconnect,this.onDisconnectHandler),this.provider.off(L$2.error,this.onProviderErrorHandler),clearTimeout(this.pingTimeout);}async registerEventListeners(){let e=await Na();Ua(async t=>{e!==t&&(e=t,t?await this.transportOpen().catch(i=>this.logger.error(i,i?.message)):(this.hasExperiencedNetworkDisruption=true,await this.transportDisconnect(),this.transportExplicitlyClosed=false));}),this.core.heartbeat.on(r$3.pulse,async()=>{if(!this.transportExplicitlyClosed&&!this.connected&&Ta())try{await this.confirmOnlineStateOrThrow(),await this.transportOpen();}catch(t){this.logger.warn(t,t?.message);}});}async onProviderDisconnect(){clearTimeout(this.pingTimeout),this.events.emit(C$2.disconnect),this.connectionAttemptInProgress=false,!this.reconnectInProgress&&(this.reconnectInProgress=true,await this.subscriber.stop(),this.subscriber.hasAnyTopics&&(this.transportExplicitlyClosed||(this.reconnectTimeout=setTimeout(async()=>{await this.transportOpen().catch(e=>this.logger.error(e,e?.message)),this.reconnectTimeout=void 0,this.reconnectInProgress=false;},cjsExports$1.toMiliseconds(Lt$1)))));}isInitialized(){if(!this.initialized){const{message:e}=ht$2("NOT_INITIALIZED",this.name);throw new Error(e)}}async toEstablishConnection(){if(await this.confirmOnlineStateOrThrow(),!this.connected){if(this.connectPromise){await this.connectPromise;return}await this.connect();}}}function so(){}function Oi(r){if(!r||typeof r!="object")return  false;const e=Object.getPrototypeOf(r);return e===null||e===Object.prototype||Object.getPrototypeOf(e)===null?Object.prototype.toString.call(r)==="[object Object]":false}function Ri(r){return Object.getOwnPropertySymbols(r).filter(e=>Object.prototype.propertyIsEnumerable.call(r,e))}function Ai(r){return r==null?r===void 0?"[object Undefined]":"[object Null]":Object.prototype.toString.call(r)}const ro="[object RegExp]",no="[object String]",oo="[object Number]",ao="[object Boolean]",xi="[object Arguments]",co="[object Symbol]",ho="[object Date]",lo="[object Map]",uo="[object Set]",go="[object Array]",po="[object Function]",yo="[object ArrayBuffer]",Je$1="[object Object]",bo="[object Error]",mo="[object DataView]",fo="[object Uint8Array]",Do="[object Uint8ClampedArray]",vo="[object Uint16Array]",wo="[object Uint32Array]",_o="[object BigUint64Array]",Eo="[object Int8Array]",Io="[object Int16Array]",To="[object Int32Array]",Co="[object BigInt64Array]",Po="[object Float32Array]",So="[object Float64Array]";function Oo(r,e){return r===e||Number.isNaN(r)&&Number.isNaN(e)}function Ro(r,e,t){return pe$1(r,e,void 0,void 0,void 0,void 0,t)}function pe$1(r,e,t,i,s,n,o){const a=o(r,e,t,i,s,n);if(a!==void 0)return a;if(typeof r==typeof e)switch(typeof r){case "bigint":case "string":case "boolean":case "symbol":case "undefined":return r===e;case "number":return r===e||Object.is(r,e);case "function":return r===e;case "object":return ye$1(r,e,n,o)}return ye$1(r,e,n,o)}function ye$1(r,e,t,i){if(Object.is(r,e))return  true;let s=Ai(r),n=Ai(e);if(s===xi&&(s=Je$1),n===xi&&(n=Je$1),s!==n)return  false;switch(s){case no:return r.toString()===e.toString();case oo:{const c=r.valueOf(),h=e.valueOf();return Oo(c,h)}case ao:case ho:case co:return Object.is(r.valueOf(),e.valueOf());case ro:return r.source===e.source&&r.flags===e.flags;case po:return r===e}t=t??new Map;const o=t.get(r),a=t.get(e);if(o!=null&&a!=null)return o===e;t.set(r,e),t.set(e,r);try{switch(s){case lo:{if(r.size!==e.size)return !1;for(const[c,h]of r.entries())if(!e.has(c)||!pe$1(h,e.get(c),c,r,e,t,i))return !1;return !0}case uo:{if(r.size!==e.size)return !1;const c=Array.from(r.values()),h=Array.from(e.values());for(let l=0;l<c.length;l++){const d=c[l],g=h.findIndex(_=>pe$1(d,_,void 0,r,e,t,i));if(g===-1)return !1;h.splice(g,1);}return !0}case go:case fo:case Do:case vo:case wo:case _o:case Eo:case Io:case To:case Co:case Po:case So:{if(typeof Buffer<"u"&&Buffer.isBuffer(r)!==Buffer.isBuffer(e)||r.length!==e.length)return !1;for(let c=0;c<r.length;c++)if(!pe$1(r[c],e[c],c,r,e,t,i))return !1;return !0}case yo:return r.byteLength!==e.byteLength?!1:ye$1(new Uint8Array(r),new Uint8Array(e),t,i);case mo:return r.byteLength!==e.byteLength||r.byteOffset!==e.byteOffset?!1:ye$1(new Uint8Array(r),new Uint8Array(e),t,i);case bo:return r.name===e.name&&r.message===e.message;case Je$1:{if(!(ye$1(r.constructor,e.constructor,t,i)||Oi(r)&&Oi(e)))return !1;const h=[...Object.keys(r),...Ri(r)],l=[...Object.keys(e),...Ri(e)];if(h.length!==l.length)return !1;for(let d=0;d<h.length;d++){const g=h[d],_=r[g];if(!Object.hasOwn(e,g))return !1;const u=e[g];if(!pe$1(_,u,g,r,e,t,i))return !1}return !0}default:return !1}}finally{t.delete(r),t.delete(e);}}function Ao(r,e){return Ro(r,e,so)}var xo=Object.defineProperty,Ni=Object.getOwnPropertySymbols,No=Object.prototype.hasOwnProperty,$o=Object.prototype.propertyIsEnumerable,Xe$1=(r,e,t)=>e in r?xo(r,e,{enumerable:true,configurable:true,writable:true,value:t}):r[e]=t,$i=(r,e)=>{for(var t in e||(e={}))No.call(e,t)&&Xe$1(r,t,e[t]);if(Ni)for(var t of Ni(e))$o.call(e,t)&&Xe$1(r,t,e[t]);return r},z$1=(r,e,t)=>Xe$1(r,typeof e!="symbol"?e+"":e,t);class zi extends f$3{constructor(e,t,i,s=B$2,n=void 0){super(e,t,i,s),this.core=e,this.logger=t,this.name=i,z$1(this,"map",new Map),z$1(this,"version",kt$1),z$1(this,"cached",[]),z$1(this,"initialized",false),z$1(this,"getKey"),z$1(this,"storagePrefix",B$2),z$1(this,"recentlyDeleted",[]),z$1(this,"recentlyDeletedLimit",200),z$1(this,"init",async()=>{this.initialized||(this.logger.trace("Initialized"),await this.restore(),this.cached.forEach(o=>{this.getKey&&o!==null&&!Et$2(o)?this.map.set(this.getKey(o),o):la(o)?this.map.set(o.id,o):da(o)&&this.map.set(o.topic,o);}),this.cached=[],this.initialized=true);}),z$1(this,"set",async(o,a)=>{this.isInitialized(),this.map.has(o)?await this.update(o,a):(this.logger.debug("Setting value"),this.logger.trace({type:"method",method:"set",key:o,value:a}),this.map.set(o,a),await this.persist());}),z$1(this,"get",o=>(this.isInitialized(),this.logger.debug("Getting value"),this.logger.trace({type:"method",method:"get",key:o}),this.getData(o))),z$1(this,"getAll",o=>(this.isInitialized(),o?this.values.filter(a=>Object.keys(o).every(c=>Ao(a[c],o[c]))):this.values)),z$1(this,"update",async(o,a)=>{this.isInitialized(),this.logger.debug("Updating value"),this.logger.trace({type:"method",method:"update",key:o,update:a});const c=$i($i({},this.getData(o)),a);this.map.set(o,c),await this.persist();}),z$1(this,"delete",async(o,a)=>{this.isInitialized(),this.map.has(o)&&(this.logger.debug("Deleting value"),this.logger.trace({type:"method",method:"delete",key:o,reason:a}),this.map.delete(o),this.addToRecentlyDeleted(o),await this.persist());}),this.logger=E$4(t,this.name),this.storagePrefix=s,this.getKey=n;}get context(){return y$6(this.logger)}get storageKey(){return this.storagePrefix+this.version+this.core.customStoragePrefix+"//"+this.name}get length(){return this.map.size}get keys(){return Array.from(this.map.keys())}get values(){return Array.from(this.map.values())}addToRecentlyDeleted(e){this.recentlyDeleted.push(e),this.recentlyDeleted.length>=this.recentlyDeletedLimit&&this.recentlyDeleted.splice(0,this.recentlyDeletedLimit/2);}async setDataStore(e){await this.core.storage.setItem(this.storageKey,e);}async getDataStore(){return await this.core.storage.getItem(this.storageKey)}getData(e){const t=this.map.get(e);if(!t){if(this.recentlyDeleted.includes(e)){const{message:s}=ht$2("MISSING_OR_INVALID",`Record was recently deleted - ${this.name}: ${e}`);throw this.logger.error(s),new Error(s)}const{message:i}=ht$2("NO_MATCHING_KEY",`${this.name}: ${e}`);throw this.logger.error(i),new Error(i)}return t}async persist(){await this.setDataStore(this.values);}async restore(){try{const e=await this.getDataStore();if(typeof e>"u"||!e.length)return;if(this.map.size){const{message:t}=ht$2("RESTORE_WILL_OVERRIDE",this.name);throw this.logger.error(t),new Error(t)}this.cached=e,this.logger.debug(`Successfully Restored value for ${this.name}`),this.logger.trace({type:"method",method:"restore",value:this.values});}catch(e){this.logger.debug(`Failed to Restore value for ${this.name}`),this.logger.error(e);}}isInitialized(){if(!this.initialized){const{message:e}=ht$2("NOT_INITIALIZED",this.name);throw new Error(e)}}}var zo=Object.defineProperty,Lo=(r,e,t)=>e in r?zo(r,e,{enumerable:true,configurable:true,writable:true,value:t}):r[e]=t,p$2=(r,e,t)=>Lo(r,typeof e!="symbol"?e+"":e,t);class Li{constructor(e,t){this.core=e,this.logger=t,p$2(this,"name",Mt$1),p$2(this,"version",Kt$1),p$2(this,"events",new require$$0),p$2(this,"pairings"),p$2(this,"initialized",false),p$2(this,"storagePrefix",B$2),p$2(this,"ignoredPayloadTypes",[Ft$2]),p$2(this,"registeredMethods",[]),p$2(this,"init",async()=>{this.initialized||(await this.pairings.init(),await this.cleanup(),this.registerRelayerEvents(),this.registerExpirerEvents(),this.initialized=true,this.logger.trace("Initialized"));}),p$2(this,"register",({methods:i})=>{this.isInitialized(),this.registeredMethods=[...new Set([...this.registeredMethods,...i])];}),p$2(this,"create",async i=>{this.isInitialized();const s=jc(),n=await this.core.crypto.setSymKey(s),o=Ei$1(cjsExports$1.FIVE_MINUTES),a={protocol:xt$1},c={topic:n,expiry:o,relay:a,active:false,methods:i?.methods},h=Wc({protocol:this.core.protocol,version:this.core.version,topic:n,symKey:s,relay:a,expiryTimestamp:o,methods:i?.methods});return this.events.emit(re$1.create,c),this.core.expirer.set(n,o),await this.pairings.set(n,c),await this.core.relayer.subscribe(n,{transportType:i?.transportType}),{topic:n,uri:h}}),p$2(this,"pair",async i=>{this.isInitialized();const s=this.core.eventClient.createEvent({properties:{topic:i?.uri,trace:[G.pairing_started]}});this.isValidPair(i,s);const{topic:n,symKey:o,relay:a,expiryTimestamp:c,methods:h}=Gc(i.uri);s.props.properties.topic=n,s.addTrace(G.pairing_uri_validation_success),s.addTrace(G.pairing_uri_not_expired);let l;if(this.pairings.keys.includes(n)){if(l=this.pairings.get(n),s.addTrace(G.existing_pairing),l.active)throw s.setError(Y$1.active_pairing_already_exists),new Error(`Pairing already exists: ${n}. Please try again with a new connection URI.`);s.addTrace(G.pairing_not_expired);}const d=c||Ei$1(cjsExports$1.FIVE_MINUTES),g={topic:n,relay:a,expiry:d,active:false,methods:h};this.core.expirer.set(n,d),await this.pairings.set(n,g),s.addTrace(G.store_new_pairing),i.activatePairing&&await this.activate({topic:n}),this.events.emit(re$1.create,g),s.addTrace(G.emit_inactive_pairing),this.core.crypto.keychain.has(n)||await this.core.crypto.setSymKey(o,n),s.addTrace(G.subscribing_pairing_topic);try{await this.core.relayer.confirmOnlineStateOrThrow();}catch{s.setError(Y$1.no_internet_connection);}try{await this.core.relayer.subscribe(n,{relay:a});}catch(_){throw s.setError(Y$1.subscribe_pairing_topic_failure),_}return s.addTrace(G.subscribe_pairing_topic_success),g}),p$2(this,"activate",async({topic:i})=>{this.isInitialized();const s=Ei$1(cjsExports$1.FIVE_MINUTES);this.core.expirer.set(i,s),await this.pairings.update(i,{active:true,expiry:s});}),p$2(this,"ping",async i=>{this.isInitialized(),await this.isValidPing(i),this.logger.warn("ping() is deprecated and will be removed in the next major release.");const{topic:s}=i;if(this.pairings.keys.includes(s)){const n=await this.sendRequest(s,"wc_pairingPing",{}),{done:o,resolve:a,reject:c}=gi$1();this.events.once(xi$1("pairing_ping",n),({error:h})=>{h?c(h):a();}),await o();}}),p$2(this,"updateExpiry",async({topic:i,expiry:s})=>{this.isInitialized(),await this.pairings.update(i,{expiry:s});}),p$2(this,"updateMetadata",async({topic:i,metadata:s})=>{this.isInitialized(),await this.pairings.update(i,{peerMetadata:s});}),p$2(this,"getPairings",()=>(this.isInitialized(),this.pairings.values)),p$2(this,"disconnect",async i=>{this.isInitialized(),await this.isValidDisconnect(i);const{topic:s}=i;this.pairings.keys.includes(s)&&(await this.sendRequest(s,"wc_pairingDelete",Nt$1("USER_DISCONNECTED")),await this.deletePairing(s));}),p$2(this,"formatUriFromPairing",i=>{this.isInitialized();const{topic:s,relay:n,expiry:o,methods:a}=i,c=this.core.crypto.keychain.get(s);return Wc({protocol:this.core.protocol,version:this.core.version,topic:s,symKey:c,relay:n,expiryTimestamp:o,methods:a})}),p$2(this,"sendRequest",async(i,s,n)=>{const o=formatJsonRpcRequest(s,n),a=await this.core.crypto.encode(i,o),c=se$1[s].req;return this.core.history.set(i,o),this.core.relayer.publish(i,a,c),o.id}),p$2(this,"sendResult",async(i,s,n)=>{const o=formatJsonRpcResult(i,n),a=await this.core.crypto.encode(s,o),c=(await this.core.history.get(s,i)).request.method,h=se$1[c].res;await this.core.relayer.publish(s,a,h),await this.core.history.resolve(o);}),p$2(this,"sendError",async(i,s,n)=>{const o=formatJsonRpcError(i,n),a=await this.core.crypto.encode(s,o),c=(await this.core.history.get(s,i)).request.method,h=se$1[c]?se$1[c].res:se$1.unregistered_method.res;await this.core.relayer.publish(s,a,h),await this.core.history.resolve(o);}),p$2(this,"deletePairing",async(i,s)=>{await this.core.relayer.unsubscribe(i),await Promise.all([this.pairings.delete(i,Nt$1("USER_DISCONNECTED")),this.core.crypto.deleteSymKey(i),s?Promise.resolve():this.core.expirer.del(i)]);}),p$2(this,"cleanup",async()=>{const i=this.pairings.getAll().filter(s=>vi$1(s.expiry));await Promise.all(i.map(s=>this.deletePairing(s.topic)));}),p$2(this,"onRelayEventRequest",async i=>{const{topic:s,payload:n}=i;switch(n.method){case "wc_pairingPing":return await this.onPairingPingRequest(s,n);case "wc_pairingDelete":return await this.onPairingDeleteRequest(s,n);default:return await this.onUnknownRpcMethodRequest(s,n)}}),p$2(this,"onRelayEventResponse",async i=>{const{topic:s,payload:n}=i,o=(await this.core.history.get(s,n.id)).request.method;switch(o){case "wc_pairingPing":return this.onPairingPingResponse(s,n);default:return this.onUnknownRpcMethodResponse(o)}}),p$2(this,"onPairingPingRequest",async(i,s)=>{const{id:n}=s;try{this.isValidPing({topic:i}),await this.sendResult(n,i,!0),this.events.emit(re$1.ping,{id:n,topic:i});}catch(o){await this.sendError(n,i,o),this.logger.error(o);}}),p$2(this,"onPairingPingResponse",(i,s)=>{const{id:n}=s;setTimeout(()=>{isJsonRpcResult(s)?this.events.emit(xi$1("pairing_ping",n),{}):isJsonRpcError(s)&&this.events.emit(xi$1("pairing_ping",n),{error:s.error});},500);}),p$2(this,"onPairingDeleteRequest",async(i,s)=>{const{id:n}=s;try{this.isValidDisconnect({topic:i}),await this.deletePairing(i),this.events.emit(re$1.delete,{id:n,topic:i});}catch(o){await this.sendError(n,i,o),this.logger.error(o);}}),p$2(this,"onUnknownRpcMethodRequest",async(i,s)=>{const{id:n,method:o}=s;try{if(this.registeredMethods.includes(o))return;const a=Nt$1("WC_METHOD_UNSUPPORTED",o);await this.sendError(n,i,a),this.logger.error(a);}catch(a){await this.sendError(n,i,a),this.logger.error(a);}}),p$2(this,"onUnknownRpcMethodResponse",i=>{this.registeredMethods.includes(i)||this.logger.error(Nt$1("WC_METHOD_UNSUPPORTED",i));}),p$2(this,"isValidPair",(i,s)=>{var n;if(!ma(i)){const{message:a}=ht$2("MISSING_OR_INVALID",`pair() params: ${i}`);throw s.setError(Y$1.malformed_pairing_uri),new Error(a)}if(!fa(i.uri)){const{message:a}=ht$2("MISSING_OR_INVALID",`pair() uri: ${i.uri}`);throw s.setError(Y$1.malformed_pairing_uri),new Error(a)}const o=Gc(i?.uri);if(!((n=o?.relay)!=null&&n.protocol)){const{message:a}=ht$2("MISSING_OR_INVALID","pair() uri#relay-protocol");throw s.setError(Y$1.malformed_pairing_uri),new Error(a)}if(!(o!=null&&o.symKey)){const{message:a}=ht$2("MISSING_OR_INVALID","pair() uri#symKey");throw s.setError(Y$1.malformed_pairing_uri),new Error(a)}if(o!=null&&o.expiryTimestamp&&cjsExports$1.toMiliseconds(o?.expiryTimestamp)<Date.now()){s.setError(Y$1.pairing_expired);const{message:a}=ht$2("EXPIRED","pair() URI has expired. Please try again with a new connection URI.");throw new Error(a)}}),p$2(this,"isValidPing",async i=>{if(!ma(i)){const{message:n}=ht$2("MISSING_OR_INVALID",`ping() params: ${i}`);throw new Error(n)}const{topic:s}=i;await this.isValidPairingTopic(s);}),p$2(this,"isValidDisconnect",async i=>{if(!ma(i)){const{message:n}=ht$2("MISSING_OR_INVALID",`disconnect() params: ${i}`);throw new Error(n)}const{topic:s}=i;await this.isValidPairingTopic(s);}),p$2(this,"isValidPairingTopic",async i=>{if(!nt$1(i,false)){const{message:s}=ht$2("MISSING_OR_INVALID",`pairing topic should be a string: ${i}`);throw new Error(s)}if(!this.pairings.keys.includes(i)){const{message:s}=ht$2("NO_MATCHING_KEY",`pairing topic doesn't exist: ${i}`);throw new Error(s)}if(vi$1(this.pairings.get(i).expiry)){await this.deletePairing(i);const{message:s}=ht$2("EXPIRED",`pairing topic: ${i}`);throw new Error(s)}}),this.core=e,this.logger=E$4(t,this.name),this.pairings=new zi(this.core,this.logger,this.name,this.storagePrefix);}get context(){return y$6(this.logger)}isInitialized(){if(!this.initialized){const{message:e}=ht$2("NOT_INITIALIZED",this.name);throw new Error(e)}}registerRelayerEvents(){this.core.relayer.on(C$2.message,async e=>{const{topic:t,message:i,transportType:s}=e;if(this.pairings.keys.includes(t)&&s!==Q$1.link_mode&&!this.ignoredPayloadTypes.includes(this.core.crypto.getPayloadType(i)))try{const n=await this.core.crypto.decode(t,i);isJsonRpcRequest(n)?(this.core.history.set(t,n),await this.onRelayEventRequest({topic:t,payload:n})):isJsonRpcResponse(n)&&(await this.core.history.resolve(n),await this.onRelayEventResponse({topic:t,payload:n}),this.core.history.delete(t,n.id)),await this.core.relayer.messages.ack(t,i);}catch(n){this.logger.error(n);}});}registerExpirerEvents(){this.core.expirer.on(M$2.expired,async e=>{const{topic:t}=bi$1(e.target);t&&this.pairings.keys.includes(t)&&(await this.deletePairing(t,true),this.events.emit(re$1.expire,{topic:t}));});}}var ko=Object.defineProperty,jo=(r,e,t)=>e in r?ko(r,e,{enumerable:true,configurable:true,writable:true,value:t}):r[e]=t,O$1=(r,e,t)=>jo(r,typeof e!="symbol"?e+"":e,t);class ki extends I$2{constructor(e,t){super(e,t),this.core=e,this.logger=t,O$1(this,"records",new Map),O$1(this,"events",new EventEmitter),O$1(this,"name",Bt$1),O$1(this,"version",Vt$1),O$1(this,"cached",[]),O$1(this,"initialized",false),O$1(this,"storagePrefix",B$2),O$1(this,"init",async()=>{this.initialized||(this.logger.trace("Initialized"),await this.restore(),this.cached.forEach(i=>this.records.set(i.id,i)),this.cached=[],this.registerEventListeners(),this.initialized=true);}),O$1(this,"set",(i,s,n)=>{if(this.isInitialized(),this.logger.debug("Setting JSON-RPC request history record"),this.logger.trace({type:"method",method:"set",topic:i,request:s,chainId:n}),this.records.has(s.id))return;const o={id:s.id,topic:i,request:{method:s.method,params:s.params||null},chainId:n,expiry:Ei$1(cjsExports$1.THIRTY_DAYS)};this.records.set(o.id,o),this.persist(),this.events.emit(F$1.created,o);}),O$1(this,"resolve",async i=>{if(this.isInitialized(),this.logger.debug("Updating JSON-RPC response history record"),this.logger.trace({type:"method",method:"update",response:i}),!this.records.has(i.id))return;const s=await this.getRecord(i.id);typeof s.response>"u"&&(s.response=isJsonRpcError(i)?{error:i.error}:{result:i.result},this.records.set(s.id,s),this.persist(),this.events.emit(F$1.updated,s));}),O$1(this,"get",async(i,s)=>(this.isInitialized(),this.logger.debug("Getting record"),this.logger.trace({type:"method",method:"get",topic:i,id:s}),await this.getRecord(s))),O$1(this,"delete",(i,s)=>{this.isInitialized(),this.logger.debug("Deleting record"),this.logger.trace({type:"method",method:"delete",id:s}),this.values.forEach(n=>{if(n.topic===i){if(typeof s<"u"&&n.id!==s)return;this.records.delete(n.id),this.events.emit(F$1.deleted,n);}}),this.persist();}),O$1(this,"exists",async(i,s)=>(this.isInitialized(),this.records.has(s)?(await this.getRecord(s)).topic===i:false)),O$1(this,"on",(i,s)=>{this.events.on(i,s);}),O$1(this,"once",(i,s)=>{this.events.once(i,s);}),O$1(this,"off",(i,s)=>{this.events.off(i,s);}),O$1(this,"removeListener",(i,s)=>{this.events.removeListener(i,s);}),this.logger=E$4(t,this.name);}get context(){return y$6(this.logger)}get storageKey(){return this.storagePrefix+this.version+this.core.customStoragePrefix+"//"+this.name}get size(){return this.records.size}get keys(){return Array.from(this.records.keys())}get values(){return Array.from(this.records.values())}get pending(){const e=[];return this.values.forEach(t=>{if(typeof t.response<"u")return;const i={topic:t.topic,request:formatJsonRpcRequest(t.request.method,t.request.params,t.id),chainId:t.chainId};return e.push(i)}),e}async setJsonRpcRecords(e){await this.core.storage.setItem(this.storageKey,e);}async getJsonRpcRecords(){return await this.core.storage.getItem(this.storageKey)}getRecord(e){this.isInitialized();const t=this.records.get(e);if(!t){const{message:i}=ht$2("NO_MATCHING_KEY",`${this.name}: ${e}`);throw new Error(i)}return t}async persist(){await this.setJsonRpcRecords(this.values),this.events.emit(F$1.sync);}async restore(){try{const e=await this.getJsonRpcRecords();if(typeof e>"u"||!e.length)return;if(this.records.size){const{message:t}=ht$2("RESTORE_WILL_OVERRIDE",this.name);throw this.logger.error(t),new Error(t)}this.cached=e,this.logger.debug(`Successfully Restored records for ${this.name}`),this.logger.trace({type:"method",method:"restore",records:this.values});}catch(e){this.logger.debug(`Failed to Restore records for ${this.name}`),this.logger.error(e);}}registerEventListeners(){this.events.on(F$1.created,e=>{const t=F$1.created;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,record:e});}),this.events.on(F$1.updated,e=>{const t=F$1.updated;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,record:e});}),this.events.on(F$1.deleted,e=>{const t=F$1.deleted;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,record:e});}),this.core.heartbeat.on(r$3.pulse,()=>{this.cleanup();});}cleanup(){try{this.isInitialized();let e=!1;this.records.forEach(t=>{cjsExports$1.toMiliseconds(t.expiry||0)-Date.now()<=0&&(this.logger.info(`Deleting expired history log: ${t.id}`),this.records.delete(t.id),this.events.emit(F$1.deleted,t,!1),e=!0);}),e&&this.persist();}catch(e){this.logger.warn(e);}}isInitialized(){if(!this.initialized){const{message:e}=ht$2("NOT_INITIALIZED",this.name);throw new Error(e)}}}var Uo=Object.defineProperty,Fo=(r,e,t)=>e in r?Uo(r,e,{enumerable:true,configurable:true,writable:true,value:t}):r[e]=t,A$2=(r,e,t)=>Fo(r,typeof e!="symbol"?e+"":e,t);class ji extends S$4{constructor(e,t){super(e,t),this.core=e,this.logger=t,A$2(this,"expirations",new Map),A$2(this,"events",new EventEmitter),A$2(this,"name",qt$1),A$2(this,"version",Gt$1),A$2(this,"cached",[]),A$2(this,"initialized",false),A$2(this,"storagePrefix",B$2),A$2(this,"init",async()=>{this.initialized||(this.logger.trace("Initialized"),await this.restore(),this.cached.forEach(i=>this.expirations.set(i.target,i)),this.cached=[],this.registerEventListeners(),this.initialized=true);}),A$2(this,"has",i=>{try{const s=this.formatTarget(i);return typeof this.getExpiration(s)<"u"}catch{return  false}}),A$2(this,"set",(i,s)=>{this.isInitialized();const n=this.formatTarget(i),o={target:n,expiry:s};this.expirations.set(n,o),this.checkExpiry(n,o),this.events.emit(M$2.created,{target:n,expiration:o});}),A$2(this,"get",i=>{this.isInitialized();const s=this.formatTarget(i);return this.getExpiration(s)}),A$2(this,"del",i=>{if(this.isInitialized(),this.has(i)){const s=this.formatTarget(i),n=this.getExpiration(s);this.expirations.delete(s),this.events.emit(M$2.deleted,{target:s,expiration:n});}}),A$2(this,"on",(i,s)=>{this.events.on(i,s);}),A$2(this,"once",(i,s)=>{this.events.once(i,s);}),A$2(this,"off",(i,s)=>{this.events.off(i,s);}),A$2(this,"removeListener",(i,s)=>{this.events.removeListener(i,s);}),this.logger=E$4(t,this.name);}get context(){return y$6(this.logger)}get storageKey(){return this.storagePrefix+this.version+this.core.customStoragePrefix+"//"+this.name}get length(){return this.expirations.size}get keys(){return Array.from(this.expirations.keys())}get values(){return Array.from(this.expirations.values())}formatTarget(e){if(typeof e=="string")return mi$1(e);if(typeof e=="number")return wi$1(e);const{message:t}=ht$2("UNKNOWN_TYPE",`Target type: ${typeof e}`);throw new Error(t)}async setExpirations(e){await this.core.storage.setItem(this.storageKey,e);}async getExpirations(){return await this.core.storage.getItem(this.storageKey)}async persist(){await this.setExpirations(this.values),this.events.emit(M$2.sync);}async restore(){try{const e=await this.getExpirations();if(typeof e>"u"||!e.length)return;if(this.expirations.size){const{message:t}=ht$2("RESTORE_WILL_OVERRIDE",this.name);throw this.logger.error(t),new Error(t)}this.cached=e,this.logger.debug(`Successfully Restored expirations for ${this.name}`),this.logger.trace({type:"method",method:"restore",expirations:this.values});}catch(e){this.logger.debug(`Failed to Restore expirations for ${this.name}`),this.logger.error(e);}}getExpiration(e){const t=this.expirations.get(e);if(!t){const{message:i}=ht$2("NO_MATCHING_KEY",`${this.name}: ${e}`);throw this.logger.warn(i),new Error(i)}return t}checkExpiry(e,t){const{expiry:i}=t;cjsExports$1.toMiliseconds(i)-Date.now()<=0&&this.expire(e,t);}expire(e,t){this.expirations.delete(e),this.events.emit(M$2.expired,{target:e,expiration:t});}checkExpirations(){this.core.relayer.connected&&this.expirations.forEach((e,t)=>this.checkExpiry(t,e));}registerEventListeners(){this.core.heartbeat.on(r$3.pulse,()=>this.checkExpirations()),this.events.on(M$2.created,e=>{const t=M$2.created;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,data:e}),this.persist();}),this.events.on(M$2.expired,e=>{const t=M$2.expired;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,data:e}),this.persist();}),this.events.on(M$2.deleted,e=>{const t=M$2.deleted;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,data:e}),this.persist();});}isInitialized(){if(!this.initialized){const{message:e}=ht$2("NOT_INITIALIZED",this.name);throw new Error(e)}}}var Mo=Object.defineProperty,Ko=(r,e,t)=>e in r?Mo(r,e,{enumerable:true,configurable:true,writable:true,value:t}):r[e]=t,w=(r,e,t)=>Ko(r,typeof e!="symbol"?e+"":e,t);class Ui extends M$3{constructor(e,t,i){super(e,t,i),this.core=e,this.logger=t,this.store=i,w(this,"name",Wt$1),w(this,"abortController"),w(this,"isDevEnv"),w(this,"verifyUrlV3",Yt$1),w(this,"storagePrefix",B$2),w(this,"version",Le$2),w(this,"publicKey"),w(this,"fetchPromise"),w(this,"init",async()=>{var s;this.isDevEnv||(this.publicKey=await this.store.getItem(this.storeKey),this.publicKey&&cjsExports$1.toMiliseconds((s=this.publicKey)==null?void 0:s.expiresAt)<Date.now()&&(this.logger.debug("verify v2 public key expired"),await this.removePublicKey()));}),w(this,"register",async s=>{if(!Tt$2()||this.isDevEnv)return;const n=window.location.origin,{id:o,decryptedId:a}=s,c=`${this.verifyUrlV3}/attestation?projectId=${this.core.projectId}&origin=${n}&id=${o}&decryptedId=${a}`;try{const h=cjsExports$2.getDocument(),l=this.startAbortTimer(cjsExports$1.ONE_SECOND*5),d=await new Promise((g,_)=>{const u=()=>{window.removeEventListener("message",x),h.body.removeChild(b),_("attestation aborted");};this.abortController.signal.addEventListener("abort",u);const b=h.createElement("iframe");b.src=c,b.style.display="none",b.addEventListener("error",u,{signal:this.abortController.signal});const x=I=>{if(I.data&&typeof I.data=="string")try{const D=JSON.parse(I.data);if(D.type==="verify_attestation"){if(sn$2(D.attestation).payload.id!==o)return;clearInterval(l),h.body.removeChild(b),this.abortController.signal.removeEventListener("abort",u),window.removeEventListener("message",x),g(D.attestation===null?"":D.attestation);}}catch(D){this.logger.warn(D);}};h.body.appendChild(b),window.addEventListener("message",x,{signal:this.abortController.signal});});return this.logger.debug("jwt attestation",d),d}catch(h){this.logger.warn(h);}return ""}),w(this,"resolve",async s=>{if(this.isDevEnv)return "";const{attestationId:n,hash:o,encryptedId:a}=s;if(n===""){this.logger.debug("resolve: attestationId is empty, skipping");return}if(n){if(sn$2(n).payload.id!==a)return;const h=await this.isValidJwtAttestation(n);if(h){if(!h.isVerified){this.logger.warn("resolve: jwt attestation: origin url not verified");return}return h}}if(!o)return;const c=this.getVerifyUrl(s?.verifyUrl);return this.fetchAttestation(o,c)}),w(this,"fetchAttestation",async(s,n)=>{this.logger.debug(`resolving attestation: ${s} from url: ${n}`);const o=this.startAbortTimer(cjsExports$1.ONE_SECOND*5),a=await fetch(`${n}/attestation/${s}?v2Supported=true`,{signal:this.abortController.signal});return clearTimeout(o),a.status===200?await a.json():void 0}),w(this,"getVerifyUrl",s=>{let n=s||ue$1;return Jt$1.includes(n)||(this.logger.info(`verify url: ${n}, not included in trusted list, assigning default: ${ue$1}`),n=ue$1),n}),w(this,"fetchPublicKey",async()=>{try{this.logger.debug(`fetching public key from: ${this.verifyUrlV3}`);const s=this.startAbortTimer(cjsExports$1.FIVE_SECONDS),n=await fetch(`${this.verifyUrlV3}/public-key`,{signal:this.abortController.signal});return clearTimeout(s),await n.json()}catch(s){this.logger.warn(s);}}),w(this,"persistPublicKey",async s=>{this.logger.debug("persisting public key to local storage",s),await this.store.setItem(this.storeKey,s),this.publicKey=s;}),w(this,"removePublicKey",async()=>{this.logger.debug("removing verify v2 public key from storage"),await this.store.removeItem(this.storeKey),this.publicKey=void 0;}),w(this,"isValidJwtAttestation",async s=>{const n=await this.getPublicKey();try{if(n)return this.validateAttestation(s,n)}catch(a){this.logger.error(a),this.logger.warn("error validating attestation");}const o=await this.fetchAndPersistPublicKey();try{if(o)return this.validateAttestation(s,o)}catch(a){this.logger.error(a),this.logger.warn("error validating attestation");}}),w(this,"getPublicKey",async()=>this.publicKey?this.publicKey:await this.fetchAndPersistPublicKey()),w(this,"fetchAndPersistPublicKey",async()=>{if(this.fetchPromise)return await this.fetchPromise,this.publicKey;this.fetchPromise=new Promise(async n=>{const o=await this.fetchPublicKey();o&&(await this.persistPublicKey(o),n(o));});const s=await this.fetchPromise;return this.fetchPromise=void 0,s}),w(this,"validateAttestation",(s,n)=>{const o=zc(s,n.publicKey),a={hasExpired:cjsExports$1.toMiliseconds(o.exp)<Date.now(),payload:o};if(a.hasExpired)throw this.logger.warn("resolve: jwt attestation expired"),new Error("JWT attestation expired");return {origin:a.payload.origin,isScam:a.payload.isScam,isVerified:a.payload.isVerified}}),this.logger=E$4(t,this.name),this.abortController=new AbortController,this.isDevEnv=Ii$1(),this.init();}get storeKey(){return this.storagePrefix+this.version+this.core.customStoragePrefix+"//verify:public:key"}get context(){return y$6(this.logger)}startAbortTimer(e){return this.abortController=new AbortController,setTimeout(()=>this.abortController.abort(),cjsExports$1.toMiliseconds(e))}}var Bo=Object.defineProperty,Vo=(r,e,t)=>e in r?Bo(r,e,{enumerable:true,configurable:true,writable:true,value:t}):r[e]=t,Fi=(r,e,t)=>Vo(r,typeof e!="symbol"?e+"":e,t);class Mi extends O$2{constructor(e,t){super(e,t),this.projectId=e,this.logger=t,Fi(this,"context",Xt$1),Fi(this,"registerDeviceToken",async i=>{const{clientId:s,token:n,notificationType:o,enableEncrypted:a=false}=i,c=`${Zt$1}/${this.projectId}/clients`;await fetch(c,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({client_id:s,type:o,token:n,always_raw:a})});}),this.logger=E$4(t,this.context);}}var qo=Object.defineProperty,Ki=Object.getOwnPropertySymbols,Go=Object.prototype.hasOwnProperty,Wo=Object.prototype.propertyIsEnumerable,Ze$1=(r,e,t)=>e in r?qo(r,e,{enumerable:true,configurable:true,writable:true,value:t}):r[e]=t,be$1=(r,e)=>{for(var t in e||(e={}))Go.call(e,t)&&Ze$1(r,t,e[t]);if(Ki)for(var t of Ki(e))Wo.call(e,t)&&Ze$1(r,t,e[t]);return r},E$3=(r,e,t)=>Ze$1(r,typeof e!="symbol"?e+"":e,t);class Bi extends R$2{constructor(e,t,i=true){super(e,t,i),this.core=e,this.logger=t,E$3(this,"context",ei),E$3(this,"storagePrefix",B$2),E$3(this,"storageVersion",Qt$1),E$3(this,"events",new Map),E$3(this,"shouldPersist",false),E$3(this,"init",async()=>{if(!Ii$1())try{const s={eventId:Bi$1(),timestamp:Date.now(),domain:this.getAppDomain(),props:{event:"INIT",type:"",properties:{client_id:await this.core.crypto.getClientId(),user_agent:Mn$1(this.core.relayer.protocol,this.core.relayer.version,_e$2)}}};await this.sendEvent([s]);}catch(s){this.logger.warn(s);}}),E$3(this,"createEvent",s=>{const{event:n="ERROR",type:o="",properties:{topic:a,trace:c}}=s,h=Bi$1(),l=this.core.projectId||"",d=Date.now(),g=be$1({eventId:h,timestamp:d,props:{event:n,type:o,properties:{topic:a,trace:c}},bundleId:l,domain:this.getAppDomain()},this.setMethods(h));return this.telemetryEnabled&&(this.events.set(h,g),this.shouldPersist=true),g}),E$3(this,"getEvent",s=>{const{eventId:n,topic:o}=s;if(n)return this.events.get(n);const a=Array.from(this.events.values()).find(c=>c.props.properties.topic===o);if(a)return be$1(be$1({},a),this.setMethods(a.eventId))}),E$3(this,"deleteEvent",s=>{const{eventId:n}=s;this.events.delete(n),this.shouldPersist=true;}),E$3(this,"setEventListeners",()=>{this.core.heartbeat.on(r$3.pulse,async()=>{this.shouldPersist&&await this.persist(),this.events.forEach(s=>{cjsExports$1.fromMiliseconds(Date.now())-cjsExports$1.fromMiliseconds(s.timestamp)>ti&&(this.events.delete(s.eventId),this.shouldPersist=true);});});}),E$3(this,"setMethods",s=>({addTrace:n=>this.addTrace(s,n),setError:n=>this.setError(s,n)})),E$3(this,"addTrace",(s,n)=>{const o=this.events.get(s);o&&(o.props.properties.trace.push(n),this.events.set(s,o),this.shouldPersist=true);}),E$3(this,"setError",(s,n)=>{const o=this.events.get(s);o&&(o.props.type=n,o.timestamp=Date.now(),this.events.set(s,o),this.shouldPersist=true);}),E$3(this,"persist",async()=>{await this.core.storage.setItem(this.storageKey,Array.from(this.events.values())),this.shouldPersist=false;}),E$3(this,"restore",async()=>{try{const s=await this.core.storage.getItem(this.storageKey)||[];if(!s.length)return;s.forEach(n=>{this.events.set(n.eventId,be$1(be$1({},n),this.setMethods(n.eventId)));});}catch(s){this.logger.warn(s);}}),E$3(this,"submit",async()=>{if(!this.telemetryEnabled||this.events.size===0)return;const s=[];for(const[n,o]of this.events)o.props.type&&s.push(o);if(s.length!==0)try{if((await this.sendEvent(s)).ok)for(const n of s)this.events.delete(n.eventId),this.shouldPersist=!0;}catch(n){this.logger.warn(n);}}),E$3(this,"sendEvent",async s=>{const n=this.getAppDomain()?"":"&sp=desktop";return await fetch(`${ii}?projectId=${this.core.projectId}&st=events_sdk&sv=js-${_e$2}${n}`,{method:"POST",body:JSON.stringify(s)})}),E$3(this,"getAppDomain",()=>Pn$1().url),this.logger=E$4(t,this.context),this.telemetryEnabled=i,i?this.restore().then(async()=>{await this.submit(),this.setEventListeners();}):this.persist();}get storageKey(){return this.storagePrefix+this.storageVersion+this.core.customStoragePrefix+"//"+this.context}}var Ho=Object.defineProperty,Vi=Object.getOwnPropertySymbols,Yo=Object.prototype.hasOwnProperty,Jo=Object.prototype.propertyIsEnumerable,Qe$1=(r,e,t)=>e in r?Ho(r,e,{enumerable:true,configurable:true,writable:true,value:t}):r[e]=t,qi=(r,e)=>{for(var t in e||(e={}))Yo.call(e,t)&&Qe$1(r,t,e[t]);if(Vi)for(var t of Vi(e))Jo.call(e,t)&&Qe$1(r,t,e[t]);return r},v$2=(r,e,t)=>Qe$1(r,typeof e!="symbol"?e+"":e,t);let Te$1 = class Te extends h$3{constructor(e){var t;super(e),v$2(this,"protocol",ze$1),v$2(this,"version",Le$2),v$2(this,"name",he$1),v$2(this,"relayUrl"),v$2(this,"projectId"),v$2(this,"customStoragePrefix"),v$2(this,"events",new EventEmitter),v$2(this,"logger"),v$2(this,"heartbeat"),v$2(this,"relayer"),v$2(this,"crypto"),v$2(this,"storage"),v$2(this,"history"),v$2(this,"expirer"),v$2(this,"pairing"),v$2(this,"verify"),v$2(this,"echoClient"),v$2(this,"linkModeSupportedApps"),v$2(this,"eventClient"),v$2(this,"initialized",false),v$2(this,"logChunkController"),v$2(this,"on",(a,c)=>this.events.on(a,c)),v$2(this,"once",(a,c)=>this.events.once(a,c)),v$2(this,"off",(a,c)=>this.events.off(a,c)),v$2(this,"removeListener",(a,c)=>this.events.removeListener(a,c)),v$2(this,"dispatchEnvelope",({topic:a,message:c,sessionExists:h})=>{if(!a||!c)return;const l={topic:a,message:c,publishedAt:Date.now(),transportType:Q$1.link_mode};this.relayer.onLinkMessageEvent(l,{sessionExists:h});});const i=this.getGlobalCore(e?.customStoragePrefix);if(i)try{return this.customStoragePrefix=i.customStoragePrefix,this.logger=i.logger,this.heartbeat=i.heartbeat,this.crypto=i.crypto,this.history=i.history,this.expirer=i.expirer,this.storage=i.storage,this.relayer=i.relayer,this.pairing=i.pairing,this.verify=i.verify,this.echoClient=i.echoClient,this.linkModeSupportedApps=i.linkModeSupportedApps,this.eventClient=i.eventClient,this.initialized=i.initialized,this.logChunkController=i.logChunkController,i}catch(a){console.warn("Failed to copy global core",a);}this.projectId=e?.projectId,this.relayUrl=e?.relayUrl||Ue$2,this.customStoragePrefix=e!=null&&e.customStoragePrefix?`:${e.customStoragePrefix}`:"";const s=k$4({level:typeof e?.logger=="string"&&e.logger?e.logger:Et$1.logger,name:he$1}),{logger:n,chunkLoggerController:o}=A$3({opts:s,maxSizeInBytes:e?.maxLogBlobSizeInBytes,loggerOverride:e?.logger});this.logChunkController=o,(t=this.logChunkController)!=null&&t.downloadLogsBlobInBrowser&&(window.downloadLogsBlobInBrowser=async()=>{var a,c;(a=this.logChunkController)!=null&&a.downloadLogsBlobInBrowser&&((c=this.logChunkController)==null||c.downloadLogsBlobInBrowser({clientId:await this.crypto.getClientId()}));}),this.logger=E$4(n,this.name),this.heartbeat=new i$4,this.crypto=new vi(this,this.logger,e?.keychain),this.history=new ki(this,this.logger),this.expirer=new ji(this,this.logger),this.storage=e!=null&&e.storage?e.storage:new h$5(qi(qi({},It$1),e?.storageOptions)),this.relayer=new Si({core:this,logger:this.logger,relayUrl:this.relayUrl,projectId:this.projectId}),this.pairing=new Li(this,this.logger),this.verify=new Ui(this,this.logger,this.storage),this.echoClient=new Mi(this.projectId||"",this.logger),this.linkModeSupportedApps=[],this.eventClient=new Bi(this,this.logger,e?.telemetryEnabled),this.setGlobalCore(this);}static async init(e){const t=new Te(e);await t.initialize();const i=await t.crypto.getClientId();return await t.storage.setItem(jt$1,i),t}get context(){return y$6(this.logger)}async start(){this.initialized||await this.initialize();}async getLogsBlob(){var e;return (e=this.logChunkController)==null?void 0:e.logsToBlob({clientId:await this.crypto.getClientId()})}async addLinkModeSupportedApp(e){this.linkModeSupportedApps.includes(e)||(this.linkModeSupportedApps.push(e),await this.storage.setItem(Fe$1,this.linkModeSupportedApps));}async initialize(){this.logger.trace("Initialized");try{await this.crypto.init(),await this.history.init(),await this.expirer.init(),await this.relayer.init(),await this.heartbeat.init(),await this.pairing.init(),this.linkModeSupportedApps=await this.storage.getItem(Fe$1)||[],this.initialized=!0,this.logger.info("Core Initialization Success");}catch(e){throw this.logger.warn(`Core Initialization Failure at epoch ${Date.now()}`,e),this.logger.error(e.message),e}}getGlobalCore(e=""){try{if(this.isGlobalCoreDisabled())return;const t=`_walletConnectCore_${e}`,i=`${t}_count`;return globalThis[i]=(globalThis[i]||0)+1,globalThis[i]>1&&console.warn(`WalletConnect Core is already initialized. This is probably a mistake and can lead to unexpected behavior. Init() was called ${globalThis[i]} times.`),globalThis[t]}catch(t){console.warn("Failed to get global WalletConnect core",t);return}}setGlobalCore(e){var t;try{if(this.isGlobalCoreDisabled())return;const i=`_walletConnectCore_${((t=e.opts)==null?void 0:t.customStoragePrefix)||""}`;globalThis[i]=e;}catch(i){console.warn("Failed to set global WalletConnect core",i);}}isGlobalCoreDisabled(){try{return typeof process<"u"&&process.env.DISABLE_GLOBAL_CORE==="true"}catch{return  true}}};const Xo=Te$1;

const De$1="wc",Le$1=2,ke$1="client",we$1=`${De$1}@${Le$1}:${ke$1}:`,me$1={name:ke$1,logger:"error"},Me$1="WALLETCONNECT_DEEPLINK_CHOICE",pt$1="proposal",$e$1="Proposal expired",ht$1="session",J=cjsExports$1.SEVEN_DAYS,dt$1="engine",N$2={wc_sessionPropose:{req:{ttl:cjsExports$1.FIVE_MINUTES,prompt:true,tag:1100},res:{ttl:cjsExports$1.FIVE_MINUTES,prompt:false,tag:1101},reject:{ttl:cjsExports$1.FIVE_MINUTES,prompt:false,tag:1120},autoReject:{ttl:cjsExports$1.FIVE_MINUTES,prompt:false,tag:1121}},wc_sessionSettle:{req:{ttl:cjsExports$1.FIVE_MINUTES,prompt:false,tag:1102},res:{ttl:cjsExports$1.FIVE_MINUTES,prompt:false,tag:1103}},wc_sessionUpdate:{req:{ttl:cjsExports$1.ONE_DAY,prompt:false,tag:1104},res:{ttl:cjsExports$1.ONE_DAY,prompt:false,tag:1105}},wc_sessionExtend:{req:{ttl:cjsExports$1.ONE_DAY,prompt:false,tag:1106},res:{ttl:cjsExports$1.ONE_DAY,prompt:false,tag:1107}},wc_sessionRequest:{req:{ttl:cjsExports$1.FIVE_MINUTES,prompt:true,tag:1108},res:{ttl:cjsExports$1.FIVE_MINUTES,prompt:false,tag:1109}},wc_sessionEvent:{req:{ttl:cjsExports$1.FIVE_MINUTES,prompt:true,tag:1110},res:{ttl:cjsExports$1.FIVE_MINUTES,prompt:false,tag:1111}},wc_sessionDelete:{req:{ttl:cjsExports$1.ONE_DAY,prompt:false,tag:1112},res:{ttl:cjsExports$1.ONE_DAY,prompt:false,tag:1113}},wc_sessionPing:{req:{ttl:cjsExports$1.ONE_DAY,prompt:false,tag:1114},res:{ttl:cjsExports$1.ONE_DAY,prompt:false,tag:1115}},wc_sessionAuthenticate:{req:{ttl:cjsExports$1.ONE_HOUR,prompt:true,tag:1116},res:{ttl:cjsExports$1.ONE_HOUR,prompt:false,tag:1117},reject:{ttl:cjsExports$1.FIVE_MINUTES,prompt:false,tag:1118},autoReject:{ttl:cjsExports$1.FIVE_MINUTES,prompt:false,tag:1119}}},_e$1={min:cjsExports$1.FIVE_MINUTES,max:cjsExports$1.SEVEN_DAYS},$$2={idle:"IDLE",active:"ACTIVE"},Ke$1={eth_sendTransaction:{key:""},eth_sendRawTransaction:{key:""},wallet_sendCalls:{key:""},solana_signTransaction:{key:"signature"},solana_signAllTransactions:{key:"transactions"},solana_signAndSendTransaction:{key:"signature"}},ut$1="request",gt$1=["wc_sessionPropose","wc_sessionRequest","wc_authRequest","wc_sessionAuthenticate"],yt$1="wc",wt$1="auth",mt$1="authKeys",_t$1="pairingTopics",Et="requests",ae$1=`${yt$1}@${1.5}:${wt$1}:`,ce$1=`${ae$1}:PUB_KEY`;var vs=Object.defineProperty,Is=Object.defineProperties,Ts=Object.getOwnPropertyDescriptors,ft$1=Object.getOwnPropertySymbols,qs=Object.prototype.hasOwnProperty,Ps=Object.prototype.propertyIsEnumerable,Ue$1=(S,n,e)=>n in S?vs(S,n,{enumerable:true,configurable:true,writable:true,value:e}):S[n]=e,v$1=(S,n)=>{for(var e in n||(n={}))qs.call(n,e)&&Ue$1(S,e,n[e]);if(ft$1)for(var e of ft$1(n))Ps.call(n,e)&&Ue$1(S,e,n[e]);return S},b$3=(S,n)=>Is(S,Ts(n)),c$3=(S,n,e)=>Ue$1(S,typeof n!="symbol"?n+"":n,e);class Ns extends V$4{constructor(n){super(n),c$3(this,"name",dt$1),c$3(this,"events",new require$$0),c$3(this,"initialized",false),c$3(this,"requestQueue",{state:$$2.idle,queue:[]}),c$3(this,"sessionRequestQueue",{state:$$2.idle,queue:[]}),c$3(this,"requestQueueDelay",cjsExports$1.ONE_SECOND),c$3(this,"expectedPairingMethodMap",new Map),c$3(this,"recentlyDeletedMap",new Map),c$3(this,"recentlyDeletedLimit",200),c$3(this,"relayMessageCache",[]),c$3(this,"pendingSessions",new Map),c$3(this,"init",async()=>{this.initialized||(await this.cleanup(),this.registerRelayerEvents(),this.registerExpirerEvents(),this.registerPairingEvents(),await this.registerLinkModeListeners(),this.client.core.pairing.register({methods:Object.keys(N$2)}),this.initialized=true,setTimeout(async()=>{await this.processPendingMessageEvents(),this.sessionRequestQueue.queue=this.getPendingSessionRequests(),this.processSessionRequestQueue();},cjsExports$1.toMiliseconds(this.requestQueueDelay)));}),c$3(this,"connect",async e=>{this.isInitialized(),await this.confirmOnlineStateOrThrow();const t=b$3(v$1({},e),{requiredNamespaces:e.requiredNamespaces||{},optionalNamespaces:e.optionalNamespaces||{}});await this.isValidConnect(t),t.optionalNamespaces=aa(t.requiredNamespaces,t.optionalNamespaces),t.requiredNamespaces={};const{pairingTopic:s,requiredNamespaces:i,optionalNamespaces:r,sessionProperties:o,scopedProperties:a,relays:l}=t;let p=s,h,u=false;try{if(p){const T=this.client.core.pairing.pairings.get(p);this.client.logger.warn("connect() with existing pairing topic is deprecated and will be removed in the next major release."),u=T.active;}}catch(T){throw this.client.logger.error(`connect() -> pairing.get(${p}) failed`),T}if(!p||!u){const{topic:T,uri:K}=await this.client.core.pairing.create();p=T,h=K;}if(!p){const{message:T}=ht$2("NO_MATCHING_KEY",`connect() pairing topic: ${p}`);throw new Error(T)}const d=await this.client.core.crypto.generateKeyPair(),w=N$2.wc_sessionPropose.req.ttl||cjsExports$1.FIVE_MINUTES,m=Ei$1(w),f=b$3(v$1(v$1({requiredNamespaces:i,optionalNamespaces:r,relays:l??[{protocol:xt$1}],proposer:{publicKey:d,metadata:this.client.metadata},expiryTimestamp:m,pairingTopic:p},o&&{sessionProperties:o}),a&&{scopedProperties:a}),{id:payloadId()}),_=xi$1("session_connect",f.id),{reject:g,resolve:A,done:D}=gi$1(w,$e$1),I=({id:T})=>{T===f.id&&(this.client.events.off("proposal_expire",I),this.pendingSessions.delete(f.id),this.events.emit(_,{error:{message:$e$1,code:0}}));};return this.client.events.on("proposal_expire",I),this.events.once(_,({error:T,session:K})=>{this.client.events.off("proposal_expire",I),T?g(T):K&&A(K);}),await this.sendRequest({topic:p,method:"wc_sessionPropose",params:f,throwOnFailedPublish:true,clientRpcId:f.id}),await this.setProposal(f.id,f),{uri:h,approval:D}}),c$3(this,"pair",async e=>{this.isInitialized(),await this.confirmOnlineStateOrThrow();try{return await this.client.core.pairing.pair(e)}catch(t){throw this.client.logger.error("pair() failed"),t}}),c$3(this,"approve",async e=>{var t,s,i;const r=this.client.core.eventClient.createEvent({properties:{topic:(t=e?.id)==null?void 0:t.toString(),trace:[er.session_approve_started]}});try{this.isInitialized(),await this.confirmOnlineStateOrThrow();}catch(q){throw r.setError(tr.no_internet_connection),q}try{await this.isValidProposalId(e?.id);}catch(q){throw this.client.logger.error(`approve() -> proposal.get(${e?.id}) failed`),r.setError(tr.proposal_not_found),q}try{await this.isValidApprove(e);}catch(q){throw this.client.logger.error("approve() -> isValidApprove() failed"),r.setError(tr.session_approve_namespace_validation_failure),q}const{id:o,relayProtocol:a,namespaces:l,sessionProperties:p,scopedProperties:h,sessionConfig:u}=e,d=this.client.proposal.get(o);this.client.core.eventClient.deleteEvent({eventId:r.eventId});const{pairingTopic:w,proposer:m,requiredNamespaces:f,optionalNamespaces:_}=d;let g=(s=this.client.core.eventClient)==null?void 0:s.getEvent({topic:w});g||(g=(i=this.client.core.eventClient)==null?void 0:i.createEvent({type:er.session_approve_started,properties:{topic:w,trace:[er.session_approve_started,er.session_namespaces_validation_success]}}));const A=await this.client.core.crypto.generateKeyPair(),D=m.publicKey,I=await this.client.core.crypto.generateSharedKey(A,D),T=v$1(v$1(v$1({relay:{protocol:a??"irn"},namespaces:l,controller:{publicKey:A,metadata:this.client.metadata},expiry:Ei$1(J)},p&&{sessionProperties:p}),h&&{scopedProperties:h}),u&&{sessionConfig:u}),K=Q$1.relay;g.addTrace(er.subscribing_session_topic);try{await this.client.core.relayer.subscribe(I,{transportType:K});}catch(q){throw g.setError(tr.subscribe_session_topic_failure),q}g.addTrace(er.subscribe_session_topic_success);const fe=b$3(v$1({},T),{topic:I,requiredNamespaces:f,optionalNamespaces:_,pairingTopic:w,acknowledged:false,self:T.controller,peer:{publicKey:m.publicKey,metadata:m.metadata},controller:A,transportType:Q$1.relay});await this.client.session.set(I,fe),g.addTrace(er.store_session);try{g.addTrace(er.publishing_session_settle),await this.sendRequest({topic:I,method:"wc_sessionSettle",params:T,throwOnFailedPublish:!0}).catch(q=>{throw g?.setError(tr.session_settle_publish_failure),q}),g.addTrace(er.session_settle_publish_success),g.addTrace(er.publishing_session_approve),await this.sendResult({id:o,topic:w,result:{relay:{protocol:a??"irn"},responderPublicKey:A},throwOnFailedPublish:!0}).catch(q=>{throw g?.setError(tr.session_approve_publish_failure),q}),g.addTrace(er.session_approve_publish_success);}catch(q){throw this.client.logger.error(q),this.client.session.delete(I,Nt$1("USER_DISCONNECTED")),await this.client.core.relayer.unsubscribe(I),q}return this.client.core.eventClient.deleteEvent({eventId:g.eventId}),await this.client.core.pairing.updateMetadata({topic:w,metadata:m.metadata}),await this.client.proposal.delete(o,Nt$1("USER_DISCONNECTED")),await this.client.core.pairing.activate({topic:w}),await this.setExpiry(I,Ei$1(J)),{topic:I,acknowledged:()=>Promise.resolve(this.client.session.get(I))}}),c$3(this,"reject",async e=>{this.isInitialized(),await this.confirmOnlineStateOrThrow();try{await this.isValidReject(e);}catch(r){throw this.client.logger.error("reject() -> isValidReject() failed"),r}const{id:t,reason:s}=e;let i;try{i=this.client.proposal.get(t).pairingTopic;}catch(r){throw this.client.logger.error(`reject() -> proposal.get(${t}) failed`),r}i&&(await this.sendError({id:t,topic:i,error:s,rpcOpts:N$2.wc_sessionPropose.reject}),await this.client.proposal.delete(t,Nt$1("USER_DISCONNECTED")));}),c$3(this,"update",async e=>{this.isInitialized(),await this.confirmOnlineStateOrThrow();try{await this.isValidUpdate(e);}catch(h){throw this.client.logger.error("update() -> isValidUpdate() failed"),h}const{topic:t,namespaces:s}=e,{done:i,resolve:r,reject:o}=gi$1(),a=payloadId(),l=getBigIntRpcId().toString(),p=this.client.session.get(t).namespaces;return this.events.once(xi$1("session_update",a),({error:h})=>{h?o(h):r();}),await this.client.session.update(t,{namespaces:s}),await this.sendRequest({topic:t,method:"wc_sessionUpdate",params:{namespaces:s},throwOnFailedPublish:true,clientRpcId:a,relayRpcId:l}).catch(h=>{this.client.logger.error(h),this.client.session.update(t,{namespaces:p}),o(h);}),{acknowledged:i}}),c$3(this,"extend",async e=>{this.isInitialized(),await this.confirmOnlineStateOrThrow();try{await this.isValidExtend(e);}catch(a){throw this.client.logger.error("extend() -> isValidExtend() failed"),a}const{topic:t}=e,s=payloadId(),{done:i,resolve:r,reject:o}=gi$1();return this.events.once(xi$1("session_extend",s),({error:a})=>{a?o(a):r();}),await this.setExpiry(t,Ei$1(J)),this.sendRequest({topic:t,method:"wc_sessionExtend",params:{},clientRpcId:s,throwOnFailedPublish:true}).catch(a=>{o(a);}),{acknowledged:i}}),c$3(this,"request",async e=>{this.isInitialized();try{await this.isValidRequest(e);}catch(_){throw this.client.logger.error("request() -> isValidRequest() failed"),_}const{chainId:t,request:s,topic:i,expiry:r=N$2.wc_sessionRequest.req.ttl}=e,o=this.client.session.get(i);o?.transportType===Q$1.relay&&await this.confirmOnlineStateOrThrow();const a=payloadId(),l=getBigIntRpcId().toString(),{done:p,resolve:h,reject:u}=gi$1(r,"Request expired. Please try again.");this.events.once(xi$1("session_request",a),({error:_,result:g})=>{_?u(_):h(g);});const d="wc_sessionRequest",w=this.getAppLinkIfEnabled(o.peer.metadata,o.transportType);if(w)return await this.sendRequest({clientRpcId:a,relayRpcId:l,topic:i,method:d,params:{request:b$3(v$1({},s),{expiryTimestamp:Ei$1(r)}),chainId:t},expiry:r,throwOnFailedPublish:true,appLink:w}).catch(_=>u(_)),this.client.events.emit("session_request_sent",{topic:i,request:s,chainId:t,id:a}),await p();const m={request:b$3(v$1({},s),{expiryTimestamp:Ei$1(r)}),chainId:t},f=this.shouldSetTVF(d,m);return await Promise.all([new Promise(async _=>{await this.sendRequest(v$1({clientRpcId:a,relayRpcId:l,topic:i,method:d,params:m,expiry:r,throwOnFailedPublish:true},f&&{tvf:this.getTVFParams(a,m)})).catch(g=>u(g)),this.client.events.emit("session_request_sent",{topic:i,request:s,chainId:t,id:a}),_();}),new Promise(async _=>{var g;if(!((g=o.sessionConfig)!=null&&g.disableDeepLink)){const A=await Oi$1(this.client.core.storage,Me$1);await Si$1({id:a,topic:i,wcDeepLink:A});}_();}),p()]).then(_=>_[2])}),c$3(this,"respond",async e=>{this.isInitialized(),await this.isValidRespond(e);const{topic:t,response:s}=e,{id:i}=s,r=this.client.session.get(t);r.transportType===Q$1.relay&&await this.confirmOnlineStateOrThrow();const o=this.getAppLinkIfEnabled(r.peer.metadata,r.transportType);isJsonRpcResult(s)?await this.sendResult({id:i,topic:t,result:s.result,throwOnFailedPublish:true,appLink:o}):isJsonRpcError(s)&&await this.sendError({id:i,topic:t,error:s.error,appLink:o}),this.cleanupAfterResponse(e);}),c$3(this,"ping",async e=>{this.isInitialized(),await this.confirmOnlineStateOrThrow();try{await this.isValidPing(e);}catch(s){throw this.client.logger.error("ping() -> isValidPing() failed"),s}const{topic:t}=e;if(this.client.session.keys.includes(t)){const s=payloadId(),i=getBigIntRpcId().toString(),{done:r,resolve:o,reject:a}=gi$1();this.events.once(xi$1("session_ping",s),({error:l})=>{l?a(l):o();}),await Promise.all([this.sendRequest({topic:t,method:"wc_sessionPing",params:{},throwOnFailedPublish:true,clientRpcId:s,relayRpcId:i}),r()]);}else this.client.core.pairing.pairings.keys.includes(t)&&(this.client.logger.warn("ping() on pairing topic is deprecated and will be removed in the next major release."),await this.client.core.pairing.ping({topic:t}));}),c$3(this,"emit",async e=>{this.isInitialized(),await this.confirmOnlineStateOrThrow(),await this.isValidEmit(e);const{topic:t,event:s,chainId:i}=e,r=getBigIntRpcId().toString(),o=payloadId();await this.sendRequest({topic:t,method:"wc_sessionEvent",params:{event:s,chainId:i},throwOnFailedPublish:true,relayRpcId:r,clientRpcId:o});}),c$3(this,"disconnect",async e=>{this.isInitialized(),await this.confirmOnlineStateOrThrow(),await this.isValidDisconnect(e);const{topic:t}=e;if(this.client.session.keys.includes(t))await this.sendRequest({topic:t,method:"wc_sessionDelete",params:Nt$1("USER_DISCONNECTED"),throwOnFailedPublish:true}),await this.deleteSession({topic:t,emitEvent:false});else if(this.client.core.pairing.pairings.keys.includes(t))await this.client.core.pairing.disconnect({topic:t});else {const{message:s}=ht$2("MISMATCHED_TOPIC",`Session or pairing topic not found: ${t}`);throw new Error(s)}}),c$3(this,"find",e=>(this.isInitialized(),this.client.session.getAll().filter(t=>ua(t,e)))),c$3(this,"getPendingSessionRequests",()=>this.client.pendingRequest.getAll()),c$3(this,"authenticate",async(e,t)=>{var s;this.isInitialized(),this.isValidAuthenticate(e);const i=t&&this.client.core.linkModeSupportedApps.includes(t)&&((s=this.client.metadata.redirect)==null?void 0:s.linkMode),r=i?Q$1.link_mode:Q$1.relay;r===Q$1.relay&&await this.confirmOnlineStateOrThrow();const{chains:o,statement:a="",uri:l,domain:p,nonce:h,type:u,exp:d,nbf:w,methods:m=[],expiry:f}=e,_=[...e.resources||[]],{topic:g,uri:A}=await this.client.core.pairing.create({methods:["wc_sessionAuthenticate"],transportType:r});this.client.logger.info({message:"Generated new pairing",pairing:{topic:g,uri:A}});const D=await this.client.core.crypto.generateKeyPair(),I=Pc(D);if(await Promise.all([this.client.auth.authKeys.set(ce$1,{responseTopic:I,publicKey:D}),this.client.auth.pairingTopics.set(I,{topic:I,pairingTopic:g})]),await this.client.core.relayer.subscribe(I,{transportType:r}),this.client.logger.info(`sending request to new pairing topic: ${g}`),m.length>0){const{namespace:x}=Ne$1(o[0]);let L=fs(x,"request",m);pe$2(_)&&(L=ls(L,_.pop())),_.push(L);}const T=f&&f>N$2.wc_sessionAuthenticate.req.ttl?f:N$2.wc_sessionAuthenticate.req.ttl,K={authPayload:{type:u??"caip122",chains:o,statement:a,aud:l,domain:p,version:"1",nonce:h,iat:new Date().toISOString(),exp:d,nbf:w,resources:_},requester:{publicKey:D,metadata:this.client.metadata},expiryTimestamp:Ei$1(T)},fe={eip155:{chains:o,methods:[...new Set(["personal_sign",...m])],events:["chainChanged","accountsChanged"]}},q={requiredNamespaces:{},optionalNamespaces:fe,relays:[{protocol:"irn"}],pairingTopic:g,proposer:{publicKey:D,metadata:this.client.metadata},expiryTimestamp:Ei$1(N$2.wc_sessionPropose.req.ttl),id:payloadId()},{done:Rt,resolve:je,reject:Se}=gi$1(T,"Request expired"),te=payloadId(),le=xi$1("session_connect",q.id),Re=xi$1("session_request",te),pe=async({error:x,session:L})=>{this.events.off(Re,ve),x?Se(x):L&&je({session:L});},ve=async x=>{var L,Fe,Qe;if(await this.deletePendingAuthRequest(te,{message:"fulfilled",code:0}),x.error){const ie=Nt$1("WC_METHOD_UNSUPPORTED","wc_sessionAuthenticate");return x.error.code===ie.code?void 0:(this.events.off(le,pe),Se(x.error.message))}await this.deleteProposal(q.id),this.events.off(le,pe);const{cacaos:He,responder:Q}=x.result,Te=[],ze=[];for(const ie of He){await is({cacao:ie,projectId:this.client.core.projectId})||(this.client.logger.error(ie,"Signature verification failed"),Se(Nt$1("SESSION_SETTLEMENT_FAILED","Signature verification failed")));const{p:qe}=ie,Pe=pe$2(qe.resources),Ye=[dr$1(qe.iss)],vt=De$2(qe.iss);if(Pe){const Ne=ds(Pe),It=hs(Pe);Te.push(...Ne),Ye.push(...It);}for(const Ne of Ye)ze.push(`${Ne}:${vt}`);}const se=await this.client.core.crypto.generateSharedKey(D,Q.publicKey);let he;Te.length>0&&(he={topic:se,acknowledged:true,self:{publicKey:D,metadata:this.client.metadata},peer:Q,controller:Q.publicKey,expiry:Ei$1(J),requiredNamespaces:{},optionalNamespaces:{},relay:{protocol:"irn"},pairingTopic:g,namespaces:ca([...new Set(Te)],[...new Set(ze)]),transportType:r},await this.client.core.relayer.subscribe(se,{transportType:r}),await this.client.session.set(se,he),g&&await this.client.core.pairing.updateMetadata({topic:g,metadata:Q.metadata}),he=this.client.session.get(se)),(L=this.client.metadata.redirect)!=null&&L.linkMode&&(Fe=Q.metadata.redirect)!=null&&Fe.linkMode&&(Qe=Q.metadata.redirect)!=null&&Qe.universal&&t&&(this.client.core.addLinkModeSupportedApp(Q.metadata.redirect.universal),this.client.session.update(se,{transportType:Q$1.link_mode})),je({auths:He,session:he});};this.events.once(le,pe),this.events.once(Re,ve);let Ie;try{if(i){const x=formatJsonRpcRequest("wc_sessionAuthenticate",K,te);this.client.core.history.set(g,x);const L=await this.client.core.crypto.encode("",x,{type:re$2,encoding:xe$1});Ie=Xc(t,g,L);}else await Promise.all([this.sendRequest({topic:g,method:"wc_sessionAuthenticate",params:K,expiry:e.expiry,throwOnFailedPublish:!0,clientRpcId:te}),this.sendRequest({topic:g,method:"wc_sessionPropose",params:q,expiry:N$2.wc_sessionPropose.req.ttl,throwOnFailedPublish:!0,clientRpcId:q.id})]);}catch(x){throw this.events.off(le,pe),this.events.off(Re,ve),x}return await this.setProposal(q.id,q),await this.setAuthRequest(te,{request:b$3(v$1({},K),{verifyContext:{}}),pairingTopic:g,transportType:r}),{uri:Ie??A,response:Rt}}),c$3(this,"approveSessionAuthenticate",async e=>{const{id:t,auths:s}=e,i=this.client.core.eventClient.createEvent({properties:{topic:t.toString(),trace:[ir.authenticated_session_approve_started]}});try{this.isInitialized();}catch(f){throw i.setError(sr.no_internet_connection),f}const r=this.getPendingAuthRequest(t);if(!r)throw i.setError(sr.authenticated_session_pending_request_not_found),new Error(`Could not find pending auth request with id ${t}`);const o=r.transportType||Q$1.relay;o===Q$1.relay&&await this.confirmOnlineStateOrThrow();const a=r.requester.publicKey,l=await this.client.core.crypto.generateKeyPair(),p=Pc(a),h={type:Ft$2,receiverPublicKey:a,senderPublicKey:l},u=[],d=[];for(const f of s){if(!await is({cacao:f,projectId:this.client.core.projectId})){i.setError(sr.invalid_cacao);const I=Nt$1("SESSION_SETTLEMENT_FAILED","Signature verification failed");throw await this.sendError({id:t,topic:p,error:I,encodeOpts:h}),new Error(I.message)}i.addTrace(ir.cacaos_verified);const{p:_}=f,g=pe$2(_.resources),A=[dr$1(_.iss)],D=De$2(_.iss);if(g){const I=ds(g),T=hs(g);u.push(...I),A.push(...T);}for(const I of A)d.push(`${I}:${D}`);}const w=await this.client.core.crypto.generateSharedKey(l,a);i.addTrace(ir.create_authenticated_session_topic);let m;if(u?.length>0){m={topic:w,acknowledged:true,self:{publicKey:l,metadata:this.client.metadata},peer:{publicKey:a,metadata:r.requester.metadata},controller:a,expiry:Ei$1(J),authentication:s,requiredNamespaces:{},optionalNamespaces:{},relay:{protocol:"irn"},pairingTopic:r.pairingTopic,namespaces:ca([...new Set(u)],[...new Set(d)]),transportType:o},i.addTrace(ir.subscribing_authenticated_session_topic);try{await this.client.core.relayer.subscribe(w,{transportType:o});}catch(f){throw i.setError(sr.subscribe_authenticated_session_topic_failure),f}i.addTrace(ir.subscribe_authenticated_session_topic_success),await this.client.session.set(w,m),i.addTrace(ir.store_authenticated_session),await this.client.core.pairing.updateMetadata({topic:r.pairingTopic,metadata:r.requester.metadata});}i.addTrace(ir.publishing_authenticated_session_approve);try{await this.sendResult({topic:p,id:t,result:{cacaos:s,responder:{publicKey:l,metadata:this.client.metadata}},encodeOpts:h,throwOnFailedPublish:!0,appLink:this.getAppLinkIfEnabled(r.requester.metadata,o)});}catch(f){throw i.setError(sr.authenticated_session_approve_publish_failure),f}return await this.client.auth.requests.delete(t,{message:"fulfilled",code:0}),await this.client.core.pairing.activate({topic:r.pairingTopic}),this.client.core.eventClient.deleteEvent({eventId:i.eventId}),{session:m}}),c$3(this,"rejectSessionAuthenticate",async e=>{this.isInitialized();const{id:t,reason:s}=e,i=this.getPendingAuthRequest(t);if(!i)throw new Error(`Could not find pending auth request with id ${t}`);i.transportType===Q$1.relay&&await this.confirmOnlineStateOrThrow();const r=i.requester.publicKey,o=await this.client.core.crypto.generateKeyPair(),a=Pc(r),l={type:Ft$2,receiverPublicKey:r,senderPublicKey:o};await this.sendError({id:t,topic:a,error:s,encodeOpts:l,rpcOpts:N$2.wc_sessionAuthenticate.reject,appLink:this.getAppLinkIfEnabled(i.requester.metadata,i.transportType)}),await this.client.auth.requests.delete(t,{message:"rejected",code:0}),await this.client.proposal.delete(t,Nt$1("USER_DISCONNECTED"));}),c$3(this,"formatAuthMessage",e=>{this.isInitialized();const{request:t,iss:s}=e;return hr$1(t,s)}),c$3(this,"processRelayMessageCache",()=>{setTimeout(async()=>{if(this.relayMessageCache.length!==0)for(;this.relayMessageCache.length>0;)try{const e=this.relayMessageCache.shift();e&&await this.onRelayMessage(e);}catch(e){this.client.logger.error(e);}},50);}),c$3(this,"cleanupDuplicatePairings",async e=>{if(e.pairingTopic)try{const t=this.client.core.pairing.pairings.get(e.pairingTopic),s=this.client.core.pairing.pairings.getAll().filter(i=>{var r,o;return ((r=i.peerMetadata)==null?void 0:r.url)&&((o=i.peerMetadata)==null?void 0:o.url)===e.peer.metadata.url&&i.topic&&i.topic!==t.topic});if(s.length===0)return;this.client.logger.info(`Cleaning up ${s.length} duplicate pairing(s)`),await Promise.all(s.map(i=>this.client.core.pairing.disconnect({topic:i.topic}))),this.client.logger.info("Duplicate pairings clean up finished");}catch(t){this.client.logger.error(t);}}),c$3(this,"deleteSession",async e=>{var t;const{topic:s,expirerHasDeleted:i=false,emitEvent:r=true,id:o=0}=e,{self:a}=this.client.session.get(s);await this.client.core.relayer.unsubscribe(s),await this.client.session.delete(s,Nt$1("USER_DISCONNECTED")),this.addToRecentlyDeleted(s,"session"),this.client.core.crypto.keychain.has(a.publicKey)&&await this.client.core.crypto.deleteKeyPair(a.publicKey),this.client.core.crypto.keychain.has(s)&&await this.client.core.crypto.deleteSymKey(s),i||this.client.core.expirer.del(s),this.client.core.storage.removeItem(Me$1).catch(l=>this.client.logger.warn(l)),this.getPendingSessionRequests().forEach(l=>{l.topic===s&&this.deletePendingSessionRequest(l.id,Nt$1("USER_DISCONNECTED"));}),s===((t=this.sessionRequestQueue.queue[0])==null?void 0:t.topic)&&(this.sessionRequestQueue.state=$$2.idle),r&&this.client.events.emit("session_delete",{id:o,topic:s});}),c$3(this,"deleteProposal",async(e,t)=>{if(t)try{const s=this.client.proposal.get(e),i=this.client.core.eventClient.getEvent({topic:s.pairingTopic});i?.setError(tr.proposal_expired);}catch{}await Promise.all([this.client.proposal.delete(e,Nt$1("USER_DISCONNECTED")),t?Promise.resolve():this.client.core.expirer.del(e)]),this.addToRecentlyDeleted(e,"proposal");}),c$3(this,"deletePendingSessionRequest",async(e,t,s=false)=>{await Promise.all([this.client.pendingRequest.delete(e,t),s?Promise.resolve():this.client.core.expirer.del(e)]),this.addToRecentlyDeleted(e,"request"),this.sessionRequestQueue.queue=this.sessionRequestQueue.queue.filter(i=>i.id!==e),s&&(this.sessionRequestQueue.state=$$2.idle,this.client.events.emit("session_request_expire",{id:e}));}),c$3(this,"deletePendingAuthRequest",async(e,t,s=false)=>{await Promise.all([this.client.auth.requests.delete(e,t),s?Promise.resolve():this.client.core.expirer.del(e)]);}),c$3(this,"setExpiry",async(e,t)=>{this.client.session.keys.includes(e)&&(this.client.core.expirer.set(e,t),await this.client.session.update(e,{expiry:t}));}),c$3(this,"setProposal",async(e,t)=>{this.client.core.expirer.set(e,Ei$1(N$2.wc_sessionPropose.req.ttl)),await this.client.proposal.set(e,t);}),c$3(this,"setAuthRequest",async(e,t)=>{const{request:s,pairingTopic:i,transportType:r=Q$1.relay}=t;this.client.core.expirer.set(e,s.expiryTimestamp),await this.client.auth.requests.set(e,{authPayload:s.authPayload,requester:s.requester,expiryTimestamp:s.expiryTimestamp,id:e,pairingTopic:i,verifyContext:s.verifyContext,transportType:r});}),c$3(this,"setPendingSessionRequest",async e=>{const{id:t,topic:s,params:i,verifyContext:r}=e,o=i.request.expiryTimestamp||Ei$1(N$2.wc_sessionRequest.req.ttl);this.client.core.expirer.set(t,o),await this.client.pendingRequest.set(t,{id:t,topic:s,params:i,verifyContext:r});}),c$3(this,"sendRequest",async e=>{const{topic:t,method:s,params:i,expiry:r,relayRpcId:o,clientRpcId:a,throwOnFailedPublish:l,appLink:p,tvf:h}=e,u=formatJsonRpcRequest(s,i,a);let d;const w=!!p;try{const _=w?xe$1:qt$2;d=await this.client.core.crypto.encode(t,u,{encoding:_});}catch(_){throw await this.cleanup(),this.client.logger.error(`sendRequest() -> core.crypto.encode() for topic ${t} failed`),_}let m;if(gt$1.includes(s)){const _=kc(JSON.stringify(u)),g=kc(d);m=await this.client.core.verify.register({id:g,decryptedId:_});}const f=N$2[s].req;if(f.attestation=m,r&&(f.ttl=r),o&&(f.id=o),this.client.core.history.set(t,u),w){const _=Xc(p,t,d);await global.Linking.openURL(_,this.client.name);}else {const _=N$2[s].req;r&&(_.ttl=r),o&&(_.id=o),_.tvf=b$3(v$1({},h),{correlationId:u.id}),l?(_.internal=b$3(v$1({},_.internal),{throwOnFailedPublish:true}),await this.client.core.relayer.publish(t,d,_)):this.client.core.relayer.publish(t,d,_).catch(g=>this.client.logger.error(g));}return u.id}),c$3(this,"sendResult",async e=>{const{id:t,topic:s,result:i,throwOnFailedPublish:r,encodeOpts:o,appLink:a}=e,l=formatJsonRpcResult(t,i);let p;const h=a&&typeof(global==null?void 0:global.Linking)<"u";try{const w=h?xe$1:qt$2;p=await this.client.core.crypto.encode(s,l,b$3(v$1({},o||{}),{encoding:w}));}catch(w){throw await this.cleanup(),this.client.logger.error(`sendResult() -> core.crypto.encode() for topic ${s} failed`),w}let u,d;try{u=await this.client.core.history.get(s,t);const w=u.request;try{this.shouldSetTVF(w.method,w.params)&&(d=this.getTVFParams(t,w.params,i));}catch(m){this.client.logger.warn("sendResult() -> getTVFParams() failed",m);}}catch(w){throw this.client.logger.error(`sendResult() -> history.get(${s}, ${t}) failed`),w}if(h){const w=Xc(a,s,p);await global.Linking.openURL(w,this.client.name);}else {const w=u.request.method,m=N$2[w].res;m.tvf=b$3(v$1({},d),{correlationId:t}),r?(m.internal=b$3(v$1({},m.internal),{throwOnFailedPublish:true}),await this.client.core.relayer.publish(s,p,m)):this.client.core.relayer.publish(s,p,m).catch(f=>this.client.logger.error(f));}await this.client.core.history.resolve(l);}),c$3(this,"sendError",async e=>{const{id:t,topic:s,error:i,encodeOpts:r,rpcOpts:o,appLink:a}=e,l=formatJsonRpcError(t,i);let p;const h=a&&typeof(global==null?void 0:global.Linking)<"u";try{const d=h?xe$1:qt$2;p=await this.client.core.crypto.encode(s,l,b$3(v$1({},r||{}),{encoding:d}));}catch(d){throw await this.cleanup(),this.client.logger.error(`sendError() -> core.crypto.encode() for topic ${s} failed`),d}let u;try{u=await this.client.core.history.get(s,t);}catch(d){throw this.client.logger.error(`sendError() -> history.get(${s}, ${t}) failed`),d}if(h){const d=Xc(a,s,p);await global.Linking.openURL(d,this.client.name);}else {const d=u.request.method,w=o||N$2[d].res;this.client.core.relayer.publish(s,p,w);}await this.client.core.history.resolve(l);}),c$3(this,"cleanup",async()=>{const e=[],t=[];this.client.session.getAll().forEach(s=>{let i=false;vi$1(s.expiry)&&(i=true),this.client.core.crypto.keychain.has(s.topic)||(i=true),i&&e.push(s.topic);}),this.client.proposal.getAll().forEach(s=>{vi$1(s.expiryTimestamp)&&t.push(s.id);}),await Promise.all([...e.map(s=>this.deleteSession({topic:s})),...t.map(s=>this.deleteProposal(s))]);}),c$3(this,"onProviderMessageEvent",async e=>{!this.initialized||this.relayMessageCache.length>0?this.relayMessageCache.push(e):await this.onRelayMessage(e);}),c$3(this,"onRelayEventRequest",async e=>{this.requestQueue.queue.push(e),await this.processRequestsQueue();}),c$3(this,"processRequestsQueue",async()=>{if(this.requestQueue.state===$$2.active){this.client.logger.info("Request queue already active, skipping...");return}for(this.client.logger.info(`Request queue starting with ${this.requestQueue.queue.length} requests`);this.requestQueue.queue.length>0;){this.requestQueue.state=$$2.active;const e=this.requestQueue.queue.shift();if(e)try{await this.processRequest(e);}catch(t){this.client.logger.warn(t);}}this.requestQueue.state=$$2.idle;}),c$3(this,"processRequest",async e=>{const{topic:t,payload:s,attestation:i,transportType:r,encryptedId:o}=e,a=s.method;if(!this.shouldIgnorePairingRequest({topic:t,requestMethod:a}))switch(a){case "wc_sessionPropose":return await this.onSessionProposeRequest({topic:t,payload:s,attestation:i,encryptedId:o});case "wc_sessionSettle":return await this.onSessionSettleRequest(t,s);case "wc_sessionUpdate":return await this.onSessionUpdateRequest(t,s);case "wc_sessionExtend":return await this.onSessionExtendRequest(t,s);case "wc_sessionPing":return await this.onSessionPingRequest(t,s);case "wc_sessionDelete":return await this.onSessionDeleteRequest(t,s);case "wc_sessionRequest":return await this.onSessionRequest({topic:t,payload:s,attestation:i,encryptedId:o,transportType:r});case "wc_sessionEvent":return await this.onSessionEventRequest(t,s);case "wc_sessionAuthenticate":return await this.onSessionAuthenticateRequest({topic:t,payload:s,attestation:i,encryptedId:o,transportType:r});default:return this.client.logger.info(`Unsupported request method ${a}`)}}),c$3(this,"onRelayEventResponse",async e=>{const{topic:t,payload:s,transportType:i}=e,r=(await this.client.core.history.get(t,s.id)).request.method;switch(r){case "wc_sessionPropose":return this.onSessionProposeResponse(t,s,i);case "wc_sessionSettle":return this.onSessionSettleResponse(t,s);case "wc_sessionUpdate":return this.onSessionUpdateResponse(t,s);case "wc_sessionExtend":return this.onSessionExtendResponse(t,s);case "wc_sessionPing":return this.onSessionPingResponse(t,s);case "wc_sessionRequest":return this.onSessionRequestResponse(t,s);case "wc_sessionAuthenticate":return this.onSessionAuthenticateResponse(t,s);default:return this.client.logger.info(`Unsupported response method ${r}`)}}),c$3(this,"onRelayEventUnknownPayload",e=>{const{topic:t}=e,{message:s}=ht$2("MISSING_OR_INVALID",`Decoded payload on topic ${t} is not identifiable as a JSON-RPC request or a response.`);throw new Error(s)}),c$3(this,"shouldIgnorePairingRequest",e=>{const{topic:t,requestMethod:s}=e,i=this.expectedPairingMethodMap.get(t);return !i||i.includes(s)?false:!!(i.includes("wc_sessionAuthenticate")&&this.client.events.listenerCount("session_authenticate")>0)}),c$3(this,"onSessionProposeRequest",async e=>{const{topic:t,payload:s,attestation:i,encryptedId:r}=e,{params:o,id:a}=s;try{const l=this.client.core.eventClient.getEvent({topic:t});this.client.events.listenerCount("session_proposal")===0&&(console.warn("No listener for session_proposal event"),l?.setError(Y$1.proposal_listener_not_found)),this.isValidConnect(v$1({},s.params));const p=o.expiryTimestamp||Ei$1(N$2.wc_sessionPropose.req.ttl),h=v$1({id:a,pairingTopic:t,expiryTimestamp:p},o);await this.setProposal(a,h);const u=await this.getVerifyContext({attestationId:i,hash:kc(JSON.stringify(s)),encryptedId:r,metadata:h.proposer.metadata});l?.addTrace(G.emit_session_proposal),this.client.events.emit("session_proposal",{id:a,params:h,verifyContext:u});}catch(l){await this.sendError({id:a,topic:t,error:l,rpcOpts:N$2.wc_sessionPropose.autoReject}),this.client.logger.error(l);}}),c$3(this,"onSessionProposeResponse",async(e,t,s)=>{const{id:i}=t;if(isJsonRpcResult(t)){const{result:r}=t;this.client.logger.trace({type:"method",method:"onSessionProposeResponse",result:r});const o=this.client.proposal.get(i);this.client.logger.trace({type:"method",method:"onSessionProposeResponse",proposal:o});const a=o.proposer.publicKey;this.client.logger.trace({type:"method",method:"onSessionProposeResponse",selfPublicKey:a});const l=r.responderPublicKey;this.client.logger.trace({type:"method",method:"onSessionProposeResponse",peerPublicKey:l});const p=await this.client.core.crypto.generateSharedKey(a,l);this.pendingSessions.set(i,{sessionTopic:p,pairingTopic:e,proposalId:i,publicKey:a});const h=await this.client.core.relayer.subscribe(p,{transportType:s});this.client.logger.trace({type:"method",method:"onSessionProposeResponse",subscriptionId:h}),await this.client.core.pairing.activate({topic:e});}else if(isJsonRpcError(t)){await this.client.proposal.delete(i,Nt$1("USER_DISCONNECTED"));const r=xi$1("session_connect",i);if(this.events.listenerCount(r)===0)throw new Error(`emitting ${r} without any listeners, 954`);this.events.emit(r,{error:t.error});}}),c$3(this,"onSessionSettleRequest",async(e,t)=>{const{id:s,params:i}=t;try{this.isValidSessionSettleRequest(i);const{relay:r,controller:o,expiry:a,namespaces:l,sessionProperties:p,scopedProperties:h,sessionConfig:u}=t.params,d=[...this.pendingSessions.values()].find(f=>f.sessionTopic===e);if(!d)return this.client.logger.error(`Pending session not found for topic ${e}`);const w=this.client.proposal.get(d.proposalId),m=b$3(v$1(v$1(v$1({topic:e,relay:r,expiry:a,namespaces:l,acknowledged:!0,pairingTopic:d.pairingTopic,requiredNamespaces:w.requiredNamespaces,optionalNamespaces:w.optionalNamespaces,controller:o.publicKey,self:{publicKey:d.publicKey,metadata:this.client.metadata},peer:{publicKey:o.publicKey,metadata:o.metadata}},p&&{sessionProperties:p}),h&&{scopedProperties:h}),u&&{sessionConfig:u}),{transportType:Q$1.relay});await this.client.session.set(m.topic,m),await this.setExpiry(m.topic,m.expiry),await this.client.core.pairing.updateMetadata({topic:d.pairingTopic,metadata:m.peer.metadata}),this.client.events.emit("session_connect",{session:m}),this.events.emit(xi$1("session_connect",d.proposalId),{session:m}),this.pendingSessions.delete(d.proposalId),this.deleteProposal(d.proposalId,!1),this.cleanupDuplicatePairings(m),await this.sendResult({id:t.id,topic:e,result:!0,throwOnFailedPublish:!0});}catch(r){await this.sendError({id:s,topic:e,error:r}),this.client.logger.error(r);}}),c$3(this,"onSessionSettleResponse",async(e,t)=>{const{id:s}=t;isJsonRpcResult(t)?(await this.client.session.update(e,{acknowledged:true}),this.events.emit(xi$1("session_approve",s),{})):isJsonRpcError(t)&&(await this.client.session.delete(e,Nt$1("USER_DISCONNECTED")),this.events.emit(xi$1("session_approve",s),{error:t.error}));}),c$3(this,"onSessionUpdateRequest",async(e,t)=>{const{params:s,id:i}=t;try{const r=`${e}_session_update`,o=Ra.get(r);if(o&&this.isRequestOutOfSync(o,i)){this.client.logger.warn(`Discarding out of sync request - ${i}`),this.sendError({id:i,topic:e,error:Nt$1("INVALID_UPDATE_REQUEST")});return}this.isValidUpdate(v$1({topic:e},s));try{Ra.set(r,i),await this.client.session.update(e,{namespaces:s.namespaces}),await this.sendResult({id:i,topic:e,result:!0,throwOnFailedPublish:!0});}catch(a){throw Ra.delete(r),a}this.client.events.emit("session_update",{id:i,topic:e,params:s});}catch(r){await this.sendError({id:i,topic:e,error:r}),this.client.logger.error(r);}}),c$3(this,"isRequestOutOfSync",(e,t)=>t.toString().slice(0,-3)<e.toString().slice(0,-3)),c$3(this,"onSessionUpdateResponse",(e,t)=>{const{id:s}=t,i=xi$1("session_update",s);if(this.events.listenerCount(i)===0)throw new Error(`emitting ${i} without any listeners`);isJsonRpcResult(t)?this.events.emit(xi$1("session_update",s),{}):isJsonRpcError(t)&&this.events.emit(xi$1("session_update",s),{error:t.error});}),c$3(this,"onSessionExtendRequest",async(e,t)=>{const{id:s}=t;try{this.isValidExtend({topic:e}),await this.setExpiry(e,Ei$1(J)),await this.sendResult({id:s,topic:e,result:!0,throwOnFailedPublish:!0}),this.client.events.emit("session_extend",{id:s,topic:e});}catch(i){await this.sendError({id:s,topic:e,error:i}),this.client.logger.error(i);}}),c$3(this,"onSessionExtendResponse",(e,t)=>{const{id:s}=t,i=xi$1("session_extend",s);if(this.events.listenerCount(i)===0)throw new Error(`emitting ${i} without any listeners`);isJsonRpcResult(t)?this.events.emit(xi$1("session_extend",s),{}):isJsonRpcError(t)&&this.events.emit(xi$1("session_extend",s),{error:t.error});}),c$3(this,"onSessionPingRequest",async(e,t)=>{const{id:s}=t;try{this.isValidPing({topic:e}),await this.sendResult({id:s,topic:e,result:!0,throwOnFailedPublish:!0}),this.client.events.emit("session_ping",{id:s,topic:e});}catch(i){await this.sendError({id:s,topic:e,error:i}),this.client.logger.error(i);}}),c$3(this,"onSessionPingResponse",(e,t)=>{const{id:s}=t,i=xi$1("session_ping",s);setTimeout(()=>{if(this.events.listenerCount(i)===0)throw new Error(`emitting ${i} without any listeners 2176`);isJsonRpcResult(t)?this.events.emit(xi$1("session_ping",s),{}):isJsonRpcError(t)&&this.events.emit(xi$1("session_ping",s),{error:t.error});},500);}),c$3(this,"onSessionDeleteRequest",async(e,t)=>{const{id:s}=t;try{this.isValidDisconnect({topic:e,reason:t.params}),Promise.all([new Promise(i=>{this.client.core.relayer.once(C$2.publish,async()=>{i(await this.deleteSession({topic:e,id:s}));});}),this.sendResult({id:s,topic:e,result:!0,throwOnFailedPublish:!0}),this.cleanupPendingSentRequestsForTopic({topic:e,error:Nt$1("USER_DISCONNECTED")})]).catch(i=>this.client.logger.error(i));}catch(i){this.client.logger.error(i);}}),c$3(this,"onSessionRequest",async e=>{var t,s,i;const{topic:r,payload:o,attestation:a,encryptedId:l,transportType:p}=e,{id:h,params:u}=o;try{await this.isValidRequest(v$1({topic:r},u));const d=this.client.session.get(r),w=await this.getVerifyContext({attestationId:a,hash:kc(JSON.stringify(formatJsonRpcRequest("wc_sessionRequest",u,h))),encryptedId:l,metadata:d.peer.metadata,transportType:p}),m={id:h,topic:r,params:u,verifyContext:w};await this.setPendingSessionRequest(m),p===Q$1.link_mode&&(t=d.peer.metadata.redirect)!=null&&t.universal&&this.client.core.addLinkModeSupportedApp((s=d.peer.metadata.redirect)==null?void 0:s.universal),(i=this.client.signConfig)!=null&&i.disableRequestQueue?this.emitSessionRequest(m):(this.addSessionRequestToSessionRequestQueue(m),this.processSessionRequestQueue());}catch(d){await this.sendError({id:h,topic:r,error:d}),this.client.logger.error(d);}}),c$3(this,"onSessionRequestResponse",(e,t)=>{const{id:s}=t,i=xi$1("session_request",s);if(this.events.listenerCount(i)===0)throw new Error(`emitting ${i} without any listeners`);isJsonRpcResult(t)?this.events.emit(xi$1("session_request",s),{result:t.result}):isJsonRpcError(t)&&this.events.emit(xi$1("session_request",s),{error:t.error});}),c$3(this,"onSessionEventRequest",async(e,t)=>{const{id:s,params:i}=t;try{const r=`${e}_session_event_${i.event.name}`,o=Ra.get(r);if(o&&this.isRequestOutOfSync(o,s)){this.client.logger.info(`Discarding out of sync request - ${s}`);return}this.isValidEmit(v$1({topic:e},i)),this.client.events.emit("session_event",{id:s,topic:e,params:i}),Ra.set(r,s);}catch(r){await this.sendError({id:s,topic:e,error:r}),this.client.logger.error(r);}}),c$3(this,"onSessionAuthenticateResponse",(e,t)=>{const{id:s}=t;this.client.logger.trace({type:"method",method:"onSessionAuthenticateResponse",topic:e,payload:t}),isJsonRpcResult(t)?this.events.emit(xi$1("session_request",s),{result:t.result}):isJsonRpcError(t)&&this.events.emit(xi$1("session_request",s),{error:t.error});}),c$3(this,"onSessionAuthenticateRequest",async e=>{var t;const{topic:s,payload:i,attestation:r,encryptedId:o,transportType:a}=e;try{const{requester:l,authPayload:p,expiryTimestamp:h}=i.params,u=await this.getVerifyContext({attestationId:r,hash:kc(JSON.stringify(i)),encryptedId:o,metadata:l.metadata,transportType:a}),d={requester:l,pairingTopic:s,id:i.id,authPayload:p,verifyContext:u,expiryTimestamp:h};await this.setAuthRequest(i.id,{request:d,pairingTopic:s,transportType:a}),a===Q$1.link_mode&&(t=l.metadata.redirect)!=null&&t.universal&&this.client.core.addLinkModeSupportedApp(l.metadata.redirect.universal),this.client.events.emit("session_authenticate",{topic:s,params:i.params,id:i.id,verifyContext:u});}catch(l){this.client.logger.error(l);const p=i.params.requester.publicKey,h=await this.client.core.crypto.generateKeyPair(),u=this.getAppLinkIfEnabled(i.params.requester.metadata,a),d={type:Ft$2,receiverPublicKey:p,senderPublicKey:h};await this.sendError({id:i.id,topic:s,error:l,encodeOpts:d,rpcOpts:N$2.wc_sessionAuthenticate.autoReject,appLink:u});}}),c$3(this,"addSessionRequestToSessionRequestQueue",e=>{this.sessionRequestQueue.queue.push(e);}),c$3(this,"cleanupAfterResponse",e=>{this.deletePendingSessionRequest(e.response.id,{message:"fulfilled",code:0}),setTimeout(()=>{this.sessionRequestQueue.state=$$2.idle,this.processSessionRequestQueue();},cjsExports$1.toMiliseconds(this.requestQueueDelay));}),c$3(this,"cleanupPendingSentRequestsForTopic",({topic:e,error:t})=>{const s=this.client.core.history.pending;s.length>0&&s.filter(i=>i.topic===e&&i.request.method==="wc_sessionRequest").forEach(i=>{const r=i.request.id,o=xi$1("session_request",r);if(this.events.listenerCount(o)===0)throw new Error(`emitting ${o} without any listeners`);this.events.emit(xi$1("session_request",i.request.id),{error:t});});}),c$3(this,"processSessionRequestQueue",()=>{if(this.sessionRequestQueue.state===$$2.active){this.client.logger.info("session request queue is already active.");return}const e=this.sessionRequestQueue.queue[0];if(!e){this.client.logger.info("session request queue is empty.");return}try{this.sessionRequestQueue.state=$$2.active,this.emitSessionRequest(e);}catch(t){this.client.logger.error(t);}}),c$3(this,"emitSessionRequest",e=>{this.client.events.emit("session_request",e);}),c$3(this,"onPairingCreated",e=>{if(e.methods&&this.expectedPairingMethodMap.set(e.topic,e.methods),e.active)return;const t=this.client.proposal.getAll().find(s=>s.pairingTopic===e.topic);t&&this.onSessionProposeRequest({topic:e.topic,payload:formatJsonRpcRequest("wc_sessionPropose",b$3(v$1({},t),{requiredNamespaces:t.requiredNamespaces,optionalNamespaces:t.optionalNamespaces,relays:t.relays,proposer:t.proposer,sessionProperties:t.sessionProperties,scopedProperties:t.scopedProperties}),t.id)});}),c$3(this,"isValidConnect",async e=>{if(!ma(e)){const{message:l}=ht$2("MISSING_OR_INVALID",`connect() params: ${JSON.stringify(e)}`);throw new Error(l)}const{pairingTopic:t,requiredNamespaces:s,optionalNamespaces:i,sessionProperties:r,scopedProperties:o,relays:a}=e;if(Et$2(t)||await this.isValidPairingTopic(t),!ga(a)){const{message:l}=ht$2("MISSING_OR_INVALID",`connect() relays: ${a}`);throw new Error(l)}if(!Et$2(s)&&Oe$1(s)!==0){const l="requiredNamespaces are deprecated and are automatically assigned to optionalNamespaces";["fatal","error","silent"].includes(this.client.logger.level)?console.warn(l):this.client.logger.warn(l),this.validateNamespaces(s,"requiredNamespaces");}if(!Et$2(i)&&Oe$1(i)!==0&&this.validateNamespaces(i,"optionalNamespaces"),Et$2(r)||this.validateSessionProps(r,"sessionProperties"),!Et$2(o)){this.validateSessionProps(o,"scopedProperties");const l=Object.keys(s||{}).concat(Object.keys(i||{}));if(!Object.keys(o).every(p=>l.includes(p)))throw new Error(`Scoped properties must be a subset of required/optional namespaces, received: ${JSON.stringify(o)}, required/optional namespaces: ${JSON.stringify(l)}`)}}),c$3(this,"validateNamespaces",(e,t)=>{const s=pa(e,"connect()",t);if(s)throw new Error(s.message)}),c$3(this,"isValidApprove",async e=>{if(!ma(e))throw new Error(ht$2("MISSING_OR_INVALID",`approve() params: ${e}`).message);const{id:t,namespaces:s,relayProtocol:i,sessionProperties:r,scopedProperties:o}=e;this.checkRecentlyDeleted(t),await this.isValidProposalId(t);const a=this.client.proposal.get(t),l=Bo$1(s,"approve()");if(l)throw new Error(l.message);const p=No$1(a.requiredNamespaces,s,"approve()");if(p)throw new Error(p.message);if(!nt$1(i,true)){const{message:h}=ht$2("MISSING_OR_INVALID",`approve() relayProtocol: ${i}`);throw new Error(h)}if(Et$2(r)||this.validateSessionProps(r,"sessionProperties"),!Et$2(o)){this.validateSessionProps(o,"scopedProperties");const h=new Set(Object.keys(s));if(!Object.keys(o).every(u=>h.has(u)))throw new Error(`Scoped properties must be a subset of approved namespaces, received: ${JSON.stringify(o)}, approved namespaces: ${Array.from(h).join(", ")}`)}}),c$3(this,"isValidReject",async e=>{if(!ma(e)){const{message:i}=ht$2("MISSING_OR_INVALID",`reject() params: ${e}`);throw new Error(i)}const{id:t,reason:s}=e;if(this.checkRecentlyDeleted(t),await this.isValidProposalId(t),!wa(s)){const{message:i}=ht$2("MISSING_OR_INVALID",`reject() reason: ${JSON.stringify(s)}`);throw new Error(i)}}),c$3(this,"isValidSessionSettleRequest",e=>{if(!ma(e)){const{message:l}=ht$2("MISSING_OR_INVALID",`onSessionSettleRequest() params: ${e}`);throw new Error(l)}const{relay:t,controller:s,namespaces:i,expiry:r}=e;if(!Io$1(t)){const{message:l}=ht$2("MISSING_OR_INVALID","onSessionSettleRequest() relay protocol should be a string");throw new Error(l)}const o=ha(s,"onSessionSettleRequest()");if(o)throw new Error(o.message);const a=Bo$1(i,"onSessionSettleRequest()");if(a)throw new Error(a.message);if(vi$1(r)){const{message:l}=ht$2("EXPIRED","onSessionSettleRequest()");throw new Error(l)}}),c$3(this,"isValidUpdate",async e=>{if(!ma(e)){const{message:a}=ht$2("MISSING_OR_INVALID",`update() params: ${e}`);throw new Error(a)}const{topic:t,namespaces:s}=e;this.checkRecentlyDeleted(t),await this.isValidSessionTopic(t);const i=this.client.session.get(t),r=Bo$1(s,"update()");if(r)throw new Error(r.message);const o=No$1(i.requiredNamespaces,s,"update()");if(o)throw new Error(o.message)}),c$3(this,"isValidExtend",async e=>{if(!ma(e)){const{message:s}=ht$2("MISSING_OR_INVALID",`extend() params: ${e}`);throw new Error(s)}const{topic:t}=e;this.checkRecentlyDeleted(t),await this.isValidSessionTopic(t);}),c$3(this,"isValidRequest",async e=>{if(!ma(e)){const{message:a}=ht$2("MISSING_OR_INVALID",`request() params: ${e}`);throw new Error(a)}const{topic:t,request:s,chainId:i,expiry:r}=e;this.checkRecentlyDeleted(t),await this.isValidSessionTopic(t);const{namespaces:o}=this.client.session.get(t);if(!xa(o,i)){const{message:a}=ht$2("MISSING_OR_INVALID",`request() chainId: ${i}`);throw new Error(a)}if(!ba(s)){const{message:a}=ht$2("MISSING_OR_INVALID",`request() ${JSON.stringify(s)}`);throw new Error(a)}if(!Sa(o,i,s.method)){const{message:a}=ht$2("MISSING_OR_INVALID",`request() method: ${s.method}`);throw new Error(a)}if(r&&!Ia(r,_e$1)){const{message:a}=ht$2("MISSING_OR_INVALID",`request() expiry: ${r}. Expiry must be a number (in seconds) between ${_e$1.min} and ${_e$1.max}`);throw new Error(a)}}),c$3(this,"isValidRespond",async e=>{var t;if(!ma(e)){const{message:r}=ht$2("MISSING_OR_INVALID",`respond() params: ${e}`);throw new Error(r)}const{topic:s,response:i}=e;try{await this.isValidSessionTopic(s);}catch(r){throw (t=e?.response)!=null&&t.id&&this.cleanupAfterResponse(e),r}if(!Ea(i)){const{message:r}=ht$2("MISSING_OR_INVALID",`respond() response: ${JSON.stringify(i)}`);throw new Error(r)}}),c$3(this,"isValidPing",async e=>{if(!ma(e)){const{message:s}=ht$2("MISSING_OR_INVALID",`ping() params: ${e}`);throw new Error(s)}const{topic:t}=e;await this.isValidSessionOrPairingTopic(t);}),c$3(this,"isValidEmit",async e=>{if(!ma(e)){const{message:o}=ht$2("MISSING_OR_INVALID",`emit() params: ${e}`);throw new Error(o)}const{topic:t,event:s,chainId:i}=e;await this.isValidSessionTopic(t);const{namespaces:r}=this.client.session.get(t);if(!xa(r,i)){const{message:o}=ht$2("MISSING_OR_INVALID",`emit() chainId: ${i}`);throw new Error(o)}if(!va(s)){const{message:o}=ht$2("MISSING_OR_INVALID",`emit() event: ${JSON.stringify(s)}`);throw new Error(o)}if(!Oa(r,i,s.name)){const{message:o}=ht$2("MISSING_OR_INVALID",`emit() event: ${JSON.stringify(s)}`);throw new Error(o)}}),c$3(this,"isValidDisconnect",async e=>{if(!ma(e)){const{message:s}=ht$2("MISSING_OR_INVALID",`disconnect() params: ${e}`);throw new Error(s)}const{topic:t}=e;await this.isValidSessionOrPairingTopic(t);}),c$3(this,"isValidAuthenticate",e=>{const{chains:t,uri:s,domain:i,nonce:r}=e;if(!Array.isArray(t)||t.length===0)throw new Error("chains is required and must be a non-empty array");if(!nt$1(s,false))throw new Error("uri is required parameter");if(!nt$1(i,false))throw new Error("domain is required parameter");if(!nt$1(r,false))throw new Error("nonce is required parameter");if([...new Set(t.map(a=>Ne$1(a).namespace))].length>1)throw new Error("Multi-namespace requests are not supported. Please request single namespace only.");const{namespace:o}=Ne$1(t[0]);if(o!=="eip155")throw new Error("Only eip155 namespace is supported for authenticated sessions. Please use .connect() for non-eip155 chains.")}),c$3(this,"getVerifyContext",async e=>{const{attestationId:t,hash:s,encryptedId:i,metadata:r,transportType:o}=e,a={verified:{verifyUrl:r.verifyUrl||ue$1,validation:"UNKNOWN",origin:r.url||""}};try{if(o===Q$1.link_mode){const p=this.getAppLinkIfEnabled(r,o);return a.verified.validation=p&&new URL(p).origin===new URL(r.url).origin?"VALID":"INVALID",a}const l=await this.client.core.verify.resolve({attestationId:t,hash:s,encryptedId:i,verifyUrl:r.verifyUrl});l&&(a.verified.origin=l.origin,a.verified.isScam=l.isScam,a.verified.validation=l.origin===new URL(r.url).origin?"VALID":"INVALID");}catch(l){this.client.logger.warn(l);}return this.client.logger.debug(`Verify context: ${JSON.stringify(a)}`),a}),c$3(this,"validateSessionProps",(e,t)=>{Object.values(e).forEach((s,i)=>{if(s==null){const{message:r}=ht$2("MISSING_OR_INVALID",`${t} must contain an existing value for each key. Received: ${s} for key ${Object.keys(e)[i]}`);throw new Error(r)}});}),c$3(this,"getPendingAuthRequest",e=>{const t=this.client.auth.requests.get(e);return typeof t=="object"?t:void 0}),c$3(this,"addToRecentlyDeleted",(e,t)=>{if(this.recentlyDeletedMap.set(e,t),this.recentlyDeletedMap.size>=this.recentlyDeletedLimit){let s=0;const i=this.recentlyDeletedLimit/2;for(const r of this.recentlyDeletedMap.keys()){if(s++>=i)break;this.recentlyDeletedMap.delete(r);}}}),c$3(this,"checkRecentlyDeleted",e=>{const t=this.recentlyDeletedMap.get(e);if(t){const{message:s}=ht$2("MISSING_OR_INVALID",`Record was recently deleted - ${t}: ${e}`);throw new Error(s)}}),c$3(this,"isLinkModeEnabled",(e,t)=>{var s,i,r,o,a,l,p,h,u;return !e||t!==Q$1.link_mode?false:((i=(s=this.client.metadata)==null?void 0:s.redirect)==null?void 0:i.linkMode)===true&&((o=(r=this.client.metadata)==null?void 0:r.redirect)==null?void 0:o.universal)!==void 0&&((l=(a=this.client.metadata)==null?void 0:a.redirect)==null?void 0:l.universal)!==""&&((p=e?.redirect)==null?void 0:p.universal)!==void 0&&((h=e?.redirect)==null?void 0:h.universal)!==""&&((u=e?.redirect)==null?void 0:u.linkMode)===true&&this.client.core.linkModeSupportedApps.includes(e.redirect.universal)&&typeof(global==null?void 0:global.Linking)<"u"}),c$3(this,"getAppLinkIfEnabled",(e,t)=>{var s;return this.isLinkModeEnabled(e,t)?(s=e?.redirect)==null?void 0:s.universal:void 0}),c$3(this,"handleLinkModeMessage",({url:e})=>{if(!e||!e.includes("wc_ev")||!e.includes("topic"))return;const t=Ai$1(e,"topic")||"",s=decodeURIComponent(Ai$1(e,"wc_ev")||""),i=this.client.session.keys.includes(t);i&&this.client.session.update(t,{transportType:Q$1.link_mode}),this.client.core.dispatchEnvelope({topic:t,message:s,sessionExists:i});}),c$3(this,"registerLinkModeListeners",async()=>{var e;if(Ii$1()||pt$2()&&(e=this.client.metadata.redirect)!=null&&e.linkMode){const t=global==null?void 0:global.Linking;if(typeof t<"u"){t.addEventListener("url",this.handleLinkModeMessage,this.client.name);const s=await t.getInitialURL();s&&setTimeout(()=>{this.handleLinkModeMessage({url:s});},50);}}}),c$3(this,"shouldSetTVF",(e,t)=>{if(!t||e!=="wc_sessionRequest")return  false;const{request:s}=t;return Object.keys(Ke$1).includes(s.method)}),c$3(this,"getTVFParams",(e,t,s)=>{var i,r;try{const o=t.request.method,a=this.extractTxHashesFromResult(o,s);return b$3(v$1({correlationId:e,rpcMethods:[o],chainId:t.chainId},this.isValidContractData(t.request.params)&&{contractAddresses:[(r=(i=t.request.params)==null?void 0:i[0])==null?void 0:r.to]}),{txHashes:a})}catch(o){this.client.logger.warn("Error getting TVF params",o);}return {}}),c$3(this,"isValidContractData",e=>{var t;if(!e)return  false;try{const s=e?.data||((t=e?.[0])==null?void 0:t.data);if(!s.startsWith("0x"))return !1;const i=s.slice(2);return /^[0-9a-fA-F]*$/.test(i)?i.length%2===0:!1}catch{}return  false}),c$3(this,"extractTxHashesFromResult",(e,t)=>{try{const s=Ke$1[e];if(typeof t=="string")return [t];const i=t[s.key];if(se$2(i))return e==="solana_signAllTransactions"?i.map(r=>Ji(r)):i;if(typeof i=="string")return [i]}catch(s){this.client.logger.warn("Error extracting tx hashes from result",s);}return []});}async processPendingMessageEvents(){try{const n=this.client.session.keys,e=this.client.core.relayer.messages.getWithoutAck(n);for(const[t,s]of Object.entries(e))for(const i of s)try{await this.onProviderMessageEvent({topic:t,message:i,publishedAt:Date.now()});}catch{this.client.logger.warn(`Error processing pending message event for topic: ${t}, message: ${i}`);}}catch(n){this.client.logger.warn("processPendingMessageEvents failed",n);}}isInitialized(){if(!this.initialized){const{message:n}=ht$2("NOT_INITIALIZED",this.name);throw new Error(n)}}async confirmOnlineStateOrThrow(){await this.client.core.relayer.confirmOnlineStateOrThrow();}registerRelayerEvents(){this.client.core.relayer.on(C$2.message,n=>{this.onProviderMessageEvent(n);});}async onRelayMessage(n){const{topic:e,message:t,attestation:s,transportType:i}=n,{publicKey:r}=this.client.auth.authKeys.keys.includes(ce$1)?this.client.auth.authKeys.get(ce$1):{publicKey:void 0};try{const o=await this.client.core.crypto.decode(e,t,{receiverPublicKey:r,encoding:i===Q$1.link_mode?xe$1:qt$2});isJsonRpcRequest(o)?(this.client.core.history.set(e,o),await this.onRelayEventRequest({topic:e,payload:o,attestation:s,transportType:i,encryptedId:kc(t)})):isJsonRpcResponse(o)?(await this.client.core.history.resolve(o),await this.onRelayEventResponse({topic:e,payload:o,transportType:i}),this.client.core.history.delete(e,o.id)):await this.onRelayEventUnknownPayload({topic:e,payload:o,transportType:i}),await this.client.core.relayer.messages.ack(e,t);}catch(o){this.client.logger.error(o);}}registerExpirerEvents(){this.client.core.expirer.on(M$2.expired,async n=>{const{topic:e,id:t}=bi$1(n.target);if(t&&this.client.pendingRequest.keys.includes(t))return await this.deletePendingSessionRequest(t,ht$2("EXPIRED"),true);if(t&&this.client.auth.requests.keys.includes(t))return await this.deletePendingAuthRequest(t,ht$2("EXPIRED"),true);e?this.client.session.keys.includes(e)&&(await this.deleteSession({topic:e,expirerHasDeleted:true}),this.client.events.emit("session_expire",{topic:e})):t&&(await this.deleteProposal(t,true),this.client.events.emit("proposal_expire",{id:t}));});}registerPairingEvents(){this.client.core.pairing.events.on(re$1.create,n=>this.onPairingCreated(n)),this.client.core.pairing.events.on(re$1.delete,n=>{this.addToRecentlyDeleted(n.topic,"pairing");});}isValidPairingTopic(n){if(!nt$1(n,false)){const{message:e}=ht$2("MISSING_OR_INVALID",`pairing topic should be a string: ${n}`);throw new Error(e)}if(!this.client.core.pairing.pairings.keys.includes(n)){const{message:e}=ht$2("NO_MATCHING_KEY",`pairing topic doesn't exist: ${n}`);throw new Error(e)}if(vi$1(this.client.core.pairing.pairings.get(n).expiry)){const{message:e}=ht$2("EXPIRED",`pairing topic: ${n}`);throw new Error(e)}}async isValidSessionTopic(n){if(!nt$1(n,false)){const{message:e}=ht$2("MISSING_OR_INVALID",`session topic should be a string: ${n}`);throw new Error(e)}if(this.checkRecentlyDeleted(n),!this.client.session.keys.includes(n)){const{message:e}=ht$2("NO_MATCHING_KEY",`session topic doesn't exist: ${n}`);throw new Error(e)}if(vi$1(this.client.session.get(n).expiry)){await this.deleteSession({topic:n});const{message:e}=ht$2("EXPIRED",`session topic: ${n}`);throw new Error(e)}if(!this.client.core.crypto.keychain.has(n)){const{message:e}=ht$2("MISSING_OR_INVALID",`session topic does not exist in keychain: ${n}`);throw await this.deleteSession({topic:n}),new Error(e)}}async isValidSessionOrPairingTopic(n){if(this.checkRecentlyDeleted(n),this.client.session.keys.includes(n))await this.isValidSessionTopic(n);else if(this.client.core.pairing.pairings.keys.includes(n))this.isValidPairingTopic(n);else if(nt$1(n,false)){const{message:e}=ht$2("NO_MATCHING_KEY",`session or pairing topic doesn't exist: ${n}`);throw new Error(e)}else {const{message:e}=ht$2("MISSING_OR_INVALID",`session or pairing topic should be a string: ${n}`);throw new Error(e)}}async isValidProposalId(n){if(!ya(n)){const{message:e}=ht$2("MISSING_OR_INVALID",`proposal id should be a number: ${n}`);throw new Error(e)}if(!this.client.proposal.keys.includes(n)){const{message:e}=ht$2("NO_MATCHING_KEY",`proposal id doesn't exist: ${n}`);throw new Error(e)}if(vi$1(this.client.proposal.get(n).expiryTimestamp)){await this.deleteProposal(n);const{message:e}=ht$2("EXPIRED",`proposal id: ${n}`);throw new Error(e)}}}class Os extends zi{constructor(n,e){super(n,e,pt$1,we$1),this.core=n,this.logger=e;}}let St$1 = class St extends zi{constructor(n,e){super(n,e,ht$1,we$1),this.core=n,this.logger=e;}};class bs extends zi{constructor(n,e){super(n,e,ut$1,we$1,t=>t.id),this.core=n,this.logger=e;}}class As extends zi{constructor(n,e){super(n,e,mt$1,ae$1,()=>ce$1),this.core=n,this.logger=e;}}class xs extends zi{constructor(n,e){super(n,e,_t$1,ae$1),this.core=n,this.logger=e;}}class Cs extends zi{constructor(n,e){super(n,e,Et,ae$1,t=>t.id),this.core=n,this.logger=e;}}var Vs=Object.defineProperty,Ds=(S,n,e)=>n in S?Vs(S,n,{enumerable:true,configurable:true,writable:true,value:e}):S[n]=e,Ge$1=(S,n,e)=>Ds(S,typeof n!="symbol"?n+"":n,e);class Ls{constructor(n,e){this.core=n,this.logger=e,Ge$1(this,"authKeys"),Ge$1(this,"pairingTopics"),Ge$1(this,"requests"),this.authKeys=new As(this.core,this.logger),this.pairingTopics=new xs(this.core,this.logger),this.requests=new Cs(this.core,this.logger);}async init(){await this.authKeys.init(),await this.pairingTopics.init(),await this.requests.init();}}var ks=Object.defineProperty,Ms=(S,n,e)=>n in S?ks(S,n,{enumerable:true,configurable:true,writable:true,value:e}):S[n]=e,E$2=(S,n,e)=>Ms(S,typeof n!="symbol"?n+"":n,e);let Ee$1 = class Ee extends J$1{constructor(n){super(n),E$2(this,"protocol",De$1),E$2(this,"version",Le$1),E$2(this,"name",me$1.name),E$2(this,"metadata"),E$2(this,"core"),E$2(this,"logger"),E$2(this,"events",new EventEmitter),E$2(this,"engine"),E$2(this,"session"),E$2(this,"proposal"),E$2(this,"pendingRequest"),E$2(this,"auth"),E$2(this,"signConfig"),E$2(this,"on",(t,s)=>this.events.on(t,s)),E$2(this,"once",(t,s)=>this.events.once(t,s)),E$2(this,"off",(t,s)=>this.events.off(t,s)),E$2(this,"removeListener",(t,s)=>this.events.removeListener(t,s)),E$2(this,"removeAllListeners",t=>this.events.removeAllListeners(t)),E$2(this,"connect",async t=>{try{return await this.engine.connect(t)}catch(s){throw this.logger.error(s.message),s}}),E$2(this,"pair",async t=>{try{return await this.engine.pair(t)}catch(s){throw this.logger.error(s.message),s}}),E$2(this,"approve",async t=>{try{return await this.engine.approve(t)}catch(s){throw this.logger.error(s.message),s}}),E$2(this,"reject",async t=>{try{return await this.engine.reject(t)}catch(s){throw this.logger.error(s.message),s}}),E$2(this,"update",async t=>{try{return await this.engine.update(t)}catch(s){throw this.logger.error(s.message),s}}),E$2(this,"extend",async t=>{try{return await this.engine.extend(t)}catch(s){throw this.logger.error(s.message),s}}),E$2(this,"request",async t=>{try{return await this.engine.request(t)}catch(s){throw this.logger.error(s.message),s}}),E$2(this,"respond",async t=>{try{return await this.engine.respond(t)}catch(s){throw this.logger.error(s.message),s}}),E$2(this,"ping",async t=>{try{return await this.engine.ping(t)}catch(s){throw this.logger.error(s.message),s}}),E$2(this,"emit",async t=>{try{return await this.engine.emit(t)}catch(s){throw this.logger.error(s.message),s}}),E$2(this,"disconnect",async t=>{try{return await this.engine.disconnect(t)}catch(s){throw this.logger.error(s.message),s}}),E$2(this,"find",t=>{try{return this.engine.find(t)}catch(s){throw this.logger.error(s.message),s}}),E$2(this,"getPendingSessionRequests",()=>{try{return this.engine.getPendingSessionRequests()}catch(t){throw this.logger.error(t.message),t}}),E$2(this,"authenticate",async(t,s)=>{try{return await this.engine.authenticate(t,s)}catch(i){throw this.logger.error(i.message),i}}),E$2(this,"formatAuthMessage",t=>{try{return this.engine.formatAuthMessage(t)}catch(s){throw this.logger.error(s.message),s}}),E$2(this,"approveSessionAuthenticate",async t=>{try{return await this.engine.approveSessionAuthenticate(t)}catch(s){throw this.logger.error(s.message),s}}),E$2(this,"rejectSessionAuthenticate",async t=>{try{return await this.engine.rejectSessionAuthenticate(t)}catch(s){throw this.logger.error(s.message),s}}),this.name=n?.name||me$1.name,this.metadata=oi$1(n?.metadata),this.signConfig=n?.signConfig;const e=typeof n?.logger<"u"&&typeof n?.logger!="string"?n.logger:Ot$2(k$4({level:n?.logger||me$1.logger}));this.core=n?.core||new Xo(n),this.logger=E$4(e,this.name),this.session=new St$1(this.core,this.logger),this.proposal=new Os(this.core,this.logger),this.pendingRequest=new bs(this.core,this.logger),this.engine=new Ns(this),this.auth=new Ls(this.core,this.logger);}static async init(n){const e=new Ee(n);return await e.initialize(),e}get context(){return y$6(this.logger)}get pairing(){return this.core.pairing.pairings}async initialize(){this.logger.trace("Initialized");try{await this.core.start(),await this.session.init(),await this.proposal.init(),await this.pendingRequest.init(),await this.auth.init(),await this.engine.init(),this.logger.info("SignClient Initialization Success"),setTimeout(()=>{this.engine.processRelayMessageCache();},cjsExports$1.toMiliseconds(cjsExports$1.ONE_SECOND));}catch(n){throw this.logger.info("SignClient Initialization Failure"),this.logger.error(n.message),n}}};

const et="error",St="wss://relay.walletconnect.org",Dt="wc",qt="universal_provider",U=`${Dt}@2:${qt}:`,st="https://rpc.walletconnect.org/v1/",I$1="generic",jt=`${st}bundler`,u$2={DEFAULT_CHAIN_CHANGED:"default_chain_changed"};function Rt(){}function k$1(s){return s==null||typeof s!="object"&&typeof s!="function"}function W$1(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function _t(s){if(k$1(s))return s;if(Array.isArray(s)||W$1(s)||s instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&s instanceof SharedArrayBuffer)return s.slice(0);const t=Object.getPrototypeOf(s),e=t.constructor;if(s instanceof Date||s instanceof Map||s instanceof Set)return new e(s);if(s instanceof RegExp){const i=new e(s);return i.lastIndex=s.lastIndex,i}if(s instanceof DataView)return new e(s.buffer.slice(0));if(s instanceof Error){const i=new e(s.message);return i.stack=s.stack,i.name=s.name,i.cause=s.cause,i}if(typeof File<"u"&&s instanceof File)return new e([s],s.name,{type:s.type,lastModified:s.lastModified});if(typeof s=="object"){const i=Object.create(t);return Object.assign(i,s)}return s}function it(s){return typeof s=="object"&&s!==null}function rt(s){return Object.getOwnPropertySymbols(s).filter(t=>Object.prototype.propertyIsEnumerable.call(s,t))}function nt(s){return s==null?s===void 0?"[object Undefined]":"[object Null]":Object.prototype.toString.call(s)}const Ut="[object RegExp]",at="[object String]",ct="[object Number]",ot="[object Boolean]",ht="[object Arguments]",Ft="[object Symbol]",Lt="[object Date]",Mt="[object Map]",xt="[object Set]",Bt="[object Array]",Gt="[object ArrayBuffer]",Jt="[object Object]",zt="[object DataView]",kt="[object Uint8Array]",Wt="[object Uint8ClampedArray]",Kt="[object Uint16Array]",Vt="[object Uint32Array]",Xt="[object Int8Array]",Yt="[object Int16Array]",Qt="[object Int32Array]",Zt="[object Float32Array]",Tt="[object Float64Array]";function te(s,t){return $$1(s,void 0,s,new Map,t)}function $$1(s,t,e,i=new Map,n=void 0){const a=n?.(s,t,e,i);if(a!=null)return a;if(k$1(s))return s;if(i.has(s))return i.get(s);if(Array.isArray(s)){const r=new Array(s.length);i.set(s,r);for(let c=0;c<s.length;c++)r[c]=$$1(s[c],c,e,i,n);return Object.hasOwn(s,"index")&&(r.index=s.index),Object.hasOwn(s,"input")&&(r.input=s.input),r}if(s instanceof Date)return new Date(s.getTime());if(s instanceof RegExp){const r=new RegExp(s.source,s.flags);return r.lastIndex=s.lastIndex,r}if(s instanceof Map){const r=new Map;i.set(s,r);for(const[c,o]of s)r.set(c,$$1(o,c,e,i,n));return r}if(s instanceof Set){const r=new Set;i.set(s,r);for(const c of s)r.add($$1(c,void 0,e,i,n));return r}if(typeof Buffer<"u"&&Buffer.isBuffer(s))return s.subarray();if(W$1(s)){const r=new(Object.getPrototypeOf(s)).constructor(s.length);i.set(s,r);for(let c=0;c<s.length;c++)r[c]=$$1(s[c],c,e,i,n);return r}if(s instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&s instanceof SharedArrayBuffer)return s.slice(0);if(s instanceof DataView){const r=new DataView(s.buffer.slice(0),s.byteOffset,s.byteLength);return i.set(s,r),y$2(r,s,e,i,n),r}if(typeof File<"u"&&s instanceof File){const r=new File([s],s.name,{type:s.type});return i.set(s,r),y$2(r,s,e,i,n),r}if(s instanceof Blob){const r=new Blob([s],{type:s.type});return i.set(s,r),y$2(r,s,e,i,n),r}if(s instanceof Error){const r=new s.constructor;return i.set(s,r),r.message=s.message,r.name=s.name,r.stack=s.stack,r.cause=s.cause,y$2(r,s,e,i,n),r}if(typeof s=="object"&&ee(s)){const r=Object.create(Object.getPrototypeOf(s));return i.set(s,r),y$2(r,s,e,i,n),r}return s}function y$2(s,t,e=s,i,n){const a=[...Object.keys(t),...rt(t)];for(let r=0;r<a.length;r++){const c=a[r],o=Object.getOwnPropertyDescriptor(s,c);(o==null||o.writable)&&(s[c]=$$1(t[c],c,e,i,n));}}function ee(s){switch(nt(s)){case ht:case Bt:case Gt:case zt:case ot:case Lt:case Zt:case Tt:case Xt:case Yt:case Qt:case Mt:case ct:case Jt:case Ut:case xt:case at:case Ft:case kt:case Wt:case Kt:case Vt:return  true;default:return  false}}function se(s,t){return te(s,(e,i,n,a)=>{if(typeof s=="object")switch(Object.prototype.toString.call(s)){case ct:case at:case ot:{const c=new s.constructor(s?.valueOf());return y$2(c,s),c}case ht:{const c={};return y$2(c,s),c.length=s.length,c[Symbol.iterator]=s[Symbol.iterator],c}default:return}})}function pt(s){return se(s)}function dt(s){return s!==null&&typeof s=="object"&&nt(s)==="[object Arguments]"}function ie(s){return W$1(s)}function re(s){if(typeof s!="object"||s==null)return  false;if(Object.getPrototypeOf(s)===null)return  true;if(Object.prototype.toString.call(s)!=="[object Object]"){const e=s[Symbol.toStringTag];return e==null||!Object.getOwnPropertyDescriptor(s,Symbol.toStringTag)?.writable?false:s.toString()===`[object ${e}]`}let t=s;for(;Object.getPrototypeOf(t)!==null;)t=Object.getPrototypeOf(t);return Object.getPrototypeOf(s)===t}function ne(s,...t){const e=t.slice(0,-1),i=t[t.length-1];let n=s;for(let a=0;a<e.length;a++){const r=e[a];n=F(n,r,i,new Map);}return n}function F(s,t,e,i){if(k$1(s)&&(s=Object(s)),t==null||typeof t!="object")return s;if(i.has(t))return _t(i.get(t));if(i.set(t,s),Array.isArray(t)){t=t.slice();for(let a=0;a<t.length;a++)t[a]=t[a]??void 0;}const n=[...Object.keys(t),...rt(t)];for(let a=0;a<n.length;a++){const r=n[a];let c=t[r],o=s[r];if(dt(c)&&(c={...c}),dt(o)&&(o={...o}),typeof Buffer<"u"&&Buffer.isBuffer(c)&&(c=pt(c)),Array.isArray(c))if(typeof o=="object"&&o!=null){const w=[],v=Reflect.ownKeys(o);for(let P=0;P<v.length;P++){const p=v[P];w[p]=o[p];}o=w;}else o=[];const m=e(o,c,r,s,t,i);m!=null?s[r]=m:Array.isArray(c)||it(o)&&it(c)?s[r]=F(o,c,e,i):o==null&&re(c)?s[r]=F({},c,e,i):o==null&&ie(c)?s[r]=pt(c):(o===void 0||c!==void 0)&&(s[r]=c);}return s}function ae(s,...t){return ne(s,...t,Rt)}var ce=Object.defineProperty,oe=Object.defineProperties,he=Object.getOwnPropertyDescriptors,ut=Object.getOwnPropertySymbols,pe=Object.prototype.hasOwnProperty,de=Object.prototype.propertyIsEnumerable,lt=(s,t,e)=>t in s?ce(s,t,{enumerable:true,configurable:true,writable:true,value:e}):s[t]=e,L$1=(s,t)=>{for(var e in t||(t={}))pe.call(t,e)&&lt(s,e,t[e]);if(ut)for(var e of ut(t))de.call(t,e)&&lt(s,e,t[e]);return s},ue=(s,t)=>oe(s,he(t));function d$2(s,t,e){var i;const n=Ne$1(s);return ((i=t.rpcMap)==null?void 0:i[n.reference])||`${st}?chainId=${n.namespace}:${n.reference}&projectId=${e}`}function b$2(s){return s.includes(":")?s.split(":")[1]:s}function ft(s){return s.map(t=>`${t.split(":")[0]}:${t.split(":")[1]}`)}function le(s,t){const e=Object.keys(t.namespaces).filter(n=>n.includes(s));if(!e.length)return [];const i=[];return e.forEach(n=>{const a=t.namespaces[n].accounts;i.push(...a);}),i}function M$1(s={},t={}){const e=mt(s),i=mt(t);return ae(e,i)}function mt(s){var t,e,i,n,a;const r={};if(!Oe$1(s))return r;for(const[c,o]of Object.entries(s)){const m=yn$1(c)?[c]:o.chains,w=o.methods||[],v=o.events||[],P=o.rpcMap||{},p=yo$1(c);r[p]=ue(L$1(L$1({},r[p]),o),{chains:ot$1(m,(t=r[p])==null?void 0:t.chains),methods:ot$1(w,(e=r[p])==null?void 0:e.methods),events:ot$1(v,(i=r[p])==null?void 0:i.events)}),(Oe$1(P)||Oe$1(((n=r[p])==null?void 0:n.rpcMap)||{}))&&(r[p].rpcMap=L$1(L$1({},P),(a=r[p])==null?void 0:a.rpcMap));}return r}function vt(s){return s.includes(":")?s.split(":")[2]:s}function gt(s){const t={};for(const[e,i]of Object.entries(s)){const n=i.methods||[],a=i.events||[],r=i.accounts||[],c=yn$1(e)?[e]:i.chains?i.chains:ft(i.accounts);t[e]={chains:c,methods:n,events:a,accounts:r};}return t}function K(s){return typeof s=="number"?s:s.includes("0x")?parseInt(s,16):(s=s.includes(":")?s.split(":")[1]:s,isNaN(Number(s))?s:Number(s))}const Pt={},h$2=s=>Pt[s],V$1=(s,t)=>{Pt[s]=t;};var fe=Object.defineProperty,me=(s,t,e)=>t in s?fe(s,t,{enumerable:true,configurable:true,writable:true,value:e}):s[t]=e,O=(s,t,e)=>me(s,typeof t!="symbol"?t+"":t,e);class ve{constructor(t){O(this,"name","polkadot"),O(this,"client"),O(this,"httpProviders"),O(this,"events"),O(this,"namespace"),O(this,"chainId"),this.namespace=t.namespace,this.events=h$2("events"),this.client=h$2("client"),this.chainId=this.getDefaultChain(),this.httpProviders=this.createHttpProviders();}updateNamespace(t){this.namespace=Object.assign(this.namespace,t);}requestAccounts(){return this.getAccounts()}getDefaultChain(){if(this.chainId)return this.chainId;if(this.namespace.defaultChain)return this.namespace.defaultChain;const t=this.namespace.chains[0];if(!t)throw new Error("ChainId not found");return t.split(":")[1]}request(t){return this.namespace.methods.includes(t.request.method)?this.client.request(t):this.getHttpProvider().request(t.request)}setDefaultChain(t,e){this.httpProviders[t]||this.setHttpProvider(t,e),this.chainId=t,this.events.emit(u$2.DEFAULT_CHAIN_CHANGED,`${this.name}:${t}`);}getAccounts(){const t=this.namespace.accounts;return t?t.filter(e=>e.split(":")[1]===this.chainId.toString()).map(e=>e.split(":")[2])||[]:[]}createHttpProviders(){const t={};return this.namespace.chains.forEach(e=>{var i;const n=b$2(e);t[n]=this.createHttpProvider(n,(i=this.namespace.rpcMap)==null?void 0:i[e]);}),t}getHttpProvider(){const t=`${this.name}:${this.chainId}`,e=this.httpProviders[t];if(typeof e>"u")throw new Error(`JSON-RPC provider for ${t} not found`);return e}setHttpProvider(t,e){const i=this.createHttpProvider(t,e);i&&(this.httpProviders[t]=i);}createHttpProvider(t,e){const i=e||d$2(t,this.namespace,this.client.core.projectId);if(!i)throw new Error(`No RPC url provided for chainId: ${t}`);return new o$4(new f$5(i,h$2("disableProviderPing")))}}var ge=Object.defineProperty,Pe=Object.defineProperties,we=Object.getOwnPropertyDescriptors,wt=Object.getOwnPropertySymbols,ye=Object.prototype.hasOwnProperty,be=Object.prototype.propertyIsEnumerable,X=(s,t,e)=>t in s?ge(s,t,{enumerable:true,configurable:true,writable:true,value:e}):s[t]=e,yt=(s,t)=>{for(var e in t||(t={}))ye.call(t,e)&&X(s,e,t[e]);if(wt)for(var e of wt(t))be.call(t,e)&&X(s,e,t[e]);return s},bt=(s,t)=>Pe(s,we(t)),A$1=(s,t,e)=>X(s,typeof t!="symbol"?t+"":t,e);class Ie{constructor(t){A$1(this,"name","eip155"),A$1(this,"client"),A$1(this,"chainId"),A$1(this,"namespace"),A$1(this,"httpProviders"),A$1(this,"events"),this.namespace=t.namespace,this.events=h$2("events"),this.client=h$2("client"),this.httpProviders=this.createHttpProviders(),this.chainId=parseInt(this.getDefaultChain());}async request(t){switch(t.request.method){case "eth_requestAccounts":return this.getAccounts();case "eth_accounts":return this.getAccounts();case "wallet_switchEthereumChain":return await this.handleSwitchChain(t);case "eth_chainId":return parseInt(this.getDefaultChain());case "wallet_getCapabilities":return await this.getCapabilities(t);case "wallet_getCallsStatus":return await this.getCallStatus(t)}return this.namespace.methods.includes(t.request.method)?await this.client.request(t):this.getHttpProvider().request(t.request)}updateNamespace(t){this.namespace=Object.assign(this.namespace,t);}setDefaultChain(t,e){this.httpProviders[t]||this.setHttpProvider(parseInt(t),e),this.chainId=parseInt(t),this.events.emit(u$2.DEFAULT_CHAIN_CHANGED,`${this.name}:${t}`);}requestAccounts(){return this.getAccounts()}getDefaultChain(){if(this.chainId)return this.chainId.toString();if(this.namespace.defaultChain)return this.namespace.defaultChain;const t=this.namespace.chains[0];if(!t)throw new Error("ChainId not found");return t.split(":")[1]}createHttpProvider(t,e){const i=e||d$2(`${this.name}:${t}`,this.namespace,this.client.core.projectId);if(!i)throw new Error(`No RPC url provided for chainId: ${t}`);return new o$4(new f$5(i,h$2("disableProviderPing")))}setHttpProvider(t,e){const i=this.createHttpProvider(t,e);i&&(this.httpProviders[t]=i);}createHttpProviders(){const t={};return this.namespace.chains.forEach(e=>{var i;const n=parseInt(b$2(e));t[n]=this.createHttpProvider(n,(i=this.namespace.rpcMap)==null?void 0:i[e]);}),t}getAccounts(){const t=this.namespace.accounts;return t?[...new Set(t.filter(e=>e.split(":")[1]===this.chainId.toString()).map(e=>e.split(":")[2]))]:[]}getHttpProvider(){const t=this.chainId,e=this.httpProviders[t];if(typeof e>"u")throw new Error(`JSON-RPC provider for ${t} not found`);return e}async handleSwitchChain(t){var e,i;let n=t.request.params?(e=t.request.params[0])==null?void 0:e.chainId:"0x0";n=n.startsWith("0x")?n:`0x${n}`;const a=parseInt(n,16);if(this.isChainApproved(a))this.setDefaultChain(`${a}`);else if(this.namespace.methods.includes("wallet_switchEthereumChain"))await this.client.request({topic:t.topic,request:{method:t.request.method,params:[{chainId:n}]},chainId:(i=this.namespace.chains)==null?void 0:i[0]}),this.setDefaultChain(`${a}`);else throw new Error(`Failed to switch to chain 'eip155:${a}'. The chain is not approved or the wallet does not support 'wallet_switchEthereumChain' method.`);return null}isChainApproved(t){return this.namespace.chains.includes(`${this.name}:${t}`)}async getCapabilities(t){var e,i,n,a,r;const c=(i=(e=t.request)==null?void 0:e.params)==null?void 0:i[0],o=((a=(n=t.request)==null?void 0:n.params)==null?void 0:a[1])||[],m=`${c}${o.join(",")}`;if(!c)throw new Error("Missing address parameter in `wallet_getCapabilities` request");const w=this.client.session.get(t.topic),v=((r=w?.sessionProperties)==null?void 0:r.capabilities)||{};if(v!=null&&v[m])return v?.[m];const P=await this.client.request(t);try{await this.client.session.update(t.topic,{sessionProperties:bt(yt({},w.sessionProperties||{}),{capabilities:bt(yt({},v||{}),{[m]:P})})});}catch(p){console.warn("Failed to update session with capabilities",p);}return P}async getCallStatus(t){var e,i;const n=this.client.session.get(t.topic),a=(e=n.sessionProperties)==null?void 0:e.bundler_name;if(a){const c=this.getBundlerUrl(t.chainId,a);try{return await this.getUserOperationReceipt(c,t)}catch(o){console.warn("Failed to fetch call status from bundler",o,c);}}const r=(i=n.sessionProperties)==null?void 0:i.bundler_url;if(r)try{return await this.getUserOperationReceipt(r,t)}catch(c){console.warn("Failed to fetch call status from custom bundler",c,r);}if(this.namespace.methods.includes(t.request.method))return await this.client.request(t);throw new Error("Fetching call status not approved by the wallet.")}async getUserOperationReceipt(t,e){var i;const n=new URL(t),a=await fetch(n,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(formatJsonRpcRequest("eth_getUserOperationReceipt",[(i=e.request.params)==null?void 0:i[0]]))});if(!a.ok)throw new Error(`Failed to fetch user operation receipt - ${a.status}`);return await a.json()}getBundlerUrl(t,e){return `${jt}?projectId=${this.client.core.projectId}&chainId=${t}&bundler=${e}`}}var $e=Object.defineProperty,Oe=(s,t,e)=>t in s?$e(s,t,{enumerable:true,configurable:true,writable:true,value:e}):s[t]=e,C$1=(s,t,e)=>Oe(s,typeof t!="symbol"?t+"":t,e);class Ae{constructor(t){C$1(this,"name","solana"),C$1(this,"client"),C$1(this,"httpProviders"),C$1(this,"events"),C$1(this,"namespace"),C$1(this,"chainId"),this.namespace=t.namespace,this.events=h$2("events"),this.client=h$2("client"),this.chainId=this.getDefaultChain(),this.httpProviders=this.createHttpProviders();}updateNamespace(t){this.namespace=Object.assign(this.namespace,t);}requestAccounts(){return this.getAccounts()}request(t){return this.namespace.methods.includes(t.request.method)?this.client.request(t):this.getHttpProvider().request(t.request)}setDefaultChain(t,e){this.httpProviders[t]||this.setHttpProvider(t,e),this.chainId=t,this.events.emit(u$2.DEFAULT_CHAIN_CHANGED,`${this.name}:${t}`);}getDefaultChain(){if(this.chainId)return this.chainId;if(this.namespace.defaultChain)return this.namespace.defaultChain;const t=this.namespace.chains[0];if(!t)throw new Error("ChainId not found");return t.split(":")[1]}getAccounts(){const t=this.namespace.accounts;return t?[...new Set(t.filter(e=>e.split(":")[1]===this.chainId.toString()).map(e=>e.split(":")[2]))]:[]}createHttpProviders(){const t={};return this.namespace.chains.forEach(e=>{var i;const n=b$2(e);t[n]=this.createHttpProvider(n,(i=this.namespace.rpcMap)==null?void 0:i[e]);}),t}getHttpProvider(){const t=`${this.name}:${this.chainId}`,e=this.httpProviders[t];if(typeof e>"u")throw new Error(`JSON-RPC provider for ${t} not found`);return e}setHttpProvider(t,e){const i=this.createHttpProvider(t,e);i&&(this.httpProviders[t]=i);}createHttpProvider(t,e){const i=e||d$2(t,this.namespace,this.client.core.projectId);if(!i)throw new Error(`No RPC url provided for chainId: ${t}`);return new o$4(new f$5(i,h$2("disableProviderPing")))}}var Ce=Object.defineProperty,He=(s,t,e)=>t in s?Ce(s,t,{enumerable:true,configurable:true,writable:true,value:e}):s[t]=e,H$1=(s,t,e)=>He(s,typeof t!="symbol"?t+"":t,e);class Ee{constructor(t){H$1(this,"name","cosmos"),H$1(this,"client"),H$1(this,"httpProviders"),H$1(this,"events"),H$1(this,"namespace"),H$1(this,"chainId"),this.namespace=t.namespace,this.events=h$2("events"),this.client=h$2("client"),this.chainId=this.getDefaultChain(),this.httpProviders=this.createHttpProviders();}updateNamespace(t){this.namespace=Object.assign(this.namespace,t);}requestAccounts(){return this.getAccounts()}getDefaultChain(){if(this.chainId)return this.chainId;if(this.namespace.defaultChain)return this.namespace.defaultChain;const t=this.namespace.chains[0];if(!t)throw new Error("ChainId not found");return t.split(":")[1]}request(t){return this.namespace.methods.includes(t.request.method)?this.client.request(t):this.getHttpProvider().request(t.request)}setDefaultChain(t,e){this.httpProviders[t]||this.setHttpProvider(t,e),this.chainId=t,this.events.emit(u$2.DEFAULT_CHAIN_CHANGED,`${this.name}:${this.chainId}`);}getAccounts(){const t=this.namespace.accounts;return t?[...new Set(t.filter(e=>e.split(":")[1]===this.chainId.toString()).map(e=>e.split(":")[2]))]:[]}createHttpProviders(){const t={};return this.namespace.chains.forEach(e=>{var i;const n=b$2(e);t[n]=this.createHttpProvider(n,(i=this.namespace.rpcMap)==null?void 0:i[e]);}),t}getHttpProvider(){const t=`${this.name}:${this.chainId}`,e=this.httpProviders[t];if(typeof e>"u")throw new Error(`JSON-RPC provider for ${t} not found`);return e}setHttpProvider(t,e){const i=this.createHttpProvider(t,e);i&&(this.httpProviders[t]=i);}createHttpProvider(t,e){const i=e||d$2(t,this.namespace,this.client.core.projectId);if(!i)throw new Error(`No RPC url provided for chainId: ${t}`);return new o$4(new f$5(i,h$2("disableProviderPing")))}}var Ne=Object.defineProperty,Se=(s,t,e)=>t in s?Ne(s,t,{enumerable:true,configurable:true,writable:true,value:e}):s[t]=e,E$1=(s,t,e)=>Se(s,typeof t!="symbol"?t+"":t,e);class De{constructor(t){E$1(this,"name","algorand"),E$1(this,"client"),E$1(this,"httpProviders"),E$1(this,"events"),E$1(this,"namespace"),E$1(this,"chainId"),this.namespace=t.namespace,this.events=h$2("events"),this.client=h$2("client"),this.chainId=this.getDefaultChain(),this.httpProviders=this.createHttpProviders();}updateNamespace(t){this.namespace=Object.assign(this.namespace,t);}requestAccounts(){return this.getAccounts()}request(t){return this.namespace.methods.includes(t.request.method)?this.client.request(t):this.getHttpProvider().request(t.request)}setDefaultChain(t,e){if(!this.httpProviders[t]){const i=e||d$2(`${this.name}:${t}`,this.namespace,this.client.core.projectId);if(!i)throw new Error(`No RPC url provided for chainId: ${t}`);this.setHttpProvider(t,i);}this.chainId=t,this.events.emit(u$2.DEFAULT_CHAIN_CHANGED,`${this.name}:${this.chainId}`);}getDefaultChain(){if(this.chainId)return this.chainId;if(this.namespace.defaultChain)return this.namespace.defaultChain;const t=this.namespace.chains[0];if(!t)throw new Error("ChainId not found");return t.split(":")[1]}getAccounts(){const t=this.namespace.accounts;return t?[...new Set(t.filter(e=>e.split(":")[1]===this.chainId.toString()).map(e=>e.split(":")[2]))]:[]}createHttpProviders(){const t={};return this.namespace.chains.forEach(e=>{var i;t[e]=this.createHttpProvider(e,(i=this.namespace.rpcMap)==null?void 0:i[e]);}),t}getHttpProvider(){const t=`${this.name}:${this.chainId}`,e=this.httpProviders[t];if(typeof e>"u")throw new Error(`JSON-RPC provider for ${t} not found`);return e}setHttpProvider(t,e){const i=this.createHttpProvider(t,e);i&&(this.httpProviders[t]=i);}createHttpProvider(t,e){const i=e||d$2(t,this.namespace,this.client.core.projectId);return typeof i>"u"?void 0:new o$4(new f$5(i,h$2("disableProviderPing")))}}var qe=Object.defineProperty,je=(s,t,e)=>t in s?qe(s,t,{enumerable:true,configurable:true,writable:true,value:e}):s[t]=e,N$1=(s,t,e)=>je(s,typeof t!="symbol"?t+"":t,e);class Re{constructor(t){N$1(this,"name","cip34"),N$1(this,"client"),N$1(this,"httpProviders"),N$1(this,"events"),N$1(this,"namespace"),N$1(this,"chainId"),this.namespace=t.namespace,this.events=h$2("events"),this.client=h$2("client"),this.chainId=this.getDefaultChain(),this.httpProviders=this.createHttpProviders();}updateNamespace(t){this.namespace=Object.assign(this.namespace,t);}requestAccounts(){return this.getAccounts()}getDefaultChain(){if(this.chainId)return this.chainId;if(this.namespace.defaultChain)return this.namespace.defaultChain;const t=this.namespace.chains[0];if(!t)throw new Error("ChainId not found");return t.split(":")[1]}request(t){return this.namespace.methods.includes(t.request.method)?this.client.request(t):this.getHttpProvider().request(t.request)}setDefaultChain(t,e){this.httpProviders[t]||this.setHttpProvider(t,e),this.chainId=t,this.events.emit(u$2.DEFAULT_CHAIN_CHANGED,`${this.name}:${this.chainId}`);}getAccounts(){const t=this.namespace.accounts;return t?[...new Set(t.filter(e=>e.split(":")[1]===this.chainId.toString()).map(e=>e.split(":")[2]))]:[]}createHttpProviders(){const t={};return this.namespace.chains.forEach(e=>{const i=this.getCardanoRPCUrl(e),n=b$2(e);t[n]=this.createHttpProvider(n,i);}),t}getHttpProvider(){const t=`${this.name}:${this.chainId}`,e=this.httpProviders[t];if(typeof e>"u")throw new Error(`JSON-RPC provider for ${t} not found`);return e}getCardanoRPCUrl(t){const e=this.namespace.rpcMap;if(e)return e[t]}setHttpProvider(t,e){const i=this.createHttpProvider(t,e);i&&(this.httpProviders[t]=i);}createHttpProvider(t,e){const i=e||this.getCardanoRPCUrl(t);if(!i)throw new Error(`No RPC url provided for chainId: ${t}`);return new o$4(new f$5(i,h$2("disableProviderPing")))}}var _e=Object.defineProperty,Ue=(s,t,e)=>t in s?_e(s,t,{enumerable:true,configurable:true,writable:true,value:e}):s[t]=e,S$2=(s,t,e)=>Ue(s,typeof t!="symbol"?t+"":t,e);class Fe{constructor(t){S$2(this,"name","elrond"),S$2(this,"client"),S$2(this,"httpProviders"),S$2(this,"events"),S$2(this,"namespace"),S$2(this,"chainId"),this.namespace=t.namespace,this.events=h$2("events"),this.client=h$2("client"),this.chainId=this.getDefaultChain(),this.httpProviders=this.createHttpProviders();}updateNamespace(t){this.namespace=Object.assign(this.namespace,t);}requestAccounts(){return this.getAccounts()}request(t){return this.namespace.methods.includes(t.request.method)?this.client.request(t):this.getHttpProvider().request(t.request)}setDefaultChain(t,e){this.httpProviders[t]||this.setHttpProvider(t,e),this.chainId=t,this.events.emit(u$2.DEFAULT_CHAIN_CHANGED,`${this.name}:${t}`);}getDefaultChain(){if(this.chainId)return this.chainId;if(this.namespace.defaultChain)return this.namespace.defaultChain;const t=this.namespace.chains[0];if(!t)throw new Error("ChainId not found");return t.split(":")[1]}getAccounts(){const t=this.namespace.accounts;return t?[...new Set(t.filter(e=>e.split(":")[1]===this.chainId.toString()).map(e=>e.split(":")[2]))]:[]}createHttpProviders(){const t={};return this.namespace.chains.forEach(e=>{var i;const n=b$2(e);t[n]=this.createHttpProvider(n,(i=this.namespace.rpcMap)==null?void 0:i[e]);}),t}getHttpProvider(){const t=`${this.name}:${this.chainId}`,e=this.httpProviders[t];if(typeof e>"u")throw new Error(`JSON-RPC provider for ${t} not found`);return e}setHttpProvider(t,e){const i=this.createHttpProvider(t,e);i&&(this.httpProviders[t]=i);}createHttpProvider(t,e){const i=e||d$2(t,this.namespace,this.client.core.projectId);if(!i)throw new Error(`No RPC url provided for chainId: ${t}`);return new o$4(new f$5(i,h$2("disableProviderPing")))}}var Le=Object.defineProperty,Me=(s,t,e)=>t in s?Le(s,t,{enumerable:true,configurable:true,writable:true,value:e}):s[t]=e,D=(s,t,e)=>Me(s,typeof t!="symbol"?t+"":t,e);class xe{constructor(t){D(this,"name","multiversx"),D(this,"client"),D(this,"httpProviders"),D(this,"events"),D(this,"namespace"),D(this,"chainId"),this.namespace=t.namespace,this.events=h$2("events"),this.client=h$2("client"),this.chainId=this.getDefaultChain(),this.httpProviders=this.createHttpProviders();}updateNamespace(t){this.namespace=Object.assign(this.namespace,t);}requestAccounts(){return this.getAccounts()}request(t){return this.namespace.methods.includes(t.request.method)?this.client.request(t):this.getHttpProvider().request(t.request)}setDefaultChain(t,e){this.httpProviders[t]||this.setHttpProvider(t,e),this.chainId=t,this.events.emit(u$2.DEFAULT_CHAIN_CHANGED,`${this.name}:${t}`);}getDefaultChain(){if(this.chainId)return this.chainId;if(this.namespace.defaultChain)return this.namespace.defaultChain;const t=this.namespace.chains[0];if(!t)throw new Error("ChainId not found");return t.split(":")[1]}getAccounts(){const t=this.namespace.accounts;return t?[...new Set(t.filter(e=>e.split(":")[1]===this.chainId.toString()).map(e=>e.split(":")[2]))]:[]}createHttpProviders(){const t={};return this.namespace.chains.forEach(e=>{var i;const n=b$2(e);t[n]=this.createHttpProvider(n,(i=this.namespace.rpcMap)==null?void 0:i[e]);}),t}getHttpProvider(){const t=`${this.name}:${this.chainId}`,e=this.httpProviders[t];if(typeof e>"u")throw new Error(`JSON-RPC provider for ${t} not found`);return e}setHttpProvider(t,e){const i=this.createHttpProvider(t,e);i&&(this.httpProviders[t]=i);}createHttpProvider(t,e){const i=e||d$2(t,this.namespace,this.client.core.projectId);if(!i)throw new Error(`No RPC url provided for chainId: ${t}`);return new o$4(new f$5(i,h$2("disableProviderPing")))}}var Be=Object.defineProperty,Ge=(s,t,e)=>t in s?Be(s,t,{enumerable:true,configurable:true,writable:true,value:e}):s[t]=e,q=(s,t,e)=>Ge(s,typeof t!="symbol"?t+"":t,e);class Je{constructor(t){q(this,"name","near"),q(this,"client"),q(this,"httpProviders"),q(this,"events"),q(this,"namespace"),q(this,"chainId"),this.namespace=t.namespace,this.events=h$2("events"),this.client=h$2("client"),this.chainId=this.getDefaultChain(),this.httpProviders=this.createHttpProviders();}updateNamespace(t){this.namespace=Object.assign(this.namespace,t);}requestAccounts(){return this.getAccounts()}getDefaultChain(){if(this.chainId)return this.chainId;if(this.namespace.defaultChain)return this.namespace.defaultChain;const t=this.namespace.chains[0];if(!t)throw new Error("ChainId not found");return t.split(":")[1]}request(t){return this.namespace.methods.includes(t.request.method)?this.client.request(t):this.getHttpProvider().request(t.request)}setDefaultChain(t,e){if(this.chainId=t,!this.httpProviders[t]){const i=e||d$2(`${this.name}:${t}`,this.namespace);if(!i)throw new Error(`No RPC url provided for chainId: ${t}`);this.setHttpProvider(t,i);}this.events.emit(u$2.DEFAULT_CHAIN_CHANGED,`${this.name}:${this.chainId}`);}getAccounts(){const t=this.namespace.accounts;return t?t.filter(e=>e.split(":")[1]===this.chainId.toString()).map(e=>e.split(":")[2])||[]:[]}createHttpProviders(){const t={};return this.namespace.chains.forEach(e=>{var i;t[e]=this.createHttpProvider(e,(i=this.namespace.rpcMap)==null?void 0:i[e]);}),t}getHttpProvider(){const t=`${this.name}:${this.chainId}`,e=this.httpProviders[t];if(typeof e>"u")throw new Error(`JSON-RPC provider for ${t} not found`);return e}setHttpProvider(t,e){const i=this.createHttpProvider(t,e);i&&(this.httpProviders[t]=i);}createHttpProvider(t,e){const i=e||d$2(t,this.namespace);return typeof i>"u"?void 0:new o$4(new f$5(i,h$2("disableProviderPing")))}}var ze=Object.defineProperty,ke=(s,t,e)=>t in s?ze(s,t,{enumerable:true,configurable:true,writable:true,value:e}):s[t]=e,j$1=(s,t,e)=>ke(s,typeof t!="symbol"?t+"":t,e);class We{constructor(t){j$1(this,"name","tezos"),j$1(this,"client"),j$1(this,"httpProviders"),j$1(this,"events"),j$1(this,"namespace"),j$1(this,"chainId"),this.namespace=t.namespace,this.events=h$2("events"),this.client=h$2("client"),this.chainId=this.getDefaultChain(),this.httpProviders=this.createHttpProviders();}updateNamespace(t){this.namespace=Object.assign(this.namespace,t);}requestAccounts(){return this.getAccounts()}getDefaultChain(){if(this.chainId)return this.chainId;if(this.namespace.defaultChain)return this.namespace.defaultChain;const t=this.namespace.chains[0];if(!t)throw new Error("ChainId not found");return t.split(":")[1]}request(t){return this.namespace.methods.includes(t.request.method)?this.client.request(t):this.getHttpProvider().request(t.request)}setDefaultChain(t,e){if(this.chainId=t,!this.httpProviders[t]){const i=e||d$2(`${this.name}:${t}`,this.namespace);if(!i)throw new Error(`No RPC url provided for chainId: ${t}`);this.setHttpProvider(t,i);}this.events.emit(u$2.DEFAULT_CHAIN_CHANGED,`${this.name}:${this.chainId}`);}getAccounts(){const t=this.namespace.accounts;return t?t.filter(e=>e.split(":")[1]===this.chainId.toString()).map(e=>e.split(":")[2])||[]:[]}createHttpProviders(){const t={};return this.namespace.chains.forEach(e=>{t[e]=this.createHttpProvider(e);}),t}getHttpProvider(){const t=`${this.name}:${this.chainId}`,e=this.httpProviders[t];if(typeof e>"u")throw new Error(`JSON-RPC provider for ${t} not found`);return e}setHttpProvider(t,e){const i=this.createHttpProvider(t,e);i&&(this.httpProviders[t]=i);}createHttpProvider(t,e){const i=e||d$2(t,this.namespace);return typeof i>"u"?void 0:new o$4(new f$5(i))}}var Ke=Object.defineProperty,Ve=(s,t,e)=>t in s?Ke(s,t,{enumerable:true,configurable:true,writable:true,value:e}):s[t]=e,R$1=(s,t,e)=>Ve(s,typeof t!="symbol"?t+"":t,e);class Xe{constructor(t){R$1(this,"name",I$1),R$1(this,"client"),R$1(this,"httpProviders"),R$1(this,"events"),R$1(this,"namespace"),R$1(this,"chainId"),this.namespace=t.namespace,this.events=h$2("events"),this.client=h$2("client"),this.chainId=this.getDefaultChain(),this.httpProviders=this.createHttpProviders();}updateNamespace(t){this.namespace.chains=[...new Set((this.namespace.chains||[]).concat(t.chains||[]))],this.namespace.accounts=[...new Set((this.namespace.accounts||[]).concat(t.accounts||[]))],this.namespace.methods=[...new Set((this.namespace.methods||[]).concat(t.methods||[]))],this.namespace.events=[...new Set((this.namespace.events||[]).concat(t.events||[]))],this.httpProviders=this.createHttpProviders();}requestAccounts(){return this.getAccounts()}request(t){return this.namespace.methods.includes(t.request.method)?this.client.request(t):this.getHttpProvider(t.chainId).request(t.request)}setDefaultChain(t,e){this.httpProviders[t]||this.setHttpProvider(t,e),this.chainId=t,this.events.emit(u$2.DEFAULT_CHAIN_CHANGED,`${this.name}:${t}`);}getDefaultChain(){if(this.chainId)return this.chainId;if(this.namespace.defaultChain)return this.namespace.defaultChain;const t=this.namespace.chains[0];if(!t)throw new Error("ChainId not found");return t.split(":")[1]}getAccounts(){const t=this.namespace.accounts;return t?[...new Set(t.filter(e=>e.split(":")[1]===this.chainId.toString()).map(e=>e.split(":")[2]))]:[]}createHttpProviders(){var t,e;const i={};return (e=(t=this.namespace)==null?void 0:t.accounts)==null||e.forEach(n=>{const a=Ne$1(n);i[`${a.namespace}:${a.reference}`]=this.createHttpProvider(n);}),i}getHttpProvider(t){const e=this.httpProviders[t];if(typeof e>"u")throw new Error(`JSON-RPC provider for ${t} not found`);return e}setHttpProvider(t,e){const i=this.createHttpProvider(t,e);i&&(this.httpProviders[t]=i);}createHttpProvider(t,e){const i=e||d$2(t,this.namespace,this.client.core.projectId);if(!i)throw new Error(`No RPC url provided for chainId: ${t}`);return new o$4(new f$5(i,h$2("disableProviderPing")))}}var Ye=Object.defineProperty,Qe=Object.defineProperties,Ze=Object.getOwnPropertyDescriptors,It=Object.getOwnPropertySymbols,Te=Object.prototype.hasOwnProperty,ts=Object.prototype.propertyIsEnumerable,Y=(s,t,e)=>t in s?Ye(s,t,{enumerable:true,configurable:true,writable:true,value:e}):s[t]=e,x$1=(s,t)=>{for(var e in t||(t={}))Te.call(t,e)&&Y(s,e,t[e]);if(It)for(var e of It(t))ts.call(t,e)&&Y(s,e,t[e]);return s},Q=(s,t)=>Qe(s,Ze(t)),l$2=(s,t,e)=>Y(s,typeof t!="symbol"?t+"":t,e);let B$1 = class B{constructor(t){l$2(this,"client"),l$2(this,"namespaces"),l$2(this,"optionalNamespaces"),l$2(this,"sessionProperties"),l$2(this,"scopedProperties"),l$2(this,"events",new require$$0),l$2(this,"rpcProviders",{}),l$2(this,"session"),l$2(this,"providerOpts"),l$2(this,"logger"),l$2(this,"uri"),l$2(this,"disableProviderPing",false),this.providerOpts=t,this.logger=typeof t?.logger<"u"&&typeof t?.logger!="string"?t.logger:Ot$2(k$4({level:t?.logger||et})),this.disableProviderPing=t?.disableProviderPing||false;}static async init(t){const e=new B(t);return await e.initialize(),e}async request(t,e,i){const[n,a]=this.validateChain(e);if(!this.session)throw new Error("Please call connect() before request()");return await this.getProvider(n).request({request:x$1({},t),chainId:`${n}:${a}`,topic:this.session.topic,expiry:i})}sendAsync(t,e,i,n){const a=new Date().getTime();this.request(t,i,n).then(r=>e(null,formatJsonRpcResult(a,r))).catch(r=>e(r,void 0));}async enable(){if(!this.client)throw new Error("Sign Client not initialized");return this.session||await this.connect({namespaces:this.namespaces,optionalNamespaces:this.optionalNamespaces,sessionProperties:this.sessionProperties,scopedProperties:this.scopedProperties}),await this.requestAccounts()}async disconnect(){var t;if(!this.session)throw new Error("Please call connect() before enable()");await this.client.disconnect({topic:(t=this.session)==null?void 0:t.topic,reason:Nt$1("USER_DISCONNECTED")}),await this.cleanup();}async connect(t){if(!this.client)throw new Error("Sign Client not initialized");if(this.setNamespaces(t),await this.cleanupPendingPairings(),!t.skipPairing)return await this.pair(t.pairingTopic)}async authenticate(t,e){if(!this.client)throw new Error("Sign Client not initialized");this.setNamespaces(t),await this.cleanupPendingPairings();const{uri:i,response:n}=await this.client.authenticate(t,e);i&&(this.uri=i,this.events.emit("display_uri",i));const a=await n();if(this.session=a.session,this.session){const r=gt(this.session.namespaces);this.namespaces=M$1(this.namespaces,r),await this.persist("namespaces",this.namespaces),this.onConnect();}return a}on(t,e){this.events.on(t,e);}once(t,e){this.events.once(t,e);}removeListener(t,e){this.events.removeListener(t,e);}off(t,e){this.events.off(t,e);}get isWalletConnect(){return  true}async pair(t){const{uri:e,approval:i}=await this.client.connect({pairingTopic:t,requiredNamespaces:this.namespaces,optionalNamespaces:this.optionalNamespaces,sessionProperties:this.sessionProperties,scopedProperties:this.scopedProperties});e&&(this.uri=e,this.events.emit("display_uri",e));const n=await i();this.session=n;const a=gt(n.namespaces);return this.namespaces=M$1(this.namespaces,a),await this.persist("namespaces",this.namespaces),await this.persist("optionalNamespaces",this.optionalNamespaces),this.onConnect(),this.session}setDefaultChain(t,e){try{if(!this.session)return;const[i,n]=this.validateChain(t),a=this.getProvider(i);a.name===I$1?a.setDefaultChain(`${i}:${n}`,e):a.setDefaultChain(n,e);}catch(i){if(!/Please call connect/.test(i.message))throw i}}async cleanupPendingPairings(t={}){this.logger.info("Cleaning up inactive pairings...");const e=this.client.pairing.getAll();if(se$2(e)){for(const i of e)t.deletePairings?this.client.core.expirer.set(i.topic,0):await this.client.core.relayer.subscriber.unsubscribe(i.topic);this.logger.info(`Inactive pairings cleared: ${e.length}`);}}abortPairingAttempt(){this.logger.warn("abortPairingAttempt is deprecated. This is now a no-op.");}async checkStorage(){this.namespaces=await this.getFromStore("namespaces")||{},this.optionalNamespaces=await this.getFromStore("optionalNamespaces")||{},this.session&&this.createProviders();}async initialize(){this.logger.trace("Initialized"),await this.createClient(),await this.checkStorage(),this.registerEventListeners();}async createClient(){var t,e;if(this.client=this.providerOpts.client||await Ee$1.init({core:this.providerOpts.core,logger:this.providerOpts.logger||et,relayUrl:this.providerOpts.relayUrl||St,projectId:this.providerOpts.projectId,metadata:this.providerOpts.metadata,storageOptions:this.providerOpts.storageOptions,storage:this.providerOpts.storage,name:this.providerOpts.name,customStoragePrefix:this.providerOpts.customStoragePrefix,telemetryEnabled:this.providerOpts.telemetryEnabled}),this.providerOpts.session)try{this.session=this.client.session.get(this.providerOpts.session.topic);}catch(i){throw this.logger.error("Failed to get session",i),new Error(`The provided session: ${(e=(t=this.providerOpts)==null?void 0:t.session)==null?void 0:e.topic} doesn't exist in the Sign client`)}else {const i=this.client.session.getAll();this.session=i[0];}this.logger.trace("SignClient Initialized");}createProviders(){if(!this.client)throw new Error("Sign Client not initialized");if(!this.session)throw new Error("Session not initialized. Please call connect() before enable()");const t=[...new Set(Object.keys(this.session.namespaces).map(e=>yo$1(e)))];V$1("client",this.client),V$1("events",this.events),V$1("disableProviderPing",this.disableProviderPing),t.forEach(e=>{if(!this.session)return;const i=le(e,this.session),n=ft(i),a=M$1(this.namespaces,this.optionalNamespaces),r=Q(x$1({},a[e]),{accounts:i,chains:n});switch(e){case "eip155":this.rpcProviders[e]=new Ie({namespace:r});break;case "algorand":this.rpcProviders[e]=new De({namespace:r});break;case "solana":this.rpcProviders[e]=new Ae({namespace:r});break;case "cosmos":this.rpcProviders[e]=new Ee({namespace:r});break;case "polkadot":this.rpcProviders[e]=new ve({namespace:r});break;case "cip34":this.rpcProviders[e]=new Re({namespace:r});break;case "elrond":this.rpcProviders[e]=new Fe({namespace:r});break;case "multiversx":this.rpcProviders[e]=new xe({namespace:r});break;case "near":this.rpcProviders[e]=new Je({namespace:r});break;case "tezos":this.rpcProviders[e]=new We({namespace:r});break;default:this.rpcProviders[I$1]?this.rpcProviders[I$1].updateNamespace(r):this.rpcProviders[I$1]=new Xe({namespace:r});}});}registerEventListeners(){if(typeof this.client>"u")throw new Error("Sign Client is not initialized");this.client.on("session_ping",t=>{var e;const{topic:i}=t;i===((e=this.session)==null?void 0:e.topic)&&this.events.emit("session_ping",t);}),this.client.on("session_event",t=>{var e;const{params:i,topic:n}=t;if(n!==((e=this.session)==null?void 0:e.topic))return;const{event:a}=i;if(a.name==="accountsChanged"){const r=a.data;r&&se$2(r)&&this.events.emit("accountsChanged",r.map(vt));}else if(a.name==="chainChanged"){const r=i.chainId,c=i.event.data,o=yo$1(r),m=K(r)!==K(c)?`${o}:${K(c)}`:r;this.onChainChanged(m);}else this.events.emit(a.name,a.data);this.events.emit("session_event",t);}),this.client.on("session_update",({topic:t,params:e})=>{var i,n;if(t!==((i=this.session)==null?void 0:i.topic))return;const{namespaces:a}=e,r=(n=this.client)==null?void 0:n.session.get(t);this.session=Q(x$1({},r),{namespaces:a}),this.onSessionUpdate(),this.events.emit("session_update",{topic:t,params:e});}),this.client.on("session_delete",async t=>{var e;t.topic===((e=this.session)==null?void 0:e.topic)&&(await this.cleanup(),this.events.emit("session_delete",t),this.events.emit("disconnect",Q(x$1({},Nt$1("USER_DISCONNECTED")),{data:t.topic})));}),this.on(u$2.DEFAULT_CHAIN_CHANGED,t=>{this.onChainChanged(t,true);});}getProvider(t){return this.rpcProviders[t]||this.rpcProviders[I$1]}onSessionUpdate(){Object.keys(this.rpcProviders).forEach(t=>{var e;this.getProvider(t).updateNamespace((e=this.session)==null?void 0:e.namespaces[t]);});}setNamespaces(t){const{namespaces:e={},optionalNamespaces:i={},sessionProperties:n,scopedProperties:a}=t;this.optionalNamespaces=M$1(e,i),this.sessionProperties=n,this.scopedProperties=a;}validateChain(t){const[e,i]=t?.split(":")||["",""];if(!this.namespaces||!Object.keys(this.namespaces).length)return [e,i];if(e&&!Object.keys(this.namespaces||{}).map(r=>yo$1(r)).includes(e))throw new Error(`Namespace '${e}' is not configured. Please call connect() first with namespace config.`);if(e&&i)return [e,i];const n=yo$1(Object.keys(this.namespaces)[0]),a=this.rpcProviders[n].getDefaultChain();return [n,a]}async requestAccounts(){const[t]=this.validateChain();return await this.getProvider(t).requestAccounts()}async onChainChanged(t,e=false){if(!this.namespaces)return;const[i,n]=this.validateChain(t);if(!n)return;this.updateNamespaceChain(i,n),this.events.emit("chainChanged",n);const a=this.getProvider(i).getDefaultChain();e||this.getProvider(i).setDefaultChain(n),this.emitAccountsChangedOnChainChange({namespace:i,previousChainId:a,newChainId:t}),await this.persist("namespaces",this.namespaces);}emitAccountsChangedOnChainChange({namespace:t,previousChainId:e,newChainId:i}){var n,a;try{if(e===i)return;const r=(a=(n=this.session)==null?void 0:n.namespaces[t])==null?void 0:a.accounts;if(!r)return;const c=r.filter(o=>o.includes(`${i}:`)).map(vt);if(!se$2(c))return;this.events.emit("accountsChanged",c);}catch(r){this.logger.warn("Failed to emit accountsChanged on chain change",r);}}updateNamespaceChain(t,e){if(!this.namespaces)return;const i=this.namespaces[t]?t:`${t}:${e}`,n={chains:[],methods:[],events:[],defaultChain:e};this.namespaces[i]?this.namespaces[i]&&(this.namespaces[i].defaultChain=e):this.namespaces[i]=n;}onConnect(){this.createProviders(),this.events.emit("connect",{session:this.session});}async cleanup(){this.namespaces=void 0,this.optionalNamespaces=void 0,this.sessionProperties=void 0,await this.deleteFromStore("namespaces"),await this.deleteFromStore("optionalNamespaces"),await this.deleteFromStore("sessionProperties"),this.session=void 0,await this.cleanupPendingPairings({deletePairings:true}),await this.cleanupStorage();}async persist(t,e){var i;const n=((i=this.session)==null?void 0:i.topic)||"";await this.client.core.storage.setItem(`${U}/${t}${n}`,e);}async getFromStore(t){var e;const i=((e=this.session)==null?void 0:e.topic)||"";return await this.client.core.storage.getItem(`${U}/${t}${i}`)}async deleteFromStore(t){var e;const i=((e=this.session)==null?void 0:e.topic)||"";await this.client.core.storage.removeItem(`${U}/${t}${i}`);}async cleanupStorage(){var t;try{if(((t=this.client)==null?void 0:t.session.length)>0)return;const e=await this.client.core.storage.getKeys();for(const i of e)i.startsWith(U)&&await this.client.core.storage.removeItem(i);}catch(e){this.logger.warn("Failed to cleanup storage",e);}}};

/**
 * Checks if the given namespace is associated with the specified connector id.
 * @param namespace - The namespace to check.
 * @param connectorId - The connector id to compare against.
 * @returns True if the namespace is associated with the connector id, false otherwise.
 */
function checkNamespaceConnectorId(namespace, connectorId) {
    return ConnectorController.getConnectorId(namespace) === connectorId;
}

/**
 * Returns the array of chains to disconnect from the connector with the given namespace.
 * If no namespace is provided, it returns all chains.
 * @param namespace - The namespace of the connector to disconnect from.
 * @returns An array of chains to disconnect.
 */
function getChainsToDisconnect(namespace) {
    const namespaces = Array.from(ChainController.state.chains.keys());
    let chains = [];
    if (namespace) {
        chains.push([namespace, ChainController.state.chains.get(namespace)]);
        if (checkNamespaceConnectorId(namespace, ConstantsUtil$3.CONNECTOR_ID.WALLET_CONNECT)) {
            namespaces.forEach(ns => {
                if (ns !== namespace &&
                    checkNamespaceConnectorId(ns, ConstantsUtil$3.CONNECTOR_ID.WALLET_CONNECT)) {
                    chains.push([ns, ChainController.state.chains.get(ns)]);
                }
            });
        }
        else if (checkNamespaceConnectorId(namespace, ConstantsUtil$3.CONNECTOR_ID.AUTH)) {
            namespaces.forEach(ns => {
                if (ns !== namespace &&
                    checkNamespaceConnectorId(ns, ConstantsUtil$3.CONNECTOR_ID.AUTH)) {
                    chains.push([ns, ChainController.state.chains.get(ns)]);
                }
            });
        }
    }
    else {
        chains = Array.from(ChainController.state.chains.entries());
    }
    return chains;
}

const ConstantsUtil$1 = {
    EIP155: 'eip155',
    CONNECTOR_TYPE_WALLET_CONNECT: 'WALLET_CONNECT',
    CONNECTOR_TYPE_INJECTED: 'INJECTED',
    CONNECTOR_TYPE_ANNOUNCED: 'ANNOUNCED'};

const PresetsUtil = {
    NetworkImageIds: {
        1: 'ba0ba0cd-17c6-4806-ad93-f9d174f17900',
        42161: '3bff954d-5cb0-47a0-9a23-d20192e74600',
        43114: '30c46e53-e989-45fb-4549-be3bd4eb3b00',
        56: '93564157-2e8e-4ce7-81df-b264dbee9b00',
        250: '06b26297-fe0c-4733-5d6b-ffa5498aac00',
        10: 'ab9c186a-c52f-464b-2906-ca59d760a400',
        137: '41d04d42-da3b-4453-8506-668cc0727900',
        5000: 'e86fae9b-b770-4eea-e520-150e12c81100',
        295: '6a97d510-cac8-4e58-c7ce-e8681b044c00',
        11_155_111: 'e909ea0a-f92a-4512-c8fc-748044ea6800',
        84532: 'a18a7ecd-e307-4360-4746-283182228e00',
        1301: '4eeea7ef-0014-4649-5d1d-07271a80f600',
        130: '2257980a-3463-48c6-cbac-a42d2a956e00',
        10_143: '0a728e83-bacb-46db-7844-948f05434900',
        100: '02b53f6a-e3d4-479e-1cb4-21178987d100',
        9001: 'f926ff41-260d-4028-635e-91913fc28e00',
        324: 'b310f07f-4ef7-49f3-7073-2a0a39685800',
        314: '5a73b3dd-af74-424e-cae0-0de859ee9400',
        4689: '34e68754-e536-40da-c153-6ef2e7188a00',
        1088: '3897a66d-40b9-4833-162f-a2c90531c900',
        1284: '161038da-44ae-4ec7-1208-0ea569454b00',
        1285: 'f1d73bb6-5450-4e18-38f7-fb6484264a00',
        7777777: '845c60df-d429-4991-e687-91ae45791600',
        42220: 'ab781bbc-ccc6-418d-d32d-789b15da1f00',
        8453: '7289c336-3981-4081-c5f4-efc26ac64a00',
        1313161554: '3ff73439-a619-4894-9262-4470c773a100',
        2020: 'b8101fc0-9c19-4b6f-ec65-f6dfff106e00',
        2021: 'b8101fc0-9c19-4b6f-ec65-f6dfff106e00',
        80094: 'e329c2c9-59b0-4a02-83e4-212ff3779900',
        2741: 'fc2427d1-5af9-4a9c-8da5-6f94627cd900',
        '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp': 'a1b58899-f671-4276-6a5e-56ca5bd59700',
        '4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z': 'a1b58899-f671-4276-6a5e-56ca5bd59700',
        EtWTRABZaYq6iMfeYKouRu166VU2xqa1: 'a1b58899-f671-4276-6a5e-56ca5bd59700',
        '000000000019d6689c085ae165831e93': '0b4838db-0161-4ffe-022d-532bf03dba00',
        '000000000933ea01ad0ee984209779ba': '39354064-d79b-420b-065d-f980c4b78200'
    },
    ConnectorImageIds: {
        [ConstantsUtil$3.CONNECTOR_ID.COINBASE]: '0c2840c3-5b04-4c44-9661-fbd4b49e1800',
        [ConstantsUtil$3.CONNECTOR_ID.COINBASE_SDK]: '0c2840c3-5b04-4c44-9661-fbd4b49e1800',
        [ConstantsUtil$3.CONNECTOR_ID.SAFE]: '461db637-8616-43ce-035a-d89b8a1d5800',
        [ConstantsUtil$3.CONNECTOR_ID.LEDGER]: '54a1aa77-d202-4f8d-0fb2-5d2bb6db0300',
        [ConstantsUtil$3.CONNECTOR_ID.WALLET_CONNECT]: 'ef1a1fcf-7fe8-4d69-bd6d-fda1345b4400',
        [ConstantsUtil$3.CONNECTOR_ID.INJECTED]: '07ba87ed-43aa-4adf-4540-9e6a2b9cae00'
    },
    ConnectorNamesMap: {
        [ConstantsUtil$3.CONNECTOR_ID.INJECTED]: 'Browser Wallet',
        [ConstantsUtil$3.CONNECTOR_ID.WALLET_CONNECT]: 'WalletConnect',
        [ConstantsUtil$3.CONNECTOR_ID.COINBASE]: 'Coinbase',
        [ConstantsUtil$3.CONNECTOR_ID.COINBASE_SDK]: 'Coinbase',
        [ConstantsUtil$3.CONNECTOR_ID.LEDGER]: 'Ledger',
        [ConstantsUtil$3.CONNECTOR_ID.SAFE]: 'Safe'
    }};

const HelpersUtil = {
    getCaipTokens(tokens) {
        if (!tokens) {
            return undefined;
        }
        const caipTokens = {};
        Object.entries(tokens).forEach(([id, token]) => {
            caipTokens[`${ConstantsUtil$1.EIP155}:${id}`] = token;
        });
        return caipTokens;
    },
    isLowerCaseMatch(str1, str2) {
        return str1?.toLowerCase() === str2?.toLowerCase();
    }
};

new AbortController();
const ErrorUtil = {
    UniversalProviderErrors: {
        UNAUTHORIZED_DOMAIN_NOT_ALLOWED: {
            message: 'Unauthorized: origin not allowed',
            alertErrorKey: 'INVALID_APP_CONFIGURATION'
        },
        JWT_VALIDATION_ERROR: {
            message: 'JWT validation error: JWT Token is not yet valid',
            alertErrorKey: 'JWT_TOKEN_NOT_VALID'
        },
        INVALID_KEY: {
            message: 'Unauthorized: invalid key',
            alertErrorKey: 'INVALID_PROJECT_ID'
        }
    },
    ALERT_ERRORS: {
        SWITCH_NETWORK_NOT_FOUND: {
            shortMessage: 'Network Not Found',
            longMessage: "Network not found - please make sure it is included in 'networks' array in createAppKit function"
        },
        INVALID_APP_CONFIGURATION: {
            shortMessage: 'Invalid App Configuration',
            longMessage: () => `Origin ${isSafe() ? window.origin : 'unknown'} not found on Allowlist - update configuration on cloud.reown.com`
        },
        IFRAME_LOAD_FAILED: {
            shortMessage: 'Network Error - Could not load embedded wallet',
            longMessage: () => 'There was an issue loading the embedded wallet. Please try again later.'
        },
        IFRAME_REQUEST_TIMEOUT: {
            shortMessage: 'Embedded Wallet Request Timed Out',
            longMessage: () => 'There was an issue doing the request to the embedded wallet. Please try again later.'
        },
        UNVERIFIED_DOMAIN: {
            shortMessage: 'Invalid App Configuration',
            longMessage: () => 'There was an issue loading the embedded wallet. Please verify that your domain is allowed at cloud.reown.com'
        },
        JWT_TOKEN_NOT_VALID: {
            shortMessage: 'Session Expired',
            longMessage: 'Invalid session found on UniversalProvider - please check your time settings and connect again'
        },
        INVALID_PROJECT_ID: {
            shortMessage: 'Invalid App Configuration',
            longMessage: 'Invalid Project ID - update configuration'
        },
        PROJECT_ID_NOT_CONFIGURED: {
            shortMessage: 'Project ID Not Configured',
            longMessage: 'Project ID Not Configured - update configuration on cloud.reown.com'
        }
    }
};
function isSafe() {
    return typeof window !== 'undefined';
}

const LoggerUtil = {
    createLogger(onError, level = 'error') {
        const loggerOptions = k$4({
            level
        });
        const { logger } = A$3({
            opts: loggerOptions
        });
        logger.error = (...args) => {
            for (const arg of args) {
                if (arg instanceof Error) {
                    onError(arg, ...args);
                    return;
                }
            }
            onError(undefined, ...args);
        };
        return logger;
    }
};

function isHex$1(value, { strict = true } = {}) {
    if (!value)
        return false;
    if (typeof value !== 'string')
        return false;
    return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith('0x');
}

/**
 * @description Retrieves the size of the value (in bytes).
 *
 * @param value The value (hex or byte array) to retrieve the size of.
 * @returns The size of the value (in bytes).
 */
function size$2(value) {
    if (isHex$1(value, { strict: false }))
        return Math.ceil((value.length - 2) / 2);
    return value.length;
}

const version$1 = '2.45.3';

let errorConfig$1 = {
    getDocsUrl: ({ docsBaseUrl, docsPath = '', docsSlug, }) => docsPath
        ? `${docsBaseUrl ?? 'https://viem.sh'}${docsPath}${docsSlug ? `#${docsSlug}` : ''}`
        : undefined,
    version: `viem@${version$1}`,
};
let BaseError$1 = class BaseError extends Error {
    constructor(shortMessage, args = {}) {
        const details = (() => {
            if (args.cause instanceof BaseError)
                return args.cause.details;
            if (args.cause?.message)
                return args.cause.message;
            return args.details;
        })();
        const docsPath = (() => {
            if (args.cause instanceof BaseError)
                return args.cause.docsPath || args.docsPath;
            return args.docsPath;
        })();
        const docsUrl = errorConfig$1.getDocsUrl?.({ ...args, docsPath });
        const message = [
            shortMessage || 'An error occurred.',
            '',
            ...(args.metaMessages ? [...args.metaMessages, ''] : []),
            ...(docsUrl ? [`Docs: ${docsUrl}`] : []),
            ...(details ? [`Details: ${details}`] : []),
            ...(errorConfig$1.version ? [`Version: ${errorConfig$1.version}`] : []),
        ].join('\n');
        super(message, args.cause ? { cause: args.cause } : undefined);
        Object.defineProperty(this, "details", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "docsPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "metaMessages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "version", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'BaseError'
        });
        this.details = details;
        this.docsPath = docsPath;
        this.metaMessages = args.metaMessages;
        this.name = args.name ?? this.name;
        this.shortMessage = shortMessage;
        this.version = version$1;
    }
    walk(fn) {
        return walk$1(this, fn);
    }
};
function walk$1(err, fn) {
    if (fn?.(err))
        return err;
    if (err &&
        typeof err === 'object' &&
        'cause' in err &&
        err.cause !== undefined)
        return walk$1(err.cause, fn);
    return fn ? null : err;
}

let SizeExceedsPaddingSizeError$1 = class SizeExceedsPaddingSizeError extends BaseError$1 {
    constructor({ size, targetSize, type, }) {
        super(`${type.charAt(0).toUpperCase()}${type
            .slice(1)
            .toLowerCase()} size (${size}) exceeds padding size (${targetSize}).`, { name: 'SizeExceedsPaddingSizeError' });
    }
};

function pad$1(hexOrBytes, { dir, size = 32 } = {}) {
    if (typeof hexOrBytes === 'string')
        return padHex$1(hexOrBytes, { dir, size });
    return padBytes$1(hexOrBytes, { dir, size });
}
function padHex$1(hex_, { dir, size = 32 } = {}) {
    if (size === null)
        return hex_;
    const hex = hex_.replace('0x', '');
    if (hex.length > size * 2)
        throw new SizeExceedsPaddingSizeError$1({
            size: Math.ceil(hex.length / 2),
            targetSize: size,
            type: 'hex',
        });
    return `0x${hex[dir === 'right' ? 'padEnd' : 'padStart'](size * 2, '0')}`;
}
function padBytes$1(bytes, { dir, size = 32 } = {}) {
    if (size === null)
        return bytes;
    if (bytes.length > size)
        throw new SizeExceedsPaddingSizeError$1({
            size: bytes.length,
            targetSize: size,
            type: 'bytes',
        });
    const paddedBytes = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
        const padEnd = dir === 'right';
        paddedBytes[padEnd ? i : size - i - 1] =
            bytes[padEnd ? i : bytes.length - i - 1];
    }
    return paddedBytes;
}

let SizeOverflowError$1 = class SizeOverflowError extends BaseError$1 {
    constructor({ givenSize, maxSize }) {
        super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, { name: 'SizeOverflowError' });
    }
};

function assertSize$1(hexOrBytes, { size }) {
    if (size$2(hexOrBytes) > size)
        throw new SizeOverflowError$1({
            givenSize: size$2(hexOrBytes),
            maxSize: size,
        });
}

const hexes$1 = /*#__PURE__*/ Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, '0'));
/**
 * Encodes a bytes array into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#bytestohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { bytesToHex } from 'viem'
 * const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
 * // '0x48656c6c6f20576f726c6421'
 *
 * @example
 * import { bytesToHex } from 'viem'
 * const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]), { size: 32 })
 * // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
 */
function bytesToHex$1(value, opts = {}) {
    let string = '';
    for (let i = 0; i < value.length; i++) {
        string += hexes$1[value[i]];
    }
    const hex = `0x${string}`;
    if (typeof opts.size === 'number') {
        assertSize$1(hex, { size: opts.size });
        return pad$1(hex, { dir: 'right', size: opts.size });
    }
    return hex;
}
const encoder$1 = /*#__PURE__*/ new TextEncoder();
/**
 * Encodes a UTF-8 string into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#stringtohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { stringToHex } from 'viem'
 * const data = stringToHex('Hello World!')
 * // '0x48656c6c6f20576f726c6421'
 *
 * @example
 * import { stringToHex } from 'viem'
 * const data = stringToHex('Hello World!', { size: 32 })
 * // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
 */
function stringToHex$1(value_, opts = {}) {
    const value = encoder$1.encode(value_);
    return bytesToHex$1(value, opts);
}

/**
 * Map with a LRU (Least recently used) policy.
 *
 * @link https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU
 */
class LruMap extends Map {
    constructor(size) {
        super();
        Object.defineProperty(this, "maxSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.maxSize = size;
    }
    get(key) {
        const value = super.get(key);
        if (super.has(key) && value !== undefined) {
            this.delete(key);
            super.set(key, value);
        }
        return value;
    }
    set(key, value) {
        super.set(key, value);
        if (this.maxSize && this.size > this.maxSize) {
            const firstKey = this.keys().next().value;
            if (firstKey)
                this.delete(firstKey);
        }
        return this;
    }
}

const stringify = (value, replacer, space) => JSON.stringify(value, (key, value_) => {
    const value = typeof value_ === 'bigint' ? value_.toString() : value_;
    return value;
}, space);

const getUrl = (url) => url;

class HttpRequestError extends BaseError$1 {
    constructor({ body, cause, details, headers, status, url, }) {
        super('HTTP request failed.', {
            cause,
            details,
            metaMessages: [
                status && `Status: ${status}`,
                `URL: ${getUrl(url)}`,
                body && `Request body: ${stringify(body)}`,
            ].filter(Boolean),
            name: 'HttpRequestError',
        });
        Object.defineProperty(this, "body", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "headers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.body = body;
        this.headers = headers;
        this.status = status;
        this.url = url;
    }
}
class RpcRequestError extends BaseError$1 {
    constructor({ body, error, url, }) {
        super('RPC Request failed.', {
            cause: error,
            details: error.message,
            metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
            name: 'RpcRequestError',
        });
        Object.defineProperty(this, "code", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.code = error.code;
        this.data = error.data;
        this.url = url;
    }
}
class TimeoutError extends BaseError$1 {
    constructor({ body, url, }) {
        super('The request took too long to respond.', {
            details: 'The request timed out.',
            metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
            name: 'TimeoutError',
        });
        Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.url = url;
    }
}

const unknownErrorCode = -1;
class RpcError extends BaseError$1 {
    constructor(cause, { code, docsPath, metaMessages, name, shortMessage, }) {
        super(shortMessage, {
            cause,
            docsPath,
            metaMessages: metaMessages || cause?.metaMessages,
            name: name || 'RpcError',
        });
        Object.defineProperty(this, "code", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = name || cause.name;
        this.code = (cause instanceof RpcRequestError ? cause.code : (code ?? unknownErrorCode));
    }
}
class ProviderRpcError extends RpcError {
    constructor(cause, options) {
        super(cause, options);
        Object.defineProperty(this, "data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.data = options.data;
    }
}
class ParseRpcError extends RpcError {
    constructor(cause) {
        super(cause, {
            code: ParseRpcError.code,
            name: 'ParseRpcError',
            shortMessage: 'Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.',
        });
    }
}
Object.defineProperty(ParseRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32700
});
class InvalidRequestRpcError extends RpcError {
    constructor(cause) {
        super(cause, {
            code: InvalidRequestRpcError.code,
            name: 'InvalidRequestRpcError',
            shortMessage: 'JSON is not a valid request object.',
        });
    }
}
Object.defineProperty(InvalidRequestRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32600
});
class MethodNotFoundRpcError extends RpcError {
    constructor(cause, { method } = {}) {
        super(cause, {
            code: MethodNotFoundRpcError.code,
            name: 'MethodNotFoundRpcError',
            shortMessage: `The method${method ? ` "${method}"` : ''} does not exist / is not available.`,
        });
    }
}
Object.defineProperty(MethodNotFoundRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32601
});
class InvalidParamsRpcError extends RpcError {
    constructor(cause) {
        super(cause, {
            code: InvalidParamsRpcError.code,
            name: 'InvalidParamsRpcError',
            shortMessage: [
                'Invalid parameters were provided to the RPC method.',
                'Double check you have provided the correct parameters.',
            ].join('\n'),
        });
    }
}
Object.defineProperty(InvalidParamsRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32602
});
class InternalRpcError extends RpcError {
    constructor(cause) {
        super(cause, {
            code: InternalRpcError.code,
            name: 'InternalRpcError',
            shortMessage: 'An internal error was received.',
        });
    }
}
Object.defineProperty(InternalRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32603
});
class InvalidInputRpcError extends RpcError {
    constructor(cause) {
        super(cause, {
            code: InvalidInputRpcError.code,
            name: 'InvalidInputRpcError',
            shortMessage: [
                'Missing or invalid parameters.',
                'Double check you have provided the correct parameters.',
            ].join('\n'),
        });
    }
}
Object.defineProperty(InvalidInputRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32e3
});
class ResourceNotFoundRpcError extends RpcError {
    constructor(cause) {
        super(cause, {
            code: ResourceNotFoundRpcError.code,
            name: 'ResourceNotFoundRpcError',
            shortMessage: 'Requested resource not found.',
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'ResourceNotFoundRpcError'
        });
    }
}
Object.defineProperty(ResourceNotFoundRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32001
});
class ResourceUnavailableRpcError extends RpcError {
    constructor(cause) {
        super(cause, {
            code: ResourceUnavailableRpcError.code,
            name: 'ResourceUnavailableRpcError',
            shortMessage: 'Requested resource not available.',
        });
    }
}
Object.defineProperty(ResourceUnavailableRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32002
});
class TransactionRejectedRpcError extends RpcError {
    constructor(cause) {
        super(cause, {
            code: TransactionRejectedRpcError.code,
            name: 'TransactionRejectedRpcError',
            shortMessage: 'Transaction creation failed.',
        });
    }
}
Object.defineProperty(TransactionRejectedRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32003
});
class MethodNotSupportedRpcError extends RpcError {
    constructor(cause, { method } = {}) {
        super(cause, {
            code: MethodNotSupportedRpcError.code,
            name: 'MethodNotSupportedRpcError',
            shortMessage: `Method${method ? ` "${method}"` : ''} is not supported.`,
        });
    }
}
Object.defineProperty(MethodNotSupportedRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32004
});
class LimitExceededRpcError extends RpcError {
    constructor(cause) {
        super(cause, {
            code: LimitExceededRpcError.code,
            name: 'LimitExceededRpcError',
            shortMessage: 'Request exceeds defined limit.',
        });
    }
}
Object.defineProperty(LimitExceededRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32005
});
class JsonRpcVersionUnsupportedError extends RpcError {
    constructor(cause) {
        super(cause, {
            code: JsonRpcVersionUnsupportedError.code,
            name: 'JsonRpcVersionUnsupportedError',
            shortMessage: 'Version of JSON-RPC protocol is not supported.',
        });
    }
}
Object.defineProperty(JsonRpcVersionUnsupportedError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32006
});
class UserRejectedRequestError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: UserRejectedRequestError.code,
            name: 'UserRejectedRequestError',
            shortMessage: 'User rejected the request.',
        });
    }
}
Object.defineProperty(UserRejectedRequestError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 4001
});
class UnauthorizedProviderError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: UnauthorizedProviderError.code,
            name: 'UnauthorizedProviderError',
            shortMessage: 'The requested method and/or account has not been authorized by the user.',
        });
    }
}
Object.defineProperty(UnauthorizedProviderError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 4100
});
class UnsupportedProviderMethodError extends ProviderRpcError {
    constructor(cause, { method } = {}) {
        super(cause, {
            code: UnsupportedProviderMethodError.code,
            name: 'UnsupportedProviderMethodError',
            shortMessage: `The Provider does not support the requested method${method ? ` " ${method}"` : ''}.`,
        });
    }
}
Object.defineProperty(UnsupportedProviderMethodError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 4200
});
class ProviderDisconnectedError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: ProviderDisconnectedError.code,
            name: 'ProviderDisconnectedError',
            shortMessage: 'The Provider is disconnected from all chains.',
        });
    }
}
Object.defineProperty(ProviderDisconnectedError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 4900
});
class ChainDisconnectedError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: ChainDisconnectedError.code,
            name: 'ChainDisconnectedError',
            shortMessage: 'The Provider is not connected to the requested chain.',
        });
    }
}
Object.defineProperty(ChainDisconnectedError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 4901
});
class SwitchChainError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: SwitchChainError.code,
            name: 'SwitchChainError',
            shortMessage: 'An error occurred when attempting to switch chain.',
        });
    }
}
Object.defineProperty(SwitchChainError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 4902
});
class UnsupportedNonOptionalCapabilityError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: UnsupportedNonOptionalCapabilityError.code,
            name: 'UnsupportedNonOptionalCapabilityError',
            shortMessage: 'This Wallet does not support a capability that was not marked as optional.',
        });
    }
}
Object.defineProperty(UnsupportedNonOptionalCapabilityError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 5700
});
class UnsupportedChainIdError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: UnsupportedChainIdError.code,
            name: 'UnsupportedChainIdError',
            shortMessage: 'This Wallet does not support the requested chain ID.',
        });
    }
}
Object.defineProperty(UnsupportedChainIdError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 5710
});
class DuplicateIdError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: DuplicateIdError.code,
            name: 'DuplicateIdError',
            shortMessage: 'There is already a bundle submitted with this ID.',
        });
    }
}
Object.defineProperty(DuplicateIdError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 5720
});
class UnknownBundleIdError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: UnknownBundleIdError.code,
            name: 'UnknownBundleIdError',
            shortMessage: 'This bundle id is unknown / has not been submitted',
        });
    }
}
Object.defineProperty(UnknownBundleIdError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 5730
});
class BundleTooLargeError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: BundleTooLargeError.code,
            name: 'BundleTooLargeError',
            shortMessage: 'The call bundle is too large for the Wallet to process.',
        });
    }
}
Object.defineProperty(BundleTooLargeError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 5740
});
class AtomicReadyWalletRejectedUpgradeError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: AtomicReadyWalletRejectedUpgradeError.code,
            name: 'AtomicReadyWalletRejectedUpgradeError',
            shortMessage: 'The Wallet can support atomicity after an upgrade, but the user rejected the upgrade.',
        });
    }
}
Object.defineProperty(AtomicReadyWalletRejectedUpgradeError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 5750
});
class AtomicityNotSupportedError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: AtomicityNotSupportedError.code,
            name: 'AtomicityNotSupportedError',
            shortMessage: 'The wallet does not support atomic execution but the request requires it.',
        });
    }
}
Object.defineProperty(AtomicityNotSupportedError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 5760
});
class WalletConnectSessionSettlementError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: WalletConnectSessionSettlementError.code,
            name: 'WalletConnectSessionSettlementError',
            shortMessage: 'WalletConnect session settlement failed.',
        });
    }
}
Object.defineProperty(WalletConnectSessionSettlementError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 7000
});
class UnknownRpcError extends RpcError {
    constructor(cause) {
        super(cause, {
            name: 'UnknownRpcError',
            shortMessage: 'An unknown RPC error occurred.',
        });
    }
}

class ExecutionRevertedError extends BaseError$1 {
    constructor({ cause, message, } = {}) {
        const reason = message
            ?.replace('execution reverted: ', '')
            ?.replace('execution reverted', '');
        super(`Execution reverted ${reason ? `with reason: ${reason}` : 'for an unknown reason'}.`, {
            cause,
            name: 'ExecutionRevertedError',
        });
    }
}
Object.defineProperty(ExecutionRevertedError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 3
});
Object.defineProperty(ExecutionRevertedError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /execution reverted|gas required exceeds allowance/
});

/** @internal */
function withResolvers() {
    let resolve = () => undefined;
    let reject = () => undefined;
    const promise = new Promise((resolve_, reject_) => {
        resolve = resolve_;
        reject = reject_;
    });
    return { promise, resolve, reject };
}

const schedulerCache = /*#__PURE__*/ new Map();
/** @internal */
function createBatchScheduler({ fn, id, shouldSplitBatch, wait = 0, sort, }) {
    const exec = async () => {
        const scheduler = getScheduler();
        flush();
        const args = scheduler.map(({ args }) => args);
        if (args.length === 0)
            return;
        fn(args)
            .then((data) => {
            if (sort && Array.isArray(data))
                data.sort(sort);
            for (let i = 0; i < scheduler.length; i++) {
                const { resolve } = scheduler[i];
                resolve?.([data[i], data]);
            }
        })
            .catch((err) => {
            for (let i = 0; i < scheduler.length; i++) {
                const { reject } = scheduler[i];
                reject?.(err);
            }
        });
    };
    const flush = () => schedulerCache.delete(id);
    const getBatchedArgs = () => getScheduler().map(({ args }) => args);
    const getScheduler = () => schedulerCache.get(id) || [];
    const setScheduler = (item) => schedulerCache.set(id, [...getScheduler(), item]);
    return {
        flush,
        async schedule(args) {
            const { promise, resolve, reject } = withResolvers();
            const split = shouldSplitBatch?.([...getBatchedArgs(), args]);
            if (split)
                exec();
            const hasActiveScheduler = getScheduler().length > 0;
            if (hasActiveScheduler) {
                setScheduler({ args, resolve, reject });
                return promise;
            }
            setScheduler({ args, resolve, reject });
            setTimeout(exec, wait);
            return promise;
        },
    };
}

async function wait(time) {
    return new Promise((res) => setTimeout(res, time));
}

function withRetry(fn, { delay: delay_ = 100, retryCount = 2, shouldRetry = () => true, } = {}) {
    return new Promise((resolve, reject) => {
        const attemptRetry = async ({ count = 0 } = {}) => {
            const retry = async ({ error }) => {
                const delay = typeof delay_ === 'function' ? delay_({ count, error }) : delay_;
                if (delay)
                    await wait(delay);
                attemptRetry({ count: count + 1 });
            };
            try {
                const data = await fn();
                resolve(data);
            }
            catch (err) {
                if (count < retryCount &&
                    (await shouldRetry({ count, error: err })))
                    return retry({ error: err });
                reject(err);
            }
        };
        attemptRetry();
    });
}

const size$1 = 256;
let index = size$1;
let buffer;
function uid(length = 11) {
    if (!buffer || index + length > size$1 * 2) {
        buffer = '';
        index = 0;
        for (let i = 0; i < size$1; i++) {
            buffer += ((256 + Math.random() * 256) | 0).toString(16).substring(1);
        }
    }
    return buffer.substring(index, index++ + length);
}

/** @internal */
const promiseCache = /*#__PURE__*/ new LruMap(8192);
/** Deduplicates in-flight promises. */
function withDedupe(fn, { enabled = true, id }) {
    if (!enabled || !id)
        return fn();
    if (promiseCache.get(id))
        return promiseCache.get(id);
    const promise = fn().finally(() => promiseCache.delete(id));
    promiseCache.set(id, promise);
    return promise;
}

function buildRequest(request, options = {}) {
    return async (args, overrideOptions = {}) => {
        const { dedupe = false, methods, retryDelay = 150, retryCount = 3, uid, } = {
            ...options,
            ...overrideOptions,
        };
        const { method } = args;
        if (methods?.exclude?.includes(method))
            throw new MethodNotSupportedRpcError(new Error('method not supported'), {
                method,
            });
        if (methods?.include && !methods.include.includes(method))
            throw new MethodNotSupportedRpcError(new Error('method not supported'), {
                method,
            });
        const requestId = dedupe
            ? stringToHex$1(`${uid}.${stringify(args)}`)
            : undefined;
        return withDedupe(() => withRetry(async () => {
            try {
                return await request(args);
            }
            catch (err_) {
                const err = err_;
                switch (err.code) {
                    // -32700
                    case ParseRpcError.code:
                        throw new ParseRpcError(err);
                    // -32600
                    case InvalidRequestRpcError.code:
                        throw new InvalidRequestRpcError(err);
                    // -32601
                    case MethodNotFoundRpcError.code:
                        throw new MethodNotFoundRpcError(err, { method: args.method });
                    // -32602
                    case InvalidParamsRpcError.code:
                        throw new InvalidParamsRpcError(err);
                    // -32603
                    case InternalRpcError.code:
                        throw new InternalRpcError(err);
                    // -32000
                    case InvalidInputRpcError.code:
                        throw new InvalidInputRpcError(err);
                    // -32001
                    case ResourceNotFoundRpcError.code:
                        throw new ResourceNotFoundRpcError(err);
                    // -32002
                    case ResourceUnavailableRpcError.code:
                        throw new ResourceUnavailableRpcError(err);
                    // -32003
                    case TransactionRejectedRpcError.code:
                        throw new TransactionRejectedRpcError(err);
                    // -32004
                    case MethodNotSupportedRpcError.code:
                        throw new MethodNotSupportedRpcError(err, {
                            method: args.method,
                        });
                    // -32005
                    case LimitExceededRpcError.code:
                        throw new LimitExceededRpcError(err);
                    // -32006
                    case JsonRpcVersionUnsupportedError.code:
                        throw new JsonRpcVersionUnsupportedError(err);
                    // 4001
                    case UserRejectedRequestError.code:
                        throw new UserRejectedRequestError(err);
                    // 4100
                    case UnauthorizedProviderError.code:
                        throw new UnauthorizedProviderError(err);
                    // 4200
                    case UnsupportedProviderMethodError.code:
                        throw new UnsupportedProviderMethodError(err);
                    // 4900
                    case ProviderDisconnectedError.code:
                        throw new ProviderDisconnectedError(err);
                    // 4901
                    case ChainDisconnectedError.code:
                        throw new ChainDisconnectedError(err);
                    // 4902
                    case SwitchChainError.code:
                        throw new SwitchChainError(err);
                    // 5700
                    case UnsupportedNonOptionalCapabilityError.code:
                        throw new UnsupportedNonOptionalCapabilityError(err);
                    // 5710
                    case UnsupportedChainIdError.code:
                        throw new UnsupportedChainIdError(err);
                    // 5720
                    case DuplicateIdError.code:
                        throw new DuplicateIdError(err);
                    // 5730
                    case UnknownBundleIdError.code:
                        throw new UnknownBundleIdError(err);
                    // 5740
                    case BundleTooLargeError.code:
                        throw new BundleTooLargeError(err);
                    // 5750
                    case AtomicReadyWalletRejectedUpgradeError.code:
                        throw new AtomicReadyWalletRejectedUpgradeError(err);
                    // 5760
                    case AtomicityNotSupportedError.code:
                        throw new AtomicityNotSupportedError(err);
                    // CAIP-25: User Rejected Error
                    // https://docs.walletconnect.com/2.0/specs/clients/sign/error-codes#rejected-caip-25
                    case 5000:
                        throw new UserRejectedRequestError(err);
                    // WalletConnect: Session Settlement Failed
                    // https://docs.walletconnect.com/2.0/specs/clients/sign/error-codes
                    case WalletConnectSessionSettlementError.code:
                        throw new WalletConnectSessionSettlementError(err);
                    default:
                        if (err_ instanceof BaseError$1)
                            throw err_;
                        throw new UnknownRpcError(err);
                }
            }
        }, {
            delay: ({ count, error }) => {
                // If we find a Retry-After header, let's retry after the given time.
                if (error && error instanceof HttpRequestError) {
                    const retryAfter = error?.headers?.get('Retry-After');
                    if (retryAfter?.match(/\d/))
                        return Number.parseInt(retryAfter, 10) * 1000;
                }
                // Otherwise, let's retry with an exponential backoff.
                return ~~(1 << count) * retryDelay;
            },
            retryCount,
            shouldRetry: ({ error }) => shouldRetry(error),
        }), { enabled: dedupe, id: requestId });
    };
}
/** @internal */
function shouldRetry(error) {
    if ('code' in error && typeof error.code === 'number') {
        if (error.code === -1)
            return true; // Unknown error
        if (error.code === LimitExceededRpcError.code)
            return true;
        if (error.code === InternalRpcError.code)
            return true;
        return false;
    }
    if (error instanceof HttpRequestError && error.status) {
        // Forbidden
        if (error.status === 403)
            return true;
        // Request Timeout
        if (error.status === 408)
            return true;
        // Request Entity Too Large
        if (error.status === 413)
            return true;
        // Too Many Requests
        if (error.status === 429)
            return true;
        // Internal Server Error
        if (error.status === 500)
            return true;
        // Bad Gateway
        if (error.status === 502)
            return true;
        // Service Unavailable
        if (error.status === 503)
            return true;
        // Gateway Timeout
        if (error.status === 504)
            return true;
        return false;
    }
    return true;
}

function withTimeout(fn, { errorInstance = new Error('timed out'), timeout, signal, }) {
    return new Promise((resolve, reject) => {
        (async () => {
            let timeoutId;
            try {
                const controller = new AbortController();
                if (timeout > 0) {
                    timeoutId = setTimeout(() => {
                        if (signal) {
                            controller.abort();
                        }
                    }, timeout); // need to cast because bun globals.d.ts overrides @types/node
                }
                resolve(await fn({ signal: controller?.signal || null }));
            }
            catch (err) {
                if (err?.name === 'AbortError')
                    reject(errorInstance);
                reject(err);
            }
            finally {
                clearTimeout(timeoutId);
            }
        })();
    });
}

function createIdStore() {
    return {
        current: 0,
        take() {
            return this.current++;
        },
        reset() {
            this.current = 0;
        },
    };
}
const idCache = /*#__PURE__*/ createIdStore();

function getHttpRpcClient(url_, options = {}) {
    const { url, headers: headers_url } = parseUrl(url_);
    return {
        async request(params) {
            const { body, fetchFn = options.fetchFn ?? fetch, onRequest = options.onRequest, onResponse = options.onResponse, timeout = options.timeout ?? 10_000, } = params;
            const fetchOptions = {
                ...(options.fetchOptions ?? {}),
                ...(params.fetchOptions ?? {}),
            };
            const { headers, method, signal: signal_ } = fetchOptions;
            try {
                const response = await withTimeout(async ({ signal }) => {
                    const init = {
                        ...fetchOptions,
                        body: Array.isArray(body)
                            ? stringify(body.map((body) => ({
                                jsonrpc: '2.0',
                                id: body.id ?? idCache.take(),
                                ...body,
                            })))
                            : stringify({
                                jsonrpc: '2.0',
                                id: body.id ?? idCache.take(),
                                ...body,
                            }),
                        headers: {
                            ...headers_url,
                            'Content-Type': 'application/json',
                            ...headers,
                        },
                        method: method || 'POST',
                        signal: signal_ || (timeout > 0 ? signal : null),
                    };
                    const request = new Request(url, init);
                    const args = (await onRequest?.(request, init)) ?? { ...init, url };
                    const response = await fetchFn(args.url ?? url, args);
                    return response;
                }, {
                    errorInstance: new TimeoutError({ body, url }),
                    timeout,
                    signal: true,
                });
                if (onResponse)
                    await onResponse(response);
                let data;
                if (response.headers.get('Content-Type')?.startsWith('application/json'))
                    data = await response.json();
                else {
                    data = await response.text();
                    try {
                        data = JSON.parse(data || '{}');
                    }
                    catch (err) {
                        if (response.ok)
                            throw err;
                        data = { error: data };
                    }
                }
                if (!response.ok) {
                    throw new HttpRequestError({
                        body,
                        details: stringify(data.error) || response.statusText,
                        headers: response.headers,
                        status: response.status,
                        url,
                    });
                }
                return data;
            }
            catch (err) {
                if (err instanceof HttpRequestError)
                    throw err;
                if (err instanceof TimeoutError)
                    throw err;
                throw new HttpRequestError({
                    body,
                    cause: err,
                    url,
                });
            }
        },
    };
}
/** @internal */
function parseUrl(url_) {
    try {
        const url = new URL(url_);
        const result = (() => {
            // Handle Basic authentication credentials
            if (url.username) {
                const credentials = `${decodeURIComponent(url.username)}:${decodeURIComponent(url.password)}`;
                url.username = '';
                url.password = '';
                return {
                    url: url.toString(),
                    headers: { Authorization: `Basic ${btoa(credentials)}` },
                };
            }
            return;
        })();
        return { url: url.toString(), ...result };
    }
    catch {
        return { url: url_ };
    }
}

/**
 * @description Creates an transport intended to be used with a client.
 */
function createTransport({ key, methods, name, request, retryCount = 3, retryDelay = 150, timeout, type, }, value) {
    const uid$1 = uid();
    return {
        config: {
            key,
            methods,
            name,
            request,
            retryCount,
            retryDelay,
            timeout,
            type,
        },
        request: buildRequest(request, { methods, retryCount, retryDelay, uid: uid$1 }),
        value,
    };
}

function fallback(transports_, config = {}) {
    const { key = 'fallback', name = 'Fallback', rank = false, shouldThrow: shouldThrow_ = shouldThrow, retryCount, retryDelay, } = config;
    return (({ chain, pollingInterval = 4_000, timeout, ...rest }) => {
        let transports = transports_;
        let onResponse = () => { };
        const transport = createTransport({
            key,
            name,
            async request({ method, params }) {
                let includes;
                const fetch = async (i = 0) => {
                    const transport = transports[i]({
                        ...rest,
                        chain,
                        retryCount: 0,
                        timeout,
                    });
                    try {
                        const response = await transport.request({
                            method,
                            params,
                        });
                        onResponse({
                            method,
                            params: params,
                            response,
                            transport,
                            status: 'success',
                        });
                        return response;
                    }
                    catch (err) {
                        onResponse({
                            error: err,
                            method,
                            params: params,
                            transport,
                            status: 'error',
                        });
                        if (shouldThrow_(err))
                            throw err;
                        // If we've reached the end of the fallbacks, throw the error.
                        if (i === transports.length - 1)
                            throw err;
                        // Check if at least one other transport includes the method
                        includes ??= transports.slice(i + 1).some((transport) => {
                            const { include, exclude } = transport({ chain }).config.methods || {};
                            if (include)
                                return include.includes(method);
                            if (exclude)
                                return !exclude.includes(method);
                            return true;
                        });
                        if (!includes)
                            throw err;
                        // Otherwise, try the next fallback.
                        return fetch(i + 1);
                    }
                };
                return fetch();
            },
            retryCount,
            retryDelay,
            type: 'fallback',
        }, {
            onResponse: (fn) => (onResponse = fn),
            transports: transports.map((fn) => fn({ chain, retryCount: 0 })),
        });
        if (rank) {
            const rankOptions = (typeof rank === 'object' ? rank : {});
            rankTransports({
                chain,
                interval: rankOptions.interval ?? pollingInterval,
                onTransports: (transports_) => (transports = transports_),
                ping: rankOptions.ping,
                sampleCount: rankOptions.sampleCount,
                timeout: rankOptions.timeout,
                transports,
                weights: rankOptions.weights,
            });
        }
        return transport;
    });
}
function shouldThrow(error) {
    if ('code' in error && typeof error.code === 'number') {
        if (error.code === TransactionRejectedRpcError.code ||
            error.code === UserRejectedRequestError.code ||
            error.code === WalletConnectSessionSettlementError.code ||
            ExecutionRevertedError.nodeMessage.test(error.message) ||
            error.code === 5000 // CAIP UserRejectedRequestError
        )
            return true;
    }
    return false;
}
/** @internal */
function rankTransports({ chain, interval = 4_000, onTransports, ping, sampleCount = 10, timeout = 1_000, transports, weights = {}, }) {
    const { stability: stabilityWeight = 0.7, latency: latencyWeight = 0.3 } = weights;
    const samples = [];
    const rankTransports_ = async () => {
        // 1. Take a sample from each Transport.
        const sample = await Promise.all(transports.map(async (transport) => {
            const transport_ = transport({ chain, retryCount: 0, timeout });
            const start = Date.now();
            let end;
            let success;
            try {
                await (ping
                    ? ping({ transport: transport_ })
                    : transport_.request({ method: 'net_listening' }));
                success = 1;
            }
            catch {
                success = 0;
            }
            finally {
                end = Date.now();
            }
            const latency = end - start;
            return { latency, success };
        }));
        // 2. Store the sample. If we have more than `sampleCount` samples, remove
        // the oldest sample.
        samples.push(sample);
        if (samples.length > sampleCount)
            samples.shift();
        // 3. Calculate the max latency from samples.
        const maxLatency = Math.max(...samples.map((sample) => Math.max(...sample.map(({ latency }) => latency))));
        // 4. Calculate the score for each Transport.
        const scores = transports
            .map((_, i) => {
            const latencies = samples.map((sample) => sample[i].latency);
            const meanLatency = latencies.reduce((acc, latency) => acc + latency, 0) /
                latencies.length;
            const latencyScore = 1 - meanLatency / maxLatency;
            const successes = samples.map((sample) => sample[i].success);
            const stabilityScore = successes.reduce((acc, success) => acc + success, 0) /
                successes.length;
            if (stabilityScore === 0)
                return [0, i];
            return [
                latencyWeight * latencyScore + stabilityWeight * stabilityScore,
                i,
            ];
        })
            .sort((a, b) => b[0] - a[0]);
        // 5. Sort the Transports by score.
        onTransports(scores.map(([, i]) => transports[i]));
        // 6. Wait, and then rank again.
        await wait(interval);
        rankTransports_();
    };
    rankTransports_();
}

class UrlRequiredError extends BaseError$1 {
    constructor() {
        super('No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.', {
            docsPath: '/docs/clients/intro',
            name: 'UrlRequiredError',
        });
    }
}

/**
 * @description Creates a HTTP transport that connects to a JSON-RPC API.
 */
function http(
/** URL of the JSON-RPC API. Defaults to the chain's public RPC URL. */
url, config = {}) {
    const { batch, fetchFn, fetchOptions, key = 'http', methods, name = 'HTTP JSON-RPC', onFetchRequest, onFetchResponse, retryDelay, raw, } = config;
    return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
        const { batchSize = 1000, wait = 0 } = typeof batch === 'object' ? batch : {};
        const retryCount = config.retryCount ?? retryCount_;
        const timeout = timeout_ ?? config.timeout ?? 10_000;
        const url_ = url || chain?.rpcUrls.default.http[0];
        if (!url_)
            throw new UrlRequiredError();
        const rpcClient = getHttpRpcClient(url_, {
            fetchFn,
            fetchOptions,
            onRequest: onFetchRequest,
            onResponse: onFetchResponse,
            timeout,
        });
        return createTransport({
            key,
            methods,
            name,
            async request({ method, params }) {
                const body = { method, params };
                const { schedule } = createBatchScheduler({
                    id: url_,
                    wait,
                    shouldSplitBatch(requests) {
                        return requests.length > batchSize;
                    },
                    fn: (body) => rpcClient.request({
                        body,
                    }),
                    sort: (a, b) => a.id - b.id,
                });
                const fn = async (body) => batch
                    ? schedule(body)
                    : [
                        await rpcClient.request({
                            body,
                        }),
                    ];
                const [{ error, result }] = await fn(body);
                if (raw)
                    return { error, result };
                if (error)
                    throw new RpcRequestError({
                        body,
                        error,
                        url: url_,
                    });
                return result;
            },
            retryCount,
            retryDelay,
            timeout,
            type: 'http',
        }, {
            fetchOptions,
            url: url_,
        });
    };
}

const RPC_URL_HOST = 'rpc.walletconnect.org';
function getBlockchainApiRpcUrl(caipNetworkId, projectId) {
    const url = new URL('https://rpc.walletconnect.org/v1/');
    url.searchParams.set('chainId', caipNetworkId);
    url.searchParams.set('projectId', projectId);
    return url.toString();
}
const WC_HTTP_RPC_SUPPORTED_CHAINS = [
    'near:mainnet',
    'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
    'eip155:1101',
    'eip155:56',
    'eip155:42161',
    'eip155:7777777',
    'eip155:59144',
    'eip155:324',
    'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
    'eip155:5000',
    'solana:4sgjmw1sunhzsxgspuhpqldx6wiyjntz',
    'eip155:80084',
    'eip155:5003',
    'eip155:100',
    'eip155:8453',
    'eip155:42220',
    'eip155:1313161555',
    'eip155:17000',
    'eip155:1',
    'eip155:300',
    'eip155:1313161554',
    'eip155:1329',
    'eip155:84532',
    'eip155:421614',
    'eip155:11155111',
    'eip155:8217',
    'eip155:43114',
    'solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z',
    'eip155:999999999',
    'eip155:11155420',
    'eip155:80002',
    'eip155:97',
    'eip155:43113',
    'eip155:137',
    'eip155:10',
    'eip155:1301',
    'bip122:000000000019d6689c085ae165831e93',
    'bip122:000000000933ea01ad0ee984209779ba'
];
const CaipNetworksUtil = {
    extendRpcUrlWithProjectId(rpcUrl, projectId) {
        let isReownUrl = false;
        try {
            const url = new URL(rpcUrl);
            isReownUrl = url.host === RPC_URL_HOST;
        }
        catch (e) {
            isReownUrl = false;
        }
        if (isReownUrl) {
            const url = new URL(rpcUrl);
            if (!url.searchParams.has('projectId')) {
                url.searchParams.set('projectId', projectId);
            }
            return url.toString();
        }
        return rpcUrl;
    },
    isCaipNetwork(network) {
        return 'chainNamespace' in network && 'caipNetworkId' in network;
    },
    getChainNamespace(network) {
        if (this.isCaipNetwork(network)) {
            return network.chainNamespace;
        }
        return ConstantsUtil$3.CHAIN.EVM;
    },
    getCaipNetworkId(network) {
        if (this.isCaipNetwork(network)) {
            return network.caipNetworkId;
        }
        return `${ConstantsUtil$3.CHAIN.EVM}:${network.id}`;
    },
    getDefaultRpcUrl(caipNetwork, caipNetworkId, projectId) {
        const defaultRpcUrl = caipNetwork.rpcUrls?.default?.http?.[0];
        if (WC_HTTP_RPC_SUPPORTED_CHAINS.includes(caipNetworkId)) {
            return getBlockchainApiRpcUrl(caipNetworkId, projectId);
        }
        return defaultRpcUrl || '';
    },
    extendCaipNetwork(caipNetwork, { customNetworkImageUrls, projectId, customRpcUrls }) {
        const chainNamespace = this.getChainNamespace(caipNetwork);
        const caipNetworkId = this.getCaipNetworkId(caipNetwork);
        const networkDefaultRpcUrl = caipNetwork.rpcUrls.default.http?.[0];
        const reownRpcUrl = this.getDefaultRpcUrl(caipNetwork, caipNetworkId, projectId);
        const chainDefaultRpcUrl = caipNetwork?.rpcUrls?.['chainDefault']?.http?.[0] || networkDefaultRpcUrl;
        const customRpcUrlsOfNetwork = customRpcUrls?.[caipNetworkId]?.map(i => i.url) || [];
        const rpcUrls = [...customRpcUrlsOfNetwork, reownRpcUrl];
        const rpcUrlsWithoutReown = [...customRpcUrlsOfNetwork];
        if (chainDefaultRpcUrl && !rpcUrlsWithoutReown.includes(chainDefaultRpcUrl)) {
            rpcUrlsWithoutReown.push(chainDefaultRpcUrl);
        }
        return {
            ...caipNetwork,
            chainNamespace,
            caipNetworkId,
            assets: {
                imageId: PresetsUtil.NetworkImageIds[caipNetwork.id],
                imageUrl: customNetworkImageUrls?.[caipNetwork.id]
            },
            rpcUrls: {
                ...caipNetwork.rpcUrls,
                default: {
                    http: rpcUrls
                },
                chainDefault: {
                    http: rpcUrlsWithoutReown
                }
            }
        };
    },
    extendCaipNetworks(caipNetworks, { customNetworkImageUrls, projectId, customRpcUrls }) {
        return caipNetworks.map(caipNetwork => CaipNetworksUtil.extendCaipNetwork(caipNetwork, {
            customNetworkImageUrls,
            customRpcUrls,
            projectId
        }));
    },
    getViemTransport(caipNetwork, projectId, customRpcUrls) {
        const transports = [];
        customRpcUrls?.forEach(rpcUrl => {
            transports.push(http(rpcUrl.url, rpcUrl.config));
        });
        if (WC_HTTP_RPC_SUPPORTED_CHAINS.includes(caipNetwork.caipNetworkId)) {
            transports.push(http(getBlockchainApiRpcUrl(caipNetwork.caipNetworkId, projectId), {
                fetchOptions: {
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                }
            }));
        }
        caipNetwork?.rpcUrls?.default?.http?.forEach(rpcUrl => {
            transports.push(http(rpcUrl));
        });
        return fallback(transports);
    },
    extendWagmiTransports(caipNetwork, projectId, transport) {
        if (WC_HTTP_RPC_SUPPORTED_CHAINS.includes(caipNetwork.caipNetworkId)) {
            const reownRpcUrl = this.getDefaultRpcUrl(caipNetwork, caipNetwork.caipNetworkId, projectId);
            return fallback([transport, http(reownRpcUrl)]);
        }
        return transport;
    },
    getUnsupportedNetwork(caipNetworkId) {
        return {
            id: caipNetworkId.split(':')[1],
            caipNetworkId,
            name: ConstantsUtil$3.UNSUPPORTED_NETWORK_NAME,
            chainNamespace: caipNetworkId.split(':')[0],
            nativeCurrency: {
                name: '',
                decimals: 0,
                symbol: ''
            },
            rpcUrls: {
                default: {
                    http: []
                }
            }
        };
    },
    getCaipNetworkFromStorage(defaultCaipNetwork) {
        const caipNetworkIdFromStorage = StorageUtil.getActiveCaipNetworkId();
        const caipNetworks = ChainController.getAllRequestedCaipNetworks();
        const availableNamespaces = Array.from(ChainController.state.chains?.keys() || []);
        const namespace = caipNetworkIdFromStorage?.split(':')[0];
        const isNamespaceAvailable = namespace ? availableNamespaces.includes(namespace) : false;
        const caipNetwork = caipNetworks?.find(cn => cn.caipNetworkId === caipNetworkIdFromStorage);
        const isUnsupportedNetwork = isNamespaceAvailable && !caipNetwork && caipNetworkIdFromStorage;
        if (isUnsupportedNetwork) {
            return this.getUnsupportedNetwork(caipNetworkIdFromStorage);
        }
        if (caipNetwork) {
            return caipNetwork;
        }
        if (defaultCaipNetwork) {
            return defaultCaipNetwork;
        }
        return caipNetworks?.[0];
    }
};

const CLEAN_PROVIDERS_STATE = {
    eip155: undefined,
    solana: undefined,
    polkadot: undefined,
    bip122: undefined,
    cosmos: undefined
};
const state = proxy({
    providers: { ...CLEAN_PROVIDERS_STATE },
    providerIds: { ...CLEAN_PROVIDERS_STATE }
});
const ProviderUtil = {
    state,
    subscribeKey(key, callback) {
        return subscribeKey(state, key, callback);
    },
    subscribe(callback) {
        return subscribe(state, () => {
            callback(state);
        });
    },
    subscribeProviders(callback) {
        return subscribe(state.providers, () => callback(state.providers));
    },
    setProvider(chainNamespace, provider) {
        if (provider) {
            state.providers[chainNamespace] = ref(provider);
        }
    },
    getProvider(chainNamespace) {
        return state.providers[chainNamespace];
    },
    setProviderId(chainNamespace, providerId) {
        if (providerId) {
            state.providerIds[chainNamespace] = providerId;
        }
    },
    getProviderId(chainNamespace) {
        if (!chainNamespace) {
            return undefined;
        }
        return state.providerIds[chainNamespace];
    },
    reset() {
        state.providers = { ...CLEAN_PROVIDERS_STATE };
        state.providerIds = { ...CLEAN_PROVIDERS_STATE };
    },
    resetChain(chainNamespace) {
        state.providers[chainNamespace] = undefined;
        state.providerIds[chainNamespace] = undefined;
    }
};

const ConstantsUtil = {
    SECURE_SITE_ORIGIN: (typeof process !== 'undefined' && typeof process.env !== 'undefined'
        ? process.env['NEXT_PUBLIC_SECURE_SITE_ORIGIN']
        : undefined) || 'https://secure.walletconnect.org',
    VIEW_DIRECTION: {
        Next: 'next',
        Prev: 'prev'
    },
    DEFAULT_CONNECT_METHOD_ORDER: ['email', 'social', 'wallet'],
    ANIMATION_DURATIONS: {
        HeaderText: 120,
        ModalHeight: 150,
        ViewTransition: 150
    }
};

const WalletUtil = {
    filterOutDuplicatesByRDNS(wallets) {
        const connectors = OptionsController.state.enableEIP6963
            ? ConnectorController.state.connectors
            : [];
        const recent = StorageUtil.getRecentWallets();
        const connectorRDNSs = connectors
            .map(connector => connector.info?.rdns)
            .filter(Boolean);
        const recentRDNSs = recent.map(wallet => wallet.rdns).filter(Boolean);
        const allRDNSs = connectorRDNSs.concat(recentRDNSs);
        if (allRDNSs.includes('io.metamask.mobile') && CoreHelperUtil.isMobile()) {
            const index = allRDNSs.indexOf('io.metamask.mobile');
            allRDNSs[index] = 'io.metamask';
        }
        const filtered = wallets.filter(wallet => !allRDNSs.includes(String(wallet?.rdns)));
        return filtered;
    },
    filterOutDuplicatesByIds(wallets) {
        const connectors = ConnectorController.state.connectors.filter(connector => connector.type === 'ANNOUNCED' || connector.type === 'INJECTED');
        const recent = StorageUtil.getRecentWallets();
        const connectorIds = connectors.map(connector => connector.explorerId);
        const recentIds = recent.map(wallet => wallet.id);
        const allIds = connectorIds.concat(recentIds);
        const filtered = wallets.filter(wallet => !allIds.includes(wallet?.id));
        return filtered;
    },
    filterOutDuplicateWallets(wallets) {
        const uniqueByRDNS = this.filterOutDuplicatesByRDNS(wallets);
        const uniqueWallets = this.filterOutDuplicatesByIds(uniqueByRDNS);
        return uniqueWallets;
    },
    markWalletsAsInstalled(wallets) {
        const { connectors } = ConnectorController.state;
        const { featuredWalletIds } = OptionsController.state;
        const installedWalletRdnsMap = connectors
            .filter(connector => connector.type === 'ANNOUNCED')
            .reduce((rdnsMap, connector) => {
            if (!connector.info?.rdns) {
                return rdnsMap;
            }
            rdnsMap[connector.info.rdns] = true;
            return rdnsMap;
        }, {});
        const walletsWithInstallationStatus = wallets.map(wallet => ({
            ...wallet,
            installed: Boolean(wallet.rdns) && Boolean(installedWalletRdnsMap[wallet.rdns ?? ''])
        }));
        const sortedWallets = walletsWithInstallationStatus.sort((walletA, walletB) => {
            const installationComparison = Number(walletB.installed) - Number(walletA.installed);
            if (installationComparison !== 0) {
                return installationComparison;
            }
            if (featuredWalletIds?.length) {
                const walletAFeaturedIndex = featuredWalletIds.indexOf(walletA.id);
                const walletBFeaturedIndex = featuredWalletIds.indexOf(walletB.id);
                if (walletAFeaturedIndex !== -1 && walletBFeaturedIndex !== -1) {
                    return walletAFeaturedIndex - walletBFeaturedIndex;
                }
                if (walletAFeaturedIndex !== -1) {
                    return -1;
                }
                if (walletBFeaturedIndex !== -1) {
                    return 1;
                }
            }
            return 0;
        });
        return sortedWallets;
    },
    getConnectOrderMethod(_features, _connectors) {
        const connectMethodOrder = _features?.connectMethodsOrder || OptionsController.state.features?.connectMethodsOrder;
        const connectors = _connectors || ConnectorController.state.connectors;
        if (connectMethodOrder) {
            return connectMethodOrder;
        }
        const { injected, announced } = ConnectorUtil.getConnectorsByType(connectors, ApiController.state.recommended, ApiController.state.featured);
        const shownInjected = injected.filter(ConnectorUtil.showConnector);
        const shownAnnounced = announced.filter(ConnectorUtil.showConnector);
        if (shownInjected.length || shownAnnounced.length) {
            return ['wallet', 'email', 'social'];
        }
        return ConstantsUtil.DEFAULT_CONNECT_METHOD_ORDER;
    },
    isExcluded(wallet) {
        const isRDNSExcluded = Boolean(wallet.rdns) && ApiController.state.excludedWallets.some(w => w.rdns === wallet.rdns);
        const isNameExcluded = Boolean(wallet.name) &&
            ApiController.state.excludedWallets.some(w => HelpersUtil.isLowerCaseMatch(w.name, wallet.name));
        return isRDNSExcluded || isNameExcluded;
    }
};

const ConnectorUtil = {
    getConnectorsByType(connectors, recommended, featured) {
        const { customWallets } = OptionsController.state;
        const recent = StorageUtil.getRecentWallets();
        const filteredRecommended = WalletUtil.filterOutDuplicateWallets(recommended);
        const filteredFeatured = WalletUtil.filterOutDuplicateWallets(featured);
        const multiChain = connectors.filter(connector => connector.type === 'MULTI_CHAIN');
        const announced = connectors.filter(connector => connector.type === 'ANNOUNCED');
        const injected = connectors.filter(connector => connector.type === 'INJECTED');
        const external = connectors.filter(connector => connector.type === 'EXTERNAL');
        return {
            custom: customWallets,
            recent,
            external,
            multiChain,
            announced,
            injected,
            recommended: filteredRecommended,
            featured: filteredFeatured
        };
    },
    showConnector(connector) {
        const rdns = connector.info?.rdns;
        const isRDNSExcluded = Boolean(rdns) &&
            ApiController.state.excludedWallets.some(wallet => Boolean(wallet.rdns) && wallet.rdns === rdns);
        const isNameExcluded = Boolean(connector.name) &&
            ApiController.state.excludedWallets.some(wallet => HelpersUtil.isLowerCaseMatch(wallet.name, connector.name));
        if (connector.type === 'INJECTED') {
            const isBrowserWallet = connector.name === 'Browser Wallet';
            if (isBrowserWallet) {
                if (!CoreHelperUtil.isMobile()) {
                    return false;
                }
                if (CoreHelperUtil.isMobile() && !rdns && !ConnectionController.checkInstalled()) {
                    return false;
                }
            }
            if (isRDNSExcluded || isNameExcluded) {
                return false;
            }
        }
        if ((connector.type === 'ANNOUNCED' || connector.type === 'EXTERNAL') &&
            (isRDNSExcluded || isNameExcluded)) {
            return false;
        }
        return true;
    },
    getIsConnectedWithWC() {
        const chains = Array.from(ChainController.state.chains.values());
        const isConnectedWithWC = chains.some(chain => {
            const connectorId = ConnectorController.getConnectorId(chain.namespace);
            return connectorId === ConstantsUtil$3.CONNECTOR_ID.WALLET_CONNECT;
        });
        return isConnectedWithWC;
    },
    getConnectorTypeOrder({ recommended, featured, custom, recent, announced, injected, multiChain, external, overriddenConnectors = OptionsController.state.features?.connectorTypeOrder ?? [] }) {
        const isConnectedWithWC = ConnectorUtil.getIsConnectedWithWC();
        const isWCEnabled = OptionsController.state.enableWalletConnect;
        const allConnectors = [
            { type: 'walletConnect', isEnabled: isWCEnabled && !isConnectedWithWC },
            { type: 'recent', isEnabled: recent.length > 0 },
            { type: 'injected', isEnabled: [...injected, ...announced, ...multiChain].length > 0 },
            { type: 'featured', isEnabled: featured.length > 0 },
            { type: 'custom', isEnabled: custom && custom.length > 0 },
            { type: 'external', isEnabled: external.length > 0 },
            { type: 'recommended', isEnabled: recommended.length > 0 }
        ];
        const enabledConnectors = allConnectors.filter(option => option.isEnabled);
        const enabledConnectorTypes = new Set(enabledConnectors.map(option => option.type));
        const prioritizedConnectors = overriddenConnectors
            .filter(type => enabledConnectorTypes.has(type))
            .map(type => ({ type, isEnabled: true }));
        const remainingConnectors = enabledConnectors.filter(({ type: enabledConnectorType }) => {
            const hasPrioritizedConnector = prioritizedConnectors.some(({ type: prioritizedConnectorType }) => prioritizedConnectorType === enabledConnectorType);
            return !hasPrioritizedConnector;
        });
        return Array.from(new Set([...prioritizedConnectors, ...remainingConnectors].map(({ type }) => type)));
    }
};

/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * Map of ARIAMixin properties to attributes
 */
// Shim the global element internals object
// Methods should be fine as noops and properties can generally
// be while on the server.
const ElementInternalsShim = class ElementInternals {
    get shadowRoot() {
        // Grab the shadow root instance from the Element shim
        // to ensure that the shadow root is always available
        // to the internals instance even if the mode is 'closed'
        return this.__host
            .__shadowRoot;
    }
    constructor(_host) {
        this.ariaActiveDescendantElement = null;
        this.ariaAtomic = '';
        this.ariaAutoComplete = '';
        this.ariaBrailleLabel = '';
        this.ariaBrailleRoleDescription = '';
        this.ariaBusy = '';
        this.ariaChecked = '';
        this.ariaColCount = '';
        this.ariaColIndex = '';
        this.ariaColIndexText = '';
        this.ariaColSpan = '';
        this.ariaControlsElements = null;
        this.ariaCurrent = '';
        this.ariaDescribedByElements = null;
        this.ariaDescription = '';
        this.ariaDetailsElements = null;
        this.ariaDisabled = '';
        this.ariaErrorMessageElements = null;
        this.ariaExpanded = '';
        this.ariaFlowToElements = null;
        this.ariaHasPopup = '';
        this.ariaHidden = '';
        this.ariaInvalid = '';
        this.ariaKeyShortcuts = '';
        this.ariaLabel = '';
        this.ariaLabelledByElements = null;
        this.ariaLevel = '';
        this.ariaLive = '';
        this.ariaModal = '';
        this.ariaMultiLine = '';
        this.ariaMultiSelectable = '';
        this.ariaOrientation = '';
        this.ariaOwnsElements = null;
        this.ariaPlaceholder = '';
        this.ariaPosInSet = '';
        this.ariaPressed = '';
        this.ariaReadOnly = '';
        this.ariaRelevant = '';
        this.ariaRequired = '';
        this.ariaRoleDescription = '';
        this.ariaRowCount = '';
        this.ariaRowIndex = '';
        this.ariaRowIndexText = '';
        this.ariaRowSpan = '';
        this.ariaSelected = '';
        this.ariaSetSize = '';
        this.ariaSort = '';
        this.ariaValueMax = '';
        this.ariaValueMin = '';
        this.ariaValueNow = '';
        this.ariaValueText = '';
        this.role = '';
        this.form = null;
        this.labels = [];
        this.states = new Set();
        this.validationMessage = '';
        this.validity = {};
        this.willValidate = true;
        this.__host = _host;
    }
    checkValidity() {
        // TODO(augustjk) Consider actually implementing logic.
        // See https://github.com/lit/lit/issues/3740
        console.warn('`ElementInternals.checkValidity()` was called on the server.' +
            'This method always returns true.');
        return true;
    }
    reportValidity() {
        return true;
    }
    setFormValue() { }
    setValidity() { }
};

/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Event_cancelable, _Event_bubbles, _Event_composed, _Event_defaultPrevented, _Event_timestamp, _Event_propagationStopped, _Event_type, _Event_target, _Event_isBeingDispatched, _a$1, _CustomEvent_detail, _b;
const isCaptureEventListener = (options) => (typeof options === 'boolean' ? options : (options?.capture ?? false));
// Event phases
const NONE = 0;
const CAPTURING_PHASE = 1;
const AT_TARGET = 2;
const BUBBLING_PHASE = 3;
// Shim the global EventTarget object
class EventTarget {
    constructor() {
        this.__eventListeners = new Map();
        this.__captureEventListeners = new Map();
    }
    addEventListener(type, callback, options) {
        if (callback === undefined || callback === null) {
            return;
        }
        const eventListenersMap = isCaptureEventListener(options)
            ? this.__captureEventListeners
            : this.__eventListeners;
        let eventListeners = eventListenersMap.get(type);
        if (eventListeners === undefined) {
            eventListeners = new Map();
            eventListenersMap.set(type, eventListeners);
        }
        else if (eventListeners.has(callback)) {
            return;
        }
        const normalizedOptions = typeof options === 'object' && options ? options : {};
        normalizedOptions.signal?.addEventListener('abort', () => this.removeEventListener(type, callback, options));
        eventListeners.set(callback, normalizedOptions ?? {});
    }
    removeEventListener(type, callback, options) {
        if (callback === undefined || callback === null) {
            return;
        }
        const eventListenersMap = isCaptureEventListener(options)
            ? this.__captureEventListeners
            : this.__eventListeners;
        const eventListeners = eventListenersMap.get(type);
        if (eventListeners !== undefined) {
            eventListeners.delete(callback);
            if (!eventListeners.size) {
                eventListenersMap.delete(type);
            }
        }
    }
    dispatchEvent(event) {
        const composedPath = [this];
        let parent = this.__eventTargetParent;
        if (event.composed) {
            while (parent) {
                composedPath.push(parent);
                parent = parent.__eventTargetParent;
            }
        }
        else {
            // If the event is not composed and the event was dispatched inside
            // shadow DOM, we need to stop before the host of the shadow DOM.
            while (parent && parent !== this.__host) {
                composedPath.push(parent);
                parent = parent.__eventTargetParent;
            }
        }
        // We need to patch various properties that would either be empty or wrong
        // in this scenario.
        let stopPropagation = false;
        let stopImmediatePropagation = false;
        let eventPhase = NONE;
        let target = null;
        let tmpTarget = null;
        let currentTarget = null;
        const originalStopPropagation = event.stopPropagation;
        const originalStopImmediatePropagation = event.stopImmediatePropagation;
        Object.defineProperties(event, {
            target: {
                get() {
                    return target ?? tmpTarget;
                },
                ...enumerableProperty,
            },
            srcElement: {
                get() {
                    return event.target;
                },
                ...enumerableProperty,
            },
            currentTarget: {
                get() {
                    return currentTarget;
                },
                ...enumerableProperty,
            },
            eventPhase: {
                get() {
                    return eventPhase;
                },
                ...enumerableProperty,
            },
            composedPath: {
                value: () => composedPath,
                ...enumerableProperty,
            },
            stopPropagation: {
                value: () => {
                    stopPropagation = true;
                    originalStopPropagation.call(event);
                },
                ...enumerableProperty,
            },
            stopImmediatePropagation: {
                value: () => {
                    stopImmediatePropagation = true;
                    originalStopImmediatePropagation.call(event);
                },
                ...enumerableProperty,
            },
        });
        // An event handler can either be a function, an object with a handleEvent
        // method or null. This function takes care to call the event handler
        // correctly.
        const invokeEventListener = (listener, options, eventListenerMap) => {
            if (typeof listener === 'function') {
                listener(event);
            }
            else if (typeof listener?.handleEvent === 'function') {
                listener.handleEvent(event);
            }
            if (options.once) {
                eventListenerMap.delete(listener);
            }
        };
        // When an event is finished being dispatched, which can be after the event
        // tree has been traversed or stopPropagation/stopImmediatePropagation has
        // been called. Once that is the case, the currentTarget and eventPhase
        // need to be reset and a value, representing whether the event has not
        // been prevented, needs to be returned.
        const finishDispatch = () => {
            currentTarget = null;
            eventPhase = NONE;
            return !event.defaultPrevented;
        };
        // An event starts with the capture order, where it starts from the top.
        // This is done even if bubbles is set to false, which is the default.
        const captureEventPath = composedPath.slice().reverse();
        // If the event target, which dispatches the event, is either in the light DOM
        // or the event is not composed, the target is always itself. If that is not
        // the case, the target needs to be retargeted: https://dom.spec.whatwg.org/#retarget
        target = !this.__host || !event.composed ? this : null;
        const retarget = (eventTargets) => {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            tmpTarget = this;
            while (tmpTarget.__host && eventTargets.includes(tmpTarget.__host)) {
                tmpTarget = tmpTarget.__host;
            }
        };
        for (const eventTarget of captureEventPath) {
            if (!target && (!tmpTarget || tmpTarget === eventTarget.__host)) {
                retarget(captureEventPath.slice(captureEventPath.indexOf(eventTarget)));
            }
            currentTarget = eventTarget;
            eventPhase = eventTarget === event.target ? AT_TARGET : CAPTURING_PHASE;
            const captureEventListeners = eventTarget.__captureEventListeners.get(event.type);
            if (captureEventListeners) {
                for (const [listener, options] of captureEventListeners) {
                    invokeEventListener(listener, options, captureEventListeners);
                    if (stopImmediatePropagation) {
                        // Event.stopImmediatePropagation() stops any following invocation
                        // of an event handler even on the same event target.
                        return finishDispatch();
                    }
                }
            }
            if (stopPropagation) {
                // Event.stopPropagation() stops any following invocation
                // of an event handler for any following event targets.
                return finishDispatch();
            }
        }
        const bubbleEventPath = event.bubbles ? composedPath : [this];
        tmpTarget = null;
        for (const eventTarget of bubbleEventPath) {
            if (!target &&
                (!tmpTarget || eventTarget === tmpTarget.__host)) {
                retarget(bubbleEventPath.slice(0, bubbleEventPath.indexOf(eventTarget) + 1));
            }
            currentTarget = eventTarget;
            eventPhase = eventTarget === event.target ? AT_TARGET : BUBBLING_PHASE;
            const captureEventListeners = eventTarget.__eventListeners.get(event.type);
            if (captureEventListeners) {
                for (const [listener, options] of captureEventListeners) {
                    invokeEventListener(listener, options, captureEventListeners);
                    if (stopImmediatePropagation) {
                        // Event.stopImmediatePropagation() stops any following invocation
                        // of an event handler even on the same event target.
                        return finishDispatch();
                    }
                }
            }
            if (stopPropagation) {
                // Event.stopPropagation() stops any following invocation
                // of an event handler for any following event targets.
                return finishDispatch();
            }
        }
        return finishDispatch();
    }
}
const EventTargetShimWithRealType = EventTarget;
const enumerableProperty = { __proto__: null };
enumerableProperty.enumerable = true;
Object.freeze(enumerableProperty);
// TODO: Remove this when we remove support for vm modules (--experimental-vm-modules).
const EventShim = (_a$1 = class Event {
        constructor(type, options = {}) {
            _Event_cancelable.set(this, false);
            _Event_bubbles.set(this, false);
            _Event_composed.set(this, false);
            _Event_defaultPrevented.set(this, false);
            _Event_timestamp.set(this, Date.now());
            _Event_propagationStopped.set(this, false);
            _Event_type.set(this, void 0);
            _Event_target.set(this, void 0);
            _Event_isBeingDispatched.set(this, void 0);
            this.NONE = NONE;
            this.CAPTURING_PHASE = CAPTURING_PHASE;
            this.AT_TARGET = AT_TARGET;
            this.BUBBLING_PHASE = BUBBLING_PHASE;
            if (arguments.length === 0)
                throw new Error(`The type argument must be specified`);
            if (typeof options !== 'object' || !options) {
                throw new Error(`The "options" argument must be an object`);
            }
            const { bubbles, cancelable, composed } = options;
            __classPrivateFieldSet(this, _Event_cancelable, !!cancelable, "f");
            __classPrivateFieldSet(this, _Event_bubbles, !!bubbles, "f");
            __classPrivateFieldSet(this, _Event_composed, !!composed, "f");
            __classPrivateFieldSet(this, _Event_type, `${type}`, "f");
            __classPrivateFieldSet(this, _Event_target, null, "f");
            __classPrivateFieldSet(this, _Event_isBeingDispatched, false, "f");
        }
        initEvent(_type, _bubbles, _cancelable) {
            throw new Error('Method not implemented.');
        }
        stopImmediatePropagation() {
            this.stopPropagation();
        }
        preventDefault() {
            __classPrivateFieldSet(this, _Event_defaultPrevented, true, "f");
        }
        get target() {
            return __classPrivateFieldGet(this, _Event_target, "f");
        }
        get currentTarget() {
            return __classPrivateFieldGet(this, _Event_target, "f");
        }
        get srcElement() {
            return __classPrivateFieldGet(this, _Event_target, "f");
        }
        get type() {
            return __classPrivateFieldGet(this, _Event_type, "f");
        }
        get cancelable() {
            return __classPrivateFieldGet(this, _Event_cancelable, "f");
        }
        get defaultPrevented() {
            return __classPrivateFieldGet(this, _Event_cancelable, "f") && __classPrivateFieldGet(this, _Event_defaultPrevented, "f");
        }
        get timeStamp() {
            return __classPrivateFieldGet(this, _Event_timestamp, "f");
        }
        composedPath() {
            return __classPrivateFieldGet(this, _Event_isBeingDispatched, "f") ? [__classPrivateFieldGet(this, _Event_target, "f")] : [];
        }
        get returnValue() {
            return !__classPrivateFieldGet(this, _Event_cancelable, "f") || !__classPrivateFieldGet(this, _Event_defaultPrevented, "f");
        }
        get bubbles() {
            return __classPrivateFieldGet(this, _Event_bubbles, "f");
        }
        get composed() {
            return __classPrivateFieldGet(this, _Event_composed, "f");
        }
        get eventPhase() {
            return __classPrivateFieldGet(this, _Event_isBeingDispatched, "f") ? _a$1.AT_TARGET : _a$1.NONE;
        }
        get cancelBubble() {
            return __classPrivateFieldGet(this, _Event_propagationStopped, "f");
        }
        set cancelBubble(value) {
            if (value) {
                __classPrivateFieldSet(this, _Event_propagationStopped, true, "f");
            }
        }
        stopPropagation() {
            __classPrivateFieldSet(this, _Event_propagationStopped, true, "f");
        }
        get isTrusted() {
            return false;
        }
    },
    _Event_cancelable = new WeakMap(),
    _Event_bubbles = new WeakMap(),
    _Event_composed = new WeakMap(),
    _Event_defaultPrevented = new WeakMap(),
    _Event_timestamp = new WeakMap(),
    _Event_propagationStopped = new WeakMap(),
    _Event_type = new WeakMap(),
    _Event_target = new WeakMap(),
    _Event_isBeingDispatched = new WeakMap(),
    _a$1.NONE = NONE,
    _a$1.CAPTURING_PHASE = CAPTURING_PHASE,
    _a$1.AT_TARGET = AT_TARGET,
    _a$1.BUBBLING_PHASE = BUBBLING_PHASE,
    _a$1);
Object.defineProperties(EventShim.prototype, {
    initEvent: enumerableProperty,
    stopImmediatePropagation: enumerableProperty,
    preventDefault: enumerableProperty,
    target: enumerableProperty,
    currentTarget: enumerableProperty,
    srcElement: enumerableProperty,
    type: enumerableProperty,
    cancelable: enumerableProperty,
    defaultPrevented: enumerableProperty,
    timeStamp: enumerableProperty,
    composedPath: enumerableProperty,
    returnValue: enumerableProperty,
    bubbles: enumerableProperty,
    composed: enumerableProperty,
    eventPhase: enumerableProperty,
    cancelBubble: enumerableProperty,
    stopPropagation: enumerableProperty,
    isTrusted: enumerableProperty,
});
// TODO: Remove this when we remove support for vm modules (--experimental-vm-modules).
const CustomEventShim = (_b = class CustomEvent extends EventShim {
        constructor(type, options = {}) {
            super(type, options);
            _CustomEvent_detail.set(this, void 0);
            __classPrivateFieldSet(this, _CustomEvent_detail, options?.detail ?? null, "f");
        }
        initCustomEvent(_type, _bubbles, _cancelable, _detail) {
            throw new Error('Method not implemented.');
        }
        get detail() {
            return __classPrivateFieldGet(this, _CustomEvent_detail, "f");
        }
    },
    _CustomEvent_detail = new WeakMap(),
    _b);
Object.defineProperties(CustomEventShim.prototype, {
    detail: enumerableProperty,
});
const EventShimWithRealType = EventShim;
const CustomEventShimWithRealType = CustomEventShim;

/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _a;
(_a = class CSSRule {
        constructor() {
            this.STYLE_RULE = 1;
            this.CHARSET_RULE = 2;
            this.IMPORT_RULE = 3;
            this.MEDIA_RULE = 4;
            this.FONT_FACE_RULE = 5;
            this.PAGE_RULE = 6;
            this.NAMESPACE_RULE = 10;
            this.KEYFRAMES_RULE = 7;
            this.KEYFRAME_RULE = 8;
            this.SUPPORTS_RULE = 12;
            this.COUNTER_STYLE_RULE = 11;
            this.FONT_FEATURE_VALUES_RULE = 14;
            this.__parentStyleSheet = null;
            this.cssText = '';
        }
        get parentRule() {
            return null;
        }
        get parentStyleSheet() {
            return this.__parentStyleSheet;
        }
        get type() {
            return 0;
        }
    },
    _a.STYLE_RULE = 1,
    _a.CHARSET_RULE = 2,
    _a.IMPORT_RULE = 3,
    _a.MEDIA_RULE = 4,
    _a.FONT_FACE_RULE = 5,
    _a.PAGE_RULE = 6,
    _a.NAMESPACE_RULE = 10,
    _a.KEYFRAMES_RULE = 7,
    _a.KEYFRAME_RULE = 8,
    _a.SUPPORTS_RULE = 12,
    _a.COUNTER_STYLE_RULE = 11,
    _a.FONT_FEATURE_VALUES_RULE = 14,
    _a);

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// In an empty Node.js vm, we need to patch the global context.
// TODO: Remove these globalThis assignments when we remove support
// for vm modules (--experimental-vm-modules).
globalThis.Event ??= EventShimWithRealType;
globalThis.CustomEvent ??= CustomEventShimWithRealType;
const attributes = new WeakMap();
const attributesForElement = (element) => {
    let attrs = attributes.get(element);
    if (attrs === undefined) {
        attributes.set(element, (attrs = new Map()));
    }
    return attrs;
};
// The typings around the exports below are a little funky:
//
// 1. We want the `name` of the shim classes to match the real ones at runtime,
//    hence e.g. `class Element`.
// 2. We can't shadow the global types with a simple class declaration, because
//    then we can't reference the global types for casting, hence e.g.
//    `const ElementShim = class Element`.
// 3. We want to export the classes typed as the real ones, hence e.g.
//    `const ElementShimWithRealType = ElementShim as object as typeof Element;`.
// 4. We want the exported names to match the real ones, hence e.g.
//    `export {ElementShimWithRealType as Element}`.
const ElementShim = class Element extends EventTargetShimWithRealType {
    constructor() {
        super(...arguments);
        this.__shadowRootMode = null;
        this.__shadowRoot = null;
        this.__internals = null;
    }
    get attributes() {
        return Array.from(attributesForElement(this)).map(([name, value]) => ({
            name,
            value,
        }));
    }
    get shadowRoot() {
        if (this.__shadowRootMode === 'closed') {
            return null;
        }
        return this.__shadowRoot;
    }
    get localName() {
        return this.constructor.__localName;
    }
    get tagName() {
        return this.localName?.toUpperCase();
    }
    setAttribute(name, value) {
        // Emulate browser behavior that silently casts all values to string. E.g.
        // `42` becomes `"42"` and `{}` becomes `"[object Object]""`.
        attributesForElement(this).set(name, String(value));
    }
    removeAttribute(name) {
        attributesForElement(this).delete(name);
    }
    toggleAttribute(name, force) {
        // Steps reference https://dom.spec.whatwg.org/#dom-element-toggleattribute
        if (this.hasAttribute(name)) {
            // Step 5
            if (force === undefined || !force) {
                this.removeAttribute(name);
                return false;
            }
        }
        else {
            // Step 4
            if (force === undefined || force) {
                // Step 4.1
                this.setAttribute(name, '');
                return true;
            }
            else {
                // Step 4.2
                return false;
            }
        }
        // Step 6
        return true;
    }
    hasAttribute(name) {
        return attributesForElement(this).has(name);
    }
    attachShadow(init) {
        const shadowRoot = { host: this };
        this.__shadowRootMode = init.mode;
        if (init && init.mode === 'open') {
            this.__shadowRoot = shadowRoot;
        }
        return shadowRoot;
    }
    attachInternals() {
        if (this.__internals !== null) {
            throw new Error(`Failed to execute 'attachInternals' on 'HTMLElement': ` +
                `ElementInternals for the specified element was already attached.`);
        }
        const internals = new ElementInternalsShim(this);
        this.__internals = internals;
        return internals;
    }
    getAttribute(name) {
        const value = attributesForElement(this).get(name);
        return value ?? null;
    }
};
const HTMLElementShim = class HTMLElement extends ElementShim {
};
const HTMLElementShimWithRealType = HTMLElementShim;
// For convenience, we provide a global instance of a HTMLElement as an event
// target. This facilitates registering global event handlers
// (e.g. for @lit/context ContextProvider).
// We use this in in the SSR render function.
// Note, this is a bespoke element and not simply `document` or `window` since
// user code relies on these being undefined in the server environment.
globalThis.litServerRoot ??= Object.defineProperty(new HTMLElementShimWithRealType(), 'localName', {
    // Patch localName (and tagName) to return a unique name.
    get() {
        return 'lit-server-root';
    },
});
function promiseWithResolvers() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve: resolve, reject: reject };
}
class CustomElementRegistry {
    constructor() {
        this.__definitions = new Map();
        this.__reverseDefinitions = new Map();
        this.__pendingWhenDefineds = new Map();
    }
    define(name, ctor) {
        if (this.__definitions.has(name)) {
            if (process.env.NODE_ENV === 'development') {
                console.warn(`'CustomElementRegistry' already has "${name}" defined. ` +
                    `This may have been caused by live reload or hot module ` +
                    `replacement in which case it can be safely ignored.\n` +
                    `Make sure to test your application with a production build as ` +
                    `repeat registrations will throw in production.`);
            }
            else {
                throw new Error(`Failed to execute 'define' on 'CustomElementRegistry': ` +
                    `the name "${name}" has already been used with this registry`);
            }
        }
        if (this.__reverseDefinitions.has(ctor)) {
            throw new Error(`Failed to execute 'define' on 'CustomElementRegistry': ` +
                `the constructor has already been used with this registry for the ` +
                `tag name ${this.__reverseDefinitions.get(ctor)}`);
        }
        // Provide tagName and localName for the component.
        ctor.__localName = name;
        this.__definitions.set(name, {
            ctor,
            // Note it's important we read `observedAttributes` in case it is a getter
            // with side-effects, as is the case in Lit, where it triggers class
            // finalization.
            //
            // TODO(aomarks) To be spec compliant, we should also capture the
            // registration-time lifecycle methods like `connectedCallback`. For them
            // to be actually accessible to e.g. the Lit SSR element renderer, though,
            // we'd need to introduce a new API for accessing them (since `get` only
            // returns the constructor).
            observedAttributes: ctor.observedAttributes ?? [],
        });
        this.__reverseDefinitions.set(ctor, name);
        this.__pendingWhenDefineds.get(name)?.resolve(ctor);
        this.__pendingWhenDefineds.delete(name);
    }
    get(name) {
        const definition = this.__definitions.get(name);
        return definition?.ctor;
    }
    getName(ctor) {
        return this.__reverseDefinitions.get(ctor) ?? null;
    }
    upgrade(_element) {
        // In SSR this doesn't make a lot of sense, so we do nothing.
        throw new Error(`customElements.upgrade is not currently supported in SSR. ` +
            `Please file a bug if you need it.`);
    }
    async whenDefined(name) {
        const definition = this.__definitions.get(name);
        if (definition) {
            return definition.ctor;
        }
        let withResolvers = this.__pendingWhenDefineds.get(name);
        if (!withResolvers) {
            withResolvers = promiseWithResolvers();
            this.__pendingWhenDefineds.set(name, withResolvers);
        }
        return withResolvers.promise;
    }
}
const CustomElementRegistryShimWithRealType = CustomElementRegistry;
const customElements = new CustomElementRegistryShimWithRealType();

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,e$1=t$1.ShadowRoot&&(void 0===t$1.ShadyCSS||t$1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$3=new WeakMap;let n$2 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$1&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$3.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$3.set(s,t));}return t}toString(){return this.cssText}};const r$2=t=>new n$2("string"==typeof t?t:t+"",void 0,s$2),i$2=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$2(o,t,s$2)},S$1=(s,o)=>{if(e$1)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$1.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$1||void 0===t$1.CSSStyleSheet?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$2(e)})(t):t;

const{is:h$1,defineProperty:r$1,getOwnPropertyDescriptor:o$2,getOwnPropertyNames:n$1,getOwnPropertySymbols:a$1,getPrototypeOf:c$1}=Object,l$1=globalThis;l$1.customElements??=customElements;const p$1=l$1.trustedTypes,d$1=p$1?p$1.emptyScript:"",u$1=l$1.reactiveElementPolyfillSupport,f$1=(t,s)=>t,b$1={toAttribute(t,s){switch(s){case Boolean:t=t?d$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},m$1=(t,s)=>!h$1(t,s),y$1={attribute:true,type:String,converter:b$1,reflect:false,useDefault:false,hasChanged:m$1};Symbol.metadata??=Symbol("metadata"),l$1.litPropertyMetadata??=new WeakMap;let g$1 = class g extends(globalThis.HTMLElement??HTMLElementShimWithRealType){static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=y$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),e=this.getPropertyDescriptor(t,i,s);void 0!==e&&r$1(this.prototype,t,e);}}static getPropertyDescriptor(t,s,i){const{get:e,set:h}=o$2(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const r=e?.call(this);h?.call(this,s),this.requestUpdate(t,r,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??y$1}static _$Ei(){if(this.hasOwnProperty(f$1("elementProperties")))return;const t=c$1(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(f$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(f$1("properties"))){const t=this.properties,s=[...n$1(t),...a$1(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(t){const s=[];if(Array.isArray(t)){const e=new Set(t.flat(1/0).reverse());for(const t of e)s.unshift(c$2(t));}else void 0!==t&&s.push(c$2(t));return s}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:b$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??m$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};g$1.elementStyles=[],g$1.shadowRootOptions={mode:"open"},g$1[f$1("elementProperties")]=new Map,g$1[f$1("finalized")]=new Map,u$1?.({ReactiveElement:g$1}),(l$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i$1=t=>t,s$1=t.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$1=`lit$${Math.random().toFixed(9).slice(2)}$`,n="?"+o$1,r=`<${n}>`,l=void 0===t.document?{createTreeWalker:()=>({})}:document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),T=x(1),b=x(2),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$1+x):s+o$1+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$1),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$1)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$1),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$1,t+1));)d.push({type:7,index:l}),t+=o$1.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class k{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new R(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new W(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class R{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new k(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new R(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class W{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const j=t.litHtmlPolyfillSupport;j?.(S,R),(t.litHtmlVersions??=[]).push("3.3.2");const B=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new R(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends g$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=B(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o=s.litElementPolyfillSupport;o?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.2");

let themeTag = undefined;
let darkModeTag = undefined;
let lightModeTag = undefined;
function initializeTheming(themeVariables, themeMode) {
    themeTag = document.createElement('style');
    darkModeTag = document.createElement('style');
    lightModeTag = document.createElement('style');
    themeTag.textContent = createRootStyles(themeVariables).core.cssText;
    darkModeTag.textContent = createRootStyles(themeVariables).dark.cssText;
    lightModeTag.textContent = createRootStyles(themeVariables).light.cssText;
    document.head.appendChild(themeTag);
    document.head.appendChild(darkModeTag);
    document.head.appendChild(lightModeTag);
    setColorTheme(themeMode);
}
function setColorTheme(themeMode) {
    if (darkModeTag && lightModeTag) {
        if (themeMode === 'light') {
            darkModeTag.removeAttribute('media');
            lightModeTag.media = 'enabled';
        }
        else {
            lightModeTag.removeAttribute('media');
            darkModeTag.media = 'enabled';
        }
    }
}
function setThemeVariables(themeVariables) {
    if (themeTag && darkModeTag && lightModeTag) {
        themeTag.textContent = createRootStyles(themeVariables).core.cssText;
        darkModeTag.textContent = createRootStyles(themeVariables).dark.cssText;
        lightModeTag.textContent = createRootStyles(themeVariables).light.cssText;
    }
}
function createRootStyles(themeVariables) {
    return {
        core: i$2 `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      @keyframes w3m-shake {
        0% {
          transform: scale(1) rotate(0deg);
        }
        20% {
          transform: scale(1) rotate(-1deg);
        }
        40% {
          transform: scale(1) rotate(1.5deg);
        }
        60% {
          transform: scale(1) rotate(-1.5deg);
        }
        80% {
          transform: scale(1) rotate(1deg);
        }
        100% {
          transform: scale(1) rotate(0deg);
        }
      }
      @keyframes w3m-iframe-fade-out {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
      @keyframes w3m-iframe-zoom-in {
        0% {
          transform: translateY(50px);
          opacity: 0;
        }
        100% {
          transform: translateY(0px);
          opacity: 1;
        }
      }
      @keyframes w3m-iframe-zoom-in-mobile {
        0% {
          transform: scale(0.95);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      :root {
        --w3m-modal-width: 360px;
        --w3m-color-mix-strength: ${r$2(themeVariables?.['--w3m-color-mix-strength']
            ? `${themeVariables['--w3m-color-mix-strength']}%`
            : '0%')};
        --w3m-font-family: ${r$2(themeVariables?.['--w3m-font-family'] ||
            'Inter, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;')};
        --w3m-font-size-master: ${r$2(themeVariables?.['--w3m-font-size-master'] || '10px')};
        --w3m-border-radius-master: ${r$2(themeVariables?.['--w3m-border-radius-master'] || '4px')};
        --w3m-z-index: ${r$2(themeVariables?.['--w3m-z-index'] || 999)};

        --wui-font-family: var(--w3m-font-family);

        --wui-font-size-mini: calc(var(--w3m-font-size-master) * 0.8);
        --wui-font-size-micro: var(--w3m-font-size-master);
        --wui-font-size-tiny: calc(var(--w3m-font-size-master) * 1.2);
        --wui-font-size-small: calc(var(--w3m-font-size-master) * 1.4);
        --wui-font-size-paragraph: calc(var(--w3m-font-size-master) * 1.6);
        --wui-font-size-medium: calc(var(--w3m-font-size-master) * 1.8);
        --wui-font-size-large: calc(var(--w3m-font-size-master) * 2);
        --wui-font-size-title-6: calc(var(--w3m-font-size-master) * 2.2);
        --wui-font-size-medium-title: calc(var(--w3m-font-size-master) * 2.4);
        --wui-font-size-2xl: calc(var(--w3m-font-size-master) * 4);

        --wui-border-radius-5xs: var(--w3m-border-radius-master);
        --wui-border-radius-4xs: calc(var(--w3m-border-radius-master) * 1.5);
        --wui-border-radius-3xs: calc(var(--w3m-border-radius-master) * 2);
        --wui-border-radius-xxs: calc(var(--w3m-border-radius-master) * 3);
        --wui-border-radius-xs: calc(var(--w3m-border-radius-master) * 4);
        --wui-border-radius-s: calc(var(--w3m-border-radius-master) * 5);
        --wui-border-radius-m: calc(var(--w3m-border-radius-master) * 7);
        --wui-border-radius-l: calc(var(--w3m-border-radius-master) * 9);
        --wui-border-radius-3xl: calc(var(--w3m-border-radius-master) * 20);

        --wui-font-weight-light: 400;
        --wui-font-weight-regular: 500;
        --wui-font-weight-medium: 600;
        --wui-font-weight-bold: 700;

        --wui-letter-spacing-2xl: -1.6px;
        --wui-letter-spacing-medium-title: -0.96px;
        --wui-letter-spacing-title-6: -0.88px;
        --wui-letter-spacing-large: -0.8px;
        --wui-letter-spacing-medium: -0.72px;
        --wui-letter-spacing-paragraph: -0.64px;
        --wui-letter-spacing-small: -0.56px;
        --wui-letter-spacing-tiny: -0.48px;
        --wui-letter-spacing-micro: -0.2px;
        --wui-letter-spacing-mini: -0.16px;

        --wui-spacing-0: 0px;
        --wui-spacing-4xs: 2px;
        --wui-spacing-3xs: 4px;
        --wui-spacing-xxs: 6px;
        --wui-spacing-2xs: 7px;
        --wui-spacing-xs: 8px;
        --wui-spacing-1xs: 10px;
        --wui-spacing-s: 12px;
        --wui-spacing-m: 14px;
        --wui-spacing-l: 16px;
        --wui-spacing-2l: 18px;
        --wui-spacing-xl: 20px;
        --wui-spacing-xxl: 24px;
        --wui-spacing-2xl: 32px;
        --wui-spacing-3xl: 40px;
        --wui-spacing-4xl: 90px;
        --wui-spacing-5xl: 95px;

        --wui-icon-box-size-xxs: 14px;
        --wui-icon-box-size-xs: 20px;
        --wui-icon-box-size-sm: 24px;
        --wui-icon-box-size-md: 32px;
        --wui-icon-box-size-mdl: 36px;
        --wui-icon-box-size-lg: 40px;
        --wui-icon-box-size-2lg: 48px;
        --wui-icon-box-size-xl: 64px;

        --wui-icon-size-inherit: inherit;
        --wui-icon-size-xxs: 10px;
        --wui-icon-size-xs: 12px;
        --wui-icon-size-sm: 14px;
        --wui-icon-size-md: 16px;
        --wui-icon-size-mdl: 18px;
        --wui-icon-size-lg: 20px;
        --wui-icon-size-xl: 24px;
        --wui-icon-size-xxl: 28px;

        --wui-wallet-image-size-inherit: inherit;
        --wui-wallet-image-size-sm: 40px;
        --wui-wallet-image-size-md: 56px;
        --wui-wallet-image-size-lg: 80px;

        --wui-visual-size-size-inherit: inherit;
        --wui-visual-size-sm: 40px;
        --wui-visual-size-md: 55px;
        --wui-visual-size-lg: 80px;

        --wui-box-size-md: 100px;
        --wui-box-size-lg: 120px;

        --wui-ease-out-power-2: cubic-bezier(0, 0, 0.22, 1);
        --wui-ease-out-power-1: cubic-bezier(0, 0, 0.55, 1);

        --wui-ease-in-power-3: cubic-bezier(0.66, 0, 1, 1);
        --wui-ease-in-power-2: cubic-bezier(0.45, 0, 1, 1);
        --wui-ease-in-power-1: cubic-bezier(0.3, 0, 1, 1);

        --wui-ease-inout-power-1: cubic-bezier(0.45, 0, 0.55, 1);

        --wui-duration-lg: 200ms;
        --wui-duration-md: 125ms;
        --wui-duration-sm: 75ms;

        --wui-path-network-sm: path(
          'M15.4 2.1a5.21 5.21 0 0 1 5.2 0l11.61 6.7a5.21 5.21 0 0 1 2.61 4.52v13.4c0 1.87-1 3.59-2.6 4.52l-11.61 6.7c-1.62.93-3.6.93-5.22 0l-11.6-6.7a5.21 5.21 0 0 1-2.61-4.51v-13.4c0-1.87 1-3.6 2.6-4.52L15.4 2.1Z'
        );

        --wui-path-network-md: path(
          'M43.4605 10.7248L28.0485 1.61089C25.5438 0.129705 22.4562 0.129705 19.9515 1.61088L4.53951 10.7248C2.03626 12.2051 0.5 14.9365 0.5 17.886V36.1139C0.5 39.0635 2.03626 41.7949 4.53951 43.2752L19.9515 52.3891C22.4562 53.8703 25.5438 53.8703 28.0485 52.3891L43.4605 43.2752C45.9637 41.7949 47.5 39.0635 47.5 36.114V17.8861C47.5 14.9365 45.9637 12.2051 43.4605 10.7248Z'
        );

        --wui-path-network-lg: path(
          'M78.3244 18.926L50.1808 2.45078C45.7376 -0.150261 40.2624 -0.150262 35.8192 2.45078L7.6756 18.926C3.23322 21.5266 0.5 26.3301 0.5 31.5248V64.4752C0.5 69.6699 3.23322 74.4734 7.6756 77.074L35.8192 93.5492C40.2624 96.1503 45.7376 96.1503 50.1808 93.5492L78.3244 77.074C82.7668 74.4734 85.5 69.6699 85.5 64.4752V31.5248C85.5 26.3301 82.7668 21.5266 78.3244 18.926Z'
        );

        --wui-width-network-sm: 36px;
        --wui-width-network-md: 48px;
        --wui-width-network-lg: 86px;

        --wui-height-network-sm: 40px;
        --wui-height-network-md: 54px;
        --wui-height-network-lg: 96px;

        --wui-icon-size-network-xs: 12px;
        --wui-icon-size-network-sm: 16px;
        --wui-icon-size-network-md: 24px;
        --wui-icon-size-network-lg: 42px;

        --wui-color-inherit: inherit;

        --wui-color-inverse-100: #fff;
        --wui-color-inverse-000: #000;

        --wui-cover: rgba(20, 20, 20, 0.8);

        --wui-color-modal-bg: var(--wui-color-modal-bg-base);

        --wui-color-accent-100: var(--wui-color-accent-base-100);
        --wui-color-accent-090: var(--wui-color-accent-base-090);
        --wui-color-accent-080: var(--wui-color-accent-base-080);

        --wui-color-success-100: var(--wui-color-success-base-100);
        --wui-color-success-125: var(--wui-color-success-base-125);

        --wui-color-warning-100: var(--wui-color-warning-base-100);

        --wui-color-error-100: var(--wui-color-error-base-100);
        --wui-color-error-125: var(--wui-color-error-base-125);

        --wui-color-blue-100: var(--wui-color-blue-base-100);
        --wui-color-blue-90: var(--wui-color-blue-base-90);

        --wui-icon-box-bg-error-100: var(--wui-icon-box-bg-error-base-100);
        --wui-icon-box-bg-blue-100: var(--wui-icon-box-bg-blue-base-100);
        --wui-icon-box-bg-success-100: var(--wui-icon-box-bg-success-base-100);
        --wui-icon-box-bg-inverse-100: var(--wui-icon-box-bg-inverse-base-100);

        --wui-all-wallets-bg-100: var(--wui-all-wallets-bg-100);

        --wui-avatar-border: var(--wui-avatar-border-base);

        --wui-thumbnail-border: var(--wui-thumbnail-border-base);

        --wui-wallet-button-bg: var(--wui-wallet-button-bg-base);

        --wui-box-shadow-blue: var(--wui-color-accent-glass-020);
      }

      @supports (background: color-mix(in srgb, white 50%, black)) {
        :root {
          --wui-color-modal-bg: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-modal-bg-base)
          );

          --wui-box-shadow-blue: color-mix(in srgb, var(--wui-color-accent-100) 20%, transparent);

          --wui-color-accent-100: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 100%,
            transparent
          );
          --wui-color-accent-090: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 90%,
            transparent
          );
          --wui-color-accent-080: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 80%,
            transparent
          );
          --wui-color-accent-glass-090: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 90%,
            transparent
          );
          --wui-color-accent-glass-080: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 80%,
            transparent
          );
          --wui-color-accent-glass-020: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 20%,
            transparent
          );
          --wui-color-accent-glass-015: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 15%,
            transparent
          );
          --wui-color-accent-glass-010: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 10%,
            transparent
          );
          --wui-color-accent-glass-005: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 5%,
            transparent
          );
          --wui-color-accent-002: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 2%,
            transparent
          );

          --wui-color-fg-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-100)
          );
          --wui-color-fg-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-125)
          );
          --wui-color-fg-150: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-150)
          );
          --wui-color-fg-175: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-175)
          );
          --wui-color-fg-200: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-200)
          );
          --wui-color-fg-225: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-225)
          );
          --wui-color-fg-250: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-250)
          );
          --wui-color-fg-275: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-275)
          );
          --wui-color-fg-300: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-300)
          );
          --wui-color-fg-325: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-325)
          );
          --wui-color-fg-350: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-350)
          );

          --wui-color-bg-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-100)
          );
          --wui-color-bg-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-125)
          );
          --wui-color-bg-150: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-150)
          );
          --wui-color-bg-175: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-175)
          );
          --wui-color-bg-200: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-200)
          );
          --wui-color-bg-225: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-225)
          );
          --wui-color-bg-250: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-250)
          );
          --wui-color-bg-275: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-275)
          );
          --wui-color-bg-300: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-300)
          );
          --wui-color-bg-325: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-325)
          );
          --wui-color-bg-350: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-350)
          );

          --wui-color-success-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-success-base-100)
          );
          --wui-color-success-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-success-base-125)
          );

          --wui-color-warning-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-warning-base-100)
          );

          --wui-color-error-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-error-base-100)
          );
          --wui-color-blue-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-blue-base-100)
          );
          --wui-color-blue-90: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-blue-base-90)
          );
          --wui-color-error-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-error-base-125)
          );

          --wui-icon-box-bg-error-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-error-base-100)
          );
          --wui-icon-box-bg-accent-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-blue-base-100)
          );
          --wui-icon-box-bg-success-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-success-base-100)
          );
          --wui-icon-box-bg-inverse-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-inverse-base-100)
          );

          --wui-all-wallets-bg-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-all-wallets-bg-100)
          );

          --wui-avatar-border: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-avatar-border-base)
          );

          --wui-thumbnail-border: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-thumbnail-border-base)
          );

          --wui-wallet-button-bg: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-wallet-button-bg-base)
          );
        }
      }
    `,
        light: i$2 `
      :root {
        --w3m-color-mix: ${r$2(themeVariables?.['--w3m-color-mix'] || '#fff')};
        --w3m-accent: ${r$2(getW3mThemeVariables(themeVariables, 'dark')['--w3m-accent'])};
        --w3m-default: #fff;

        --wui-color-modal-bg-base: ${r$2(getW3mThemeVariables(themeVariables, 'dark')['--w3m-background'])};
        --wui-color-accent-base-100: var(--w3m-accent);

        --wui-color-blueberry-100: hsla(230, 100%, 67%, 1);
        --wui-color-blueberry-090: hsla(231, 76%, 61%, 1);
        --wui-color-blueberry-080: hsla(230, 59%, 55%, 1);
        --wui-color-blueberry-050: hsla(231, 100%, 70%, 0.1);

        --wui-color-fg-100: #e4e7e7;
        --wui-color-fg-125: #d0d5d5;
        --wui-color-fg-150: #a8b1b1;
        --wui-color-fg-175: #a8b0b0;
        --wui-color-fg-200: #949e9e;
        --wui-color-fg-225: #868f8f;
        --wui-color-fg-250: #788080;
        --wui-color-fg-275: #788181;
        --wui-color-fg-300: #6e7777;
        --wui-color-fg-325: #9a9a9a;
        --wui-color-fg-350: #363636;

        --wui-color-bg-100: #141414;
        --wui-color-bg-125: #191a1a;
        --wui-color-bg-150: #1e1f1f;
        --wui-color-bg-175: #222525;
        --wui-color-bg-200: #272a2a;
        --wui-color-bg-225: #2c3030;
        --wui-color-bg-250: #313535;
        --wui-color-bg-275: #363b3b;
        --wui-color-bg-300: #3b4040;
        --wui-color-bg-325: #252525;
        --wui-color-bg-350: #ffffff;

        --wui-color-success-base-100: #26d962;
        --wui-color-success-base-125: #30a46b;

        --wui-color-warning-base-100: #f3a13f;

        --wui-color-error-base-100: #f25a67;
        --wui-color-error-base-125: #df4a34;

        --wui-color-blue-base-100: rgba(102, 125, 255, 1);
        --wui-color-blue-base-90: rgba(102, 125, 255, 0.9);

        --wui-color-success-glass-001: rgba(38, 217, 98, 0.01);
        --wui-color-success-glass-002: rgba(38, 217, 98, 0.02);
        --wui-color-success-glass-005: rgba(38, 217, 98, 0.05);
        --wui-color-success-glass-010: rgba(38, 217, 98, 0.1);
        --wui-color-success-glass-015: rgba(38, 217, 98, 0.15);
        --wui-color-success-glass-020: rgba(38, 217, 98, 0.2);
        --wui-color-success-glass-025: rgba(38, 217, 98, 0.25);
        --wui-color-success-glass-030: rgba(38, 217, 98, 0.3);
        --wui-color-success-glass-060: rgba(38, 217, 98, 0.6);
        --wui-color-success-glass-080: rgba(38, 217, 98, 0.8);

        --wui-color-success-glass-reown-020: rgba(48, 164, 107, 0.2);

        --wui-color-warning-glass-reown-020: rgba(243, 161, 63, 0.2);

        --wui-color-error-glass-001: rgba(242, 90, 103, 0.01);
        --wui-color-error-glass-002: rgba(242, 90, 103, 0.02);
        --wui-color-error-glass-005: rgba(242, 90, 103, 0.05);
        --wui-color-error-glass-010: rgba(242, 90, 103, 0.1);
        --wui-color-error-glass-015: rgba(242, 90, 103, 0.15);
        --wui-color-error-glass-020: rgba(242, 90, 103, 0.2);
        --wui-color-error-glass-025: rgba(242, 90, 103, 0.25);
        --wui-color-error-glass-030: rgba(242, 90, 103, 0.3);
        --wui-color-error-glass-060: rgba(242, 90, 103, 0.6);
        --wui-color-error-glass-080: rgba(242, 90, 103, 0.8);

        --wui-color-error-glass-reown-020: rgba(223, 74, 52, 0.2);

        --wui-color-gray-glass-001: rgba(255, 255, 255, 0.01);
        --wui-color-gray-glass-002: rgba(255, 255, 255, 0.02);
        --wui-color-gray-glass-005: rgba(255, 255, 255, 0.05);
        --wui-color-gray-glass-010: rgba(255, 255, 255, 0.1);
        --wui-color-gray-glass-015: rgba(255, 255, 255, 0.15);
        --wui-color-gray-glass-020: rgba(255, 255, 255, 0.2);
        --wui-color-gray-glass-025: rgba(255, 255, 255, 0.25);
        --wui-color-gray-glass-030: rgba(255, 255, 255, 0.3);
        --wui-color-gray-glass-060: rgba(255, 255, 255, 0.6);
        --wui-color-gray-glass-080: rgba(255, 255, 255, 0.8);
        --wui-color-gray-glass-090: rgba(255, 255, 255, 0.9);

        --wui-color-dark-glass-100: rgba(42, 42, 42, 1);

        --wui-icon-box-bg-error-base-100: #3c2426;
        --wui-icon-box-bg-blue-base-100: #20303f;
        --wui-icon-box-bg-success-base-100: #1f3a28;
        --wui-icon-box-bg-inverse-base-100: #243240;

        --wui-all-wallets-bg-100: #222b35;

        --wui-avatar-border-base: #252525;

        --wui-thumbnail-border-base: #252525;

        --wui-wallet-button-bg-base: var(--wui-color-bg-125);

        --w3m-card-embedded-shadow-color: rgb(17 17 18 / 25%);
      }
    `,
        dark: i$2 `
      :root {
        --w3m-color-mix: ${r$2(themeVariables?.['--w3m-color-mix'] || '#000')};
        --w3m-accent: ${r$2(getW3mThemeVariables(themeVariables, 'light')['--w3m-accent'])};
        --w3m-default: #000;

        --wui-color-modal-bg-base: ${r$2(getW3mThemeVariables(themeVariables, 'light')['--w3m-background'])};
        --wui-color-accent-base-100: var(--w3m-accent);

        --wui-color-blueberry-100: hsla(231, 100%, 70%, 1);
        --wui-color-blueberry-090: hsla(231, 97%, 72%, 1);
        --wui-color-blueberry-080: hsla(231, 92%, 74%, 1);

        --wui-color-fg-100: #141414;
        --wui-color-fg-125: #2d3131;
        --wui-color-fg-150: #474d4d;
        --wui-color-fg-175: #636d6d;
        --wui-color-fg-200: #798686;
        --wui-color-fg-225: #828f8f;
        --wui-color-fg-250: #8b9797;
        --wui-color-fg-275: #95a0a0;
        --wui-color-fg-300: #9ea9a9;
        --wui-color-fg-325: #9a9a9a;
        --wui-color-fg-350: #d0d0d0;

        --wui-color-bg-100: #ffffff;
        --wui-color-bg-125: #f5fafa;
        --wui-color-bg-150: #f3f8f8;
        --wui-color-bg-175: #eef4f4;
        --wui-color-bg-200: #eaf1f1;
        --wui-color-bg-225: #e5eded;
        --wui-color-bg-250: #e1e9e9;
        --wui-color-bg-275: #dce7e7;
        --wui-color-bg-300: #d8e3e3;
        --wui-color-bg-325: #f3f3f3;
        --wui-color-bg-350: #202020;

        --wui-color-success-base-100: #26b562;
        --wui-color-success-base-125: #30a46b;

        --wui-color-warning-base-100: #f3a13f;

        --wui-color-error-base-100: #f05142;
        --wui-color-error-base-125: #df4a34;

        --wui-color-blue-base-100: rgba(102, 125, 255, 1);
        --wui-color-blue-base-90: rgba(102, 125, 255, 0.9);

        --wui-color-success-glass-001: rgba(38, 181, 98, 0.01);
        --wui-color-success-glass-002: rgba(38, 181, 98, 0.02);
        --wui-color-success-glass-005: rgba(38, 181, 98, 0.05);
        --wui-color-success-glass-010: rgba(38, 181, 98, 0.1);
        --wui-color-success-glass-015: rgba(38, 181, 98, 0.15);
        --wui-color-success-glass-020: rgba(38, 181, 98, 0.2);
        --wui-color-success-glass-025: rgba(38, 181, 98, 0.25);
        --wui-color-success-glass-030: rgba(38, 181, 98, 0.3);
        --wui-color-success-glass-060: rgba(38, 181, 98, 0.6);
        --wui-color-success-glass-080: rgba(38, 181, 98, 0.8);

        --wui-color-success-glass-reown-020: rgba(48, 164, 107, 0.2);

        --wui-color-warning-glass-reown-020: rgba(243, 161, 63, 0.2);

        --wui-color-error-glass-001: rgba(240, 81, 66, 0.01);
        --wui-color-error-glass-002: rgba(240, 81, 66, 0.02);
        --wui-color-error-glass-005: rgba(240, 81, 66, 0.05);
        --wui-color-error-glass-010: rgba(240, 81, 66, 0.1);
        --wui-color-error-glass-015: rgba(240, 81, 66, 0.15);
        --wui-color-error-glass-020: rgba(240, 81, 66, 0.2);
        --wui-color-error-glass-025: rgba(240, 81, 66, 0.25);
        --wui-color-error-glass-030: rgba(240, 81, 66, 0.3);
        --wui-color-error-glass-060: rgba(240, 81, 66, 0.6);
        --wui-color-error-glass-080: rgba(240, 81, 66, 0.8);

        --wui-color-error-glass-reown-020: rgba(223, 74, 52, 0.2);

        --wui-icon-box-bg-error-base-100: #f4dfdd;
        --wui-icon-box-bg-blue-base-100: #d9ecfb;
        --wui-icon-box-bg-success-base-100: #daf0e4;
        --wui-icon-box-bg-inverse-base-100: #dcecfc;

        --wui-all-wallets-bg-100: #e8f1fa;

        --wui-avatar-border-base: #f3f4f4;

        --wui-thumbnail-border-base: #eaefef;

        --wui-wallet-button-bg-base: var(--wui-color-bg-125);

        --wui-color-gray-glass-001: rgba(0, 0, 0, 0.01);
        --wui-color-gray-glass-002: rgba(0, 0, 0, 0.02);
        --wui-color-gray-glass-005: rgba(0, 0, 0, 0.05);
        --wui-color-gray-glass-010: rgba(0, 0, 0, 0.1);
        --wui-color-gray-glass-015: rgba(0, 0, 0, 0.15);
        --wui-color-gray-glass-020: rgba(0, 0, 0, 0.2);
        --wui-color-gray-glass-025: rgba(0, 0, 0, 0.25);
        --wui-color-gray-glass-030: rgba(0, 0, 0, 0.3);
        --wui-color-gray-glass-060: rgba(0, 0, 0, 0.6);
        --wui-color-gray-glass-080: rgba(0, 0, 0, 0.8);
        --wui-color-gray-glass-090: rgba(0, 0, 0, 0.9);

        --wui-color-dark-glass-100: rgba(233, 233, 233, 1);

        --w3m-card-embedded-shadow-color: rgb(224 225 233 / 25%);
      }
    `
    };
}
const resetStyles = i$2 `
  *,
  *::after,
  *::before,
  :host {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-style: normal;
    text-rendering: optimizeSpeed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
    font-family: var(--wui-font-family);
    backface-visibility: hidden;
  }
`;
const elementStyles = i$2 `
  button,
  a {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    transition:
      color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      border var(--wui-duration-lg) var(--wui-ease-out-power-1),
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      box-shadow var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: background-color, color, border, box-shadow, border-radius;
    outline: none;
    border: none;
    column-gap: var(--wui-spacing-3xs);
    background-color: transparent;
    text-decoration: none;
  }

  wui-flex {
    transition: border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius;
  }

  button:disabled > wui-wallet-image,
  button:disabled > wui-all-wallets-image,
  button:disabled > wui-network-image,
  button:disabled > wui-image,
  button:disabled > wui-transaction-visual,
  button:disabled > wui-logo {
    filter: grayscale(1);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-color-gray-glass-005);
    }

    button:active:enabled {
      background-color: var(--wui-color-gray-glass-010);
    }
  }

  button:disabled > wui-icon-box {
    opacity: 0.5;
  }

  input {
    border: none;
    outline: none;
    appearance: none;
  }
`;
const colorStyles = i$2 `
  .wui-color-inherit {
    color: var(--wui-color-inherit);
  }

  .wui-color-accent-100 {
    color: var(--wui-color-accent-100);
  }

  .wui-color-error-100 {
    color: var(--wui-color-error-100);
  }

  .wui-color-blue-100 {
    color: var(--wui-color-blue-100);
  }

  .wui-color-blue-90 {
    color: var(--wui-color-blue-90);
  }

  .wui-color-error-125 {
    color: var(--wui-color-error-125);
  }

  .wui-color-success-100 {
    color: var(--wui-color-success-100);
  }

  .wui-color-success-125 {
    color: var(--wui-color-success-125);
  }

  .wui-color-inverse-100 {
    color: var(--wui-color-inverse-100);
  }

  .wui-color-inverse-000 {
    color: var(--wui-color-inverse-000);
  }

  .wui-color-fg-100 {
    color: var(--wui-color-fg-100);
  }

  .wui-color-fg-200 {
    color: var(--wui-color-fg-200);
  }

  .wui-color-fg-300 {
    color: var(--wui-color-fg-300);
  }

  .wui-color-fg-325 {
    color: var(--wui-color-fg-325);
  }

  .wui-color-fg-350 {
    color: var(--wui-color-fg-350);
  }

  .wui-bg-color-inherit {
    background-color: var(--wui-color-inherit);
  }

  .wui-bg-color-blue-100 {
    background-color: var(--wui-color-accent-100);
  }

  .wui-bg-color-error-100 {
    background-color: var(--wui-color-error-100);
  }

  .wui-bg-color-error-125 {
    background-color: var(--wui-color-error-125);
  }

  .wui-bg-color-success-100 {
    background-color: var(--wui-color-success-100);
  }

  .wui-bg-color-success-125 {
    background-color: var(--wui-color-success-100);
  }

  .wui-bg-color-inverse-100 {
    background-color: var(--wui-color-inverse-100);
  }

  .wui-bg-color-inverse-000 {
    background-color: var(--wui-color-inverse-000);
  }

  .wui-bg-color-fg-100 {
    background-color: var(--wui-color-fg-100);
  }

  .wui-bg-color-fg-200 {
    background-color: var(--wui-color-fg-200);
  }

  .wui-bg-color-fg-300 {
    background-color: var(--wui-color-fg-300);
  }

  .wui-color-fg-325 {
    background-color: var(--wui-color-fg-325);
  }

  .wui-color-fg-350 {
    background-color: var(--wui-color-fg-350);
  }
`;

function isHex(value, { strict = true } = {}) {
    if (!value)
        return false;
    if (typeof value !== 'string')
        return false;
    return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith('0x');
}

/**
 * @description Retrieves the size of the value (in bytes).
 *
 * @param value The value (hex or byte array) to retrieve the size of.
 * @returns The size of the value (in bytes).
 */
function size(value) {
    if (isHex(value, { strict: false }))
        return Math.ceil((value.length - 2) / 2);
    return value.length;
}

const version = '2.45.3';

let errorConfig = {
    getDocsUrl: ({ docsBaseUrl, docsPath = '', docsSlug, }) => docsPath
        ? `${docsBaseUrl ?? 'https://viem.sh'}${docsPath}${docsSlug ? `#${docsSlug}` : ''}`
        : undefined,
    version: `viem@${version}`,
};
class BaseError extends Error {
    constructor(shortMessage, args = {}) {
        const details = (() => {
            if (args.cause instanceof BaseError)
                return args.cause.details;
            if (args.cause?.message)
                return args.cause.message;
            return args.details;
        })();
        const docsPath = (() => {
            if (args.cause instanceof BaseError)
                return args.cause.docsPath || args.docsPath;
            return args.docsPath;
        })();
        const docsUrl = errorConfig.getDocsUrl?.({ ...args, docsPath });
        const message = [
            shortMessage || 'An error occurred.',
            '',
            ...(args.metaMessages ? [...args.metaMessages, ''] : []),
            ...(docsUrl ? [`Docs: ${docsUrl}`] : []),
            ...(details ? [`Details: ${details}`] : []),
            ...(errorConfig.version ? [`Version: ${errorConfig.version}`] : []),
        ].join('\n');
        super(message, args.cause ? { cause: args.cause } : undefined);
        Object.defineProperty(this, "details", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "docsPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "metaMessages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "version", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'BaseError'
        });
        this.details = details;
        this.docsPath = docsPath;
        this.metaMessages = args.metaMessages;
        this.name = args.name ?? this.name;
        this.shortMessage = shortMessage;
        this.version = version;
    }
    walk(fn) {
        return walk(this, fn);
    }
}
function walk(err, fn) {
    if (fn?.(err))
        return err;
    if (err &&
        typeof err === 'object' &&
        'cause' in err &&
        err.cause !== undefined)
        return walk(err.cause, fn);
    return fn ? null : err;
}

class SizeExceedsPaddingSizeError extends BaseError {
    constructor({ size, targetSize, type, }) {
        super(`${type.charAt(0).toUpperCase()}${type
            .slice(1)
            .toLowerCase()} size (${size}) exceeds padding size (${targetSize}).`, { name: 'SizeExceedsPaddingSizeError' });
    }
}

function pad(hexOrBytes, { dir, size = 32 } = {}) {
    if (typeof hexOrBytes === 'string')
        return padHex(hexOrBytes, { dir, size });
    return padBytes(hexOrBytes, { dir, size });
}
function padHex(hex_, { dir, size = 32 } = {}) {
    if (size === null)
        return hex_;
    const hex = hex_.replace('0x', '');
    if (hex.length > size * 2)
        throw new SizeExceedsPaddingSizeError({
            size: Math.ceil(hex.length / 2),
            targetSize: size,
            type: 'hex',
        });
    return `0x${hex[dir === 'right' ? 'padEnd' : 'padStart'](size * 2, '0')}`;
}
function padBytes(bytes, { dir, size = 32 } = {}) {
    if (size === null)
        return bytes;
    if (bytes.length > size)
        throw new SizeExceedsPaddingSizeError({
            size: bytes.length,
            targetSize: size,
            type: 'bytes',
        });
    const paddedBytes = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
        const padEnd = dir === 'right';
        paddedBytes[padEnd ? i : size - i - 1] =
            bytes[padEnd ? i : bytes.length - i - 1];
    }
    return paddedBytes;
}

class IntegerOutOfRangeError extends BaseError {
    constructor({ max, min, signed, size, value, }) {
        super(`Number "${value}" is not in safe ${size ? `${size * 8}-bit ${signed ? 'signed' : 'unsigned'} ` : ''}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`, { name: 'IntegerOutOfRangeError' });
    }
}
class SizeOverflowError extends BaseError {
    constructor({ givenSize, maxSize }) {
        super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, { name: 'SizeOverflowError' });
    }
}

function assertSize(hexOrBytes, { size: size$1 }) {
    if (size(hexOrBytes) > size$1)
        throw new SizeOverflowError({
            givenSize: size(hexOrBytes),
            maxSize: size$1,
        });
}

const hexes = /*#__PURE__*/ Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, '0'));
/**
 * Encodes a string, number, bigint, or ByteArray into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex
 * - Example: https://viem.sh/docs/utilities/toHex#usage
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { toHex } from 'viem'
 * const data = toHex('Hello world')
 * // '0x48656c6c6f20776f726c6421'
 *
 * @example
 * import { toHex } from 'viem'
 * const data = toHex(420)
 * // '0x1a4'
 *
 * @example
 * import { toHex } from 'viem'
 * const data = toHex('Hello world', { size: 32 })
 * // '0x48656c6c6f20776f726c64210000000000000000000000000000000000000000'
 */
function toHex(value, opts = {}) {
    if (typeof value === 'number' || typeof value === 'bigint')
        return numberToHex(value, opts);
    if (typeof value === 'string') {
        return stringToHex(value, opts);
    }
    if (typeof value === 'boolean')
        return boolToHex(value, opts);
    return bytesToHex(value, opts);
}
/**
 * Encodes a boolean into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#booltohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { boolToHex } from 'viem'
 * const data = boolToHex(true)
 * // '0x1'
 *
 * @example
 * import { boolToHex } from 'viem'
 * const data = boolToHex(false)
 * // '0x0'
 *
 * @example
 * import { boolToHex } from 'viem'
 * const data = boolToHex(true, { size: 32 })
 * // '0x0000000000000000000000000000000000000000000000000000000000000001'
 */
function boolToHex(value, opts = {}) {
    const hex = `0x${Number(value)}`;
    if (typeof opts.size === 'number') {
        assertSize(hex, { size: opts.size });
        return pad(hex, { size: opts.size });
    }
    return hex;
}
/**
 * Encodes a bytes array into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#bytestohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { bytesToHex } from 'viem'
 * const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
 * // '0x48656c6c6f20576f726c6421'
 *
 * @example
 * import { bytesToHex } from 'viem'
 * const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]), { size: 32 })
 * // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
 */
function bytesToHex(value, opts = {}) {
    let string = '';
    for (let i = 0; i < value.length; i++) {
        string += hexes[value[i]];
    }
    const hex = `0x${string}`;
    if (typeof opts.size === 'number') {
        assertSize(hex, { size: opts.size });
        return pad(hex, { dir: 'right', size: opts.size });
    }
    return hex;
}
/**
 * Encodes a number or bigint into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#numbertohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { numberToHex } from 'viem'
 * const data = numberToHex(420)
 * // '0x1a4'
 *
 * @example
 * import { numberToHex } from 'viem'
 * const data = numberToHex(420, { size: 32 })
 * // '0x00000000000000000000000000000000000000000000000000000000000001a4'
 */
function numberToHex(value_, opts = {}) {
    const { signed, size } = opts;
    const value = BigInt(value_);
    let maxValue;
    if (size) {
        if (signed)
            maxValue = (1n << (BigInt(size) * 8n - 1n)) - 1n;
        else
            maxValue = 2n ** (BigInt(size) * 8n) - 1n;
    }
    else if (typeof value_ === 'number') {
        maxValue = BigInt(Number.MAX_SAFE_INTEGER);
    }
    const minValue = typeof maxValue === 'bigint' && signed ? -maxValue - 1n : 0;
    if ((maxValue && value > maxValue) || value < minValue) {
        const suffix = typeof value_ === 'bigint' ? 'n' : '';
        throw new IntegerOutOfRangeError({
            max: maxValue ? `${maxValue}${suffix}` : undefined,
            min: `${minValue}${suffix}`,
            signed,
            size,
            value: `${value_}${suffix}`,
        });
    }
    const hex = `0x${(signed && value < 0 ? (1n << BigInt(size * 8)) + BigInt(value) : value).toString(16)}`;
    if (size)
        return pad(hex, { size });
    return hex;
}
const encoder = /*#__PURE__*/ new TextEncoder();
/**
 * Encodes a UTF-8 string into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#stringtohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { stringToHex } from 'viem'
 * const data = stringToHex('Hello World!')
 * // '0x48656c6c6f20576f726c6421'
 *
 * @example
 * import { stringToHex } from 'viem'
 * const data = stringToHex('Hello World!', { size: 32 })
 * // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
 */
function stringToHex(value_, opts = {}) {
    const value = encoder.encode(value_);
    return bytesToHex(value, opts);
}

const WcConstantsUtil = {
    ERROR_CODE_UNRECOGNIZED_CHAIN_ID: 4902,
    ERROR_CODE_DEFAULT: 5000,
    ERROR_INVALID_CHAIN_ID: 32603,
    DEFAULT_ALLOWED_ANCESTORS: [
        'http://localhost:*',
        'https://*.pages.dev',
        'https://*.vercel.app',
        'https://*.ngrok-free.app',
        'https://secure-mobile.walletconnect.com',
        'https://secure-mobile.walletconnect.org'
    ]
};

function defineChain(chain) {
    return {
        formatters: undefined,
        fees: undefined,
        serializers: undefined,
        ...chain
    };
}

const solana = defineChain({
    id: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
    name: 'Solana',
    network: 'solana-mainnet',
    nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 9 },
    rpcUrls: {
        default: { http: ['https://rpc.walletconnect.org/v1'] }
    },
    blockExplorers: { default: { name: 'Solscan', url: 'https://solscan.io' } },
    testnet: false,
    chainNamespace: 'solana',
    caipNetworkId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
    deprecatedCaipNetworkId: 'solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ'
});

const solanaDevnet = defineChain({
    id: 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
    name: 'Solana Devnet',
    network: 'solana-devnet',
    nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 9 },
    rpcUrls: {
        default: { http: ['https://rpc.walletconnect.org/v1'] }
    },
    blockExplorers: { default: { name: 'Solscan', url: 'https://solscan.io' } },
    testnet: true,
    chainNamespace: 'solana',
    caipNetworkId: 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
    deprecatedCaipNetworkId: 'solana:8E9rvCKLFQia2Y35HXjjpWzj8weVo44K'
});

defineChain({
    id: '4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z',
    name: 'Solana Testnet',
    network: 'solana-testnet',
    nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 9 },
    rpcUrls: {
        default: { http: ['https://rpc.walletconnect.org/v1'] }
    },
    blockExplorers: { default: { name: 'Solscan', url: 'https://solscan.io' } },
    testnet: true,
    chainNamespace: 'solana',
    caipNetworkId: 'solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z'
});

defineChain({
    id: '000000000019d6689c085ae165831e93',
    caipNetworkId: 'bip122:000000000019d6689c085ae165831e93',
    chainNamespace: 'bip122',
    name: 'Bitcoin',
    nativeCurrency: {
        name: 'Bitcoin',
        symbol: 'BTC',
        decimals: 8
    },
    rpcUrls: {
        default: { http: ['https://rpc.walletconnect.org/v1'] }
    }
});
defineChain({
    id: '000000000933ea01ad0ee984209779ba',
    caipNetworkId: 'bip122:000000000933ea01ad0ee984209779ba',
    chainNamespace: 'bip122',
    name: 'Bitcoin Testnet',
    nativeCurrency: {
        name: 'Bitcoin',
        symbol: 'BTC',
        decimals: 8
    },
    rpcUrls: {
        default: { http: ['https://rpc.walletconnect.org/v1'] }
    },
    testnet: true
});

const DEFAULT_METHODS = {
    solana: [
        'solana_signMessage',
        'solana_signTransaction',
        'solana_requestAccounts',
        'solana_getAccounts',
        'solana_signAllTransactions',
        'solana_signAndSendTransaction'
    ],
    eip155: [
        'eth_accounts',
        'eth_requestAccounts',
        'eth_sendRawTransaction',
        'eth_sign',
        'eth_signTransaction',
        'eth_signTypedData',
        'eth_signTypedData_v3',
        'eth_signTypedData_v4',
        'eth_sendTransaction',
        'personal_sign',
        'wallet_switchEthereumChain',
        'wallet_addEthereumChain',
        'wallet_getPermissions',
        'wallet_requestPermissions',
        'wallet_registerOnboarding',
        'wallet_watchAsset',
        'wallet_scanQRCode',
        // EIP-5792
        'wallet_getCallsStatus',
        'wallet_showCallsStatus',
        'wallet_sendCalls',
        'wallet_getCapabilities',
        // EIP-7715
        'wallet_grantPermissions',
        'wallet_revokePermissions',
        //EIP-7811
        'wallet_getAssets'
    ],
    bip122: ['sendTransfer', 'signMessage', 'signPsbt', 'getAccountAddresses']
};
const WcHelpersUtil = {
    getMethodsByChainNamespace(chainNamespace) {
        return DEFAULT_METHODS[chainNamespace] || [];
    },
    createDefaultNamespace(chainNamespace) {
        return {
            methods: this.getMethodsByChainNamespace(chainNamespace),
            events: ['accountsChanged', 'chainChanged'],
            chains: [],
            rpcMap: {}
        };
    },
    applyNamespaceOverrides(baseNamespaces, overrides) {
        if (!overrides) {
            return { ...baseNamespaces };
        }
        const result = { ...baseNamespaces };
        const namespacesToOverride = new Set();
        if (overrides.methods) {
            Object.keys(overrides.methods).forEach(ns => namespacesToOverride.add(ns));
        }
        if (overrides.chains) {
            Object.keys(overrides.chains).forEach(ns => namespacesToOverride.add(ns));
        }
        if (overrides.events) {
            Object.keys(overrides.events).forEach(ns => namespacesToOverride.add(ns));
        }
        if (overrides.rpcMap) {
            Object.keys(overrides.rpcMap).forEach(chainId => {
                const [ns] = chainId.split(':');
                if (ns) {
                    namespacesToOverride.add(ns);
                }
            });
        }
        namespacesToOverride.forEach(ns => {
            if (!result[ns]) {
                result[ns] = this.createDefaultNamespace(ns);
            }
        });
        if (overrides.methods) {
            Object.entries(overrides.methods).forEach(([ns, methods]) => {
                if (result[ns]) {
                    result[ns].methods = methods;
                }
            });
        }
        if (overrides.chains) {
            Object.entries(overrides.chains).forEach(([ns, chains]) => {
                if (result[ns]) {
                    result[ns].chains = chains;
                }
            });
        }
        if (overrides.events) {
            Object.entries(overrides.events).forEach(([ns, events]) => {
                if (result[ns]) {
                    result[ns].events = events;
                }
            });
        }
        if (overrides.rpcMap) {
            const processedNamespaces = new Set();
            Object.entries(overrides.rpcMap).forEach(([chainId, rpcUrl]) => {
                const [ns, id] = chainId.split(':');
                if (!ns || !id || !result[ns]) {
                    return;
                }
                if (!result[ns].rpcMap) {
                    result[ns].rpcMap = {};
                }
                if (!processedNamespaces.has(ns)) {
                    result[ns].rpcMap = {};
                    processedNamespaces.add(ns);
                }
                result[ns].rpcMap[id] = rpcUrl;
            });
        }
        return result;
    },
    createNamespaces(caipNetworks, configOverride) {
        const defaultNamespaces = caipNetworks.reduce((acc, chain) => {
            const { id, chainNamespace, rpcUrls } = chain;
            const rpcUrl = rpcUrls.default.http[0];
            if (!acc[chainNamespace]) {
                acc[chainNamespace] = this.createDefaultNamespace(chainNamespace);
            }
            const caipNetworkId = `${chainNamespace}:${id}`;
            // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
            const namespace = acc[chainNamespace];
            namespace.chains.push(caipNetworkId);
            // Workaround for wallets that only support deprecated Solana network ID
            switch (caipNetworkId) {
                case solana.caipNetworkId:
                    namespace.chains.push(solana.deprecatedCaipNetworkId);
                    break;
                case solanaDevnet.caipNetworkId:
                    namespace.chains.push(solanaDevnet.deprecatedCaipNetworkId);
                    break;
            }
            if (namespace?.rpcMap && rpcUrl) {
                namespace.rpcMap[id] = rpcUrl;
            }
            return acc;
        }, {});
        return this.applyNamespaceOverrides(defaultNamespaces, configOverride);
    },
    resolveReownName: async (name) => {
        const wcNameAddress = await EnsController.resolveName(name);
        const networkNameAddresses = Object.values(wcNameAddress?.addresses) || [];
        return networkNameAddresses[0]?.address || false;
    },
    getChainsFromNamespaces(namespaces = {}) {
        return Object.values(namespaces).flatMap(namespace => {
            const chains = (namespace.chains || []);
            const accountsChains = namespace.accounts.map(account => {
                const [chainNamespace, chainId] = account.split(':');
                return `${chainNamespace}:${chainId}`;
            });
            return Array.from(new Set([...chains, ...accountsChains]));
        });
    },
    isSessionEventData(data) {
        return (typeof data === 'object' &&
            data !== null &&
            'id' in data &&
            'topic' in data &&
            'params' in data &&
            typeof data.params === 'object' &&
            data.params !== null &&
            'chainId' in data.params &&
            'event' in data.params &&
            typeof data.params.event === 'object' &&
            data.params.event !== null);
    },
    isOriginAllowed(currentOrigin, allowedPatterns, defaultAllowedOrigins) {
        for (const pattern of [...allowedPatterns, ...defaultAllowedOrigins]) {
            if (pattern.includes('*')) {
                // Convert wildcard pattern to regex, escape special chars, replace *, match whole string
                const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
                const regexString = `^${escapedPattern.replace(/\\\*/gu, '.*')}$`;
                const regex = new RegExp(regexString, 'u');
                if (regex.test(currentOrigin)) {
                    return true;
                }
            }
            else {
                /**
                 * There are some cases where pattern is getting just the origin, where using new URL(pattern).origin will throw an error
                 * thus we a try catch to handle this case
                 */
                try {
                    if (new URL(pattern).origin === currentOrigin) {
                        return true;
                    }
                }
                catch (e) {
                    if (pattern === currentOrigin) {
                        return true;
                    }
                }
            }
        }
        // No match found
        return false;
    }
};

class WalletConnectConnector {
    constructor({ provider, namespace }) {
        this.id = ConstantsUtil$3.CONNECTOR_ID.WALLET_CONNECT;
        this.name = PresetsUtil.ConnectorNamesMap[ConstantsUtil$3.CONNECTOR_ID.WALLET_CONNECT];
        this.type = 'WALLET_CONNECT';
        this.imageId = PresetsUtil.ConnectorImageIds[ConstantsUtil$3.CONNECTOR_ID.WALLET_CONNECT];
        this.getCaipNetworks = ChainController.getCaipNetworks.bind(ChainController);
        this.caipNetworks = this.getCaipNetworks();
        this.provider = provider;
        this.chain = namespace;
    }
    get chains() {
        return this.getCaipNetworks();
    }
    async connectWalletConnect() {
        const isAuthenticated = await this.authenticate();
        if (!isAuthenticated) {
            const caipNetworks = this.getCaipNetworks();
            const universalProviderConfigOverride = OptionsController.state.universalProviderConfigOverride;
            const namespaces = WcHelpersUtil.createNamespaces(caipNetworks, universalProviderConfigOverride);
            await this.provider.connect({ optionalNamespaces: namespaces });
        }
        return {
            clientId: await this.provider.client.core.crypto.getClientId(),
            session: this.provider.session
        };
    }
    async disconnect() {
        await this.provider.disconnect();
    }
    async authenticate() {
        const chains = this.chains.map(network => network.caipNetworkId);
        return SIWXUtil.universalProviderAuthenticate({
            universalProvider: this.provider,
            chains,
            methods: OPTIONAL_METHODS
        });
    }
}
const OPTIONAL_METHODS = [
    'eth_accounts',
    'eth_requestAccounts',
    'eth_sendRawTransaction',
    'eth_sign',
    'eth_signTransaction',
    'eth_signTypedData',
    'eth_signTypedData_v3',
    'eth_signTypedData_v4',
    'eth_sendTransaction',
    'personal_sign',
    'wallet_switchEthereumChain',
    'wallet_addEthereumChain',
    'wallet_getPermissions',
    'wallet_requestPermissions',
    'wallet_registerOnboarding',
    'wallet_watchAsset',
    'wallet_scanQRCode',
    // EIP-5792
    'wallet_getCallsStatus',
    'wallet_sendCalls',
    'wallet_getCapabilities',
    // EIP-7715
    'wallet_grantPermissions',
    'wallet_revokePermissions',
    //EIP-7811
    'wallet_getAssets'
];

/**
 * Abstract class representing a chain adapter blueprint.
 * @template Connector - The type of connector extending ChainAdapterConnector
 */
class AdapterBlueprint {
    /**
     * Creates an instance of AdapterBlueprint.
     * @param {AdapterBlueprint.Params} params - The parameters for initializing the adapter
     */
    constructor(params) {
        this.availableConnectors = [];
        this.eventListeners = new Map();
        this.getCaipNetworks = (namespace) => ChainController.getCaipNetworks(namespace);
        if (params) {
            this.construct(params);
        }
    }
    /**
     * Initializes the adapter with the given parameters.
     * @param {AdapterBlueprint.Params} params - The parameters for initializing the adapter
     */
    construct(params) {
        this.projectId = params.projectId;
        this.namespace = params.namespace;
        this.adapterType = params.adapterType;
    }
    /**
     * Gets the available connectors.
     * @returns {Connector[]} An array of available connectors
     */
    get connectors() {
        return this.availableConnectors;
    }
    /**
     * Gets the supported networks.
     * @returns {CaipNetwork[]} An array of supported networks
     */
    get networks() {
        return this.getCaipNetworks(this.namespace);
    }
    /**
     * Sets the auth provider.
     * @param {W3mFrameProvider} authProvider - The auth provider instance
     */
    setAuthProvider(authProvider) {
        this.addConnector({
            id: ConstantsUtil$3.CONNECTOR_ID.AUTH,
            type: 'AUTH',
            name: ConstantsUtil$3.CONNECTOR_NAMES.AUTH,
            provider: authProvider,
            imageId: PresetsUtil.ConnectorImageIds[ConstantsUtil$3.CONNECTOR_ID.AUTH],
            chain: this.namespace,
            chains: []
        });
    }
    /**
     * Adds one or more connectors to the available connectors list.
     * @param {...Connector} connectors - The connectors to add
     */
    addConnector(...connectors) {
        const connectorsAdded = new Set();
        this.availableConnectors = [...connectors, ...this.availableConnectors].filter(connector => {
            if (connectorsAdded.has(connector.id)) {
                return false;
            }
            connectorsAdded.add(connector.id);
            return true;
        });
        this.emit('connectors', this.availableConnectors);
    }
    setStatus(status, chainNamespace) {
        AccountController.setStatus(status, chainNamespace);
    }
    /**
     * Adds an event listener for a specific event.
     * @template T
     * @param {T} eventName - The name of the event
     * @param {EventCallback<T>} callback - The callback function to be called when the event is emitted
     */
    on(eventName, callback) {
        if (!this.eventListeners.has(eventName)) {
            this.eventListeners.set(eventName, new Set());
        }
        this.eventListeners.get(eventName)?.add(callback);
    }
    /**
     * Removes an event listener for a specific event.
     * @template T
     * @param {T} eventName - The name of the event
     * @param {EventCallback<T>} callback - The callback function to be removed
     */
    off(eventName, callback) {
        const listeners = this.eventListeners.get(eventName);
        if (listeners) {
            listeners.delete(callback);
        }
    }
    /**
     * Removes all event listeners.
     */
    removeAllEventListeners() {
        this.eventListeners.forEach(listeners => {
            listeners.clear();
        });
    }
    /**
     * Emits an event with the given name and optional data.
     * @template T
     * @param {T} eventName - The name of the event to emit
     * @param {EventData[T]} [data] - The optional data to be passed to the event listeners
     */
    emit(eventName, data) {
        const listeners = this.eventListeners.get(eventName);
        if (listeners) {
            listeners.forEach(callback => callback(data));
        }
    }
    /**
     * Connects to WalletConnect.
     * @param {number | string} [_chainId] - Optional chain ID to connect to
     */
    async connectWalletConnect(_chainId) {
        const connector = this.getWalletConnectConnector();
        const result = await connector.connectWalletConnect();
        return { clientId: result.clientId };
    }
    /**
     * Switches the network.
     * @param {AdapterBlueprint.SwitchNetworkParams} params - Network switching parameters
     */
    async switchNetwork(params) {
        const { caipNetwork, providerType } = params;
        if (!params.provider) {
            return;
        }
        const provider = 'provider' in params.provider ? params.provider.provider : params.provider;
        if (providerType === 'WALLET_CONNECT') {
            provider.setDefaultChain(caipNetwork.caipNetworkId);
            return;
        }
        if (provider && providerType === 'AUTH') {
            const authProvider = provider;
            const preferredAccountType = AccountController.state.preferredAccountTypes?.[caipNetwork.chainNamespace];
            await authProvider.switchNetwork(caipNetwork.caipNetworkId);
            const user = await authProvider.getUser({
                chainId: caipNetwork.caipNetworkId,
                preferredAccountType
            });
            this.emit('switchNetwork', user);
        }
    }
    getWalletConnectConnector() {
        const connector = this.connectors.find(c => c instanceof WalletConnectConnector);
        if (!connector) {
            throw new Error('WalletConnectConnector not found');
        }
        return connector;
    }
}

class UniversalAdapter extends AdapterBlueprint {
    setUniversalProvider(universalProvider) {
        this.addConnector(new WalletConnectConnector({
            provider: universalProvider,
            caipNetworks: this.getCaipNetworks(),
            namespace: this.namespace
        }));
    }
    async connect(params) {
        return Promise.resolve({
            id: 'WALLET_CONNECT',
            type: 'WALLET_CONNECT',
            chainId: Number(params.chainId),
            provider: this.provider,
            address: ''
        });
    }
    async disconnect() {
        try {
            const connector = this.getWalletConnectConnector();
            await connector.disconnect();
        }
        catch (error) {
            console.warn('UniversalAdapter:disconnect - error', error);
        }
    }
    async getAccounts({ namespace }) {
        const provider = this.provider;
        const addresses = (provider?.session?.namespaces?.[namespace]?.accounts
            ?.map(account => {
            const [, , address] = account.split(':');
            return address;
        })
            .filter((address, index, self) => self.indexOf(address) === index) || []);
        return Promise.resolve({
            accounts: addresses.map(address => CoreHelperUtil.createAccount(namespace, address, namespace === 'bip122' ? 'payment' : 'eoa'))
        });
    }
    async syncConnectors() {
        return Promise.resolve();
    }
    async getBalance(params) {
        const isBalanceSupported = params.caipNetwork &&
            ConstantsUtil$2.BALANCE_SUPPORTED_CHAINS.includes(params.caipNetwork?.chainNamespace);
        if (!isBalanceSupported || params.caipNetwork?.testnet) {
            return {
                balance: '0.00',
                symbol: params.caipNetwork?.nativeCurrency.symbol || ''
            };
        }
        if (AccountController.state.balanceLoading &&
            params.chainId === ChainController.state.activeCaipNetwork?.id) {
            return {
                balance: AccountController.state.balance || '0.00',
                symbol: AccountController.state.balanceSymbol || ''
            };
        }
        const balances = await AccountController.fetchTokenBalance();
        const balance = balances.find(b => b.chainId === `${params.caipNetwork?.chainNamespace}:${params.chainId}` &&
            b.symbol === params.caipNetwork?.nativeCurrency.symbol);
        return {
            balance: balance?.quantity.numeric || '0.00',
            symbol: balance?.symbol || params.caipNetwork?.nativeCurrency.symbol || ''
        };
    }
    async signMessage(params) {
        const { provider, message, address } = params;
        if (!provider) {
            throw new Error('UniversalAdapter:signMessage - provider is undefined');
        }
        let signature = '';
        if (ChainController.state.activeCaipNetwork?.chainNamespace === ConstantsUtil$3.CHAIN.SOLANA) {
            const response = await provider.request({
                method: 'solana_signMessage',
                params: {
                    message: bs58.encode(new TextEncoder().encode(message)),
                    pubkey: address
                }
            }, ChainController.state.activeCaipNetwork?.caipNetworkId);
            signature = response.signature;
        }
        else {
            signature = await provider.request({
                method: 'personal_sign',
                params: [message, address]
            }, ChainController.state.activeCaipNetwork?.caipNetworkId);
        }
        return { signature };
    }
    // -- Transaction methods ---------------------------------------------------
    /**
     *
     * These methods are supported only on `wagmi` and `ethers` since the Solana SDK does not support them in the same way.
     * These function definition is to have a type parity between the clients. Currently not in use.
     */
    async estimateGas() {
        return Promise.resolve({
            gas: BigInt(0)
        });
    }
    async sendTransaction() {
        return Promise.resolve({
            hash: ''
        });
    }
    walletGetAssets(_params) {
        return Promise.resolve({});
    }
    async writeContract() {
        return Promise.resolve({
            hash: ''
        });
    }
    parseUnits() {
        return 0n;
    }
    formatUnits() {
        return '0';
    }
    async getCapabilities() {
        return Promise.resolve({});
    }
    async grantPermissions() {
        return Promise.resolve({});
    }
    async revokePermissions() {
        return Promise.resolve('0x');
    }
    async syncConnection() {
        return Promise.resolve({
            id: 'WALLET_CONNECT',
            type: 'WALLET_CONNECT',
            chainId: 1,
            provider: this.provider,
            address: ''
        });
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async switchNetwork(params) {
        const { caipNetwork } = params;
        const connector = this.getWalletConnectConnector();
        if (caipNetwork.chainNamespace === ConstantsUtil$3.CHAIN.EVM) {
            try {
                await connector.provider?.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: toHex(caipNetwork.id) }]
                });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (switchError) {
                if (switchError.code === WcConstantsUtil.ERROR_CODE_UNRECOGNIZED_CHAIN_ID ||
                    switchError.code === WcConstantsUtil.ERROR_INVALID_CHAIN_ID ||
                    switchError.code === WcConstantsUtil.ERROR_CODE_DEFAULT ||
                    switchError?.data?.originalError?.code ===
                        WcConstantsUtil.ERROR_CODE_UNRECOGNIZED_CHAIN_ID) {
                    try {
                        await connector.provider?.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: toHex(caipNetwork.id),
                                    rpcUrls: [caipNetwork?.rpcUrls['chainDefault']?.http],
                                    chainName: caipNetwork.name,
                                    nativeCurrency: caipNetwork.nativeCurrency,
                                    blockExplorerUrls: [caipNetwork.blockExplorers?.default.url]
                                }
                            ]
                        });
                    }
                    catch (error) {
                        throw new Error('Chain is not supported');
                    }
                }
            }
        }
        connector.provider.setDefaultChain(caipNetwork.caipNetworkId);
    }
    getWalletConnectProvider() {
        const connector = this.connectors.find(c => c.type === 'WALLET_CONNECT');
        const provider = connector?.provider;
        return provider;
    }
}

const FEATURE_KEYS = [
    'email',
    'socials',
    'swaps',
    'onramp',
    'activity',
    'reownBranding'
];
const featureConfig = {
    email: {
        apiFeatureName: 'social_login',
        localFeatureName: 'email',
        returnType: false,
        isLegacy: false,
        isAvailableOnBasic: false,
        processApi: (apiConfig) => {
            if (!apiConfig?.config) {
                return false;
            }
            const config = apiConfig.config;
            return Boolean(apiConfig.isEnabled) && config.includes('email');
        },
        processFallback: (localValue) => {
            if (localValue === undefined) {
                return ConstantsUtil$2.DEFAULT_REMOTE_FEATURES.email;
            }
            return Boolean(localValue);
        }
    },
    socials: {
        apiFeatureName: 'social_login',
        localFeatureName: 'socials',
        returnType: false,
        isLegacy: false,
        isAvailableOnBasic: false,
        processApi: (apiConfig) => {
            if (!apiConfig?.config) {
                return false;
            }
            const config = apiConfig.config;
            return Boolean(apiConfig.isEnabled) && config.length > 0
                ? config.filter((s) => s !== 'email')
                : false;
        },
        processFallback: (localValue) => {
            if (localValue === undefined) {
                return ConstantsUtil$2.DEFAULT_REMOTE_FEATURES.socials;
            }
            if (typeof localValue === 'boolean') {
                return localValue ? ConstantsUtil$2.DEFAULT_REMOTE_FEATURES.socials : false;
            }
            return localValue;
        }
    },
    swaps: {
        apiFeatureName: 'swap',
        localFeatureName: 'swaps',
        returnType: false,
        isLegacy: false,
        isAvailableOnBasic: false,
        processApi: (apiConfig) => {
            if (!apiConfig?.config) {
                return false;
            }
            const config = apiConfig.config;
            return Boolean(apiConfig.isEnabled) && config.length > 0 ? config : false;
        },
        processFallback: (localValue) => {
            if (localValue === undefined) {
                return ConstantsUtil$2.DEFAULT_REMOTE_FEATURES.swaps;
            }
            if (typeof localValue === 'boolean') {
                return localValue ? ConstantsUtil$2.DEFAULT_REMOTE_FEATURES.swaps : false;
            }
            return localValue;
        }
    },
    onramp: {
        apiFeatureName: 'onramp',
        localFeatureName: 'onramp',
        returnType: false,
        isLegacy: false,
        isAvailableOnBasic: false,
        processApi: (apiConfig) => {
            if (!apiConfig?.config) {
                return false;
            }
            const config = apiConfig.config;
            return Boolean(apiConfig.isEnabled) && config.length > 0 ? config : false;
        },
        processFallback: (localValue) => {
            if (localValue === undefined) {
                return ConstantsUtil$2.DEFAULT_REMOTE_FEATURES.onramp;
            }
            if (typeof localValue === 'boolean') {
                return localValue ? ConstantsUtil$2.DEFAULT_REMOTE_FEATURES.onramp : false;
            }
            return localValue;
        }
    },
    activity: {
        apiFeatureName: 'activity',
        localFeatureName: 'history',
        returnType: false,
        isLegacy: true,
        isAvailableOnBasic: false,
        processApi: (apiConfig) => Boolean(apiConfig.isEnabled),
        processFallback: (localValue) => {
            if (localValue === undefined) {
                return ConstantsUtil$2.DEFAULT_REMOTE_FEATURES.activity;
            }
            return Boolean(localValue);
        }
    },
    reownBranding: {
        apiFeatureName: 'reown_branding',
        localFeatureName: 'reownBranding',
        returnType: false,
        isLegacy: false,
        isAvailableOnBasic: false,
        processApi: (apiConfig) => Boolean(apiConfig.isEnabled),
        processFallback: (localValue) => {
            if (localValue === undefined) {
                return ConstantsUtil$2.DEFAULT_REMOTE_FEATURES.reownBranding;
            }
            return Boolean(localValue);
        }
    }
};
const ConfigUtil = {
    localSettingsOverridden: new Set(),
    getApiConfig(id, apiProjectConfig) {
        return apiProjectConfig?.find((f) => f.id === id);
    },
    addWarning(localFeatureValue, featureKey) {
        if (localFeatureValue !== undefined) {
            const config = featureConfig[featureKey];
            const warningName = config.isLegacy
                ? `"features.${config.localFeatureName}" (now "${featureKey}")`
                : `"features.${featureKey}"`;
            this.localSettingsOverridden.add(warningName);
        }
    },
    processFeature(featureKey, localFeatures, apiProjectConfig, useApi, isBasic) {
        const config = featureConfig[featureKey];
        const localValue = localFeatures[config.localFeatureName];
        if (isBasic && !config.isAvailableOnBasic) {
            return false;
        }
        if (useApi) {
            const apiConfig = this.getApiConfig(config.apiFeatureName, apiProjectConfig);
            if (apiConfig?.config === null) {
                return this.processFallbackFeature(featureKey, localValue);
            }
            if (!apiConfig?.config) {
                return false;
            }
            if (localValue !== undefined) {
                this.addWarning(localValue, featureKey);
            }
            return this.processApiFeature(featureKey, apiConfig);
        }
        return this.processFallbackFeature(featureKey, localValue);
    },
    processApiFeature(featureKey, apiConfig) {
        return featureConfig[featureKey].processApi(apiConfig);
    },
    processFallbackFeature(featureKey, localValue) {
        return featureConfig[featureKey].processFallback(localValue);
    },
    async fetchRemoteFeatures(config) {
        const isBasic = config.basic ?? false;
        const localFeatures = config.features || {};
        this.localSettingsOverridden.clear();
        let apiProjectConfig = null;
        let useApiConfig = false;
        try {
            apiProjectConfig = await ApiController.fetchProjectConfig();
            useApiConfig = apiProjectConfig !== null && apiProjectConfig !== undefined;
        }
        catch (e) {
            console.warn('[Reown Config] Failed to fetch remote project configuration. Using local/default values.', e);
        }
        const remoteFeaturesConfig = useApiConfig && !isBasic
            ? ConstantsUtil$2.DEFAULT_REMOTE_FEATURES
            : ConstantsUtil$2.DEFAULT_REMOTE_FEATURES_DISABLED;
        try {
            for (const featureKey of FEATURE_KEYS) {
                const result = this.processFeature(featureKey, localFeatures, apiProjectConfig, useApiConfig, isBasic);
                Object.assign(remoteFeaturesConfig, { [featureKey]: result });
            }
        }
        catch (e) {
            console.warn('[Reown Config] Failed to process the configuration from Cloud. Using default values.', e);
            return ConstantsUtil$2.DEFAULT_REMOTE_FEATURES;
        }
        if (useApiConfig && this.localSettingsOverridden.size > 0) {
            const warningMessage = `Your local configuration for ${Array.from(this.localSettingsOverridden).join(', ')} was ignored because a remote configuration was successfully fetched. Please manage these features via your project dashboard on dashboard.reown.com.`;
            AlertController.open({
                shortMessage: 'Local configuration ignored',
                longMessage: `[Reown Config Notice] ${warningMessage}`
            }, 'warning');
        }
        return remoteFeaturesConfig;
    }
};

class AppKitBaseClient {
    constructor(options) {
        this.chainNamespaces = [];
        this.remoteFeatures = {};
        this.reportedAlertErrors = {};
        // -- Public Internal ---------------------------------------------------
        this.getCaipNetwork = (chainNamespace, id) => {
            if (chainNamespace) {
                const caipNetworkWithId = ChainController.getNetworkData(chainNamespace)?.requestedCaipNetworks?.find(c => c.id === id);
                if (caipNetworkWithId) {
                    return caipNetworkWithId;
                }
                const namespaceCaipNetwork = ChainController.getNetworkData(chainNamespace)?.caipNetwork;
                if (namespaceCaipNetwork) {
                    return namespaceCaipNetwork;
                }
                const requestedCaipNetworks = ChainController.getRequestedCaipNetworks(chainNamespace);
                return requestedCaipNetworks.filter(c => c.chainNamespace === chainNamespace)?.[0];
            }
            return ChainController.state.activeCaipNetwork || this.defaultCaipNetwork;
        };
        this.getCaipNetworkId = () => {
            const network = this.getCaipNetwork();
            if (network) {
                return network.id;
            }
            return undefined;
        };
        this.getCaipNetworks = (namespace) => ChainController.getCaipNetworks(namespace);
        this.getActiveChainNamespace = () => ChainController.state.activeChain;
        this.setRequestedCaipNetworks = (requestedCaipNetworks, chain) => {
            ChainController.setRequestedCaipNetworks(requestedCaipNetworks, chain);
        };
        this.getApprovedCaipNetworkIds = () => ChainController.getAllApprovedCaipNetworkIds();
        this.getCaipAddress = (chainNamespace) => {
            if (ChainController.state.activeChain === chainNamespace || !chainNamespace) {
                return ChainController.state.activeCaipAddress;
            }
            return ChainController.getAccountProp('caipAddress', chainNamespace);
        };
        this.setClientId = clientId => {
            BlockchainApiController.setClientId(clientId);
        };
        this.getProvider = (namespace) => ProviderUtil.getProvider(namespace);
        this.getProviderType = (namespace) => ProviderUtil.getProviderId(namespace);
        this.getPreferredAccountType = (namespace) => AccountController.state.preferredAccountTypes?.[namespace];
        this.setCaipAddress = (caipAddress, chain) => {
            AccountController.setCaipAddress(caipAddress, chain);
            /**
             * For the embedded use cases (Demo app), we should call close() when the user is connected to redirect them to Account View.
             */
            if (caipAddress && OptionsController.state.enableEmbedded) {
                this.close();
            }
        };
        this.setBalance = (balance, balanceSymbol, chain) => {
            AccountController.setBalance(balance, balanceSymbol, chain);
        };
        this.setProfileName = (profileName, chain) => {
            AccountController.setProfileName(profileName, chain);
        };
        this.setProfileImage = (profileImage, chain) => {
            AccountController.setProfileImage(profileImage, chain);
        };
        this.setUser = (user, chain) => {
            AccountController.setUser(user, chain);
        };
        this.resetAccount = (chain) => {
            AccountController.resetAccount(chain);
        };
        this.setCaipNetwork = caipNetwork => {
            ChainController.setActiveCaipNetwork(caipNetwork);
        };
        this.setCaipNetworkOfNamespace = (caipNetwork, chainNamespace) => {
            ChainController.setChainNetworkData(chainNamespace, { caipNetwork });
        };
        this.setAllAccounts = (addresses, chain) => {
            AccountController.setAllAccounts(addresses, chain);
            OptionsController.setHasMultipleAddresses(addresses?.length > 1);
        };
        this.setStatus = (status, chain) => {
            AccountController.setStatus(status, chain);
            // If at least one namespace is connected, set the connection status
            if (ConnectorController.isConnected()) {
                StorageUtil.setConnectionStatus('connected');
            }
            else {
                StorageUtil.setConnectionStatus('disconnected');
            }
        };
        this.getAddressByChainNamespace = (chainNamespace) => ChainController.getAccountProp('address', chainNamespace);
        this.setConnectors = connectors => {
            const allConnectors = [...ConnectorController.state.allConnectors, ...connectors];
            ConnectorController.setConnectors(allConnectors);
        };
        this.setConnections = (connections, chainNamespace) => {
            ConnectionController.setConnections(connections, chainNamespace);
        };
        this.fetchIdentity = request => BlockchainApiController.fetchIdentity(request);
        this.getReownName = address => EnsController.getNamesForAddress(address);
        this.getConnectors = () => ConnectorController.getConnectors();
        this.getConnectorImage = connector => AssetUtil.getConnectorImage(connector);
        this.setConnectedWalletInfo = (connectedWalletInfo, chain) => {
            const type = ProviderUtil.getProviderId(chain);
            const walletInfo = connectedWalletInfo ? { ...connectedWalletInfo, type } : undefined;
            AccountController.setConnectedWalletInfo(walletInfo, chain);
        };
        this.getIsConnectedState = () => Boolean(ChainController.state.activeCaipAddress);
        this.addAddressLabel = (address, label, chain) => {
            AccountController.addAddressLabel(address, label, chain);
        };
        this.removeAddressLabel = (address, chain) => {
            AccountController.removeAddressLabel(address, chain);
        };
        this.getAddress = (chainNamespace) => {
            if (ChainController.state.activeChain === chainNamespace || !chainNamespace) {
                return AccountController.state.address;
            }
            return ChainController.getAccountProp('address', chainNamespace);
        };
        this.setApprovedCaipNetworksData = namespace => ChainController.setApprovedCaipNetworksData(namespace);
        this.resetNetwork = (namespace) => {
            ChainController.resetNetwork(namespace);
        };
        this.addConnector = connector => {
            ConnectorController.addConnector(connector);
        };
        this.resetWcConnection = () => {
            ConnectionController.resetWcConnection();
        };
        this.setAddressExplorerUrl = (addressExplorerUrl, chain) => {
            AccountController.setAddressExplorerUrl(addressExplorerUrl, chain);
        };
        this.setSmartAccountDeployed = (isDeployed, chain) => {
            AccountController.setSmartAccountDeployed(isDeployed, chain);
        };
        this.setSmartAccountEnabledNetworks = (smartAccountEnabledNetworks, chain) => {
            ChainController.setSmartAccountEnabledNetworks(smartAccountEnabledNetworks, chain);
        };
        this.setPreferredAccountType = (preferredAccountType, chain) => {
            AccountController.setPreferredAccountType(preferredAccountType, chain);
        };
        this.setEIP6963Enabled = enabled => {
            OptionsController.setEIP6963Enabled(enabled);
        };
        this.handleUnsafeRPCRequest = () => {
            if (this.isOpen()) {
                // If we are on the modal but there is no transaction stack, close the modal
                if (this.isTransactionStackEmpty()) {
                    return;
                }
                // Check if we need to replace or redirect
                this.redirect('ApproveTransaction');
            }
            else {
                // If called from outside the modal, open ApproveTransaction
                this.open({ view: 'ApproveTransaction' });
            }
        };
        this.options = options;
        this.version = options.sdkVersion;
        this.caipNetworks = this.extendCaipNetworks(options);
        this.chainNamespaces = this.getChainNamespacesSet(options.adapters, this.caipNetworks);
        this.defaultCaipNetwork = this.extendDefaultCaipNetwork(options);
        this.chainAdapters = this.createAdapters(options.adapters);
        this.readyPromise = this.initialize(options);
    }
    getChainNamespacesSet(adapters, caipNetworks) {
        const adapterNamespaces = adapters
            ?.map(adapter => adapter.namespace)
            .filter((namespace) => Boolean(namespace));
        if (adapterNamespaces?.length) {
            return [...new Set(adapterNamespaces)];
        }
        const networkNamespaces = caipNetworks?.map(network => network.chainNamespace);
        return [...new Set(networkNamespaces)];
    }
    async initialize(options) {
        this.initializeProjectSettings(options);
        this.initControllers(options);
        await this.initChainAdapters();
        this.sendInitializeEvent(options);
        await this.syncExistingConnection();
        this.remoteFeatures = await ConfigUtil.fetchRemoteFeatures(options);
        OptionsController.setRemoteFeatures(this.remoteFeatures);
        if (this.remoteFeatures.onramp) {
            OnRampController.setOnrampProviders(this.remoteFeatures.onramp);
        }
        // Check allowed origins only if email or social features are enabled
        if (OptionsController.state.remoteFeatures?.email ||
            (Array.isArray(OptionsController.state.remoteFeatures?.socials) &&
                OptionsController.state.remoteFeatures?.socials.length > 0)) {
            await this.checkAllowedOrigins();
        }
    }
    async checkAllowedOrigins() {
        const allowedOrigins = await ApiController.fetchAllowedOrigins();
        if (allowedOrigins && CoreHelperUtil.isClient()) {
            const currentOrigin = window.location.origin;
            const isOriginAllowed = WcHelpersUtil.isOriginAllowed(currentOrigin, allowedOrigins, WcConstantsUtil.DEFAULT_ALLOWED_ANCESTORS);
            if (!isOriginAllowed) {
                AlertController.open(ErrorUtil.ALERT_ERRORS.INVALID_APP_CONFIGURATION, 'error');
            }
        }
        else {
            AlertController.open(ErrorUtil.ALERT_ERRORS.PROJECT_ID_NOT_CONFIGURED, 'error');
        }
    }
    sendInitializeEvent(options) {
        const { ...optionsCopy } = options;
        delete optionsCopy.adapters;
        delete optionsCopy.universalProvider;
        EventsController.sendEvent({
            type: 'track',
            event: 'INITIALIZE',
            properties: {
                ...optionsCopy,
                networks: options.networks.map(n => n.id),
                siweConfig: {
                    options: options.siweConfig?.options || {}
                }
            }
        });
    }
    // -- Controllers initialization ---------------------------------------------------
    initControllers(options) {
        this.initializeOptionsController(options);
        this.initializeChainController(options);
        this.initializeThemeController(options);
        this.initializeConnectionController(options);
        this.initializeConnectorController();
    }
    initializeThemeController(options) {
        if (options.themeMode) {
            ThemeController.setThemeMode(options.themeMode);
        }
        if (options.themeVariables) {
            ThemeController.setThemeVariables(options.themeVariables);
        }
    }
    initializeChainController(options) {
        if (!this.connectionControllerClient || !this.networkControllerClient) {
            throw new Error('ConnectionControllerClient and NetworkControllerClient must be set');
        }
        ChainController.initialize(options.adapters ?? [], this.caipNetworks, {
            connectionControllerClient: this.connectionControllerClient,
            networkControllerClient: this.networkControllerClient
        });
        const network = this.getDefaultNetwork();
        if (network) {
            ChainController.setActiveCaipNetwork(network);
        }
    }
    initializeConnectionController(options) {
        ConnectionController.setWcBasic(options.basic ?? false);
    }
    initializeConnectorController() {
        ConnectorController.initialize(this.chainNamespaces);
    }
    initializeProjectSettings(options) {
        OptionsController.setProjectId(options.projectId);
        OptionsController.setSdkVersion(options.sdkVersion);
    }
    initializeOptionsController(options) {
        OptionsController.setDebug(options.debug !== false);
        // On by default
        OptionsController.setEnableWalletConnect(options.enableWalletConnect !== false);
        OptionsController.setEnableWalletGuide(options.enableWalletGuide !== false);
        OptionsController.setEnableWallets(options.enableWallets !== false);
        OptionsController.setEIP6963Enabled(options.enableEIP6963 !== false);
        OptionsController.setEnableNetworkSwitch(options.enableNetworkSwitch !== false);
        OptionsController.setEnableAuthLogger(options.enableAuthLogger !== false);
        OptionsController.setCustomRpcUrls(options.customRpcUrls);
        OptionsController.setEnableEmbedded(options.enableEmbedded);
        OptionsController.setAllWallets(options.allWallets);
        OptionsController.setIncludeWalletIds(options.includeWalletIds);
        OptionsController.setExcludeWalletIds(options.excludeWalletIds);
        OptionsController.setFeaturedWalletIds(options.featuredWalletIds);
        OptionsController.setTokens(options.tokens);
        OptionsController.setTermsConditionsUrl(options.termsConditionsUrl);
        OptionsController.setPrivacyPolicyUrl(options.privacyPolicyUrl);
        OptionsController.setCustomWallets(options.customWallets);
        OptionsController.setFeatures(options.features);
        OptionsController.setAllowUnsupportedChain(options.allowUnsupportedChain);
        OptionsController.setUniversalProviderConfigOverride(options.universalProviderConfigOverride);
        OptionsController.setPreferUniversalLinks(options.experimental_preferUniversalLinks);
        // Save option in controller
        OptionsController.setDefaultAccountTypes(options.defaultAccountTypes);
        // Get stored account types
        const storedAccountTypes = StorageUtil.getPreferredAccountTypes() || {};
        const defaultTypes = { ...OptionsController.state.defaultAccountTypes, ...storedAccountTypes };
        AccountController.setPreferredAccountTypes(defaultTypes);
        const defaultMetaData = this.getDefaultMetaData();
        if (!options.metadata && defaultMetaData) {
            options.metadata = defaultMetaData;
        }
        OptionsController.setMetadata(options.metadata);
        OptionsController.setDisableAppend(options.disableAppend);
        OptionsController.setEnableEmbedded(options.enableEmbedded);
        OptionsController.setSIWX(options.siwx);
        if (!options.projectId) {
            AlertController.open(ErrorUtil.ALERT_ERRORS.PROJECT_ID_NOT_CONFIGURED, 'error');
            return;
        }
        const evmAdapter = options.adapters?.find(adapter => adapter.namespace === ConstantsUtil$3.CHAIN.EVM);
        // Set the SIWE client for EVM chains
        if (evmAdapter) {
            if (options.siweConfig) {
                if (options.siwx) {
                    throw new Error('Cannot set both `siweConfig` and `siwx` options');
                }
                OptionsController.setSIWX(options.siweConfig.mapToSIWX());
            }
        }
    }
    getDefaultMetaData() {
        if (CoreHelperUtil.isClient()) {
            return {
                name: document.getElementsByTagName('title')?.[0]?.textContent || '',
                description: document.querySelector('meta[property="og:description"]')?.content || '',
                url: window.location.origin,
                icons: [document.querySelector('link[rel~="icon"]')?.href || '']
            };
        }
        return null;
    }
    // -- Network Initialization ---------------------------------------------------
    setUnsupportedNetwork(chainId) {
        const namespace = this.getActiveChainNamespace();
        if (namespace) {
            const unsupportedNetwork = CaipNetworksUtil.getUnsupportedNetwork(`${namespace}:${chainId}`);
            ChainController.setActiveCaipNetwork(unsupportedNetwork);
        }
    }
    getDefaultNetwork() {
        return CaipNetworksUtil.getCaipNetworkFromStorage(this.defaultCaipNetwork);
    }
    extendCaipNetwork(network, options) {
        const extendedNetwork = CaipNetworksUtil.extendCaipNetwork(network, {
            customNetworkImageUrls: options.chainImages,
            projectId: options.projectId
        });
        return extendedNetwork;
    }
    extendCaipNetworks(options) {
        const extendedNetworks = CaipNetworksUtil.extendCaipNetworks(options.networks, {
            customNetworkImageUrls: options.chainImages,
            customRpcUrls: options.customRpcUrls,
            projectId: options.projectId
        });
        return extendedNetworks;
    }
    extendDefaultCaipNetwork(options) {
        const defaultNetwork = options.networks.find(n => n.id === options.defaultNetwork?.id);
        const extendedNetwork = defaultNetwork
            ? CaipNetworksUtil.extendCaipNetwork(defaultNetwork, {
                customNetworkImageUrls: options.chainImages,
                customRpcUrls: options.customRpcUrls,
                projectId: options.projectId
            })
            : undefined;
        return extendedNetwork;
    }
    async disconnectNamespace(namespace) {
        try {
            const adapter = this.getAdapter(namespace);
            const provider = ProviderUtil.getProvider(namespace);
            const providerType = ProviderUtil.getProviderId(namespace);
            const { caipAddress } = ChainController.getAccountData(namespace) || {};
            this.setLoading(true, namespace);
            if (caipAddress && adapter?.disconnect) {
                await adapter.disconnect({ provider, providerType });
            }
            StorageUtil.removeConnectedNamespace(namespace);
            ProviderUtil.resetChain(namespace);
            this.setUser(undefined, namespace);
            this.setStatus('disconnected', namespace);
            this.setConnectedWalletInfo(undefined, namespace);
            ConnectorController.removeConnectorId(namespace);
            ChainController.resetAccount(namespace);
            ChainController.resetNetwork(namespace);
            this.setLoading(false, namespace);
        }
        catch (error) {
            this.setLoading(false, namespace);
            throw new Error(`Failed to disconnect chain ${namespace}: ${error.message}`);
        }
    }
    // -- Client Initialization ---------------------------------------------------
    createClients() {
        this.connectionControllerClient = {
            connectWalletConnect: async () => {
                const activeChain = ChainController.state.activeChain;
                const adapter = this.getAdapter(activeChain);
                const chainId = this.getCaipNetwork(activeChain)?.id;
                if (!adapter) {
                    throw new Error('Adapter not found');
                }
                const result = await adapter.connectWalletConnect(chainId);
                this.close();
                this.setClientId(result?.clientId || null);
                StorageUtil.setConnectedNamespaces([...ChainController.state.chains.keys()]);
                this.chainNamespaces.forEach(namespace => {
                    ConnectorController.setConnectorId(ConstantsUtil$1.CONNECTOR_TYPE_WALLET_CONNECT, namespace);
                });
                await this.syncWalletConnectAccount();
            },
            connectExternal: async ({ id, info, type, provider, chain, caipNetwork, socialUri }) => {
                const activeChain = ChainController.state.activeChain;
                const chainToUse = chain || activeChain;
                const adapter = this.getAdapter(chainToUse);
                if (chain && chain !== activeChain && !caipNetwork) {
                    const toConnectNetwork = this.getCaipNetworks().find(network => network.chainNamespace === chain);
                    if (toConnectNetwork) {
                        this.setCaipNetwork(toConnectNetwork);
                    }
                }
                if (!adapter) {
                    throw new Error('Adapter not found');
                }
                const fallbackCaipNetwork = this.getCaipNetwork(chainToUse);
                const res = await adapter.connect({
                    id,
                    info,
                    type,
                    provider,
                    socialUri,
                    chainId: caipNetwork?.id || fallbackCaipNetwork?.id,
                    rpcUrl: caipNetwork?.rpcUrls?.default?.http?.[0] ||
                        fallbackCaipNetwork?.rpcUrls?.default?.http?.[0]
                });
                if (!res) {
                    return;
                }
                StorageUtil.addConnectedNamespace(chainToUse);
                this.syncProvider({ ...res, chainNamespace: chainToUse });
                /*
                 * SyncAllAccounts already set the accounts in the state
                 * and its more efficient to use the stored accounts rather than fetching them again
                 */
                const syncedAccounts = AccountController.state.allAccounts;
                const { accounts } = syncedAccounts?.length > 0
                    ? // eslint-disable-next-line line-comment-position
                        // Using new array else the accounts will have the same reference and react will not re-render
                        { accounts: [...syncedAccounts] }
                    : await adapter.getAccounts({ namespace: chainToUse, id });
                this.setAllAccounts(accounts, chainToUse);
                this.setStatus('connected', chainToUse);
                this.syncConnectedWalletInfo(chainToUse);
            },
            reconnectExternal: async ({ id, info, type, provider }) => {
                const namespace = ChainController.state.activeChain;
                const adapter = this.getAdapter(namespace);
                if (adapter?.reconnect) {
                    await adapter?.reconnect({ id, info, type, provider, chainId: this.getCaipNetwork()?.id });
                    StorageUtil.addConnectedNamespace(namespace);
                    this.syncConnectedWalletInfo(namespace);
                }
            },
            disconnect: async (chainNamespace) => {
                const chainsToDisconnect = getChainsToDisconnect(chainNamespace);
                try {
                    // Reset send state when disconnecting
                    const disconnectResults = await Promise.allSettled(chainsToDisconnect.map(async ([ns]) => this.disconnectNamespace(ns)));
                    SendController.resetSend();
                    ConnectionController.resetWcConnection();
                    await SIWXUtil.clearSessions();
                    ConnectorController.setFilterByNamespace(undefined);
                    const failures = disconnectResults.filter((result) => result.status === 'rejected');
                    if (failures.length > 0) {
                        throw new Error(failures.map(f => f.reason.message).join(', '));
                    }
                    StorageUtil.deleteConnectedSocialProvider();
                    EventsController.sendEvent({
                        type: 'track',
                        event: 'DISCONNECT_SUCCESS',
                        properties: {
                            namespace: chainNamespace || 'all'
                        }
                    });
                }
                catch (error) {
                    throw new Error(`Failed to disconnect chains: ${error.message}`);
                }
            },
            checkInstalled: (ids) => {
                if (!ids) {
                    return Boolean(window.ethereum);
                }
                return ids.some(id => Boolean(window.ethereum?.[String(id)]));
            },
            signMessage: async (message) => {
                const adapter = this.getAdapter(ChainController.state.activeChain);
                const result = await adapter?.signMessage({
                    message,
                    address: AccountController.state.address,
                    provider: ProviderUtil.getProvider(ChainController.state.activeChain)
                });
                return result?.signature || '';
            },
            sendTransaction: async (args) => {
                const namespace = args.chainNamespace;
                if (ConstantsUtil$2.SEND_SUPPORTED_NAMESPACES.includes(namespace)) {
                    const adapter = this.getAdapter(ChainController.state.activeChain);
                    const provider = ProviderUtil.getProvider(namespace);
                    const result = await adapter?.sendTransaction({
                        ...args,
                        caipNetwork: this.getCaipNetwork(),
                        provider
                    });
                    return result?.hash || '';
                }
                return '';
            },
            estimateGas: async (args) => {
                if (args.chainNamespace === ConstantsUtil$3.CHAIN.EVM) {
                    const adapter = this.getAdapter(ChainController.state.activeChain);
                    const provider = ProviderUtil.getProvider(ChainController.state.activeChain);
                    const caipNetwork = this.getCaipNetwork();
                    if (!caipNetwork) {
                        throw new Error('CaipNetwork is undefined');
                    }
                    const result = await adapter?.estimateGas({
                        ...args,
                        provider,
                        caipNetwork
                    });
                    return result?.gas || 0n;
                }
                return 0n;
            },
            getEnsAvatar: async () => {
                await this.syncIdentity({
                    address: AccountController.state.address,
                    chainId: Number(this.getCaipNetwork()?.id),
                    chainNamespace: ChainController.state.activeChain
                });
                return AccountController.state.profileImage || false;
            },
            getEnsAddress: async (name) => await WcHelpersUtil.resolveReownName(name),
            writeContract: async (args) => {
                const adapter = this.getAdapter(ChainController.state.activeChain);
                const caipNetwork = this.getCaipNetwork();
                const caipAddress = this.getCaipAddress();
                const provider = ProviderUtil.getProvider(ChainController.state.activeChain);
                if (!caipNetwork || !caipAddress) {
                    throw new Error('CaipNetwork or CaipAddress is undefined');
                }
                const result = await adapter?.writeContract({ ...args, caipNetwork, provider, caipAddress });
                return result?.hash;
            },
            parseUnits: (value, decimals) => {
                const adapter = this.getAdapter(ChainController.state.activeChain);
                return adapter?.parseUnits({ value, decimals }) ?? 0n;
            },
            formatUnits: (value, decimals) => {
                const adapter = this.getAdapter(ChainController.state.activeChain);
                return adapter?.formatUnits({ value, decimals }) ?? '0';
            },
            getCapabilities: async (params) => {
                const adapter = this.getAdapter(ChainController.state.activeChain);
                return await adapter?.getCapabilities(params);
            },
            grantPermissions: async (params) => {
                const adapter = this.getAdapter(ChainController.state.activeChain);
                return await adapter?.grantPermissions(params);
            },
            revokePermissions: async (params) => {
                const adapter = this.getAdapter(ChainController.state.activeChain);
                if (adapter?.revokePermissions) {
                    return await adapter.revokePermissions(params);
                }
                return '0x';
            },
            walletGetAssets: async (params) => {
                const adapter = this.getAdapter(ChainController.state.activeChain);
                return (await adapter?.walletGetAssets(params)) ?? {};
            },
            updateBalance: (namespace) => {
                const caipNetwork = this.getCaipNetwork(namespace);
                if (!caipNetwork || !AccountController.state.address) {
                    return;
                }
                this.updateNativeBalance(AccountController.state.address, caipNetwork?.id, namespace);
            }
        };
        this.networkControllerClient = {
            switchCaipNetwork: async (caipNetwork) => await this.switchCaipNetwork(caipNetwork),
            // eslint-disable-next-line @typescript-eslint/require-await
            getApprovedCaipNetworksData: async () => this.getApprovedCaipNetworksData()
        };
        ConnectionController.setClient(this.connectionControllerClient);
    }
    getApprovedCaipNetworksData() {
        const providerType = ProviderUtil.getProviderId(ChainController.state.activeChain);
        if (providerType === ConstantsUtil$1.CONNECTOR_TYPE_WALLET_CONNECT) {
            const namespaces = this.universalProvider?.session?.namespaces;
            return {
                /*
                 * MetaMask Wallet only returns 1 namespace in the session object. This makes it imposible
                 * to switch to other networks. Setting supportsAllNetworks to true for MetaMask Wallet
                 * will make it possible to switch to other networks.
                 */
                supportsAllNetworks: this.universalProvider?.session?.peer?.metadata.name === 'MetaMask Wallet',
                approvedCaipNetworkIds: this.getChainsFromNamespaces(namespaces)
            };
        }
        return { supportsAllNetworks: true, approvedCaipNetworkIds: [] };
    }
    async switchCaipNetwork(caipNetwork) {
        if (!caipNetwork) {
            return;
        }
        const networkNamespace = caipNetwork.chainNamespace;
        const namespaceAddress = this.getAddressByChainNamespace(caipNetwork.chainNamespace);
        if (namespaceAddress) {
            const provider = ProviderUtil.getProvider(networkNamespace);
            const providerType = ProviderUtil.getProviderId(networkNamespace);
            if (caipNetwork.chainNamespace === ChainController.state.activeChain) {
                const adapter = this.getAdapter(networkNamespace);
                await adapter?.switchNetwork({ caipNetwork, provider, providerType });
            }
            else {
                this.setCaipNetwork(caipNetwork);
                if (providerType === ConstantsUtil$1.CONNECTOR_TYPE_WALLET_CONNECT) {
                    this.syncWalletConnectAccount();
                }
                else {
                    const address = this.getAddressByChainNamespace(networkNamespace);
                    if (address) {
                        this.syncAccount({
                            address,
                            chainId: caipNetwork.id,
                            chainNamespace: networkNamespace
                        });
                    }
                }
            }
        }
        else {
            this.setCaipNetwork(caipNetwork);
        }
    }
    getChainsFromNamespaces(namespaces = {}) {
        return Object.values(namespaces).flatMap((namespace) => {
            const chains = (namespace.chains || []);
            const accountsChains = namespace.accounts.map(account => {
                const { chainId, chainNamespace } = ParseUtil.parseCaipAddress(account);
                return `${chainNamespace}:${chainId}`;
            });
            return Array.from(new Set([...chains, ...accountsChains]));
        });
    }
    // -- Adapter Initialization ---------------------------------------------------
    createAdapters(blueprints) {
        this.createClients();
        return this.chainNamespaces.reduce((adapters, namespace) => {
            const blueprint = blueprints?.find(b => b.namespace === namespace);
            if (blueprint) {
                blueprint.construct({
                    namespace,
                    projectId: this.options?.projectId,
                    networks: this.getCaipNetworks()
                });
                adapters[namespace] = blueprint;
            }
            else {
                adapters[namespace] = new UniversalAdapter({
                    namespace: namespace,
                    networks: this.getCaipNetworks()
                });
            }
            return adapters;
            // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
        }, {});
    }
    async initChainAdapter(namespace) {
        this.onConnectors(namespace);
        this.listenAdapter(namespace);
        await this.chainAdapters?.[namespace].syncConnectors(this.options, this);
        await this.createUniversalProviderForAdapter(namespace);
    }
    async initChainAdapters() {
        await Promise.all(this.chainNamespaces.map(async (namespace) => {
            await this.initChainAdapter(namespace);
        }));
    }
    onConnectors(chainNamespace) {
        const adapter = this.getAdapter(chainNamespace);
        adapter?.on('connectors', this.setConnectors.bind(this));
    }
    listenAdapter(chainNamespace) {
        const adapter = this.getAdapter(chainNamespace);
        if (!adapter) {
            return;
        }
        const connectionStatus = StorageUtil.getConnectionStatus();
        if (connectionStatus === 'connected') {
            this.setStatus('connecting', chainNamespace);
        }
        else if (connectionStatus === 'disconnected') {
            /*
             * Address cache is kept after disconnecting from the wallet
             * but should be cleared if appkit is launched in disconnected state
             */
            StorageUtil.clearAddressCache();
            this.setStatus(connectionStatus, chainNamespace);
        }
        else {
            this.setStatus(connectionStatus, chainNamespace);
        }
        adapter.on('switchNetwork', ({ address, chainId }) => {
            const caipNetwork = this.getCaipNetworks().find(n => n.id === chainId || n.caipNetworkId === chainId);
            const isSameNamespace = ChainController.state.activeChain === chainNamespace;
            const accountAddress = ChainController.getAccountProp('address', chainNamespace);
            if (caipNetwork) {
                const account = isSameNamespace && address ? address : accountAddress;
                if (account) {
                    this.syncAccount({ address: account, chainId: caipNetwork.id, chainNamespace });
                }
            }
            else {
                this.setUnsupportedNetwork(chainId);
            }
        });
        adapter.on('disconnect', this.disconnect.bind(this, chainNamespace));
        adapter.on('connections', connections => {
            this.setConnections(connections, chainNamespace);
        });
        adapter.on('pendingTransactions', () => {
            const address = AccountController.state.address;
            const activeCaipNetwork = ChainController.state.activeCaipNetwork;
            if (!address || !activeCaipNetwork?.id) {
                return;
            }
            this.updateNativeBalance(address, activeCaipNetwork.id, activeCaipNetwork.chainNamespace);
        });
        adapter.on('accountChanged', ({ address, chainId }) => {
            const isActiveChain = ChainController.state.activeChain === chainNamespace;
            if (isActiveChain && chainId) {
                this.syncAccount({
                    address,
                    chainId,
                    chainNamespace
                });
            }
            else if (isActiveChain && ChainController.state.activeCaipNetwork?.id) {
                this.syncAccount({
                    address,
                    chainId: ChainController.state.activeCaipNetwork?.id,
                    chainNamespace
                });
            }
            else {
                this.syncAccountInfo(address, chainId, chainNamespace);
            }
            this.syncAllAccounts(chainNamespace);
        });
    }
    async createUniversalProviderForAdapter(chainNamespace) {
        await this.getUniversalProvider();
        if (this.universalProvider) {
            this.chainAdapters?.[chainNamespace]?.setUniversalProvider?.(this.universalProvider);
        }
    }
    // -- Connection Sync ---------------------------------------------------
    async syncExistingConnection() {
        await Promise.allSettled(this.chainNamespaces.map(namespace => this.syncNamespaceConnection(namespace)));
    }
    async syncNamespaceConnection(namespace) {
        try {
            if (namespace === ConstantsUtil$3.CHAIN.EVM && CoreHelperUtil.isSafeApp()) {
                ConnectorController.setConnectorId(ConstantsUtil$3.CONNECTOR_ID.SAFE, namespace);
            }
            const connectorId = ConnectorController.getConnectorId(namespace);
            this.setStatus('connecting', namespace);
            switch (connectorId) {
                case ConstantsUtil$3.CONNECTOR_ID.WALLET_CONNECT:
                    await this.syncWalletConnectAccount();
                    break;
                case ConstantsUtil$3.CONNECTOR_ID.AUTH:
                    // Handled during initialization of adapters' auth provider
                    break;
                default:
                    await this.syncAdapterConnection(namespace);
            }
        }
        catch (err) {
            console.warn("AppKit couldn't sync existing connection", err);
            this.setStatus('disconnected', namespace);
        }
    }
    async syncAdapterConnection(namespace) {
        const adapter = this.getAdapter(namespace);
        const connectorId = ConnectorController.getConnectorId(namespace);
        const caipNetwork = this.getCaipNetwork(namespace);
        const connectors = ConnectorController.getConnectors(namespace);
        const connector = connectors.find(c => c.id === connectorId);
        try {
            if (!adapter || !connector) {
                throw new Error(`Adapter or connector not found for namespace ${namespace}`);
            }
            if (!caipNetwork?.id) {
                throw new Error('CaipNetwork not found');
            }
            const connection = await adapter?.syncConnection({
                namespace,
                id: connector.id,
                chainId: caipNetwork.id,
                rpcUrl: caipNetwork?.rpcUrls?.default?.http?.[0]
            });
            if (connection) {
                const accounts = await adapter?.getAccounts({
                    namespace,
                    id: connector.id
                });
                if (accounts && accounts.accounts.length > 0) {
                    this.setAllAccounts(accounts.accounts, namespace);
                }
                else {
                    this.setAllAccounts([CoreHelperUtil.createAccount(namespace, connection.address, 'eoa')], namespace);
                }
                this.syncProvider({ ...connection, chainNamespace: namespace });
                await this.syncAccount({ ...connection, chainNamespace: namespace });
                this.setStatus('connected', namespace);
            }
            else {
                this.setStatus('disconnected', namespace);
            }
        }
        catch (e) {
            this.setStatus('disconnected', namespace);
        }
    }
    async syncWalletConnectAccount() {
        const syncTasks = this.chainNamespaces.map(async (chainNamespace) => {
            const adapter = this.getAdapter(chainNamespace);
            const namespaceAccounts = this.universalProvider?.session?.namespaces?.[chainNamespace]?.accounts || [];
            // We try and find the address for this network in the session object.
            const activeChainId = ChainController.state.activeCaipNetwork?.id;
            const sessionAddress = namespaceAccounts.find(account => {
                const { chainId } = ParseUtil.parseCaipAddress(account);
                return chainId === activeChainId?.toString();
            }) || namespaceAccounts[0];
            if (sessionAddress) {
                const caipAddress = ParseUtil.validateCaipAddress(sessionAddress);
                const { chainId, address } = ParseUtil.parseCaipAddress(caipAddress);
                ProviderUtil.setProviderId(chainNamespace, ConstantsUtil$1.CONNECTOR_TYPE_WALLET_CONNECT);
                if (this.caipNetworks &&
                    ChainController.state.activeCaipNetwork &&
                    adapter?.namespace !== ConstantsUtil$3.CHAIN.EVM) {
                    const provider = adapter?.getWalletConnectProvider({
                        caipNetworks: this.getCaipNetworks(),
                        provider: this.universalProvider,
                        activeCaipNetwork: ChainController.state.activeCaipNetwork
                    });
                    ProviderUtil.setProvider(chainNamespace, provider);
                }
                else {
                    ProviderUtil.setProvider(chainNamespace, this.universalProvider);
                }
                ConnectorController.setConnectorId(ConstantsUtil$3.CONNECTOR_ID.WALLET_CONNECT, chainNamespace);
                StorageUtil.addConnectedNamespace(chainNamespace);
                this.syncWalletConnectAccounts(chainNamespace);
                await this.syncAccount({
                    address,
                    chainId,
                    chainNamespace
                });
            }
            else {
                this.setStatus('disconnected', chainNamespace);
            }
            this.syncConnectedWalletInfo(chainNamespace);
            await ChainController.setApprovedCaipNetworksData(chainNamespace);
        });
        await Promise.all(syncTasks);
    }
    syncWalletConnectAccounts(chainNamespace) {
        const addresses = this.universalProvider?.session?.namespaces?.[chainNamespace]?.accounts
            ?.map(account => {
            const { address } = ParseUtil.parseCaipAddress(account);
            return address;
        })
            .filter((address, index, self) => self.indexOf(address) === index);
        if (addresses) {
            this.setAllAccounts(addresses.map(address => CoreHelperUtil.createAccount(chainNamespace, address, chainNamespace === 'bip122' ? 'payment' : 'eoa')), chainNamespace);
        }
    }
    syncProvider({ type, provider, id, chainNamespace }) {
        ProviderUtil.setProviderId(chainNamespace, type);
        ProviderUtil.setProvider(chainNamespace, provider);
        ConnectorController.setConnectorId(id, chainNamespace);
    }
    async syncAllAccounts(namespace) {
        const connectorId = ConnectorController.getConnectorId(namespace);
        if (!connectorId) {
            return;
        }
        const adapter = this.getAdapter(namespace);
        const accounts = await adapter?.getAccounts({ namespace, id: connectorId });
        if (accounts && accounts.accounts.length > 0) {
            this.setAllAccounts(accounts.accounts, namespace);
        }
    }
    async syncAccount(params) {
        const isActiveNamespace = params.chainNamespace === ChainController.state.activeChain;
        const networkOfChain = ChainController.getCaipNetworkByNamespace(params.chainNamespace, params.chainId);
        const { address, chainId, chainNamespace } = params;
        const { chainId: activeChainId } = StorageUtil.getActiveNetworkProps();
        const chainIdToUse = chainId || activeChainId;
        const isUnsupportedNetwork = ChainController.state.activeCaipNetwork?.name === ConstantsUtil$3.UNSUPPORTED_NETWORK_NAME;
        const shouldSupportAllNetworks = ChainController.getNetworkProp('supportsAllNetworks', chainNamespace);
        this.setStatus('connected', chainNamespace);
        if (isUnsupportedNetwork && !shouldSupportAllNetworks) {
            return;
        }
        if (chainIdToUse) {
            let caipNetwork = this.getCaipNetworks().find(n => n.id.toString() === chainIdToUse.toString());
            let fallbackCaipNetwork = this.getCaipNetworks().find(n => n.chainNamespace === chainNamespace);
            // If doesn't support all networks, we need to use approved networks
            if (!shouldSupportAllNetworks && !caipNetwork && !fallbackCaipNetwork) {
                // Connection can be requested for a chain that is not supported by the wallet so we need to use approved networks here
                const caipNetworkIds = this.getApprovedCaipNetworkIds() || [];
                const caipNetworkId = caipNetworkIds.find(id => ParseUtil.parseCaipNetworkId(id)?.chainId === chainIdToUse.toString());
                const fallBackCaipNetworkId = caipNetworkIds.find(id => ParseUtil.parseCaipNetworkId(id)?.chainNamespace === chainNamespace);
                caipNetwork = this.getCaipNetworks().find(n => n.caipNetworkId === caipNetworkId);
                fallbackCaipNetwork = this.getCaipNetworks().find(n => n.caipNetworkId === fallBackCaipNetworkId ||
                    // This is a workaround used in Solana network to support deprecated caipNetworkId
                    ('deprecatedCaipNetworkId' in n && n.deprecatedCaipNetworkId === fallBackCaipNetworkId));
            }
            const network = caipNetwork || fallbackCaipNetwork;
            if (network?.chainNamespace === ChainController.state.activeChain) {
                // If the network is unsupported and the user doesn't allow unsupported chains, we show the unsupported chain UI
                if (OptionsController.state.enableNetworkSwitch &&
                    !OptionsController.state.allowUnsupportedChain &&
                    ChainController.state.activeCaipNetwork?.name === ConstantsUtil$3.UNSUPPORTED_NETWORK_NAME) {
                    ChainController.showUnsupportedChainUI();
                }
                else {
                    this.setCaipNetwork(network);
                }
            }
            else if (!isActiveNamespace) {
                if (networkOfChain) {
                    this.setCaipNetworkOfNamespace(networkOfChain, chainNamespace);
                }
            }
            this.syncConnectedWalletInfo(chainNamespace);
            if (!HelpersUtil.isLowerCaseMatch(address, AccountController.state.address)) {
                this.syncAccountInfo(address, network?.id, chainNamespace);
            }
            if (isActiveNamespace) {
                await this.syncBalance({ address, chainId: network?.id, chainNamespace });
            }
            else {
                await this.syncBalance({ address, chainId: networkOfChain?.id, chainNamespace });
            }
        }
    }
    async syncAccountInfo(address, chainId, chainNamespace) {
        const caipAddress = this.getCaipAddress(chainNamespace);
        const newChainId = chainId || caipAddress?.split(':')[1];
        if (!newChainId) {
            return;
        }
        const newCaipAddress = `${chainNamespace}:${newChainId}:${address}`;
        this.setCaipAddress(newCaipAddress, chainNamespace);
        await this.syncIdentity({
            address,
            chainId: newChainId,
            chainNamespace
        });
    }
    async syncReownName(address, chainNamespace) {
        try {
            const registeredWcNames = await this.getReownName(address);
            if (registeredWcNames[0]) {
                const wcName = registeredWcNames[0];
                this.setProfileName(wcName.name, chainNamespace);
            }
            else {
                this.setProfileName(null, chainNamespace);
            }
        }
        catch {
            this.setProfileName(null, chainNamespace);
        }
    }
    syncConnectedWalletInfo(chainNamespace) {
        const connectorId = ConnectorController.getConnectorId(chainNamespace);
        const providerType = ProviderUtil.getProviderId(chainNamespace);
        if (providerType === ConstantsUtil$1.CONNECTOR_TYPE_ANNOUNCED ||
            providerType === ConstantsUtil$1.CONNECTOR_TYPE_INJECTED) {
            if (connectorId) {
                const connector = this.getConnectors().find(c => c.id === connectorId);
                if (connector) {
                    const { info, name, imageUrl } = connector;
                    const icon = imageUrl || this.getConnectorImage(connector);
                    this.setConnectedWalletInfo({ name, icon, ...info }, chainNamespace);
                }
            }
        }
        else if (providerType === ConstantsUtil$1.CONNECTOR_TYPE_WALLET_CONNECT) {
            const provider = ProviderUtil.getProvider(chainNamespace);
            if (provider?.session) {
                this.setConnectedWalletInfo({
                    ...provider.session.peer.metadata,
                    name: provider.session.peer.metadata.name,
                    icon: provider.session.peer.metadata.icons?.[0]
                }, chainNamespace);
            }
        }
        else if (connectorId) {
            if (connectorId === ConstantsUtil$3.CONNECTOR_ID.COINBASE) {
                const connector = this.getConnectors().find(c => c.id === ConstantsUtil$3.CONNECTOR_ID.COINBASE);
                this.setConnectedWalletInfo({ name: 'Coinbase Wallet', icon: this.getConnectorImage(connector) }, chainNamespace);
            }
        }
    }
    async syncBalance(params) {
        const caipNetwork = NetworkUtil$1.getNetworksByNamespace(this.getCaipNetworks(), params.chainNamespace).find(n => n.id.toString() === params.chainId?.toString());
        if (!caipNetwork || !params.chainId) {
            return;
        }
        await this.updateNativeBalance(params.address, params.chainId, params.chainNamespace);
    }
    async ready() {
        await this.readyPromise;
    }
    async updateNativeBalance(address, chainId, namespace) {
        const adapter = this.getAdapter(namespace);
        const caipNetwork = ChainController.getCaipNetworkByNamespace(namespace, chainId);
        if (adapter) {
            const balance = await adapter.getBalance({
                address,
                chainId,
                caipNetwork,
                tokens: this.options.tokens
            });
            this.setBalance(balance.balance, balance.symbol, namespace);
            return balance;
        }
        return undefined;
    }
    // -- Universal Provider ---------------------------------------------------
    async initializeUniversalAdapter() {
        const logger = LoggerUtil.createLogger((error, ...args) => {
            if (error) {
                this.handleAlertError(error);
            }
            // eslint-disable-next-line no-console
            console.error(...args);
        });
        const universalProviderOptions = {
            projectId: this.options?.projectId,
            metadata: {
                name: this.options?.metadata ? this.options?.metadata.name : '',
                description: this.options?.metadata ? this.options?.metadata.description : '',
                url: this.options?.metadata ? this.options?.metadata.url : '',
                icons: this.options?.metadata ? this.options?.metadata.icons : ['']
            },
            logger
        };
        OptionsController.setManualWCControl(Boolean(this.options?.manualWCControl));
        this.universalProvider =
            this.options.universalProvider ?? (await B$1.init(universalProviderOptions));
        this.listenWalletConnect();
    }
    listenWalletConnect() {
        if (this.universalProvider) {
            this.universalProvider.on('display_uri', (uri) => {
                ConnectionController.setUri(uri);
            });
            this.universalProvider.on('connect', ConnectionController.finalizeWcConnection);
            this.universalProvider.on('disconnect', () => {
                this.chainNamespaces.forEach(namespace => {
                    this.resetAccount(namespace);
                });
                ConnectionController.resetWcConnection();
            });
            this.universalProvider.on('chainChanged', (chainId) => {
                // eslint-disable-next-line eqeqeq
                const caipNetwork = this.getCaipNetworks().find(c => c.id == chainId);
                const currentCaipNetwork = this.getCaipNetwork();
                if (!caipNetwork) {
                    this.setUnsupportedNetwork(chainId);
                    return;
                }
                if (currentCaipNetwork?.id !== caipNetwork?.id) {
                    this.setCaipNetwork(caipNetwork);
                }
            });
            this.universalProvider.on('session_event', (callbackData) => {
                if (WcHelpersUtil.isSessionEventData(callbackData)) {
                    const { name, data } = callbackData.params.event;
                    if (name === 'accountsChanged' &&
                        Array.isArray(data) &&
                        CoreHelperUtil.isCaipAddress(data[0])) {
                        this.syncAccount(ParseUtil.parseCaipAddress(data[0]));
                    }
                }
            });
        }
    }
    createUniversalProvider() {
        if (!this.universalProviderInitPromise &&
            CoreHelperUtil.isClient() &&
            this.options?.projectId) {
            this.universalProviderInitPromise = this.initializeUniversalAdapter();
        }
        return this.universalProviderInitPromise;
    }
    async getUniversalProvider() {
        if (!this.universalProvider) {
            try {
                await this.createUniversalProvider();
            }
            catch (err) {
                EventsController.sendEvent({
                    type: 'error',
                    event: 'INTERNAL_SDK_ERROR',
                    properties: {
                        errorType: 'UniversalProviderInitError',
                        errorMessage: err instanceof Error ? err.message : 'Unknown',
                        uncaught: false
                    }
                });
                // eslint-disable-next-line no-console
                console.error('AppKit:getUniversalProvider - Cannot create provider', err);
            }
        }
        return this.universalProvider;
    }
    // - Utils -------------------------------------------------------------------
    handleAlertError(error) {
        const matchedUniversalProviderError = Object.entries(ErrorUtil.UniversalProviderErrors).find(([, { message }]) => error.message.includes(message));
        const [errorKey, errorValue] = matchedUniversalProviderError ?? [];
        const { message, alertErrorKey } = errorValue ?? {};
        if (errorKey && message && !this.reportedAlertErrors[errorKey]) {
            const alertError = ErrorUtil.ALERT_ERRORS[alertErrorKey];
            if (alertError) {
                AlertController.open(alertError, 'error');
                this.reportedAlertErrors[errorKey] = true;
            }
        }
    }
    getAdapter(namespace) {
        if (!namespace) {
            return undefined;
        }
        return this.chainAdapters?.[namespace];
    }
    createAdapter(blueprint) {
        if (!blueprint) {
            return;
        }
        const namespace = blueprint.namespace;
        if (!namespace) {
            return;
        }
        this.createClients();
        const adapterBlueprint = blueprint;
        adapterBlueprint.namespace = namespace;
        adapterBlueprint.construct({
            namespace,
            projectId: this.options?.projectId,
            networks: this.getCaipNetworks()
        });
        if (!this.chainNamespaces.includes(namespace)) {
            this.chainNamespaces.push(namespace);
        }
        if (this.chainAdapters) {
            this.chainAdapters[namespace] = adapterBlueprint;
        }
    }
    // -- Public -------------------------------------------------------------------
    async open(options) {
        await this.injectModalUi();
        if (options?.uri) {
            ConnectionController.setUri(options.uri);
        }
        if (options?.arguments) {
            switch (options?.view) {
                case 'Swap':
                    return ModalController.open({ ...options, data: { swap: options.arguments } });
            }
        }
        return ModalController.open(options);
    }
    async close() {
        await this.injectModalUi();
        ModalController.close();
    }
    setLoading(loading, namespace) {
        ModalController.setLoading(loading, namespace);
    }
    async disconnect(chainNamespace) {
        await ConnectionController.disconnect(chainNamespace);
    }
    getSIWX() {
        return OptionsController.state.siwx;
    }
    // -- review these -------------------------------------------------------------------
    getError() {
        return '';
    }
    getChainId() {
        return ChainController.state.activeCaipNetwork?.id;
    }
    async switchNetwork(appKitNetwork) {
        const network = this.getCaipNetworks().find(n => n.id === appKitNetwork.id);
        if (!network) {
            AlertController.open(ErrorUtil.ALERT_ERRORS.SWITCH_NETWORK_NOT_FOUND, 'error');
            return;
        }
        await ChainController.switchActiveNetwork(network);
    }
    getWalletProvider() {
        return ChainController.state.activeChain
            ? ProviderUtil.state.providers[ChainController.state.activeChain]
            : null;
    }
    getWalletProviderType() {
        return ProviderUtil.getProviderId(ChainController.state.activeChain);
    }
    subscribeProviders(callback) {
        return ProviderUtil.subscribeProviders(callback);
    }
    getThemeMode() {
        return ThemeController.state.themeMode;
    }
    getThemeVariables() {
        return ThemeController.state.themeVariables;
    }
    setThemeMode(themeMode) {
        ThemeController.setThemeMode(themeMode);
        setColorTheme(ThemeController.state.themeMode);
    }
    setTermsConditionsUrl(termsConditionsUrl) {
        OptionsController.setTermsConditionsUrl(termsConditionsUrl);
    }
    setPrivacyPolicyUrl(privacyPolicyUrl) {
        OptionsController.setPrivacyPolicyUrl(privacyPolicyUrl);
    }
    setThemeVariables(themeVariables) {
        ThemeController.setThemeVariables(themeVariables);
        setThemeVariables(ThemeController.state.themeVariables);
    }
    subscribeTheme(callback) {
        return ThemeController.subscribe(callback);
    }
    getWalletInfo() {
        return AccountController.state.connectedWalletInfo;
    }
    getAccount(namespace) {
        const authConnector = ConnectorController.getAuthConnector(namespace);
        const accountState = ChainController.getAccountData(namespace);
        const activeChain = ChainController.state.activeChain;
        const activeConnectorId = StorageUtil.getConnectedConnectorId(namespace || activeChain);
        if (!accountState) {
            return undefined;
        }
        return {
            allAccounts: accountState.allAccounts,
            caipAddress: accountState.caipAddress,
            address: CoreHelperUtil.getPlainAddress(accountState.caipAddress),
            isConnected: Boolean(accountState.caipAddress),
            status: accountState.status,
            embeddedWalletInfo: authConnector && activeConnectorId === ConstantsUtil$3.CONNECTOR_ID.AUTH
                ? {
                    user: accountState.user
                        ? {
                            ...accountState.user,
                            /*
                             * Getting the username from the chain controller works well for social logins,
                             * but Farcaster uses a different connection flow and doesn't emit the username via events.
                             * Since the username is stored in local storage before the chain controller updates,
                             * it's safe to use the local storage value here.
                             */
                            username: StorageUtil.getConnectedSocialUsername()
                        }
                        : undefined,
                    authProvider: accountState.socialProvider ||
                        'email',
                    accountType: accountState.preferredAccountTypes?.[namespace || activeChain],
                    isSmartAccountDeployed: Boolean(accountState.smartAccountDeployed)
                }
                : undefined
        };
    }
    subscribeAccount(callback, namespace) {
        const updateVal = () => {
            const account = this.getAccount(namespace);
            if (!account) {
                return;
            }
            callback(account);
        };
        if (namespace) {
            ChainController.subscribeChainProp('accountState', updateVal, namespace);
        }
        else {
            ChainController.subscribe(updateVal);
        }
        ConnectorController.subscribe(updateVal);
    }
    subscribeNetwork(callback) {
        return ChainController.subscribe(({ activeCaipNetwork }) => {
            callback({
                caipNetwork: activeCaipNetwork,
                chainId: activeCaipNetwork?.id,
                caipNetworkId: activeCaipNetwork?.caipNetworkId
            });
        });
    }
    subscribeWalletInfo(callback) {
        return AccountController.subscribeKey('connectedWalletInfo', callback);
    }
    subscribeShouldUpdateToAddress(callback) {
        AccountController.subscribeKey('shouldUpdateToAddress', callback);
    }
    subscribeCaipNetworkChange(callback) {
        ChainController.subscribeKey('activeCaipNetwork', callback);
    }
    getState() {
        return PublicStateController.state;
    }
    subscribeState(callback) {
        return PublicStateController.subscribe(callback);
    }
    showErrorMessage(message) {
        SnackController.showError(message);
    }
    showSuccessMessage(message) {
        SnackController.showSuccess(message);
    }
    getEvent() {
        return { ...EventsController.state };
    }
    subscribeEvents(callback) {
        return EventsController.subscribe(callback);
    }
    replace(route) {
        RouterController.replace(route);
    }
    redirect(route) {
        RouterController.push(route);
    }
    popTransactionStack(status) {
        RouterController.popTransactionStack(status);
    }
    isOpen() {
        return ModalController.state.open;
    }
    isTransactionStackEmpty() {
        return RouterController.state.transactionStack.length === 0;
    }
    static getInstance() {
        return this.instance;
    }
    updateFeatures(newFeatures) {
        OptionsController.setFeatures(newFeatures);
    }
    updateRemoteFeatures(newRemoteFeatures) {
        OptionsController.setRemoteFeatures(newRemoteFeatures);
    }
    updateOptions(newOptions) {
        const currentOptions = OptionsController.state || {};
        const updatedOptions = { ...currentOptions, ...newOptions };
        OptionsController.setOptions(updatedOptions);
    }
    setConnectMethodsOrder(connectMethodsOrder) {
        OptionsController.setConnectMethodsOrder(connectMethodsOrder);
    }
    setWalletFeaturesOrder(walletFeaturesOrder) {
        OptionsController.setWalletFeaturesOrder(walletFeaturesOrder);
    }
    setCollapseWallets(collapseWallets) {
        OptionsController.setCollapseWallets(collapseWallets);
    }
    setSocialsOrder(socialsOrder) {
        OptionsController.setSocialsOrder(socialsOrder);
    }
    getConnectMethodsOrder() {
        return WalletUtil.getConnectOrderMethod(OptionsController.state.features, ConnectorController.getConnectors());
    }
    /**
     * Adds a network to an existing adapter in AppKit.
     * @param namespace - The chain namespace to add the network to (e.g. 'eip155', 'solana')
     * @param network - The network configuration to add
     * @throws Error if adapter for namespace doesn't exist
     */
    addNetwork(namespace, network) {
        if (this.chainAdapters && !this.chainAdapters[namespace]) {
            throw new Error(`Adapter for namespace ${namespace} doesn't exist`);
        }
        const extendedNetwork = this.extendCaipNetwork(network, this.options);
        if (!this.getCaipNetworks().find(n => n.id === extendedNetwork.id)) {
            ChainController.addNetwork(extendedNetwork);
        }
    }
    /**
     * Removes a network from an existing adapter in AppKit.
     * @param namespace - The chain namespace the network belongs to
     * @param networkId - The network ID to remove
     * @throws Error if adapter for namespace doesn't exist or if removing last network
     */
    removeNetwork(namespace, networkId) {
        if (this.chainAdapters && !this.chainAdapters[namespace]) {
            throw new Error(`Adapter for namespace ${namespace} doesn't exist`);
        }
        const networkToRemove = this.getCaipNetworks().find(n => n.id === networkId);
        if (!networkToRemove) {
            return;
        }
        ChainController.removeNetwork(namespace, networkId);
    }
}

// -- Helpers -------------------------------------------------------------------
let isInitialized = false;
// -- Client --------------------------------------------------------------------
class AppKit extends AppKitBaseClient {
    // -- Overrides --------------------------------------------------------------
    async open(options) {
        // Only open modal when not connected
        const isConnected = ConnectorController.isConnected();
        if (!isConnected) {
            await super.open(options);
        }
    }
    async close() {
        await super.close();
        if (this.options.manualWCControl) {
            ConnectionController.finalizeWcConnection();
        }
    }
    async syncIdentity(_request) {
        return Promise.resolve();
    }
    async syncBalance(_params) {
        return Promise.resolve();
    }
    async injectModalUi() {
        if (!isInitialized && CoreHelperUtil.isClient()) {
            await import('./basic-DnivIoOC.js');
            await import('./w3m-modal-COYKrmOU.js');
            const isElementCreated = document.querySelector('w3m-modal');
            if (!isElementCreated) {
                const modal = document.createElement('w3m-modal');
                if (!OptionsController.state.disableAppend && !OptionsController.state.enableEmbedded) {
                    document.body.insertAdjacentElement('beforeend', modal);
                }
            }
            isInitialized = true;
        }
    }
}

const PACKAGE_VERSION = '1.7.8';

function createAppKit(options) {
    return new AppKit({
        ...options,
        basic: true,
        sdkVersion: `html-core-${PACKAGE_VERSION}`
    });
}

var core = /*#__PURE__*/Object.freeze({
    __proto__: null,
    AppKit: AppKit,
    createAppKit: createAppKit
});

export { A, elementStyles as B, ChainController as C, i$2 as D, E, i as F, initializeTheming as G, Hash as H, m$1 as I, proxy as J, randomBytes as K, resetStyles as L, ModalController as M, rotr as N, OptionsController as O, subscribe as P, subscribeKey as Q, RouterController as R, SIWXUtil as S, T, toBytes as U, withErrorBoundary as V, WalletUtil as W, wrapConstructor as X, AccountController as a, AlertController as b, ApiController as c, AssetController as d, AssetUtil as e, ConnectionController as f, ConnectorController as g, ConnectorUtil as h, ConstantsUtil as i, ConstantsUtil$3 as j, ConstantsUtil$2 as k, CoreHelperUtil as l, EventsController as m, SnackController as n, StorageUtil as o, ThemeController as p, abytes as q, aexists as r, ahash as s, aoutput as t, b as u, b$1 as v, colorStyles as w, concatBytes as x, core as y, createView as z };
//# sourceMappingURL=core-CNP2T1Uv.js.map
