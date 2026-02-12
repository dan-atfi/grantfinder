import { z } from "zod";

export const grantSearchSchema = z.object({
  query: z.string().optional(),
  sicCodes: z.array(z.string()).optional(),
  sector: z.string().optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
  status: z.enum(["open", "closed", "upcoming", "all"]).optional(),
  matchCompany: z.coerce.boolean().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
});

export type GrantSearchInput = z.infer<typeof grantSearchSchema>;
