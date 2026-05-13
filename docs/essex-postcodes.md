# Essex Postcode Areas (Free Local Delivery)

These postcode area prefixes qualify for **free local Essex delivery** at checkout. Any postcode starting with these letters is treated as Essex; everything else is charged £5 standard UK delivery (or free if the order is £75+).

| Prefix | Royal Mail postcode area | Post-towns covered |
|--------|--------------------------|-------------------|
| `CM`   | Chelmsford               | Chelmsford, Brentwood, Billericay, Braintree, Saffron Walden, Witham, Harlow (parts), Epping (parts), Sawbridgeworth, Great Dunmow |
| `CO`   | Colchester               | Colchester, Clacton-on-Sea, Frinton-on-Sea, Walton-on-the-Naze, Halstead, Sudbury (parts), Bures (parts) |
| `SS`   | Southend-on-Sea          | Southend-on-Sea, Westcliff-on-Sea, Leigh-on-Sea, Hockley, Rayleigh, Wickford, Basildon, Benfleet, Stanford-le-Hope, Canvey Island |
| `IG`   | Ilford (partly Essex)    | Ilford, Barking, Chigwell, Buckhurst Hill, Loughton, Woodford Green |
| `RM`   | Romford (partly Essex)   | Romford, Hornchurch, Upminster, Rainham, Dagenham, South Ockendon, Grays |

## Where this list lives in the code

- `src/app/checkout/page.tsx` — `ESSEX_POSTCODE_PREFIXES` constant + `isEssexPostcode()` helper
- `src/app/api/orders/route.ts` — server-side re-check (in case someone bypasses the client)

## To change the list

1. Edit the `ESSEX_POSTCODE_PREFIXES` array in **both** files above
2. Update this markdown
3. Commit and push

## Postcode matching rules

The match is **prefix-based, case-insensitive, whitespace-tolerant**:
- `CM1 1AB`, `cm1 1ab`, `cm11ab` all match `CM`
- The validation only looks at the alphabetic prefix at the start of the postcode

## Notes

- IG and RM areas straddle Greater London and Essex. They are included as "free delivery" since the post-town is officially within or bordering Essex. If you'd prefer to exclude them, remove `IG` and/or `RM` from the array.
- For pinpoint accuracy you could integrate with a UK postcode API (e.g. `postcodes.io`) to look up the actual local authority — but for a flat-rate free/£5 split, prefix matching is sufficient and reliable.
