# Płatności — Stripe Checkout

Stan na 1 września 2026. Kod jest gotowy; brakuje wyłącznie kluczy z konta klienta.

## Jak to działa

```
/kasa  →  POST /api/checkout  →  Stripe Checkout (BLIK / P24 / karta / Apple / Google Pay)
                                        │
                                        ├─ klient wraca na /kasa/sukces?session_id=…  (tylko widok)
                                        └─ Stripe woła POST /api/stripe/webhook       (jedyne źródło prawdy)
                                                          │
                                                          └─ arkusz „Zamówienia" + Supabase (fallback)
```

Trzy rzeczy, które trzymają to w ryzach:

1. **Ceny liczy serwer.** Przeglądarka wysyła wyłącznie `slug`, `variationId` i `qty`.
   `lib/order.ts` wycenia koszyk z katalogu — podmiana ceny w localStorage nic nie daje.
   (Poprzednia wersja `/api/order` przyjmowała ceny z requestu i została usunięta.)
2. **Zamówienie powstaje dopiero po zapłacie.** Webhook jest jedynym miejscem, które zapisuje
   zamówienie. Porzucone koszyki zostają w Stripe, arkusz zawiera tylko opłacone.
3. **BLIK i Przelewy24 rozliczają się asynchronicznie.** `checkout.session.completed` przychodzi
   ze statusem `unpaid`, a pieniądze potwierdza dopiero `checkout.session.async_payment_succeeded`.
   Obsługa tylko pierwszego zdarzenia to najczęstszy sposób na ciche gubienie polskich płatności.
   Powtórki zdarzeń blokuje tabela `goya_payments` (klucz główny = `session_id`).

## Zmienne środowiskowe (Vercel → Settings → Environment Variables)

| Zmienna | Skąd | Uwagi |
|---|---|---|
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys | `sk_test_…` do testów, `sk_live_…` na produkcji |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks → endpoint | `whsec_…`, inny dla trybu testowego i live |
| `NEXT_PUBLIC_SITE_URL` | — | `https://okularygoya.pl`, dopiero gdy domena odpowiada |
| `GOYA_SHEETS_WEBHOOK_URL` | Apps Script → Wdróż → /exec | **dziś brakuje w Vercelu** — bez tego zamówienia lądują tylko w Supabase |

## Uruchomienie

1. Stripe → **Developers → Webhooks → Add endpoint**
   - URL: `https://okularygoya.pl/api/stripe/webhook`
   - Zdarzenia: `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
     `checkout.session.async_payment_failed`
   - Skopiuj `whsec_…` do Vercela.
2. Stripe → **Settings → Payments → Payment methods**: włącz BLIK, Przelewy24, karty, Apple/Google Pay.
3. Stripe → **Settings → Payment method domains**: dodaj `okularygoya.pl` (bez tego Apple/Google Pay się nie pokażą).
4. Test w trybie testowym: karta `4242 4242 4242 4242`, BLIK kod `777777` (sukces) i `999999` (odrzucenie).
   Sprawdź, czy wiersz pojawia się w arkuszu dokładnie raz.
5. Podmień klucze na `sk_live_` / `whsec_` z trybu live i powtórz jedno prawdziwe zamówienie na małą kwotę.

## Czego jeszcze nie ma

- Maila z potwierdzeniem od nas (Stripe wysyła własne potwierdzenie płatności, jeśli włączone w ustawieniach).
- Kontroli stanów magazynowych w momencie zapłaty — sprawdzamy je przy tworzeniu sesji, nie przy webhooku.
- Faktur i integracji z InPost.
