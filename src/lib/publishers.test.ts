/**
 * Unit tests for publisher data-access helpers.
 *
 * These tests use the migrated in-memory database to verify deterministic
 * ordering and empty-result behavior without depending on the Astro runtime.
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { publishers } from '../../db/schema';
import { createTestDatabase } from '../../db/test-helpers';
import type { Database } from './db';
import { getAllPublishers } from './publishers';

describe('publisher data-access helpers', () => {
    let db: Database;

    beforeEach(async () => {
        db = await createTestDatabase();
    });

    it('returns publishers ordered alphabetically by name', async () => {
        await db.insert(publishers).values([
            { name: 'Zeta Works', description: 'zeta' },
            { name: 'Alpha Games', description: 'alpha' },
        ]);

        const all = await getAllPublishers(db);

        expect(all.map((publisher) => publisher.name)).toEqual([
            'Alpha Games',
            'Zeta Works',
        ]);
        expect(all[0]).toEqual({
            id: expect.any(Number),
            name: 'Alpha Games',
        });
    });

    it('returns an empty list when no publishers exist', async () => {
        await expect(getAllPublishers(db)).resolves.toEqual([]);
    });
});
