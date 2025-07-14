import cron from "node-cron"
import { checkWishlistAndSendEmail } from "./send-email.js";

//const cronExpression = "0 0 * * *"
const cronExpression = "*/1 * * * *" // for test purpose
const isValid = cron.validate(cronExpression)
console.log(`is expression valid: ${isValid}`)

export function automateSendEmail() {
  cron.schedule(cronExpression, async () => { await checkWishlistAndSendEmail() });
}