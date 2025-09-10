import esbuild from "esbuild";
import { join } from "path";
import { copyFileSync, mkdirSync, existsSync } from "fs";

// Main build
await esbuild.build({
  entryPoints: ["src/server.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outdir: "dist",
  sourcemap: true,
  packages: "external",
});

// Copy required files
(() => {
  // Prisma schema
  const prismaDir = join(process.cwd(), "dist", "database");
  if (!existsSync(prismaDir)) mkdirSync(prismaDir, { recursive: true });
  copyFileSync(
    join(process.cwd(), "src", "database", "schema.prisma"),
    join(prismaDir, "schema.prisma"),
  );

  console.log("✅ Build complete - all files copied to dist/");
})();
