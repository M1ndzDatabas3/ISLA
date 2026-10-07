import { withContentCollections } from "@content-collections/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

// O plugin compila /content (schemas em content-collections.ts) antes do Next.
export default withContentCollections(nextConfig);
