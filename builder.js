import esbuild from "esbuild";
import { join, dirname } from "path";
import { copyFileSync, mkdirSync, existsSync } from "fs";

const outDir = join(
  process.cwd(),
  ".vercel",
  "output",
  "functions",
  "index.func",
);
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

// Main build
await esbuild.build({
  entryPoints: ["src/server.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: join(outDir, "index.js"),
  sourcemap: true,
  packages: "external",
});

// Copy required files
(() => {
  // Prisma schema
  const prismaDir = join(outDir, "database");
  if (!existsSync(prismaDir)) mkdirSync(prismaDir, { recursive: true });
  copyFileSync(
    join(process.cwd(), "src", "database", "schema.prisma"),
    join(prismaDir, "schema.prisma"),
  );

  console.log("✅ Build complete - all files copied to .vercel/");
})();
