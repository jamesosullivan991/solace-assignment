import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function POST() {
  const records = await db
    .insert(advocates)
    .values(advocateData as typeof advocates.$inferInsert[])
    .returning();

  return Response.json({ advocates: records });
}
