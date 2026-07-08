import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";

export const metadata: Metadata = { title: "Polityka prywatności", description: "Jak Goya przetwarza dane osobowe." };

export default function Page() {
  return (
    <ContentPage eyebrow="Informacje" title="Polityka prywatności" updated="8 lipca 2026">
      <p>
        To wersja pokazowa sklepu Goya. Poniżej opisujemy, jak w docelowym sklepie przetwarzalibyśmy dane osobowe zgodnie
        z RODO (rozporządzenie UE 2016/679).
      </p>

      <h2>Administrator danych</h2>
      <p>Administratorem danych jest Goya. Kontakt w sprawach prywatności: <a href="mailto:kontakt@goya.pl" className="link-underline text-ink">kontakt@goya.pl</a>.</p>

      <h2>Jakie dane zbieramy</h2>
      <ul>
        <li>Dane zamówienia: imię, adres dostawy, e-mail, telefon.</li>
        <li>Adres e-mail zapisany do newslettera (za Twoją zgodą).</li>
        <li>Dane techniczne i pliki cookies niezbędne do działania sklepu.</li>
      </ul>

      <h2>W jakim celu</h2>
      <p>
        Realizacja zamówień, obsługa zwrotów i reklamacji, wysyłka newslettera oraz poprawa działania sklepu. Danych nie
        sprzedajemy podmiotom trzecim.
      </p>

      <h2>Twoje prawa</h2>
      <p>
        Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia oraz wycofania zgody w dowolnym momencie. Aby z
        nich skorzystać, napisz do nas na adres podany powyżej.
      </p>
    </ContentPage>
  );
}
