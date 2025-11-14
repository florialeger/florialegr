// useBlurReveal has been removed from the UX; provide a tiny safe stub so any
// remaining imports won't break the build. This returns a ref callback that
// does nothing.
export default function useBlurReveal() {
  // return a stable no-op function suitable for use as a callback ref
  return () => {};
}
