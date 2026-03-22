import { render, screen } from "@testing-library/react";

import Page from "./page";

it("renders the Codex config editor heading", () => {
  render(<Page />);
  expect(
    screen.getByRole("heading", { name: /codex config editor/i }),
  ).toBeInTheDocument();
});
