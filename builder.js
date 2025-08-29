import esbuild from "esbuild";
import { join, dirname } from "path";
import { copyFileSync, mkdirSync, existsSync } from "fs";

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

(() => {
  const prismaDir = join(process.cwd(), "dist", "database");

  if (!existsSync(prismaDir)) mkdirSync(prismaDir, { recursive: true });

  copyFileSync(
    join(process.cwd(), "src", "database", "schema.prisma"),
    join(prismaDir, "schema.prisma"),
  );

  console.log("✅ Prisma files copied to dist/");
})();
