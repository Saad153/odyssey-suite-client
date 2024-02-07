import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const seJobValues = createApi({
    reducerPath: "seJobValuesApi",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_CLIMAX_MAIN_URL }),
    endpoints:(builder) => ({
        jobValues: builder.query({
            query: () => '/seaJob/getValues',
            keepUnusedDataFor:60*60*24
        }),
        jobData: builder.query({
            query(args) {
                return {
                  url: `/seaJob/getSEJobById`,
                  headers: {"id":`${args.id}`, operation:`${args.operation}`}
                }
            },
            keepUnusedDataFor:60*60*24,
        })
    })
})

export const { useJobValuesQuery, useJobDataQuery } = seJobValues;