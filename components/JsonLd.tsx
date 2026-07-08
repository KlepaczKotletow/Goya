// Server component — renders structured data as a native <script> tag.
// JSON-LD is data, not executable code, so a plain <script> is correct (per Next.js docs).
// We escape "<" to its unicode form to neutralize any XSS via stringified content.
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
