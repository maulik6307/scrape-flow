export const dynamic = "force-dynamic";
import { SetupUser } from "@/actions/billing/setupUser";



export default async function SetupPage() {
    return await SetupUser()
}