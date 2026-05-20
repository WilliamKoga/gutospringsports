import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildCatalogOrderUpdates,
  getCatalogOrderMode,
  hasCatalogFilters,
} from './catalog-order.ts';

test('uses manual order when catalog query has no search or filters', () => {
  const params = new URLSearchParams();

  assert.equal(hasCatalogFilters(params), false);
  assert.equal(getCatalogOrderMode(params), 'manual');
});

test('uses created_at order when search is present', () => {
  const params = new URLSearchParams({ search: 'silva' });

  assert.equal(hasCatalogFilters(params), true);
  assert.equal(getCatalogOrderMode(params), 'created_at');
});

test('uses created_at order when role or position filters are present', () => {
  assert.equal(getCatalogOrderMode(new URLSearchParams({ role: 'player' })), 'created_at');
  assert.equal(getCatalogOrderMode(new URLSearchParams({ position: 'PG' })), 'created_at');
});

test('builds one-based catalog order updates from dragged IDs', () => {
  assert.deepEqual(buildCatalogOrderUpdates(['talent-b', 'talent-a', 'talent-c']), [
    { id: 'talent-b', catalog_order: 1 },
    { id: 'talent-a', catalog_order: 2 },
    { id: 'talent-c', catalog_order: 3 },
  ]);
});

test('rejects empty, blank, and duplicate IDs', () => {
  assert.throws(() => buildCatalogOrderUpdates([]), /non-empty/);
  assert.throws(() => buildCatalogOrderUpdates(['talent-a', '']), /non-empty strings/);
  assert.throws(() => buildCatalogOrderUpdates(['talent-a', 'talent-a']), /unique/);
});
