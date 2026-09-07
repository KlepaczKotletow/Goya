import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";
import { SELLER, SITE } from "@/content/site";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: `Jak sklep ${SITE.domain} przetwarza dane osobowe – cele, podstawy prawne, odbiorcy danych i prawa użytkownika.`,
  alternates: { canonical: "/polityka-prywatnosci" },
};

export default function Page() {
  return (
    <ContentPage eyebrow="Informacje" title="Polityka prywatności" updated="7 września 2026">
      <p>
        Polityka opisuje, jakie dane osobowe zbieramy w sklepie {SITE.domain}, w jakim celu i na jakiej podstawie
        prawnej, komu je przekazujemy oraz jakie prawa przysługują osobom, których dane dotyczą. Podstawą jest
        rozporządzenie Parlamentu Europejskiego i Rady (UE) 2016/679, dalej „RODO”.
      </p>

      <h2>Administrator danych</h2>
      <p>
        Administratorem danych jest {SELLER.person}, prowadzący działalność gospodarczą pod firmą {SELLER.company}, NIP{" "}
        {SELLER.nip}, REGON {SELLER.regon}, adres do doręczeń: {SELLER.mailingAddress}.
      </p>
      <p>
        Kontakt w sprawach ochrony danych:{" "}
        <a href={`mailto:${SITE.email}`} className="link-underline text-ink">{SITE.email}</a> lub telefonicznie:{" "}
        {SELLER.phones.join(", ")} (w godzinach {SELLER.hours}). Nie powołaliśmy inspektora ochrony danych.
      </p>

      <h2>Jakie dane zbieramy</h2>
      <ul>
        <li><strong>Dane zamówienia:</strong> imię i nazwisko, adres e-mail, numer telefonu, adres dostawy albo wskazany punkt odbioru, treść zamówienia i jego wartość.</li>
        <li><strong>Dane rozliczeniowe:</strong> informacja o dokonanej płatności. Nie przechowujemy i nie mamy dostępu do numeru karty płatniczej – obsługuje ją wyłącznie operator płatności.</li>
        <li><strong>Dane firmowe:</strong> nazwa firmy i NIP, jeżeli Klient prosi o fakturę.</li>
        <li><strong>Adres e-mail</strong> zapisany do newslettera, jeżeli wyrażono na to zgodę.</li>
        <li><strong>Dane techniczne</strong> zapisywane automatycznie przez serwer, w tym adres IP i informacje o przeglądarce, w logach serwera.</li>
      </ul>
      <p>Podanie danych jest dobrowolne, ale niezbędne do zawarcia i wykonania umowy sprzedaży.</p>

      <h2>Cele i podstawy prawne</h2>
      <ul>
        <li><strong>Realizacja zamówienia</strong> – art. 6 ust. 1 lit. b RODO (wykonanie umowy).</li>
        <li><strong>Obowiązki księgowe i podatkowe</strong> – art. 6 ust. 1 lit. c RODO (obowiązek prawny).</li>
        <li><strong>Rozpatrywanie reklamacji i odstąpień od umowy</strong> – art. 6 ust. 1 lit. b oraz lit. c RODO.</li>
        <li><strong>Ustalenie, dochodzenie i obrona roszczeń</strong> – art. 6 ust. 1 lit. f RODO (uzasadniony interes administratora).</li>
        <li><strong>Wysyłka newslettera</strong> – art. 6 ust. 1 lit. a RODO (zgoda), którą można wycofać w każdej chwili.</li>
        <li><strong>Bezpieczeństwo i poprawne działanie sklepu</strong> – art. 6 ust. 1 lit. f RODO.</li>
      </ul>

      <h2>Odbiorcy danych</h2>
      <p>Dane przekazujemy wyłącznie podmiotom, które są potrzebne do realizacji zamówienia:</p>
      <ul>
        <li><strong>Stripe Payments Europe, Ltd.</strong> – obsługa płatności online.</li>
        <li><strong>InPost S.A.</strong> oraz firmy kurierskie – doręczenie przesyłki.</li>
        <li><strong>Vercel Inc.</strong> – hosting sklepu.</li>
        <li><strong>Supabase</strong> oraz <strong>Google Ireland Ltd.</strong> – przechowywanie rejestru zamówień i zapisów do newslettera.</li>
        <li>Biuro rachunkowe oraz organy publiczne, gdy obowiązek przekazania danych wynika z przepisów prawa.</li>
      </ul>
      <p>
        Część usługodawców może przetwarzać dane poza Europejskim Obszarem Gospodarczym. Odbywa się to na podstawie
        decyzji Komisji Europejskiej stwierdzającej odpowiedni stopień ochrony albo standardowych klauzul umownych.
        Danych nie sprzedajemy i nie udostępniamy w celach marketingowych podmiotom trzecim.
      </p>

      <h2>Jak długo przechowujemy dane</h2>
      <ul>
        <li>Dane zamówień – 5 lat, licząc od końca roku podatkowego, w którym zamówienie zostało zrealizowane, zgodnie z przepisami o rachunkowości.</li>
        <li>Dane potrzebne do obrony roszczeń – do upływu terminu przedawnienia.</li>
        <li>Adres zapisany do newslettera – do wycofania zgody.</li>
        <li>Logi serwera – przez okres wynikający z polityki dostawcy hostingu.</li>
      </ul>

      <h2>Twoje prawa</h2>
      <p>Przysługuje Ci prawo do:</p>
      <ul>
        <li>dostępu do swoich danych oraz otrzymania ich kopii,</li>
        <li>sprostowania danych nieprawidłowych lub niekompletnych,</li>
        <li>usunięcia danych, o ile nie stoi temu na przeszkodzie obowiązek prawny,</li>
        <li>ograniczenia przetwarzania,</li>
        <li>przenoszenia danych,</li>
        <li>wniesienia sprzeciwu wobec przetwarzania opartego na uzasadnionym interesie,</li>
        <li>wycofania zgody w dowolnym momencie, bez wpływu na zgodność z prawem przetwarzania sprzed jej wycofania.</li>
      </ul>
      <p>
        Aby skorzystać z tych praw, napisz na{" "}
        <a href={`mailto:${SITE.email}`} className="link-underline text-ink">{SITE.email}</a>. Przysługuje Ci również
        prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa.
      </p>

      <h2>Pliki cookies i pamięć przeglądarki</h2>
      <p>
        Sklep nie stosuje plików cookies i nie korzysta z narzędzi analitycznych ani reklamowych – nie profilujemy
        użytkowników i nie śledzimy ich na innych stronach.
      </p>
      <p>
        Zawartość koszyka i lista ulubionych zapisywane są w pamięci lokalnej przeglądarki (localStorage). Dane te
        pozostają na Twoim urządzeniu, nie są nam przesyłane i możesz je w każdej chwili usunąć, czyszcząc dane witryny
        w ustawieniach przeglądarki.
      </p>

      <h2>Zautomatyzowane podejmowanie decyzji</h2>
      <p>Twoje dane nie służą do zautomatyzowanego podejmowania decyzji ani do profilowania.</p>
    </ContentPage>
  );
}
