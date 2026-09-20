import { useEffect, useRef } from 'react';

/**
 * useScrollReveal
 * Attaches an IntersectionObserver to a container ref.
 * Every descendant matching `selector` will receive the `is-visible` class
 * when it scrolls into view, driving CSS scroll-reveal animations.
 */
export function useScrollReveal(
  selector = '[data-reveal]',
  options = { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const targets = Array.from(container.querySelectorAll(selector));
    if (targets.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector]);

  return containerRef;
}

/**
 * useScrollRevealSingle
 * Directly observes the returned ref element itself (not its children).
 */
export function useScrollRevealSingle(
  options = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('is-visible');
        observer.disconnect();
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
