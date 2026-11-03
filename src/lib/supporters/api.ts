import { z } from 'zod';
export interface Supporter {
  id: string;
  name: string;
  href?: string;
  avatar?: string;
}
const entity = z.object({
  login: z.string().min(1),
  name: z.string().nullable(),
  avatarUrl: z.string().optional(),
});
function publicAvatar(value?: string): string | undefined {
  if (!value) return;
  try {
    const url = new URL(value);
    if (
      url.protocol === 'https:' &&
      url.hostname === 'avatars.githubusercontent.com' &&
      !url.username &&
      !url.password &&
      !url.port
    )
      return url.href;
  } catch {
    /* Ignore malformed image URLs. */
  }
}
const githubPage = z.object({
  errors: z.array(z.unknown()).optional(),
  data: z
    .object({
      user: z
        .object({
          sponsorshipsAsMaintainer: z.object({
            nodes: z.array(
              z.object({ privacyLevel: z.string(), sponsorEntity: entity.nullable() }),
            ),
            pageInfo: z.object({ hasNextPage: z.boolean(), endCursor: z.string().nullable() }),
          }),
        })
        .nullable(),
    })
    .optional(),
});
const coffeePage = z.object({
  current_page: z.number().int().positive(),
  last_page: z.number().int().nonnegative(),
  data: z.array(
    z.object({
      support_id: z.number().int(),
      supporter_name: z.string().nullable(),
      support_visibility: z.union([z.number(), z.string()]),
      is_refunded: z.union([z.number(), z.string(), z.boolean()]).nullable(),
    }),
  ),
});
export function publicCoffees(input: unknown): {
  supporters: Supporter[];
  page: number;
  last: number;
} {
  // The live legacy API returns HTTP 200 with this sentinel for an empty account.
  if (z.object({ error: z.literal('No supporters') }).safeParse(input).success)
    return { supporters: [], page: 1, last: 1 };
  const result = coffeePage.parse(input);
  return {
    page: result.current_page,
    last: result.last_page,
    supporters: result.data.flatMap((row) => {
      const name = row.supporter_name?.trim();
      return String(row.support_visibility) === '1' &&
        (row.is_refunded === null ||
          row.is_refunded === false ||
          String(row.is_refunded) === '0') &&
        name &&
        !name.includes('@')
        ? [{ id: `coffee-${row.support_id}`, name: name.slice(0, 100) }]
        : [];
    }),
  };
}
export function publicGitHub(input: unknown) {
  const result = githubPage.parse(input);
  if (result.errors?.length || !result.data?.user) throw new Error('GitHub response unavailable');
  const connection = result.data.user.sponsorshipsAsMaintainer;
  return {
    supporters: connection.nodes.flatMap((row) => {
      const person = row.sponsorEntity;
      return row.privacyLevel === 'PUBLIC' &&
        person &&
        /^[a-z\d](?:[a-z\d-]*[a-z\d])?$/i.test(person.login)
        ? [
            {
              id: `github-${person.login}`,
              name: person.name?.trim() || person.login,
              href: `https://github.com/${person.login}`,
              ...(publicAvatar(person.avatarUrl) ? { avatar: publicAvatar(person.avatarUrl) } : {}),
            },
          ]
        : [];
    }),
    ...connection.pageInfo,
  };
}
const query = `query($login:String!,$after:String){user(login:$login){sponsorshipsAsMaintainer(first:100,after:$after,includePrivate:false,activeOnly:true){nodes{privacyLevel sponsorEntity{... on User{login name avatarUrl(size:128)} ... on Organization{login name avatarUrl(size:128)}}}pageInfo{hasNextPage endCursor}}}}`;
export async function loadSupporters(
  provider: 'github' | 'coffee',
  token: string,
  request: typeof fetch = fetch,
): Promise<Supporter[]> {
  const supporters: Supporter[] = [];
  let after: string | null = null;
  const signal = AbortSignal.timeout(12000);
  for (let page = 1; page <= 100; page++) {
    const response = await request(
      provider === 'github'
        ? 'https://api.github.com/graphql'
        : `https://developers.buymeacoffee.com/api/v1/supporters?page=${page}`,
      {
        method: provider === 'github' ? 'POST' : 'GET',
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Tristan-Portfolio',
        },
        ...(provider === 'github'
          ? { body: JSON.stringify({ query, variables: { login: 'tristanjcb', after } }) }
          : {}),
        cache: 'no-store',
        redirect: 'error',
        signal,
      },
    );
    if (!response.ok) throw new Error('Supporter provider unavailable');
    const raw: unknown = await response.json();
    if (provider === 'github') {
      const result = publicGitHub(raw);
      supporters.push(...result.supporters);
      if (!result.hasNextPage)
        return [...new Map(supporters.map((item) => [item.id, item])).values()];
      if (!result.endCursor || result.endCursor === after) throw new Error('Invalid pagination');
      after = result.endCursor;
    } else {
      const result = publicCoffees(raw);
      if (result.page !== page) throw new Error('Invalid pagination');
      supporters.push(...result.supporters);
      if (page >= result.last) return supporters;
    }
  }
  throw new Error('Supporter pagination limit exceeded');
}
