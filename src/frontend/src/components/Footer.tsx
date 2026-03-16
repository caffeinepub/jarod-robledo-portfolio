export default function Footer() {
  const year = new Date().getFullYear();
  const utm = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-foreground text-primary-foreground/40 py-8 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-display text-sm text-primary-foreground/60">
          Jarod Robledo
        </p>
        <p className="text-xs">
          &copy; {year}. Built with ♥ using{" "}
          <a
            href={utm}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-primary-foreground/60 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
