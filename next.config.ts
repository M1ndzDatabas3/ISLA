import { withContentCollections } from "@content-collections/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // A antiga seção Cultura virou os "Clássicos" do Mural; as listas de clássicos,
  // cartazes e exposições foram reunidas na página Obras.
  async redirects() {
    return [
      { source: "/cultura", destination: "/mural/obras", permanent: true },
      { source: "/mural/classicos", destination: "/mural/obras", permanent: true },
      { source: "/mural/cartazes", destination: "/mural/obras", permanent: true },
      { source: "/mural/exposicoes", destination: "/mural/obras", permanent: true },
    ];
  },
};

// O plugin compila /content (schemas em content-collections.ts) antes do Next.
export default withContentCollections(nextConfig);
