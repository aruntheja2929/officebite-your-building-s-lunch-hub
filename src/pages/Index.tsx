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
          <div className="absolute -right-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-primary/10 blur-3xl animate-pulse-slow" />
          <div className="absolute -left-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-primary/8 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-accent/5 blur-3xl animate-float" />
        </div>
        
        <div className="container relative py-24 md:py-40">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-fade-in">
              <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary backdrop-blur-sm border border-primary/20 shadow-soft">
                <span className="text-base">🍽️</span>
                Your office lunch, simplified
              </span>
            </div>
            
            <h1 className="animate-slide-up mb-6 text-5xl font-extrabold tracking-tight text-foreground md:text-7xl lg:text-8xl">
              Pre-order lunch from restaurants{' '}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">in your building</span>
            </h1>
            
            <p className="animate-slide-up mb-10 text-xl text-muted-foreground md:text-2xl max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: '0.1s' }}>
              Skip the queues. Save time. Enjoy your lunch break the way it should be — 
              <span className="font-semibold text-foreground"> relaxed and delicious.</span>
            </p>
            
            <div className="animate-slide-up flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ animationDelay: '0.2s' }}>
              <Link to="/restaurants">
                <Button variant="hero" size="xl" className="gap-2 shadow-elevated hover:shadow-glow transition-all duration-300">
                  Browse Restaurants
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="xl" className="border-2 font-semibold hover:bg-primary/5 transition-all duration-300">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-gradient-to-b from-background to-secondary/30">
        <div className="container">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-extrabold text-foreground md:text-5xl">How OfficeBite Works</h2>
            <p className="text-lg text-muted-foreground">Three simple steps to a better lunch</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Building,
                title: 'Choose a Restaurant',
                description: 'Browse restaurants in your building. Check menus and pick your favorites.',
                color: 'from-primary/20 to-primary/5',
              },
              {
                icon: Clock,
                title: 'Select Pickup Time',
                description: 'Choose when you want your food ready. No more waiting in lines.',
                color: 'from-accent/20 to-accent/5',
              },
              {
                icon: CreditCard,
                title: 'Order & Pickup',
                description: 'Place your order, head down at your selected time, and enjoy!',
                color: 'from-primary/20 to-accent/5',
              },
            ].map((step, index) => (
              <div
                key={step.title}
                className="group relative rounded-3xl bg-card p-8 shadow-soft transition-all duration-500 hover:shadow-elevated hover:-translate-y-2 border border-border/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-medium transition-all duration-500 group-hover:scale-110 group-hover:shadow-glow group-hover:rotate-3">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/50 to-accent/10">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        </div>
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-extrabold text-foreground md:text-5xl">
              Ready to save your lunch break?
            </h2>
            <p className="mb-10 text-xl text-muted-foreground">
              Join OfficeBite today and discover a better way to lunch.
            </p>
            <Link to="/restaurants">
              <Button variant="hero" size="xl" className="gap-2 shadow-elevated hover:shadow-glow transition-all duration-300">
                Get Started
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
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
