"use client";

import { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ExternalLink, Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { getBreadcrumb } from "@/lib/nav";

export function Topbar() {
  const pathname = usePathname();
  const crumbs = getBreadcrumb(pathname);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="topbar">
      <div className="breadcrumb">
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <Fragment key={i}>
              {isLast || !c.href ? (
                <span className={isLast ? "current" : "crumb"}>{c.label}</span>
              ) : (
                <Link className="crumb" href={c.href}>
                  {c.label}
                </Link>
              )}
              {!isLast && <span className="sep">/</span>}
            </Fragment>
          );
        })}
      </div>
      <div className="topbar-search">
        <span className="si">
          <Search size={16} strokeWidth={1.8} />
        </span>
        <input
          placeholder="Rechercher commandes, produits, clients..."
          onFocus={() => setOpen(true)}
          readOnly
        />
        <span className="kbd">⌘K</span>
      </div>
      <div className="topbar-actions">
        <button className="icon-btn" aria-label="Notifications">
          <Bell size={18} strokeWidth={1.6} />
          <span className="dot"></span>
        </button>
        <a
          href="#"
          className="btn btn-outline btn-sm"
          style={{ gap: 6 }}
        >
          <ExternalLink size={14} strokeWidth={1.8} />
          <span>Voir la boutique</span>
        </a>
        <div className="avatar sm">AZ</div>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Rechercher commandes, produits, clients..." />
        <CommandList>
          <CommandEmpty>Recherche bientôt disponible</CommandEmpty>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
