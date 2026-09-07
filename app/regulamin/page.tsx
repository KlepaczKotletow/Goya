import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";
import { SELLER, SITE } from "@/content/site";

export const metadata: Metadata = {
  title: "Regulamin",
  description: `Regulamin sklepu ${SITE.domain} – zamówienia, płatności, dostawa, odstąpienie od umowy i reklamacje.`,
  alternates: { canonical: "/regulamin" },
};

export default function Page() {
  return (
    <ContentPage eyebrow="Informacje" title="Regulamin sklepu" updated="7 września 2026">
      <p>
        Regulamin określa zasady korzystania ze sklepu internetowego {SITE.domain} oraz warunki zawierania umów
        sprzedaży za jego pośrednictwem. Złożenie zamówienia wymaga akceptacji Regulaminu.
      </p>

      <h2>§1 Sprzedawca</h2>
      <p>
        Sklep prowadzi {SELLER.person}, prowadzący działalność gospodarczą pod firmą {SELLER.company}, wpisaną do
        Centralnej Ewidencji i Informacji o Działalności Gospodarczej.
      </p>
      <ul>
        <li>Adres rejestracji działalności: {SELLER.registeredAddress}.</li>
        <li>Adres do doręczeń i miejsce wykonywania działalności: {SELLER.mailingAddress}.</li>
        <li>NIP: {SELLER.nip}, REGON: {SELLER.regon}.</li>
        <li>
          Adres e-mail: <a href={`mailto:${SITE.email}`} className="link-underline text-ink">{SITE.email}</a>.
        </li>
        <li>Telefon: {SELLER.phones.join(", ")} – od poniedziałku do piątku, w godzinach {SELLER.hours}.</li>
      </ul>
      <p>
        Powyższy adres e-mail jest jednocześnie punktem kontaktowym w rozumieniu rozporządzenia Parlamentu Europejskiego
        i Rady (UE) 2022/2065 (akt o usługach cyfrowych). Za jego pośrednictwem ze Sprzedawcą mogą kontaktować się także
        organy państw członkowskich Unii Europejskiej, Komisja Europejska oraz Rada Usług Cyfrowych. Komunikacja odbywa
        się w języku polskim.
      </p>

      <h2>§2 Definicje</h2>
      <ul>
        <li><strong>Sklep</strong> – sklep internetowy dostępny pod adresem {SITE.domain}.</li>
        <li><strong>Sprzedawca</strong> – podmiot wskazany w §1.</li>
        <li><strong>Klient</strong> – osoba fizyczna, osoba prawna albo jednostka organizacyjna nieposiadająca osobowości prawnej, która składa zamówienie w Sklepie.</li>
        <li><strong>Konsument</strong> – osoba fizyczna zawierająca ze Sprzedawcą umowę niezwiązaną bezpośrednio z jej działalnością gospodarczą lub zawodową.</li>
        <li><strong>Przedsiębiorca na prawach konsumenta</strong> – osoba fizyczna zawierająca umowę związaną z jej działalnością gospodarczą, która nie ma dla niej charakteru zawodowego.</li>
        <li><strong>Produkt</strong> – okulary przeciwsłoneczne albo oprawa korekcyjna oferowane w Sklepie.</li>
        <li><strong>Umowa sprzedaży</strong> – umowa zawierana między Klientem a Sprzedawcą za pośrednictwem Sklepu.</li>
        <li><strong>Dni robocze</strong> – dni od poniedziałku do piątku, z wyłączeniem dni ustawowo wolnych od pracy.</li>
      </ul>

      <h2>§3 Zakres działalności Sklepu</h2>
      <p>
        Sklep oferuje gotowe okulary przeciwsłoneczne z filtrem polaryzacyjnym oraz oprawy korekcyjne. Oprawy korekcyjne
        sprzedawane są bez soczewek. Sklep nie prowadzi badań wzroku ani nie montuje soczewek na receptę – dobór i
        montaż soczewek Klient realizuje we własnym zakresie u wybranego optyka.
      </p>
      <p>
        Każdy Produkt jest opisany w katalogu Sklepu w zakresie rodzaju, parametrów i kompletności zestawu, wraz z
        informacją o cenie i dostępności. Do każdej pary Sprzedawca dołącza twarde etui, ściereczkę z mikrofibry oraz
        kartę gwarancyjną.
      </p>
      <p>
        Okulary przeciwsłoneczne oferowane w Sklepie zapewniają ochronę przed promieniowaniem UVA i UVB, a kategoria
        filtra jest podana w opisie Produktu. Okulary przeciwsłoneczne nie służą korekcji wzroku.
      </p>

      <h2>§4 Wymagania techniczne</h2>
      <p>
        Do korzystania ze Sklepu potrzebne są: urządzenie z dostępem do internetu, aktualna przeglądarka z obsługą
        JavaScriptu i pamięci lokalnej oraz aktywne konto poczty elektronicznej. Koszyk zapisywany jest w pamięci
        przeglądarki, więc jej wyłączenie uniemożliwi złożenie zamówienia. Sprzedawca nie odpowiada za zakłócenia
        wynikające z nieprawidłowego działania sprzętu lub łącza Klienta.
      </p>

      <h2>§5 Składanie zamówień</h2>
      <ul>
        <li>Zamówienia można składać przez całą dobę, we wszystkie dni roku.</li>
        <li>Zakup nie wymaga zakładania konta – zamówienie składa się przez formularz zamówienia.</li>
        <li>Klient dodaje Produkty do koszyka, podaje dane potrzebne do realizacji zamówienia, wybiera sposób dostawy i płatności, a następnie potwierdza zamówienie przyciskiem wskazującym obowiązek zapłaty.</li>
        <li>Umowa sprzedaży zostaje zawarta z chwilą potwierdzenia przyjęcia zamówienia przez Sprzedawcę wiadomością e-mail.</li>
        <li>Klient odpowiada za poprawność podanych danych. Błędny adres lub nieprawidłowo wskazany punkt odbioru może uniemożliwić doręczenie przesyłki.</li>
      </ul>

      <h2>§6 Ceny i płatności</h2>
      <ul>
        <li>Ceny podane są w złotych i zawierają podatek VAT.</li>
        <li>Wiążąca jest cena widoczna przy Produkcie w chwili składania zamówienia.</li>
        <li>Przy Produktach objętych obniżką Sprzedawca podaje najniższą cenę z 30 dni poprzedzających obniżkę.</li>
        <li>Płatności online obsługuje Stripe Payments Europe, Ltd. Dostępne metody: BLIK, Przelewy24, karta płatnicza, Apple Pay oraz Google Pay.</li>
        <li>Sprzedawca nie oferuje płatności za pobraniem.</li>
        <li>Brak zapłaty w ciągu 3 dni roboczych od złożenia zamówienia oznacza jego anulowanie.</li>
        <li>Do każdego zamówienia wystawiany jest dowód sprzedaży. Fakturę na dane firmy Sprzedawca wystawia na żądanie zgłoszone przy składaniu zamówienia.</li>
      </ul>

      <h2>§7 Dostawa</h2>
      <ul>
        <li>Dostawa jest bezpłatna niezależnie od wartości zamówienia.</li>
        <li>Zamówienia realizujemy na terytorium Rzeczypospolitej Polskiej.</li>
        <li>Dostępne sposoby dostawy: Paczkomat InPost oraz kurier pod wskazany adres.</li>
        <li>Zamówienie nadajemy w ciągu 1–2 dni roboczych od zaksięgowania płatności. Łączny czas oczekiwania to zwykle 2–4 dni robocze.</li>
        <li>Ryzyko przypadkowej utraty lub uszkodzenia Produktu przechodzi na Konsumenta z chwilą wydania mu przesyłki.</li>
      </ul>

      <h2>§8 Odstąpienie od umowy</h2>
      <p>
        Konsument oraz Przedsiębiorca na prawach konsumenta może odstąpić od umowy bez podania przyczyny w terminie 30
        dni od dnia objęcia Produktu w posiadanie. Termin ustawowy wynosi 14 dni – Sprzedawca wydłuża go dobrowolnie do
        30 dni.
      </p>
      <ul>
        <li>
          Oświadczenie o odstąpieniu wystarczy wysłać na adres{" "}
          <a href={`mailto:${SITE.email}`} className="link-underline text-ink">{SITE.email}</a> przed upływem terminu.
          Skorzystanie z ustawowego wzoru formularza jest możliwe, lecz nieobowiązkowe.
        </li>
        <li>Produkt należy odesłać na adres do doręczeń wskazany w §1 niezwłocznie, nie później niż w ciągu 14 dni od złożenia oświadczenia.</li>
        <li>Sprzedawca zwraca otrzymane płatności, w tym koszty dostawy, w ciągu 14 dni od otrzymania oświadczenia, tym samym sposobem zapłaty. Sprzedawca może wstrzymać się ze zwrotem do chwili otrzymania Produktu.</li>
        <li>Konsument ponosi bezpośrednie koszty zwrotu Produktu, chyba że Sprzedawca udostępni etykietę zwrotną.</li>
        <li>Konsument odpowiada za zmniejszenie wartości Produktu wynikające z korzystania z niego w sposób wykraczający poza konieczny do stwierdzenia jego charakteru, cech i funkcjonowania.</li>
      </ul>

      <h2>§9 Reklamacje</h2>
      <p>
        Sprzedawca odpowiada wobec Konsumenta za brak zgodności Produktu z umową na zasadach określonych w ustawie o
        prawach konsumenta, przez 2 lata od dostarczenia Produktu. Niezależnie od tej odpowiedzialności Sprzedawca
        udziela na każdą parę okularów 24-miesięcznej gwarancji jakości.
      </p>
      <ul>
        <li>
          Reklamację należy zgłosić na adres{" "}
          <a href={`mailto:${SITE.email}`} className="link-underline text-ink">{SITE.email}</a>, podając numer
          zamówienia i opis nieprawidłowości.
        </li>
        <li>Sprzedawca rozpatruje reklamację w ciągu 14 dni i informuje Klienta o sposobie jej załatwienia.</li>
        <li>W razie braku zgodności Produktu z umową Konsument może żądać naprawy albo wymiany, a gdy są one niemożliwe lub wymagałyby nadmiernych kosztów – złożyć oświadczenie o obniżeniu ceny albo o odstąpieniu od umowy.</li>
        <li>Gwarancja nie obejmuje uszkodzeń mechanicznych, zarysowań powstałych w trakcie użytkowania ani naturalnego zużycia.</li>
      </ul>

      <h2>§10 Dane osobowe i pliki cookies</h2>
      <p>
        Administratorem danych osobowych Klientów jest Sprzedawca. Zasady przetwarzania danych oraz stosowania plików
        cookies opisuje <a href="/polityka-prywatnosci" className="link-underline text-ink">Polityka prywatności</a>.
      </p>

      <h2>§11 Prawa autorskie</h2>
      <p>
        Treści opublikowane w Sklepie – zdjęcia, opisy Produktów, znaki towarowe i układ graficzny – podlegają ochronie
        prawnej. Korzystanie z nich w zakresie wykraczającym poza dozwolony użytek osobisty wymaga zgody Sprzedawcy.
      </p>

      <h2>§12 Pozasądowe sposoby rozpatrywania sporów</h2>
      <p>
        Konsument może skorzystać z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń, w
        szczególności z pomocy miejskiego lub powiatowego rzecznika konsumentów, wojewódzkiego inspektoratu Inspekcji
        Handlowej albo stałego polubownego sądu konsumenckiego. Szczegółowe informacje udostępnia Urząd Ochrony
        Konkurencji i Konsumentów na stronie{" "}
        <a href="https://uokik.gov.pl" target="_blank" rel="noopener noreferrer" className="link-underline text-ink">
          uokik.gov.pl
        </a>
        . Skorzystanie z tych procedur jest dobrowolne i wymaga zgody obu stron.
      </p>

      <h2>§13 Postanowienia końcowe</h2>
      <ul>
        <li>W sprawach nieuregulowanych Regulaminem stosuje się prawo polskie, w szczególności Kodeks cywilny oraz ustawę o prawach konsumenta.</li>
        <li>Sprzedawca może zmienić Regulamin z ważnych przyczyn, zwłaszcza wskutek zmiany przepisów prawa lub zakresu świadczonych usług. Do zamówień złożonych przed zmianą stosuje się Regulamin w dotychczasowym brzmieniu.</li>
        <li>Postanowienia Regulaminu nie wyłączają ani nie ograniczają uprawnień Konsumenta wynikających z bezwzględnie obowiązujących przepisów prawa.</li>
      </ul>
    </ContentPage>
  );
}
