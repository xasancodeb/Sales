import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen max-w-md mx-auto px-6 flex flex-col justify-center py-20">
      <Link href="/" className="font-serif text-2xl font-black tracking-tight mb-12">
        ONE
      </Link>

      <div className="space-y-6 font-serif text-xl leading-relaxed">
        <p>Eight billion people. One page.</p>
        <p>
          Every person on Earth gets one post a day.{" "}
          <span style={{ color: "var(--dim)" }}>
            The same one post — whether you are a president, a farmer, a
            nurse, or a kid with a borrowed phone.
          </span>
        </p>
        <p>
          No followers. No verified badges. No algorithm deciding who
          deserves to be heard.{" "}
          <span style={{ color: "var(--dim)" }}>
            The world reads, the world votes, and the best thing anyone said
            that day rises to the top.
          </span>
        </p>
        <p>
          At midnight, the page turns. Everything resets.{" "}
          <span style={{ color: "var(--dim)" }}>
            Yesterday&apos;s winner goes into the Book of Days — the diary of
            humanity, one page per day, forever.
          </span>
        </p>
        <p>Tomorrow, everyone starts equal again.</p>
      </div>

      <div className="pt-12 flex gap-6 text-sm">
        <Link href="/" style={{ color: "var(--accent)" }}>
          Read today&apos;s page →
        </Link>
        <Link href="/days" style={{ color: "var(--dim)" }}>
          Open the Book of Days
        </Link>
      </div>
    </main>
  );
}
