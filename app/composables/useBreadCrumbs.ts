import type {
  RouteLocationMatched,
  RouteLocationNormalizedLoaded,
} from "vue-router";
import { useEmbyStore } from "~/stores/emby/emby.store";

export type Crumb = {
  label: string;
  to?: string;
};

function humanize(input = "") {
  return input
    .replace(/\[|\]|\.\.\.|_/g, " ")
    .replace(/-/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^\w/g, (c) => c.toUpperCase());
}

function labelFromRecord(
  rec: RouteLocationMatched,
  cur: RouteLocationNormalizedLoaded
) {
  const meta: any = rec.meta || {};
  const bc = meta.breadcrumb ?? meta.title;

  if (typeof bc === "function") return bc(cur);
  if (typeof bc === "string") return bc;

  const seg = rec.path.split("/").filter(Boolean).pop() || "";

  // dynamic param (:id, dll)
  if (seg.startsWith(":")) {
    const paramName = seg.replace(":", "").replace("()", "");
    const paramVal = cur.params[paramName];

    // khusus emby library
    if (paramName === "id") {
      const embyStore = useEmbyStore();
      const lib = embyStore.libraries.find(
        (l) => String(l.Id) === String(paramVal)
      );
      if (lib) return lib.Name;
    }

    if (typeof paramVal === "string") return paramVal;
    if (Array.isArray(paramVal)) return paramVal[0];
  }

  return humanize(seg);
}

export function useBreadcrumbs(opts?: {
  hideRoot?: boolean;
  rootLabel?: string;
  rootTo?: string;
  excludeNames?: string[];
  trailingLink?: boolean;
}) {
  const route = useRoute();
  const router = useRouter();

  const items = computed<Crumb[]>(() => {
    const out: Crumb[] = [];

    // ROOT
    if (!opts?.hideRoot) {
      out.push({
        label: opts?.rootLabel ?? "Home",
        to: opts?.rootTo ?? "/",
      });
    }

    const matched = route.matched
      .filter((r) => r.path !== "/")
      .filter(
        (r) => !opts?.excludeNames?.includes(String(r.name ?? ""))
      );

    // auto section (/library)
    const segs = route.path.split("/").filter(Boolean);
    const sectionPath = segs.length ? `/${segs[0]}` : "/";
    const hasSection = matched.some((r) => r.path === sectionPath);

    if (sectionPath !== "/" && !hasSection) {
      out.push({
        label: humanize(segs[0]),
        to: sectionPath,
      });
    }

    // auto sub-section (/library/13055)
    const subPath =
      segs.length >= 2 ? `/${segs[0]}/${segs[1]}` : null;
    const hasSub = subPath
      ? matched.some((r) => r.path === subPath)
      : false;

    if (subPath && !hasSub) {
      out.push({
        label: humanize(segs[1]),
        to: subPath,
      });
    }

    // matched records
    matched.forEach((rec, idx) => {
      const isLast = idx === matched.length - 1;
      const label = labelFromRecord(rec, route);

      let to: string | undefined;
      if (!isLast || opts?.trailingLink) {
        try {
          to = rec.name
            ? router.resolve({
                name: rec.name as any,
                params: route.params,
              }).href
            : router.resolve({ path: rec.path }).href;
        } catch {
          /* ignore */
        }
      }

      out.push({ label, to });
    });

    return out;
  });

  return { items };
}