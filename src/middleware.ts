import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', "/"]);

export default clerkMiddleware((auth, request) => {
  // Protect all routes except those matching isPublicRoute
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    "/((?!.*\\..*|_next).*)", 
    "/", 
    "/(api|trpc)(.*)",
    "/dashboard(.*)", // Ensure dashboard routes are protected
    "/onboarding(.*)"  // Ensure onboarding routes are protected
  ],
};
