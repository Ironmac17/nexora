export default function Footer() {
  return (
    <footer className="text-center py-6 border-t border-surface mt-12 text-textSub text-sm bg-background/50 backdrop-blur">
      <p>
        © {new Date().getFullYear()} <span className="text-accent font-semibold">Nexora</span>. 
        Built for campus collaboration.
      </p>
    </footer>
  );
}
