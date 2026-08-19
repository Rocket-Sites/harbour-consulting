/* Forge - the behaviours this template ships (issue #166).
 *
 * ── Why a template ships script at all ───────────────────────────────────
 *
 * A published Rocket Site is static files on the agency's Cloudflare with no
 * server behind it. That is a claim about servers, not about scripting, and the
 * two got conflated: a mobile navigation menu and an FAQ accordion are ordinary
 * parts of a marketing site and both run entirely in the visitor's browser.
 *
 * What stays refused is script the MODEL composes, because the model reads a
 * client's live page as untrusted input and a script dictated by that page would
 * run on the client's own domain. So the behaviours live here: written once,
 * reviewed once, tested, and switched on per site by a slot. The AI turns one on
 * with fill_slots; it never writes code into a client's repository.
 *
 * ── Forge ships no theme behaviour, and that is a decision ───────────────
 *
 * Beacon carries `behaviour.dark_mode`. Forge does not, and the reason is that
 * forge is ALREADY a dark template: `canvas` is a warm near-black and `ink` is
 * the light text on it. A "dark mode toggle" here would be a light mode toggle,
 * and the mechanism cannot say that. The generated override block is keyed on
 * `[data-rs-theme="dark"]` and reads `brand_dark` from rocket-site.json, so
 * expressing forge's alternate palette would mean calling its LIGHT palette
 * `brand_dark` -- a name that is false in the one file an agency edits by hand.
 *
 * The honest answer to an operator who asks for a theme toggle on a forge site
 * is therefore that this template does not ship that behaviour and adding it is
 * a change to the template library, which is exactly what the refusal in
 * core/src/lib/content-safety.ts says when a page carries no matching slot.
 *
 * ── The rules this file is held to ───────────────────────────────────────
 *
 *   NOTHING IS FETCHED. No fetch, no XMLHttpRequest, no WebSocket, no beacon,
 *     no dynamic import. A template behaviour that talked to a host would make
 *     every client site depend on that host being up, which is the property the
 *     whole design exists to protect. templates/validate.mjs RS021 checks it.
 *   PROGRESSIVE. Every behaviour here is an enhancement of markup that already
 *     works. The mobile menu and the FAQ are native <details> elements and open
 *     with scripting off.
 *   NO INLINE HANDLERS. onclick= and onerror= are refused by the proposal guard
 *     and by the publisher's artifact guard, and they are refused here too by
 *     simply not being needed: this file uses addEventListener.
 *   NO CLASS NAMES INVENTED AT RUNTIME. Tailwind emits only the classes it can
 *     find as literal strings in the pages, so a class assembled here would be
 *     purged away and the behaviour would look right on the machine that built
 *     it. Everything visual is driven by attributes and by rules in
 *     tailwind.css.
 *
 * ── The switches ─────────────────────────────────────────────────────────
 *
 * Each behaviour reads one <meta> whose content is filled by a slot:
 *
 *   behaviour.mobile_nav      meta[name=rs-behaviour-mobile-nav]
 *   behaviour.faq_accordion   meta[name=rs-behaviour-faq-accordion]
 *
 * "on" turns it on. Anything else, including the shipped default, leaves it off,
 * so a site behaves exactly as it did before somebody asked for a behaviour.
 */
(function () {
  "use strict";

  /** Is this behaviour switched on for this site? */
  function enabled(name) {
    var meta = document.querySelector('meta[name="rs-behaviour-' + name + '"]');
    if (!meta) return false;
    return String(meta.getAttribute("content") || "").trim().toLowerCase() === "on";
  }

  /** Run after the document is parsed, whenever this file happens to load. */
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  /* ── Mobile navigation ──────────────────────────────────────────────
   *
   * The rail's small screen menu is a native <details> and needs none of this
   * to open. What it cannot do on its own is close: a visitor who opens it,
   * taps a link and lands further down the same page comes back to a menu still
   * covering the content, and on a phone that reads as a broken site.
   */
  function wireMenu(menu) {
    var close = function () {
      menu.removeAttribute("open");
    };

    // A link inside the menu: let the navigation happen, then close.
    menu.addEventListener("click", function (event) {
      var node = event.target;
      while (node && node !== menu) {
        if (node.tagName === "A") {
          close();
          return;
        }
        node = node.parentNode;
      }
    });

    document.addEventListener("click", function (event) {
      if (menu.hasAttribute("open") && !menu.contains(event.target)) close();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape" || !menu.hasAttribute("open")) return;
      close();
      // Focus goes back to the control that opened it, or a keyboard visitor is
      // returned to the top of the document with no idea what just happened.
      var summary = menu.querySelector("summary");
      if (summary) summary.focus();
    });
  }

  if (enabled("mobile-nav")) {
    ready(function () {
      var menus = document.querySelectorAll("[data-rs-mobile-nav]");
      for (var i = 0; i < menus.length; i++) {
        wireMenu(menus[i]);
      }
    });
  }

  /* ── FAQ accordion ──────────────────────────────────────────────────
   *
   * Each question is already a native <details>. The behaviour is the accordion
   * part: opening one closes the others, so a long list does not push the answer
   * a visitor is reading off the screen.
   */
  function wireAccordion(item, items) {
    item.addEventListener("toggle", function () {
      if (!item.hasAttribute("open")) return;
      for (var i = 0; i < items.length; i++) {
        if (items[i] !== item) items[i].removeAttribute("open");
      }
    });
  }

  if (enabled("faq-accordion")) {
    ready(function () {
      var items = document.querySelectorAll('[data-rs-slot-group="faq.item"]');
      for (var i = 0; i < items.length; i++) {
        wireAccordion(items[i], items);
      }
    });
  }
})();
