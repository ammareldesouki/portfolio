// A template (unlike a layout) remounts on every navigation, so wrapping the
// public pages here produces a subtle fade-in when moving between
// Home / Projects / About. The animation is disabled under
// prefers-reduced-motion via globals.css.
export default function PublicTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="page-fade">{children}</div>;
}
