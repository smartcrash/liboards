import { Column, User } from "../entity";

const gates = {
  async 'create-card'(user: User, column: Column) {
    // TODO: Implement
    return false
  }
} as const

async function allowIf(key: keyof typeof gates, args: Parameters<typeof gates[typeof key]>) {
  const handler = gates[key]
  const allowed = await handler(...args)

  if (!allowed) throw new Error("Not authorized");
}
