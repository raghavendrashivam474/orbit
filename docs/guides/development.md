# Development Guide

## Logging
import { logger } from "@/services/logger/logger";
logger.info("message");

## IPC
import { invoke } from "@/core/ipc/bridge";
const version = await invoke("get_app_version");

## State
import { useAppStore } from "@/store/appStore";
const version = useAppStore((s) => s.version);
