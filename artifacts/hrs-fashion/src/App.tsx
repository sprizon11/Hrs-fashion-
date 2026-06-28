import { lazy, Suspense, useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";
import { AdminLayout } from "@/components/admin-layout";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";

const Home = lazy(() => import("@/pages/home"));
const Collections = lazy(() => import("@/pages/collections"));
const About = lazy(() => import("@/pages/about"));
const Contact = lazy(() => import("@/pages/contact"));
const Product = lazy(() => import("@/pages/product"));
const Lookbook = lazy(() => import("@/pages/lookbook"));
const Sale = lazy(() => import("@/pages/sale"));
const Wishlist = lazy(() => import("@/pages/wishlist"));
const Search = lazy(() => import("@/pages/search"));
const Checkout = lazy(() => import("@/pages/checkout"));

const AdminLogin = lazy(() => import("@/pages/admin/login"));
const AdminDashboard = lazy(() => import("@/pages/admin/dashboard"));
const AdminProducts = lazy(() => import("@/pages/admin/products"));
const ProductForm = lazy(() => import("@/pages/admin/product-form"));
const AdminOrders = lazy(() => import("@/pages/admin/orders"));
const AdminAnalytics = lazy(() => import("@/pages/admin/analytics"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function StoreRouter() {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/collections" component={Collections} />
          <Route path="/product/:id" component={Product} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/lookbook" component={Lookbook} />
          <Route path="/sale" component={Sale} />
          <Route path="/wishlist" component={Wishlist} />
          <Route path="/search" component={Search} />
          <Route path="/checkout" component={Checkout} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

function AdminRouter() {
  return (
    <AdminLayout>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/products/new" component={ProductForm} />
          <Route path="/admin/products/:id/edit" component={ProductForm} />
          <Route path="/admin/products" component={AdminProducts} />
          <Route path="/admin/orders" component={AdminOrders} />
          <Route path="/admin/analytics" component={AdminAnalytics} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </AdminLayout>
  );
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location]);
  return null;
}

function Router() {
  const [location] = useLocation();
  if (location === "/admin/login") {
    return <Suspense fallback={<PageLoader />}><AdminLogin /></Suspense>;
  }
  if (location.startsWith("/admin")) {
    return <AdminRouter />;
  }
  return <StoreRouter />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WishlistProvider>
          <CartProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <ScrollToTop />
              <Router />
            </WouterRouter>
            <Toaster />
          </CartProvider>
        </WishlistProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
