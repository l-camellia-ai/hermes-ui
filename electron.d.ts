export {}

declare global {
  interface Window {
    api: {
      getSettings: () => Promise<Record<string, unknown>>
      openExternal: (url: string) => Promise<void>
    }
  }
}
