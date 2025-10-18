"use client";


import React from 'react';
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const UserList = () => {
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.getUsers.queryOptions())
    return (
        <div>UserList : {JSON.stringify(data)}</div>
    )
}
