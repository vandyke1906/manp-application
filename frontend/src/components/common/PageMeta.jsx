import { useEffect } from "react";

const PageMeta = ({ title, description }) => {
  useEffect(() => {
    if (title) {
      document.title = `MANP - ${title}`;
    }
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", description);
      } else {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = description;
        document.head.appendChild(meta);
      }
    }
  }, [title, description]);

  return null; // No rendered component needed
};

export const AppWrapper = ({ children }) => (
  <div>{children}</div> // Simple wrapper for your app
);

export default PageMeta;
