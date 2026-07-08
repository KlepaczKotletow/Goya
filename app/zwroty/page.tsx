import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";

export const metadata: Metadata = { title: "Dostawa i zwroty", description: "Zasady dostawy, zwrotów i gwarancji w Goya." };

export default function Page() {
  return (
    <ContentPage eyebrow="Informacje" title="Dostawa i zwroty" updated="8 lipca 2026">
      <p>To wersja pokazowa sklepu Goya. Poniższe zasady odzwierciedlają docelowy proces dostawy i zwrotów.</p>

      <h2>Dostawa</h2>
      <ul>
        <li>Wysyłka w 1-2 dni robocze kurierem lub do paczkomatu.</li>
        <li>Darmowa dostawa dla zamówień od 199 zł.</li>
        <li>Do każdej pary dołączamy twarde etui, ściereczkę z mikrofibry i kartę gwarancyjną.</li>
      </ul>

      <h2>Zwroty</h2>
      <p>
        Masz 30 dni na zwrot bez podania przyczyny. Wystarczy odesłać produkt w stanie nienaruszonym wraz z etui. Zwrot
        środków realizujemy w ciągu 14 dni od otrzymania przesyłki.
      </p>

      <h2>Gwarancja</h2>
      <p>Każdą parę obejmujemy 24-miesięczną gwarancją. Reklamacje rozpatrujemy w terminie do 14 dni.</p>

      <h2>Jak zwrócić okulary</h2>
      <ul>
        <li>Zapakuj okulary do oryginalnego etui.</li>
        <li>Napisz na <a href="mailto:kontakt@goya.pl" className="link-underline text-ink">kontakt@goya.pl</a> - odeślemy etykietę zwrotną.</li>
        <li>Nadaj paczkę i śledź status zwrotu środków w wiadomości e-mail.</li>
      </ul>
    </ContentPage>
  );
}
