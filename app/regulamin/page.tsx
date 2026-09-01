import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";

export const metadata: Metadata = { title: "Regulamin", description: "Regulamin sklepu Goya." };

export default function Page() {
  return (
    <ContentPage eyebrow="Informacje" title="Regulamin sklepu" updated="8 lipca 2026">
      <p>
        To wersja pokazowa sklepu Goya – nie prowadzimy realnej sprzedaży ani wysyłki. Poniższy regulamin pełni funkcję
        poglądową i pokazuje, jak wyglądałyby zasady zakupów w docelowym sklepie.
      </p>

      <h2>1. Postanowienia ogólne</h2>
      <p>
        Sklep internetowy Goya dostępny pod adresem goya.pl prowadzi sprzedaż okularów przeciwsłonecznych i opraw
        korekcyjnych. Złożenie zamówienia oznacza akceptację niniejszego regulaminu.
      </p>

      <h2>2. Zamówienia</h2>
      <p>
        Zamówienia można składać przez całą dobę. Umowa sprzedaży zostaje zawarta w chwili potwierdzenia zamówienia
        wiadomością e-mail. Ceny podane są w złotych i zawierają podatek VAT.
      </p>

      <h2>3. Dostawa i płatność</h2>
      <ul>
        <li>Wysyłka kurierem lub do paczkomatu, realizacja w 1-2 dni robocze.</li>
        <li>Darmowa wysyłka dla każdego zamówienia.</li>
        <li>
          Płatności online obsługuje Stripe Payments Europe Ltd.: BLIK, Przelewy24, karta płatnicza, Apple Pay i Google
          Pay. Nie oferujemy płatności za pobraniem.
        </li>
      </ul>

      <h2>4. Zwroty i reklamacje</h2>
      <p>
        Masz 30 dni na odstąpienie od umowy bez podania przyczyny. Szczegóły opisujemy na stronie{" "}
        <a href="/zwroty" className="link-underline text-ink">Dostawa i zwroty</a>. Reklamacje rozpatrujemy w terminie 14 dni.
      </p>

      <h2>5. Kontakt</h2>
      <p>
        W sprawach związanych z zamówieniem napisz na <a href="mailto:kontakt@goya.pl" className="link-underline text-ink">kontakt@goya.pl</a>.
      </p>
    </ContentPage>
  );
}
