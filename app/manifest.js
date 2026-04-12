export default function manifest() {
  return {
    name: "EduSaaS School Management",
    short_name: "EduSaaS",
    description: "Complete school management platform",
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
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    shortcuts: [
      {
        name: "Students",
        url: "/students",
      },
      {
        name: "Fees",
        url: "/fees",
      },
    ],
  }
}