import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Building, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-primary/5" />
          <div className="absolute -left-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-primary/5" />
        </div>
        
        <div className="container relative py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-fade-in">
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                🍽️ Your office lunch, simplified
              </span>
            </div>
            
            <h1 className="animate-slide-up mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
              Pre-order lunch from restaurants{' '}
              <span className="text-primary">in your building</span>
            </h1>
            
            <p className="animate-slide-up mb-8 text-lg text-muted-foreground md:text-xl" style={{ animationDelay: '0.1s' }}>
              Skip the queues. Save time. Enjoy your lunch break the way it should be — 
              relaxed and delicious.
            </p>
            
            <div className="animate-slide-up flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ animationDelay: '0.2s' }}>
              <Link to="/restaurants">
                <Button variant="hero" size="xl" className="gap-2">
                  Browse Restaurants
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="xl">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">How OfficeBite Works</h2>
            <p className="text-muted-foreground">Three simple steps to a better lunch</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Building,
                title: 'Choose a Restaurant',
                description: 'Browse restaurants in your building. Check menus and pick your favorites.',
              },
              {
                icon: Clock,
                title: 'Select Pickup Time',
                description: 'Choose when you want your food ready. No more waiting in lines.',
              },
              {
                icon: CreditCard,
                title: 'Order & Pickup',
                description: 'Place your order, head down at your selected time, and enjoy!',
              },
            ].map((step, index) => (
              <div
                key={step.title}
                className="group rounded-2xl bg-card p-8 shadow-soft transition-all duration-300 hover:shadow-medium hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <step.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Ready to save your lunch break?
            </h2>
            <p className="mb-8 text-muted-foreground">
              Join OfficeBite today and discover a better way to lunch.
            </p>
            <Link to="/restaurants">
              <Button variant="hero" size="lg" className="gap-2">
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm">🍽️</span>
              </div>
              <span className="font-semibold text-foreground">OfficeBite</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 OfficeBite. Made with ❤️ for hungry office workers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
