import { t as Constants } from "./constants.js";
import { n as signIn } from "./auth-client.js";
import { n as toast } from "./toast-state.svelte.js";
new Set([
	"sepharstudios.com",
	"www.sepharstudios.com",
	"admin.sepharstudios.com",
	"creators.sepharstudios.com",
	"creator.sepharstudios.com",
	"kids.sepharstudios.com",
	"localhost"
]);
var getRedirectUrl = () => {
	return Constants.AFTERAUTH;
};
var handleSocialSignin = async (provider, callbackURL) => {
	await signIn.social({
		provider,
		callbackURL
	}, {
		onSuccess: () => {
			toast.success("Success Alert", { description: "Successful Sign in" });
		},
		onError: (ctx) => {
			toast.error("Error Alert", { description: ctx.error.message });
		}
	});
};
//#endregion
export { handleSocialSignin as n, getRedirectUrl as t };
