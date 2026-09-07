import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";
import { SELLER, SITE } from "@/content/site";

export const metadata: Metadata = {
  title: "Dostawa i zwroty",
  description: "Darmowa dostawa do paczkomatu lub kurierem, 30 dni na zwrot bez podania przyczyny i 24 miesiące gwarancji.",
  alternates: { canonical: "/zwroty" },
};

export default function Page() {
  return (
    <ContentPage eyebrow="Informacje" title="Dostawa i zwroty" updated="7 września 2026">
      <p>
        Wszystko, co trzeba wiedzieć o tym, jak do Ciebie trafiamy i co zrobić, gdy okulary jednak nie pasują. Pełne
        zasady znajdziesz w <a href="/regulamin" className="link-underline text-ink">regulaminie</a>.
      </p>

      <h2>Dostawa</h2>
      <ul>
        <li>Darmowa dostawa każdego zamówienia – bez progu kwotowego.</li>
        <li>Do wyboru: Paczkomat InPost albo kurier pod wskazany adres.</li>
        <li>Paczkę nadajemy w 1–2 dni robocze od zaksięgowania płatności. Zwykle czekasz 2–4 dni robocze.</li>
        <li>Wysyłamy na terenie Polski.</li>
        <li>Do każdej pary dołączamy twarde etui, ściereczkę z mikrofibry i kartę gwarancyjną.</li>
      </ul>

      <h2>Zwrot bez podania przyczyny</h2>
      <p>
        Masz 30 dni od odebrania przesyłki na odstąpienie od umowy – nie musisz tłumaczyć dlaczego. Ustawa daje 14 dni,
        my wydłużamy ten termin do 30.
      </p>
      <ul>
        <li>Wystarczy, że wyślesz nam oświadczenie o odstąpieniu, zanim upłynie 30 dni.</li>
        <li>Okulary odeślij w ciągu kolejnych 14 dni, razem z etui, w stanie pozwalającym na dalszą sprzedaż.</li>
        <li>Pieniądze – łącznie z kosztem dostawy – zwracamy w ciągu 14 dni od otrzymania oświadczenia, tą samą drogą, którą zapłaciłeś. Możemy poczekać ze zwrotem, aż paczka do nas dotrze.</li>
        <li>Możesz przymierzyć okulary tak, jak zrobiłbyś to w sklepie stacjonarnym. Za ślady użytkowania wykraczające poza przymiarkę odpowiadasz finansowo.</li>
      </ul>

      <h2>Jak zwrócić okulary</h2>
      <ul>
        <li>
          Napisz na <a href={`mailto:${SITE.email}`} className="link-underline text-ink">{SITE.email}</a> i podaj numer
          zamówienia – odeślemy etykietę zwrotną.
        </li>
        <li>Zapakuj okulary do twardego etui, a etui do kartonu.</li>
        <li>Nadaj paczkę na adres: {SELLER.company}, {SELLER.mailingAddress}.</li>
        <li>O zwrocie pieniędzy poinformujemy Cię mailem.</li>
      </ul>

      <h2>Reklamacja i gwarancja</h2>
      <p>
        Na każdą parę dajemy 24 miesiące gwarancji. Niezależnie od niej odpowiadamy przez 2 lata za niezgodność towaru
        z umową – to uprawnienie ustawowe i gwarancja go nie ogranicza.
      </p>
      <ul>
        <li>Reklamację zgłoś na <a href={`mailto:${SITE.email}`} className="link-underline text-ink">{SITE.email}</a>, dołączając numer zamówienia i opis usterki.</li>
        <li>Odpowiadamy w ciągu 14 dni.</li>
        <li>Możesz żądać naprawy albo wymiany, a gdy to niemożliwe – obniżenia ceny albo odstąpienia od umowy.</li>
        <li>Gwarancja nie obejmuje uszkodzeń mechanicznych, zarysowań powstałych przy noszeniu ani naturalnego zużycia.</li>
      </ul>

      <h2>Kontakt</h2>
      <p>
        {SELLER.phones.join(" lub ")}, od poniedziałku do piątku w godzinach {SELLER.hours}. Mailowo:{" "}
        <a href={`mailto:${SITE.email}`} className="link-underline text-ink">{SITE.email}</a>.
      </p>
    </ContentPage>
  );
}
