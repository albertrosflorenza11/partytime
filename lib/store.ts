"use client"

import { Connection } from "./types"

const STORAGE_KEY = "partytime_connections"

export function getConnections(): Connection[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  } catch {
    return []
  }
}

export function saveConnection(connection: Connection): void {
  const connections = getConnections()
  connections.push(connection)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(connections))
}

export function clearConnections(): void {
  localStorage.removeItem(STORAGE_KEY)
}
