import { useEffect } from "react";

/**
 * The WordPress theme ships its interactivity as inline jQuery snippets
 * (owl carousels, accordions, filters). React owns the DOM now, so each page
 * re-runs its own snippets after mount and tears the carousels down on exit.
 */
export default function useThemeScripts(scripts = []) {
  // the array arrives as a fresh literal each render, so key the effect on content
  const key = scripts.join("\n\n");

  useEffect(() => {
    // jQuery, bootstrap and owl are deferred now so they stop blocking the
    // parser, which means they may not have run when React first mounts.
    // Rather than assume an order the bundler is free to change, wait for
    // jQuery to appear and run the snippets then.
    let cancelled = false;
    let teardown = null;
    let timer = null;

    const run = () => {
      if (cancelled) return;
      const $ = window.jQuery;
      if (!$) {
        timer = window.setTimeout(run, 50);
        return;
      }
      teardown = start($);
    };

    const start = ($) => {
    scripts.forEach((code) => {
      try {
        // eslint-disable-next-line no-new-func
        new Function(code)();
      } catch (err) {
        console.error("theme script failed", err);
      }
    });

    return () => {
      if (!$.fn || !$.fn.owlCarousel) return;
      $(".owl-carousel, .fleet_carousel, .testimonial_carousel").each(function () {
        if ($(this).data("owl.carousel")) {
          $(this).trigger("destroy.owl.carousel").removeClass("owl-loaded owl-hidden");
        }
      });
    };
    };

    run();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      if (typeof teardown === "function") teardown();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
