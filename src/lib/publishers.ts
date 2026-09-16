/**
 * Data-access helpers for game publishers.
 *
 * These helpers read summary-level publisher rows from the SQLite database so
 * Astro pages can render static publisher lists without any client-side state.
 */

import { asc } from 'drizzle-orm';
import type { Database } from './db';
import { publishers } from '../../db/schema';
import type { Publisher } from '../types/game';

/**
 * Retrieves all publishers in alphabetical order for listing views.
 *
 * @param db - Drizzle database instance used to query publisher data.
 * @returns A list of publisher summaries ordered by name.
 */
export async function getAllPublishers(db: Database): Promise<Publisher[]> {
    const rows = await db
        .select({
            id: publishers.id,
            name: publishers.name,
        })
        .from(publishers)
        .orderBy(asc(publishers.name));

    return rows.map((row) => ({
        id: row.id,
        name: row.name,
    }));
}
