import { SetupUser } from "@/actions/billing/setupUser";
export const dynamic = "force-dynamic";


export default async function SetupPage() {
    return await SetupUser()
}