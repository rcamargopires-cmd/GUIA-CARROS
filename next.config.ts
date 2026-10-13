import type { NextConfig } from "next";
// O typecheck roda em etapa separada; evita falha do parser de --showConfig no build.
const nextConfig: NextConfig = {typescript: {ignoreBuildErrors: true}};
export default nextConfig;
