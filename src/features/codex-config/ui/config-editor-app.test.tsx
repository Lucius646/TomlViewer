import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import type { ConfigApiPayload } from "../api/contracts";
import { ConfigEditorApp } from "./config-editor-app";

const globalPayload: ConfigApiPayload = {
  scope: "global",
  targetPath: "C:/Users/lucius/.codex/config.toml",
  exists: true,
  rawToml: 'model = "gpt-5.4"\nservice_tier = "flex"\n',
  knownFields: {
    model: "gpt-5.4",
    service_tier: "flex",
  },
  effectiveValues: {
    model: { value: "gpt-5.4", source: "global" },
    service_tier: { value: "flex", source: "global" },
  },
  backups: [],
  lastModifiedMs: 123,
};

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

it("shows global and project mode tabs with the section sidebar", async () => {
  fetchMock.mockResolvedValue(new Response(JSON.stringify(globalPayload), { status: 200 }));

  render(<ConfigEditorApp initialScope="global" />);

  expect(screen.getByRole("tab", { name: "全局配置" })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: "项目配置" })).toBeInTheDocument();
  expect(within(screen.getByLabelText("配置分组导航")).getByText("核心模型")).toBeInTheDocument();
  expect(screen.getByText("当前层级")).toBeInTheDocument();
  await screen.findByLabelText("主模型");
});

it("shows a project path input when switching to project scope", async () => {
  fetchMock.mockResolvedValue(new Response(JSON.stringify(globalPayload), { status: 200 }));

  const user = userEvent.setup();

  render(<ConfigEditorApp initialScope="global" />);

  await user.click(screen.getByRole("tab", { name: "项目配置" }));

  expect(screen.getByLabelText("项目路径")).toBeInTheDocument();
  expect(screen.getByText("项目配置需要先提供项目路径。")) .toBeInTheDocument();
});

it("marks the form dirty and saves an edited model value", async () => {
  fetchMock
    .mockResolvedValueOnce(new Response(JSON.stringify(globalPayload), { status: 200 }))
    .mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          ...globalPayload,
          knownFields: { ...globalPayload.knownFields, model: "gpt-5.4-mini" },
          effectiveValues: {
            ...globalPayload.effectiveValues,
            model: { value: "gpt-5.4-mini", source: "global" },
          },
          rawToml: 'model = "gpt-5.4-mini"\nservice_tier = "flex"\n',
        }),
        { status: 200 },
      ),
    );

  const user = userEvent.setup();

  render(<ConfigEditorApp initialScope="global" />);

  await user.selectOptions(await screen.findByLabelText("主模型"), "gpt-5.4-mini");

  expect(screen.getByText("未保存更改")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "保存更改" }));

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  expect(fetchMock.mock.calls[1]?.[1]).toMatchObject({
    method: "POST",
  });
  expect(screen.getByText("最近一次保存成功")).toBeInTheDocument();
});