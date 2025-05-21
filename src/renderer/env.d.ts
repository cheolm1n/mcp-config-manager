interface Window {
  mcpAPI: {
    getConfig: () => Promise<any>;
    setConfig: (data: any) => Promise<any>;
    applyConfig: () => Promise<any>;
  };
}
