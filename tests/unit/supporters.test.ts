import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSupporters, publicCoffees, publicGitHub } from '../../src/lib/supporters/api.ts';
const coffee = (id: number, extra = {}) => ({
  support_id: id,
  supporter_name: 'Public name',
  support_visibility: 1,
  is_refunded: null,
  ...extra,
});
test('coffee API projects only public non-refunded display names, never payer identity', () => {
  const result = publicCoffees({
    current_page: 1,
    last_page: 1,
    data: [
      coffee(1, {
        payer_email: 'private@example.com',
        payer_name: 'Private billing name',
        support_note: 'Private message',
      }),
      coffee(2, { support_visibility: 0 }),
      coffee(3, { is_refunded: 1 }),
      coffee(4, { supporter_name: null, payer_name: 'Do not use me' }),
      coffee(5, { supporter_name: 'private@example.com' }),
    ],
  });
  assert.deepEqual(result.supporters, [{ id: 'coffee-1', name: 'Public name' }]);
});
test('GitHub skips private sponsors even if returned to an authenticated owner', () => {
  const result = publicGitHub({
    data: {
      user: {
        sponsorshipsAsMaintainer: {
          nodes: [
            { privacyLevel: 'PRIVATE', sponsorEntity: { login: 'private', name: 'Hidden' } },
            { privacyLevel: 'PUBLIC', sponsorEntity: { login: 'public', name: null } },
          ],
          pageInfo: { hasNextPage: false, endCursor: null },
        },
      },
    },
  });
  assert.deepEqual(result.supporters, [
    { id: 'github-public', name: 'public', href: 'https://github.com/public' },
  ]);
  assert.throws(() => publicGitHub({ errors: [{}] }));
});
test('coffee pagination uses fixed origins and keeps authorization on the server', async () => {
  let calls = 0;
  const mock: typeof fetch = async (url, init) => {
    calls++;
    assert.equal(
      String(url),
      `https://developers.buymeacoffee.com/api/v1/supporters?page=${calls}`,
    );
    assert.equal(new Headers(init?.headers).get('Authorization'), 'Bearer test-token');
    assert.equal(init?.redirect, 'error');
    return Response.json({
      current_page: calls,
      last_page: 2,
      next_page_url: 'https://untrusted.example',
      data: [coffee(calls)],
    });
  };
  assert.equal((await loadSupporters('coffee', 'test-token', mock)).length, 2);
  assert.equal(calls, 2);
});
test('API failures, invalid schemas and repeating pagination fail rather than return a false empty list', async () => {
  await assert.rejects(
    loadSupporters('coffee', 'token', async () => new Response('', { status: 429 })),
  );
  await assert.rejects(loadSupporters('coffee', 'token', async () => Response.json({})));
  await assert.rejects(
    loadSupporters('coffee', 'token', async () =>
      Response.json({ current_page: 1, last_page: 2, data: [] }),
    ),
  );
});

test('live coffee empty-account sentinel is empty, other error payloads still fail', async () => {
  assert.deepEqual(publicCoffees({ error: 'No supporters' }), { supporters: [], page: 1, last: 1 });
  assert.deepEqual(
    await loadSupporters('coffee', 'token', async () => Response.json({ error: 'No supporters' })),
    [],
  );
  assert.throws(() => publicCoffees({ error: 'Invalid token' }));
});
