import { useState, useEffect } from "react";

export function useStorage(key, initialData) {
  const [data, setData] = useState(initialData);
  const [loaded, setLoaded] = useState(false);

  // Load từ storage lần đầu
  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage?.get(key);
        if (result?.value) {
          setData(JSON.parse(result.value));
        }
      } catch (err) {
        console.error("Load storage error:", err);
      }
      setLoaded(true);
    })();
  }, [key]);

  // Save vào storage mỗi khi data thay đổi
  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(async () => {
      try {
        await window.storage?.set(key, JSON.stringify(data));
      } catch (err) {
        console.error("Save storage error:", err);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [data, key, loaded]);

  return [data, setData, loaded];
}
