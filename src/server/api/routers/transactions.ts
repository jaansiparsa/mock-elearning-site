import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { HTTPStatus } from "@/types";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const createTransactionSchema = z.object({
  description: z.string().min(1, "Transaction description is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  receiverAccountId: z.string().min(1, "Receiver account ID is required"),
});

export const transactionsRouter = createTRPCRouter({
  getAllForUser: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.session.user.id;

      // Get the user's financial account
      const userAccount = await ctx.db.financialAccount.findFirst({
        where: { userId },
      });

      if (!userAccount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No financial account found for this user",
        });
      }

      // Get all transactions where the user is either sender or receiver
      const transactions = await ctx.db.transaction.findMany({
        where: {
          OR: [
            { senderAccountId: userAccount.id },
            { receiverAccountId: userAccount.id },
          ],
        },
        include: {
          senderAccount: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          receiverAccount: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        success: true,
        transactions,
        userAccount,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch transactions",
        cause: error,
      });
    }
  }),

  getAccountInfo: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.session.user.id;

      // Get the user's financial account
      const userAccount = await ctx.db.financialAccount.findFirst({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!userAccount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No financial account found for this user",
        });
      }

      return {
        success: true,
        account: userAccount,
        statusCode: HTTPStatus.OK,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch account information",
        cause: error,
      });
    }
  }),

  getBalanceHistory: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.session.user.id;

      // Get the user's financial account
      const userAccount = await ctx.db.financialAccount.findFirst({
        where: { userId },
      });

      if (!userAccount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No financial account found for this user",
        });
      }

      // Get all transactions where the user is either sender or receiver, ordered by date
      const transactions = await ctx.db.transaction.findMany({
        where: {
          OR: [
            { senderAccountId: userAccount.id },
            { receiverAccountId: userAccount.id },
          ],
        },
        select: {
          id: true,
          amount: true,
          createdAt: true,
          senderAccountId: true,
          receiverAccountId: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      // Calculate balance history
      let runningBalance = 0;
      interface BalanceHistoryItem {
        date: Date;
        balance: number;
        transactionId: string | null;
      }

      const balanceHistory: BalanceHistoryItem[] = [
        {
          date: userAccount.createdAt,
          balance: 0,
          transactionId: null,
        },
      ];

      transactions.forEach((transaction) => {
        const isSender = transaction.senderAccountId === userAccount.id;
        const amount = isSender ? -transaction.amount : transaction.amount;
        runningBalance += amount;

        balanceHistory.push({
          date: transaction.createdAt,
          balance: runningBalance,
          transactionId: transaction.id,
        });
      });

      return {
        success: true,
        balanceHistory,
        currentBalance: runningBalance,
        statusCode: HTTPStatus.OK,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch balance history",
        cause: error,
      });
    }
  }),

  getAvailableAccounts: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.session.user.id;

      // Get the user's financial account
      const userAccount = await ctx.db.financialAccount.findFirst({
        where: { userId },
      });

      if (!userAccount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No financial account found for this user",
        });
      }

      // Get all other accounts (excluding the user's own account)
      const availableAccounts = await ctx.db.financialAccount.findMany({
        where: {
          id: { not: userAccount.id },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          user: {
            name: "asc",
          },
        },
      });

      return {
        success: true,
        availableAccounts,
        userAccount,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch available accounts",
        cause: error,
      });
    }
  }),

  createTransaction: protectedProcedure
    .input(createTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;

        // Get the user's financial account (sender)
        const senderAccount = await ctx.db.financialAccount.findFirst({
          where: { userId },
        });

        if (!senderAccount) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "No financial account found for this user",
          });
        }

        // Validate receiver account exists
        const receiverAccount = await ctx.db.financialAccount.findUnique({
          where: { id: input.receiverAccountId },
        });

        if (!receiverAccount) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Receiver account not found",
          });
        }

        // Check if sender has sufficient balance
        if (senderAccount.balance < input.amount) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Insufficient balance for this transaction",
          });
        }

        // Prevent self-transactions
        if (senderAccount.id === receiverAccount.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot send money to yourself",
          });
        }

        // Create the transaction
        const transaction = await ctx.db.transaction.create({
          data: {
            senderAccountId: senderAccount.id,
            receiverAccountId: receiverAccount.id,
            amount: input.amount,
            description: input.description,
            createdAt: new Date(),
          },
          include: {
            senderAccount: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
            receiverAccount: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        });

        // Update account balances
        await ctx.db.financialAccount.update({
          where: { id: senderAccount.id },
          data: { balance: senderAccount.balance - input.amount },
        });

        await ctx.db.financialAccount.update({
          where: { id: receiverAccount.id },
          data: { balance: receiverAccount.balance + input.amount },
        });

        return {
          success: true,
          transaction,
          statusCode: HTTPStatus.CREATED,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create transaction",
          cause: error,
        });
      }
    }),
});
