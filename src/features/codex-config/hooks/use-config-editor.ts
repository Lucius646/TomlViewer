"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import type { ConfigApiPayload, ConfigApiScope } from "../api/contracts";

interface UseConfigEditorOptions {
  scope: ConfigApiScope;
  projectPath?: string;
}

async function readPayload(response: Response) {
  const payload = (await response.json()) as ConfigApiPayload | { error?: string };

  if (!response.ok) {
    throw new Error("error" in payload && payload.error ? payload.error : "配置请求失败");
  }

  return payload as ConfigApiPayload;
}

export function useConfigEditor({ scope, projectPath }: UseConfigEditorOptions) {
  const form = useForm<Record<string, unknown>>({
    defaultValues: {},
  });
  const [payload, setPayload] = useState<ConfigApiPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [rawToml, setRawToml] = useState("");

  const load = useCallback(async () => {
    if (scope === "project" && !projectPath) {
      form.reset({});
      setPayload(null);
      setRawToml("");
      setIsLoading(false);
      setError("项目配置需要先提供项目路径。");
      setSaveState("idle");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const search = new URLSearchParams({ scope });

      if (scope === "project" && projectPath) {
        search.set("projectPath", projectPath);
      }

      const nextPayload = await readPayload(await fetch(`/api/config?${search.toString()}`));
      setPayload(nextPayload);
      setRawToml(nextPayload.rawToml);
      form.reset(nextPayload.knownFields);
      setSaveState("idle");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "配置加载失败");
      setPayload(null);
    } finally {
      setIsLoading(false);
    }
  }, [form, projectPath, scope]);

  useEffect(() => {
    void load();
  }, [load]);

  const saveVisual = useCallback(async () => {
    setSaveState("saving");
    setError(null);

    try {
      const nextPayload = await readPayload(
        await fetch("/api/config", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            scope,
            projectPath,
            knownFields: form.getValues(),
            expectedMtimeMs: payload?.lastModifiedMs,
            mode: "visual",
          }),
        }),
      );

      setPayload(nextPayload);
      setRawToml(nextPayload.rawToml);
      form.reset(nextPayload.knownFields);
      setSaveState("saved");
    } catch (saveError) {
      setSaveState("error");
      setError(saveError instanceof Error ? saveError.message : "配置保存失败");
    }
  }, [form, payload?.lastModifiedMs, projectPath, scope]);

  const saveExpert = useCallback(async () => {
    setSaveState("saving");
    setError(null);

    try {
      const nextPayload = await readPayload(
        await fetch("/api/config", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            scope,
            projectPath,
            rawToml,
            expectedMtimeMs: payload?.lastModifiedMs,
            mode: "expert",
          }),
        }),
      );

      setPayload(nextPayload);
      setRawToml(nextPayload.rawToml);
      form.reset(nextPayload.knownFields);
      setSaveState("saved");
    } catch (saveError) {
      setSaveState("error");
      setError(saveError instanceof Error ? saveError.message : "TOML 保存失败");
    }
  }, [form, payload?.lastModifiedMs, projectPath, rawToml, scope]);

  const currentValues = form.watch();
  const isExpertDirty = useMemo(() => rawToml !== (payload?.rawToml ?? ""), [payload?.rawToml, rawToml]);

  return {
    control: form.control,
    currentValues,
    effectiveValues: payload?.effectiveValues ?? {},
    error,
    isDirty: form.formState.isDirty,
    isExpertDirty,
    isLoading,
    payload,
    rawToml,
    save: saveVisual,
    saveExpert,
    saveState,
    setKnownField: (keyPath: string, value: unknown) => {
      form.setValue(keyPath, value, { shouldDirty: true, shouldTouch: true });
    },
    setRawToml,
    targetPath: payload?.targetPath,
  };
}