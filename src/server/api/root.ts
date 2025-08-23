import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

import { transactionsRouter } from "@/server/api/routers/transactions";
import { usersRouter } from "@/server/api/routers/users";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  transactions: transactionsRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.example.hello();
 *       ^? string
 */
export const createCaller = createCallerFactory(appRouter);
