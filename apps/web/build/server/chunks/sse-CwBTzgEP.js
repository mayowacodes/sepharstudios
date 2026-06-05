//#region src/lib/server/sse.ts
var topics = /* @__PURE__ */ new Map();
function subscribe(topic, sub) {
	let set = topics.get(topic);
	if (!set) {
		set = /* @__PURE__ */ new Set();
		topics.set(topic, set);
	}
	set.add(sub);
	return () => {
		const s = topics.get(topic);
		if (s) {
			s.delete(sub);
			if (s.size === 0) topics.delete(topic);
		}
	};
}
function publish(topic, data) {
	const set = topics.get(topic);
	if (!set || set.size === 0) return;
	const payload = `data: ${JSON.stringify(data)}\n\n`;
	for (const sub of set) try {
		sub(payload);
	} catch {}
}
/**
* Build a Response wrapping an EventStream for the listed topics.
* Handles unsubscribe on close, plus a periodic keep-alive comment so
* proxies don't timeout the connection.
*/
function eventStream(topicNames) {
	const encoder = new TextEncoder();
	let unsubscribes = [];
	let keepAlive = null;
	const stream = new ReadableStream({
		start(controller) {
			const push = (chunk) => {
				try {
					controller.enqueue(encoder.encode(chunk));
				} catch {}
			};
			push(": open\n\n");
			for (const t of topicNames) unsubscribes.push(subscribe(t, push));
			keepAlive = setInterval(() => push(": keepalive\n\n"), 25e3);
		},
		cancel() {
			for (const u of unsubscribes) u();
			unsubscribes = [];
			if (keepAlive) {
				clearInterval(keepAlive);
				keepAlive = null;
			}
		}
	});
	return new Response(stream, { headers: {
		"content-type": "text/event-stream",
		"cache-control": "no-cache, no-transform",
		"connection": "keep-alive",
		"x-accel-buffering": "no"
	} });
}

export { eventStream as e, publish as p };
//# sourceMappingURL=sse-CwBTzgEP.js.map
