// Demo mode: the prototype has no backend, no payments and no other members.
// Controls that only make sense in a demo (simulating a failure, approving your
// own proof) are shown only while this is on. Set NEXT_PUBLIC_DEMO_MODE=off in
// production so they disappear.
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== 'off'
