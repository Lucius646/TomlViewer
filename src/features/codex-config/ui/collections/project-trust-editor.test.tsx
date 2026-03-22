import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it, vi } from "vitest";

import { ProjectTrustEditor } from "./project-trust-editor";

it("lets the user add a trusted project mapping", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();

  render(<ProjectTrustEditor value={{}} onChange={onChange} />);

  await user.type(screen.getByLabelText("项目路径"), "E:/LuciusProject/TomlViewer");
  await user.click(screen.getByRole("button", { name: "添加项目" }));

  expect(onChange).toHaveBeenCalledWith({
    "E:/LuciusProject/TomlViewer": {
      trust_level: "trusted",
    },
  });
});