export default function manifest() {
  return {
    id: "/dashboard",
    name: "निशांत स्कूल सॉफ्टवेयर",
    short_name: "स्कूल",
    description: "विद्यालय प्रबंधन सॉफ्टवेयर",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#312e81",
    theme_color: "#4338ca",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Students",
        url: "/students",
        icons: [{ src: "/icon-192.png", sizes: "96x96", type: "image/png" }],
      },
      {
        name: "Fees",
        url: "/fees",
        icons: [{ src: "/icon-192.png", sizes: "96x96", type: "image/png" }],
      },
    ],
    screenshots: [
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
  };
}