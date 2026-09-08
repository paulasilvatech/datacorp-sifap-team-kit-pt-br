import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = fileURLToPath(new URL("../", import.meta.url));
const dist = resolve(siteRoot, "dist");
const catalog = JSON.parse(readFileSync(resolve(siteRoot, ".generated/catalog.json"), "utf8"));
const issues = [];
const visited = new Map();
const localTargets = [];
const ids = new Map();

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error("The build output must not contain symlinks.");
    return entry.isDirectory() ? walk(path) : [path];
  });
}
function unescape(value) {
  const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
  return value.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (_, entity) => {
    if (entity.startsWith("#x")) return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
    if (entity.startsWith("#")) return String.fromCodePoint(Number(entity.slice(1)));
    return named[entity.toLowerCase()];
  });
}
function targetFile(pathname) {
  const decoded = decodeURIComponent(pathname);
  const base = decodeURIComponent(catalog.basePath);
  if (!decoded.startsWith(base)) return undefined;
  const path = resolve(dist, `.${decoded.slice(base.length - 1)}`);
  if (path !== dist && !path.startsWith(`${dist}/`)) throw new Error("Output link escapes dist.");
  if (existsSync(path) && statSync(path).isFile()) return path;
  const index = resolve(path, "index.html");
  return existsSync(index) ? index : undefined;
}
const files = walk(dist);
for (const path of files.filter((file) => file.endsWith(".html"))) {
  const html = readFileSync(path, "utf8");
  const fileIds = new Set();
  for (const match of html.matchAll(/\bid="([^"]+)"/g)) {
    const id = unescape(match[1]);
    if (fileIds.has(id)) issues.push({ file: relative(dist, path), issue: "duplicate-id", id });
    fileIds.add(id);
  }
  ids.set(path, fileIds);
  const pageUrl = new URL(`${catalog.basePath}${relative(dist, path).replace(/index\.html$/, "")}`, catalog.siteUrl);
  for (const match of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    const href = unescape(match[2]);
    if (!href || /^(?:data:|mailto:|tel:)/.test(href)) continue;
    const url = new URL(href, pageUrl);
    if (url.origin !== pageUrl.origin) continue;
    const target = targetFile(url.pathname);
    if (!target) {
      issues.push({ file: relative(dist, path), issue: "missing-local-target", href });
      continue;
    }
    if (url.hash && match[1] === "href") localTargets.push({ source: path, target, fragment: decodeURIComponent(url.hash.slice(1)), href });
  }
  visited.set(path, html);
}
for (const link of localTargets) {
  const targets = ids.get(link.target);
  if (targets && !targets.has(link.fragment)) {
    issues.push({ file: relative(dist, link.source), issue: "missing-fragment", href: link.href });
  }
}
const coverage = [];
let fullMarkdownChecks = 0;
for (const edition of catalog.editions) {
  let documents = 0;
  for (const entry of edition.entries) {
    const file = targetFile(new URL(entry.href, catalog.siteUrl).pathname);
    const html = file && visited.get(file);
    if (!html) issues.push({ file: entry.path, locale: edition.code, issue: "missing-file-view" });
    else {
      if (!html.includes(`lang="${edition.code === "pt-br" ? "pt-BR" : edition.code}"`)) {
        issues.push({ file: entry.path, locale: edition.code, issue: "incorrect-language" });
      }
      for (const other of catalog.editions) {
        const counterpart = other.entries.find((item) => item.path === entry.path);
        if (!counterpart || !html.includes(`href="${counterpart.href}"`)) {
          issues.push({ file: entry.path, locale: edition.code, issue: "missing-language-switch", target: other.code });
        }
        if (entry.kind === "document") {
          const source = html.match(/<details\b[^>]*data-original-markdown\b[^>]*>[\s\S]*?<pre\b[^>]*><code>([\s\S]*?)<\/code><\/pre>/);
          if (!source || unescape(source[1]) !== entry.text) {
            issues.push({ file: entry.path, locale: edition.code, issue: "incomplete-markdown-text" });
          } else {
            fullMarkdownChecks++;
          }
        }
      }
    }
    const blobFile = targetFile(new URL(entry.downloadHref, catalog.siteUrl).pathname);
    if (!blobFile) issues.push({ file: entry.path, issue: "missing-original-download" });
    else {
      const data = readFileSync(blobFile);
      const hash = createHash(entry.blob.length === 64 ? "sha256" : "sha1")
        .update(`blob ${data.length}\0`).update(data).digest("hex");
      if (hash !== entry.blob) issues.push({ file: entry.path, issue: "download-byte-mismatch" });
    }
    if (entry.kind === "document") documents++;
  }
  coverage.push({ language: edition.code, branch: edition.branch, commit: edition.commit, files: edition.entries.length, documents });
}
if (!existsSync(resolve(dist, "pagefind/pagefind.js"))) issues.push({ issue: "missing-search-index" });
const report = { auditedAt: new Date().toISOString(), repository: catalog.repository, pages: visited.size, fullMarkdownChecks, coverage, issues };
writeFileSync(resolve(siteRoot, ".generated/site-audit.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Audited ${visited.size} pages and ${coverage.reduce((sum, item) => sum + item.files, 0)} original file downloads: ${issues.length} issues.`);
if (issues.length) {
  console.error(JSON.stringify(issues.slice(0, 15), null, 2));
  process.exitCode = 1;
}
