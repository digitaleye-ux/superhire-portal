import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import "./index.css";
import RecruiterShellPreview from "./preview/RecruiterShellPreview";

const root = createRoot(document.getElementById("root")!);
const app = (
  <StrictMode>
    <RecruiterShellPreview />
    <Toaster position="top-right" duration={3000} />
  </StrictMode>
);

// >>> PROTO switchers (dev-only; delete with src/proto/) >>>
const proto = new URLSearchParams(location.search).get("proto");
if (import.meta.env.DEV && proto === "form") {
  import("./proto/submit-form").then(({ default: Proto }) => root.render(<Proto />));
} else if (
  import.meta.env.DEV &&
  (proto === "track" || proto === "candidate" || proto === "candidates")
) {
  import("./proto/candidate-cards").then(({ default: Proto }) => root.render(<Proto />));
} else if (import.meta.env.DEV && proto === "panel") {
  import("./proto/candidate-panel").then(({ default: Proto }) => root.render(<Proto />));
} else if (
  import.meta.env.DEV &&
  (proto === "add-role" || proto === "another-role" || proto === "role")
) {
  import("./proto/add-another-role").then(({ default: Proto }) => root.render(<Proto />));
} else {
  root.render(app);
}
// <<< PROTO switchers <<<
