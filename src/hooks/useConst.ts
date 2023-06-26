import { useRef } from "react";

export function useConst<T>(initialValue: T | (() => T)): T {
  // Use useRef to store the value because it's the least expensive built-in hook that works here
  // (we could also use `const [value] = React.useState(initialValue)` but that's more expensive
  // internally due to reducer handling which we don't need)
  const ref = useRef<{ value: T }>();
  if (ref.current === undefined) {
    // Box the value in an object so we can tell if it's initialized even if the initializer
    // returns/is undefined
    ref.current = {
      value:
        typeof initialValue === "function"
          ? (initialValue as Function)()
          : initialValue,
    };
  }
  return ref.current.value;
}
