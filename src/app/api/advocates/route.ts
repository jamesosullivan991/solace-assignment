import { and, like, or, sql, ilike } from 'drizzle-orm';
import db from "../../../db";
import { advocates } from "../../../db/schema";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 5;
  const offset = (page - 1) * limit;
  const search = searchParams.get('search') || '';

  try {
    const searchCondition = search ? 
      or(
        ilike(advocates.firstName, `%${search}%`),
        ilike(advocates.lastName, `%${search}%`),
        ilike(advocates.city, `%${search}%`),
        ilike(advocates.degree, `%${search}%`),
        sql`${advocates.specialties}::text ILIKE ${`%${search}%`}`
      ) : 
      undefined;

    const query = db
      .select()
      .from(advocates);

    const countQuery = db
      .select({
        count: sql`count(*)`
      })
      .from(advocates);

    if (searchCondition) {
      query.where(searchCondition);
      countQuery.where(searchCondition);
    }

    const [{ count }] = await countQuery;
    const data = await query
      .limit(limit)
      .offset(offset);

    return Response.json({ 
      data,
      pagination: {
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
        hasMore: count > page * limit
      }
    });
  } catch (error) {
    console.error('Error fetching advocates:', error);
    return Response.json(
      { error: 'Failed to fetch advocates' },
      { status: 500 }
    );
  }
}
