"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { CreditCardIcon, FolderOpenIcon, HistoryIcon, KeyIcon, LogOutIcon, StarIcon, WorkflowIcon } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import { Spinner } from "./ui/spinner"
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscriptions"

const menu_Items = [
    {
        title: "Main",
        items: [
            {
                title: "Workflows",
                url: "/workflows",
                icon: FolderOpenIcon
            },
            {
                title: "Credentials",
                url: "/credentials",
                icon: KeyIcon
            },
            {
                title: "Executions",
                url: "/executions",
                icon: HistoryIcon
            },
        ],
    },
]

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const {hasActiveSubscription , isLoading} = useHasActiveSubscription()
    const [isSignOutLoading, setIsSignOutLoading] = useState(false)

    const router = useRouter()
    const pathname = usePathname();



    const onSignOut = async () => {
        setIsSignOutLoading(true)
        try {

            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.replace("/sign-in")
                    }
                }
            })
        } catch {
            setIsSignOutLoading(false)
        } finally {
            setIsSignOutLoading(false)
        }
    }

    return (
        <Sidebar {...props} collapsible="icon" >
            <SidebarHeader>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={"Nodebase"}
                    className="gap-x-4 h-10 px-4 hover:bg-transparent">
                        <Link href={"/"} prefetch>
                            {/* <Button size={"icon"} > */}
                                <WorkflowIcon className=" text-primary size-7" />
                            {/* </Button> */}
                            <span className='  text-lg font-semibold'>
                                Nodebase
                            </span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarHeader>
            <SidebarContent>
                {menu_Items.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map(({ title, icon: Icon, url }) => (
                                    <SidebarMenuItem key={title}>
                                        <SidebarMenuButton
                                            isActive={
                                                url === "/"
                                                    ? pathname === "/"
                                                    : pathname.startsWith(url)
                                            }
                                            tooltip={title}
                                            asChild
                                            className="gap-x-4 h-10 px-4"
                                        >
                                            <Link href={url} prefetch>
                                                {Icon && <Icon className="w-4 h-4" />}
                                                {title}
                                            </Link>
                                            {/* </a> */}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                {!hasActiveSubscription && !isLoading && (
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip={"Upgrade to Pro"}
                            className="gap-x-4 h-10 px-4"
                            onClick={() => authClient.checkout({
                                slug : "nodebase-pro"
                            })}
                        >
                            <StarIcon className=" size-4" />
                            <span>Upgrade to Pro</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                )}
                <SidebarMenuItem>
                    <SidebarMenuButton
                        tooltip={"Billing Portal"}
                        className="gap-x-4 h-10 px-4"
                        onClick={() => authClient.customer.portal()}
                    >
                        <CreditCardIcon className=" size-4" />
                        <span>Billing Portal</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                    <SidebarMenuButton
                        tooltip={"Sign out"}
                        className="gap-x-4 h-10 px-4"
                        onClick={onSignOut}
                    >
                        {isSignOutLoading ? <Spinner className="text-primary" /> : <LogOutIcon className=" size-4" />}
                        <span>Sign out</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarFooter>
        </Sidebar>
    )
}
