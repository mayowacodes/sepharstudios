import { s as sendEmailAction } from "./server.js";
const SITE_URL = "https://sepharstudios.com";
async function sendTrialWelcome(to, name, plan, trialEndDate) {
  const formatted = trialEndDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  await sendEmailAction({
    to,
    subject: "Your Sephar Studios free trial has started!",
    meta: {
      description: `Hi ${name}, welcome to Sephar Studios! Your 3-month free trial of the ${capitalize(plan)} plan has started. You won't be charged until ${formatted}. Enjoy unlimited faith-based entertainment.`,
      link: `${SITE_URL}/dashboard`
    }
  });
}
async function sendCancellationConfirmation(to, name, accessUntil) {
  const formatted = accessUntil.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  await sendEmailAction({
    to,
    subject: "Your subscription has been cancelled",
    meta: {
      description: `Hi ${name}, your Sephar Studios subscription has been cancelled. You'll continue to have full access until ${formatted}. We hope to see you again!`,
      link: `${SITE_URL}/plans`
    }
  });
}
async function sendNewReleaseNotification(to, name, contentTitle, contentType, contentId) {
  await sendEmailAction({
    to,
    subject: `New on Sephar Studios: ${contentTitle}`,
    meta: {
      description: `Hi ${name}, a new ${contentType} has just arrived on Sephar Studios — "${contentTitle}". Start watching now!`,
      link: `${SITE_URL}/watch/${contentId}`
    }
  });
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export {
  sendTrialWelcome as a,
  sendCancellationConfirmation as b,
  sendNewReleaseNotification as s
};
