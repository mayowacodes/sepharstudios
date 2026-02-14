import './client-CreTuECU.js';
import { z as getContext } from './index-C14HL8mA.js';
import './index-client-DVey9PBT.js';

function context() {
  return getContext("__request__");
}
function context_dev(name) {
  try {
    return context();
  } catch {
    throw new Error(
      `Can only read '${name}' on the server during rendering (not in e.g. \`load\` functions), as it is bound to the current request via component context. This prevents state from leaking between users.For more information, see https://svelte.dev/docs/kit/state-management#avoid-shared-state-on-the-server`
    );
  }
}
const page$1 = {
  get data() {
    return context_dev("page.data").page.data;
  },
  get error() {
    return context_dev("page.error").page.error;
  },
  get route() {
    return context_dev("page.route").page.route;
  },
  get status() {
    return context_dev("page.status").page.status;
  },
  get url() {
    return context_dev("page.url").page.url;
  }
};
const page = page$1;

export { page as p };
//# sourceMappingURL=index2-DN4t2Pgp.js.map
