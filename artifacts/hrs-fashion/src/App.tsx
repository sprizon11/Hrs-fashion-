import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";
import Home from "@/pages/home";
import Collections from "@/pages/collections";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Product from "@/pages/product";
import Lookbook from "@/pages/lookbook";
import Sale from "@/pages/sale";
import Wishlist from "@/pages/wishlist";
import Search from "@/pages/search";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
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
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WishlistProvider>
          <CartProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
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
