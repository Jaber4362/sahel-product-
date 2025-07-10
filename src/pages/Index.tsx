import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";
import { 
  BarChart3, 
  Package, 
  Tag, 
  ShoppingCart,
  TrendingUp,
  Settings as SettingsIcon,
  Menu,
  X,
  Sun,
  Moon,
  Users,
  FileText,
  Eye
} from "lucide-react";
import Dashboard from "./Dashboard";
import Products from "./Products";
import Categories from "./Categories";
import Reports from "./Reports";
import Settings from "./Settings";

type ActivePage = 'dashboard' | 'products' | 'categories' | 'reports' | 'settings';

const Index = () => {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    {
      id: 'dashboard' as const,
      name: 'لوحة التحكم',
      icon: BarChart3,
      description: 'نظرة عامة والإحصائيات'
    },
    {
      id: 'products' as const,
      name: 'إدارة المنتجات',
      icon: Package,
      description: 'إدارة جميع المنتجات'
    },
    {
      id: 'categories' as const,
      name: 'الفئات',
      icon: Tag,
      description: 'تنظيم فئات المنتجات'
    },
    {
      id: 'reports' as const,
      name: 'التقارير',
      icon: TrendingUp,
      description: 'تقارير المبيعات والإحصائيات'
    },
    {
      id: 'settings' as const,
      name: 'الإعدادات',
      icon: SettingsIcon,
      description: 'إعدادات النظام والحساب'
    }
  ];

  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Listen to custom events from Dashboard
  useEffect(() => {
    const handleNavigateToProducts = (event: CustomEvent) => {
      setActivePage('products');
      // If specific action needed, handle it here
    };

    window.addEventListener('navigateToProducts', handleNavigateToProducts as EventListener);
    return () => {
      window.removeEventListener('navigateToProducts', handleNavigateToProducts as EventListener);
    };
  }, []);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-product':
        setActivePage('products');
        break;
      case 'view-all':
        setActivePage('products');
        break;
      case 'reports':
        setActivePage('reports');
        break;
      case 'settings':
        setActivePage('settings');
        break;
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'categories':
        return <Categories />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="bg-gradient-primary shadow-large sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div className="text-white">
                <h1 className="font-bold text-lg">نظام إدارة المنتجات</h1>
                <p className="text-xs opacity-80">الإدارة الذكية للمنتجات</p>
              </div>
            </div>

            {/* Desktop Navigation & Theme Toggle */}
            <div className="hidden md:flex items-center space-x-4 space-x-reverse">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => setActivePage(item.id)}
                    className={`text-white hover:bg-white/20 transition-all duration-200 animate-slide-up ${
                      activePage === item.id 
                        ? 'bg-white/20 shadow-glow animate-pulse-soft' 
                        : ''
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                );
              })}
              
              {/* Theme Toggle Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-white hover:bg-white/20 glass-effect animate-bounce-gentle"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-white hover:bg-white/20 glass-effect"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="grid gap-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      onClick={() => {
                        setActivePage(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full justify-start text-white hover:bg-white/20 ${
                        activePage === item.id ? 'bg-white/20' : ''
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      <div className="text-right">
                        <div>{item.name}</div>
                        <div className="text-xs opacity-70">{item.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Quick Navigation Cards (Mobile) */}
      <div className="md:hidden container mx-auto p-4">
        <div className="grid grid-cols-1 gap-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Card 
                key={item.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-medium ${
                  activePage === item.id 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'bg-gradient-card'
                }`}
                onClick={() => setActivePage(item.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      activePage === item.id 
                        ? 'bg-primary text-white' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Page Content */}
      <main className="relative">
        {renderPage()}
      </main>

      {/* Footer نظيف مع حقوق الطبع والنشر */}
      <footer className="bg-card border-t mt-12">
        <div className="container mx-auto p-6">
          <div className="text-center">
            <p className="font-semibold text-foreground">نظام إدارة المنتجات</p>
            <p className="text-sm text-muted-foreground">حلول متطورة لإدارة المنتجات والمخزون</p>
            
            {/* حقوق الطبع والنشر */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm font-medium text-foreground">
                جميع حقوق الطبع والنشر محفوظة لدى محمد جابر
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                تم تطويره بعناية فائقة © {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
