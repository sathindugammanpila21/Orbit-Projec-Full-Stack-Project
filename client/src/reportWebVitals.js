const reportWebVitals = async (onPerfEntry) => {
  // Ensure callback is a function before proceeding
  if (typeof onPerfEntry === "function") {
    const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import("web-vitals");
    
    // Register performance metrics
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
};

export default reportWebVitals;
