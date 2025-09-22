# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build
yarn dlx turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build --filter=docs

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev --filter=web

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)


http://localhost:9000/app/invite?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Imludml0ZV8wMUs1NEpGS0hLMUJRUkRRQzFRN0VNMzdFQiIsImVtYWlsIjoiYWRtaW5AbWVkdXNhLXRlc3QuY29tIiwiaWF0IjoxNzU3ODY4OTY5LCJ   │

curl -X POST 'http://localhost:9000/auth/user/emailpass' \
-H 'Content-Type: application/json' \
-d '{"email": "m.wittchen@live.de", "password": "Dev123"}'

curl -X POST 'http://localhost:9000/auth/user/emailpass' \
-H 'Content-Type: application/json' \
-d '{"email": "m.wittchen@live.de", "password": "Dev123"}'
{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rvcl9pZCI6InVzZXJfMDFLNTRKR1pIUkQ5WFgxRTVYOTgwREpHQ0ciLCJhY3Rvcl90eXBlIjoidXNlciIsImF1dGhfaWRlbnRpdHlfaWQiOiJhdXRoaWRfMDFLNTRKR1pIMkNWTUQ4UFc1OU5ZSlBBOTYiLCJhcHBfbWV0YWRhdGEiOnsidXNlcl9pZCI6InVzZXJfMDFLNTRKR1pIUkQ5WFgxRTVYOTgwREpHQ0cifSwiaWF0IjoxNzU4NDcwNjM5LCJleHAiOjE3NTg1NTcwMzl9.njI5yWGH0PFiXa1Z_lpqRffKS2r_tU3tGuEJ6Exu_P0"}%


curl -X POST 'http://localhost:9000/admin/brands' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rvcl9pZCI6InVzZXJfMDFLNTRKR1pIUkQ5WFgxRTVYOTgwREpHQ0ciLCJhY3Rvcl90eXBlIjoidXNlciIsImF1dGhfaWRlbnRpdHlfaWQiOiJhdXRoaWRfMDFLNTRKR1pIMkNWTUQ4UFc1OU5ZSlBBOTYiLCJhcHBfbWV0YWRhdGEiOnsidXNlcl9pZCI6InVzZXJfMDFLNTRKR1pIUkQ5WFgxRTVYOTgwREpHQ0cifSwiaWF0IjoxNzU4NDcwNjM5LCJleHAiOjE3NTg1NTcwMzl9.njI5yWGH0PFiXa1Z_lpqRffKS2r_tU3tGuEJ6Exu_P0' \
-H 'Content-Type: application/json' \
-d '{"name":"NeueBrand"}'


curl -X POST 'http://localhost:9000/admin/brands' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer {eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rvcl9pZCI6InVzZXJfMDFLNTRKR1pIUkQ5WFgxRTVYOTgwREpHQ0ciLCJhY3Rvcl90eXBlIjoidXNlciIsImF1dGhfaWRlbnRpdHlfaWQiOiJhdXRoaWRfMDFLNTRKR1pIMkNWTUQ4UFc1OU5ZSlBBOTYiLCJhcHBfbWV0YWRhdGEiOnsidXNlcl9pZCI6InVzZXJfMDFLNTRKR1pIUkQ5WFgxRTVYOTgwREpHQ0cifSwiaWF0IjoxNzU4NDcwNjM5LCJleHAiOjE3NTg1NTcwMzl9.njI5yWGH0PFiXa1Z_lpqRffKS2r_tU3tGuEJ6Exu_P0}' \
--data '{
"name": "Acme"
}'

curl -X POST 'http://localhost:9000/admin/products/prod_01K54JFN8DB18XF5W6ZP644WNJ' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rvcl9pZCI6InVzZXJfMDFLNTRKR1pIUkQ5WFgxRTVYOTgwREpHQ0ciLCJhY3Rvcl90eXBlIjoidXNlciIsImF1dGhfaWRlbnRpdHlfaWQiOiJhdXRoaWRfMDFLNTRKR1pIMkNWTUQ4UFc1OU5ZSlBBOTYiLCJhcHBfbWV0YWRhdGEiOnsidXNlcl9pZCI6InVzZXJfMDFLNTRKR1pIUkQ5WFgxRTVYOTgwREpHQ0cifSwiaWF0IjoxNzU4NDcwNjM5LCJleHAiOjE3NTg1NTcwMzl9.njI5yWGH0PFiXa1Z_lpqRffKS2r_tU3tGuEJ6Exu_P0' \
--data '{
"additional_data": {
"brand_id": "01K5PPPJR0F87WWZX88XDWGY5D"
}
}'


curl -X POST 'http://localhost:9000/admin/products' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rvcl9pZCI6InVzZXJfMDFLNTRKR1pIUkQ5WFgxRTVYOTgwREpHQ0ciLCJhY3Rvcl90eXBlIjoidXNlciIsImF1dGhfaWRlbnRpdHlfaWQiOiJhdXRoaWRfMDFLNTRKR1pIMkNWTUQ4UFc1OU5ZSlBBOTYiLCJhcHBfbWV0YWRhdGEiOnsidXNlcl9pZCI6InVzZXJfMDFLNTRKR1pIUkQ5WFgxRTVYOTgwREpHQ0cifSwiaWF0IjoxNzU4NDcwNjM5LCJleHAiOjE3NTg1NTcwMzl9.njI5yWGH0PFiXa1Z_lpqRffKS2r_tU3tGuEJ6Exu_P0' \
--data '{
"title": "Product 2",
"options": [
{ "title": "Size", "values": ["M"] }
],
"shipping_profile_id": "sp_01K54JFHR81YZM0ZMSWY51J07V",
"additional_data": {
"brand_id": "01K5PPPJR0F87WWZX88XDWGY5D"
}
}'


marcelwittchen@MacBook-Pro-von-Marcel remix % curl -X POST 'http://localhost:9000/admin/products/prod_01K54JFN8DB18XF5W6ZP644WNJ' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rvcl9pZCI6InVzZXJfMDFLNTRKR1pIUkQ5WFgxRTVYOTgwREpHQ0ciLCJhY3Rvcl90eXBlIjoidXNlciIsImF1dGhfaWRlbnRpdHlfaWQiOiJhdXRoaWRfMDFLNTRKR1pIMkNWTUQ4UFc1OU5ZSlBBOTYiLCJhcHBfbWV0YWRhdGEiOnsidXNlcl9pZCI6InVzZXJfMDFLNTRKR1pIUkQ5WFgxRTVYOTgwREpHQ0cifSwiaWF0IjoxNzU4NDcwNjM5LCJleHAiOjE3NTg1NTcwMzl9.njI5yWGH0PFiXa1Z_lpqRffKS2r_tU3tGuEJ6Exu_P0' \
--data '{
"additional_data": {
"brand_id": "01K5PPPJR0F87WWZX88XDWGY5D"
}
}'
{"product":{"id":"prod_01K54JFN8DB18XF5W6ZP644WNJ","title":"Medusa Shorts","subtitle":null,"status":"published","external_id":null,"description":"Reimagine the feeling of classic shorts. With our cotton shorts, everyday essentials no longer have to be ordinary.","handle":"shorts","is_giftcard":false,"discountable":true,"thumbnail":"https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-front.png","collection_id":"pcol_01K551BD4FY9GTQC91MKE7CDP1","type_id":null,"weight":"400","length":null,"height":null,"width":null,"hs_code":null,"origin_country":null,"mid_code":null,"material":null,"created_at":"2025-09-14T16:56:11.280Z","updated_at":"2025-09-21T21:56:36.320Z","deleted_at":null,"metadata":{"brand_id":"01K5PPPJR0F87WWZX88XDWGY5D"},"type":null,"collection":{"id":"pcol_01K551BD4FY9GTQC91MKE7CDP1","title":"New","handle":"new","metadata":null,"created_at":"2025-09-14T21:16:00.523Z","updated_at":"2025-09-14T21:16:00.523Z","deleted_at":null},"options":[{"id":"opt_01K54JFN8FGHJSPC0NSTXAAC8G","title":"Size","metadata":null,"product_id":"prod_01K54JFN8DB18XF5W6ZP644WNJ","created_at":"2025-09-14T16:56:11.280Z","updated_at":"2025-09-14T16:56:11.280Z","deleted_at":null,"values":[{"id":"optval_01K5Q4ERTY2CPNMA618WNJEESZ","value":"{\"id\":\"optval_01K5Q4EC044Y23AXJD5S3JVVQ9\",\"value\":\"{\\"id\\":\\"optval_01K5Q3REZ2D70CT1V0RY3GBTTY\\",\\"value\\":\\"{\\\\"id\\\\":\\\\"optval_01K5Q378TAD6F8NY92K7HS0CWK\\\\",\\\\"value\\\\":\\\\"{\\\\\\\\"id\\\\\\\\":\\\\\\\\"optval_01K54JFN8FMEAF7FJQ1ZACN3FS\\\\\\\\",\\\\\\\\"value\\\\\\\\":\\\\\\\\"L\\\\\\\\",\\\\\\\\"metadata\\\\\\\\":null,\\\\\\\\"option_id\\\\\\\\":\\\\\\\\"opt_01K54JFN8FGHJSPC0NSTXAAC8G\\\\\\\\",\\\\\\\\"created_at\\\\\\\\":\\\\\\\\"2025-09-14T16:56:11.280Z\\\\\\\\",\\\\\\\\"updated_at\\\\\\\\":\\\\\\\\"2025-09-14T16:56:11.280Z\\\\\\\\",\\\\\\\\"deleted_at\\\\\\\\":null}\\\\",\\\\"metadata\\\\":null,\\\\"option_id\\\\":\\\\"opt_01K54JFN8FGHJSPC0NSTXAAC8G\\\\",\\\\"created_at\\\\":\\\\"2025-09-21T21:35:01.966Z\\\\",\\\\"updated_at\\\\":\\\\"2025-09-21T21:35:01.966Z\\\\",\\\\"deleted_at\\\\":null}\\",\\"metadata\\":null,\\"option_id\\":\\"opt_01K54JFN8FGHJSPC0NSTXAAC8G\\",\\"created_at\\":\\"2025-09-21T21:44:25.315Z\\",\\"updated_at\\":\\"2025-09-21T21:44:25.315Z\\",\\"deleted_at\\":null}\",\"metadata\":null,\"option_id\":\"opt_01K54JFN8FGHJSPC0NSTXAAC8G\",\"created_at\":\"2025-09-21T21:56:23.174Z\",\"updated_at\":\"2025-09-21T21:56:23.174Z\",\"deleted_at\":null}","metadata":null,"option_id":"opt_01K54JFN8FGHJSPC0NSTXAAC8G","created_at":"2025-09-21T21:56:36.320Z","updated_at":"2025-09-21T21:56:36.320Z","deleted_at":null},{"id":"optval_01K5Q4ERTYGNJBYX6XBQZ3XCNB","value":"{\"id\":\"optval_01K5Q4EC04DMCSWK7KQGPXKBHF\",\"value\":\"{\\"id\\":\\"optval_01K5Q3REZ2MDDSPVYP4FJ06QDJ\\",\\"value\\":\\"{\\\\"id\\\\":\\\\"optval_01K5Q378TAAGTVED8RX2ED5Z4T\\\\",\\\\"value\\\\":\\\\"{\\\\\\\\"id\\\\\\\\":\\\\\\\\"optval_01K54JFN8F74T78DCRTFWJAKH9\\\\\\\\",\\\\\\\\"value\\\\\\\\":\\\\\\\\"M\\\\\\\\",\\\\\\\\"metadata\\\\\\\\":null,\\\\\\\\"option_id\\\\\\\\":\\\\\\\\"opt_01K54JFN8FGHJSPC0NSTXAAC8G\\\\\\\\",\\\\\\\\"created_at\\\\\\\\":\\\\\\\\"2025-09-14T16:56:11.280Z\\\\\\\\",\\\\\\\\"updated_at\\\\\\\\":\\\\\\\\"2025-09-14T16:56:11.280Z\\\\\\\\",\\\\\\\\"deleted_at\\\\\\\\":null}\\\\",\\\\"metadata\\\\":null,\\\\"option_id\\\\":\\\\"opt_01K54JFN8FGHJSPC0NSTXAAC8G\\\\",\\\\"created_at\\\\":\\\\"2025-09-21T21:35:01.966Z\\\\",\\\\"updated_at\\\\":\\\\"2025-09-21T21:35:01.966Z\\\\",\\\\"deleted_at\\\\":null}\\",\\"metadata\\":null,\\"option_id\\":\\"opt_01K54JFN8FGHJSPC0NSTXAAC8G\\",\\"created_at\\":\\"2025-09-21T21:44:25.315Z\\",\\"updated_at\\":\\"2025-09-21T21:44:25.315Z\\",\\"deleted_at\\":null}\",\"metadata\":null,\"option_id\":\"opt_01K54JFN8FGHJSPC0NSTXAAC8G\",\"created_at\":\"2025-09-21T21:56:23.174Z\",\"updated_at\":\"2025-09-21T21:56:23.174Z\",\"deleted_at\":null}","metadata":null,"option_id":"opt_01K54JFN8FGHJSPC0NSTXAAC8G","created_at":"2025-09-21T21:56:36.320Z","updated_at":"2025-09-21T21:56:36.320Z","deleted_at":null},{"id":"optval_01K5Q4ERTYWE66YRKY7GY6MRJ4","value":"{\"id\":\"optval_01K5Q4EC052SJ3W84JAC9NPYE7\",\"value\":\"{\\"id\\":\\"optval_01K5Q3REZ2H5DMF57KA5WFVTC5\\",\\"value\\":\\"{\\\\"id\\\\":\\\\"optval_01K5Q378TBN3TJ2V7SF7PTZSEP\\\\",\\\\"value\\\\":\\\\"{\\\\\\\\"id\\\\\\\\":\\\\\\\\"optval_01K54JFN8FS7NJ024QTCVNTSKE\\\\\\\\",\\\\\\\\"value\\\\\\\\":\\\\\\\\"XL\\\\\\\\",\\\\\\\\"metadata\\\\\\\\":null,\\\\\\\\"option_id\\\\\\\\":\\\\\\\\"opt_01K54JFN8FGHJSPC0NSTXAAC8G\\\\\\\\",\\\\\\\\"created_at\\\\\\\\":\\\\\\\\"2025-09-14T16:56:11.280Z\\\\\\\\",\\\\\\\\"updated_at\\\\\\\\":\\\\\\\\"2025-09-14T16:56:11.280Z\\\\\\\\",\\\\\\\\"deleted_at\\\\\\\\":null}\\\\",\\\\"metadata\\\\":null,\\\\"option_id\\\\":\\\\"opt_01K54JFN8FGHJSPC0NSTXAAC8G\\\\",\\\\"created_at\\\\":\\\\"2025-09-21T21:35:01.966Z\\\\",\\\\"updated_at\\\\":\\\\"2025-09-21T21:35:01.966Z\\\\",\\\\"deleted_at\\\\":null}\\",\\"metadata\\":null,\\"option_id\\":\\"opt_01K54JFN8FGHJSPC0NSTXAAC8G\\",\\"created_at\\":\\"2025-09-21T21:44:25.315Z\\",\\"updated_at\\":\\"2025-09-21T21:44:25.315Z\\",\\"deleted_at\\":null}\",\"metadata\":null,\"option_id\":\"opt_01K54JFN8FGHJSPC0NSTXAAC8G\",\"created_at\":\"2025-09-21T21:56:23.174Z\",\"updated_at\":\"2025-09-21T21:56:23.174Z\",\"deleted_at\":null}","metadata":null,"option_id":"opt_01K54JFN8FGHJSPC0NSTXAAC8G","created_at":"2025-09-21T21:56:36.320Z","updated_at":"2025-09-21T21:56:36.320Z","deleted_at":null},{"id":"optval_01K5Q4ERTY0YH1DJYQ8G6XABF1","value":"{\"id\":\"optval_01K5Q4EC05AG3G0BPXRG82P9WY\",\"value\":\"{\\"id\\":\\"optval_01K5Q3REZ2MQ5CXBSWRZBMVEK4\\",\\"value\\":\\"{\\\\"id\\\\":\\\\"optval_01K5Q378TAR7WPYG4C8BV6WVYV\\\\",\\\\"value\\\\":\\\\"{\\\\\\\\"id\\\\\\\\":\\\\\\\\"optval_01K54JFN8FGP2MP8XTMCGNJGHG\\\\\\\\",\\\\\\\\"value\\\\\\\\":\\\\\\\\"S\\\\\\\\",\\\\\\\\"metadata\\\\\\\\":null,\\\\\\\\"option_id\\\\\\\\":\\\\\\\\"opt_01K54JFN8FGHJSPC0NSTXAAC8G\\\\\\\\",\\\\\\\\"created_at\\\\\\\\":\\\\\\\\"2025-09-14T16:56:11.280Z\\\\\\\\",\\\\\\\\"updated_at\\\\\\\\":\\\\\\\\"2025-09-14T16:56:11.280Z\\\\\\\\",\\\\\\\\"deleted_at\\\\\\\\":null}\\\\",\\\\"metadata\\\\":null,\\\\"option_id\\\\":\\\\"opt_01K54JFN8FGHJSPC0NSTXAAC8G\\\\",\\\\"created_at\\\\":\\\\"2025-09-21T21:35:01.966Z\\\\",\\\\"updated_at\\\\":\\\\"2025-09-21T21:35:01.966Z\\\\",\\\\"deleted_at\\\\":null}\\",\\"metadata\\":null,\\"option_id\\":\\"opt_01K54JFN8FGHJSPC0NSTXAAC8G\\",\\"created_at\\":\\"2025-09-21T21:44:25.315Z\\",\\"updated_at\\":\\"2025-09-21T21:44:25.315Z\\",\\"deleted_at\\":null}\",\"metadata\":null,\"option_id\":\"opt_01K54JFN8FGHJSPC0NSTXAAC8G\",\"created_at\":\"2025-09-21T21:56:23.174Z\",\"updated_at\":\"2025-09-21T21:56:23.174Z\",\"deleted_at\":null}","metadata":null,"option_id":"opt_01K54JFN8FGHJSPC0NSTXAAC8G","created_at":"2025-09-21T21:56:36.320Z","updated_at":"2025-09-21T21:56:36.320Z","deleted_at":null}]}],"tags":[],"images":[{"id":"img_01K54JFN8FWNM81BEY1DTJAW1H","url":"https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-front.png","metadata":null,"rank":0,"product_id":"prod_01K54JFN8DB18XF5W6ZP644WNJ","created_at":"2025-09-14T16:56:11.280Z","updated_at":"2025-09-14T16:56:11.280Z","deleted_at":null},{"id":"img_01K54JFN8FTC4RCVY7W0HDA6NV","url":"https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-back.png","metadata":null,"rank":1,"product_id":"prod_01K54JFN8DB18XF5W6ZP644WNJ","created_at":"2025-09-14T16:56:11.280Z","updated_at":"2025-09-14T16:56:11.280Z","deleted_at":null}],"variants":[{"id":"variant_01K54JFN9KBEEZ1X0NMVQRJVKR","title":"M","sku":"SHORTS-M","barcode":null,"ean":null,"upc":null,"allow_backorder":false,"manage_inventory":true,"hs_code":null,"origin_country":null,"mid_code":null,"material":null,"weight":null,"length":null,"height":null,"width":null,"metadata":null,"variant_rank":0,"product_id":"prod_01K54JFN8DB18XF5W6ZP644WNJ","created_at":"2025-09-14T16:56:11.316Z","updated_at":"2025-09-14T16:56:11.316Z","deleted_at":null,"options":[],"prices":[{"id":"price_01K54JFNAKZEH0GXWAPX29XG2Q","amount":10,"currency_code":"eur","min_quantity":null,"max_quantity":null,"variant_id":"variant_01K54JFN9KBEEZ1X0NMVQRJVKR","created_at":"2025-09-14T16:56:11.348Z","updated_at":"2025-09-14T16:56:11.348Z","rules":{}},{"id":"price_01K54JFNAK3BN9HTY3375YNXD1","amount":15,"currency_code":"usd","min_quantity":null,"max_quantity":null,"variant_id":"variant_01K54JFN9KBEEZ1X0NMVQRJVKR","created_at":"2025-09-14T16:56:11.348Z","updated_at":"2025-09-14T16:56:11.348Z","rules":{}}]},{"id":"variant_01K54JFN9KDT7JJSKPE633VAVR","title":"S","sku":"SHORTS-S","barcode":null,"ean":null,"upc":null,"allow_backorder":false,"manage_inventory":true,"hs_code":null,"origin_country":null,"mid_code":null,"material":null,"weight":null,"length":null,"height":null,"width":null,"metadata":null,"variant_rank":0,"product_id":"prod_01K54JFN8DB18XF5W6ZP644WNJ","created_at":"2025-09-14T16:56:11.316Z","updated_at":"2025-09-14T16:56:11.316Z","deleted_at":null,"options":[],"prices":[{"id":"price_01K54JFNAK6QF2TX5BYE61CMJE","amount":10,"currency_code":"eur","min_quantity":null,"max_quantity":null,"variant_id":"variant_01K54JFN9KDT7JJSKPE633VAVR","created_at":"2025-09-14T16:56:11.348Z","updated_at":"2025-09-14T16:56:11.348Z","rules":{}},{"id":"price_01K54JFNAK34HX2T0YQVE455NM","amount":15,"currency_code":"usd","min_quantity":null,"max_quantity":null,"variant_id":"variant_01K54JFN9KDT7JJSKPE633VAVR","created_at":"2025-09-14T16:56:11.348Z","updated_at":"2025-09-14T16:56:11.348Z","rules":{}}]},{"id":"variant_01K54JFN9M5MRP859YGP1AX6WW","title":"XL","sku":"SHORTS-XL","barcode":null,"ean":null,"upc":null,"allow_backorder":false,"manage_inventory":true,"hs_code":null,"origin_country":null,"mid_code":null,"material":null,"weight":null,"length":null,"height":null,"width":null,"metadata":null,"variant_rank":0,"product_id":"prod_01K54JFN8DB18XF5W6ZP644WNJ","created_at":"2025-09-14T16:56:11.316Z","updated_at":"2025-09-14T16:56:11.316Z","deleted_at":null,"options":[],"prices":[{"id":"price_01K54JFNAKY9FR5FRFFBS4F7EW","amount":10,"currency_code":"eur","min_quantity":null,"max_quantity":null,"variant_id":"variant_01K54JFN9M5MRP859YGP1AX6WW","created_at":"2025-09-14T16:56:11.348Z","updated_at":"2025-09-14T16:56:11.348Z","rules":{}},{"id":"price_01K54JFNAKPYKCG4YF8VYN66NZ","amount":15,"currency_code":"usd","min_quantity":null,"max_quantity":null,"variant_id":"variant_01K54JFN9M5MRP859YGP1AX6WW","created_at":"2025-09-14T16:56:11.348Z","updated_at":"2025-09-14T16:56:11.348Z","rules":{}}]},{"id":"variant_01K54JFN9MY524Z853KWKASC6N","title":"L","sku":"SHORTS-L","barcode":null,"ean":null,"upc":null,"allow_backorder":false,"manage_inventory":true,"hs_code":null,"origin_country":null,"mid_code":null,"material":null,"weight":null,"length":null,"height":null,"width":null,"metadata":null,"variant_rank":0,"product_id":"prod_01K54JFN8DB18XF5W6ZP644WNJ","created_at":"2025-09-14T16:56:11.316Z","updated_at":"2025-09-14T16:56:11.316Z","deleted_at":null,"options":[],"prices":[{"id":"price_01K54JFNAKXQ7FYG7NFNY7FNFE","amount":10,"currency_code":"eur","min_quantity":null,"max_quantity":null,"variant_id":"variant_01K54JFN9MY524Z853KWKASC6N","created_at":"2025-09-14T16:56:11.348Z","updated_at":"2025-09-14T16:56:11.348Z","rules":{}},{"id":"price_01K54JFNAKNQY8NKW9E2PMMFFT","amount":15,"currency_code":"usd","min_quantity":null,"max_quantity":null,"variant_id":"variant_01K54JFN9MY524Z853KWKASC6N","created_at":"2025-09-14T16:56:11.348Z","updated_at":"2025-09-14T16:56:11.348Z","rules":{}}]}],"sales_channels":[{"id":"sc_01K54JFKGZ4GVJQG89J9NWJST7","name":"Default Sales Channel","description":"Created by Medusa","is_disabled":false,"metadata":null,"created_at":"2025-09-14T16:56:09.503Z","updated_at":"2025-09-14T16:56:09.503Z","deleted_at":null}]}}%


curl 'http://localhost:9000/admin/products?fields=+brand.*' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rvcl9pZCI6InVzZXJfMDFLNTRKR1pIUkQ5WFgxRTVYOTgwREpHQ0ciLCJhY3Rvcl90eXBlIjoidXNlciIsImF1dGhfaWRlbnRpdHlfaWQiOiJhdXRoaWRfMDFLNTRKR1pIMkNWTUQ4UFc1OU5ZSlBBOTYiLCJhcHBfbWV0YWRhdGEiOnsidXNlcl9pZCI6InVzZXJfMDFLNTRKR1pIUkQ5WFgxRTVYOTgwREpHQ0cifSwiaWF0IjoxNzU4NDcwNjM5LCJleHAiOjE3NTg1NTcwMzl9.njI5yWGH0PFiXa1Z_lpqRffKS2r_tU3tGuEJ6Exu_P0'



curl 'http://localhost:9000/admin/products/prod_01K54JFN8DB18XF5W6ZP644WNJ?fields=*,brand.*' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rvcl9pZCI6InVzZXJfMDFLNTRKR1pIUkQ5WFgxRTVYOTgwREpHQ0ciLCJhY3Rvcl90eXBlIjoidXNlciIsImF1dGhfaWRlbnRpdHlfaWQiOiJhdXRoaWRfMDFLNTRKR1pIMkNWTUQ4UFc1OU5ZSlBBOTYiLCJhcHBfbWV0YWRhdGEiOnsidXNlcl9pZCI6InVzZXJfMDFLNTRKR1pIUkQ5WFgxRTVYOTgwREpHQ0cifSwiaWF0IjoxNzU4NTczNTkxLCJleHAiOjE3NTg2NTk5OTF9.bIavnNmldR0UJ1mTGRc1g3NtV1UjIpYYtCe3YbJUJ98'


curl 'http://localhost:9000/admin/products/prod_01K54JFN8DB18XF5W6ZP644WNJ?fields=+brand.*' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rvcl9pZCI6InVzZXJfMDFLNTRKR1pIUkQ5WFgxRTVYOTgwREpHQ0ciLCJhY3Rvcl90eXBlIjoidXNlciIsImF1dGhfaWRlbnRpdHlfaWQiOiJhdXRoaWRfMDFLNTRKR1pIMkNWTUQ4UFc1OU5ZSlBBOTYiLCJhcHBfbWV0YWRhdGEiOnsidXNlcl9pZCI6InVzZXJfMDFLNTRKR1pIUkQ5WFgxRTVYOTgwREpHQ0cifSwiaWF0IjoxNzU4NTczNTkxLCJleHAiOjE3NTg2NTk5OTF9.bIavnNmldR0UJ1mTGRc1g3NtV1UjIpYYtCe3YbJUJ98'

curl 'http://localhost:9000/admin/products/prod_01K54JFN8DB18XF5W6ZP644WNJ?fields=*brand' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rvcl9pZCI6InVzZXJfMDFLNTRKR1pIUkQ5WFgxRTVYOTgwREpHQ0ciLCJhY3Rvcl90eXBlIjoidXNlciIsImF1dGhfaWRlbnRpdHlfaWQiOiJhdXRoaWRfMDFLNTRKR1pIMkNWTUQ4UFc1OU5ZSlBBOTYiLCJhcHBfbWV0YWRhdGEiOnsidXNlcl9pZCI6InVzZXJfMDFLNTRKR1pIUkQ5WFgxRTVYOTgwREpHQ0cifSwiaWF0IjoxNzU4NTczNTkxLCJleHAiOjE3NTg2NTk5OTF9.bIavnNmldR0UJ1mTGRc1g3NtV1UjIpYYtCe3YbJUJ98'
